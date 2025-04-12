/**
 * Configuration file for Sumato Technology Website
 * Contains API endpoints and other configuration settings
 */

// API Base URL - Change this based on environment
const API_BASE_URL = {
  development: 'http://localhost:5000/api',
  production: 'https://sumato-backend.onrender.com/api' // Update with your actual backend URL when deployed
};

// Determine current environment (defaults to production for safety)
const ENVIRONMENT = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ? 
                    'development' : 'production';

// Export the appropriate API base URL
const API_URL = API_BASE_URL[ENVIRONMENT];

// API Endpoints
const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
    GOOGLE: `${API_URL}/auth/google`,
    GET_USER: `${API_URL}/auth/me`
  },
  
  // User endpoints
  USER: {
    UPDATE_PROFILE: `${API_URL}/users/profile`,
    CHANGE_PASSWORD: `${API_URL}/users/password`,
    DASHBOARD: `${API_URL}/users/dashboard`
  },
  
  // Admin endpoints
  ADMIN: {
    LOGIN: `${API_URL}/admin/login`,
    GET_ADMIN: `${API_URL}/admin/me`,
    CREATE_ADMIN: `${API_URL}/admin/create`
  }
};

// Firebase configuration (to be filled with your Firebase project details)
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
}; 