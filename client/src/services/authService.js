import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Fix the API URL to point to the backend server, not the MongoDB connection
const API_URL = 'https://employee-management-system-pahv.onrender.com/api';

// Set JWT token in Authorization header
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  setAuthToken(null);
};

const adminSignup = async (fullName, email, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/admin/signup`, {
      fullName,
      email,
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if user has a valid token
const checkAuth = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  try {
    setAuthToken(token);
    const response = await axios.get(`${API_URL}/auth/validate-token`);
    return response.data;
  } catch (error) {
    logout();
    return false;
  }
};

const authService = {
  login,
  logout,
  adminSignup,
  checkAuth,
  setAuthToken
};

export default authService; 