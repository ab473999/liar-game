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
  
  const HOLD_DURATION = 1500; // 1.5 seconds to fully reveal
  const PROGRESS_INTERVAL = 20; // Update every 20ms for smooth animation

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    
    const startTime = Date.now();
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      
      if (progress >= 100 && !showContent) {
        setShowContent(true);
        setHasRevealed(true);
      }
    }, PROGRESS_INTERVAL);
  };

  const endHold = () => {
    setIsHolding(false);
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // If successfully revealed, move to next player after a short delay
    if (hasRevealed) {
      setTimeout(() => {
        setShowContent(false);
        setHasRevealed(false);
        setHoldProgress(0);
        onRevealComplete();
      }, 500);
    } else {
      // Reset if released too early
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

  // Calculate circle size based on progress
  const circleSize = 200 + (holdProgress * 2); // Start at 200px, grow to 400px
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] relative">
      {/* Player counter */}
      <div className="absolute top-0 text-2xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
        {t("game.select.player")} {currentPlayer}/{totalPlayers}
      </div>
      
      {/* Word/Role display - positioned above the circle */}
      <div className="absolute" style={{ top: '20%' }}>
        {showContent && (
          <div className="text-center animate-fadeIn">
            {isLiar ? (
              <div>
                <p className="text-lg mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                  {t("game.select.youAre")}
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-accentDanger)' }}>
                  {t("game.select.liar")}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                  {t("game.select.selectedWord")}
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-accentSuccess)' }}>
                  {word?.text}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Press and hold circle */}
      <button
        className="rounded-full flex items-center justify-center select-none"
        style={{
          transition: 'all 0.1s ease-out',
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          backgroundColor: holdProgress < 100 
            ? 'var(--color-bgTertiary)' 
            : 'var(--color-accentPrimary)',
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
        {/* Progress indicator */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              var(--color-accentPrimary) ${holdProgress * 3.6}deg,
              transparent ${holdProgress * 3.6}deg
            )`,
            opacity: 0.3
          }}
        />
        
        {/* Button text */}
        {!showContent && (
          <span 
            className="text-xl font-medium z-10 pointer-events-none"
            style={{ 
              color: holdProgress > 0 ? 'var(--color-textPrimary)' : 'var(--color-textSecondary)' 
            }}
          >
            {t("game.select.pressAndHold")}
          </span>
        )}
      </button>
      
      {/* Instructions */}
      {!showContent && !isHolding && (
        <p className="mt-8 text-sm" style={{ color: 'var(--color-textMuted)' }}>
          {hasRevealed 
            ? t("game.select.passToNext") 
            : t("game.select.holdToReveal")
          }
        </p>
      )}
    </div>
  );
};
