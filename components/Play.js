import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

const Play = ({ resetToWordReveal }) => {
  const { t } = useTranslation();

  const [displayStatus, setDisplayStatus] = useState("");
  const [displayStatus02, setDisplayStatus02] = useState("");

  useEffect(() => {
    setDisplayStatus(t("game.play.gameStart"));
    setDisplayStatus02(t("game.play.discussAndFindLiar"));
  }, [t]);

  const handleReplay = () => {
    console.log(`[Play] Replaying word reveal`);
    resetToWordReveal();
  };

  return (
    <div className="">
      <h1>{displayStatus}</h1>
      <p className="mt-2">{displayStatus02}</p>
      
      {/* Navigation buttons - Icons only */}
      <div className="flex justify-center gap-4 mt-12">
        <Link 
          href="/settings" 
          className="p-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Back to settings"
        >
          <ArrowLeft size={24} />
        </Link>
        <button
          onClick={handleReplay}
          className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          aria-label="Redo word reveal"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default Play;
