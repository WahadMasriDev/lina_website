"use client";

import { useState } from "react";

// At rest, just the icon mark (logo-icon.svg). Hovering anywhere over the
// header -- not just the logo itself -- swaps it to the full "LINA
// ZAKARIA" lockup (logo-whole.svg, icon + wordmark already positioned
// together as one piece from web/assets/logo/whole-logo.svg), same
// height, no transition -- it just appears/disappears with the hover.
const LOGO_HEIGHT = 56; // px -- tweak directly if it looks off against Figma
const LOGO_ICON_ASPECT = 28 / 42; // logo-icon.svg's own width/height
const LOGO_WHOLE_ASPECT = 140 / 56; // logo-whole.svg's own width/height
const LOGO_ICON_WIDTH = LOGO_HEIGHT * LOGO_ICON_ASPECT;
const LOGO_WHOLE_WIDTH = LOGO_HEIGHT * LOGO_WHOLE_ASPECT;

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
  // Tracks hover over the whole header, on every page (not gated on
  // `overlay`) -- the logo swap needs it everywhere, even though the
  // black backing below is still landing-page-only.
  const [hovered, setHovered] = useState(false);
  const framed = overlay && hovered;

  return (
    <header
      className={`flex h-[96px] w-full items-center justify-between px-4 sm:px-8 ${
        overlay ? "fixed inset-x-0 top-0 z-50" : "relative"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

      <div
        className="relative flex items-center"
        style={{
          height: LOGO_HEIGHT,
          width: hovered ? LOGO_WHOLE_WIDTH : LOGO_ICON_WIDTH,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-icon.svg"
          alt="Lina Zakaria"
          hidden={hovered}
          style={{ height: LOGO_HEIGHT }}
          className="absolute left-0 top-0 w-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-whole.svg"
          alt=""
          aria-hidden
          hidden={!hovered}
          style={{ height: LOGO_HEIGHT }}
          className="absolute left-0 top-0 w-auto"
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
