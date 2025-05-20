import apiClient from './apiService';

const attendanceService = {
  // Mark attendance
  markAttendance: async (employeeId, status) => {
    try {
      const response = await apiClient.post(`/attendance/${employeeId}/mark?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  // Check in
  checkIn: async (employeeId, time) => {
    try {
      const response = await apiClient.post(`/attendance/${employeeId}/checkin?time=${time}`);
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  },

  // Check out
  checkOut: async (employeeId, time) => {
    try {
      const response = await apiClient.post(`/attendance/${employeeId}/checkout?time=${time}`);
      return response.data;
    } catch (error) {
      console.error('Error checking out:', error);
      throw error;
    }
  },

  // Get attendance report for an employee
  getAttendanceReport: async (employeeId) => {
    try {
      const response = await apiClient.get(`/attendance/${employeeId}/report`);
      return response.data;
    } catch (error) {
      console.error('Error getting attendance report:', error);
      throw error;
    }
  },

  // Get attendance for a date range
  getAttendanceForDateRange: async (startDate, endDate) => {
    try {
      const response = await apiClient.get(`/attendance/range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Error getting attendance for date range:', error);
      throw error;
    }
  },

  // Calculate salary for a specific month
  calculateMonthlySalary: async (employeeId, month, year) => {
    try {
      const response = await apiClient.get(`/attendance/${employeeId}/salary?month=${month}&year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Error calculating monthly salary:', error);
      throw error;
    }
  }
};

export default attendanceService; 