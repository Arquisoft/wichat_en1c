// src/test/Home.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { SessionProvider } from "../SessionContext";
import Home from "../pages/Home";

describe("Home Page", () => {
  test("renders the title of the app, button and navigation to game", () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Home />
        </SessionProvider>
      </BrowserRouter>
    );

    // Check if the title image is rendered
    expect(screen.getByTestId("wichat-title")).toBeInTheDocument();

    const playButton = screen.getByTestId("play-button");

    // Check if the Play button text is rendered
    expect(playButton).toBeInTheDocument();

    // Find the button and simulate a click
    fireEvent.click(playButton);

    // Check if the URL has changed to '/game'
    expect(window.location.pathname).toBe("/game");
  });
});
