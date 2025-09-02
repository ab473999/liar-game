"use client";
import { createContext, useEffect, useState, useContext } from "react";
import { getApiUrl } from "@/config/api";

const GameContext = createContext();

export const GameContextWrapper = ({ children }) => {
  const [playerNum, setPlayerNum] = useState(3);
  const [theme, setTheme] = useState("");
  const [themeKr, setThemeKr] = useState("");

  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {
      const startTime = performance.now();
      console.log('[GameContext] Starting theme fetch...');
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch themes from our backend API
        const fetchStart = performance.now();
        const response = await fetch(getApiUrl('themes'));
        const fetchEnd = performance.now();
        console.log(`[GameContext] API fetch completed in ${(fetchEnd - fetchStart).toFixed(2)}ms`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch themes');
        }
        
        const parseStart = performance.now();
        const result = await response.json();
        const parseEnd = performance.now();
        console.log(`[GameContext] JSON parsing completed in ${(parseEnd - parseStart).toFixed(2)}ms`);
        
        if (result.success) {
          // Transform the backend data to match the expected format
          const transformedThemes = result.data.map(theme => ({
            id: theme.id,
            type: theme.type,
            typeKr: theme.nameKo,
            typeEn: theme.nameEn,
            typeIt: theme.nameIt
          }));
          
          setDbData(transformedThemes);
          const totalTime = performance.now() - startTime;
          console.log(`[GameContext] Themes loaded successfully: ${transformedThemes.length} themes in ${totalTime.toFixed(2)}ms`);
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
  }, []);

  return (
    <GameContext.Provider
      value={{
        playerNum,
        setPlayerNum,
        theme,
        setTheme,
        themeKr,
        setThemeKr,

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