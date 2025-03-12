// src/pages/NotFound.js
import React, { useRef, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const buttonRef = useRef(null); // Create a reference to the button

  const handleGoHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus(); // Focus on the button when the component mounts
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs"
      sx={{
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <Typography variant="h2" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" paragraph>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <form onSubmit={handleGoHome}>
        <Button ref={buttonRef} type="submit" variant="contained" color="primary">
          Go Home
        </Button>
      </form>
    </Container>
  );
};

export default NotFound;