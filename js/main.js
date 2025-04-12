// Main JavaScript for Sumato Technology Website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  initializeMobileMenu();
  
  // Add scroll animations
  initializeScrollAnimations();
  
  // Initialize utility functions
  initializeUtils();
  
  // Handle active navigation
  setActiveNavLink();
  
  // Back to top button
  initBackToTop();
  
  // Smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Add page transition effects
  initPageTransitions();
  
  // Lazy loading for images
  initLazyLoading();
});

// Mobile Menu Handling
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }
}

// Scroll Animations
function initializeScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  if (elements.length) {
    // Initial check for elements in viewport
    checkElementsInViewport(elements);
    
    // Check on scroll
    window.addEventListener('scroll', function() {
      checkElementsInViewport(elements);
    });
  }
}

function checkElementsInViewport(elements) {
  elements.forEach(element => {
    const positionFromTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (positionFromTop - windowHeight <= 0) {
      element.classList.add('visible');
    }
  });
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('nav ul li a');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu ul li a');
  
  // Find matching link and add active class
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (isActivePath(currentLocation, linkPath)) {
      link.classList.add('active');
    }
  });
  
  mobileNavLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (isActivePath(currentLocation, linkPath)) {
      link.classList.add('active');
    }
  });
}

function isActivePath(currentPath, linkPath) {
  // Check if the paths match directly
  if (currentPath === linkPath) return true;
  
  // Check for index pages
  if (linkPath.endsWith('index.html') && currentPath === '/') return true;
  
  // Check for section anchors
  if (currentPath.includes('#') && linkPath === currentPath.split('#')[0]) return true;
  
  return false;
}

// Utility Functions
function initializeUtils() {
  // Create global utility object
  window.sumatoUtils = {
    // Form validation
    validateForm: function(formElement) {
      let isValid = true;
      const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          this.markInvalid(input, 'This field is required');
          isValid = false;
        } else if (input.type === 'email' && !this.validateEmail(input.value)) {
          this.markInvalid(input, 'Please enter a valid email address');
          isValid = false;
        } else {
          this.markValid(input);
        }
      });
      
      return isValid;
    },
    
    // Email validation
    validateEmail: function(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    
    // Mark field as invalid
    markInvalid: function(inputElement, message) {
      inputElement.classList.add('invalid');
      
      let errorElement = inputElement.parentElement.querySelector('.error-message');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        inputElement.parentElement.appendChild(errorElement);
      }
      
      errorElement.textContent = message;
    },
    
    // Mark field as valid
    markValid: function(inputElement) {
      inputElement.classList.remove('invalid');
      
      const errorElement = inputElement.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    },
    
    // Show message
    showMessage: function(container, text, type = 'success') {
      // Remove existing messages
      const existingMessages = container.querySelectorAll('.message');
      existingMessages.forEach(msg => msg.remove());
      
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `message ${type}`;
      messageElement.textContent = text;
      
      // Add to container at the top
      container.prepend(messageElement);
      
      // Auto remove after delay
      setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
          messageElement.remove();
        }, 250);
      }, 3000);
    }
  };
}

// Back to Top Button
function initBackToTop() {
  // Create back to top button if it doesn't exist
  let backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTopBtn);
  }
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Smooth scroll to top when clicked
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
        
        // Scroll to target (without smooth behavior for reduced animation)
        targetElement.scrollIntoView({
          block: 'start'
        });
      }
    });
  });
}

// Page Transitions
function initPageTransitions() {
  // Add event listener to all internal links
  document.querySelectorAll('a:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="javascript:"]):not([target="_blank"])').forEach(link => {
    // Only apply to internal links
    if (link.hostname === window.location.hostname) {
      link.addEventListener('click', function(e) {
        const target = this.getAttribute('href');
        
        // Skip if modifier keys are pressed
        if (e.metaKey || e.ctrlKey) return;
        
        e.preventDefault();
        
        // Faster page transition
        document.body.classList.add('page-transition');
        
        setTimeout(() => {
          window.location.href = target;
        }, 150);
      });
    }
  });
}

// Lazy Loading for Images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (lazyImages.length) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('lazy-load');
          
          // Make image visible sooner
          setTimeout(() => {
            img.classList.add('loaded');
          }, 50);
          
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Prevent XSS in forms
document.addEventListener('submit', function(e) {
  const form = e.target;
  const inputs = form.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    if (input.type !== 'password' && input.type !== 'file' && input.type !== 'checkbox' && input.type !== 'radio') {
      // Sanitize input values
      input.value = sanitizeInput(input.value);
    }
  });
});

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  const temp = document.createElement('div');
  temp.textContent = input;
  return temp.innerHTML;
}

// Debounce function for performance optimization
function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
} 