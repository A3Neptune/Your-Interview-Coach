const fs = require('fs');
const path = require('path');

// ──── 1. Update PricingSection model ────
const modelPath = path.join(__dirname, '..', 'models', 'PricingSection.js');
let modelContent = fs.readFileSync(modelPath, 'utf8');

// Add memberCount and pricePerMember after the 'access' field
const accessField = `        access: {
          type: String,
          default: 'Multiple',
        },`;

const newFields = `        access: {
          type: String,
          default: 'Multiple',
        },
        // GD-specific optional fields
        memberCount: {
          type: Number,
          default: null,
        },
        pricePerMember: {
          type: Number,
          default: null,
        },`;

if (!modelContent.includes('memberCount')) {
  modelContent = modelContent.replace(accessField, newFields);
  fs.writeFileSync(modelPath, modelContent, 'utf8');
  console.log('✅ Updated PricingSection model with memberCount & pricePerMember');
} else {
  console.log('⏭ PricingSection model already has memberCount field');
}

// ──── 2. Update gdBookingController.js ────
const controllerPath = path.join(__dirname, '..', 'controllers', 'gdBookingController.js');
let controllerContent = fs.readFileSync(controllerPath, 'utf8');

// Replace the entire file with updated version that reads from DB
const newController = `import GDBooking from '../models/GDBooking.js';
import User from '../models/User.js';
import PricingSection from '../models/PricingSection.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * Get GD plans from PricingSection DB (dynamic pricing)
 * Falls back to hardcoded defaults if none exist in DB.
 */
async function getGDPlansFromDB() {
  const pricingSection = await PricingSection.findOne({ isGlobal: true });
  if (!pricingSection) return {};

  const gdServices = pricingSection.services.filter(s => s.id && s.id.startsWith('gd-'));
  const plans = {};
  for (const svc of gdServices) {
    const memberCount = svc.memberCount || 4;
    const pricePerMember = svc.pricePerMember || Math.round(svc.price / memberCount);

    // Compute discounted total if discount is active
    let totalAmount = svc.price;
    if (svc.discount?.isActive && svc.discount?.type !== 'none') {
      const discountAmt = svc.discount.type === 'percentage'
        ? (svc.price * svc.discount.value) / 100
        : svc.discount.value;
      totalAmount = Math.max(0, Math.round(svc.price - discountAmt));
    }

    plans[svc.id] = {
      memberCount,
      pricePerMember,
      totalAmount,
      basePrice: svc.price,
      name: svc.name,
      title: svc.title,
      value: svc.value || '',
      duration: svc.duration || '60 min',
      points: svc.points || [],
      discount: svc.discount || null,
    };
  }
  return plans;
}

/**
 * Get GD plans (public)
 */
export const getPlans = async (req, res) => {
  try {
    const plansMap = await getGDPlansFromDB();
    const plans = Object.entries(plansMap).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    res.json({ success: true, plans });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Create GD booking + Razorpay order
 */
export const createGDBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planType, members, scheduledDate } = req.body;
    console.log(\`GD Booking Request: planType=\${planType}, membersCount=\${members?.length}\`);

    // Validate plan from DB
    const plans = await getGDPlansFromDB();
    const plan = plans[planType];
    if (!plan) {
      console.log(\`Plan not found: \${planType}\`);
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Validate members count
    if (!Array.isArray(members) || members.length !== plan.memberCount) {
      return res.status(400).json({
        error: \`This plan requires exactly \${plan.memberCount} members\`,
      });
    }

    // Validate each member has name and whatsapp
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.name.trim()) {
        return res
          .status(400)
          .json({ error: \`Member \${i + 1}: Name is required\` });
      }
      if (!m.whatsapp || !m.whatsapp.trim()) {
        return res
          .status(400)
          .json({ error: \`Member \${i + 1}: WhatsApp number is required\` });
      }
      // Basic phone validation (10 digits)
      const cleaned = m.whatsapp.replace(/[\\s\\-\\+]/g, '');
      if (!/^[6-9]\\d{9}$/.test(cleaned)) {
        return res
          .status(400)
          .json({ error: \`Member \${i + 1}: Invalid 10-digit phone number starting with 6-9\` });
      }
    }

    // Validate scheduled date
    if (!scheduledDate) {
      return res.status(400).json({ error: 'Scheduled date is required' });
    }
    const schedDate = new Date(scheduledDate);
    if (schedDate <= new Date()) {
      return res
        .status(400)
        .json({ error: 'Scheduled date must be in the future' });
    }

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: plan.totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: \`gd_\${Date.now()}\`,
      notes: {
        planType,
        memberCount: plan.memberCount,
        userId,
      },
    });

    // Create GD booking record
    const gdBooking = new GDBooking({
      userId,
      planType,
      memberCount: plan.memberCount,
      pricePerMember: plan.pricePerMember,
      totalAmount: plan.totalAmount,
      members: members.map((m) => ({
        name: m.name.trim(),
        whatsapp: m.whatsapp.trim(),
      })),
      scheduledDate: schedDate,
      razorpayOrderId: order.id,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await gdBooking.save();

    res.json({
      success: true,
      booking: gdBooking,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Verify GD payment
 */
export const verifyGDPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update booking to failed
      await GDBooking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'failed',
      });
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update booking
    const gdBooking = await GDBooking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        status: 'confirmed',
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!gdBooking) {
      return res.status(404).json({ error: 'GD Booking not found' });
    }

    res.json({
      success: true,
      message: 'Payment verified and GD session booked successfully',
      booking: gdBooking,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Get user's GD bookings
 */
export const getUserGDBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await GDBooking.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, bookings });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Get all GD bookings (admin)
 */
export const getAllGDBookings = async (req, res) => {
  try {
    const bookings = await GDBooking.find()
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, bookings });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Update GD booking status (admin)
 */
export const updateGDBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, meetingLink, adminNote } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (meetingLink !== undefined) updates.meetingLink = meetingLink;
    if (adminNote !== undefined) updates.adminNote = adminNote;

    const booking = await GDBooking.findByIdAndUpdate(bookingId, updates, {
      new: true,
    }).populate('userId', 'name email mobile');

    if (!booking) {
      return res.status(404).json({ error: 'GD Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getPlans,
  createGDBooking,
  verifyGDPayment,
  getUserGDBookings,
  getAllGDBookings,
  updateGDBookingStatus,
};
`;

fs.writeFileSync(controllerPath, newController, 'utf8');
console.log('✅ Updated gdBookingController.js to use dynamic pricing from DB');

// ──── 3. Create seed script for GD plans ────
const seedPath = path.join(__dirname, '..', 'scripts', 'seedGDPlans.js');
const seedScript = `import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PricingSection from '../models/PricingSection.js';

dotenv.config();

async function seedGDPlans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const pricingSection = await PricingSection.findOne({ isGlobal: true });
    if (!pricingSection) {
      console.log('❌ No PricingSection document found. Create one first.');
      process.exit(1);
    }

    const gdPlans = [
      {
        id: 'gd-starter',
        name: 'GD Team Practice - 4 Members',
        price: 796,
        duration: '60 min',
        title: 'GD Team Practice',
        value: 'Bring your own 4-member team for a focused moderated GD session.',
        points: ['You bring all 4 teammates', 'Team details required', 'Expert moderation', '1 Session'],
        level: 'Bring Your Team',
        support: 'Moderated',
        access: 'Single',
        memberCount: 4,
        pricePerMember: 199,
      },
      {
        id: 'gd-popular',
        name: 'GD Team Practice - 6 Members',
        price: 1014,
        duration: '60 min',
        title: 'GD Team Practice',
        value: 'Bring your own 6-member team for a realistic moderated group discussion round.',
        points: ['You bring all 6 teammates', 'Team details required', 'Performance feedback', '1 Session'],
        level: 'Bring Your Team',
        support: 'Moderated',
        access: 'Single',
        memberCount: 6,
        pricePerMember: 169,
      },
      {
        id: 'gd-value',
        name: 'GD Team Practice - 10 Members',
        price: 990,
        duration: '60 min',
        title: 'GD Team Practice',
        value: 'Bring your own 10-member team for a full-size GD simulation with live moderation.',
        points: ['You bring all 10 teammates', 'Team details required', 'Full GD simulation', 'Best Team Value'],
        level: 'Bring Your Team',
        support: 'Moderated',
        access: 'Single',
        memberCount: 10,
        pricePerMember: 99,
      },
    ];

    for (const plan of gdPlans) {
      const exists = pricingSection.services.find(s => s.id === plan.id);
      if (exists) {
        console.log(\`⏭ Plan \${plan.id} already exists, skipping\`);
        continue;
      }
      pricingSection.services.push(plan);
      console.log(\`✅ Added plan \${plan.id}\`);
    }

    await pricingSection.save();
    console.log('\\n✅ GD plans seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding GD plans:', err);
    process.exit(1);
  }
}

seedGDPlans();
`;

fs.writeFileSync(seedPath, seedScript, 'utf8');
console.log('✅ Created scripts/seedGDPlans.js');

console.log('\\n🎉 Backend updates complete!');
