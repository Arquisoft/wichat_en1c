// src/components/Register.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();
  const fieldRef = useRef(null); // Create a reference to the form

  const { t } = useTranslation();

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiEndpoint}/auth/signup`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOpenSnackbar(true);
    } catch (error) {
      console.log(`Error ${error.response.data.message}`);
      setError(error.response.data.message);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    navigate("/login");
  };

  useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.focus(); // Focus on the input when the component mounts
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 20 }}>
      <Typography data-testid="reg-title" component="h1" variant="h5">
        {t("register")}
      </Typography>
      <form onSubmit={addUser}>
        <TextField
          data-testid="reg-username"
          inputRef={fieldRef}
          name="username"
          margin="normal"
          fullWidth
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          data-testid="reg-password"
          name="password"
          margin="normal"
          fullWidth
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          data-testid="reg-button"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {t("register")}
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={700}
        onClose={handleCloseSnackbar}
        message="User added successfully"
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

export default Register;
