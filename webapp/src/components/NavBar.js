// src/components/NavBar.js
import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import Logo from '../logo.svg'; // Import the logo

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo on the left */}
        <Box sx={{ flex: 1 }}>
          <img src={Logo} alt="WIChatLogo" style={{ height: 40 }} />
        </Box>

        {/* Login and Register buttons on the right */}
        <Box sx={{ display: 'flex' }}>
          <Button color="inherit" sx={{ marginRight: 2 }}>
            Login
          </Button>
          <Button color="inherit">
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
