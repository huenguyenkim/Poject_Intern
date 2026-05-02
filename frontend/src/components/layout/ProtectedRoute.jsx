import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Route Guard using Redux State.
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAuthenticated = !!user && !!token;

  if (!isAuthenticated) {
    // Not logged in, redirect to appropriate login page
    const loginPath = (role === 'admin' || role === 'staff') ? '/admin/login' : '/auth';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // Allow admin to access customer routes
    if (role === 'customer' && user.role === 'admin') {
      return children;
    }
    // Logged in but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
