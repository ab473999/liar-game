"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export const PressHoldReveal = ({ 
  currentPlayer, 
  totalPlayers, 
  isLiar, 
  word,
  onRevealComplete 
}) => {
  const { t } = useTranslation();
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const holdTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const hasLoggedReveal = useRef(false);
  
  const HOLD_DURATION = 1500; // 1.5 seconds to fully reveal
  const PROGRESS_INTERVAL = 20; // Update every 20ms for smooth animation

  const startHold = () => {
    console.log(`[PressHold] Started holding for Player ${currentPlayer}`);
    setIsHolding(true);
    setHoldProgress(0);
    hasLoggedReveal.current = false; // Reset the flag when starting a new hold
    
    const startTime = Date.now();
    let lastLogTime = 0;
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      
      // Log every 500ms
      if (Math.floor(elapsed / 500) > lastLogTime) {
        lastLogTime = Math.floor(elapsed / 500);
        console.log(`[PressHold] Holding... ${(elapsed / 1000).toFixed(1)}s (${progress.toFixed(0)}%)`);
      }
      
      if (progress >= 100 && !showContent) {
        // Only log once when reveal happens
        if (!hasLoggedReveal.current) {
          console.log(`[PressHold] REVEAL! Player ${currentPlayer} - isLiar: ${isLiar}, word: "${word?.text}"`);
          hasLoggedReveal.current = true;
        }
        setShowContent(true);
        setHasRevealed(true);
      }
    }, PROGRESS_INTERVAL);
  };

  const endHold = () => {
    console.log(`[PressHold] Released - Player ${currentPlayer}, revealed: ${hasRevealed}`);
    setIsHolding(false);
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Hide content immediately when released
    setShowContent(false);
    
    // If successfully revealed, move to next player
    if (hasRevealed) {
      console.log(`[PressHold] Moving to next player...`);
      setHasRevealed(false);
      setHoldProgress(0);
      onRevealComplete();
    } else {
      // Reset if released too early
      console.log(`[PressHold] Released too early, staying on Player ${currentPlayer}`);
      setHoldProgress(0);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  // Debug log when showContent changes
  useEffect(() => {
    if (showContent) {
      console.log(`[PressHold] Content is now visible! isLiar: ${isLiar}, word: "${word?.text}"`);
    }
  }, [showContent, isLiar, word]);

  // Calculate circle size based on progress
  const circleSize = 200 + (holdProgress * 2); // Start at 200px, grow to 400px
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] relative">
      {/* Player counter */}
      <div className="absolute top-8 text-2xl" style={{ color: 'var(--color-textPrimary)' }}>
        <span>{t("game.select.player")} </span>
        <span className="font-bold">{currentPlayer}</span>
        <span>/</span>
        <span style={{ color: 'var(--color-textMuted)' }}>{totalPlayers}</span>
      </div>
      
      {/* Word/Role display - positioned above the circle */}
      {showContent && (
        <div className="absolute" style={{ 
          top: '25%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 100,
          pointerEvents: 'none',
          minWidth: '300px'
        }}>
          <div className="text-center animate-fadeIn" style={{ 
            backgroundColor: 'var(--color-bgSecondary)', 
            padding: '20px', 
            borderRadius: '10px',
            border: '2px solid var(--color-borderPrimary)'
          }}>
            {isLiar ? (
              <div>
                <p className="text-lg mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  {t("game.select.youAre")}
                </p>
                <p className="text-4xl font-bold" style={{ color: 'var(--color-accentDanger)' }}>
                  {t("game.select.liar")}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  {t("game.select.selectedWord")}
                </p>
                <p className="text-4xl font-bold" style={{ color: 'var(--color-accentSuccess)' }}>
                  {word?.text || "No word"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Press and hold circle */}
      <button
        className="rounded-full flex items-center justify-center select-none"
        style={{
          transition: 'all 0.1s ease-out',
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          backgroundColor: showContent 
            ? 'var(--color-accentPrimary)' 
            : 'var(--color-bgTertiary)',
          border: `2px solid ${holdProgress > 0 ? 'var(--color-accentPrimary)' : 'var(--color-borderPrimary)'}`,
          transform: isHolding ? 'scale(1)' : 'scale(0.95)',
          opacity: isHolding ? 1 : 0.9,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={(e) => {
          e.preventDefault();
          startHold();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          endHold();
        }}
        onTouchCancel={endHold}
      >
        {/* Button text */}
        {!showContent && (
          <span 
            className="text-xl z-10 pointer-events-none"
            style={{ 
              color: holdProgress > 0 ? 'var(--color-textPrimary)' : 'var(--color-textSecondary)' 
            }}
          >
            {t("game.select.pressAndHold")}
          </span>
        )}
      </button>
      
      {/* Instructions */}
      {!showContent && !isHolding && hasRevealed && (
        <p className="mt-8 text-sm" style={{ color: 'var(--color-textMuted)' }}>
          {t("game.select.passToNext")}
        </p>
      )}
    </div>
  );
};
