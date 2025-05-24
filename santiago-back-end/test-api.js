const fetch = require('node-fetch');

// Base URL for the API
const API_URL = 'http://localhost:5001/api';

// Test the health endpoint
async function testHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('Health check:', data);
    return data.success;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

// Test the login endpoint
async function testLogin() {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123',
      }),
    });
    const data = await response.json();
    console.log('Login result:', data);
    return data.success ? data.data.token : null;
  } catch (error) {
    console.error('Login failed:', error.message);
    return null;
  }
}

// Test getting all users (admin only)
async function testGetUsers(token) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('Users:', data);
    return data.success;
  } catch (error) {
    console.error('Get users failed:', error.message);
    return false;
  }
}

// Test getting all articles
async function testGetArticles() {
  try {
    const response = await fetch(`${API_URL}/articles`);
    const data = await response.json();
    console.log('Articles:', data);
    return data.success;
  } catch (error) {
    console.error('Get articles failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Running API tests...');
  
  // Test health endpoint
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('Health check failed. Make sure the server is running.');
    return;
  }
  
  // Test login
  const token = await testLogin();
  if (!token) {
    console.error('Login failed. Check credentials or server implementation.');
    return;
  }
  
  // Test getting users
  await testGetUsers(token);
  
  // Test getting articles
  await testGetArticles();
  
  console.log('All tests completed!');
}

// Run the tests
runTests(); 