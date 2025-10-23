import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const auth = useSelector((state) => state.auth);
  const { accessToken, user } = auth || {};

  if (!accessToken) return <Navigate to="/login" replace />;
  if (adminOnly && (!user || (user.role && user.role.toLowerCase() !== 'admin'))) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
