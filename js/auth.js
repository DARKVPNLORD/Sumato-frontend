/**
 * Authentication JavaScript for Sumato Technology Website
 * Handles user registration, login, and form validation
 */

// Define the sumatoUtils namespace for utility functions
window.sumatoUtils = {
  validateForm: function(formElement) {
    let isValid = true;
    const requiredFields = formElement.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.markInvalid(field, 'This field is required');
        isValid = false;
      }
    });
    
    const emailField = formElement.querySelector('input[type="email"]');
    if (emailField && emailField.value && !this.validateEmail(emailField.value)) {
      this.markInvalid(emailField, 'Please enter a valid email address');
      isValid = false;
    }
    
    return isValid;
  },
  
  validateEmail: function(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  markInvalid: function(inputElement, message) {
    inputElement.classList.add('invalid');
    
    // Add error message if it doesn't exist
    let errorElement = inputElement.parentElement.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      inputElement.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  },
  
  markValid: function(inputElement) {
    inputElement.classList.remove('invalid');
    
    // Remove error message if it exists
    const errorElement = inputElement.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  },
  
  showMessage: function(container, message, type = 'success') {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Add to container at the top
    container.insertBefore(messageElement, container.firstChild);
    
    // Remove after 3 seconds (reduced from 5)
    setTimeout(() => {
      if (container.contains(messageElement)) {
        messageElement.remove();
      }
    }, 3000);
  },
  
  // Function to generate a secure random token
  generateSecureToken: function() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  // Function to reset form validation
  resetFormValidation: function(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.remove('invalid');
      const validationMessage = input.parentElement.querySelector('.validation-message');
      if (validationMessage) {
        validationMessage.textContent = '';
        validationMessage.classList.remove('error');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;
  
  // Process Google auth redirect result if on login or register page
  if (currentPath.includes('/login.html') || currentPath.includes('/register.html')) {
    if (typeof processGoogleAuthResult === 'function') {
      processGoogleAuthResult();
    }
  }
  
  // Protected routes check
  if (currentPath.includes('/dashboard') || currentPath.includes('/profile')) {
    if (!token) {
      window.location.href = '/login.html';
    } else {
      // Fetch user profile to confirm token validity
      authAPI.getProfile()
        .catch(error => {
          console.error('Authentication failed:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login.html';
      });
    }
  }
  
  // Redirect logged-in users away from auth pages
  if ((currentPath.includes('/login.html') || currentPath.includes('/register.html')) && token) {
    window.location.href = '/dashboard.html';
  }

  // Register form handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
  }

  // Login form handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Google login button
  const googleLoginBtn = document.getElementById('googleLogin');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
  }

  // Initialize Firebase if available
  if (typeof initializeFirebase === 'function' && 
      (currentPath.includes('/login.html') || currentPath.includes('/register.html'))) {
    initializeFirebase();
  }

  // Password toggle functionality
  const passwordToggleBtns = document.querySelectorAll('.password-toggle');
  passwordToggleBtns.forEach(btn => {
    btn.addEventListener('click', togglePasswordVisibility);
  });
});

/**
 * Sets up the password toggle functionality
 */
function setupPasswordToggles() {
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Update icon
      const icon = togglePassword.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }

  const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
  const confirmPasswordInput = document.getElementById('confirm_password');

  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener('click', function() {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);
      
      // Update icon
      const icon = toggleConfirmPassword.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }
}

/**
 * Handle registration form submission
 * @param {Event} event - The form submission event
 */
async function handleRegistration(e) {
  e.preventDefault();
  
  // Reset validation state
  resetFormValidation(this);
  
  // Get form data
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const company = document.getElementById('company')?.value.trim() || '';
  const termsCheckbox = document.getElementById('terms');
  
  // Validate form inputs
  let isValid = true;
  
  if (!firstName) {
    markInvalid('firstName', 'First name is required');
    isValid = false;
  }
  
  if (!lastName) {
    markInvalid('lastName', 'Last name is required');
    isValid = false;
  }
  
  if (!email || !sumatoUtils.validateEmail(email)) {
    markInvalid('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    markInvalid('password', passwordValidation.message);
    isValid = false;
  }
  
  if (password !== confirmPassword) {
    markInvalid('confirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  if (termsCheckbox && !termsCheckbox.checked) {
    markInvalid('terms', 'You must accept the Terms of Service');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Show loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';
  
  try {
    // Call the API to register the user
    const userData = {
      firstName,
      lastName,
      email,
      password,
      company
    };
    
    const response = await authAPI.register(userData);
    
    // Save auth token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Show success message
    sumatoUtils.showMessage('Registration successful! Redirecting to dashboard...', 'success');
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1500);
    
  } catch (error) {
    console.error('Registration error:', error);
    sumatoUtils.showMessage(error.message || 'Registration failed. Please try again.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

/**
 * Handle login form submission
 * @param {Event} event - The form submission event
 */
async function handleLogin(e) {
  e.preventDefault();
  
  // Reset validation state
  resetFormValidation(this);
  
  // Get form data
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  // Validate form inputs
  let isValid = true;
  
  if (!email || !sumatoUtils.validateEmail(email)) {
    markInvalid('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!password) {
    markInvalid('password', 'Password is required');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Show loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
  
  try {
    // Call the API to login
    const credentials = {
      email,
      password
    };
    
    const response = await authAPI.login(credentials);
    
    // Save auth token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Show success message
    sumatoUtils.showMessage('Login successful! Redirecting...', 'success');
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    sumatoUtils.showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

/**
 * Initialize Firebase for authentication
 */
function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      console.log('Initializing Firebase with config:', JSON.stringify(FIREBASE_CONFIG));
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

/**
 * Handle Google login button click
 */
function handleGoogleLogin() {
  try {
    const authForm = document.querySelector('.auth-form');
    if (!initializeFirebase()) {
      showMessage('Google login is not available. Please check your Firebase configuration.', 'error');
      return;
    }

    console.log('Starting Google login with Firebase signInWithRedirect');
    
    // Show a loading message before redirect
    showMessage('Redirecting to Google sign-in...', 'info');
    
    // Create a Google auth provider
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Add required scopes
    provider.addScope('email');
    provider.addScope('profile');
    
    // Set custom parameters
    provider.setCustomParameters({
      // Force account selection even if user is already signed in
      prompt: 'select_account'
    });
    
    // Save current URL for redirect
    const currentPage = window.location.pathname;
    localStorage.setItem('auth_redirect', currentPage);
    
    console.log('Initiating redirect to Google auth');
    
    // Use signInWithRedirect with the explicit provider
    firebase.auth().signInWithRedirect(provider)
      .catch((error) => {
        console.error('Redirect error:', error);
        showMessage('Error initiating Google sign-in. Please try again.', 'error');
      });
    
  } catch (error) {
    const authForm = document.querySelector('.auth-form');
    console.error('Google login function error:', error);
    showMessage('An unexpected error occurred. Please try again later.', 'error');
  }
}

/**
 * Process Google authentication result after redirect
 */
function processGoogleAuthResult() {
  console.log('Checking for Google auth redirect result');
  
  firebase.auth().getRedirectResult()
    .then((result) => {
      if (result.user) {
        console.log('Google sign-in successful via redirect', result.user.email);
        
        // Show processing message
        showMessage('Processing your Google sign-in...', 'info');
        
        // Get the ID token with explicit API call to ensure fresh token
        return result.user.getIdToken(true).then((idToken) => {
          console.log('Got fresh ID token from Firebase');
          
          // Send token to backend
          return authAPI.googleAuth(idToken);
        });
      } else {
        console.log('No redirect result user found');
        return null;
      }
    })
    .then((response) => {
      if (response) {
        console.log('Backend authentication successful:', response);
        
        // Save auth token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Show success message
        showMessage('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
      }
    })
    .catch((error) => {
      console.error('Google redirect result error:', error);
      showMessage('Google sign-in failed: ' + (error.message || 'Unknown error'), 'error');
    });
}

/**
 * Helper function to show messages
 * @param {string} message - The message to show
 * @param {string} type - The message type (info, success, error)
 */
function showMessage(message, type) {
  console.log(`Message (${type}):`, message);
  
  if (typeof sumatoUtils !== 'undefined' && sumatoUtils.showMessage) {
    const container = document.querySelector('.auth-form');
    if (container) {
      sumatoUtils.showMessage(container, message, type);
    } else {
      // Fallback if container not found
      alert(`${type.toUpperCase()}: ${message}`);
    }
  } else {
    // Fallback if sumatoUtils not available
    alert(`${type.toUpperCase()}: ${message}`);
  }
}

/**
 * Function to logout user
 */
function logout() {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to home page
  window.location.href = '/';
}

/**
 * Set up form validation
 * @param {HTMLFormElement} form - The form element
 */
function setupFormValidation(form) {
  // Email validation
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      validateEmail(emailInput);
    });
  }
  
  // Password validation
  const passwordInput = form.querySelector('input[id="password"]');
  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      validatePassword(passwordInput);
    });
  }
  
  // Confirm password validation
  const confirmPasswordInput = form.querySelector('input[id="confirm_password"]');
  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      validateConfirmPassword(confirmPasswordInput, passwordInput);
    });
  }
  
  // Terms checkbox validation
  const termsCheckbox = form.querySelector('input[id="agreeTerms"]');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', function() {
      validateTerms(termsCheckbox);
    });
  }
}

/**
 * Validate the entire form
 * @param {HTMLFormElement} form - The form element
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
  let isValid = true;
  
  // Email validation
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput) {
    isValid = validateEmail(emailInput) && isValid;
  }
  
  // Password validation
  const passwordInput = form.querySelector('input[id="password"]');
  if (passwordInput) {
    isValid = validatePassword(passwordInput) && isValid;
  }
  
  // Confirm password validation
  const confirmPasswordInput = form.querySelector('input[id="confirm_password"]');
  if (confirmPasswordInput && passwordInput) {
    isValid = validateConfirmPassword(confirmPasswordInput, passwordInput) && isValid;
  }
  
  // Terms checkbox validation
  const termsCheckbox = form.querySelector('input[id="agreeTerms"]');
  if (termsCheckbox) {
    isValid = validateTerms(termsCheckbox) && isValid;
  }
  
  return isValid;
}

/**
 * Validate email field
 * @param {HTMLInputElement} input - The email input element
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(input.value);
  
  const validationMessage = input.parentElement.querySelector('.validation-message');
  if (validationMessage) {
    validationMessage.textContent = isValid ? '' : 'Please enter a valid email address';
    validationMessage.classList.toggle('error', !isValid);
  }
  
  input.classList.toggle('invalid', !isValid);
  return isValid;
}

/**
 * Validate password field
 * @param {HTMLInputElement} input - The password input element
 * @returns {boolean} - Whether the password is valid
 */
function validatePassword(input) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(input.value);
  const hasLowercase = /[a-z]/.test(input.value);
  const hasNumber = /\d/.test(input.value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(input.value);
  
  const isLengthValid = input.value.length >= minLength;
  const isValid = isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  
  const validationMessage = input.parentElement.parentElement.querySelector('.validation-message');
  if (validationMessage) {
    if (!input.value) {
      validationMessage.textContent = 'Password is required';
    } else if (!isLengthValid) {
      validationMessage.textContent = `Password must be at least ${minLength} characters long`;
    } else if (!isValid) {
      validationMessage.textContent = 'Password must include uppercase, lowercase, number, and special character';
    } else {
      validationMessage.textContent = '';
    }
    validationMessage.classList.toggle('error', !isValid);
  }
  
  // Update password strength indicator
  const strengthIndicator = input.parentElement.parentElement.querySelector('.password-strength');
  if (strengthIndicator) {
    updatePasswordStrength(input.value, strengthIndicator);
  }
  
  input.classList.toggle('invalid', !isValid);
  return isValid;
}

/**
 * Validate confirm password field
 * @param {HTMLInputElement} confirmInput - The confirm password input element
 * @param {HTMLInputElement} passwordInput - The password input element
 * @returns {boolean} - Whether the confirm password is valid
 */
function validateConfirmPassword(confirmInput, passwordInput) {
  const isValid = confirmInput.value === passwordInput.value;
  
  const validationMessage = confirmInput.parentElement.parentElement.querySelector('.validation-message');
  if (validationMessage) {
    validationMessage.textContent = isValid ? '' : 'Passwords do not match';
    validationMessage.classList.toggle('error', !isValid);
  }
  
  confirmInput.classList.toggle('invalid', !isValid);
  return isValid;
}

/**
 * Validate terms checkbox
 * @param {HTMLInputElement} checkbox - The terms checkbox element
 * @returns {boolean} - Whether the terms checkbox is checked
 */
function validateTerms(checkbox) {
  const isValid = checkbox.checked;
  
  const validationMessage = checkbox.parentElement.querySelector('.validation-message');
  if (validationMessage) {
    validationMessage.textContent = isValid ? '' : 'You must agree to the terms';
    validationMessage.classList.toggle('error', !isValid);
  }
  
  return isValid;
}

/**
 * Update password strength indicator
 * @param {string} password - The password to check
 * @param {HTMLElement} indicator - The strength indicator element
 */
function updatePasswordStrength(password, indicator) {
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  
  // Clear previous classes
  indicator.className = 'password-strength';
  
  if (password.length === 0) {
    indicator.style.width = '0%';
    return;
  }
  
  // Set width based on strength
  const widthPercentage = Math.min(100, (strength / 6) * 100);
  indicator.style.width = `${widthPercentage}%`;
  
  // Add appropriate class based on strength
  if (strength <= 2) {
    indicator.classList.add('weak');
  } else if (strength <= 4) {
    indicator.classList.add('medium');
  } else {
    indicator.classList.add('strong');
  }
} 