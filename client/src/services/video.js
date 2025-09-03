import api from './api';

class VideoService {
  // Get all videos with optional filters
  async getVideos(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.genre && filters.genre !== 'all') {
        params.append('genre', filters.genre);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit);
      }
      
      if (filters.offset) {
        params.append('offset', filters.offset);
      }

      const response = await api.get(`/vlms/videos?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get video by ID
  async getVideoById(id) {
    try {
      const response = await api.get(`/vlms/videos/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add video to favorites
  async addToFavorites(videoId) {
    try {
      const response = await api.post('/vlms/user/favorites', { videoId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove video from favorites
  async removeFromFavorites(videoId) {
    try {
      const response = await api.delete(`/vlms/user/favorites/${videoId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's favorite videos
  async getFavorites() {
    try {
      const response = await api.get('/vlms/user/favorites');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add video to watch history
  async addToWatchHistory(videoId) {
    try {
      const response = await api.post('/vlms/user/watch-history', { videoId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's watch history
  async getWatchHistory() {
    try {
      const response = await api.get('/vlms/user/watch-history');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred';
      const details = error.response.data?.details;
      
      return {
        message,
        details,
        status: error.response.status
      };
    } else if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

export default new VideoService();