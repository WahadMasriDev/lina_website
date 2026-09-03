"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJECT_LINKS } from "../data/projects";

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
  /** Skips the icon/hover-to-full-lockup behaviour entirely and just
   * always shows the full "LINA ZAKARIA" wordmark. Used on standalone
   * pages like not-found.tsx, where there's no hero content underneath
   * competing for attention, so the compact icon-at-rest treatment isn't
   * needed -- the name can just sit there. */
  staticLogo?: boolean;
  /** SolCotton's Figma frame (313:639) is a light page -- white
   * background, black text and logo throughout, unlike every other
   * project page's dark treatment. Swaps the nav text to black and the
   * logo to its black variant (logo-*-dark.svg); the hover backing (when
   * `overlay` is also set) becomes white instead of black so it still
   * reads as "no backing" against the light page. */
  light?: boolean;
};

export default function Header({
  overlay = false,
  staticLogo = false,
  light = false,
}: HeaderProps) {
  // Tracks hover over the whole header, on every page (not gated on
  // `overlay`) -- the logo swap needs it everywhere, even though the
  // black backing below is still landing-page-only.
  const [hovered, setHovered] = useState(false);
  const framed = overlay && hovered;
  // WORK's own dropdown, listing every project -- separate from the
  // header-wide `hovered` state above (that one only drives the overlay
  // backing + logo swap).
  const [workOpen, setWorkOpen] = useState(false);

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
          className={`absolute inset-0 transition-opacity ease-out ${
            light ? "bg-white" : "bg-black"
          }`}
          style={{
            opacity: framed ? 1 : 0,
            transitionDuration: `${FRAME_FADE_MS}ms`,
          }}
        />
      )}

      {/* Clicking the logo, in either state, goes back to the landing
          page -- the standard "logo = home" convention. Works fine even
          when already on "/": Link just no-ops there. */}
      <Link
        href="/"
        aria-label="Lina Zakaria — Retour à l'accueil"
        className="relative flex items-center"
        style={{ height: LOGO_HEIGHT, width: LOGO_WHOLE_WIDTH }}
      >
        {staticLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={light ? "/images/logo-whole-dark.svg" : "/images/logo-whole.svg"}
            alt=""
            style={{ height: LOGO_HEIGHT }}
            className="w-auto"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={light ? "/images/logo-icon-dark.svg" : "/images/logo-icon.svg"}
              alt=""
              style={{
                height: LOGO_HEIGHT,
                opacity: hovered ? 0 : 1,
                transitionDuration: `${FRAME_FADE_MS}ms`,
              }}
              className="absolute left-0 top-0 w-auto transition-opacity ease-out"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={light ? "/images/logo-whole-dark.svg" : "/images/logo-whole.svg"}
              alt=""
              aria-hidden
              style={{
                height: LOGO_HEIGHT,
                opacity: hovered ? 1 : 0,
                transitionDuration: `${FRAME_FADE_MS}ms`,
              }}
              className="absolute left-0 top-0 w-auto transition-opacity ease-out"
            />
          </>
        )}
      </Link>

      {/*
        Figma: 'Acumin Variable Concept', weight 194, 15px/18px. That's a
        paid Adobe Fonts family we can't self-host the way we did Inter --
        falling back to the site sans-serif stack at a light weight until
        real font files are provided.

        These used to be "#about"/"#playground"/"#work" anchors with no
        matching section on the page -- dead links everywhere. WORK now
        goes to the landing page itself (that's where the work already
        lives); ABOUT and PERSONAL PLAYGROUND don't have real pages yet,
        so they go to the placeholder route ("/404",
        see page.tsx) until they do.

        ABOUT/PERSONAL PLAYGROUND are plain <a> tags, not <Link> --
        "/404" has no page.tsx, so Next's client-side
        router can't find route data for it and silently fails to
        navigate on a soft transition. A real <a> forces a full page
        load, which correctly hits the static host's 404 handling (our
        styled not-found.tsx) instead of going nowhere. WORK stays a
        <Link> since "/" is a real, always-present route.
      */}
      <nav
        className={`relative hidden md:flex w-[360px] items-center justify-between text-[15px] leading-[18px] font-light ${
          light ? "text-black" : "text-white"
        }`}
      >
        <Link href="/about" className="hover:opacity-70">
          ABOUT
        </Link>
        <a href="/404" className="hover:opacity-70">
          PERSONAL PLAYGROUND
        </a>
        {/* WORK still goes to the landing page on click (unchanged), but
            hovering it now reveals an elegant dropdown linking straight
            to any individual project -- "make me go to any of the
            projects" -- built off the same shared PROJECT_LINKS list the
            landing page's own cards are named from, so it can never drift
            out of sync with what's actually on the site. */}
        <div
          className="relative"
          onMouseEnter={() => setWorkOpen(true)}
          onMouseLeave={() => setWorkOpen(false)}
        >
          <Link href="/" className="hover:opacity-70">
            WORK
          </Link>
          <div
            className={`absolute right-0 top-full z-50 pt-3 transition-all ease-out ${
              workOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
            style={{ transitionDuration: `${FRAME_FADE_MS}ms` }}
          >
            <div
              className={`flex w-max min-w-[220px] flex-col gap-3 border px-5 py-4 backdrop-blur-sm ${
                light
                  ? "border-black/10 bg-white/95 text-black"
                  : "border-white/10 bg-black/90 text-white"
              }`}
            >
              {PROJECT_LINKS.map((project) => (
                <Link
                  key={project.href}
                  href={project.href}
                  className="whitespace-nowrap text-[13px] font-light tracking-wide opacity-80 transition-opacity hover:opacity-100"
                >
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
