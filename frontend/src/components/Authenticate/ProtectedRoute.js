// src/components/Authenticate/ProtectedRoute.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthenticateContext';

const ProtectedRoute = ({ requiredRole, children }) => {
    const { isUserAuthenticated, isAdminAuthenticated, user, checkAuthStatus, loading } = useAuth();

    useEffect(() => {
        checkAuthStatus(); // Check auth status on component mount
    }, []);

    // Determine the user role based on the authentication state
    const userRole = user?.role; // This gets the role from the user object

    // Log to debug the state
    console.log("Loading:", loading);
    console.log("User Role:", userRole);
    console.log("Is User Authenticated:", isUserAuthenticated);
    console.log("Is Admin Authenticated:", isAdminAuthenticated);
    console.log("Required Role:", requiredRole);

    // Show a loading state if auth status is being checked
    if (loading) {
        return <div>Loading...</div>; // Optional loading indicator
    }

    // Check if the user is authenticated for the appropriate role
    const isAuthenticated = requiredRole === 'admin' ? isAdminAuthenticated : isUserAuthenticated;

    // User not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If the role doesn't match, redirect to "Not Authorized" page
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/not-authorized" />;
    }

    return children; // If everything is okay, render the children components
};

export default ProtectedRoute;
