"use client";

import { useEffect, useState } from "react";

// Placeholder loading screen. Nezar said he'll send a real loading animation
// (Lottie/GIF/video) to drop in later — until then this shows a simple CSS
// spinner over the logo mark. To swap in the real asset:
//   - Lottie JSON: `npm install lottie-react` and render it in place of the
//     spinner div below.
//   - GIF/video: replace the spinner div with an <img>/<video> tag.
// The fade-out behavior (waits for window "load", then a short minimum
// display time, then fades and unmounts) can stay as-is either way.
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const MIN_DISPLAY_MS = 600;
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        setFading(true);
        setTimeout(() => setVisible(false), 400);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-mark.png" alt="" className="h-10 w-auto opacity-90" />
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    </div>
  );
}
