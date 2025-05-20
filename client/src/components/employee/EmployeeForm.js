import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Paper, Typography, TextField, Button, Grid, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Box, Divider
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import employeeService from '../../services/employeeService';

const EmployeeForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    linkedInUrl: '',
    currentAddress: '',
    permanentAddress: '',
    collegeName: '',
    role: '',
    department: '',
    joiningDate: '',
    status: 'ACTIVE',
    salary: ''
  });

  // For user account creation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('EMPLOYEE');

  useEffect(() => {
    if (isEditMode) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(id);
      setEmployee({
        ...data,
        // Format date for form field
        joiningDate: data.joiningDate 
          ? new Date(data.joiningDate).toISOString().split('T')[0]
          : ''
      });
      // For edit mode, we don't need to create a user account again
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast.error('Failed to load employee data');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      let savedEmployee;
      
      // Convert salary to number
      const employeeData = {
        ...employee,
        salary: parseFloat(employee.salary)
      };

      if (isEditMode) {
        // Just update the employee
        savedEmployee = await employeeService.updateEmployee(id, employeeData);
        toast.success('Employee updated successfully');
      } else {
        // Create employee with user account
        savedEmployee = await employeeService.createEmployee(
          employeeData,
          username,
          password,
          userRole,
          '' // referenceId can be empty for now
        );
        toast.success('Employee created successfully');
      }
      
      navigate('/employees');
      
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} employee`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/employees')}
        sx={{ mb: 3 }}
      >
        Back to Employees
      </Button>
      
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Employee' : 'Add New Employee'}
      </Typography>
      
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
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="WhatsApp Number"
                name="whatsappNumber"
                value={employee.whatsappNumber}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedInUrl"
                value={employee.linkedInUrl}
                onChange={handleChange}
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
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Permanent Address"
                name="permanentAddress"
                multiline
                rows={2}
                value={employee.permanentAddress}
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
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  label="Department"
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="HR">Human Resources</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={employee.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Designer">Designer</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Director">Director</MenuItem>
                  <MenuItem value="HR Manager">HR Manager</MenuItem>
                  <MenuItem value="Finance Analyst">Finance Analyst</MenuItem>
                  <MenuItem value="Marketing Executive">Marketing Executive</MenuItem>
                  <MenuItem value="Sales Executive">Sales Executive</MenuItem>
                  <MenuItem value="Intern">Intern</MenuItem>
                </Select>
              </FormControl>
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
            
            <Grid item xs={12} md={4}>
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
                  <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                  <MenuItem value="TERMINATED">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
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

            {/* User Account Details (Only for new employee) */}
            {!isEditMode && (
              <>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    User Account Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>User Role</InputLabel>
                    <Select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      label="User Role"
                    >
                      <MenuItem value="EMPLOYEE">Employee</MenuItem>
                      <MenuItem value="HR">HR</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/employees')}
              sx={{ mr: 2 }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<Save />} 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default EmployeeForm; 