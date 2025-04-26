// Taken from 2024 WIQ_ES04A project
// src/components/PrivateRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router";
import PropTypes from "prop-types";
import { SessionContext } from "../SessionContext";
import { GameContext } from "../GameContext";

// Private route component to restrict access
const PrivateRoute = ({ element: Element, requireGameEnd = false }) => {
  const { isLoggedIn } = useContext(SessionContext); // Check if user has an active session
  const { gameEnded } = useContext(GameContext);

  if (!isLoggedIn) return <Navigate to="/login" />; // Redirect to login if no session
  else if (requireGameEnd && !gameEnded) return <Navigate to="/" />; // Blocks if game has not ended
  return <Element />;
};

// PropTypes validation
PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
  requireGameEnd: PropTypes.bool,
};

export default PrivateRoute;
