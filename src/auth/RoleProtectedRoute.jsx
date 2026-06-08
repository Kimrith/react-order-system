import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './store/AuthContext';

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, roles } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) => roles.includes(role));
    if (!hasRequiredRole) {
      // User is logged in but doesn't have the right role, redirect to unauthorized or home
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
