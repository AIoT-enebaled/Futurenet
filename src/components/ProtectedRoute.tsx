import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {  User, UserRole } from '../services/firebase';

// Define props for ProtectedRoute
interface ProtectedRouteProps {
  allowedRoles?: User['role'][]; // Optional array of roles allowed to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  // Show a loading indicator while the auth state is being determined
  if (loading) {
    return <div>Loading...</div>; // Replace with your preferred loading component
  }

  // If there is no current user and not loading, redirect to the login page
  if (!currentUser) {
    // Use Navigate component for redirection within React Router v6
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles are specified, check if the current user has one of those roles
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = currentUser.role; // Assuming currentUser.role is the primary role string
    const hasRequiredRole = allowedRoles.includes(userRole);

    // If the user's role is not in the allowedRoles, redirect
    if (!hasRequiredRole) {
      console.warn(`User ${currentUser.uid} with role '${userRole}' attempted to access restricted route. Allowed roles: ${allowedRoles.join(', ')}`);
      // Redirect to home or an unauthorized page
      return <Navigate to="/" replace />;
        // Or a dedicated unauthorized page: return <Navigate to="/unauthorized" replace />; // Make sure this route exists
    }
  }

  // If the user is logged in and has the required role (if specified), render the child routes/component
  return <Outlet />;
};

export default ProtectedRoute;