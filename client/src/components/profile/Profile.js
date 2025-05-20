import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Grid, Avatar, Card, CardContent,
  List, ListItem, ListItemText, Divider, IconButton,
  Button, TextField, Box, CircularProgress, Alert
} from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableFields, setEditableFields] = useState({
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    linkedInUrl: '',
    currentAddress: '',
    permanentAddress: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEmployeeData();
    }
  }, [user]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      // Assuming the user's sub claim matches the employee ID
      const data = await employeeService.getEmployeeById(user.sub);
      setEmployee(data);
      
      // Initialize editable fields with current values
      setEditableFields({
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        whatsappNumber: data.whatsappNumber || '',
        linkedInUrl: data.linkedInUrl || '',
        currentAddress: data.currentAddress || '',
        permanentAddress: data.permanentAddress || ''
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(editableFields.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const updatedEmployee = {
        ...employee,
        ...editableFields
      };
      
      await employeeService.updateEmployee(employee.id, updatedEmployee);
      setEmployee(updatedEmployee);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Alert severity="error">
        Failed to load profile data. Please try refreshing the page.
      </Alert>
    );
  }

  // Format joining date for display
  const formattedJoiningDate = employee.joiningDate 
    ? new Date(employee.joiningDate).toLocaleDateString() 
    : 'Not specified';

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Basic Info Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, position: 'relative' }}>
            {!editMode && (
              <IconButton 
                sx={{ position: 'absolute', top: 16, right: 16 }}
                onClick={() => setEditMode(true)}
              >
                <Edit />
              </IconButton>
            )}
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem'
                  }}
                >
                  {employee.fullName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </Grid>
              
              <Grid item xs={12} md={10}>
                <Typography variant="h5" gutterBottom>
                  {employee.fullName}
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Role
                    </Typography>
                    <Typography variant="body1">
                      {employee.role}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {employee.department}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Joined
                    </Typography>
                    <Typography variant="body1">
                      {formattedJoiningDate}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {editMode ? (
                <>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={editableFields.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={editableFields.phoneNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="WhatsApp Number"
                        name="whatsappNumber"
                        value={editableFields.whatsappNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="LinkedIn URL"
                        name="linkedInUrl"
                        value={editableFields.linkedInUrl}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Address"
                        name="currentAddress"
                        value={editableFields.currentAddress}
                        onChange={handleChange}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Permanent Address"
                        name="permanentAddress"
                        value={editableFields.permanentAddress}
                        onChange={handleChange}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => setEditMode(false)}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="contained" 
                          startIcon={<Save />}
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <List dense disablePadding>
                  <ListItem>
                    <ListItemText primary="Email" secondary={employee.email || 'Not provided'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Phone" secondary={employee.phoneNumber || 'Not provided'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="WhatsApp" secondary={employee.whatsappNumber || 'Not provided'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="LinkedIn" 
                      secondary={employee.linkedInUrl ? (
                        <a href={employee.linkedInUrl} target="_blank" rel="noopener noreferrer">
                          {employee.linkedInUrl}
                        </a>
                      ) : 'Not provided'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Current Address"
                      secondary={employee.currentAddress || 'Not provided'}
                      secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Permanent Address"
                      secondary={employee.permanentAddress || 'Not provided'}
                      secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Employment Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense disablePadding>
                <ListItem>
                  <ListItemText primary="Employee ID" secondary={employee.id} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Department" secondary={employee.department} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Role" secondary={employee.role} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Joining Date" secondary={formattedJoiningDate} />
                </ListItem>
                {employee.status && (
                  <ListItem>
                    <ListItemText primary="Status" secondary={employee.status} />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile; 