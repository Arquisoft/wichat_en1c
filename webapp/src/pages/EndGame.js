// src/pages/EndGame.js
import React, { useEffect, useRef, useContext } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { GameContext } from "../GameContext";

const EndGame = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const buttonRef = useRef(null); // Create a reference to the button

  const { setGameEnded } = useContext(GameContext);

  const handleReturnHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus(); // Focus on the button when the component mounts
    }

    return () => {
      setGameEnded(false); // Reset gameEnded when leaving the page
    };
  }, []);

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ textAlign: "center", mt: 20 }}
    >
      <Typography data-testid="end-text" variant="h4" gutterBottom>
        🎉 {t("endGame")} 🎉
      </Typography>
      <Typography data-testid="thanks-text" variant="h6" sx={{ mb: 3 }}>
        {t("thanks")}!
      </Typography>
      <form onSubmit={handleReturnHome}>
        <Button
          data-testid="home-button"
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

export default EndGame;
