"use client";

import { useState } from "react";

type ProjectNavProps = {
  names: readonly string[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/**
 * Replaces the native scrollbar on the landing page: a small, quiet
 * column of dots pinned to the right edge, one per project. At rest it's
 * just the dots -- small, circular, barely there except for the active
 * one, which gets a slow pulse so the whole thing reads as alive rather
 * than static chrome. Hovering the column expands it, fading in each
 * project's name so you can jump straight to it.
 */
export default function ProjectNav({ names, activeIndex, onSelect }: ProjectNavProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      aria-label="Jump to project"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed right-3 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-4 py-2 sm:right-5"
    >
      {names.map((name, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Jump to ${name}`}
            aria-current={active}
            className="group flex items-center gap-3"
          >
            <span
              className={`whitespace-nowrap text-[10px] font-light uppercase tracking-[0.2em] text-white transition-all duration-500 ease-out ${
                expanded
                  ? "translate-x-0 opacity-70 group-hover:opacity-100"
                  : "pointer-events-none translate-x-2 opacity-0"
              } ${active ? "opacity-100" : ""}`}
              style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            >
              {name}
            </span>
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span
                aria-hidden
                className={`block rounded-full border border-white/60 transition-all duration-500 ease-out ${
                  active
                    ? "h-2.5 w-2.5 bg-white"
                    : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/70"
                }`}
                style={
                  active
                    ? { animation: "nav-pulse 2.6s ease-in-out infinite" }
                    : { transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }
                }
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
}
