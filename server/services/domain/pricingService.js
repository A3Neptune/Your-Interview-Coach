/**
 * Pricing Service
 * Handles all pricing section business logic
 */

import PricingSection from '../../models/PricingSection.js';
import {  ValidationError, NotFoundError  } from '../../utils/errors.js';
import {  calculateDiscountedPrice  } from './discountService.js';

// Default services configuration
const DEFAULT_SERVICES = [
  {
    id: 'oneMentorship',
    name: '1:1 Mentorship',
    price: 2000,
    duration: '60 mins',
    title: 'Dedicated Mentorship',
    value: 'Personalized guidance from industry leaders',
    points: ['1-on-1 sessions', 'Custom career path', 'Unlimited support', 'Progress monitoring'],
    level: 'Premium',
    support: '24/7',
    access: 'Unlimited',
  },
  {
    id: 'webinars',
    name: 'Live Webinars',
    price: 1500,
    duration: '90 mins',
    title: 'Group Learning',
    value: 'Learn from experts in real-time',
    points: ['Live sessions', 'Expert Q&A', 'Networking', 'Recordings included'],
    level: 'Standard',
    support: 'Business',
    access: '4',
  },
  {
    id: 'resumeAnalysis',
    name: 'Resume Analysis',
    price: 1000,
    duration: '45 mins',
    title: 'Career Enhancement',
    value: 'Optimize your professional profile',
    points: ['Full review', 'ATS optimization', 'Tips & tricks', 'Quick turnaround'],
    level: 'Quick',
    support: 'Email',
    access: 'Single',
  },
  {
    id: 'gd-starter',
    name: 'GD Starter (4 Members)',
    price: 796,
    duration: '60 min',
    title: 'Small Group Discussion',
    value: 'Perfect for focused discussions with your core team.',
    points: ['4 Participants', 'Expert Feedback', 'WhatsApp Support', '1 Session'],
    level: 'Starter',
    support: 'WhatsApp',
    access: 'Single',
  },
  {
    id: 'gd-popular',
    name: 'GD Popular (6 Members)',
    price: 1014,
    duration: '60 min',
    title: 'Realistic Simulation',
    value: 'Our most popular choice for realistic group simulations.',
    points: ['6 Participants', 'Peer Review', 'Performance Report', '1 Session'],
    level: 'Popular',
    support: 'WhatsApp',
    access: 'Single',
  },
  {
    id: 'gd-value',
    name: 'GD Value (10 Members)',
    price: 990,
    duration: '60 min',
    title: 'Large Team Practice',
    value: 'Maximum value for large teams practicing together.',
    points: ['10 Participants', 'Live Moderation', 'Group Dynamics', 'Best Value'],
    level: 'Value',
    support: 'WhatsApp',
    access: 'Single',
  },
  {
    id: 'placementAccelerator',
    name: 'Placement Accelerator',
    price: 4999,
    duration: '300 mins',
    title: 'Complete Placement Programme',
    value: '4-module intensive coaching: resume to mock interview',
    points: [
      'Resume Analysis & Positioning',
      'Group Discussion Mastery',
      'Interview Preparation – Core',
      'Mock Interview + Feedback',
      '1:1 Personalised Feedback',
    ],
    level: 'Intensive',
    support: 'WhatsApp',
    access: 'Single',
  },
];

/**
 * Get or create global pricing section
 */
const getPricingSection = async () => {
  let pricingSection = await PricingSection.findOne({ isGlobal: true });

  if (!pricingSection) {
    pricingSection = await PricingSection.findOneAndUpdate(
      { isGlobal: true },
      {
        $setOnInsert: {
          isGlobal: true,
          header: {
            badge: 'Services',
            title: 'Transform Your Career',
            subtitle: 'Explore our curated services designed for your success',
          },
          services: DEFAULT_SERVICES,
          stats: [
            { stat: '5000+', desc: 'Careers Transformed' },
            // { stat: '4.4/5', desc: 'Average Rating' },
            { stat: '94%', desc: 'Success Rate' },
          ],
        },
      },
      { new: true, upsert: true }
    );
  } else {
    // Migrate service data if needed
    pricingSection = await migrateServiceData(pricingSection);
  }

  return pricingSection;
};

/**
 * Migrate old service IDs and fill missing data
 */
const migrateServiceData = async (pricingSection) => {
  let needsUpdate = false;

  const serviceDataMap = {};
  DEFAULT_SERVICES.forEach(svc => {
    serviceDataMap[svc.id] = svc;
  });

  // Robustly ensure tiered GD plans exist and old one is gone
  const currentIds = pricingSection.services.map(s => s.id);
  const gdTierIds = ['gd-starter', 'gd-popular', 'gd-value'];

  gdTierIds.forEach(id => {
    if (!currentIds.includes(id)) {
      const plan = DEFAULT_SERVICES.find(s => s.id === id);
      if (plan) {
        pricingSection.services.push(plan);
        needsUpdate = true;
      }
    }
  });

  // Ensure placementAccelerator exists
  if (!currentIds.includes('placementAccelerator')) {
    const plan = DEFAULT_SERVICES.find(s => s.id === 'placementAccelerator');
    if (plan) {
      pricingSection.services.push(plan);
      needsUpdate = true;
    }
  }

  // Remove legacy ID if present
  if (currentIds.includes('gdGroupDiscussions')) {
    pricingSection.services = pricingSection.services.filter(s => s.id !== 'gdGroupDiscussions');
    needsUpdate = true;
  }

  pricingSection.services = pricingSection.services.map((service) => {
    const serviceNameLower = service.name.toLowerCase();
    let standardId = service.id;
    let standardizedService = { ...service._doc || service };

    // Map old IDs to standardized ones
    if (serviceNameLower.includes('1:1') || serviceNameLower.includes('mentorship')) {
      if (service.id !== 'oneMentorship') {
        standardId = 'oneMentorship';
        needsUpdate = true;
      }
    } else if (serviceNameLower.includes('webinar')) {
      if (service.id !== 'webinars') {
        standardId = 'webinars';
        needsUpdate = true;
      }
    } else if (serviceNameLower.includes('resume') || serviceNameLower.includes('cv')) {
      if (service.id !== 'resumeAnalysis') {
        standardId = 'resumeAnalysis';
        needsUpdate = true;
      }
    }

    // Fill missing fields from defaults
    const defaultData = serviceDataMap[standardId];
    if (defaultData) {
      const fieldsToFill = ['duration', 'title', 'value', 'level', 'support', 'access'];
      fieldsToFill.forEach(field => {
        if (!standardizedService[field] || standardizedService[field] === '') {
          standardizedService[field] = defaultData[field];
          needsUpdate = true;
        }
      });

      if (!standardizedService.points || standardizedService.points.length === 0) {
        standardizedService.points = defaultData.points;
        needsUpdate = true;
      }
    }

    return { ...standardizedService, id: standardId };
  });

  if (needsUpdate) {
    await pricingSection.save();
    console.log('✅ Migrated service data');
  }

  return pricingSection;
};

/**
 * Get pricing section for admin
 */
const getAdminPricingSection = async () => {
  let pricingSection = await PricingSection.findOne({ isGlobal: true });

  if (!pricingSection) {
    pricingSection = new PricingSection({ isGlobal: true });
    await pricingSection.save();
  }

  return pricingSection;
};

/**
 * Update pricing header
 */
const updateHeader = async (headerData) => {
  const { badge, title, subtitle } = headerData;

  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true },
    {
      $set: {
        'header.badge': badge,
        'header.title': title,
        'header.subtitle': subtitle,
      },
    },
    { new: true }
  );

  if (!pricingSection) {
    throw new NotFoundError('Pricing section not found');
  }

  return pricingSection;
};

/**
 * Add new service
 */
const addService = async (serviceData) => {
  const { name, price, duration, title, value, points, level, support, access, id } = serviceData;

  if (!name || !price || !duration || !title) {
    throw new ValidationError('Missing required fields: name, price, duration, and title');
  }

  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true },
    { $push: { services: serviceData } },
    { new: true, upsert: true }
  );

  return pricingSection;
};

/**
 * Update service
 */
const updateService = async (serviceId, serviceData) => {
  // Only update non-discount fields — discount has its own endpoint
  const { discount: _omit, ...fields } = serviceData;
  const setPayload = {};
  const allowed = ['name', 'price', 'duration', 'title', 'value', 'points', 'level', 'support', 'access'];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setPayload[`services.$.${key}`] = fields[key];
    }
  }

  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true, 'services.id': serviceId },
    { $set: setPayload },
    { new: true }
  );

  if (!pricingSection) {
    throw new NotFoundError('Service not found');
  }

  return pricingSection;
};

/**
 * Delete service
 */
const deleteService = async (serviceId) => {
  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true },
    { $pull: { services: { id: serviceId } } },
    { new: true }
  );

  if (!pricingSection) {
    throw new NotFoundError('Service not found');
  }

  return pricingSection;
};

/**
 * Update stats
 */
const updateStats = async (stats) => {
  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true },
    { $set: { stats } },
    { new: true }
  );

  if (!pricingSection) {
    throw new NotFoundError('Pricing section not found');
  }

  return pricingSection;
};

/**
 * Update settings
 */
const updateSettings = async (settings) => {
  const { ctaButtonText, autoPlayInterval, showGridView, showStats } = settings;

  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true },
    {
      $set: {
        ctaButtonText,
        autoPlayInterval,
        showGridView,
        showStats,
      },
    },
    { new: true }
  );

  if (!pricingSection) {
    throw new NotFoundError('Pricing section not found');
  }

  return pricingSection;
};

/**
 * Update service discount
 */
const updateServiceDiscount = async (serviceId, discountData) => {
  const { type, value, isActive } = discountData;

  // Get service to validate discount
  const pricingSectionData = await PricingSection.findOne({ isGlobal: true });
  if (!pricingSectionData) {
    throw new NotFoundError('Pricing section not found');
  }

  const service = pricingSectionData.services.find((s) => s.id === serviceId);
  if (!service) {
    throw new NotFoundError('Service not found');
  }

  // Validate discount using discountService
  const { default: discountService } = await import('./discountService.js');
  discountService.validateDiscount(type, value, service.price);

  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true, 'services.id': serviceId },
    {
      $set: {
        'services.$.discount.type': type,
        'services.$.discount.value': value,
        'services.$.discount.isActive': isActive,
      },
    },
    { new: true }
  );

  if (!pricingSection) {
    throw new NotFoundError('Service not found');
  }

  return pricingSection;
};

/**
 * Get service by ID with calculated discount
 */
const getServiceById = async (serviceId) => {
  const pricingSection = await getPricingSection();

  if (!pricingSection) {
    throw new NotFoundError('Pricing section not found');
  }

  const service = pricingSection.services.find((s) => s.id === serviceId);

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  // Calculate discounted price
  const discountedPrice = calculateDiscountedPrice(service.price, service.discount);
  const discountAmount = service.price - discountedPrice;

  return {
    ...(service._doc || service),
    originalPrice: service.price,
    discountedPrice,
    discountAmount: Math.round(discountAmount),
  };
};

export {
  getPricingSection,
  getAdminPricingSection,
  updateHeader,
  addService,
  updateService,
  deleteService,
  updateStats,
  updateSettings,
  updateServiceDiscount,
  getServiceById,
};
export default {
  getPricingSection,
  getAdminPricingSection,
  updateHeader,
  addService,
  updateService,
  deleteService,
  updateStats,
  updateSettings,
  updateServiceDiscount,
  getServiceById,
};
