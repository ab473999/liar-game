"use client";

import { useState, useEffect } from "react";
import { useGameContext } from "@/components/GameContextWrapper";
import Select from "@/components/Select";
import Play from "@/components/Play";
import Finish from "@/components/Finish";

export default function Game() {
  const {
    playerNum,
    theme,
    easterEgg,
    setEasterEgg,
    dbData,
  } = useGameContext();

  const [stage, setStage] = useState(1);
  const [vocab, setVocab] = useState("");
  const [selectData, setSelectData] = useState(null);
  const [isReplay, setIsReplay] = useState(false);
  const [gameSetup, setGameSetup] = useState(null); // Store liar position

  useEffect(() => {
    if (easterEgg !== "") {
      setEasterEgg(easterEgg);
    }
  }, [easterEgg]);

  const progressNextStage = (stage) => {
    console.log(`[Game] Moving to stage ${stage}`);
    setStage(stage);
  };

  const resetToWordReveal = () => {
    console.log(`[Game] Resetting to word reveal (stage 1) with word: "${vocab}"`);
    setIsReplay(true);
    setStage(1);
  };

  const updateGlobalVocab = (vocab, selectData, gameSetup = null) => {
    console.log(`[Game] Vocab set to: "${vocab}"`);
    console.log(`[Game] SelectData contains ${selectData ? selectData.length : 0} words`);
    setVocab(vocab);
    setSelectData(selectData);
    if (gameSetup) {
      setGameSetup(gameSetup);
    }
    setIsReplay(false); // Reset replay flag after setting up
  };

  let gameView;

  switch (stage) {
    case 1:
      gameView = (
        <Select
          globalState={{
            playerNum,
            theme,
            dbData,
          }}
          nextStage={progressNextStage}
          setVocab={updateGlobalVocab}
          isReplay={isReplay}
          existingVocab={vocab}
          existingSelectData={selectData}
          existingGameSetup={gameSetup}
        />
      );
      break;
    case 2:
      gameView = <Play resetToWordReveal={resetToWordReveal} />;
      break;
    case 3:
      gameView = (
        <Finish
          nextStage={progressNextStage}
          liarStatus="found"
          vocab={vocab}
          theme={theme}
          selectData={selectData}
        />
      );
      break;
    case 4:
      gameView = (
        <Finish
          nextStage={progressNextStage}
          liarStatus="not-found"
          vocab={vocab}
          theme={theme}
          selectData={selectData}
        />
      );
      break;
    default:
      gameView = (
        <Select
          globalState={{
            playerNum,
            theme,
            dbData,
          }}
          nextStage={progressNextStage}
          setVocab={updateGlobalVocab}
          isReplay={isReplay}
          existingVocab={vocab}
          existingSelectData={selectData}
          existingGameSetup={gameSetup}
        />
      );
      break;
  }

  return <div>{gameView}</div>;
}
