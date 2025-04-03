// src/components/Footer.js
import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

const docsLink = "https://arquisoft.github.io/wichat_en1c/"; // Direct link to the documentation
const repoLink = "https://github.com/Arquisoft/wichat_en1c"; // Direct link to the repository

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between", // Positions items at the ends (left and right)
        p: 2,
        borderTop: "1px solid #ccc", // Border on top of the footer
        width: "100%", // Ensures the footer spans the entire width of the screen
        position: "fixed", // Fixed position at the bottom of the page
        bottom: 0, // Places the footer at the bottom of the screen
        left: 0, // Makes sure the footer starts at the left side
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* Left text: Company name */}
      <Typography variant="body2" sx={{ flex: 1, textAlign: "left" }}>
        ChattySW © {currentYear}
      </Typography>

      {/* Center text: Repository link */}
      <Link
        href={repoLink}
        target="_blank" // Open in a new tab
        rel="noopener noreferrer" // Prevents the new tab from being able to access the window.opener object
        variant="body2"
        sx={{ flex: 1, textAlign: "center" }}
      >
        WIChat_en1c
      </Link>

      {/* Right text: Documentation link */}
      <Link
        data-testid="docs-link"
        href={docsLink}
        target="_blank" // Open in a new tab
        rel="noopener noreferrer" // Prevents the new tab from being able to access the window.opener object
        variant="body2"
        sx={{ flex: 1, textAlign: "right" }}
      >
        {t("docs")}
      </Link>
    </Box>
  );
};

export default Footer;
