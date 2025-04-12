// Utilities JavaScript for Sumato Technology Website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize smooth scrolling
  initSmoothScrolling();
  
  // Add page transition effects
  initPageTransitions();
  
  // Initialize lazy loading
  initLazyLoading();
});

// Smooth Scrolling
function initSmoothScrolling() {
  // Get all anchor links that have a hash
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Smooth scroll to the element
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for header height
          behavior: 'smooth'
        });
        
        // Update URL without refreshing the page
        history.pushState(null, null, targetId);
      }
    });
  });
}

// Page Transitions
function initPageTransitions() {
  // Add fade-in effect to page content
  document.body.classList.add('page-loaded');
  
  // Handle internal links for page transitions
  const internalLinks = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip for non-html links
      if (!href.endsWith('.html') && !href.endsWith('/')) return;
      
      e.preventDefault();
      
      // Fade out content
      document.body.classList.add('page-transitioning');
      
      // Navigate after transition
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

// Lazy Loading for Images and Content
function initLazyLoading() {
  // Use Intersection Observer API for lazy loading
  if ('IntersectionObserver' in window) {
    const lazyItems = document.querySelectorAll('.lazy-load');
    
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyItem = entry.target;
          
          // If it's an image with data-src
          if (lazyItem.tagName === 'IMG' && lazyItem.dataset.src) {
            lazyItem.src = lazyItem.dataset.src;
            lazyItem.removeAttribute('data-src');
          }
          
          // Add loaded class for CSS transitions
          lazyItem.classList.add('loaded');
          
          // Stop observing this element
          lazyObserver.unobserve(lazyItem);
        }
      });
    }, {
      rootMargin: '100px 0px', // Load items just before they come into view
      threshold: 0.1
    });
    
    lazyItems.forEach(item => {
      lazyObserver.observe(item);
    });
  }
} 