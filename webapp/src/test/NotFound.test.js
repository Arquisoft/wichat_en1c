// src/test/NotFound.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import NotFound from "../pages/NotFound";

describe("NotFound Page", () => {
  test("renders 404 text, Go Home button, and navigates to home page on button click", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    // Check if the "404" text is rendered
    expect(screen.getByText("404")).toBeInTheDocument();

    // Check if the "Go Home" button is rendered
    const goHomeButton = screen.getByTestId("home-notfound");
    expect(goHomeButton).toBeInTheDocument();

    // Simulate button click to go home
    fireEvent.click(goHomeButton);

    // Check if the URL has changed to '/'
    expect(window.location.pathname).toBe("/");
  });
});
