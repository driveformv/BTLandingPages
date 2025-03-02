import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * A wrapper around the Route component that redirects to the login page
 * if the user is not authenticated.
 */
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, render the child routes
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
