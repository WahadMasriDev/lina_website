"use client";

import Link from "next/link";
import { useState } from "react";

// At rest, just the icon mark (logo-icon.svg). Hovering anywhere over the
// header -- not just the logo itself -- swaps it to the full "LINA
// ZAKARIA" lockup (logo-whole.svg, icon + wordmark already positioned
// together as one piece from web/assets/logo/whole-logo.svg), same
// height. Just an opacity fade (same FRAME_FADE_MS as the header's own
// black backing) -- the two images sit stacked on top of each other via
// absolute positioning, so nothing else (size, position) needs to move
// or animate, only which one is visible.
//
// The wrapper box is sized for the WHOLE logo at all times, even while
// only the icon is showing -- it used to snap down to the icon's own
// (much narrower) width the instant you stopped hovering, which caused a
// real bug: that resize happened instantly while the whole-logo image was
// still mid-fade at close to full opacity, so for a frame it rendered
// squeezed into a box smaller than itself. Keeping the wrapper's size
// fixed means hovering never triggers a resize at all, only the opacity
// swap -- the icon just sits left-aligned inside the larger box.
const LOGO_HEIGHT = 56; // px -- tweak directly if it looks off against Figma
// Both files' own viewBoxes are the same 43px-tall crop now (updated by
// Nezar so the icon mark reads at the same visual size standalone and
// inside the full lockup), so rendering both at the same CSS height
// keeps the icon glyph itself visually consistent between states, not
// just the bounding box.
const LOGO_WHOLE_ASPECT = 140 / 43; // logo-whole.svg's own width/height
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
        style={{ height: LOGO_HEIGHT, width: LOGO_WHOLE_WIDTH }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-icon.svg"
          alt="Lina Zakaria"
          style={{
            height: LOGO_HEIGHT,
            opacity: hovered ? 0 : 1,
            transitionDuration: `${FRAME_FADE_MS}ms`,
          }}
          className="absolute left-0 top-0 w-auto transition-opacity ease-out"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-whole.svg"
          alt=""
          aria-hidden
          style={{
            height: LOGO_HEIGHT,
            opacity: hovered ? 1 : 0,
            transitionDuration: `${FRAME_FADE_MS}ms`,
          }}
          className="absolute left-0 top-0 w-auto transition-opacity ease-out"
        />
      </div>

      {/*
        Figma: 'Acumin Variable Concept', weight 194, 15px/18px. That's a
        paid Adobe Fonts family we can't self-host the way we did Inter --
        falling back to the site sans-serif stack at a light weight until
        real font files are provided.

        These used to be "#about"/"#playground"/"#work" anchors with no
        matching section on the page -- dead links everywhere. WORK now
        goes to the landing page itself (that's where the work already
        lives); ABOUT and PERSONAL PLAYGROUND don't have real pages yet,
        so they go to the placeholder route ("/web-artifacts-builder",
        see page.tsx) until they do.

        ABOUT/PERSONAL PLAYGROUND are plain <a> tags, not <Link> --
        "/web-artifacts-builder" has no page.tsx, so Next's client-side
        router can't find route data for it and silently fails to
        navigate on a soft transition. A real <a> forces a full page
        load, which correctly hits the static host's 404 handling (our
        styled not-found.tsx) instead of going nowhere. WORK stays a
        <Link> since "/" is a real, always-present route.
      */}
      <nav className="relative hidden md:flex w-[360px] items-center justify-between text-[15px] leading-[18px] font-light text-white">
        <a href="/web-artifacts-builder" className="hover:opacity-70">
          ABOUT
        </a>
        <a href="/web-artifacts-builder" className="hover:opacity-70">
          PERSONAL PLAYGROUND
        </a>
        <Link href="/" className="hover:opacity-70">
          WORK
        </Link>
      </nav>
    </header>
  );
}
