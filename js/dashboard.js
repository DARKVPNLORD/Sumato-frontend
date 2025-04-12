// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if not logged in
    window.location.href = 'login.html';
    return;
  }

  // Load dashboard data
  loadDashboardData();

  // Initialize event listeners
  initializeListeners();
});

function loadDashboardData() {
  const quotesContainer = document.querySelector('.quotes-container');
  const ordersContainer = document.querySelector('.orders-container');
  
  // Show loading state
  if (quotesContainer) {
    quotesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading quotes...</div>';
  }
  
  if (ordersContainer) {
    ordersContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading orders...</div>';
  }
  
  // Fetch dashboard data from API
  fetch(ENDPOINTS.USER.DASHBOARD, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load dashboard data');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // Update user profile info
      updateProfileInfo(data.dashboardData.user);
      
      // Update quotes section
      updateQuotesSection(data.dashboardData.recentQuotes);
      
      // Update orders section (when implemented)
      updateOrdersSection(data.dashboardData.pendingOrders);
    } else {
      showError('Failed to load dashboard data');
    }
  })
  .catch(error => {
    console.error('Dashboard loading error:', error);
    showError('An error occurred while loading your dashboard. Please try again later.');
  });
}

function updateProfileInfo(user) {
  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email');
  const userCompanyElement = document.getElementById('user-company');
  
  if (userNameElement) {
    userNameElement.textContent = `${user.firstName} ${user.lastName}`;
  }
  
  if (userEmailElement) {
    userEmailElement.textContent = user.email;
  }
  
  if (userCompanyElement && user.company) {
    userCompanyElement.textContent = user.company;
  }
  
  // Update profile image if available
  const profileImageElement = document.getElementById('profile-image');
  if (profileImageElement && user.profileImage) {
    profileImageElement.src = user.profileImage;
    profileImageElement.alt = `${user.firstName} ${user.lastName}`;
  }
}

function updateQuotesSection(quotes) {
  const quotesContainer = document.querySelector('.quotes-container');
  
  if (!quotesContainer) return;
  
  if (!quotes || quotes.length === 0) {
    // Show empty state
    quotesContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file-invoice"></i>
        <p>No quotes yet</p>
        <a href="contact.html" class="btn btn-outline">Request a Quote</a>
      </div>
    `;
    return;
  }
  
  // Create quotes list
  let quotesHTML = '<div class="dashboard-table"><table>';
  quotesHTML += '<thead><tr><th>Subject</th><th>Status</th><th>Date</th></tr></thead><tbody>';
  
  quotes.forEach(quote => {
    const date = new Date(quote.createdAt).toLocaleDateString();
    quotesHTML += `
      <tr>
        <td>${quote.subject}</td>
        <td><span class="status-badge ${quote.status}">${formatStatus(quote.status)}</span></td>
        <td>${date}</td>
      </tr>
    `;
  });
  
  quotesHTML += '</tbody></table></div>';
  
  // Add view all link if there are quotes
  quotesHTML += '<div class="view-all-link"><a href="quotes.html">View all quotes</a></div>';
  
  quotesContainer.innerHTML = quotesHTML;
}

function updateOrdersSection(orders) {
  const ordersContainer = document.querySelector('.orders-container');
  
  if (!ordersContainer) return;
  
  if (!orders || orders.length === 0) {
    // Show empty state
    ordersContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-shopping-cart"></i>
        <p>No orders yet</p>
        <a href="products.html" class="btn btn-outline">Browse Products</a>
      </div>
    `;
    return;
  }
  
  // Create orders list (to be implemented in the future)
  ordersContainer.innerHTML = '<div class="empty-state"><p>Order history will be available soon</p></div>';
}

function formatStatus(status) {
  // Convert status from kebab-case to title case
  const words = status.split('-');
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function initializeListeners() {
  // Logout button
  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
  }
  
  // Profile edit button (if implemented)
  const editProfileButton = document.getElementById('edit-profile-btn');
  if (editProfileButton) {
    editProfileButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Show profile edit modal/form
    });
  }
}

function showError(message) {
  const dashboardContent = document.querySelector('.dashboard-content');
  
  if (dashboardContent) {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-error';
    errorElement.textContent = message;
    
    // Insert at the top of the dashboard
    dashboardContent.insertBefore(errorElement, dashboardContent.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }
} 