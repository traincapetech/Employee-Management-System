import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Card, CardContent, 
  List, ListItem, ListItemText, ListItemIcon,
  Divider, Button, Box
} from '@mui/material';
import { 
  People, Business, SupervisorAccount, 
  Security, Settings, Person 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalHr: 0,
    departments: [],
    recentEmployees: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all employees
      const employees = await employeeService.getAllEmployees();
      
      // Count HR roles
      const hrCount = employees.filter(emp => 
        emp.role === 'HR Manager' || emp.department === 'HR'
      ).length;
      
      // Get departments
      const departments = {};
      employees.forEach(emp => {
        if (emp.department) {
          departments[emp.department] = (departments[emp.department] || 0) + 1;
        }
      });
      
      // Get 5 most recent employees
      const recentEmployees = [...employees]
        .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
        .slice(0, 5);
      
      setStats({
        totalEmployees: employees.length,
        totalHr: hrCount,
        departments: Object.entries(departments).map(([name, count]) => ({ name, count })),
        recentEmployees
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/admin/create-hr"
          startIcon={<SupervisorAccount />}
        >
          Add HR Personnel
        </Button>
      </Box>
      
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography variant="h5">{stats.totalEmployees}</Typography>
                  <Typography variant="body2">Total Employees</Typography>
                </div>
                <People fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#673ab7', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography variant="h5">{stats.totalHr}</Typography>
                  <Typography variant="body2">HR Personnel</Typography>
                </div>
                <SupervisorAccount fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#2196f3', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography variant="h5">{stats.departments.length}</Typography>
                  <Typography variant="body2">Departments</Typography>
                </div>
                <Business fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography variant="h5">Admin</Typography>
                  <Typography variant="body2">Your Role</Typography>
                </div>
                <Security fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Department Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Department Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.departments.length > 0 ? (
              <List>
                {stats.departments.map((dept, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText 
                      primary={dept.name} 
                      secondary={`${dept.count} employee${dept.count !== 1 ? 's' : ''}`} 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                No departments found
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Employees */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recently Added Employees
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.recentEmployees.length > 0 ? (
              <List>
                {stats.recentEmployees.map((emp) => (
                  <ListItem key={emp.id} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText 
                      primary={emp.fullName} 
                      secondary={`${emp.role} - ${emp.department || 'No Department'}`} 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                No recent employees found
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Admin Tools */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Admin Tools
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/employees"
                  startIcon={<People />}
                  fullWidth
                  sx={{ p: 2, justifyContent: 'flex-start' }}
                >
                  Manage Employees
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/attendance"
                  startIcon={<People />}
                  fullWidth
                  sx={{ p: 2, justifyContent: 'flex-start' }}
                >
                  Attendance Records
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/leave-requests"
                  startIcon={<People />}
                  fullWidth
                  sx={{ p: 2, justifyContent: 'flex-start' }}
                >
                  Leave Requests
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/salary-slips"
                  startIcon={<People />}
                  fullWidth
                  sx={{ p: 2, justifyContent: 'flex-start' }}
                >
                  Salary Management
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard; 