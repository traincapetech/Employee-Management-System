import React, { useState } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, 
  CircularProgress, Alert, Box, Link, Grid 
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await login(credentials.username, credentials.password);
      
      // Redirect based on user role
      switch (data.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'HR':
          navigate('/hr/dashboard');
          break;
        case 'EMPLOYEE':
          navigate('/employee/dashboard');
          break;
        default:
          navigate('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 5, pb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>
        
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Sign in to access your employee dashboard
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Grid container justifyContent="center">
            <Grid item>
              <Link component={RouterLink} to="/admin/signup" variant="body2">
                Need to setup your company? Register as Admin
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Box mt={3} textAlign="center">
        <Link component={RouterLink} to="/" variant="body2">
          Back to home
        </Link>
      </Box>
    </Container>
  );
};

export default Login; 