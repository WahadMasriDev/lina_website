"use client";

import { useState } from "react";

// Logo sizing knobs -- tweak these directly if the lockup looks off
// against Figma. The two SVGs are each cropped tight to their own real
// content (no padding), so the height you set here is exactly the
// rendered height and the width follows automatically at the correct,
// undistorted aspect ratio.
const LOGO_ICON_HEIGHT = 44; // px, mark to the left
const LOGO_WORDMARK_HEIGHT = 32; // px, "LINA / ZAKARIA" block, right of the mark
const LOGO_GAP = 8; // px, space between the mark and the wordmark

const FRAME_FADE_MS = 400;

type HeaderProps = {
  /** Landing page only: always present, full-bleed, flush to the top on
   * every project -- transparent at rest, and a solid black backing
   * (no blur) fades in while the mouse is directly over the header,
   * fading back out the moment it leaves. Per review feedback: the
   * backing itself should be solid black, not a frosted/blurred glass
   * effect -- the hover-only behaviour stays. */
  overlay?: boolean;
};

export default function Header({ overlay = false }: HeaderProps) {
  const [hovered, setHovered] = useState(false);
  const framed = overlay && hovered;

  return (
    <header
      className={`flex h-[96px] w-full items-center justify-between px-4 sm:px-8 ${
        overlay ? "fixed inset-x-0 top-0 z-50" : "relative"
      }`}
      onMouseEnter={() => overlay && setHovered(true)}
      onMouseLeave={() => overlay && setHovered(false)}
    >
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-black transition-opacity ease-out"
          style={{
            opacity: framed ? 1 : 0,
            transitionDuration: `${FRAME_FADE_MS}ms`,
          }}
        />
      )}

      <div className="relative flex items-center" style={{ gap: LOGO_GAP }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-icon.svg"
          alt=""
          aria-hidden
          style={{ height: LOGO_ICON_HEIGHT }}
          className="w-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-wordmark.svg"
          alt="Lina Zakaria"
          style={{ height: LOGO_WORDMARK_HEIGHT }}
          className="w-auto"
        />
      </div>

      {/*
        Figma: 'Acumin Variable Concept', weight 194, 15px/18px. That's a
        paid Adobe Fonts family we can't self-host the way we did Inter --
        falling back to the site sans-serif stack at a light weight until
        real font files are provided.
      */}
      <nav className="relative hidden md:flex w-[360px] items-center justify-between text-[15px] leading-[18px] font-light text-white">
        <a href="#about" className="hover:opacity-70">
          ABOUT
        </a>
        <a href="#playground" className="hover:opacity-70">
          PERSONAL PLAYGROUND
        </a>
        <a href="#work" className="hover:opacity-70">
          WORK
        </a>
      </nav>
    </header>
  );
}
