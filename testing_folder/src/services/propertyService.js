import api from './api';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (filters = {}) => {
    try {
      const response = await api.get('/properties', { params: filters });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get featured properties
  getFeaturedProperties: async (limit = 6) => {
    try {
      const response = await api.get('/properties/featured', { params: { limit } });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get property by slug
  getPropertyBySlug: async (slug) => {
    try {
      const response = await api.get(`/properties/slug/${slug}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create property
  createProperty: async (propertyData) => {
    try {
      const config = {};
      if (propertyData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.post('/properties', propertyData, config);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      const config = {};
      if (propertyData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.patch(`/properties/${id}`, propertyData, config);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};
