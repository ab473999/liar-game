"use client";
import { Inter } from "next/font/google";
import { GameContextWrapper } from "@/components/contexts/GameContextWrapper";
import { LanguageProvider } from "@/components/contexts/LanguageContext";
import { SkinProvider } from "@/components/contexts/SkinContext";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/layout/MainContent";
import { DocumentTitle } from "@/components/functional/utilities/DocumentTitle";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

/**
 * Main layout wrapper component
 * Handles all providers, header, and content structure
 * 
 * Props:
 * - children: React nodes to render
 */
export const Layout = ({ children }) => {
  return (
    <div
      className={`${inter.className} text-center min-h-screen font-sans overflow-visible`}
      style={{ 
        backgroundColor: 'var(--color-bgPrimary)', 
        color: 'var(--color-textPrimary)' 
      }}
    >
      <SkinProvider>
        <LanguageProvider>
          <DocumentTitle />
          <Header />
          
          <MainContent>
            <GameContextWrapper>
              {children}
            </GameContextWrapper>
          </MainContent>
          
          <Analytics />
        </LanguageProvider>
      </SkinProvider>
    </div>
  );
};
