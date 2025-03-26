import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router'; // Inspired from project WIQ_ES04A
import Register from './pages/Register'; // Register.js
import Login from './pages/Login'; // Login.js
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Footer from './components/Footer'; // Footer.js
import NavBar from './components/NavBar'; // NavBar.js
import BackgroundVideo from './components/BackgroundVideo'; // BackgroundVideo.js
import Home from './pages/Home'; // Home.js
import Game from './pages/Game'; // Game.js
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute.js
import NotFound from './pages/NotFound'; // NotFound.js
import EndGame from './pages/EndGame'; // EndGame.js

import './i18n'; // Load internationalization

function App() {
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
      <BackgroundVideo data-testid="background-video" videoSrc={videoSrc} />
      <NavBar data-testid="navbar" />
      <Container component="main" maxWidth="s" sx={{ marginTop: 3 }}>
      <CssBaseline />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home data-testid="home-page" />} />
          {/* Login Page */}
          <Route path="/login" element={<Login data-testid="login-page" />} />
          {/* Register Page */}
          <Route path="/register" element={<Register data-testid="register-page" />} />
          {/* Game Page (protected) */}
          <Route path="/game" element={<PrivateRoute element={Game} />} />
          {/* End Game Page (blocked) */}
          <Route path="/end-game" element={<PrivateRoute element={EndGame} requireGameEnd={true} />} />
          {/* Not Existing Path */}
          <Route path="*" element={<NotFound data-testid="not-found-page" />} />
        </Routes>
      </Container>
      <Footer data-testid="footer" />
    </>
  );
}

export default App;
