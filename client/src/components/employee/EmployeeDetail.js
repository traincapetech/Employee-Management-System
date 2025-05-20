import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Grid, Button, Divider, 
  List, ListItem, ListItemText, CircularProgress,
  Card, CardContent, Box
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import employeeService from '../../services/employeeService';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Failed to load employee details');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!employee) {
    return (
      <div>
        <Typography variant="h5" color="error">Employee not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/employees')}
          sx={{ mt: 2 }}
        >
          Back to Employees
        </Button>
      </div>
    );
  }

  // Format joining date for display
  const formattedJoiningDate = employee.joiningDate 
    ? new Date(employee.joiningDate).toLocaleDateString() 
    : 'Not specified';

  return (
    <div>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/employees')}
        sx={{ mb: 3 }}
      >
        Back to Employees
      </Button>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Employee Details
        </Typography>
        <Button 
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/employees/edit/${id}`)}
        >
          Edit
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Employee Header */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>
                      {employee.fullName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {employee.role} - {employee.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                    <span style={{
                      background: employee.status === 'ACTIVE' ? '#e6f7ed' : '#ffe8e8',
                      color: employee.status === 'ACTIVE' ? '#287d3c' : '#da1414',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}>
                      {employee.status}
                    </span>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense disablePadding>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={employee.email} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Phone Number" 
                  secondary={employee.phoneNumber || 'Not provided'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="WhatsApp Number" 
                  secondary={employee.whatsappNumber || 'Not provided'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="LinkedIn" 
                  secondary={employee.linkedInUrl || 'Not provided'} 
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
          </Grid>
          
          {/* Employment Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Employment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense disablePadding>
              <ListItem>
                <ListItemText 
                  primary="Department" 
                  secondary={employee.department} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Role" 
                  secondary={employee.role} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Joining Date" 
                  secondary={formattedJoiningDate} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Status" 
                  secondary={employee.status} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Monthly Salary" 
                  secondary={`$${employee.salary ? employee.salary.toLocaleString() : '0'}`} 
                />
              </ListItem>
              {employee.collegeName && (
                <ListItem>
                  <ListItemText 
                    primary="College/University" 
                    secondary={employee.collegeName} 
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          
          {/* Education Documents (if available) */}
          {(employee.tenthMarksheetPath || employee.twelfthMarksheetPath || 
            employee.bachelorDegreePath || employee.postgraduateDegreePath) && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Education Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {employee.tenthMarksheetPath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">10th Marksheet</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {employee.twelfthMarksheetPath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">12th Marksheet</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {employee.bachelorDegreePath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">Bachelor's Degree</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {employee.postgraduateDegreePath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">Postgraduate Degree</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
          
          {/* Personal Documents (if available) */}
          {(employee.aadharCardPath || employee.panCardPath || 
            employee.pccPath || employee.resumePath || employee.offerLetterPath) && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Personal Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {employee.aadharCardPath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">Aadhar Card</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {employee.panCardPath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">PAN Card</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {employee.pccPath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">PCC</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {employee.resumePath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">Resume</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {employee.offerLetterPath && (
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">Offer Letter</Typography>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  );
};

export default EmployeeDetail; 