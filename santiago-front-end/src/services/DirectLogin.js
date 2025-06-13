/**
 * Direct Login Service
 * This service bypasses the regular API calls and connects directly to the backend
 * to avoid any CORS or redirection issues
 */

// The backend URL - hardcoded for reliability with fallbacks
const BACKEND_URLS = [
  'https://santiago-react-app-f25a-klt4kv8hw-kit-santiagos-projects.vercel.app/api',
  'https://santiago-react-app-f25a.vercel.app/api',
  'https://santiago-react-app.vercel.app/api'
];

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
  // Try each URL in succession until one works
  let lastError = null;
  
  for (const url of BACKEND_URLS) {
    try {
      console.log(`Attempting direct login to: ${url}/users/login`);
      
      // Use a very simple fetch call to avoid any issues
      const response = await fetch(`${url}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log(`Response status from ${url}: ${response.status}`);
      
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
        
        // Also store the successful URL for future use
        localStorage.setItem('successful_api_url', url);
      }
      
      return data;
    } catch (error) {
      console.error(`Login attempt to ${url} failed:`, error);
      lastError = error;
      // Continue to try the next URL
    }
  }
  
  // If we got here, all URLs failed
  console.error('All login attempts failed');
  throw lastError || new Error('Login failed after trying all backend URLs');
};

/**
 * Get the last successful API URL or the first one in our list
 */
export const getSuccessfulApiUrl = () => {
  return localStorage.getItem('successful_api_url') || BACKEND_URLS[0];
};

export default {
  directLogin,
  getSuccessfulApiUrl
}; 