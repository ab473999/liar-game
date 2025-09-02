import React, { useState, useEffect } from "react";
import PackageJson from "@/package.json";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

const Intro = () => {
  const { t } = useTranslation();
  
  // Prefetch themes when intro loads to make settings page instant
  useEffect(() => {
    const prefetchStart = performance.now();
    console.log('[Intro] Starting theme prefetch...');
    
    fetch('/api/themes')
      .then(() => {
        const prefetchTime = performance.now() - prefetchStart;
        console.log(`[Intro] Theme prefetch completed in ${prefetchTime.toFixed(2)}ms`);
      })
      .catch(() => {
        const prefetchTime = performance.now() - prefetchStart;
        console.log(`[Intro] Theme prefetch failed after ${prefetchTime.toFixed(2)}ms (this is okay, just a prefetch)`);
      });
  }, []);

  return (
    <section className="text-center flex flex-col">
      <p className="mb-8 text-xl">{t("intro.subtitle")}</p>
      <Link href="/settings">{t("intro.playButton")}</Link>
      <p className="mt-20 text-base">{t("common.version")} v{PackageJson.version}</p>
    </section>
  );
};

export default Intro;
