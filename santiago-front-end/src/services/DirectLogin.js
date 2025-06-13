/**
 * Direct Login Service
 * This service bypasses the regular API calls and connects directly to the backend
 * to avoid any CORS or redirection issues
 */

// The backend URL - hardcoded for reliability
const BACKEND_URL = 'https://santiago-react-app-f25a-kewd64qde-kit-santiagos-projects.vercel.app/api';

// Store auth token and user data in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const setUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

/**
 * Direct login function that uses fetch with minimal configuration
 * @param {Object} credentials - Email and password
 * @returns {Promise} - Login result
 */
export const directLogin = async (credentials) => {
  console.log(`Attempting direct login to ${BACKEND_URL}/users/login`);
  
  try {
    // Use a very simple fetch call to avoid any issues
    const response = await fetch(`${BACKEND_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials),
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Login failed with status ${response.status}: ${errorText}`);
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Login successful, storing token and user info');
    
    if (data.success && data.data) {
      // Store the token and user info
      setAuthToken(data.data.token);
      setUserInfo(data.data.user);
    }
    
    return data;
  } catch (error) {
    console.error('Direct login error:', error);
    throw error;
  }
};

export default {
  directLogin
}; 