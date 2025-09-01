"use client";

import { useGameContext } from "@/components/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const {
    playerNum,
    setPlayerNum,
    theme,
    setTheme,
    setThemeKr,
    themeKr,
    easterEgg,
    dbData,
    loading,
    error,
  } = useGameContext();

  let themeButton = [];
  // After apiData state has value from the API
  if (dbData) {
    themeButton = dbData.map((theme) => {
      // Skip corrupted or invalid theme data
      if (!theme.type || typeof theme.type !== 'string') {
        return null;
      }
      
      // Get the translated theme name, fallback to typeKr, then type
      const themeName = t(`themes.${theme.type}`, null) || theme.typeKr || theme.type;
      
      return theme.easterEgg === false || theme.easterEgg === easterEgg ? (
        <Link
          href="/game"
          onClick={() => {
            console.log(`[Settings] Theme selected: ${theme.type}`);
            setTheme(theme.type);
            setThemeKr(theme.typeKr || themeName);
          }}
          key={theme.type}
          className="inline-block border border-white text-lg hover:opacity-75"
        >
          {themeName}
        </Link>
      ) : (
        "" // Empty string
      );
    }).filter(Boolean); // Remove null entries
  } else {
    // Fallback to local themes when dbData is not available
    const localThemes = [
      { type: 'food', typeKr: '음식' },
      { type: 'place', typeKr: '장소' },
      { type: 'occupation', typeKr: '직업' },
      { type: 'biblecharacter', typeKr: '성경인물' },
      { type: 'onnurichanyangteammember', typeKr: '온누리 찬양팀' }
    ];
    
    themeButton = localThemes.map((theme) => {
      const themeName = t(`themes.${theme.type}`, null) || theme.typeKr || theme.type;
      
      return theme.type !== 'onnurichanyangteammember' || easterEgg === 'onnuri' ? (
        <Link
          href="/game"
          onClick={() => {
            setTheme(theme.type);
            setThemeKr(themeName);
          }}
          key={theme.type}
          className="inline-block border border-white text-lg hover:opacity-75"
        >
          {themeName}
        </Link>
      ) : null;
    }).filter(Boolean);
  }

  return (
    <section className="text-center flex flex-col space-y-4">
        <form className="flex flex-col items-center">
          <div className="m-4 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    const newPlayerNum = Math.min(20, playerNum + 1);
                    setPlayerNum(newPlayerNum);
                  }}
                  className={`p-1 transition-colors ${
                    playerNum >= 20 
                      ? 'cursor-not-allowed opacity-40' 
                      : 'hover:opacity-75'
                  }`}
                  style={{ 
                    color: playerNum >= 20 ? 'var(--color-textMuted)' : 'var(--color-textPrimary)',
                    border: 'none',
                    background: 'transparent'
                  }}
                  disabled={playerNum >= 20}
                  aria-label="Increase players"
                >
                  <ChevronUp size={24} />
                </button>
                
                <div className="text-4xl px-2 py-0 min-w-[60px] text-center">
                  {playerNum}
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    const newPlayerNum = Math.max(3, playerNum - 1);
                    setPlayerNum(newPlayerNum);
                  }}
                  className={`p-1 transition-colors ${
                    playerNum <= 3 
                      ? 'cursor-not-allowed opacity-40' 
                      : 'hover:opacity-75'
                  }`}
                  style={{ 
                    color: playerNum <= 3 ? 'var(--color-textMuted)' : 'var(--color-textPrimary)',
                    border: 'none',
                    background: 'transparent'
                  }}
                  disabled={playerNum <= 3}
                  aria-label="Decrease players"
                >
                  <ChevronDown size={24} />
                </button>
              </div>
              
              <span className="text-2xl">{t("settings.players", null) || "players"}</span>
            </div>
          </div>
        </form>

        <div className="m-4">
          <h2>{t("settings.theme")} {theme ? (t(`themes.${theme}`, null) || themeKr || "") : ""}</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 mt-8">
              {/* Skeleton loader for themes */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 text-center">
              <p className="text-red-400">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-8">
              {themeButton.map((button) => {
                return button;
              })}
            </div>
          )}
        </div>
      </section>
    );
  }
