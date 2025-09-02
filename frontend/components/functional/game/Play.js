import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowLeft, RotateCcw } from "lucide-react";

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
        <IconButton
          href="/"
          icon={<ArrowLeft size={24} />}
          ariaLabel="Back to home"
          variant="secondary"
          size="lg"
        />
        <IconButton
          onClick={handleReplay}
          icon={<RotateCcw size={24} />}
          ariaLabel="Redo word reveal"
          variant="primary"
          size="lg"
        />
      </div>
    </div>
  );
};

export default Play;
