/**
 * Global API Configuration
 * This file overrides all API endpoints to ensure they point to the correct location
 */

// The base URL for API requests
export const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

// For testing, define the deployed backend URL directly
export const DEPLOYED_API_URL = 'https://santiago-react-app-f25a-p2nk12v84-kit-santiagos-projects.vercel.app/api';

// Override fetch globally to redirect localhost:5001 requests to the correct endpoint
const originalFetch = window.fetch;

window.fetch = function(url, options = {}) {
  let modifiedUrl = url;
  let modifiedOptions = { ...options };
  
  // Check if this is a localhost:5001 request and modify it
  if (typeof url === 'string' && url.includes('localhost:5001')) {
    // In production, use the relative API path which will be handled by the proxy
    if (import.meta.env.PROD) {
      modifiedUrl = url.replace('http://localhost:5001/api', '/api');
      console.log(`[API Redirect] Redirecting ${url} to ${modifiedUrl}`);
    } else {
      // In development, redirect to localhost:5000
      modifiedUrl = url.replace('localhost:5001', 'localhost:5000');
      console.log(`[API Redirect] Redirecting ${url} to ${modifiedUrl}`);
    }
  }
  
  // Add CORS headers for all API requests
  if (!modifiedOptions.headers) {
    modifiedOptions.headers = {};
  }
  
  // Ensure content-type is set properly
  if (modifiedOptions.body && !modifiedOptions.headers['Content-Type']) {
    modifiedOptions.headers['Content-Type'] = 'application/json';
  }
  
  // Call the original fetch with the modified URL and options
  return originalFetch(modifiedUrl, modifiedOptions);
};

// Export a helper function to get the correct API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default {
  API_BASE_URL,
  DEPLOYED_API_URL,
  getApiUrl
}; 