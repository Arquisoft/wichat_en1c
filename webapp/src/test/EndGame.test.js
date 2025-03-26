import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import EndGame from '../pages/EndGame'; 

describe('EndGame Page', () => {
  test('renders end of game and thanks text, Go Home button, and navigates to home page on button click', () => {
    render(
      <BrowserRouter>
        <EndGame />
      </BrowserRouter>
    );

    // Check if the end-game text is rendered
    const endGameText = screen.getByTestId('end-text');
    expect(endGameText).toBeInTheDocument();

    // Check if the thanks text is rendered
    const thanksText = screen.getByTestId('thanks-text');
    expect(thanksText).toBeInTheDocument();

    // Check if the "Go Home" button is rendered
    const goHomeButton = screen.getByTestId('goHome-button');
    expect(goHomeButton).toBeInTheDocument();

    // Simulate button click to go home
    fireEvent.click(goHomeButton);

    // Check if the URL has changed to '/'
    expect(window.location.pathname).toBe('/');
  });
});