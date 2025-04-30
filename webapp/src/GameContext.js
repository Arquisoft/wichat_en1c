// src/GameContext.js
import { createContext, useEffect, useState } from "react"

const GameContext = createContext()

const GameProvider = ({ children }) => {
  const [gameEnded, setGameEnded] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)
  const [hintHistory, setHintHistory] = useState([])

  // GameEnded false when the app is closed
  useEffect(() => {
    const handleUnload = () => {
      setGameEnded(false)
      resetGameStats()
    }
    window.addEventListener("beforeunload", handleUnload)

    // Clean the listener
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [])

  // Reset game statistics
  const resetGameStats = () => {
    setCorrectAnswers(0)
    setIncorrectAnswers(0)
    setHintHistory([])
  }

  // Add a hint to the history
  const addHintToHistory = (question, answer) => {
    setHintHistory((prev) => [...prev, { question, answer }])
  }

  return (
    <GameContext.Provider
      value={{
        gameEnded,
        setGameEnded,
        correctAnswers,
        setCorrectAnswers,
        incorrectAnswers,
        setIncorrectAnswers,
        hintHistory,
        addHintToHistory,
        setHintHistory,
        resetGameStats,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export { GameContext, GameProvider }
