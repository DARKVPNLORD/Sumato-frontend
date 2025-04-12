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
 * IMPORTANT: To enable Google authentication, you must:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Add a web app to your project
 * 3. Enable Google authentication in the Authentication section
 * 4. Copy your Firebase config here (available in Project Settings > Your Apps)
 * 5. Add your domain to the authorized domains list in Firebase Console
 */
// Firebase config is now fetched from the backend to keep it secure
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDVwlK5cFzuCz_C61CjxS4kIEP-5A7uhTU",    
  authDomain: "sumato-2d6ea.firebaseapp.com",
  projectId: "sumato-2d6ea",
  storageBucket: "sumato-2d6ea.appspot.com",
  messagingSenderId: "592462311628", 
  appId: "1:592462311628:web:45ca0ca9e63fb7ae8bc3e4"
}; 