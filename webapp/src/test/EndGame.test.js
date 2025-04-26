// src/test/EndGame.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import EndGame from "../pages/EndGame";
import { GameProvider, GameContext } from "../GameContext";

describe("EndGame Page", () => {
  test("renders end of game and thanks text, Go Home button, and navigates to home page on button click", () => {
    render(
      <BrowserRouter>
        <GameProvider>
          <EndGame />
        </GameProvider>
      </BrowserRouter>
    );

    // Check if the end-game text is rendered
    const endGameText = screen.getByTestId("end-text");
    expect(endGameText).toBeInTheDocument();

    // Check if the thanks text is rendered
    const thanksText = screen.getByTestId("thanks-text");
    expect(thanksText).toBeInTheDocument();

    // Check if the "Go Home" button is rendered
    const goHomeButton = screen.getByTestId("home-button");
    expect(goHomeButton).toBeInTheDocument();

    // Simulate button click to go home
    fireEvent.click(goHomeButton);

    // Check if the URL has changed to '/'
    expect(window.location.pathname).toBe("/");
  });

  test("displays correct/incorrect answers and calculates accuracy", () => {
    render(
      <BrowserRouter>
        <GameContext.Provider
          value={{
            gameEnded: true,
            setGameEnded: jest.fn(),
            correctAnswers: 2,
            setCorrectAnswers: jest.fn(),
            incorrectAnswers: 1,
            setIncorrectAnswers: jest.fn(),
            hintHistory: [],
            addHintToHistory: jest.fn(),
            setHintHistory: jest.fn(),
            resetGameStats: jest.fn(),
          }}
        >
          <EndGame />
        </GameContext.Provider>
      </BrowserRouter>
    );

    const correct = screen.getByTestId("correct-answers");
    expect(correct).toHaveTextContent(/correct/i);
    expect(screen.getByText("2")).toBeInTheDocument();

    const incorrect = screen.getByTestId("incorrect-answers");
    expect(incorrect).toHaveTextContent(/incorrect/i);
    expect(screen.getByText("1")).toBeInTheDocument();

    const accuracy = screen.getByTestId("accuracy");
    expect(accuracy).toHaveTextContent("67%");
  });
});
