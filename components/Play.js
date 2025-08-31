import React, { useState, useEffect } from "react";
import { useGameContext } from "@/components/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";
import Timer from "@/components/Timer";

const Play = ({ nextStage }) => {
  const { timer } = useGameContext();
  const { t } = useTranslation();

  const [displayStatus, setDisplayStatus] = useState("");
  const [displayStatus02, setDisplayStatus02] = useState("");
  const [findLiar, setFindLiar] = useState(false);

  useEffect(() => {
    if (timer === "unlimited") {
      setDisplayStatus(t("game.play.timeUnlimited"));
      setDisplayStatus02(t("game.play.whenReady"));
      setFindLiar(true);
    } else {
      setDisplayStatus(t("game.play.gameStart"));
      setDisplayStatus02(t("game.play.gameStartedFindLiar"));
      setFindLiar(false);
    }
  }, [timer, t]);

  const checkTimerEnds = (timer) => {
    setDisplayStatus(t("game.play.timeUp"));
    setDisplayStatus02("");
    setFindLiar(true);
  };

  const liarStatus = (status) => {
    switch (status.target.value) {
      case "liar-found":
        nextStage(3);
        break;
      case "liar-not-found":
        nextStage(4);
        break;
      default:
        nextStage(4);
        break;
    }
  };

  let findLiarButton01 = (
    <button key="1" value="liar-found" onClick={liarStatus}>
      {t("game.play.foundLiar")}
    </button>
  );
  let findLiarButton02 = (
    <button key="2" value="liar-not-found" onClick={liarStatus}>
      {t("game.play.notFoundLiar")}
    </button>
  );
  let findLiarButton = [findLiarButton01, findLiarButton02];

  return (
    <div className="">
      <h1>{displayStatus}</h1>
      <p className="mt-2">{displayStatus02}</p>
      <div className="mt-12">
        {timer === "unlimited" ? <></> : <Timer timerCheck={checkTimerEnds} />}
      </div>
      <div className="grid gap-0">
        {findLiar
          ? findLiarButton.map((element) => {
              return element;
            })
          : ""}
      </div>
    </div>
  );
};

export default Play;
