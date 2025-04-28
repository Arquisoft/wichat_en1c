// src/test/Stats.test.js
import { render, screen, waitFor, act } from "@testing-library/react";
import Stats from "../pages/Stats"; 
import { SessionContext } from "../SessionContext"; 
import { BrowserRouter } from "react-router";
import axios from "axios";

jest.mock("axios");

const mockContextValue = {
    username: "testuser",
};

const renderWithContextAndRouter = (component) => {
    return render(
        <BrowserRouter>
            <SessionContext.Provider value={mockContextValue}>
                {component}
            </SessionContext.Provider>
        </BrowserRouter>
    );
};

const mockStatsData = {
    time: {
        total: 3665000,
        game: { min: 60000, max: 120000, avg: 90000 },
        question: { min: 5000, max: 15000, avg: 10000 },
    },
    question: { passed: 50, failed: 7, unanswered: 3, total: 60 },
    game: { total: 6 },
};

const mockStatsDataZero = {
    time: {
        total: 0,
        game: { min: 0, max: 0, avg: 0 },
        question: { min: 0, max: 0, avg: 0 },
    },
    question: { passed: 0, failed: 0, unanswered: 0, total: 0 },
    game: { total: 0 },
};

describe("Stats Component Tests", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url.includes("/stats/users/testuser")) {
                return Promise.resolve({  data:{stats: mockStatsData}  });
            } else if (url.includes("/stats/users/zerouser")) {
                return Promise.resolve({  data:{stats: mockStatsDataZero}  });
            }
            return Promise.reject(new Error(`Unknown endpoint: ${url}`));
        });
    });

    it("should render loading state initially", () => {
        renderWithContextAndRouter(<Stats />);
        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
        expect(screen.getByTestId("loading-stats")).toBeInTheDocument();
    });

    it("should display 'No statistics available' when no game played", async () => {
        const mockZeroContext = { username: "zerouser" };
        render(
            <BrowserRouter>
                <SessionContext.Provider value={mockZeroContext}>
                    <Stats />
                </SessionContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("no-stats")).toBeInTheDocument();
            expect(screen.getByText("noStatsAvailable")).toBeInTheDocument();
            expect(screen.getByText("noStatsYet")).toBeInTheDocument();
        });
    });

    it("should display statistics when API call is successful", async () => {
        await act(async () => {
            renderWithContextAndRouter(<Stats />);
        });

        await waitFor(() => {
            expect(screen.getByTestId("stats-data")).toBeInTheDocument();
            expect(screen.getByTestId("stats-title")).toHaveTextContent("statsFor");
            expect(screen.getByTestId("total-time")).toHaveTextContent("1time.hoursShort 1time.minutesShort 5time.secondsShort");
            expect(screen.getByTestId("min-game-time")).toHaveTextContent("1time.minutesShort 1time.secondsShort");
            expect(screen.getByTestId("max-game-time")).toHaveTextContent("2time.minutesShort 1time.secondsShort");
            expect(screen.getByTestId("avg-game-time")).toHaveTextContent("1time.minutesShort 30time.secondsShort");
            expect(screen.getByTestId("correct-questions")).toHaveTextContent("correct: 50");
            expect(screen.getByTestId("incorrect-questions")).toHaveTextContent("incorrect: 7");
            expect(screen.getByTestId("unanswered-questions")).toHaveTextContent("unanswered: 3");
            expect(screen.getByTestId("total-questions")).toHaveTextContent("60");
            expect(screen.getByTestId("total-games")).toHaveTextContent("6");
            expect(screen.getByTestId("accuracy")).toHaveTextContent("accuracy");
        });
    });
});