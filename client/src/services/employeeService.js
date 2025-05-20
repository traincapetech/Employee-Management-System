import apiClient from './apiService';

const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await apiClient.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error getting all employees:', error);
      throw error;
    }
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting employee with ID ${id}:`, error);
      throw error;
    }
  },

  // Create employee with user account
  createEmployee: async (employeeData, username, password, role, referenceId) => {
    try {
      const formData = new FormData();
      formData.append('employee', JSON.stringify(employeeData));
      formData.append('username', username);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('referenceId', referenceId || '');

      const response = await apiClient.post('/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiClient.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await apiClient.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  }
};

export default employeeService; 