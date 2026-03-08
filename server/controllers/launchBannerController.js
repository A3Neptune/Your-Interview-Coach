import launchBannerService from '../services/domain/launchBannerService.js';
import { handleControllerError } from '../utils/errorHandler.js';
import { formatSuccess } from '../utils/response.js';

/**
 * Get active banner configuration (public)
 */
export const getActiveBanner = async (req, res) => {
  try {
    const banner = await launchBannerService.getActiveBanner();
    res.json(formatSuccess('Banner retrieved successfully', banner));
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Update banner configuration (admin only)
 */
export const updateBanner = async (req, res) => {
  try {
    const banner = await launchBannerService.updateBanner(req.body);
    res.json(formatSuccess('Banner updated successfully', banner));
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Toggle banner active status (admin only)
 */
export const toggleBannerStatus = async (req, res) => {
  try {
    const banner = await launchBannerService.toggleBannerStatus();
    res.json(formatSuccess('Banner status toggled successfully', banner));
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getActiveBanner,
  updateBanner,
  toggleBannerStatus,
};
