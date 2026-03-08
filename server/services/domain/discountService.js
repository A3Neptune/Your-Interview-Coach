/**
 * Discount Service
 * Handles all discount-related business logic
 */

import {  ValidationError  } from '../../utils/errors.js';

/**
 * Validate discount configuration
 * @param {string} type - Discount type (percentage, fixed, none)
 * @param {number} value - Discount value
 * @param {number} servicePrice - Service price to validate against
 * @returns {Object} Validation result
 */
const validateDiscount = (type, value, servicePrice) => {
  if (type === 'none') {
    return { valid: true };
  }

  if (value < 0) {
    throw new ValidationError('Discount value cannot be negative');
  }

  if (type === 'percentage') {
    if (value > 100) {
      throw new ValidationError('Percentage discount cannot exceed 100%');
    }
  }

  if (type === 'fixed') {
    if (value >= servicePrice) {
      throw new ValidationError(
        `Fixed discount (₹${value}) cannot be equal to or greater than service price (₹${servicePrice})`
      );
    }
  }

  return { valid: true };
};

/**
 * Calculate discounted price
 * @param {number} originalPrice - Original service price
 * @param {Object} discount - Discount configuration
 * @returns {number} Final price after discount
 */
const calculateDiscountedPrice = (originalPrice, discount) => {
  if (!discount || !discount.isActive || discount.type === 'none') {
    return originalPrice;
  }

  let discountAmount = 0;

  if (discount.type === 'percentage') {
    discountAmount = (originalPrice * discount.value) / 100;
  } else if (discount.type === 'fixed') {
    discountAmount = discount.value;
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount);
  return Math.round(finalPrice);
};

/**
 * Apply global discount to multiple services
 * @param {Array} services - Array of services
 * @param {Object} globalDiscount - Global discount config
 * @param {string} mode - Application mode ('replace' or 'skip')
 * @returns {Object} Result with applied and skipped counts
 */
const applyGlobalDiscount = (services, globalDiscount, mode) => {
  let appliedCount = 0;
  let skippedCount = 0;
  const updates = [];

  for (const service of services) {
    // Skip services with existing discounts if mode is 'skip'
    if (mode === 'skip' && service.discount?.isActive && service.discount?.type !== 'none') {
      skippedCount++;
      continue;
    }

    // Validate discount for this service
    if (globalDiscount.type === 'fixed' && globalDiscount.value >= service.price) {
      skippedCount++;
      continue;
    }

    updates.push({
      serviceId: service.id,
      discount: {
        type: globalDiscount.type,
        value: globalDiscount.value,
        isActive: true,
      },
    });
    appliedCount++;
  }

  return {
    appliedCount,
    skippedCount,
    updates,
  };
};

export {
  validateDiscount,
  calculateDiscountedPrice,
  applyGlobalDiscount,
};
export default {
  validateDiscount,
  calculateDiscountedPrice,
  applyGlobalDiscount,
};
