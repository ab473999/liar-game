"use client";

import { useGameContext } from "@/components/contexts/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";
import { PlayerSelector } from "@/components/functional/PlayerSelector";
import { ThemeGrid } from "@/components/functional/ThemeGrid";
import { LoadingState } from "@/components/functional/LoadingState";

export default function Home() {
  console.log('[Home] Component rendering...');
  const { t } = useTranslation();
  const {
    playerNum,
    setPlayerNum,
    setTheme,
    setThemeKr,
    dbData,
    loading,
    error,
  } = useGameContext();
  
  console.log('[Home] Loading state:', loading, 'Themes:', dbData?.length || 0);

  // Prepare themes data - use local themes as fallback
  const themes = dbData || [
    { type: 'food', typeKr: '음식', typeEn: 'Food' },
    { type: 'place', typeKr: '장소', typeEn: 'Place' },
    { type: 'occupation', typeKr: '직업', typeEn: 'Occupation' },
    { type: 'biblecharacter', typeKr: '성경인물', typeEn: 'Bible Character' }
  ];

  // Show loading state for entire page
  if (loading) {
    return (
      <LoadingState 
        title={t("common.loading") || "Loading..."}
        subtitle={t("common.preparingGame") || "Getting things ready for you..."}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="text-center flex flex-col space-y-2">
      <PlayerSelector 
        playerNum={playerNum}
        setPlayerNum={setPlayerNum}
      />
      
      <ThemeGrid 
        themes={themes}
        onThemeSelect={(theme) => {
          console.log(`[Settings] Theme selected: ${theme.type}`);
          setTheme(theme.type);
          setThemeKr(theme.typeKr || theme.typeEn || theme.type);
        }}
      />
    </section>
  );
}
