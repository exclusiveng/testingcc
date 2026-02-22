import api from './api';

export const inquiryService = {
  // Submit contact inquiry
  submitInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/inquiries', inquiryData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Get inquiries (admin/agent)
  getInquiries: async (filters = {}) => {
    try {
      const response = await api.get('/inquiries', { params: filters });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update inquiry status
  updateInquiryStatus: async (inquiryId, status) => {
    try {
      const response = await api.patch(`/inquiries/${inquiryId}/status`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Delete inquiry
  deleteInquiry: async (inquiryId) => {
    try {
      await api.delete(`/inquiries/${inquiryId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};
