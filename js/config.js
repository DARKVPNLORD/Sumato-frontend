/**
 * Configuration file for Sumato Technology Website
 */

// Global configuration object
window.sumatoConfig = {
  // API Base URL
  apiBaseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://sumato-technology-api.onrender.com/api',

  // Firebase configuration
  firebase: {
    apiKey: "AIzaSyCZyr1DKVWsuuLeesijYFJ-QncdH1DzSX0",    
    authDomain: "sumato-technology-6a3cc.firebaseapp.com",
    projectId: "sumato-technology-6a3cc",
    storageBucket: "sumato-technology-6a3cc.appspot.com",
    messagingSenderId: "572695801633", 
    appId: "1:572695801633:web:0a43805b98afc761e59860"
  }
};

// For backward compatibility
const API_URL = sumatoConfig.apiBaseURL;

// CORS settings
const CORS_SETTINGS = {
  credentials: 'include',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
};

// API Endpoints for backward compatibility
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

// For backward compatibility
const FIREBASE_CONFIG = sumatoConfig.firebase;

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

// Firebase Configuration
function initializeFirebase() {
  try {
    // Skip initialization if already done
    if (firebase.apps.length) {
      return;
    }
    
    // Firebase configuration - do not log to console for security
    const firebaseConfig = {
      apiKey: "AIzaSyCzrIDKYMuuieesljYFj-Oncu1H2-5SW",
      authDomain: "sumato-technology-6a3cc.firebaseapp.com",
      projectId: "sumato-technology-6a3cc",
      storageBucket: "sumato-technology-6a3cc.appspot.com",
      messagingSenderId: "572695801633",
      appId: "1:572695801633:web:0a4385b98afc761e5906a",
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
  }
}

// Utility functions
const sumatoUtils = {
  // Show a message inside a container
  showMessage: function(container, message, type = 'info') {
    // Create message element if it doesn't exist
    let messageEl = container.querySelector('.message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'message';
      container.prepend(messageEl);
    }
    
    // Set message content
    messageEl.textContent = message;
    messageEl.className = `message message-${type}`;
    messageEl.style.display = 'block';
    
    // Auto-hide info and success messages after 5 seconds
    if (type === 'info' || type === 'success') {
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 5000);
    }
  },
  
  // Validate form fields
  validateField: function(field, rules) {
    // Implementation of field validation
  }
}; 