import { useState, useEffect, useRef } from "react";
import { useGameContext } from "@/components/contexts/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";
import { PlayerWordReveal } from "@/components/functional/PlayerWordReveal";
import { getApiUrl } from "@/config/api";

const Select = (props) => {
  // Extract replay props
  const {
    isReplay = false,
    existingVocab = null,
    existingSelectData = null,
    existingGameSetup = null
  } = props;
  
  console.log('[Select] Component props - isReplay:', isReplay, 'existingVocab:', existingVocab, 'existingGameSetup:', existingGameSetup);
  
  const {
    playerNum,
    dbData,
    theme,
  } = useGameContext();
  const { t } = useTranslation();

  const [vocab, setVocab] = useState(isReplay ? existingVocab : "");
  const [liar, setLiar] = useState(isReplay && existingGameSetup ? existingGameSetup.liar : 1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealedPlayers, setRevealedPlayers] = useState([]);
  const [selectData, setSelectData] = useState(isReplay ? existingSelectData : null);
  const [isDataLoading, setIsDataLoading] = useState(!isReplay); // Not loading if replay
  const initRef = useRef(isReplay); // Mark as initialized if replay

  // Initialize the game once when component mounts
  useEffect(() => {
    if (isReplay) {
      // We're replaying - DO NOT re-initialize game
      console.log(`[Select] === REPLAY MODE ===`);
      console.log(`[Select] Reusing existing word: "${existingVocab}"`);
      console.log(`[Select] Reusing existing Liar: Player ${existingGameSetup?.liar + 1} (index ${existingGameSetup?.liar})`);
      
      // Reset only UI state for replay
      setCurrentPlayerIndex(0);
      setRevealedPlayers([]);
      return; // Stop here - don't fetch or generate anything new
    }

    // Only fetch words for NEW games (not replays)
    if (!isReplay && theme && !vocab && !initRef.current) {
      initRef.current = true;
      
      const fetchWords = async () => {
        console.log(`[Select] === NEW GAME INITIALIZATION ===`);
        console.log(`[Select] Theme: ${theme}, Language: en`);
        console.log(`[Select] Players: ${playerNum}`);
        setIsDataLoading(true);
        
        try {
          const response = await fetch(getApiUrl(`words?theme=${theme}&lang=en`));
          const result = await response.json();
          
          if (result.success) {
            // Extract the word text from the backend response
            const data = result.data.map(word => word.word);
            console.log(`[Select] Fetched ${data.length} words for game`);
            console.log(`[Select] Word list sample: ${data.slice(0, 5).join(', ')}...`);
            setSelectData(data);
            generateRandomNumber(data);
          } else {
            console.error('[Select] Failed to fetch words:', result.error);
            setSelectData([]);
            initRef.current = false; // Reset on error
          }
        } catch (error) {
          console.error('[Select] Error fetching words:', error);
          setSelectData([]);
          initRef.current = false; // Reset on error
        } finally {
          setIsDataLoading(false);
        }
      };
      
      fetchWords();
    }
  }, [theme, isReplay]); // Depend on theme and isReplay

  const generateRandomNumber = (data) => {
    if (!data || data.length === 0) {
      console.error('[Select] No data available to generate random word');
      return;
    }
    
    // NEVER generate new positions on replay
    if (isReplay) {
      console.log(`[Select] REPLAY MODE - NOT generating new positions. Using existing.`);
      return;
    }
    
    // Check if already initialized to prevent re-generation
    if (vocab) {
      console.log(`[Select] Game already initialized with word: "${vocab}"`);
      return;
    }
    
    let randomIndex = Math.floor(Math.random() * data.length);
    let chooseLiar = Math.floor(Math.random() * playerNum);

    const selectedWord = data[randomIndex];
    console.log(`[Select] === GAME SETUP COMPLETE ===`);
    console.log(`  - Selected word: "${selectedWord}" (index ${randomIndex} of ${data.length})`);
    console.log(`  - Liar: Player ${chooseLiar + 1} (index ${chooseLiar})`);
    console.log(`  - Total players: ${playerNum}`);
    
    setVocab(selectedWord);
    setLiar(chooseLiar);
  };

  const handleRevealComplete = () => {
    const nextPlayerIndex = currentPlayerIndex + 1;
    
    console.log(`[Select] Player ${currentPlayerIndex + 1} revealed`);
    console.log(`  - Was liar: ${currentPlayerIndex === liar}`);
    console.log(`  - Players revealed: ${nextPlayerIndex}/${playerNum}`);
    
    setRevealedPlayers([...revealedPlayers, currentPlayerIndex]);
    
    if (nextPlayerIndex >= playerNum) {
      // All players have been revealed
      console.log(`[Select] All players revealed! Starting game...`);
      console.log(`  - Final word: "${vocab}"`);
      console.log(`  - Liar was: Player ${liar + 1}`);
      
      props.setVocab(vocab, selectData, { liar }); // Pass game setup
      props.nextStage(2);
    } else {
      // Move to next player
      setCurrentPlayerIndex(nextPlayerIndex);
    }
  };

  // Show loading state if data is not ready
  if (isDataLoading || !vocab) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2>{t("common.loading")}</h2>
        <p>{t("common.preparingGame")}</p>
      </div>
    );
  }

  return (
    <PlayerWordReveal 
      currentPlayer={currentPlayerIndex + 1}
      totalPlayers={playerNum}
      isLiar={currentPlayerIndex === liar}
      word={{ text: vocab, theme }}
      onRevealComplete={handleRevealComplete}
    />
  );
};

export default Select;
