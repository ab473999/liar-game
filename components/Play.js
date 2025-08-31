import React, { useState, useEffect } from "react";
import { useGameContext } from "@/components/GameContextWrapper";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

const Play = ({ nextStage, resetToWordReveal }) => {
  const { t } = useTranslation();

  const [displayStatus, setDisplayStatus] = useState("");
  const [displayStatus02, setDisplayStatus02] = useState("");

  useEffect(() => {
    setDisplayStatus(t("game.play.gameStart"));
    setDisplayStatus02(t("game.play.discussAndFindLiar"));
  }, [t]);

  const liarStatus = (status) => {
    const decision = status.target.value;
    console.log(`[Play] Liar decision: ${decision}`);
    
    switch (decision) {
      case "liar-found":
        console.log(`[Play] Moving to stage 3 - Liar was found`);
        nextStage(3);
        break;
      case "liar-not-found":
        console.log(`[Play] Moving to stage 4 - Liar was NOT found`);
        nextStage(4);
        break;
      default:
        console.log(`[Play] Moving to stage 4 - Default (Liar NOT found)`);
        nextStage(4);
        break;
    }
  };

  const handleReplay = () => {
    console.log(`[Play] Replaying word reveal`);
    resetToWordReveal();
  };

  return (
    <div className="">
      <h1>{displayStatus}</h1>
      <p className="mt-2">{displayStatus02}</p>
      
      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 mt-12 mb-8">
        <Link 
          href="/settings" 
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t("game.play.backToSettings")}</span>
        </Link>
        <button
          onClick={handleReplay}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <RotateCcw size={20} />
          <span>{t("game.play.redoReveal")}</span>
        </button>
      </div>

      {/* Liar decision buttons */}
      <div className="grid gap-2 mt-8">
        <h2 className="text-xl mb-4">{t("game.play.wasLiarFound")}</h2>
        <button 
          value="liar-found" 
          onClick={liarStatus}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          {t("game.play.foundLiar")}
        </button>
        <button 
          value="liar-not-found" 
          onClick={liarStatus}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          {t("game.play.notFoundLiar")}
        </button>
      </div>
    </div>
  );
};

export default Play;
