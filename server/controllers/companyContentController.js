import companyContentService from '../services/domain/companyContentService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';
import {  clearRouteCache  } from '../middleware/cacheMiddleware.js';

export const getAllCompanies = async (req, res) => {
  try {
    const result = await companyContentService.getAllCompanies(req.query);
    res.json(result);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    let userId = null;

    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        userId = null;
      }
    }

    const result = await companyContentService.getCompanyById(req.params.id, userId);
    res.json(result);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getAllIndustries = async (req, res) => {
  try {
    const industries = await companyContentService.getAllIndustries();
    res.json({ industries });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getPurchaseStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;

    const result = await companyContentService.getPurchaseStatus(userId, companyId);
    res.json(result);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await companyContentService.getUserPurchases(userId);
    res.json({ purchases });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;

    const result = await companyContentService.createPaymentOrder(userId, companyId);
    res.json(result);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const purchase = await companyContentService.verifyPayment(
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      clearRouteCache
    );

    res.json({ message: 'Payment verified successfully', purchase });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createCompanyContent = async (req, res) => {
  try {
    const company = await companyContentService.createCompanyContent(req.body);
    res.status(201).json({ company });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateCompanyContent = async (req, res) => {
  try {
    const companyId = req.params.id;
    const updates = req.body;

    const company = await companyContentService.updateCompanyContent(companyId, updates, clearRouteCache);
    res.json({ company });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteCompanyContent = async (req, res) => {
  try {
    const companyId = req.params.id;

    await companyContentService.deleteCompanyContent(companyId);
    res.json({ message: 'Company content deleted successfully' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getAllCompaniesAdmin = async (req, res) => {
  try {
    const companies = await companyContentService.getAllCompaniesAdmin();
    res.json({ companies });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getAllCompanies,
  getCompanyById,
  getAllIndustries,
  getPurchaseStatus,
  getUserPurchases,
  createPaymentOrder,
  verifyPayment,
  createCompanyContent,
  updateCompanyContent,
  deleteCompanyContent,
  getAllCompaniesAdmin,
};
