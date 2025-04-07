// src/test/Game.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Game from "../pages/Game";
import { BrowserRouter } from "react-router";
import { GameProvider } from "../GameContext";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Mock data
const mockQuestionData = {
  question: "Who is the musician born on 1979-01-01T00:00:00Z in the image?",
  image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Killa_Kela.jpg",
  options: [
    "Phil Shoenfelt",
    "Killa Kella",
    "Kevin Rowland",
    "Cristopher Guest",
  ],
};

const mockSettings = {
  time: 20,
  rounds: 2,
  hints: 5,
};

jest.setTimeout(20000);

describe("Game Page Tests", () => {
  beforeEach(() => {
    // Mockear axios para devolver los datos de la configuración del juego
    axios.get.mockImplementation((url) => {
      if (url.includes("/game/config")) {
        return Promise.resolve({ data: mockSettings });
      } else if (url.includes("/game/question")) {
        return Promise.resolve({ data: mockQuestionData });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    axios.post.mockImplementation((url) => {
      if (url.includes("/game/answer")) {
        return Promise.resolve({
          data: { isCorrect: true, correctAnswer: "Killa Kella" },
        });
      } else if (url.includes("/game/quit")) {
        return Promise.resolve({ data: { success: true } }); // Simulate a successful quit
      } else if (url.includes("/game/save")) {
        return Promise.resolve({ data: { success: true } }); // Simulate a successful save
      } else if (url.includes("/game/hint")) {
        return Promise.resolve({ data: { hint: "Good" } }); // Simulate a hint response
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
  });

  it("should render all components correctly", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
         <GameProvider>
            <Game />
          </GameProvider>
        </SessionProvider>
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading-text")).not.toBeInTheDocument()
    );

    // Test if the question is rendered
    expect(
      screen.getByText(
        "Who is the musician born on January 1, 1979 in the image?"
      )
    ).toBeInTheDocument();

    // Test if the image is rendered
    expect(screen.getByTestId("question-image")).toBeInTheDocument();

    // Test if the hint section is present
    expect(screen.getByTestId("hints-used")).toBeInTheDocument();

    // Test if the time progress bar is rendered
    expect(screen.getByTestId("time-progress-bar")).toBeInTheDocument();

    // Test if the round info is rendered
    expect(screen.getByTestId("round-info")).toHaveTextContent("round: 1 / 2");

    // Test if the hint input is rendered
    expect(screen.getByTestId("hint-input")).toBeInTheDocument();

    // Test if the hint button is rendered
    expect(screen.getByTestId("hint-button")).toBeInTheDocument();

    // Test if the options are rendered
    expect(screen.getByText("Phil Shoenfelt")).toBeInTheDocument();
    expect(screen.getByText("Killa Kella")).toBeInTheDocument();
    expect(screen.getByText("Kevin Rowland")).toBeInTheDocument();
    expect(screen.getByText("Cristopher Guest")).toBeInTheDocument();
  });

  it("should increase hints used when the hint button is clicked", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
         <GameProvider>
            <Game />
          </GameProvider>
        </SessionProvider>
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading-text")).not.toBeInTheDocument()
    );

    // Initial hints used should be 0
    expect(screen.getByTestId("hints-used")).toHaveTextContent("hints: 0/5");

    // Click on the hint button
    fireEvent.click(screen.getByTestId("hint-button"));

    // Check if hints used increases
    expect(screen.getByTestId("hints-used")).toHaveTextContent("hints: 1/5");
  });

  it('should show the "End of the Game" screen when game ends', async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
         <GameProvider>
            <Game />
          </GameProvider>
        </SessionProvider>
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading-text")).not.toBeInTheDocument()
    );

    // Function to delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Simulate clicking the first option two times
    const firstOption = screen.getAllByRole("button")[0];
    fireEvent.click(firstOption);
    await delay(3000);
    fireEvent.click(firstOption);
    await delay(3000);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/end-game"));
  });
});
