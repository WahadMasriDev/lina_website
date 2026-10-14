"use client";

import { useEffect, useState } from "react";

// Elegant floating "back to top" control, present site-wide (mounted once
// in the root layout rather than per-page). Hidden until the visitor has
// actually scrolled somewhere -- appearing immediately at the very top of
// the page would be pointless clutter -- then fades/slides in, same easing
// language as the rest of the site's reveal animations.
const SHOW_AFTER_PX = 480;
const FADE_MS = 400;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white backdrop-blur-sm transition-all ease-out hover:border-white/40 hover:bg-black sm:bottom-8 sm:right-8 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="translate-y-px"
      >
        <path
          d="M8 13V3M8 3L3 8M8 3L13 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
