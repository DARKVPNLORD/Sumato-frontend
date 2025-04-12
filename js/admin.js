// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize admin sidebar toggle
  initializeSidebar();
  
  // Initialize any data tables
  initializeTables();
  
  // Initialize any forms in the admin panel
  initializeForms();
  
  // Initialize responsive features
  initializeResponsive();
});

// Sidebar Toggle
function initializeSidebar() {
  const sidebarToggle = document.querySelector('.toggle-sidebar');
  const sidebar = document.querySelector('.admin-sidebar');
  const mainContent = document.querySelector('.admin-main');
  
  if (sidebarToggle && sidebar && mainContent) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      mainContent.classList.toggle('pushed');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
      if (window.innerWidth < 992) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target) && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          mainContent.classList.remove('pushed');
        }
      }
    });
  }
  
  // Set active item in sidebar
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.nav-link');
  
  sidebarLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.includes(linkPath) && linkPath !== '#') {
      link.closest('.nav-item').classList.add('active');
    }
  });
}

// Table Initialization
function initializeTables() {
  // Initialize data tables if any
  const dataTables = document.querySelectorAll('.data-table');
  
  dataTables.forEach(table => {
    // Add event listeners for table actions
    const actionButtons = table.querySelectorAll('.table-actions button');
    
    actionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        const itemId = this.closest('tr').getAttribute('data-id');
        
        if (action === 'edit') {
          handleEditItem(itemId);
        } else if (action === 'delete') {
          handleDeleteItem(itemId, this.closest('tr'));
        } else if (action === 'view') {
          handleViewItem(itemId);
        }
      });
    });
  });
  
  // Handle pagination
  const paginationItems = document.querySelectorAll('.pagination-item');
  
  paginationItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      paginationItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // In a real implementation, you would fetch the corresponding page data here
      console.log('Pagination item clicked:', this.textContent);
    });
  });
}

// Form Initialization
function initializeForms() {
  // Initialize any admin forms
  const adminForms = document.querySelectorAll('.admin-form');
  
  adminForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (window.sumatoUtils.validateForm(form)) {
        submitAdminForm(form);
      }
    });
    
    // Add input validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
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
  });
  
  // Initialize any filtering forms
  const filterForms = document.querySelectorAll('.filter-form');
  
  filterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      applyFilters(form);
    });
    
    // Apply filters on select change if auto-submit is enabled
    const autoSubmitSelects = form.querySelectorAll('select[data-auto-submit="true"]');
    autoSubmitSelects.forEach(select => {
      select.addEventListener('change', function() {
        form.dispatchEvent(new Event('submit'));
      });
    });
  });
}

// Responsive Features
function initializeResponsive() {
  // Handle responsive behavior
  function handleResize() {
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');
    
    if (window.innerWidth >= 992) {
      if (sidebar) sidebar.classList.add('open');
      if (mainContent) mainContent.classList.add('pushed');
    } else {
      if (sidebar) sidebar.classList.remove('open');
      if (mainContent) mainContent.classList.remove('pushed');
    }
  }
  
  // Initial check
  handleResize();
  
  // Listen for window resize
  window.addEventListener('resize', handleResize);
}

// Form Helpers
function markInvalid(inputElement, message) {
  inputElement.classList.add('invalid');
  
  // Add error message if it doesn't exist
  let errorElement = inputElement.parentElement.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    inputElement.parentElement.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
}

function markValid(inputElement) {
  inputElement.classList.remove('invalid');
  
  // Remove error message if it exists
  const errorElement = inputElement.parentElement.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

// API Handlers
function submitAdminForm(formElement) {
  // Show loading state
  const submitButton = formElement.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';
  
  const formData = new FormData(formElement);
  const formValues = {};
  
  // Convert FormData to object
  formData.forEach((value, key) => {
    formValues[key] = value;
  });
  
  // In a real implementation, you would send this data to your backend API
  // For now, we'll simulate an API call with a timeout
  setTimeout(() => {
    console.log('Form would be submitted with:', formValues);
    
    // Reset form and show success message
    formElement.reset();
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    
    // Show success message
    const formContainer = formElement.closest('.panel-body');
    window.sumatoUtils.showMessage(
      formContainer, 
      'Form submitted successfully!',
      'success'
    );
    
  }, 1500); // Simulate network delay
}

function applyFilters(formElement) {
  // Get filter values
  const formData = new FormData(formElement);
  const filters = {};
  
  // Convert FormData to object
  formData.forEach((value, key) => {
    if (value) { // Only include non-empty values
      filters[key] = value;
    }
  });
  
  // In a real implementation, you would fetch filtered data from your backend API
  console.log('Filters would be applied:', filters);
  
  // For demonstration, we'll just show a loading state
  const filterButton = formElement.querySelector('button[type="submit"]');
  if (filterButton) {
    const originalButtonText = filterButton.textContent;
    filterButton.disabled = true;
    filterButton.textContent = 'Filtering...';
    
    setTimeout(() => {
      filterButton.disabled = false;
      filterButton.textContent = originalButtonText;
      
      // Show message
      const panelBody = formElement.closest('.panel-body') || formElement.closest('.data-panel');
      if (panelBody) {
        window.sumatoUtils.showMessage(
          panelBody, 
          'Filters applied successfully!',
          'success'
        );
      }
    }, 1000);
  }
}

// Action Handlers
function handleEditItem(itemId) {
  console.log('Edit item with ID:', itemId);
  
  // In a real implementation, you might show a modal or redirect to an edit page
  alert(`Edit item with ID: ${itemId}`);
}

function handleDeleteItem(itemId, tableRow) {
  console.log('Delete item with ID:', itemId);
  
  // Confirm deletion
  if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
    // In a real implementation, you would send a delete request to your API
    
    // For demonstration, we'll simulate the deletion with a timeout
    tableRow.style.opacity = '0.5';
    
    setTimeout(() => {
      // Remove the row from the table
      tableRow.remove();
      
      // Show success message
      const tableContainer = document.querySelector('.data-panel');
      if (tableContainer) {
        window.sumatoUtils.showMessage(
          tableContainer, 
          'Item deleted successfully!',
          'success'
        );
      }
    }, 1000);
  }
}

function handleViewItem(itemId) {
  console.log('View item with ID:', itemId);
  
  // In a real implementation, you might show a modal or redirect to a details page
  alert(`View item with ID: ${itemId}`);
}

// Handle request responses
function handleRequestResponse(requestId, action) {
  console.log(`${action} request with ID:`, requestId);
  
  const requestCard = document.querySelector(`[data-request-id="${requestId}"]`);
  
  if (requestCard) {
    // Update the request status
    const statusElement = requestCard.querySelector('.request-status');
    
    if (statusElement) {
      statusElement.className = 'request-status';
      
      if (action === 'approve') {
        statusElement.textContent = 'Accepted';
        statusElement.classList.add('accepted');
      } else if (action === 'reject') {
        statusElement.textContent = 'Rejected';
        statusElement.classList.add('rejected');
      }
    }
    
    // In a real implementation, you would send this action to your backend API
    
    // Show success message
    const requestsContainer = document.querySelector('.requests-grid').parentElement;
    window.sumatoUtils.showMessage(
      requestsContainer, 
      `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`,
      'success'
    );
  }
} 