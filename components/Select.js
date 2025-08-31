import { useState, useEffect, useRef } from "react";
import { useGameContext } from "@/components/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";

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
    easterEgg,
    setEasterEgg,
  } = useGameContext();
  const { t, language } = useTranslation();

  const [vocab, setVocab] = useState(isReplay ? existingVocab : "");
  const [liar, setLiar] = useState(isReplay && existingGameSetup ? existingGameSetup.liar : 1);
  const [buttonDisabled, setButtonDisabled] = useState([]);
  const [displayStatus, setDisplayStatus] = useState("");
  const [buttonDisabledText, setButtonDisabledText] = useState("");
  const [beginGame, setBeginGame] = useState(false);
  const [showCardStatus, setShowCardStatus] = useState(false);
  // const [easterEgg, setEasterEgg] = useState("");
  const [selectData, setSelectData] = useState(isReplay ? existingSelectData : null);
  const [isDataLoading, setIsDataLoading] = useState(!isReplay); // Not loading if replay
  const [playerState, setPlayerState] = useState(false);
  const initRef = useRef(isReplay); // Mark as initialized if replay

  // Initialize the game once when component mounts
  useEffect(() => {
    // Set Easter Egg
    if (easterEgg !== "") {
      setEasterEgg(easterEgg);
    }

    if (isReplay) {
      // We're replaying - DO NOT re-initialize game
      console.log(`[Select] === REPLAY MODE ===`);
      console.log(`[Select] Reusing existing word: "${existingVocab}"`);
      console.log(`[Select] Reusing existing Liar: Player ${existingGameSetup?.liar + 1} (index ${existingGameSetup?.liar})`);
      
      // Reset only UI state for replay
      setButtonDisabled([]);
      setShowCardStatus(false);
      return; // Stop here - don't fetch or generate anything new
    }

    // Only fetch words for NEW games (not replays)
    if (!isReplay && theme && !vocab && !initRef.current) {
      initRef.current = true;
      
      const fetchWords = async () => {
        console.log(`[Select] === NEW GAME INITIALIZATION ===`);
        console.log(`[Select] Theme: ${theme}, Language: ${language || "ko"}`);
        console.log(`[Select] Players: ${playerNum}`);
        setIsDataLoading(true);
        
        try {
          const response = await fetch(`/api/words?theme=${theme}&lang=${language || "ko"}`);
          const result = await response.json();
          
          if (result.success) {
            // Use the language-specific words returned by the API
            const data = result.data.words || result.data.kr;
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
  
  // Update display text when language changes or component mounts
  useEffect(() => {
    setDisplayStatus(t("game.select.choosePlayer"));
    setButtonDisabledText(t("common.buttons.confirm"));
    
    // Reset UI for replay
    if (vocab && buttonDisabled.length === playerNum) {
      setButtonDisabled([]);
      setShowCardStatus(false);
    }
  }, [t]);

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

  const showCard = (event) => {
    let button = Number(event.target.id);
    let card = event.target.className;

    if (!buttonDisabled.includes(button)) {
      setButtonDisabled([...buttonDisabled, button]);
    }

    // Determine player type based on actual game state
    let playerType = "Regular Player";
    let isLiar = button === liar;
    
    if (isLiar) {
      playerType = "LIAR";
    }
    
    console.log(`[Select] === PLAYER ${button + 1} REVEAL ===`);
    console.log(`  - Player Type: ${playerType}`);
    console.log(`  - Current word: "${vocab}"`);
    console.log(`  - Liar is player index: ${liar} (Player ${liar + 1})`);
    console.log(`  - This player index: ${button}`);
    console.log(`  - Is this the liar? ${isLiar}`);
    console.log(`  - Players revealed so far: ${buttonDisabled.length + 1}/${playerNum}`);

    if (card.includes("no-liar")) {
      setDisplayStatus(t("game.select.selectedWord"));
      setPlayerState(false);
    } else if (card.includes("liar")) {
      setDisplayStatus(t("game.select.youAre"));
      setPlayerState(true);
    }

    setShowCardStatus(true);
  };

  const resetDisplayStatus = () => {
    if (buttonDisabled.length === playerNum) {
      console.log(`[Select] All players revealed! Starting game...`);
      console.log(`  - Final word: "${vocab}"`);
      console.log(`  - Liar was: Player ${liar + 1}`);

      setDisplayStatus(t("game.select.gameStarted"));
      setBeginGame(true);
      props.setVocab(vocab, selectData, { liar }); // Pass game setup
      props.nextStage(2);
    } else {
      if (playerNum - buttonDisabled.length === 1) {
        console.log(`[Select] One player left to reveal`);
        setButtonDisabledText(t("common.buttons.startGame"));
      } else {
        console.log(`[Select] ${playerNum - buttonDisabled.length} players left to reveal`);
      }
      setDisplayStatus(t("game.select.choosePlayer"));
    }

    setShowCardStatus(false);
  };

  // Show loading state if data is not ready
  if (isDataLoading || !vocab) {
    return (
      <div>
        <h2>{t("common.loading")}</h2>
        <p>{t("common.preparingGame")}</p>
      </div>
    );
  }

  let defaultText = t("common.buttons.select");

  let playersCard = [];
  for (let i = 0; i < playerNum; i++) {
    if (i === liar) {
      playersCard.push(
        <button
          className={`border border-white cursor-pointer p-5 liar ${
            buttonDisabled.includes(i)
              ? "border border-white cursor-not-allowed opacity-50"
              : ""
          }`}
          disabled={buttonDisabled.includes(i) ? true : false}
          key={i}
          id={i}
          onClick={showCard}
        >
          {defaultText}
        </button>
      );
    } else {
      playersCard.push(
        <button
          className={`border border-white cursor-pointer p-5 no-liar ${
            buttonDisabled.includes(i)
              ? "border border-white cursor-not-allowed opacity-50"
              : ""
          }`}
          disabled={buttonDisabled.includes(i) ? true : false}
          key={i}
          id={i}
          onClick={showCard}
        >
          {defaultText}
        </button>
      );
    }
  }

  let textView;
  if (buttonDisabled.length > 0 && showCardStatus === true) {
    if (playerState) {
      textView = (
        <span className="red">{t("game.select.liar")}</span>
      );
    } else {
      textView = (
        <span className="green">
          <br />
          {vocab}
        </span>
      );
    }
  } else {
    textView = null;
  }
  let nextButton =
    displayStatus === t("game.select.choosePlayer") ? (
      ``
    ) : (
      <button onClick={resetDisplayStatus}>{buttonDisabledText}</button>
    );

  return (
    <div>
      <div>
        <h2>
          {displayStatus} {textView}
        </h2>
        {nextButton}
      </div>
      {showCardStatus ? "" : playersCard}
    </div>
  );
};

export default Select;
