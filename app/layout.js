import { Inter } from "next/font/google";
import "./globals.css";
import { GameContextWrapper } from "@/components/GameContextWrapper";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { Header } from "@/components/Header";
import { DocumentTitle } from "@/components/DocumentTitle";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Liar",
  description: "Play the Liar Game online!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-center min-h-screen font-sans`}
        style={{ 
          backgroundColor: 'var(--color-bgPrimary)', 
          color: 'var(--color-textPrimary)' 
        }}
      >
        <ThemeProvider>
          <LanguageProvider>
            <DocumentTitle />
            <Header />
            
            {/* Main content with padding to account for fixed header */}
            <main className="pt-24 p-8 min-h-screen flex flex-col items-center justify-center">
              <GameContextWrapper>
                <div className="max-w-lg mx-auto">{children}</div>
              </GameContextWrapper>
            </main>
            
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
