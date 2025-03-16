// Taken from 2024 WIQ_ES04A project
// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router';

// Private route component to restrict access to authenticated users
const PrivateRoute = ({ element: Element }) => {
    const sessionId = localStorage.getItem('sessionId'); // Check if user has an active session
  
    return sessionId ? <Element /> : <Navigate to="/login" />; // Redirect to login if no session
  };
  
  export default PrivateRoute;