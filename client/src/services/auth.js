import api from './api';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post(`${import.meta.env.VITE_USER_URL}/register`, {
        FirstName: userData.firstName,
        LastName: userData.lastName,
        Email: userData.email,
        password: userData.password
      });

      if (response.data.ok) {
        // Store tokens and user data
        if (response.data.session) {
          localStorage.setItem('accessToken', response.data.session.access_token);
          localStorage.setItem('refreshToken', response.data.session.refresh_token);
        }
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await api.post(`${import.meta.env.VITE_USER_URL}/login`, {
        Email: credentials.email,
        password: credentials.password
      });

      if (response.data.ok) {
        // Store tokens and user data
        if (response.data.session) {
          localStorage.setItem('accessToken', response.data.session.access_token);
          localStorage.setItem('refreshToken', response.data.session.refresh_token);
        }
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.log("Error getting current user", error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      const details = error.response.data?.details;
      
      return {
        message,
        details,
        status: error.response.status
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

export default new AuthService();