/**
 * Launch Banner Service
 * Handles launch banner business logic
 */

import LaunchBanner from '../../models/LaunchBanner.js';
import {  ValidationError, NotFoundError  } from '../../utils/errors.js';

/**
 * Get active banner configuration
 */
const getActiveBanner = async () => {
  let banner = await LaunchBanner.findOne().sort({ createdAt: -1 });

  // Create default banner if none exists
  if (!banner) {
    banner = new LaunchBanner({
      isActive: true,
      message: 'Grand Launch: All sessions',
      originalPrice: 999,
      discountedPrice: 9,
      ctaText: 'Claim Now',
      ctaLink: '/signup',
      countdownHours: 48,
      showCountdown: true,
      badgeText: 'Launch Offer',
      savePercentage: 99,
    });
    await banner.save();
  }

  return banner;
};

/**
 * Update banner configuration
 */
const updateBanner = async (bannerData) => {
  const {
    isActive,
    message,
    originalPrice,
    discountedPrice,
    ctaText,
    ctaLink,
    countdownHours,
    showCountdown,
    badgeText,
    savePercentage,
    backgroundColor,
    textColor,
    accentColor,
  } = bannerData;

  // Validate prices
  if (discountedPrice && originalPrice && discountedPrice >= originalPrice) {
    throw new ValidationError('Discounted price must be less than original price');
  }

  // Validate countdown hours
  if (countdownHours && (countdownHours < 1 || countdownHours > 168)) {
    throw new ValidationError('Countdown hours must be between 1 and 168 (7 days)');
  }

  let banner = await LaunchBanner.findOne().sort({ createdAt: -1 });

  if (!banner) {
    banner = new LaunchBanner(bannerData);
  } else {
    // Update fields
    if (isActive !== undefined) banner.isActive = isActive;
    if (message) banner.message = message;
    if (originalPrice !== undefined) banner.originalPrice = originalPrice;
    if (discountedPrice !== undefined) banner.discountedPrice = discountedPrice;
    if (ctaText) banner.ctaText = ctaText;
    if (ctaLink) banner.ctaLink = ctaLink;
    if (countdownHours !== undefined) banner.countdownHours = countdownHours;
    if (showCountdown !== undefined) banner.showCountdown = showCountdown;
    if (badgeText) banner.badgeText = badgeText;
    if (savePercentage !== undefined) banner.savePercentage = savePercentage;
    if (backgroundColor) banner.backgroundColor = backgroundColor;
    if (textColor) banner.textColor = textColor;
    if (accentColor) banner.accentColor = accentColor;
  }

  await banner.save();
  return banner;
};

/**
 * Toggle banner active status
 */
const toggleBannerStatus = async () => {
  const banner = await getActiveBanner();
  banner.isActive = !banner.isActive;
  await banner.save();
  return banner;
};

export {
  getActiveBanner,
  updateBanner,
  toggleBannerStatus,
};
export default {
  getActiveBanner,
  updateBanner,
  toggleBannerStatus,
};
