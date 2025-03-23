// src/pages/Login.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import { BrowserRouter } from 'react-router';
import { SessionProvider } from '../SessionContext';

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should log in successfully', async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate a successful login response
    mockAxios.onPost('http://localhost:8000/auth/public/login').reply(200, { 
      success: true, 
      token: 'fakeToken123',
      username: 'testUser'
    });

    // Simulate user input
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword_1' } });
      fireEvent.click(loginButton);
    });

    // Wait for the successful login action and the Snackbar
    await waitFor(() => {
      expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    });
  });

  it('should handle error when logging in (Unauthorized 401 - non-existent user or wrong password)', async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate an Unauthorized error response
    mockAxios.onPost('http://localhost:8000/auth/public/login').reply(401, { 
      success: false, 
      message: 'Unauthorized'
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'nonExistentUser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });
  });

  it('should handle error when logging in (Bad Request 400 - missing or invalid fields)', async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate a Bad Request (invalid input)
    mockAxios.onPost('http://localhost:8000/auth/public/login').reply(400, { 
      success: false, 
      message: 'Bad Request',
      errors: {
        username: "Username is required",
        password: "Password must be provided"
      }
    });

    // Simulate user input (leaving inputs empty to trigger 400)
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Error: Bad Request/i)).toBeInTheDocument();
    });
  });
});