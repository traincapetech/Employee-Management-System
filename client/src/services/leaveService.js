import apiClient from './apiService';

const leaveService = {
  // Apply for leave
  applyForLeave: async (leaveData) => {
    try {
      const response = await apiClient.post('/leave/apply', leaveData);
      return response.data;
    } catch (error) {
      console.error('Error applying for leave:', error);
      throw error;
    }
  },

  // Update leave status
  updateLeaveStatus: async (leaveId, status) => {
    try {
      const response = await apiClient.put(`/leave/${leaveId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating leave status:', error);
      throw error;
    }
  },

  // Get leaves for employee
  getEmployeeLeaves: async (employeeId) => {
    try {
      const response = await apiClient.get(`/leave/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting employee leaves:', error);
      throw error;
    }
  },

  // Get leaves for HR
  getHrLeaves: async (hrId) => {
    try {
      const response = await apiClient.get(`/leave/hr/${hrId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting HR leaves:', error);
      throw error;
    }
  }
};

export default leaveService; 