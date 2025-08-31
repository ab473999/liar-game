import { useState, useEffect, useRef } from "react";
import { useGameContext } from "@/components/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";

const Select = (props) => {
  console.log(`[Select] Component rendering...`);
  
  const {
    playerNum,
    spyMode,
    spyNumber,
    dbData,
    theme,
    easterEgg,
    setEasterEgg,
  } = useGameContext();
  const { t, language } = useTranslation();

  const [vocab, setVocab] = useState("");
  const [liar, setLiar] = useState(1);
  const [spy, setSpy] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState([]);
  const [displayStatus, setDisplayStatus] = useState("");
  const [buttonDisabledText, setButtonDisabledText] = useState("");
  const [beginGame, setBeginGame] = useState(false);
  const [showCardStatus, setShowCardStatus] = useState(false);
  // const [easterEgg, setEasterEgg] = useState("");
  const [selectData, setSelectData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [playerState, setPlayerState] = useState(false);
  const [spyState, setSpyState] = useState(false);
  const initRef = useRef(false);

  // Initialize the game once when component mounts
  useEffect(() => {
    // Set Easter Egg
    if (easterEgg !== "") {
      setEasterEgg(easterEgg);
    }

    // Use ref to ensure single initialization even in StrictMode
    if (theme && !initRef.current) {
      initRef.current = true;
      
      const fetchWords = async () => {
        console.log(`[Select] === GAME INITIALIZATION ===`);
        console.log(`[Select] Theme: ${theme}, Language: ${language || "ko"}`);
        console.log(`[Select] Players: ${playerNum}, Spy Mode: ${spyMode}, Spies: ${spyNumber}`);
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
  }, [theme]); // Only depend on theme
  
  // Update display text when language changes
  useEffect(() => {
    setDisplayStatus(t("game.select.choosePlayer"));
    setButtonDisabledText(t("common.buttons.confirm"));
  }, [t]);

  const generateRandomNumber = (data) => {
    if (!data || data.length === 0) {
      console.error('[Select] No data available to generate random word');
      return;
    }
    
    // Check if already initialized to prevent re-generation
    if (vocab) {
      console.log(`[Select] Game already initialized with word: "${vocab}"`);
      return;
    }
    
    let randomIndex = Math.floor(Math.random() * data.length);
    let chooseLiar = Math.floor(Math.random() * playerNum);
    let chooseSpies = [];

    while (chooseSpies.length !== spyNumber) {
      let spyIndex = Math.floor(Math.random() * playerNum);

      if (spyIndex !== chooseLiar && chooseSpies.indexOf(spyIndex) === -1) {
        chooseSpies.push(spyIndex);
      }
    }

    const selectedWord = data[randomIndex];
    console.log(`[Select] === GAME SETUP COMPLETE ===`);
    console.log(`  - Selected word: "${selectedWord}" (index ${randomIndex} of ${data.length})`);
    console.log(`  - Liar: Player ${chooseLiar + 1} (index ${chooseLiar})`);
    console.log(`  - Spies: ${chooseSpies.length > 0 ? chooseSpies.map(s => `Player ${s + 1}`).join(', ') : 'None'}`);
    console.log(`  - Total players: ${playerNum}`);
    
    setVocab(selectedWord);
    setLiar(chooseLiar);
    setSpy(chooseSpies);
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
    let isSpy = spy.includes(button);
    
    if (isLiar) {
      playerType = "LIAR";
    } else if (isSpy) {
      playerType = "SPY";
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
    } else if (card.includes("spy")) {
      setDisplayStatus(t("game.select.youAre"));
      setPlayerState(true);
      setSpyState(true);
    } else if (card.includes("liar")) {
      setDisplayStatus(t("game.select.youAre"));
      setPlayerState(true);
      setSpyState(false);
    }

    setShowCardStatus(true);
  };

  const resetDisplayStatus = () => {
    if (buttonDisabled.length === playerNum) {
      console.log(`[Select] All players revealed! Starting game...`);
      console.log(`  - Final word: "${vocab}"`);
      console.log(`  - Liar was: Player ${liar + 1}`);
      console.log(`  - Spies were: ${spy.length > 0 ? spy.map(s => `Player ${s + 1}`).join(', ') : 'None'}`);

      setDisplayStatus(t("game.select.gameStarted"));
      setBeginGame(true);
      props.setVocab(vocab, selectData);
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
    } else if (spy.indexOf(i) !== -1) {
      playersCard.push(
        <button
          className={`border border-white cursor-pointer p-5 spy ${
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
      textView = spyState ? (
        <span>
          <span className="red">{t("game.select.spy")}</span>{t("game.select.spyWord")}
          <br />
          <span className="green">{vocab}</span>
        </span>
      ) : (
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
