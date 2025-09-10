import api from './api';

class FavoritesService {
  // Add a video to favorites
  async addToFavorites(userId, videoId) {
    try {
      const response = await api.post(`${import.meta.env.VITE_USER_URL}/favorites`, {
        userId,
        videoId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove a video from favorites
  async removeFromFavorites(userId, videoId) {
    try {
      const response = await api.delete(`${import.meta.env.VITE_USER_URL}/favorites/${userId}/${videoId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's favorites
  async getFavorites(userId) {
    try {
      const response = await api.get(`${import.meta.env.VITE_USER_URL}/favorites/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
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
        status: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }
}

export default new FavoritesService();