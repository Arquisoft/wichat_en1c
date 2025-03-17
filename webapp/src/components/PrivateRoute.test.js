// src/components/PrivateRoute.test.js
import { render, screen } from '@testing-library/react';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter } from 'react-router';
import React from 'react';

const MockComponent = () => <div>Private Page</div>;  // Mock component to pass into the route

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  test('renders element when session exists', () => {
    // Mocking a session ID in localStorage
    localStorage.setItem('sessionId', 'valid-session-id');

    render(
      <BrowserRouter>
        <PrivateRoute element={MockComponent} />
      </BrowserRouter>
    );

    // Check if the "Private Page" component is rendered
    expect(screen.getByText('Private Page')).toBeInTheDocument();
  });

  test('redirects to login page when session does not exist', () => {
    // Ensure localStorage does not contain sessionId
    localStorage.removeItem('sessionId');

    render(
      <BrowserRouter>
        <PrivateRoute element={MockComponent} />
      </BrowserRouter>
    );

    // Check if the path is redirected to "/login"
    expect(window.location.pathname).toBe('/login');
  });
});