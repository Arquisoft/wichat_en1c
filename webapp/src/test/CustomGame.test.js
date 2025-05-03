// src/test/CustomGame.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomGame from '../pages/CustomGame';
import { BrowserRouter } from 'react-router';
import { SessionProvider } from '../SessionContext';
import { GameProvider } from '../GameContext';
import axios from "axios";

jest.mock("axios");

const mockCategories = {
  en: [
    { id: "musician", name: "musician" },
  ],
  es: [
    { id: "musician", name: "músico" },
  ],
}

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
    axios.post.mockImplementation((url) => {
      if (url.includes("/game/custom")) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
  
    renderCustomGame();
  });

  test('renders default values', async () => {
    expect(screen.getByTestId('rounds-input')).toHaveValue(10);
    expect(screen.getByTestId('time-input')).toHaveValue(20);
    expect(screen.getByTestId('hints-input')).toHaveValue(3);
    expect(screen.getByTestId('ai-game-switch')).not.toBeChecked();
  });

  test('updates rounds correctly', async () => {
    const rounds = screen.getByTestId('rounds-input');
    fireEvent.change(rounds, { target: { value: 10 } });
    expect(rounds).toHaveValue(10);
  });

  test('updates time correctly', async () => {
    const time = screen.getByTestId('time-input');
    fireEvent.change(time, { target: { value: 50 } });
    expect(time).toHaveValue(50);
  });

  test('updates hints correctly', async () => {
    const hints = screen.getByTestId('hints-input');
    fireEvent.change(hints, { target: { value: 4 } });
    expect(hints).toHaveValue(4);
  });

  test('toggles AI mode', async () => {
    const aiSwitch = screen.getByTestId('ai-game-switch');
    fireEvent.click(aiSwitch);
    expect(aiSwitch).toBeChecked();
    const startBtn = screen.getByTestId('start-game-button');
    fireEvent.click(startBtn);
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    expect(mockNavigate).toHaveBeenCalledWith("/game-ai")
  });

  test('selects and deselects a category', async () => {
    const category = screen.getByTestId('add-category-musician');
    fireEvent.click(category);
    expect(screen.queryByTestId("add-category-musician")).toBeNull();

    expect(screen.getByTestId("remove-category-musician")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("remove-category-musician"));
    

    expect(screen.getByTestId("add-category-musician")).toBeInTheDocument();
  });

  test('start button works correctly', async () => {
    const startBtn = screen.getByTestId('start-game-button');
    fireEvent.click(startBtn);
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    expect(mockNavigate).toHaveBeenCalledWith("/game")
  });

  test('back button works correctly', async () => {
    const backBtn = screen.getByTestId('back-button');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/")
  });
});
