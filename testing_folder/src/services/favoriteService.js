import api from './api';

export const favoriteService = {
  // Add to favorites
  addFavorite: async (propertyId) => {
    try {
      const response = await api.post(`/favorites/${propertyId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Remove from favorites
  removeFavorite: async (propertyId) => {
    try {
      await api.delete(`/favorites/${propertyId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Get user favorites
  getUserFavorites: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/favorites', {
        params: { page, limit },
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if property is favorited
  isFavorited: async (propertyId) => {
    try {
      const response = await api.get(`/favorites/${propertyId}/check`);
      return { success: true, isFavorited: response.data.data.favorited };
    } catch (error) {
      return { success: false, error: error.message, isFavorited: false };
    }
  },
};
