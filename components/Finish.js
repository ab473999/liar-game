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
    if (liarStatus !== "found") {
      console.log(t("game.console.couldNotFindLiar"));
      setHeaderText(t("game.finish.liarWins"));
      setLiarGuessText(t("game.finish.notFound"));
      setLiarGuess(true);
    } else {
      setHeaderText(t("game.finish.selectWord"));
    }
  }, [liarStatus, t]);

  const handleLiarGuess = (guess) => {
    console.log(guess.target.value, vocab);
    if (guess.target.value === vocab) {
      setHeaderText(t("game.finish.liarWins"));
      setLiarGuessText(t("game.finish.correctGuess"));
      setLiarWin(true);
    } else {
      setHeaderText(t("game.finish.liarLoses"));
      setLiarGuessText(``);
      setLiarWin(false);
    }
    setLiarGuess(true);
  };

  console.log({
    liarStatus,
    vocab,
    theme,
    liarGuess,
    liarGuessText,
    headerText,
    liarWin,
    selectData,
  });

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
