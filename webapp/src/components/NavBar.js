// src/components/NavBar.js
import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import Logo from "../logo.svg";
import { useNavigate } from "react-router";
import { SessionContext } from "../SessionContext";
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const navigate = useNavigate();
  const { username, isLoggedIn, destroySession } = useContext(SessionContext);
  const { t, i18n } = useTranslation();

  // Change language
  const handleChangeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleLogout = () => {
    destroySession();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo and Home button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <img src={Logo} alt="WIChatLogo" style={{ height: 40 }} />
          </Button>
          <Button
            data-testid="home-nav"
            color="inherit"
            sx={{ marginLeft: 2 }}
            onClick={() => navigate("/")}
          >
            {t("home")}
          </Button>
          <Button
            data-testid="stats-nav"
            color="inherit"
            sx={{ marginLeft: 2 }}
            onClick={() => navigate("/stats")}
          >
            {t("stats")}
          </Button>
        </Box>

        {/* Session controls */}
        {isLoggedIn ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Language selector */}
            <Select
              value={i18n.resolvedLanguage}
              onChange={handleChangeLanguage}
              size="small"
              sx={{ marginRight: 2 }}
            >
              <MenuItem value="en">🇬🇧 EN</MenuItem>
              <MenuItem value="es">🇪🇸 ES</MenuItem>
            </Select>
            <Typography data-testid="hello-nav" sx={{ marginRight: 2 }}>
              {t("hello")}, {username}!
            </Typography>
            <Button
              data-testid="logout-nav"
              color="inherit"
              onClick={handleLogout}
            >
              {t("logout")}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex" }}>
            {/* Language selector */}
            <Select
              value={i18n.resolvedLanguage}
              onChange={handleChangeLanguage}
              size="small"
              sx={{ marginRight: 2 }}
            >
              <MenuItem value="en">🇬🇧 EN</MenuItem>
              <MenuItem value="es">🇪🇸 ES</MenuItem>
            </Select>
            <Button
              data-testid="login-nav"
              color="inherit"
              sx={{ marginRight: 2 }}
              onClick={() => navigate("/login")}
            >
              {t("login")}
            </Button>
            <Button
              data-testid="register-nav"
              color="inherit"
              onClick={() => navigate("/register")}
            >
              {t("register")}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
