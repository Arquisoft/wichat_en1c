// src/test/Register.test.js
import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Register from "../pages/Register";
import { BrowserRouter } from "react-router";
import { SessionProvider } from "../SessionContext";

const mockAxios = new MockAdapter(axios);

describe("Register component", () => {
  const apiEndpoint = "http://localhost:8000/auth/signup";

  beforeEach(() => {
    mockAxios.reset();
  });

  it("should register a new user successfully (201)", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId("reg-username").querySelector("input");
    const passwordInput = screen.getByTestId("reg-password").querySelector("input");
    const registerButton = screen.getByTestId("reg-button");

    // Mock successful registration response
    mockAxios.onPost(apiEndpoint).reply(201, { success: true });

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: "newUser" } });
    fireEvent.input(passwordInput, { target: { value: "StrongPass123!" } });

    // Trigger register button click
    fireEvent.click(registerButton);

    // Wait for success Snackbar to appear
    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });
  });

  it("should handle 400 error (Bad Request)", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId("reg-username").querySelector("input");
    const passwordInput = screen.getByTestId("reg-password").querySelector("input");
    const registerButton = screen.getByTestId("reg-button");

    // Mock a 400 Bad Request response
    mockAxios.onPost(apiEndpoint).reply(400, {
      success: false,
      message: "Bad Request",
      errors: {
        username: "Username is required",
        password: "Password is too short",
      },
    });

    // Simulate user input with bad data
    fireEvent.input(usernameInput, { target: { value: "" } });
    fireEvent.input(passwordInput, { target: { value: "short" } });

    // Trigger register button click
    fireEvent.click(registerButton);

    // Wait for the error Snackbar to appear
    await waitFor(() => {
      expect(screen.getByText(/Error: Bad Request/i)).toBeInTheDocument();
    });
  });

  it("should handle 401 error (Unauthorized - user already exists)", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId("reg-username").querySelector("input");
    const passwordInput = screen.getByTestId("reg-password").querySelector("input");
    const registerButton = screen.getByRole("button", { name: /Register/i });

    // Mock a 401 Unauthorized response
    mockAxios.onPost(apiEndpoint).reply(401, {
      success: false,
      message: "Unauthorized",
    });

    // Simulate user input with an existing user
    fireEvent.input(usernameInput, { target: { value: "existingUser" } });
    fireEvent.input(passwordInput, { target: { value: "AnotherPass_1" } });

    // Trigger register button click
    fireEvent.click(registerButton);

    // Wait for the error Snackbar to appear
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });
  });
});
