// src/pages/NotFound.js
import React, { useRef, useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const navigate = useNavigate();
  const buttonRef = useRef(null); // Create a reference to the button
  const { t } = useTranslation();

  const handleGoHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus(); // Focus on the button when the component mounts
    }
  }, []);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t("notFound1")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("notFound2")}
      </Typography>

      {/* Home Button */}
      <form onSubmit={handleGoHome}>
        <Button
          data-testid="home-notfound"
          ref={buttonRef}
          type="submit"
          variant="contained"
          color="primary"
        >
          {t("goHome")}
        </Button>
      </form>
    </Container>
  );
};

export default NotFound;
