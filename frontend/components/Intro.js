import React, { useState, useEffect } from "react";
import PackageJson from "@/package.json";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

const Intro = () => {
  const { t } = useTranslation();
  const [easterEggMode, setEasterEggMode] = useState(false);
  const [code01] = useState("onnuri");
  const [codeActivated, setCodeActivated] = useState(false);
  
  // Prefetch themes when intro loads to make settings page instant
  useEffect(() => {
    fetch('/api/themes?easterEgg=false').catch(() => {
      // Silently fail - this is just a prefetch
    });
  }, []);

  const easterEgg = () => {
    console.log("You have discovered an Easter Egg 🥚 !");
    setEasterEggMode(true);
  };

  const specialCode = (input) => {
    if (input.target.value === code01) {
      console.log("Activated");
      setCodeActivated(true);
      this.props.parentCallbackEasterEgg(code01);
    }
  };

  return (
    <section className="text-center flex flex-col">
      <p className="mb-8 text-xl">{t("intro.subtitle")}</p>
      {/* Hidden easter egg trigger - invisible text */}
      <div className="mb-4 h-4">
        <span 
          className="cursor-pointer text-transparent hover:text-gray-500 select-none" 
          onClick={easterEgg}
        >
          .
        </span>
      </div>
      {easterEggMode ? (
        <input
          className="easterEggInput mb-6 rounded-md text-base p-2 text-black"
          placeholder={t("intro.easterEgg.placeholder")}
          onChange={specialCode}
        ></input>
      ) : (
        ""
      )}
      {codeActivated ? (
        <p className="mb-8 bg-transparent text-white text-lg p-4 border border-light-blue-300">
          {t("intro.easterEgg.onnuriMode")}
        </p>
      ) : (
        ""
      )}
      <Link href="/settings">{t("intro.playButton")}</Link>
      <p className="mt-20 text-base">{t("common.version")} v{PackageJson.version}</p>
    </section>
  );
};

export default Intro;
