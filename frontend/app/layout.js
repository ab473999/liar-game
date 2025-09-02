import "./globals.css";
import { Layout } from "@/components/layout/Layout";
import { GoogleAnalytics } from "@next/third-parties/google";

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const metadata = {
  title: "LIAR",
  description: "Play the Liar Game online!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
      <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
