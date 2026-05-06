import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PricingSection from '../models/PricingSection.js';

dotenv.config();

async function seedGDPlans() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
        console.log(`⏭ Plan ${plan.id} already exists, skipping`);
        continue;
      }
      pricingSection.services.push(plan);
      console.log(`✅ Added plan ${plan.id}`);
    }

    await pricingSection.save();
    console.log('\n✅ GD plans seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding GD plans:', err);
    process.exit(1);
  }
}

seedGDPlans();
