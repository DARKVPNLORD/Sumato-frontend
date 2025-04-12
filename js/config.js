/**
 * Configuration file for Sumato Technology Website
 * Contains API endpoints and other configuration settings
 */

// API Base URL - Change this based on environment
const API_BASE_URL = {
  development: 'http://localhost:5000/api',
  production: 'https://sumato-technology-api.onrender.com/api' // Updated with the actual deployed backend URL
};

// Determine current environment (defaults to production for safety)
const ENVIRONMENT = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ? 
                    'development' : 'production';

// Export the appropriate API base URL
const API_URL = API_BASE_URL[ENVIRONMENT];

// CORS settings
const CORS_SETTINGS = {
  credentials: 'include',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
};

// API Endpoints
const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
    GOOGLE: `${API_URL}/auth/google`,
    GET_USER: `${API_URL}/auth/me`,
    FIREBASE_CONFIG: `${API_URL}/auth/firebase-config`
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
  },
  
  // Quote endpoints
  QUOTES: {
    SUBMIT: `${API_URL}/quotes`,
    GET_USER_QUOTES: `${API_URL}/quotes/user`,
    ADMIN_GET_QUOTES: `${API_URL}/quotes/admin`,
    ADMIN_GET_QUOTE: (id) => `${API_URL}/quotes/admin/${id}`,
    ADMIN_UPDATE_QUOTE: (id) => `${API_URL}/quotes/admin/${id}`
  }
};

/* 
 * Firebase configuration 
 * This can be fetched from the backend API for additional security
 * or set directly here for simpler setup
 */
// Firebase config with API key
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDVwlK5cFzuCz_C61CjxS4kIEP-5A7uhTU",    
  authDomain: "sumato-2d6ea.firebaseapp.com",
  projectId: "sumato-2d6ea",
  storageBucket: "sumato-2d6ea.appspot.com",
  messagingSenderId: "592462311628", 
  appId: "1:592462311628:web:45ca0ca9e63fb7ae8bc3e4"
};

// Function to fetch Firebase config from backend (optional)
async function getFirebaseConfig() {
  try {
    const response = await fetch(ENDPOINTS.AUTH.FIREBASE_CONFIG);
    const data = await response.json();
    if (data.success && data.config) {
      console.log('Fetched Firebase config from API');
      return data.config;
    }
    console.warn('Could not fetch Firebase config from API, using local config');
    return FIREBASE_CONFIG;
  } catch (error) {
    console.error('Error fetching Firebase config:', error);
    return FIREBASE_CONFIG;
  }
} 