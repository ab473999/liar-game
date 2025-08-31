import { Inter } from "next/font/google";
import "./globals.css";
import { GameContextWrapper } from "@/components/GameContextWrapper";
import { LanguageProvider } from "@/components/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "라이어 게임 | Liar Game",
  description: "라이어 게임을 온라인으로 즐겨보세요! | Play the Liar Game online!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="kr">
      <body
        className={`${inter.className} text-center p-8 bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white font-sans`}
      >
        <LanguageProvider>
          <LanguageSwitcher />
          <GameContextWrapper>
            <div className="max-w-lg mx-auto">{children}</div>
          </GameContextWrapper>
        </LanguageProvider>
        <Analytics />
      </body>
      <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
