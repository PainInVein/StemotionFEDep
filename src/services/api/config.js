/**
 * API Configuration
 * Quản lý base URL, timeout và các cấu hình chung
 */
// Tự động detect protocol dựa trên environment
const getApiBaseUrl = () => {
  // Nếu có biến môi trường, sử dụng nó (ưu tiên cao nhất)
  if (import.meta.env.VITE_API_URL) {
    console.log('🌐 Using API URL from environment:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Production (Netlify) - dùng relative URL để proxy qua serverless function
  // Local development - dùng HTTP trực tiếp
  const isProduction = import.meta.env.PROD || window.location.protocol === 'https:';
  
  if (isProduction) {
    // Trong production, dùng relative URL để proxy qua Netlify serverless function
    // Serverless function sẽ proxy đến HTTP backend (giải quyết Mixed Content)
    const apiUrl = '/api';
    console.log(`🌐 API URL (production, using proxy): ${apiUrl}`);
    return apiUrl;
  } else {
    // Local development - dùng HTTP trực tiếp
    const apiUrl = 'http://vehiclemarket.runasp.net/api';
    console.log(`🌐 API URL (development): ${apiUrl}`);
    return apiUrl;
  }
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30 giây
  RETRY_ATTEMPTS: 3,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

/**
 * API Endpoints
 * Quản lý tất cả các endpoint paths
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/Auth/login",
    REGISTER: "/Auth/register",
    LOGOUT: "/Auth/logout",
    REFRESH: "/Auth/refresh",
    FORGOT_PASSWORD: "/Auth/forgot-password",
    RESET_PASSWORD: "/Auth/reset-password",
    VERIFY_OTP: "/Auth/verify-otp",
    ME: "/Auth/me",
    GOOGLE_LOGIN: "/auth/external-login/google",
    UPDATE_PHONE_PASSWORD: "/Auth/update-phone-password",
  },

   USERS: {
    DETAIL: "/Users/:userId",
    UPDATE: "/Users/:userId",
    ITEMS: "/Items/user/:userId",
    PACKAGES: "/UserPackages/:userId",
    ACTIVE_PACKAGE: "/UserPackages/:userId/active",
  },


  // Chat & Messaging endpoints
  CHAT: {
    LISTINGS: "/Listings",
    CONVERSATIONS: {
      CREATE: "/Conversations/create",
      GET: "/Conversations/:id",
      USER: "/Conversations/user/:userId",
    },
    MESSAGES: {
      SEND: "/Messages",
      GET: "/Messages/:conversationId",
      MARK_READ: "/Messages/:messageId/read",
    },
  },

  

  // Payment endpoints
  PAYMENT: {
    VNPAY_CREATE: "/VNpay/create-payment",
    PAYMENT_ALL: "/Payments/all",
    PAYMENT_REPORT: "/PaymentReport/monthly-revenue-pdf",
  },

};
