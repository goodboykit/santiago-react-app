// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
  // For production, use the deployed backend URL directly
  if (import.meta.env.PROD) {
    return 'https://santiago-react-app-f25a-klt4kv8hw-kit-santiagos-projects.vercel.app/api';
  }
  // For development, use the local backend URL
  return 'http://localhost:5000/api';
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getApiBaseUrl();

class UserService {
  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  // Get user info from localStorage
  getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Set user info in localStorage
  setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  // Create request headers with authorization
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Handle API response
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  // Register user
  async registerUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await this.handleResponse(response);
      
      if (data.success && data.data) {
        this.setAuthToken(data.data.token);
        this.setUserInfo(data.data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async loginUser(credentials) {
    try {
      // Use fetch directly with the deployed API URL in production
      const apiUrl = `${API_BASE_URL}/users/login`;
      
      console.log(`Logging in with ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`Login failed with status ${response.status}: ${errorText}`);
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        this.setAuthToken(data.data.token);
        this.setUserInfo(data.data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      const data = await this.handleResponse(response);
      
      if (data.success && data.data) {
        this.setUserInfo(data.data);
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  // Delete user (admin only)
  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    this.removeAuthToken();
    // Redirect to login page or handle logout logic
    window.location.href = '/auth/login';
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    const userInfo = this.getUserInfo();
    return !!(token && userInfo);
  }

  // Check if user is admin
  isAdmin() {
    const userInfo = this.getUserInfo();
    return userInfo && userInfo.role === 'admin';
  }

  // Check if user is editor
  isEditor() {
    const userInfo = this.getUserInfo();
    return userInfo && (userInfo.role === 'editor' || userInfo.role === 'admin');
  }
}

// Export a singleton instance
export default new UserService();