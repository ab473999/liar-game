"use client";
import { createContext, useEffect, useState, useContext } from "react";

const GameContext = createContext();

export const GameContextWrapper = ({ children }) => {
  const [playerNum, setPlayerNum] = useState(3);
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
        
        // Fetch themes from our backend API
        const includeEasterEgg = easterEgg === "onnuri";
        const response = await fetch(`http://localhost:3001/api/themes?easterEgg=${includeEasterEgg}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch themes');
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Transform the backend data to match the expected format
          const transformedThemes = result.data.map(theme => ({
            id: theme.id,
            type: theme.type,
            typeKr: theme.nameKo,
            typeEn: theme.nameEn,
            typeIt: theme.nameIt,
            easterEgg: theme.easterEgg
          }));
          
          setDbData(transformedThemes);
          console.log('Themes loaded from backend:', transformedThemes.length, 'themes');
        } else {
          setError(result.error || 'Failed to load themes');
          console.error('Failed to load themes:', result.error);
        }
      } catch (err) {
        console.error('Error fetching themes from backend:', err);
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