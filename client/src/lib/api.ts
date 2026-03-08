import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // Disable caching for GET requests to ensure fresh data
  if (config.method === 'get') {
    config.headers['Cache-Control'] = 'no-cache';
    config.params = config.params || {};
    config.params._t = Date.now();
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Don't redirect if already on login or signup pages
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Google login
  googleLogin: (token: string) =>
    apiClient.post('/auth/google-login', { token }),

  // Email login
  emailLogin: (email: string, password: string) =>
    apiClient.post('/auth/email-login', { email, password }),

  // Signup
  signup: (data: {
    email: string;
    name: string;
    mobile: string;
    userType: 'student' | 'professional';
    yearOfStudy?: number;
    skills?: string[];
    company?: string;
    designation?: string;
    yearsOfExperience?: number;
  }) => apiClient.post('/auth/signup', data),

  // Get current user
  getCurrentUser: () => apiClient.get('/auth/me'),

  // Update profile
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),

  // Verify token
  verifyToken: () => apiClient.post('/auth/verify'),

  // Logout
  logout: () => apiClient.post('/auth/logout'),

  // Forgot password
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  // Verify reset token
  verifyResetToken: (token: string, email: string) =>
    apiClient.post('/auth/verify-reset-token', { token, email }),

  // Reset password
  resetPassword: (token: string, email: string, password: string, confirmPassword: string) =>
    apiClient.post('/auth/reset-password', { token, email, password, confirmPassword }),

  // Update mentor settings
  updateMentorSettings: (data: any) =>
    apiClient.put('/auth/update-mentor-settings', data),
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Content API
export const contentAPI = {
  // Get free courses
  getFreeCourses: () => apiClient.get('/content/courses/free'),

  // Get user's enrolled courses
  getEnrolledCourses: () => apiClient.get('/content/courses/enrolled'),

  // Get course with content
  getCourse: (courseId: string) => apiClient.get(`/content/courses/${courseId}`),

  // Get content details
  getContent: (contentId: string) => apiClient.get(`/content/content/${contentId}`),

  // Create course (mentor)
  createCourse: (data: any) => apiClient.post('/content/courses', data),

  // Update course (mentor)
  updateCourse: (courseId: string, data: any) => apiClient.put(`/content/courses/${courseId}`, data),

  // Delete course (mentor)
  deleteCourse: (courseId: string) => apiClient.delete(`/content/courses/${courseId}`),

  // Add content to course (mentor)
  addContent: (courseId: string, data: any) => apiClient.post(`/content/courses/${courseId}/content`, data),

  // Update content (mentor)
  updateContent: (contentId: string, data: any) => apiClient.put(`/content/content/${contentId}`, data),

  // Delete content (mentor)
  deleteContent: (contentId: string) => apiClient.delete(`/content/content/${contentId}`),
};

// Booking API
export const bookingAPI = {
  // Get available mentors
  getMentors: () => apiClient.get('/bookings/mentors'),

  // Get mentor availability
  getMentorAvailability: (mentorId: string) => apiClient.get(`/bookings/mentors/${mentorId}/availability`),

  // Create booking
  createBooking: (data: any) => apiClient.post('/bookings', data),

  // Get student bookings
  getStudentBookings: () => apiClient.get('/bookings/student'),

  // Get booking details
  getBooking: (bookingId: string) => apiClient.get(`/bookings/${bookingId}`),

  // Cancel booking (student)
  cancelBooking: (bookingId: string) => apiClient.put(`/bookings/${bookingId}/cancel`, {}),

  // Get mentor bookings
  getMentorBookings: () => apiClient.get('/bookings/mentor'),

  // Update booking status (mentor)
  updateBookingStatus: (bookingId: string, data: any) =>
    apiClient.put(`/bookings/${bookingId}/status`, data),

  // Add feedback to booking (mentor)
  addFeedback: (bookingId: string, data: any) =>
    apiClient.put(`/bookings/${bookingId}/feedback`, data),
};

// Payment API
export const paymentAPI = {
  // Create payment order
  createOrder: (data: any) => apiClient.post('/payments/create-order', data),

  // Verify payment
  verifyPayment: (data: any) => apiClient.post('/payments/verify-payment', data),

  // Get payment history
  getPaymentHistory: () => apiClient.get('/payments/history'),

  // Get payment details
  getPayment: (paymentId: string) => apiClient.get(`/payments/${paymentId}`),

  // Get invoice
  getInvoice: (paymentId: string) => apiClient.get(`/payments/invoice/${paymentId}`),
};

// Company Prep API
export const companyPrepAPI = {
  // Public methods
  getCompanies: (params?: any) => apiClient.get('/company-prep', { params }),
  getIndustries: () => apiClient.get('/company-prep/industries'),
  getCompany: (id: string) => apiClient.get(`/company-prep/${id}`),
  createOrder: (companyId: string) => apiClient.post(`/company-prep/${companyId}/create-order`),
  verifyPayment: (companyId: string, data: any) =>
    apiClient.post(`/company-prep/${companyId}/verify-payment`, data),

  // Mentor methods
  getAllCompanies: () => apiClient.get('/company-prep/mentor/all'),
  createCompany: (data: any) => apiClient.post('/company-prep/mentor', data),
  updateCompany: (id: string, data: any) => apiClient.put(`/company-prep/mentor/${id}`, data),
  deleteCompany: (id: string) => apiClient.delete(`/company-prep/mentor/${id}`),
};

// Pricing API
export const pricingAPI = {
  // Public methods
  getServices: () => apiClient.get('/pricing-section/public'),
  getService: (serviceId: string) => apiClient.get(`/pricing-section/public/${serviceId}`),

  // Admin methods
  createService: (data: any) => apiClient.post('/pricing-section/admin/services', data),
  updateService: (serviceId: string, data: any) => apiClient.put(`/pricing-section/admin/services/${serviceId}`, data),
  deleteService: (serviceId: string) => apiClient.delete(`/pricing-section/admin/services/${serviceId}`),
  updateDiscount: (serviceId: string, data: any) => apiClient.put(`/pricing-section/admin/services/${serviceId}/discount`, data),
};

export default apiClient;
