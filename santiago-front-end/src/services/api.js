// API Service for connecting to the backend

// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
  // For production, use the deployed backend URL
  if (import.meta.env.PROD) {
    // Use the full URL to the backend
    return 'https://santiago-react-app-f25a-5rl877hkh-kit-santiagos-projects.vercel.app/api';
  }
  // For development, use the local backend URL
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'An error occurred while connecting to the server'
    }));
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Helper function to handle fetch errors
const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      mode: 'cors'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error(error.message || 'Network request failed');
  }
};

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    return safeFetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login a user
  login: async (credentials) => {
    return safeFetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Get the current user's profile
  getProfile: async (token) => {
    return safeFetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Articles API calls
export const articlesAPI = {
  // Get all articles
  getAllArticles: async () => {
    return safeFetch(`${API_BASE_URL}/articles`);
  },

  // Get a single article by name
  getArticleByName: async (name) => {
    return safeFetch(`${API_BASE_URL}/articles/${name}`);
  }
};

export default {
  auth: authAPI,
  articles: articlesAPI,
  baseUrl: API_BASE_URL
}; 