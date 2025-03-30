// src/pages/Home.js
import React, { useRef, useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { useNavigate } from "react-router";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate();
  const buttonRef = useRef(null); // Create a reference to the button
  const { t, i18n } = useTranslation();

  const handleGame = (e) => {
    e.preventDefault();
    navigate("/game");
  };

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus(); // Focus on the button when the component mounts
    }
  }, []);

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ marginTop: 6, textAlign: "center", alignItems: "center" }}
    >
      <img
        data-testid="wichat-title"
        src="/WIChatTitle.svg"
        alt="WIChatTitle"
        style={{
          width: "150%",
          maxWidth: "800px", // Limit max size
          height: "auto",
        }}
      />

      {/* Play Button */}
      <form onSubmit={handleGame}>
        <Button
          data-testid="play-button"
          ref={buttonRef}
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 1 }}
          startIcon={<PlayArrow />} // Play Icon
        >
          {t("play")}
        </Button>
      </form>
    </Container>
  );
};

export default Home;
