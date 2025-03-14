import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Inspired from project WIQ_ES04A
import Register from './pages/Register'; // Register.js
import Login from './pages/Login'; // Login.js
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Footer from './components/Footer'; // Footer.js
import NavBar from './components/NavBar'; // NavBar.js
import BackgroundVideo from './components/BackgroundVideo'; // BackgroundVideo.js
import Home from './pages/Home'; // Home.js
import Game from './pages/Game'; // Game.js
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute.js
import NotFound from './pages/NotFound'; // NotFound.js

function App() {
  /** 
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };
  **/

  const location = useLocation(); // Get the current route
  const [videoSrc, setVideoSrc] = useState('/homeBackground30fps.mp4'); // Default background video

  useEffect(() => {
    // Change background video depending on the current route
    if (location.pathname === '/game') {
      setVideoSrc('/questionBackground30fps.mp4'); // Change background for "game"
    } else {
      setVideoSrc('/homeBackground30fps.mp4'); // Default background
    }
  }, [location.pathname]);

  return (
    <>
      <BackgroundVideo videoSrc={videoSrc} />
      <NavBar />
      <Container component="main" maxWidth="s" sx={{ marginTop: 3 }}>
        <CssBaseline />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          {/* Register Page */}
          <Route path="/register" element={<Register />} />
          {/* Game Page (protected) */}
          <Route path="/game" element={<PrivateRoute element={Game} />} />
          {/* Not Existing Path */}
          <Route path="*" element={<NotFound />} /> 
        </Routes>
        {/** 
        <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
          Welcome to the 2025 edition of the Software Architecture course!
        </Typography>
        {showLogin ? <Login /> : <AddUser />}
        <Typography component="div" align="center" sx={{ marginTop: 2 }}>
          {showLogin ? (
            <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
              Don't have an account? Register here.
            </Link>
          ) : (
            <Link component="button" variant="body2" onClick={handleToggleView}>
              Already have an account? Login here.
            </Link>
          )}
        </Typography>
        **/}
      </Container>
      <Footer />
    </>
  );
}

export default App;
