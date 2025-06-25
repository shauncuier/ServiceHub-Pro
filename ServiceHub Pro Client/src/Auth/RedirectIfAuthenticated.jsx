import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';

const RedirectIfAuthenticated = ({ children, redirectTo = "/" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to the specified route
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is not authenticated, show the children (login/register page)
  return children;
};

export default RedirectIfAuthenticated;
