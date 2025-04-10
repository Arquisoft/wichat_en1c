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
  FormHelperText,
  Alert,
} from "@mui/material";
import { SessionContext } from "../SessionContext"; // Import the context
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  AppRegistration,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const Register = () => {
  const { createSession } = useContext(SessionContext); // Get createSession from context
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState(null);
  const registerUser = async (e) => {
    e.preventDefault();
    if (!usernameValid || !passwordValid || !confirmPasswordValid) return;
    try {
      // Register the user
      await axios.post(`${apiEndpoint}/auth/signup`, {
        username,
        password,
      });

      // Authenticate the user
      const {
        data: { token },
      } = await axios.post(`${apiEndpoint}/auth/login`, { username, password });

      // If login is successful, store session and show success message
      createSession(token, username);
      navigate("/"); // Redirect to the game page
    } catch (error) {
      if (error.response.status === 400) setError(t("registerError"));
      else if (error.response.status === 401)
        navigate(`/login?error=${t("registerConflict")}`);
      // Redirect to the login page
      else {
        console.error(error);
        setError(t("genericError"));
      }
    }
  };

  const validations = {
    username: "^[a-zA-Z0-9]{5,20}$",
    password:
      // xd
      // Regex to enforce strong password: at least one lowercase, one uppercase, one digit, one special character, and minimum 8 characters
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\-#!\\$@£%\\^&\\*\\(\\)_\\+\\|~=`\\{\\}\\[\\]:\";'<>\\?,\\.\\/\\\\ ]).{8,}$",
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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordValid(
      password === e.target.value && e.target.validity.valid
    );
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
        onSubmit={registerUser}
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
          <AppRegistration />
          <Typography data-testid="reg-title" component="h1" variant="h5">
            {t("register")}
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
            data-testid="reg-username"
            type="text"
            value={username}
            label={t("username")}
            autoFocus
            error={!usernameValid}
            helperText={!usernameValid && t("usernameHint")}
            required
            inputProps={{
              pattern: validations.username,
            }}
            fullWidth
            onChange={handleUsernameChange}
          />

          <FormControl variant="outlined" required error={!passwordValid}>
            <InputLabel htmlFor="password">{t("password")}</InputLabel>
            <OutlinedInput
              id="password"
              data-testid="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              inputProps={{
                pattern: validations.password,
              }}
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
            {!passwordValid && (
              <FormHelperText>{t("passwordHint")}</FormHelperText>
            )}
          </FormControl>

          <TextField
            id="confirmPassword"
            data-testid="reg-confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            label={t("confirmPassword")}
            required
            error={!confirmPasswordValid}
            helperText={!confirmPasswordValid && t("confirmPasswordHint")}
            fullWidth
            onChange={handleConfirmPasswordChange}
          />
        </Box>
        <Button
          data-testid="reg-button"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          {t("register")}
        </Button>
      </Container>
    </Container>
  );
};

export default Register;
