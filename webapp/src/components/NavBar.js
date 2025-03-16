// src/components/NavBar.js
import React, { useContext }  from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import Logo from '../logo.svg'; // Import the logo
import { useNavigate } from 'react-router';
import { SessionContext } from '../SessionContext'; // Import the context

const NavBar = () => {
  const navigate = useNavigate();
  const { username, isLoggedIn, destroySession } = useContext(SessionContext); // Obtain the session and destroy function 

  const handleLogout = () => {
    destroySession();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo and Home button on the left */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="WIChatLogo" style={{ height: 40, cursor: 'pointer' }} 
            onClick={() => navigate('/')} // Navigate to home on click
          />
          <Button color="inherit" sx={{ marginLeft: 2 }} onClick={() => navigate('/')}>
            Home
          </Button>
        </Box>
        {/* If there is a session: welcome message and Logout. If not, Login and Register */}
        {isLoggedIn ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: 2 }}>Hello, {username}!</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <Button color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
