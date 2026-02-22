import api from './api';

export const areaService = {
  // Get all areas
  getAreas: async () => {
    try {
      const response = await api.get('/areas');
      // Backend returns { success, message, data: [...areas] }
      // axios wraps it in response.data
      const areas = response.data.data || response.data;
      return { success: true, data: areas };
    } catch (error) {
      console.error('Error fetching areas:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get area by slug
  getAreaBySlug: async (slug) => {
    try {
      const response = await api.get(`/areas/slug/${slug}`);
      const area = response.data.data || response.data;
      return { success: true, data: area };
    } catch (error) {
      console.error('Error fetching area by slug:', error);
      return { success: false, error: error.message };
    }
  },

  // Get area by ID
  getAreaById: async (id) => {
    try {
      const response = await api.get(`/areas/${id}`);
      const area = response.data.data || response.data;
      return { success: true, data: area };
    } catch (error) {
      console.error('Error fetching area by ID:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Create area
  createArea: async (areaData) => {
    try {
      const config = {};
      if (areaData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.post('/areas', areaData, config);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error creating area:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
  
  // Update area
  updateArea: async (id, areaData) => {
    try {
      const config = {};
      if (areaData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.patch(`/areas/${id}`, areaData, config);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error updating area:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};
