/**
 * API utilities for Sumato Technology Website
 * Handles all API requests to the backend
 */

// Import config
// Note: Config must be loaded first in HTML before this file

// API Configuration
const api = {
  // Base URL for API requests
  baseURL: sumatoConfig.apiBaseURL || 'https://api.sumatotechnology.com',
  
  // Headers to include with every request
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  
  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },
  
  // Get headers including authorization if token exists
  getHeaders() {
    const headers = { ...this.defaultHeaders };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },
  
  // Handle HTTP errors and parse JSON response
  async handleResponse(response) {
    if (!response.ok) {
      const error = new Error('API request failed');
      
      try {
        const data = await response.json();
        error.response = { data, status: response.status };
      } catch (e) {
        error.response = { status: response.status };
      }
      
      throw error;
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  },
  
  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  },
  
  // POST request
  async post(endpoint, data = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  },
  
  // PUT request
  async put(endpoint, data = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  },
  
  // DELETE request
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  },
  
  // Specific API endpoints
  endpoints: {
    // Auth endpoints
    auth: {
      register: '/auth/register',
      login: '/auth/login',
      google: '/auth/google',
      me: '/auth/me',
    },
    
    // User endpoints
    user: {
      profile: '/user/profile',
      password: '/user/password',
      dashboard: '/user/dashboard',
    },
    
    // Admin endpoints
    admin: {
      login: '/admin/login',
      me: '/admin/me',
      create: '/admin/create',
    },
  }
};

/**
 * Authentication API functions
 */
const authAPI = {
  // Register a new user
  register: async (userData) => {
    return api.post(api.endpoints.auth.register, userData);
  },

  // Login with email/password
  login: async (credentials) => {
    return api.post(api.endpoints.auth.login, credentials);
  },

  // Login or register with Google
  googleAuth: async (idToken) => {
    return api.post(api.endpoints.auth.google, { idToken });
  },

  // Get current user profile
  getProfile: async () => {
    return api.get(api.endpoints.auth.me);
  }
};

/**
 * User API functions
 */
const userAPI = {
  // Update user profile
  updateProfile: async (profileData) => {
    return api.put(api.endpoints.user.profile, profileData);
  },

  // Change user password
  changePassword: async (passwordData) => {
    return api.put(api.endpoints.user.password, passwordData);
  },

  // Get user dashboard data
  getDashboard: async () => {
    return api.get(api.endpoints.user.dashboard);
  }
};

/**
 * Admin API functions
 */
const adminAPI = {
  // Admin login
  login: async (credentials) => {
    return api.post(api.endpoints.admin.login, credentials);
  },

  // Get admin profile
  getProfile: async () => {
    return api.get(api.endpoints.admin.me);
  },

  // Create new admin (superadmin only)
  createAdmin: async (adminData) => {
    return api.post(api.endpoints.admin.create, adminData);
  }
}; 