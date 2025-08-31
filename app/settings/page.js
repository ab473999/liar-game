"use client";

// import { useEffect } from "react";
import { useGameContext } from "@/components/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function Settings() {
  const { t } = useTranslation();
  const {
    playerNum,
    setPlayerNum,

    spyMode,
    setSpyMode,
    spyNumber,
    setSpyNumber,
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

  let spyModeSelect =
    spyMode && playerNum >= 5 ? (
      <label className="mt-8">
        <select
          value={spyNumber}
          onChange={(event) => setSpyNumber(event.target.value)}
          className="w-24"
        >
          <option value="1">1</option>
          {playerNum >= 8 ? <option value="2">2</option> : ""}
          {playerNum >= 12 ? <option value="3">3</option> : ""}
          {playerNum >= 15 ? <option value="4">4</option> : ""}
          {playerNum >= 18 ? <option value="5">5</option> : ""}
        </select>
      </label>
    ) : (
      "" // Empty string
    );

  // Auto-disable spy mode if player count drops below 5
  if (playerNum < 5 && spyMode) {
    setSpyMode(false);
    setSpyNumber(0);
  }

  return (
    <section className="text-center flex flex-col space-y-4">
      <h1>{t("settings.title")}</h1>

      <form className="flex flex-col items-center">
        <label className="m-4 space-y-4">
          <h2>{t("settings.playerCount")}</h2>
          <select
            value={playerNum}
            onChange={(event) => {
              const newPlayerNum = Number(event.target.value);
              setPlayerNum(newPlayerNum);
              // Auto-disable spy mode if dropping below 5 players
              if (newPlayerNum < 5 && spyMode) {
                setSpyMode(false);
                setSpyNumber(0);
              }
            }}
            className=""
          >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
          </select>
        </label>
        {playerNum >= 5 && (
          <label className="mt-16">
            <span className="caption" style={{ fontSize: 1 + "rem" }}>
              {t("settings.spyMode.note")}
            </span>
            <br />
            <div className="spyNumSelect">
              {t("settings.spyMode.label")}:
              <input
                name="spyMode"
                type="checkbox"
                checked={spyMode}
                onChange={(event) => {
                  let value =
                    event.target.type === "checkbox"
                      ? event.target.checked
                      : event.target.value;
                  if (!value) {
                    setSpyNumber(0);
                  }
                  setSpyMode(value);
                  setSpyNumber(1);
                }}
              />
            </div>
            <br />
            {spyModeSelect}
          </label>
        )}
      </form>

      <div className="m-4">
        <h2>{t("settings.theme")} {theme ? (t(`themes.${theme}`, null) || themeKr || "") : ""}</h2>
        {loading ? (
          <div className="mt-8 text-center">
            <p className="text-gray-400">{t("common.loading")}</p>
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
