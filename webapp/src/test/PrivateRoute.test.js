// src/test/PrivateRoute.test.js
import { render, screen } from "@testing-library/react";
import PrivateRoute from "../components/PrivateRoute";
import { BrowserRouter } from "react-router";
import React from "react";
import { GameContext } from "../GameContext";
import { SessionContext } from "../SessionContext";

const MockComponent = () => <div>Private Page</div>; // Mock component to pass into the route

describe("PrivateRoute Component", () => {
  const renderRoute = (contextValue, contextGame, gameEnd=false) => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={contextValue}>
          <GameContext.Provider value={contextGame}>
            <PrivateRoute element={<MockComponent/ >} requireGameEnd={gameEnd}/>
          </GameContext.Provider>
        </SessionContext.Provider>
      </BrowserRouter>
    );
  };

  test("renders element when session exists", () => {

    renderRoute({ isLoggedIn: true }, { gameEnded: false })

    // Check if the "Private Page" component is rendered
    expect(screen.getByText("Private Page")).toBeInTheDocument();
  });

  test("redirects to login page when session does not exist", () => {

    renderRoute({ isLoggedIn: false }, { gameEnded: false })

    // Check if the path is redirected to "/login"
    expect(window.location.pathname).toBe("/login");
  });

  test("redirects to home page when game has not been played", () => {

    renderRoute({ isLoggedIn: true }, { gameEnded: false }, true)

    // Check if the path is redirected to "/"
    expect(window.location.pathname).toBe("/");
  });
});
