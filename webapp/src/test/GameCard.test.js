// src/test/GameCard.test.js
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import GameCard from "../components/GameCard"
import { BrowserRouter } from "react-router"

const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))

describe("GameCard", () => {
  const props = {
    image: "/test-image.svg",
    description: "This is a test description",
    link: "/test-link",
    title: "Test Title",
    alt: "Test Alt Text",
  }

  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it("renders title, description and image correctly", () => {
    render(
      <BrowserRouter>
        <GameCard {...props} />
      </BrowserRouter>
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("This is a test description")).toBeInTheDocument()

    const image = screen.getByAltText("Test Alt Text")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/test-image.svg")
  })

  it("navigates to the correct link on click", () => {
    render(
      <BrowserRouter>
        <GameCard {...props} />
      </BrowserRouter>
    )

    const card = screen.getByText("Test Title").closest("div")
    fireEvent.click(card)
    expect(mockNavigate).toHaveBeenCalledWith("/test-link")
  })

  it("does not crash without a title", () => {
    render(
      <BrowserRouter>
        <GameCard {...{ ...props, title: undefined }} />
      </BrowserRouter>
    )

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument()
    expect(screen.getByText("This is a test description")).toBeInTheDocument()
  })
})