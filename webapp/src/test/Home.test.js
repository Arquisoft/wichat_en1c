// src/test/Home.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { SessionProvider } from "../SessionContext";
import { GameProvider } from "../GameContext";
import Home from "../pages/Home";

const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))

describe("Home Page", () => {
  test("renders title and play button, then shows game cards on click", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </SessionProvider>
      </BrowserRouter>
    )

    // Initial screen
    expect(screen.getByTestId("wichat-title")).toBeInTheDocument()
    const playButton = screen.getByTestId("play-button")
    expect(playButton).toBeInTheDocument()

    // Click play and expect the 3 game mode cards
    fireEvent.click(playButton)

    await waitFor(() => expect(screen.getByTestId("select-mode")).toBeInTheDocument())
    expect(screen.getByTestId("game-mode-0")).toBeInTheDocument()
    expect(screen.getByTestId("game-mode-1")).toBeInTheDocument()
    expect(screen.getByTestId("game-mode-2")).toBeInTheDocument()
  })

  test("navigates correctly when a GameCard is clicked", async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </SessionProvider>
      </BrowserRouter>
    )

    const playButton = screen.getByTestId("play-button")
    expect(playButton).toBeInTheDocument()
    fireEvent.click(playButton)

    const cards = [
      { testId: "game-mode-normal", expectedPath: "/game" },
      { testId: "game-mode-ai", expectedPath: "/game-ai" },
      { testId: "game-mode-custom", expectedPath: "/custom" },
    ]

    await waitFor(() => expect(screen.getByTestId("select-mode")).toBeInTheDocument())

    cards.forEach(({ testId, expectedPath }) => {
      const card = screen.getByTestId(testId)
      fireEvent.click(card)
      expect(mockNavigate).toHaveBeenCalledWith(expectedPath)
    })
  })
});
