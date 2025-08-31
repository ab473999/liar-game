import { useState, useEffect } from "react";
import { useGameContext } from "@/components/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";
import foodData from "@/data/food.json";
import placeData from "@/data/place.json";
import occupationData from "@/data/occupation.json";
import bibleCharacterData from "@/data/biblecharacter.json";
import onnurichanyangTeamMemberData from "@/data/onnurichanyangteammember.json";

const Select = (props) => {
  const {
    playerNum,
    spyMode,
    spyNumber,
    dbData,
    theme,
    easterEgg,
    setEasterEgg,
  } = useGameContext();
  const { t } = useTranslation();

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
  const [playerState, setPlayerState] = useState(false);
  const [spyState, setSpyState] = useState(false);

  useEffect(() => {
    // Initialize display text
    setDisplayStatus(t("game.select.choosePlayer"));
    setButtonDisabledText(t("common.buttons.confirm"));
    
    // Set Easter Egg
    if (easterEgg !== "") {
      setEasterEgg(easterEgg);
    }

    // If the API is not present
    let chosenTheme;
    let data;
    if (dbData === null) {
      chosenTheme = {
        food: foodData,
        place: placeData,
        occupation: occupationData,
        biblecharacter: bibleCharacterData,
        onnurichanyangteammember: onnurichanyangTeamMemberData,
      };
      data = chosenTheme[theme || "food"].kr;
    } else {
      for (let i = 0; i < dbData.length; i++) {
        let words = dbData[i];
        if (words.type === (theme || "food")) {
          chosenTheme = words.kr;
        }
      }
      data = chosenTheme;
    }

    setSelectData(data);
    generateRandomNumber(data);
  }, []);

  const generateRandomNumber = (data) => {
    let randomIndex = Math.floor(Math.random() * data.length);
    let chooseLiar = Math.floor(Math.random() * playerNum);
    let chooseSpies = [];

    while (chooseSpies.length !== spyNumber) {
      let spyIndex = Math.floor(Math.random() * playerNum);

      if (spyIndex !== chooseLiar && chooseSpies.indexOf(spyIndex) === -1) {
        chooseSpies.push(spyIndex);
      }
    }

    setVocab(data[randomIndex]);
    setLiar(chooseLiar);
    setSpy(chooseSpies);
  };

  const showCard = (event) => {
    let button = Number(event.target.id);

    if (!buttonDisabled.includes(button)) {
      setButtonDisabled([...buttonDisabled, button]);
    }

    let card = event.target.className;

    if (card.includes("no-liar")) {
      setDisplayStatus(t("game.select.selectedWord"));
      setPlayerState(false);
    } else if (card.includes("spy")) {
      setDisplayStatus(t("game.select.youAre"));
      setPlayerState(true);
      setSpyState(true);
    } else {
      setDisplayStatus(t("game.select.youAre"));
      setPlayerState(true);
      setSpyState(false);
    }

    setShowCardStatus(true);
  };

  const resetDisplayStatus = () => {
    if (buttonDisabled.length === playerNum) {
      console.log(t("game.select.allSelected"));

      setDisplayStatus(t("game.select.gameStarted"));
      setBeginGame(true);
      props.nextStage(2);
      props.setVocab(vocab, selectData);
    } else {
      if (playerNum - buttonDisabled.length === 1) {
        console.log(t("game.select.onePlayerLeft"));
        setButtonDisabledText(t("common.buttons.startGame"));
      }
      setDisplayStatus(t("game.select.choosePlayer"));
    }

    setShowCardStatus(false);
  };

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
