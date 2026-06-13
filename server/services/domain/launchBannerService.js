/**
 * Launch Banner Service
 * Handles launch banner business logic
 */

import LaunchBanner from '../../models/LaunchBanner.js';
import { ValidationError } from '../../utils/errors.js';

const getActiveBanner = async () => {
  let banner = await LaunchBanner.findOne().sort({ createdAt: -1 });

  // Create default banner if none exists
  if (!banner) {
    const endsAt = new Date(Date.now() + 72 * 3_600_000);
    banner = new LaunchBanner({
      isActive: true,
      message: 'Soft Launch — Placement Accelerator at launch price',
      originalPrice: 6999,
      discountedPrice: 2100,
      ctaText: 'Claim Offer',
      ctaLink: '/placement-prep#pricing',
      countdownHours: 72,
      countdownEndsAt: endsAt,
      showCountdown: false,
      badgeText: 'Soft Launch',
      savePercentage: 70,
    });
    await banner.save();
    return banner;
  }

  // Auto-deactivate when countdown has expired
  if (banner.isActive && banner.showCountdown && banner.countdownEndsAt && banner.countdownEndsAt <= new Date()) {
    banner.isActive = false;
    await banner.save();
  }

  return banner;
};

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
    resetCountdown,
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
    if (banner.showCountdown && banner.countdownHours) {
      banner.countdownEndsAt = new Date(Date.now() + banner.countdownHours * 3_600_000);
    }
  } else {
    if (isActive !== undefined) banner.isActive = isActive;
    if (message) banner.message = message;
    if (originalPrice !== undefined) banner.originalPrice = originalPrice;
    if (discountedPrice !== undefined) banner.discountedPrice = discountedPrice;
    if (ctaText) banner.ctaText = ctaText;
    if (ctaLink) banner.ctaLink = ctaLink;
    if (showCountdown !== undefined) banner.showCountdown = showCountdown;
    if (badgeText) banner.badgeText = badgeText;
    if (savePercentage !== undefined) banner.savePercentage = savePercentage;
    if (backgroundColor) banner.backgroundColor = backgroundColor;
    if (textColor) banner.textColor = textColor;
    if (accentColor) banner.accentColor = accentColor;

    // Reset the global deadline whenever countdownHours changes or resetCountdown is explicitly requested
    if (countdownHours !== undefined) {
      banner.countdownHours = countdownHours;
      if (banner.showCountdown) {
        banner.countdownEndsAt = new Date(Date.now() + countdownHours * 3_600_000);
      }
    } else if (resetCountdown) {
      banner.countdownEndsAt = new Date(Date.now() + banner.countdownHours * 3_600_000);
    }
  }

  await banner.save();
  return banner;
};

const toggleBannerStatus = async () => {
  const banner = await getActiveBanner();
  banner.isActive = !banner.isActive;

  // When re-activating, reset the countdown deadline so it starts fresh
  if (banner.isActive && banner.showCountdown) {
    banner.countdownEndsAt = new Date(Date.now() + banner.countdownHours * 3_600_000);
  }

  await banner.save();
  return banner;
};

export { getActiveBanner, updateBanner, toggleBannerStatus };
export default { getActiveBanner, updateBanner, toggleBannerStatus };