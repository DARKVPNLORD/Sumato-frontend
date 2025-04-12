/**
 * API utilities for Sumato Technology Website
 * Handles all API requests to the backend
 */

// Import config
// Note: Config must be loaded first in HTML before this file

/**
 * Makes an API request
 * @param {string} url - The API endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request body data (optional)
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - Promise resolving to the API response
 */
async function apiRequest(url, method = 'GET', data = null, requiresAuth = false) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      credentials: 'same-origin'
    };

    // Add request body for non-GET requests
    if (method !== 'GET' && data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'An error occurred');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Authentication API functions
 */
const authAPI = {
  // Register a new user
  register: async (userData) => {
    return apiRequest(ENDPOINTS.AUTH.REGISTER, 'POST', userData);
  },

  // Login with email/password
  login: async (credentials) => {
    return apiRequest(ENDPOINTS.AUTH.LOGIN, 'POST', credentials);
  },

  // Login or register with Google
  googleAuth: async (idToken) => {
    return apiRequest(ENDPOINTS.AUTH.GOOGLE, 'POST', { idToken });
  },

  // Get current user profile
  getProfile: async () => {
    return apiRequest(ENDPOINTS.AUTH.GET_USER, 'GET', null, true);
  }
};

/**
 * User API functions
 */
const userAPI = {
  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest(ENDPOINTS.USER.UPDATE_PROFILE, 'PUT', profileData, true);
  },

  // Change user password
  changePassword: async (passwordData) => {
    return apiRequest(ENDPOINTS.USER.CHANGE_PASSWORD, 'PUT', passwordData, true);
  },

  // Get user dashboard data
  getDashboard: async () => {
    return apiRequest(ENDPOINTS.USER.DASHBOARD, 'GET', null, true);
  }
};

/**
 * Admin API functions
 */
const adminAPI = {
  // Admin login
  login: async (credentials) => {
    return apiRequest(ENDPOINTS.ADMIN.LOGIN, 'POST', credentials);
  },

  // Get admin profile
  getProfile: async () => {
    return apiRequest(ENDPOINTS.ADMIN.GET_ADMIN, 'GET', null, true);
  },

  // Create new admin (superadmin only)
  createAdmin: async (adminData) => {
    return apiRequest(ENDPOINTS.ADMIN.CREATE_ADMIN, 'POST', adminData, true);
  }
}; 