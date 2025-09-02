"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameContext } from "@/components/contexts/GameContextWrapper";
import Select from "@/components/functional/game/Select";
import Play from "@/components/functional/game/Play";

export default function Game() {
  const router = useRouter();
  const {
    playerNum,
    theme,
    dbData,
  } = useGameContext();
  
  console.log(`[Game] Page loaded - theme: "${theme}", playerNum: ${playerNum}`);

  const [stage, setStage] = useState(1);
  const [vocab, setVocab] = useState("");
  const [selectData, setSelectData] = useState(null);
  const [isReplay, setIsReplay] = useState(false);
  const [gameSetup, setGameSetup] = useState(null); // Store liar position

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
  
  // Redirect to home if no theme is selected
  useEffect(() => {
    if (!theme) {
      console.log('[Game] No theme selected, redirecting to home...');
      router.push('/');
    }
  }, [theme, router]);

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
