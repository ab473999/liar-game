"use client";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Player number selector component
 * 
 * Props:
 * - playerNum: number - Current player count
 * - setPlayerNum: Function - Update handler
 * - min?: number - Minimum players (default: 3)
 * - max?: number - Maximum players (default: 20)
 */
export const PlayerSelector = ({ 
  playerNum, 
  setPlayerNum,
  min = 3,
  max = 20
}) => {
  const { t } = useTranslation();

  const handleIncrease = () => {
    const newPlayerNum = Math.min(max, playerNum + 1);
    setPlayerNum(newPlayerNum);
  };

  const handleDecrease = () => {
    const newPlayerNum = Math.max(min, playerNum - 1);
    setPlayerNum(newPlayerNum);
  };

  return (
    <form className="flex flex-col items-center">
      <div className="m-4 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleIncrease}
              className={`p-1 transition-colors ${
                playerNum >= max 
                  ? 'cursor-not-allowed opacity-40' 
                  : 'hover:opacity-75'
              }`}
              style={{ 
                color: playerNum >= max ? 'var(--color-textMuted)' : 'var(--color-textPrimary)',
                border: 'none',
                background: 'transparent'
              }}
              disabled={playerNum >= max}
              aria-label="Increase players"
            >
              <ChevronUp size={24} />
            </button>
            
            <div className="text-3xl px-2 py-0 min-w-[60px] text-center">
              {playerNum}
            </div>
            
            <button
              type="button"
              onClick={handleDecrease}
              className={`p-1 transition-colors ${
                playerNum <= min 
                  ? 'cursor-not-allowed opacity-40' 
                  : 'hover:opacity-75'
              }`}
              style={{ 
                color: playerNum <= min ? 'var(--color-textMuted)' : 'var(--color-textPrimary)',
                border: 'none',
                background: 'transparent'
              }}
              disabled={playerNum <= min}
              aria-label="Decrease players"
            >
              <ChevronDown size={24} />
            </button>
          </div>
          
          <span className="text-xl">{t("settings.players", null) || "players"}</span>
        </div>
      </div>
    </form>
  );
};
