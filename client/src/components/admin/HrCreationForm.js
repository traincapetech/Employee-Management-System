import React, { useState } from 'react';
import { 
  Paper, Typography, TextField, Button, Grid, 
  FormControl, InputLabel, Select, MenuItem, Box,
  CircularProgress, Alert, Divider
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import employeeService from '../../services/employeeService';

const HrCreationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [employee, setEmployee] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'HR Manager',
    department: 'HR',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    currentAddress: '',
    salary: ''
  });

  // For user account creation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!employee.fullName || !employee.email || !employee.phoneNumber || 
        !employee.joiningDate || !employee.currentAddress || !employee.salary ||
        !username || !password) {
      setError('Please fill all required fields');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(employee.phoneNumber)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Convert salary to number
      const employeeData = {
        ...employee,
        salary: parseFloat(employee.salary)
      };

      // Create HR employee with user account
      await employeeService.createEmployee(
        employeeData,
        username,
        password,
        'HR',  // User role is HR
        ''     // referenceId can be empty for now
      );
      
      toast.success('HR personnel created successfully');
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Error creating HR personnel:', error);
      setError('Failed to create HR personnel');
      toast.error('Failed to create HR personnel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/admin/dashboard')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Add HR Personnel
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={employee.fullName}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={employee.email}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phoneNumber"
                value={employee.phoneNumber}
                onChange={handleChange}
                helperText="10 digits without spaces or dashes"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Current Address"
                name="currentAddress"
                multiline
                rows={2}
                value={employee.currentAddress}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Employment Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Employment Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                label="Department"
                name="department"
                value={employee.department}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                disabled
                label="Role"
                name="role"
                value={employee.role}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={employee.joiningDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={employee.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Monthly Salary"
                name="salary"
                type="number"
                value={employee.salary}
                onChange={handleChange}
              />
            </Grid>

            {/* User Account Details */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                HR Account Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 6 characters"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/admin/dashboard')}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<Save />} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creating...
                </>
              ) : 'Create HR Personnel'}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default HrCreationForm; 