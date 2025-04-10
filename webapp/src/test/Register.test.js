// src/test/Register.test.js
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Register from "../pages/Register";
import { SessionProvider } from "../SessionContext";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));
import { BrowserRouter } from "react-router";

const mockAxios = new MockAdapter(axios);

describe("Register component", () => {
  const apiEndpoint = "http://localhost:8000";

  beforeEach(() => {
    mockAxios.reset();
  });

  it("should register a new user successfully", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen
      .getByTestId("reg-username")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("reg-password")
      .querySelector("input");
    const confirmInput = screen
      .getByTestId("reg-confirm-password")
      .querySelector("input");
    const registerButton = screen.getByTestId("reg-button");

    // Mock successful registration response
    mockAxios
      .onPost(apiEndpoint + "/auth/signup")
      .reply(201, { success: true });
    mockAxios.onPost(apiEndpoint + "/auth/login").reply(200, {
      success: true,
      token: "fakeToken123",
      username: "newUser",
    });

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: "newUser" } });
    fireEvent.input(passwordInput, { target: { value: "StrongPass123!" } });
    fireEvent.input(confirmInput, { target: { value: "StrongPass123!" } });

    // Trigger register button click
    fireEvent.click(registerButton);

    // Wait for success Snackbar to appear
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should handle 401 error", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen
      .getByTestId("reg-username")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("reg-password")
      .querySelector("input");
    const confirmInput = screen
      .getByTestId("reg-confirm-password")
      .querySelector("input");
    const registerButton = screen.getByTestId("reg-button");

    // Mock registration response
    mockAxios
      .onPost(apiEndpoint + "/auth/signup")
      .reply(401, { success: false });

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: "newUser" } });
    fireEvent.input(passwordInput, { target: { value: "StrongPass123!" } });
    fireEvent.input(confirmInput, { target: { value: "StrongPass123!" } });

    // Trigger register button click
    fireEvent.click(registerButton);

    // Wait for success Snackbar to appear
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/login?error=registerConflict"
      );
    });
  });

  it("should handle 500s", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen
      .getByTestId("reg-username")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("reg-password")
      .querySelector("input");
    const confirmInput = screen
      .getByTestId("reg-confirm-password")
      .querySelector("input");
    const registerButton = screen.getByTestId("reg-button");

    // Mock error registration response
    mockAxios
      .onPost(apiEndpoint + "/auth/signup")
      .reply(500, { success: false });

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: "newUser" } });
    fireEvent.input(passwordInput, { target: { value: "StrongPass123!" } });
    fireEvent.input(confirmInput, { target: { value: "StrongPass123!" } });

    // Trigger register button click
    fireEvent.click(registerButton);

    // Wait for success Snackbar to appear
    await waitFor(() => {
      expect(screen.getByText(/genericError/i)).toBeInTheDocument();
    });
  });

  it("should handle (impossible) 400s", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen
      .getByTestId("reg-username")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("reg-password")
      .querySelector("input");
    const confirmInput = screen
      .getByTestId("reg-confirm-password")
      .querySelector("input");
    const registerButton = screen.getByTestId("reg-button");

    // Mock error registration response
    mockAxios
      .onPost(apiEndpoint + "/auth/signup")
      .reply(400, { success: false });

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: "newUser" } });
    fireEvent.input(passwordInput, { target: { value: "StrongPass123!" } });
    fireEvent.input(confirmInput, { target: { value: "StrongPass123!" } });

    // Trigger register button click
    fireEvent.click(registerButton);

    // Wait for success Snackbar to appear
    await waitFor(() => {
      expect(screen.getByText(/registerError/i)).toBeInTheDocument();
    });
  });
});
