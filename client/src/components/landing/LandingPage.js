import React from 'react';
import { 
  Container, Typography, Button, Grid, Box, 
  Paper, Card, CardContent, CardMedia, Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  People, AccessTime, EventNote, 
  Payment, Security, Dashboard 
} from '@mui/icons-material';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Employee Management System
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Streamline your HR operations with our comprehensive employee management solution.
                Track attendance, manage leave requests, generate salary slips, and more.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/login"
                  size="large"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/admin/signup"
                  size="large"
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Admin Registration
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src="/images/hero-image.svg" 
                alt="Employee Management"
                sx={{ 
                  width: '100%', 
                  maxHeight: 400,
                  display: { xs: 'none', md: 'block' }
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
            Key Features
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
            Everything you need to manage your workforce efficiently
          </Typography>

          <Grid container spacing={4}>
            {[
              { 
                icon: <People fontSize="large" color="primary" />, 
                title: 'Employee Management', 
                description: 'Easily add, edit, and manage employee records. Store all essential employee information in one place.' 
              },
              { 
                icon: <AccessTime fontSize="large" color="primary" />, 
                title: 'Attendance Tracking', 
                description: 'Track daily check-ins and check-outs. Generate attendance reports to monitor productivity.' 
              },
              { 
                icon: <EventNote fontSize="large" color="primary" />, 
                title: 'Leave Management', 
                description: 'Streamline leave requests and approvals. Keep track of employee leave balances and history.' 
              },
              { 
                icon: <Payment fontSize="large" color="primary" />, 
                title: 'Salary Management', 
                description: 'Generate salary slips with customizable components. Calculate deductions based on attendance.' 
              },
              { 
                icon: <Dashboard fontSize="large" color="primary" />, 
                title: 'Insightful Dashboards', 
                description: 'Get a quick overview of your workforce with role-specific dashboards for employees and HR.' 
              },
              { 
                icon: <Security fontSize="large" color="primary" />, 
                title: 'Role-Based Access', 
                description: 'Secure your data with role-based permissions for Admins, HR personnel, and Employees.' 
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Getting Started Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
            Getting Started
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
            Setting up your organization is simple
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={10}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Grid container spacing={3}>
                  {[
                    { number: '01', title: 'Admin Registration', description: 'Create the first admin account to set up your organization.' },
                    { number: '02', title: 'Add HR Personnel', description: 'As an admin, add HR managers to help manage employees.' },
                    { number: '03', title: 'Onboard Employees', description: 'HR can add employees and manage their information.' },
                    { number: '04', title: 'Start Managing', description: 'Begin tracking attendance, managing leaves, and generating salary slips.' }
                  ].map((step, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            color: 'primary.light', 
                            opacity: 0.6, 
                            fontWeight: 'bold',
                            mr: 2 
                          }}
                        >
                          {step.number}
                        </Typography>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {step.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {step.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Box textAlign="center" mt={6}>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/admin/signup"
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()} Employee Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default LandingPage; 