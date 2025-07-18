// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  // Make both the stored user role and allowedRoles case-insensitive
  const userRole = user.role.toUpperCase();
  const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());

  if (allowedRoles && !allowedRolesUpper.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
