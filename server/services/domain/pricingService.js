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
    id: 'gdGroupDiscussions',
    name: 'GD Sessions',
    price: 1200,
    duration: '60 mins',
    title: 'Skill Building',
    value: 'Master group discussions',
    points: ['Mock sessions', 'Live feedback', 'Peer support', 'Tracking included'],
    level: 'Group',
    support: 'Community',
    access: 'Multiple',
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
            { stat: '3000+', desc: 'Careers Transformed' },
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
    } else if (serviceNameLower.includes('gd') || serviceNameLower.includes('group discussion')) {
      if (service.id !== 'gdGroupDiscussions') {
        standardId = 'gdGroupDiscussions';
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
  const pricingSection = await PricingSection.findOneAndUpdate(
    { isGlobal: true, 'services.id': serviceId },
    { $set: { 'services.$': serviceData } },
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
  const pricingSection = await PricingSection.findOne({ isGlobal: true });

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
