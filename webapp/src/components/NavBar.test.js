// src/components/NavBar.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "./NavBar";
import { BrowserRouter } from "react-router";
import { SessionContext } from "../SessionContext";

// Mock navigate (so we can track route changes)
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("NavBar Component", () => {
  const renderNavBar = (contextValue) => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={contextValue}>
          <NavBar />
        </SessionContext.Provider>
      </BrowserRouter>
    );
  };

  test("renders logo and Home button", () => {
    renderNavBar({ username: "", isLoggedIn: false });

    const logo = screen.getByAltText("WIChatLogo");
    const homeButton = screen.getByText("Home");

    expect(logo).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
  });

  test("shows Login and Register buttons when not logged in", () => {
    renderNavBar({ username: "", isLoggedIn: false });

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("shows welcome message and Logout when logged in", () => {
    renderNavBar({
      username: "Daniel",
      isLoggedIn: true,
      destroySession: jest.fn(),
    });

    expect(screen.getByText("Hello, Daniel!")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to home when clicking the logo", () => {
    renderNavBar({ username: "", isLoggedIn: false });

    const logo = screen.getByAltText("WIChatLogo");
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("calls destroySession and navigates to login on Logout", () => {
    const mockDestroySession = jest.fn();
    renderNavBar({
      username: "Daniel",
      isLoggedIn: true,
      destroySession: mockDestroySession,
    });

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockDestroySession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("navigates to login and register correctly", () => {
    renderNavBar({ username: "", isLoggedIn: false });

    fireEvent.click(screen.getByText("Login"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    fireEvent.click(screen.getByText("Register"));
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});