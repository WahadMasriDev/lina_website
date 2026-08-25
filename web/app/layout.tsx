import type { Metadata } from "next";
import "./globals.css";

// Using system fonts for the scaffold instead of next/font/google — that
// fetches from Google Fonts at build time, which some CI/offline
// environments block. Swap in real fonts once the Figma design specifies
// them (next/font/local for self-hosted files works fine with static export).

export const metadata: Metadata = {
  title: "Lina Zakaria",
  description: "Portfolio site for Lina Zakaria",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
