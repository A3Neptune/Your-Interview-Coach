/**
 * Pricing Controller
 * Handles HTTP requests for pricing section
 */

import pricingService from '../services/domain/pricingService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';
import {  formatSuccess  } from '../utils/response.js';

/**
 * Get global pricing section (public)
 * GET /api/pricing-section/public
 */
export const getPublicPricingSection = async (req, res) => {
  try {
    console.log('📡 Fetching pricing section...');
    const pricingSection = await pricingService.getPricingSection();
    console.log('✅ Found pricing section');
    res.json(pricingSection);
  } catch (error) {
    console.error('Error fetching pricing section:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get pricing section for admin
 * GET /api/pricing-section/admin
 */
export const getAdminPricingSection = async (req, res) => {
  try {
    const pricingSection = await pricingService.getAdminPricingSection();
    res.json(pricingSection);
  } catch (error) {
    console.error('Error fetching admin pricing section:', error);
    handleControllerError(res, error);
  }
};

/**
 * Update pricing header
 * PUT /api/pricing-section/admin/header
 */
export const updateHeader = async (req, res) => {
  try {
    const headerData = req.body;
    const pricingSection = await pricingService.updateHeader(headerData);
    res.json(pricingSection);
  } catch (error) {
    console.error('Error updating header:', error);
    handleControllerError(res, error);
  }
};

/**
 * Add new service
 * POST /api/pricing-section/admin/services
 */
export const addService = async (req, res) => {
  try {
    const serviceData = req.body;
    const pricingSection = await pricingService.addService(serviceData);
    res.json(pricingSection);
  } catch (error) {
    console.error('Error adding service:', error);
    handleControllerError(res, error);
  }
};

/**
 * Update service
 * PUT /api/pricing-section/admin/services/:serviceId
 */
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const serviceData = req.body;
    const pricingSection = await pricingService.updateService(serviceId, serviceData);
    res.json(pricingSection);
  } catch (error) {
    console.error('Error updating service:', error);
    handleControllerError(res, error);
  }
};

/**
 * Delete service
 * DELETE /api/pricing-section/admin/services/:serviceId
 */
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const pricingSection = await pricingService.deleteService(serviceId);
    res.json(pricingSection);
  } catch (error) {
    console.error('Error deleting service:', error);
    handleControllerError(res, error);
  }
};

/**
 * Update stats
 * PUT /api/pricing-section/admin/stats
 */
export const updateStats = async (req, res) => {
  try {
    const { stats } = req.body;
    const pricingSection = await pricingService.updateStats(stats);
    res.json(pricingSection);
  } catch (error) {
    console.error('Error updating stats:', error);
    handleControllerError(res, error);
  }
};

/**
 * Update settings
 * PUT /api/pricing-section/admin/settings
 */
export const updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    const pricingSection = await pricingService.updateSettings(settings);
    res.json(pricingSection);
  } catch (error) {
    console.error('Error updating settings:', error);
    handleControllerError(res, error);
  }
};

/**
 * Update service discount
 * PUT /api/pricing-section/admin/services/:serviceId/discount
 */
export const updateServiceDiscount = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const discountData = req.body;
    const pricingSection = await pricingService.updateServiceDiscount(serviceId, discountData);
    res.json(pricingSection);
  } catch (error) {
    console.error('Error updating service discount:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get service by ID with calculated discount
 * GET /api/pricing-section/public/:serviceId
 */
export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await pricingService.getServiceById(serviceId);
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    handleControllerError(res, error);
  }
};

export default {
  getPublicPricingSection,
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
