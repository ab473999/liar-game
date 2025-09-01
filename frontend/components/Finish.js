"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

const Finish = ({ liarStatus, vocab, theme, selectData }) => {
  const { t } = useTranslation();
  const [liarGuess, setLiarGuess] = useState(false);
  const [liarGuessText, setLiarGuessText] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [liarWin, setLiarWin] = useState(true);

  useEffect(() => {
    console.log(`[Finish] Component loaded with:`);
    console.log(`  - liarStatus: ${liarStatus}`);
    console.log(`  - vocab: "${vocab}"`);
    console.log(`  - selectData: ${selectData ? selectData.length + ' words' : 'null'}`);
    
    if (liarStatus !== "found") {
      console.log(`[Finish] Liar was NOT found - Liar wins automatically`);
      setHeaderText(t("game.finish.liarWins"));
      setLiarGuessText(t("game.finish.notFound"));
      setLiarGuess(true);
    } else {
      console.log(`[Finish] Liar was found - Now liar must guess the word`);
      setHeaderText(t("game.finish.selectWord"));
    }
  }, [liarStatus, t]);

  const handleLiarGuess = (guess) => {
    const guessedWord = guess.target.value;
    console.log(`[Finish] Liar guessed: "${guessedWord}"`);
    console.log(`[Finish] Correct word was: "${vocab}"`);
    
    if (guessedWord === vocab) {
      console.log(`[Finish] CORRECT! Liar wins!`);
      setHeaderText(t("game.finish.liarWins"));
      setLiarGuessText(t("game.finish.correctGuess"));
      setLiarWin(true);
    } else {
      console.log(`[Finish] WRONG! Liar loses!`);
      setHeaderText(t("game.finish.liarLoses"));
      setLiarGuessText(``);
      setLiarWin(false);
    }
    setLiarGuess(true);
  };

  // Remove redundant console.log since we're logging more specific info now

  let guessCards = selectData.map((word) => (
    <button key={word} value={word} onClick={handleLiarGuess}>
      {word}
    </button>
  ));

  let newGame = (
    <Link href="/settings" className="col-span-3">
      {t("common.buttons.newGame")}
    </Link>
  );

  let headerColor = "white";
  if (liarGuess) {
    headerColor = liarWin ? "red" : "red";
  }

  return (
    <div className="">
      <h2 className={headerColor}>{headerText}</h2>
      <p className="mt-6">{liarGuessText}</p>
      {liarGuess ? (
        <p>
          {t("game.finish.selectedWord")}<span className="green ml-2">{vocab}</span>
        </p>
      ) : (
        <></>
      )}

      <div className="grid grid-cols-3 gap-2 mt-10">
        {liarGuess ? newGame : guessCards}
      </div>
    </div>
  );
};

export default Finish;
