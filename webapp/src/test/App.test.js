// src/test/App.test.js
import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router';
import { SessionProvider } from '../SessionContext';

describe('App Component', () => {
  test('renders home page initially', () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <App />
        </SessionProvider>
      </BrowserRouter>
    );

    // Home page
    const titleElement = screen.getByTestId('wichat-title');
    expect(titleElement).toBeInTheDocument();

    // BackgrounVideo
    const videoElement = screen.getByTestId('video-element');
    expect(videoElement).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/ChattySW ©/i)).toBeInTheDocument(); 

    // NavBar
    expect(screen.getByAltText("WIChatLogo")).toBeInTheDocument();
  });

  test('renders login page when navigating to /login', () => {
    window.history.pushState({}, '', '/login'); // Navigate to login page

    render(
      <BrowserRouter>
        <SessionProvider>
          <App />
        </SessionProvider>
      </BrowserRouter>
    );

    // Check if the login page is rendered by looking for unique text on the login page
    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument();
  });

  test('renders register page when navigating to /register', () => {
    window.history.pushState({}, '', '/register'); // Navigate to register page

    render(
      <BrowserRouter>
        <SessionProvider>
          <App />
        </SessionProvider>
      </BrowserRouter>
    );

    // Check if the register page is rendered by looking for unique text on the register page
    expect(screen.getByRole('heading', { level: 1, name: 'Register' })).toBeInTheDocument();
  });

  test('shows 404 page on invalid route', () => {
    window.history.pushState({}, '', '/non-existing-route'); // Navigate to a non-existing route

    render(
      <BrowserRouter>
        <SessionProvider>
          <App />
        </SessionProvider>
      </BrowserRouter>
    );

    // Check if the 404 page is rendered by looking for unique text on the 404 page
    expect(screen.getByText('404')).toBeInTheDocument(); 
  });
});