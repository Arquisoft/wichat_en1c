// src/GameContext.js
import { createContext, useEffect, useState } from 'react';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameEnded, setGameEnded] = useState(false);

  // GameEnded false when the app is closed
  useEffect(() => {
      const handleUnload = () => setGameEnded(false);
      window.addEventListener('beforeunload', handleUnload);

      // Clean the listener
      return () => window.removeEventListener('beforeunload', handleUnload);
   }, []);

  return (
    <GameContext.Provider value={{ gameEnded, setGameEnded }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };