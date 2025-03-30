// src/components/Login.js
import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { SessionContext } from "../SessionContext"; // Import the context
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const apiEndpoint = process.env.API_ENDPOINT || "http://localhost:8000";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { createSession } = useContext(SessionContext); // Get createSession from context
  const navigate = useNavigate();
  const fieldRef = useRef(null); // Create a reference to the form

  const { t, i18n } = useTranslation();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { token },
      } = await axios.post(
        `${apiEndpoint}/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If login is successful, store session and show success message
      createSession(token, username);
      setOpenSnackbar(true);
    } catch (error) {
      console.log(`Error ${error.response.data.message}`);
      setError(error.response.data.message);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    navigate("/");
  };

  useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.focus(); // Focus on the input when the component mounts
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 20 }}>
      <Typography data-testid="log-title" component="h1" variant="h5">
        {t("login")}
      </Typography>
      <form onSubmit={loginUser}>
        <TextField
          data-testid="log-username"
          inputRef={fieldRef}
          margin="normal"
          fullWidth
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          data-testid="log-password"
          margin="normal"
          fullWidth
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          data-testid="log-button"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {t("login")}
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={700}
        onClose={handleCloseSnackbar}
        message="Login successful"
      />
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          message={`Error: ${error}`}
        />
      )}
    </Container>
  );
};

export default Login;
