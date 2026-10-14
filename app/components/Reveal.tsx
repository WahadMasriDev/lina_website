"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger position -- sections fade in one after another in this order,
   * on mount/navigation, not on scroll. */
  index: number;
  className?: string;
};

const STEP_MS = 140;
const BASE_DELAY_MS = 80;

/**
 * Entrance animation for project detail pages: every section is hidden on
 * first paint, then reveals in a simple upward fade -- staggered by
 * `index` -- the moment the page mounts. This intentionally does NOT use
 * an IntersectionObserver / scroll trigger: the brief asked for the
 * sequence to play once, linearly, when you land on the page (e.g. via
 * "explore more" from the landing page), not on every scroll pass.
 */
export default function Reveal({ children, index, className = "" }: RevealProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShown(true), BASE_DELAY_MS + index * STEP_MS);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <div
      className={`transition-all duration-[900ms] ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
    >
      {children}
    </div>
  );
}
