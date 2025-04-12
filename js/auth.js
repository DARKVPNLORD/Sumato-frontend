// Authentication Pages JavaScript (Login & Register)

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
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // Initialize authentication forms
  initLoginForm();
  initPasswordToggle();
  
  // Add focus styles for better accessibility
  addFocusStyles();
  
  // Initialize registration form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    initializeRegisterForm(registerForm);
  }
  
  // Initialize forgot password form
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  if (forgotPasswordForm) {
    initializeForgotPasswordForm(forgotPasswordForm);
  }
});

// Login Form Initialization
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    // Add form validation on submit
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form fields
      if (validateLoginForm()) {
        // Show loading state
        const submitButton = loginForm.querySelector('.auth-submit');
        const originalButtonText = submitButton.textContent;
        submitButton.classList.add('loading');
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;
        
        // Simulate a login request to the backend
        // In a real implementation, this would be replaced with an actual API call
        setTimeout(function() {
          // Reset loading state
          submitButton.classList.remove('loading');
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
          
          // Simulate successful login and redirect
          showToast('Successfully signed in. Redirecting...', 'success');
          
          setTimeout(function() {
            window.location.href = 'index.html';
          }, 1500);
        }, 2000);
      }
    });
    
    // Add real-time validation on input
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        validateEmail(this);
      });
      
      emailInput.addEventListener('input', function() {
        clearValidationMessage('email-validation');
        this.classList.remove('invalid');
      });
    }
    
    if (passwordInput) {
      passwordInput.addEventListener('blur', function() {
        validatePassword(this);
      });
      
      passwordInput.addEventListener('input', function() {
        clearValidationMessage('password-validation');
        this.classList.remove('invalid');
      });
    }
  }
}

// Password Toggle Visibility
function initPasswordToggle() {
  // Password toggle for login and register form
  const toggleButton = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  
  if (toggleButton && passwordInput) {
    toggleButton.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Update icon
      const icon = toggleButton.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }
  
  // Confirm password toggle for register form
  const toggleConfirmButton = document.getElementById('toggle-confirm-password');
  const confirmPasswordInput = document.getElementById('confirm_password');
  
  if (toggleConfirmButton && confirmPasswordInput) {
    toggleConfirmButton.addEventListener('click', function() {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);
      
      // Update icon
      const icon = toggleConfirmButton.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }
  
  // Adding a debug log to check if toggle buttons exist
  console.log('Password toggle button exists:', !!toggleButton);
  console.log('Confirm password toggle button exists:', !!toggleConfirmButton);
}

// Login Form Validation
function validateLoginForm() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  let isValid = true;
  
  // Validate email
  if (emailInput && !validateEmail(emailInput)) {
    isValid = false;
  }
  
  // Validate password
  if (passwordInput && !validatePassword(passwordInput)) {
    isValid = false;
  }
  
  return isValid;
}

// Email Validation
function validateEmail(emailInput) {
  const email = emailInput.value.trim();
  const emailValidation = document.getElementById('email-validation');
  
  if (email === '') {
    showValidationMessage(emailInput, emailValidation, 'Email address is required');
    return false;
  }
  
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    showValidationMessage(emailInput, emailValidation, 'Please enter a valid email address');
    return false;
  }
  
  return true;
}

// Password Validation
function validatePassword(passwordInput) {
  const password = passwordInput.value;
  const passwordValidation = document.getElementById('password-validation');
  
  if (password === '') {
    showValidationMessage(passwordInput, passwordValidation, 'Password is required');
    return false;
  }
  
  if (password.length < 8) {
    showValidationMessage(passwordInput, passwordValidation, 'Password must be at least 8 characters');
    return false;
  }
  
  return true;
}

// Show Validation Message
function showValidationMessage(input, validationElement, message) {
  input.classList.add('invalid');
  
  if (validationElement) {
    validationElement.textContent = message;
  }
}

// Clear Validation Message
function clearValidationMessage(validationElementId) {
  const validationElement = document.getElementById(validationElementId);
  
  if (validationElement) {
    validationElement.textContent = '';
  }
}

// Add Focus Styles
function addFocusStyles() {
  const focusableElements = document.querySelectorAll('input, button, a');
  
  focusableElements.forEach(function(element) {
    element.addEventListener('focus', function() {
      this.classList.add('focus');
    });
    
    element.addEventListener('blur', function() {
      this.classList.remove('focus');
    });
  });
}

// Show Toast Notification
function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(function(toast) {
    toast.remove();
  });
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Create toast content
  const toastContent = document.createElement('div');
  toastContent.className = 'toast-content';
  toastContent.textContent = message;
  
  // Create toast icon
  const toastIcon = document.createElement('div');
  toastIcon.className = 'toast-icon';
  
  if (type === 'success') {
    toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
  } else if (type === 'error') {
    toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
  }
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'toast-close';
  closeButton.innerHTML = '<i class="fas fa-times"></i>';
  closeButton.setAttribute('aria-label', 'Close notification');
  
  // Add event listener to close button
  closeButton.addEventListener('click', function() {
    toast.remove();
  });
  
  // Assemble toast
  toast.appendChild(toastIcon);
  toast.appendChild(toastContent);
  toast.appendChild(closeButton);
  
  // Add to document
  document.body.appendChild(toast);
  
  // Remove toast after 2 seconds (reduced from 3)
  setTimeout(function() {
    if (document.body.contains(toast)) {
      toast.remove();
    }
  }, 2000);
}

// Prevent XSS in forms
function sanitizeInput(input) {
  const temp = document.createElement('div');
  temp.textContent = input;
  return temp.innerHTML;
}

// Registration Form Initialization
function initializeRegisterForm(formElement) {
  formElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateRegistrationForm(formElement)) {
      // Form is valid, prepare for submission
      handleRegistration(formElement);
    }
  });
  
  // Add input validation
  setupFormValidation(formElement);
  
  // Add password strength meter
  const passwordInput = formElement.querySelector('input[type="password"]');
  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      updatePasswordStrength(this);
    });
  }
  
  // Confirm password validation
  const confirmPasswordInput = formElement.querySelector('input[name="confirm_password"]');
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', function() {
      validatePasswordMatch(this, passwordInput);
    });
    
    passwordInput.addEventListener('blur', function() {
      if (confirmPasswordInput.value) {
        validatePasswordMatch(confirmPasswordInput, this);
      }
    });
  }
}

// Forgot Password Form Initialization
function initializeForgotPasswordForm(formElement) {
  formElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (window.sumatoUtils.validateForm(formElement)) {
      // Form is valid, prepare for submission
      handleForgotPassword(formElement);
    }
  });
  
  // Add input validation
  setupFormValidation(formElement);
}

// Setup form validation for any form
function setupFormValidation(formElement) {
  const inputs = formElement.querySelectorAll('input');
  
  inputs.forEach(input => {
    // Validate on blur
    input.addEventListener('blur', function() {
      if (this.required && !this.value.trim()) {
        markInvalid(this, 'This field is required');
      } else if (this.type === 'email' && !window.sumatoUtils.validateEmail(this.value)) {
        markInvalid(this, 'Please enter a valid email address');
      } else {
        markValid(this);
      }
    });
    
    // Clear error on input
    input.addEventListener('input', function() {
      this.classList.remove('invalid');
      const errorElement = this.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    });
  });
}

// Validation Helpers
function markInvalid(inputElement, message) {
  window.sumatoUtils.markInvalid(inputElement, message);
}

function markValid(inputElement) {
  window.sumatoUtils.markValid(inputElement);
}

function validateRegistrationForm(formElement) {
  // First do the standard validation
  if (!window.sumatoUtils.validateForm(formElement)) {
    return false;
  }
  
  // Then check password match
  const passwordInput = formElement.querySelector('input[name="password"]');
  const confirmPasswordInput = formElement.querySelector('input[name="confirm_password"]');
  
  if (passwordInput && confirmPasswordInput) {
    if (passwordInput.value !== confirmPasswordInput.value) {
      markInvalid(confirmPasswordInput, 'Passwords do not match');
      return false;
    }
  }
  
  // Check password strength
  if (passwordInput && !isPasswordStrong(passwordInput.value)) {
    markInvalid(passwordInput, 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
    return false;
  }
  
  return true;
}

function validatePasswordMatch(confirmInput, passwordInput) {
  if (confirmInput.value !== passwordInput.value) {
    markInvalid(confirmInput, 'Passwords do not match');
    return false;
  } else {
    markValid(confirmInput);
    return true;
  }
}

function isPasswordStrong(password) {
  // Password must be at least 8 characters and include uppercase, lowercase, number, and special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

function updatePasswordStrength(passwordInput) {
  // Find or create strength meter
  let strengthMeter = passwordInput.parentElement.querySelector('.password-strength');
  if (!strengthMeter) {
    strengthMeter = document.createElement('div');
    strengthMeter.className = 'password-strength';
    passwordInput.parentElement.appendChild(strengthMeter);
  }
  
  const password = passwordInput.value;
  
  // Calculate strength
  let strength = 0;
  let feedback = '';
  
  if (password.length >= 8) strength += 1;
  if (password.match(/[a-z]/)) strength += 1;
  if (password.match(/[A-Z]/)) strength += 1;
  if (password.match(/[0-9]/)) strength += 1;
  if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
  
  // Update UI
  strengthMeter.className = 'password-strength';
  
  if (password.length === 0) {
    strengthMeter.textContent = '';
    return;
  } else if (strength < 3) {
    strengthMeter.classList.add('weak');
    feedback = 'Weak';
  } else if (strength < 5) {
    strengthMeter.classList.add('medium');
    feedback = 'Medium';
  } else {
    strengthMeter.classList.add('strong');
    feedback = 'Strong';
  }
  
  strengthMeter.textContent = `Password Strength: ${feedback}`;
}

// Form Submit Handlers
function handleRegistration(formElement) {
  // Show loading state
  const submitButton = formElement.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Creating account...';
  
  const formData = new FormData(formElement);
  const formValues = {};
  
  // Convert FormData to object
  formData.forEach((value, key) => {
    formValues[key] = value;
  });
  
  // In a real implementation, you would send this data to your backend API
  // For now, we'll simulate an API call with a timeout
  setTimeout(() => {
    console.log('Registration would be submitted with:', formValues);
    
    // Redirect to login or dashboard
    window.location.href = 'login.html?registered=true';
    
  }, 1000); // Reduced from 1500
}

function handleForgotPassword(formElement) {
  // Show loading state
  const submitButton = formElement.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  
  const formData = new FormData(formElement);
  const formValues = {};
  
  // Convert FormData to object
  formData.forEach((value, key) => {
    formValues[key] = value;
  });
  
  // In a real implementation, you would send this data to your backend API
  // For now, we'll simulate an API call with a timeout
  setTimeout(() => {
    console.log('Password reset would be submitted with:', formValues);
    
    // Reset form and show success message
    formElement.reset();
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    
    // Show success message
    const formContainer = formElement.closest('.auth-form');
    window.sumatoUtils.showMessage(
      formContainer, 
      'Password reset instructions have been sent to your email.',
      'success'
    );
    
  }, 1000); // Reduced from 1500
} 