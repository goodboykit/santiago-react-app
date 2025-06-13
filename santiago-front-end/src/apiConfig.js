/**
 * Global API Configuration
 * This file overrides all API endpoints to ensure they point to the correct location
 */
import { getSuccessfulApiUrl } from './services/DirectLogin';

// The base URLs to try for API requests in order of preference
const API_URLS = [
  'https://santiago-react-app-f25a-klt4kv8hw-kit-santiagos-projects.vercel.app/api',
  'https://santiago-react-app-f25a.vercel.app/api',
  'https://santiago-react-app.vercel.app/api'
];

// Get the API base URL based on environment or previously successful URL
export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Try to use a previously successful URL first
    const successfulUrl = getSuccessfulApiUrl();
    if (successfulUrl) return successfulUrl;
    
    // Otherwise use the first one in our list
    return API_URLS[0];
  }
  // For development, use the local backend URL
  return 'http://localhost:5000/api';
};

// Export the base URL
export const API_BASE_URL = getApiBaseUrl();

// Override fetch globally to redirect localhost:5001 requests to the correct endpoint
const originalFetch = window.fetch;

window.fetch = function(url, options = {}) {
  let modifiedUrl = url;
  let modifiedOptions = { ...options };
  
  // Check if this is a localhost:5001 request and modify it
  if (typeof url === 'string' && url.includes('localhost:5001')) {
    // Replace with the proper URL
    if (import.meta.env.PROD) {
      modifiedUrl = url.replace('http://localhost:5001/api', getApiBaseUrl());
      console.log(`[API Redirect] Redirecting ${url} to ${modifiedUrl}`);
    } else {
      modifiedUrl = url.replace('localhost:5001', 'localhost:5000');
      console.log(`[API Redirect] Redirecting ${url} to ${modifiedUrl}`);
    }
  }
  
  // Also redirect old URLs to the latest one
  if (typeof url === 'string' && (
    url.includes('vercel.app/api')
  )) {
    // Only replace if it's not already pointing to our current API URL
    if (!url.includes(getApiBaseUrl())) {
      modifiedUrl = url.replace(/https:\/santiago-react-app[^/]*\/api/g, getApiBaseUrl());
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
  
  // Add Accept header
  if (!modifiedOptions.headers['Accept']) {
    modifiedOptions.headers['Accept'] = 'application/json';
  }
  
  // Set credentials to 'omit' for cross-origin requests to avoid CORS preflight issues
  if (modifiedUrl.includes('vercel.app')) {
    modifiedOptions.credentials = 'omit';
    modifiedOptions.mode = 'cors';
  }
  
  // Call the original fetch with the modified URL and options
  return originalFetch(modifiedUrl, modifiedOptions)
    .catch(error => {
      // If fetch fails with the current URL, try all other URLs
      if (import.meta.env.PROD && typeof url === 'string' && url.includes('vercel.app/api')) {
        console.error(`Fetch failed for ${modifiedUrl}, trying alternate URLs`, error);
        
        // Create a queue of URLs to try (excluding the one that just failed)
        const urlsToTry = API_URLS.filter(apiUrl => !modifiedUrl.includes(apiUrl));
        
        // Try each URL in succession
        const tryNextUrl = (index) => {
          if (index >= urlsToTry.length) {
            // If all URLs failed, rethrow the original error
            console.error('All API URLs failed');
            throw error;
          }
          
          const nextUrl = urlsToTry[index];
          const nextModifiedUrl = modifiedUrl.replace(/https:\/santiago-react-app[^/]*\/api/g, nextUrl);
          
          console.log(`Trying alternate URL: ${nextModifiedUrl}`);
          
          return originalFetch(nextModifiedUrl, modifiedOptions)
            .then(response => {
              // If successful, store this URL for future use
              if (response.ok) {
                localStorage.setItem('successful_api_url', nextUrl);
              }
              return response;
            })
            .catch(nextError => {
              // If this URL also failed, try the next one
              console.error(`Fetch failed for ${nextModifiedUrl}`, nextError);
              return tryNextUrl(index + 1);
            });
        };
        
        // Start trying alternate URLs
        return tryNextUrl(0);
      }
      
      // If not a production API call or no alternates to try, just throw the error
      throw error;
    });
};

// Export a helper function to get the correct API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${getApiBaseUrl()}/${cleanEndpoint}`;
};

export default {
  API_BASE_URL,
  getApiUrl,
  getApiBaseUrl
}; 