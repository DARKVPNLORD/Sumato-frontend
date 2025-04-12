// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      if (validateForm()) {
        // Show loading state on button
        const submitButton = document.querySelector('.send-message-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Gather form data
        const formData = {
          fullName: document.getElementById('fullName').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          subject: document.getElementById('subject').value.trim(),
          message: document.getElementById('message').value.trim()
        };
        
        // Submit to API
        fetch('/api/quotes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add auth token if user is logged in
            ...getAuthHeader()
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Reset form
            contactForm.reset();
            
            // Show success message
            showMessage('Your quote request has been submitted successfully. We will get back to you soon!', 'success');
          } else {
            // Show error message
            showMessage(data.message || 'There was an error submitting your request. Please try again.', 'error');
          }
        })
        .catch(error => {
          console.error('Quote submission error:', error);
          showMessage('There was an error submitting your request. Please try again.', 'error');
        })
        .finally(() => {
          // Reset button
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        });
      }
    });
  }
  
  function validateForm() {
    // Get form fields
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Reset previous error messages
    removeAllErrorMessages();
    
    let isValid = true;
    
    // Validate Full Name
    if (fullName === '') {
      showError('fullName', 'Please enter your full name');
      isValid = false;
    }
    
    // Validate Email
    if (email === '') {
      showError('email', 'Please enter your email address');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate Phone (optional, but if provided should be valid)
    if (phone !== '' && !isValidPhone(phone)) {
      showError('phone', 'Please enter a valid phone number');
      isValid = false;
    }
    
    // Validate Subject
    if (subject === '') {
      showError('subject', 'Please enter a subject');
      isValid = false;
    }
    
    // Validate Message
    if (message === '') {
      showError('message', 'Please enter your message');
      isValid = false;
    } else if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters long');
      isValid = false;
    }
    
    return isValid;
  }
  
  function showError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('div');
    
    errorElement.className = 'error-message';
    errorElement.textContent = errorMessage;
    errorElement.style.color = '#c62828';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#c62828';
  }
  
  function removeAllErrorMessages() {
    // Remove all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function(error) {
      error.remove();
    });
    
    // Reset field borders
    const formFields = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formFields.forEach(function(field) {
      field.style.borderColor = '#ddd';
    });
  }
  
  function showMessage(messageText, messageType) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(function(msg) {
      msg.remove();
    });
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageType}`;
    messageElement.textContent = messageText;
    
    // Insert before form
    const formParent = contactForm.parentNode;
    formParent.insertBefore(messageElement, contactForm);
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Auto-remove message after 5 seconds
    setTimeout(function() {
      messageElement.remove();
    }, 5000);
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isValidPhone(phone) {
    // Basic phone validation - adjust as needed for your requirements
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }
  
  function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}); 