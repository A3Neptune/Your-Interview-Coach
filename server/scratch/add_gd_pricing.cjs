
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not found in environment');
  process.exit(1);
}

const gdServices = [
  {
    id: "gd-starter",
    name: "GD Starter (4 Members)",
    title: "Small Group Discussion",
    price: 796,
    duration: "60 min",
    points: ["4 Participants", "Expert Feedback", "WhatsApp Support", "1 Session"],
    level: "Starter",
    support: "WhatsApp",
    access: "Single",
    category: "GD"
  },
  {
    id: "gd-popular",
    name: "GD Popular (6 Members)",
    title: "Realistic Simulation",
    price: 1014,
    duration: "60 min",
    points: ["6 Participants", "Peer Review", "Performance Report", "1 Session"],
    level: "Popular",
    support: "WhatsApp",
    access: "Single",
    category: "GD"
  },
  {
    id: "gd-value",
    name: "GD Value (10 Members)",
    title: "Large Team Practice",
    price: 990,
    duration: "60 min",
    points: ["10 Participants", "Live Moderation", "Group Dynamics", "Best Value"],
    level: "Value",
    support: "WhatsApp",
    access: "Single",
    category: "GD"
  }
];

async function addGDToPricing() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const PricingSection = mongoose.connection.db.collection('pricingsections');
    const section = await PricingSection.findOne({});

    if (!section) {
      console.error('No pricing section found in DB');
      return;
    }

    let updatedServices = section.services || [];
    
    // Remove any existing GD services to avoid duplicates
    updatedServices = updatedServices.filter(s => !s.id.startsWith('gd-'));

    // Add new GD services
    updatedServices.push(...gdServices);

    await PricingSection.updateOne(
      { _id: section._id },
      { $set: { services: updatedServices } }
    );

    console.log('Successfully added GD services to Pricing Section');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addGDToPricing();
