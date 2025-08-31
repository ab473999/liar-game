"use client";
import { createContext, useEffect, useState, useContext } from "react";

const GameContext = createContext();

export const GameContextWrapper = ({ children }) => {
  const [playerNum, setPlayerNum] = useState(3);
  const [spyMode, setSpyMode] = useState(false);
  const [spyNumber, setSpyNumber] = useState(0);
  const [theme, setTheme] = useState("");
  const [themeKr, setThemeKr] = useState("");
  const [easterEgg, setEasterEgg] = useState("false");
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {

      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch themes from our new API
        const includeEasterEgg = easterEgg === "onnuri";
        const response = await fetch(`/api/themes?easterEgg=${includeEasterEgg}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch themes');
        }
        
        const result = await response.json();
        
        if (result.success) {
          setDbData(result.data);
          console.log('Themes loaded:', result.data.length, 'themes');
        } else {
          setError(result.error || 'Failed to load themes');
          console.error('Failed to load themes:', result.error);
        }
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError('Failed to load themes. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [easterEgg]);

  return (
    <GameContext.Provider
      value={{
        playerNum,
        setPlayerNum,
        spyMode,
        setSpyMode,
        spyNumber,
        setSpyNumber,
        theme,
        setTheme,
        themeKr,
        setThemeKr,
        easterEgg,
        setEasterEgg,
        dbData,
        loading,
        error,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};