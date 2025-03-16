// src/components/Login.js
import React, { useState, useContext, useRef, useEffect  } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { SessionContext } from '../SessionContext'; // Import the context
import { useNavigate } from 'react-router';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  
  const { createSession } = useContext(SessionContext); // Get createSession from context
  const navigate = useNavigate();
  const fieldRef = useRef(null); // Create a reference to the form

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password }); // Will be changed in prototype branch

      /** 
      const question = "Please, generate a greeting message for a student called " + username + " that is a student of the Software Architecture course in the University of Oviedo. Be nice and polite. Two to three sentences max.";
      const model = "empathy"
      const message = await axios.post(`${apiEndpoint}/askllm`, { question, model })
      setMessage(message.data.answer);
      // Extract data from the response
      const { createdAt: userCreatedAt } = response.data;

      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);
      **/

      // If login is successful, store session and show success message
      createSession(username); 
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    navigate('/'); 
  };

  useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.focus(); // Focus on the input when the component mounts
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 20 }}>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
        <form onSubmit={loginUser}>
          <TextField
            inputRef={fieldRef}
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
          <Snackbar open={openSnackbar} autoHideDuration={700} onClose={handleCloseSnackbar} message="Login successful" />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
    </Container>
  );
};

export default Login;
