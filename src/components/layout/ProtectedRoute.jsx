import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Not logged in, redirect to auth/admin-login with return url
    const loginPath = role === 'admin' ? '/admin/login' : '/auth';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && currentUser.role !== role) {
    // Allow admin to access user routes (profile, etc.)
    if (role === 'user' && currentUser.role === 'admin') {
      return children;
    }
    // Logged in but wrong role (e.g., user trying to access admin)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
