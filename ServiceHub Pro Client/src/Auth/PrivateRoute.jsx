import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading, isAuthenticated, getJWTToken } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check both Firebase user and JWT token
  const hasValidAuth = user && isAuthenticated() && getJWTToken();

  if (hasValidAuth) {
    return children;
  }

  // If no valid authentication, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
