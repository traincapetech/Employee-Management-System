import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();
  
  // Show loading indicator while authentication check is in progress
  if (loading) {
    return <div>Loading...</div>;
  }

  const authenticated = isAuthenticated();
  if (!authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();
  // If allowed roles are specified, check if the user role is included
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to dashboard if authenticated but not authorized for the specific route
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and authorized (if roles were specified)
  return children;
};

export default ProtectedRoute; 