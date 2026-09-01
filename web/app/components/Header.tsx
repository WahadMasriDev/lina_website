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

type HeaderProps = {
  /**
   * Landing page only. The header floats transparently over whatever
   * project is behind it (just the white logo + nav, no backing box) and
   * fades/slides away entirely while a project section fills the screen,
   * coming back the moment you're at the top or scroll up a little.
   */
  hidden?: boolean;
  /** Render as a fixed overlay above the page instead of in normal flow. */
  overlay?: boolean;
};

export default function Header({ hidden = false, overlay = false }: HeaderProps) {
  // Only the landing overlay darkens on hover -- a plain in-flow header
  // (project detail pages) just sits transparently on the black page bg.
  const [darkened, setDarkened] = useState(false);
  const interactive = overlay;

  return (
    <div
      className={`${
        overlay ? "fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-8" : ""
      } transition-[opacity,transform] duration-[700ms] ease-out ${
        overlay && hidden ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        height: overlay ? 139 : undefined,
        paddingTop: overlay ? 30 : undefined,
        paddingBottom: overlay ? 30 : undefined,
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      }}
      onMouseEnter={() => interactive && setDarkened(true)}
      onMouseLeave={() => interactive && setDarkened(false)}
    >
      <header
        className={`flex h-[79px] w-full items-center justify-between rounded-full transition-[background-color] duration-[600ms] ease-out ${
          darkened ? "bg-black/55 px-6 backdrop-blur-md sm:px-8" : "bg-transparent px-4 sm:px-8"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
      >
        <div className="flex items-center" style={{ gap: LOGO_GAP }}>
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
        <nav className="hidden md:flex w-[360px] items-center justify-between text-[15px] leading-[18px] font-light text-white">
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
    </div>
  );
}
