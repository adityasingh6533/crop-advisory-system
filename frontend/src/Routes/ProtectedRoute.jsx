import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contextProvider/context';

const ProtectedRoute = ({ children }) => {
  const lang = localStorage.getItem('lang');
  const { isAuthenticated, isAuthLoading } = useAppContext();

  if (!lang) {
    return <Navigate to="/" />;
  }

  if (isAuthLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
