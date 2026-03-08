import CompanyContent from '../../models/CompanyContent.js';
import CompanyContentPurchase from '../../models/CompanyContentPurchase.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import {  ValidationError, NotFoundError, PaymentError  } from '../../utils/errors.js';
import {
  getCache,
  setCache,
  CACHE_KEYS,
  CACHE_TTL,
  invalidateCompanyCache,
  invalidateUserPurchaseCache,
 } from '../../services/redisCache.js';

// Lazy initialization - Razorpay instance created on first use
let razorpayInstance = null;
let razorpayKeySecret = null;

/**
 * Get or create Razorpay instance with lazy initialization
 * This ensures environment variables are loaded before accessing them
 */
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    // Load credentials from environment
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.trim();
    razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    console.log('CompanyContentService Razorpay Config:', {
      keyIdPresent: !!razorpayKeyId,
      keySecretPresent: !!razorpayKeySecret,
    });

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('⚠️ Razorpay credentials missing! Check your .env file');
      throw new PaymentError('Payment gateway not configured. Please check Razorpay credentials.');
    }

    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    console.log('✅ Razorpay initialized for company content');
  }

  return razorpayInstance;
};

/**
 * Filter company content for free preview
 */
const filterForFreePreview = (companyObj) => {
  if (companyObj.softSkills && companyObj.softSkills.sections) {
    let freeCount = 0;
    companyObj.softSkills.sections = companyObj.softSkills.sections.map(section => ({
      ...section,
      questions: section.questions.filter(q => {
        if (freeCount < companyObj.softSkills.freePreviewCount) {
          freeCount++;
          return true;
        }
        return false;
      }).map(q => ({ ...q, answer: '🔒 Unlock full content' })),
      resources: (section.resources || []).filter(r => r.isFree).map(r => {
        if (r.type === 'codingQuestion') {
          return { ...r, solution: '🔒 Unlock full content', hints: [] };
        }
        return r;
      }),
    }));
  }

  if (companyObj.technicalQuestions && companyObj.technicalQuestions.sections) {
    let freeCount = 0;
    companyObj.technicalQuestions.sections = companyObj.technicalQuestions.sections.map(section => ({
      ...section,
      questions: section.questions.filter(q => {
        if (freeCount < companyObj.technicalQuestions.freePreviewCount) {
          freeCount++;
          return true;
        }
        return false;
      }).map(q => ({ ...q, answer: '🔒 Unlock full content' })),
      resources: (section.resources || []).filter(r => r.isFree).map(r => {
        if (r.type === 'codingQuestion') {
          return { ...r, solution: '🔒 Unlock full content', hints: [] };
        }
        return r;
      }),
    }));
  }

  if (companyObj.behavioralQuestions && companyObj.behavioralQuestions.sections) {
    let freeCount = 0;
    companyObj.behavioralQuestions.sections = companyObj.behavioralQuestions.sections.map(section => ({
      ...section,
      questions: section.questions.filter(q => {
        if (freeCount < companyObj.behavioralQuestions.freePreviewCount) {
          freeCount++;
          return true;
        }
        return false;
      }).map(q => ({ ...q, answer: '🔒 Unlock full content' })),
      resources: (section.resources || []).filter(r => r.isFree).map(r => {
        if (r.type === 'codingQuestion') {
          return { ...r, solution: '🔒 Unlock full content', hints: [] };
        }
        return r;
      }),
    }));
  }

  return companyObj;
};

/**
 * Get all companies (public)
 */
const getAllCompanies = async (filters = {}) => {
  const { featured, search, industry } = filters;

  const cacheKey = CACHE_KEYS.companyList(featured === 'true', search, industry);
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const query = { isActive: true };

  if (featured === 'true') {
    query.featured = true;
  }

  if (search) {
    query.companyName = { $regex: search, $options: 'i' };
  }

  if (industry) {
    query.industry = industry;
  }

  const companies = await CompanyContent.find(query)
    .select('-softSkills.sections.questions.answer -technicalQuestions.sections.questions.answer -behavioralQuestions.sections.questions.answer')
    .sort({ featured: -1, enrollmentCount: -1, createdAt: -1 });

  const companiesWithPreview = companies.map(company => filterForFreePreview(company.toObject()));

  const responseData = { companies: companiesWithPreview };

  await setCache(cacheKey, responseData, CACHE_TTL.COMPANY_PUBLIC);

  return responseData;
};

/**
 * Check if user has purchased company content
 */
const checkUserPurchase = async (userId, companyId) => {
  const purchaseCacheKey = CACHE_KEYS.purchaseStatus(userId, companyId);
  const cachedPurchase = await getCache(purchaseCacheKey);

  if (cachedPurchase !== null) {
    return cachedPurchase.hasPurchased;
  }

  const purchase = await CompanyContentPurchase.findOne({
    userId: userId,
    companyContentId: companyId,
    paymentStatus: 'completed',
    accessGranted: true,
  });

  const hasPurchased = !!purchase;

  await setCache(purchaseCacheKey, { hasPurchased }, CACHE_TTL.USER_PURCHASES);

  return hasPurchased;
};

/**
 * Get single company by ID
 */
const getCompanyById = async (companyId, userId = null) => {
  let hasPurchased = false;

  if (userId) {
    hasPurchased = await checkUserPurchase(userId, companyId);
  }

  const cacheKey = CACHE_KEYS.companyDetail(companyId, hasPurchased ? userId : null);
  const cachedCompany = await getCache(cacheKey);

  if (cachedCompany) {
    return cachedCompany;
  }

  const company = await CompanyContent.findOne({
    _id: companyId,
    isActive: true
  });

  if (!company) {
    throw new NotFoundError('Company content not found');
  }

  if (hasPurchased) {
    const responseData = { company: company.toObject(), hasPurchased: true };
    await setCache(cacheKey, responseData, CACHE_TTL.COMPANY_DETAIL);
    return responseData;
  }

  const companyObj = filterForFreePreview(company.toObject());
  const responseData = { company: companyObj, hasPurchased: false };

  await setCache(cacheKey, responseData, CACHE_TTL.COMPANY_PUBLIC);

  return responseData;
};

/**
 * Get all industries
 */
const getAllIndustries = async () => {
  return await CompanyContent.distinct('industry', { isActive: true });
};

/**
 * Check purchase status
 */
const getPurchaseStatus = async (userId, companyId) => {
  const purchase = await CompanyContentPurchase.findOne({
    userId: userId,
    companyContentId: companyId,
    paymentStatus: 'completed',
    accessGranted: true,
  });

  return { hasPurchased: !!purchase, purchase };
};

/**
 * Get user's purchased companies
 */
const getUserPurchases = async (userId) => {
  return await CompanyContentPurchase.find({
    userId: userId,
    paymentStatus: 'completed',
    accessGranted: true,
  }).populate('companyContentId');
};

/**
 * Create payment order
 */
const createPaymentOrder = async (userId, companyId) => {
  const company = await CompanyContent.findById(companyId);

  if (!company) {
    throw new NotFoundError('Company content not found');
  }

  const existingPurchase = await CompanyContentPurchase.findOne({
    userId: userId,
    companyContentId: company._id,
    paymentStatus: 'completed',
  });

  if (existingPurchase) {
    throw new ValidationError('You have already purchased this content');
  }

  let finalPrice = company.price;
  if (company.discount && company.discount.isActive) {
    if (company.discount.type === 'percentage') {
      finalPrice = company.price - (company.price * company.discount.value) / 100;
    } else if (company.discount.type === 'fixed') {
      finalPrice = company.price - company.discount.value;
    }
  }
  finalPrice = Math.max(0, Math.round(finalPrice));

  // Get Razorpay instance (lazy initialization)
  const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: finalPrice * 100,
    currency: 'INR',
    receipt: `company_${company._id}_${Date.now()}`,
    notes: {
      companyContentId: company._id.toString(),
      userId: userId,
      companyName: company.companyName,
    },
  });

  const purchase = new CompanyContentPurchase({
    userId: userId,
    companyContentId: company._id,
    amount: finalPrice,
    paymentId: order.id,
    paymentStatus: 'pending',
  });

  await purchase.save();

  return {
    orderId: order.id,
    amount: finalPrice,
    currency: 'INR',
    companyName: company.companyName,
    purchaseId: purchase._id,
  };
};

/**
 * Verify payment
 */
const verifyPayment = async (userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, clearCacheFn) => {
  // Ensure Razorpay is initialized (this loads the secret)
  getRazorpayInstance();

  if (!razorpayKeySecret) {
    throw new PaymentError('Payment gateway not configured');
  }

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature !== expectedSign) {
    throw new ValidationError('Invalid payment signature');
  }

  const purchase = await CompanyContentPurchase.findOne({
    paymentId: razorpay_order_id,
    userId: userId,
  });

  if (!purchase) {
    throw new NotFoundError('Purchase record not found');
  }

  purchase.paymentStatus = 'completed';
  purchase.accessGranted = true;
  purchase.paymentId = razorpay_payment_id;
  await purchase.save();

  await CompanyContent.findByIdAndUpdate(purchase.companyContentId, {
    $inc: { enrollmentCount: 1 },
  });

  await invalidateUserPurchaseCache(userId, purchase.companyContentId.toString());
  await invalidateCompanyCache(purchase.companyContentId.toString());

  if (clearCacheFn) {
    await clearCacheFn(`/public/${purchase.companyContentId}`);
    await clearCacheFn('/public');
  }

  return purchase;
};

/**
 * Create company content
 */
const createCompanyContent = async (companyData) => {
  const company = new CompanyContent(companyData);
  await company.save();

  await invalidateCompanyCache(company._id.toString());

  return company;
};

/**
 * Update company content
 */
const updateCompanyContent = async (companyId, updates, clearCacheFn) => {
  const company = await CompanyContent.findByIdAndUpdate(
    companyId,
    updates,
    { new: true, runValidators: true }
  );

  if (!company) {
    throw new NotFoundError('Company content not found');
  }

  await invalidateCompanyCache(companyId);

  if (clearCacheFn) {
    await clearCacheFn(`/public/${companyId}`);
    await clearCacheFn('/public');
  }

  return company;
};

/**
 * Delete company content
 */
const deleteCompanyContent = async (companyId) => {
  const company = await CompanyContent.findByIdAndDelete(companyId);

  if (!company) {
    throw new NotFoundError('Company content not found');
  }

  await invalidateCompanyCache(companyId);
};

/**
 * Get all companies (admin)
 */
const getAllCompaniesAdmin = async () => {
  return await CompanyContent.find().sort({ createdAt: -1 });
};

export {
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
