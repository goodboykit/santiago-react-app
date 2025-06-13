// API Service for connecting to the backend

// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
  // For production, use the deployed backend URL
  if (import.meta.env.PROD) {
    return 'https://santiago-react-app-f25a-p2nk12v84-kit-santiagos-projects.vercel.app/api';
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

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Login a user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  // Get the current user's profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};

// Articles API calls
export const articlesAPI = {
  // Get all articles
  getAllArticles: async () => {
    const response = await fetch(`${API_BASE_URL}/articles`);
    return handleResponse(response);
  },

  // Get a single article by name
  getArticleByName: async (name) => {
    const response = await fetch(`${API_BASE_URL}/articles/${name}`);
    return handleResponse(response);
  }
};

export default {
  auth: authAPI,
  articles: articlesAPI,
  baseUrl: API_BASE_URL
}; 