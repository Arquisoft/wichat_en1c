// src/test/CustomGame.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomGame from '../pages/CustomGame';
import { BrowserRouter } from 'react-router';
import { SessionProvider } from '../SessionContext';
import { GameProvider } from '../GameContext';

const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))

const renderCustomGame = () => {
  return render(
    <BrowserRouter>
        <SessionProvider>
            <GameProvider>
                <CustomGame />
            </GameProvider>
        </SessionProvider>
    </BrowserRouter>
  );
};

describe('Customize game', () => {
  beforeEach(() => {
    renderCustomGame();
  });

  test('renders default values', () => {
    expect(screen.getByTestId('rounds-input')).toHaveValue(10);
    expect(screen.getByTestId('time-input')).toHaveValue(20);
    expect(screen.getByTestId('hints-input')).toHaveValue(3);
    expect(screen.getByTestId('ai-game-switch')).not.toBeChecked();
  });

  test('updates rounds correctly', () => {
    const rounds = screen.getByTestId('rounds-input');
    fireEvent.change(rounds, { target: { value: 10 } });
    expect(rounds).toHaveValue(10);
  });

  test('updates time correctly', () => {
    const time = screen.getByTestId('time-input');
    fireEvent.change(time, { target: { value: 50 } });
    expect(time).toHaveValue(50);
  });

  test('updates hints correctly', () => {
    const hints = screen.getByTestId('hints-input');
    fireEvent.change(hints, { target: { value: 4 } });
    expect(hints).toHaveValue(4);
  });

  test('toggles AI mode', () => {
    const aiSwitch = screen.getByTestId('ai-game-switch');
    fireEvent.click(aiSwitch);
    expect(aiSwitch).toBeChecked();
    const startBtn = screen.getByTestId('start-game-button');
    fireEvent.click(startBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/game-ai")
  });

  test('selects and deselects a category', () => {
    const category = screen.getByTestId('add-category-history');
    fireEvent.click(category);
    expect(screen.queryByTestId("add-category-history")).toBeNull();

    expect(screen.getByTestId("remove-category-history")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("remove-category-history"));
    

    expect(screen.getByTestId("add-category-history")).toBeInTheDocument();
  });

  test('start button works correctly', () => {
    const startBtn = screen.getByTestId('start-game-button');
    fireEvent.click(startBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/game")
  });

  test('back button works correctly', () => {
    const backBtn = screen.getByTestId('back-button');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/")
  });
});
