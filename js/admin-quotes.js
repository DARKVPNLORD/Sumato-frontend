// Admin Quotes Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Check if admin is logged in
  const token = localStorage.getItem('adminToken');
  if (!token) {
    // Redirect to admin login if not logged in
    window.location.href = 'admin-login.html';
    return;
  }

  // Initialize pagination
  let currentPage = 1;
  let totalPages = 1;
  let currentFilter = {};

  // Load quotes on page load
  loadQuotes(currentPage, currentFilter);

  // Initialize event listeners
  initializeListeners();

  // Initialize filter form
  initializeFilterForm();

  function loadQuotes(page, filter = {}) {
    const quotesContainer = document.getElementById('quotes-container');
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!quotesContainer) return;
    
    // Show loading state
    quotesContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading quotes...</div>';
    
    // Build query string from filter
    let queryParams = `page=${page}&limit=10`;
    if (filter.status) {
      queryParams += `&status=${filter.status}`;
    }
    
    // Fetch quotes from API
    fetch(`/api/quotes/admin?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load quotes');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Update pagination info
        currentPage = data.pagination.page;
        totalPages = data.pagination.pages;
        updatePagination(paginationContainer, currentPage, totalPages);
        
        // Render quotes
        renderQuotes(quotesContainer, data.quotes);
      } else {
        showError('Failed to load quotes');
      }
    })
    .catch(error => {
      console.error('Loading quotes error:', error);
      quotesContainer.innerHTML = '<div class="error-message">Failed to load quotes. Please try again later.</div>';
    });
  }

  function renderQuotes(container, quotes) {
    if (!quotes || quotes.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-file-invoice"></i><p>No quotes found</p></div>';
      return;
    }
    
    let html = '<div class="table-responsive"><table class="table quotes-table">';
    html += '<thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    
    quotes.forEach(quote => {
      const date = new Date(quote.createdAt).toLocaleDateString();
      
      html += `
        <tr data-id="${quote._id}">
          <td>${date}</td>
          <td>${quote.fullName}</td>
          <td>${quote.email}</td>
          <td>${quote.subject}</td>
          <td><span class="status-badge ${quote.status}">${formatStatus(quote.status)}</span></td>
          <td>
            <button class="btn btn-sm btn-primary view-quote" data-id="${quote._id}">
              <i class="fas fa-eye"></i> View
            </button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
    
    // Add event listeners to view buttons
    const viewButtons = container.querySelectorAll('.view-quote');
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const quoteId = this.getAttribute('data-id');
        openQuoteModal(quoteId);
      });
    });
  }

  function updatePagination(container, currentPage, totalPages) {
    if (!container) return;
    
    let html = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
      html += `<button class="pagination-btn prev-page"><i class="fas fa-chevron-left"></i> Previous</button>`;
    } else {
      html += `<button class="pagination-btn prev-page" disabled><i class="fas fa-chevron-left"></i> Previous</button>`;
    }
    
    // Page numbers
    html += `<span class="pagination-info">Page ${currentPage} of ${totalPages}</span>`;
    
    // Next button
    if (currentPage < totalPages) {
      html += `<button class="pagination-btn next-page">Next <i class="fas fa-chevron-right"></i></button>`;
    } else {
      html += `<button class="pagination-btn next-page" disabled>Next <i class="fas fa-chevron-right"></i></button>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add event listeners to pagination buttons
    const prevButton = container.querySelector('.prev-page');
    const nextButton = container.querySelector('.next-page');
    
    if (prevButton && !prevButton.disabled) {
      prevButton.addEventListener('click', function() {
        loadQuotes(currentPage - 1, currentFilter);
      });
    }
    
    if (nextButton && !nextButton.disabled) {
      nextButton.addEventListener('click', function() {
        loadQuotes(currentPage + 1, currentFilter);
      });
    }
  }

  function initializeFilterForm() {
    const filterForm = document.getElementById('quotes-filter-form');
    
    if (filterForm) {
      filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const status = document.getElementById('status-filter').value;
        
        currentFilter = {};
        if (status) {
          currentFilter.status = status;
        }
        
        // Reset to first page when filtering
        loadQuotes(1, currentFilter);
      });
      
      // Reset button
      const resetButton = filterForm.querySelector('.reset-filter');
      if (resetButton) {
        resetButton.addEventListener('click', function() {
          document.getElementById('status-filter').value = '';
          currentFilter = {};
          loadQuotes(1, {});
        });
      }
    }
  }

  function openQuoteModal(quoteId) {
    // Fetch quote details
    fetch(`/api/quotes/admin/${quoteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load quote details');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        showQuoteModal(data.quote);
      } else {
        showError('Failed to load quote details');
      }
    })
    .catch(error => {
      console.error('Loading quote details error:', error);
      showError('Failed to load quote details');
    });
  }

  function showQuoteModal(quote) {
    // Create modal HTML
    const modalHTML = `
      <div class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Quote Request Details</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="quote-details">
              <div class="detail-row">
                <div class="detail-label">Date:</div>
                <div class="detail-value">${new Date(quote.createdAt).toLocaleString()}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value">
                  <span class="status-badge ${quote.status}">${formatStatus(quote.status)}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Name:</div>
                <div class="detail-value">${quote.fullName}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">${quote.email}</div>
              </div>
              ${quote.phone ? `
                <div class="detail-row">
                  <div class="detail-label">Phone:</div>
                  <div class="detail-value">${quote.phone}</div>
                </div>
              ` : ''}
              <div class="detail-row">
                <div class="detail-label">Subject:</div>
                <div class="detail-value">${quote.subject}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Message:</div>
                <div class="detail-value message-text">${quote.message}</div>
              </div>
              ${quote.notes ? `
                <div class="detail-row">
                  <div class="detail-label">Admin Notes:</div>
                  <div class="detail-value">${quote.notes}</div>
                </div>
              ` : ''}
            </div>
            
            <form id="update-quote-form" class="update-form">
              <h4>Update Quote Status</h4>
              <div class="form-group">
                <label for="quote-status">Status</label>
                <select id="quote-status" name="status" class="form-control" required>
                  <option value="pending" ${quote.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="reviewed" ${quote.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                  <option value="in-progress" ${quote.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                  <option value="completed" ${quote.status === 'completed' ? 'selected' : ''}>Completed</option>
                  <option value="rejected" ${quote.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
              </div>
              <div class="form-group">
                <label for="quote-notes">Admin Notes</label>
                <textarea id="quote-notes" name="notes" class="form-control" rows="3">${quote.notes || ''}</textarea>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary">Update Quote</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    
    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    const closeButton = modalContainer.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
      modalContainer.remove();
    });
    
    // Close modal when clicking overlay
    const overlay = modalContainer.querySelector('.modal-overlay');
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        modalContainer.remove();
      }
    });
    
    // Form submission
    const updateForm = modalContainer.querySelector('#update-quote-form');
    updateForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const status = document.getElementById('quote-status').value;
      const notes = document.getElementById('quote-notes').value;
      
      // Update quote
      updateQuoteStatus(quote._id, { status, notes }, function() {
        // On success, close modal and reload quotes
        modalContainer.remove();
        loadQuotes(currentPage, currentFilter);
      });
    });
  }

  function updateQuoteStatus(quoteId, data, callback) {
    fetch(`/api/quotes/admin/${quoteId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update quote');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        showSuccess('Quote updated successfully');
        if (callback) callback();
      } else {
        showError('Failed to update quote');
      }
    })
    .catch(error => {
      console.error('Update quote error:', error);
      showError('Failed to update quote');
    });
  }

  function initializeListeners() {
    // Logout button
    const logoutButton = document.getElementById('admin-logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear admin authentication data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        
        // Redirect to admin login
        window.location.href = 'admin-login.html';
      });
    }
  }

  function formatStatus(status) {
    // Convert status from kebab-case to title case
    const words = status.split('-');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  function showError(message) {
    const alertsContainer = document.getElementById('alerts-container');
    
    if (alertsContainer) {
      const alert = document.createElement('div');
      alert.className = 'alert alert-danger';
      alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
      
      alertsContainer.appendChild(alert);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        alert.remove();
      }, 5000);
    }
  }

  function showSuccess(message) {
    const alertsContainer = document.getElementById('alerts-container');
    
    if (alertsContainer) {
      const alert = document.createElement('div');
      alert.className = 'alert alert-success';
      alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
      
      alertsContainer.appendChild(alert);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        alert.remove();
      }, 5000);
    }
  }
}); 