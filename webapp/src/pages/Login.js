// src/components/Login.js
import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Alert,
} from "@mui/material";
import { SessionContext } from "../SessionContext"; // Import the context
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import SecurityIcon from "@mui/icons-material/Security";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const Login = () => {
  const { createSession } = useContext(SessionContext); // Get createSession from context
  const navigate = useNavigate();
  const { t } = useTranslation();

  const queryParams = new URLSearchParams(window.location.search);
  const [error, setError] = useState(queryParams.get("error"));
  const loginUser = async (e) => {
    e.preventDefault();
    if (!usernameValid || !passwordValid) return;
    try {
      const {
        data: { token },
      } = await axios.post(`${apiEndpoint}/auth/login`, { username, password });

      // If login is successful, store session and show success message
      createSession(token, username);
      navigate("/"); // Redirect to the game page
    } catch (error) {
      if (error.response.status === 400) setError(t("loginError"));
      if (error.response.status === 401) setError(t("loginError"));
      else {
        console.error(`Error ${error.response.data}`);
        setError(t("genericError"));
      }
    }
  };

  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(true);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameValid(e.target.validity.valid);
  };

  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.validity.valid);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        onSubmit={loginUser}
        component="form"
        sx={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SecurityIcon />
          <Typography data-testid="log-title" component="h1" variant="h5">
            {t("login")}
          </Typography>
        </Box>
        {error != null && <Alert severity="error">{error}</Alert>}
        <Box
          sx={{
            gap: 2,
            display: "flex",
            flexDirection: "column",
            marginTop: 1,
            marginBottom: 1,
          }}
        >
          <TextField
            id="username"
            data-testid="log-username"
            type="text"
            value={username}
            label={t("username")}
            autoFocus
            error={!usernameValid}
            required
            fullWidth
            onChange={handleUsernameChange}
          />

          <FormControl variant="outlined" required error={!passwordValid}>
            <InputLabel htmlFor="password">{t("password")}</InputLabel>
            <OutlinedInput
              id="password"
              data-testid="log-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("password")}
            />
          </FormControl>
        </Box>
        <Button
          data-testid="log-button"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          {t("login")}
        </Button>
      </Container>
    </Container>
  );
};

export default Login;
