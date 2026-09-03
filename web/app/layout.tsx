import type { Metadata } from "next";
// The Figma spec (Dev Mode CSS export) calls out 'Inter' for all the body
// copy (hero titles/subtitles, "explore more", footer). Self-hosting the
// font files via @fontsource-variable/inter (rather than next/font/google,
// which fetches from fonts.googleapis.com at build time) means the build
// never depends on reaching Google's servers -- it works in any CI/offline
// environment, same concern the old system-font placeholder was avoiding.
import "@fontsource-variable/inter";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import { AppReadyProvider } from "./components/AppReady";

// The logo/nav wordmark in the design uses 'Acumin Variable Concept', a
// paid Adobe Fonts family that can't be bundled the same way. The logo
// itself is now a real SVG (no live text), but the nav links (ABOUT /
// PERSONAL PLAYGROUND / WORK) still need it — falling back to the site's
// sans-serif stack until real font files are provided.

export const metadata: Metadata = {
  title: "Lina Zakaria",
  description: "Portfolio site for Lina Zakaria",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AppReadyProvider>
          <LoadingScreen />
          {children}
        </AppReadyProvider>
      </body>
    </html>
  );
}
