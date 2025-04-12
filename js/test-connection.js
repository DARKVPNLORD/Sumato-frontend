// Test connection to backend API
console.log('Testing connection to backend API...');
console.log('API URL:', API_URL);

// Test the root endpoint
fetch('https://sumato-technology-api.onrender.com')
  .then(response => {
    console.log('Root endpoint status:', response.status, response.ok);
    return response.text();
  })
  .then(data => {
    console.log('Response from root endpoint:', data);
  })
  .catch(error => {
    console.error('Error connecting to root endpoint:', error);
  });

// Test the auth endpoint
fetch(`${API_URL}/auth/register`, {
  method: 'OPTIONS',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    console.log('Auth endpoint CORS test status:', response.status, response.ok);
  })
  .catch(error => {
    console.error('CORS error connecting to auth endpoint:', error);
  }); 