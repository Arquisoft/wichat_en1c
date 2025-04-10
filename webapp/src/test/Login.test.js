// src/test/Login.test.js
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { SessionProvider } from "../SessionContext";
import Login from "../pages/Login";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));
import { BrowserRouter } from "react-router";

const mockAxios = new MockAdapter(axios);
const apiEndpoint = process.env.API_ENDPOINT || "http://localhost:8000";

describe("Login component", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it("should log in successfully", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen
      .getByTestId("log-username")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("log-password")
      .querySelector("input");
    const loginButton = screen.getByTestId("log-button");

    // Mock the axios.post request to simulate a successful login response
    mockAxios.onPost(apiEndpoint + "/auth/login").reply(200, {
      success: true,
      token: "fakeToken123",
      username: "testUser",
    });

    fireEvent.input(usernameInput, { target: { value: "testUser" } });
    fireEvent.input(passwordInput, { target: { value: "testPassword_1" } });
    fireEvent.click(loginButton);

    // Wait for the navigation to be called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should handle error when logging in (Invalid creds)", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen
      .getByTestId("log-username")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("log-password")
      .querySelector("input");
    const loginButton = screen.getByTestId("log-button");

    // Mock the axios.post request to simulate an Unauthorized error response
    mockAxios.onPost(apiEndpoint + "/auth/login").reply(401, {
      success: false,
      message: "Unauthorized",
    });

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: "nonExistentUser" } });
    fireEvent.input(passwordInput, { target: { value: "wrongPassword" } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/loginError/i)).toBeInTheDocument();
    });
  });

  it("should handle error when logging in", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen
      .getByTestId("log-username")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("log-password")
      .querySelector("input");
    const loginButton = screen.getByTestId("log-button");

    // Mock the axios.post request to simulate an Internal Server Error response
    mockAxios.onPost(apiEndpoint + "/auth/login").reply(500, {
      success: false,
      message: "Internal Server Error",
    });

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: "testUser" } });
    fireEvent.input(passwordInput, { target: { value: "testPassword_1" } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/genericError/i)).toBeInTheDocument();
    });
  });
});
