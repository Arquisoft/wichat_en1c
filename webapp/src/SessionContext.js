// Taken from 2024 WIQ_ES04A project
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a React Context for managing session-related data
const SessionContext = createContext();

const SessionProvider = ({ children }) => {
    
    // State variables to manage session information
    const [sessionId, setSessionId] = useState('');
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // This effect runs once when the provider is mounted
    useEffect(() => {
        // Retrieve stored session ID from localStorage
        const storedSessionId = localStorage.getItem('sessionId');
        if (storedSessionId) {
            setSessionId(storedSessionId);
            setIsLoggedIn(true);
        
            // Retrieve stored username, if available
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }
    }, []);

    // Function to create a new session when a user logs in
    const createSession = (token, username) => {
        setSessionId(token);
        setUsername(username);
        setIsLoggedIn(true);

        // Set the Authorization header for all axios requests from now on
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Store session details in localStorage
        localStorage.setItem('sessionId', token);
        localStorage.setItem('username', username);
    };

    // Function to destroy the session when the user logs out
    const destroySession = () => {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('username');
        setSessionId('');
        setUsername('');
        setIsLoggedIn(false);

        // Remove the Authorization header for all axios requests
        delete axios.defaults.headers.common['Authorization'];
    };

    // Destroys session when the app is closed
    useEffect(() => {
        const handleUnload = () => destroySession();
        window.addEventListener('beforeunload', handleUnload);

        // Clean the listener
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    return (
        // Provide session data and functions to all child components
        <SessionContext.Provider value={{ sessionId, username, isLoggedIn, createSession, destroySession }}>
            {children}
        </SessionContext.Provider>
    );
};

export { SessionContext, SessionProvider };