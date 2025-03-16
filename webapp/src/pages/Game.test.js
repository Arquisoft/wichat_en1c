// src/pages/Game.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Game from './Game';
import { BrowserRouter } from 'react-router';

describe('Game Page Tests', () => { // Will be changed in prototype
  it('should render all components correctly', () => {
    render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>
    );

    // Test if the question is rendered
    expect(screen.getByText(/Who is the musician born/i)).toBeInTheDocument();

    // Test if the image is rendered
    expect(screen.getByAltText('Question Image')).toBeInTheDocument();

    // Test if the hint section is present
    expect(screen.getByText(/Hints used:/i)).toBeInTheDocument();
  });
/*
  it('should increase hints used when the hint button is clicked', async () => {
    render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>
    );

    // Initial hints used should be 0
    expect(screen.getByText('Hints used: 0/3')).toBeInTheDocument();

    // Click on the hint button
    fireEvent.submit(screen.getByRole('form'));

    // Check if hints used increases
    expect(screen.getByText('Hints used: 1/3')).toBeInTheDocument();
  });

  it('should show the "End of the Game" screen when game ends', async () => {
    render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>
    );
  
    // Function to delay by 5 seconds
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    // Simulate clicking the first option three times with a 5-second wait between each click
    const firstOption = screen.getAllByRole('button')[0];
    fireEvent.click(firstOption);
    await delay(1500);  // Wait for 3 seconds
    fireEvent.click(firstOption);
    await delay(1500);  // Wait for 3 seconds
    fireEvent.click(firstOption);
  
    // Simulate end of game by setting gameEnded to true
    await waitFor(() => expect(screen.getByText(/🎉 End of the Game 🎉/i)).toBeInTheDocument());
  
    // Test if the Go Home button is visible
    expect(screen.getByText(/Go Home/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Go Home'));
    expect(window.location.pathname).toBe('/');
  });
  */
});