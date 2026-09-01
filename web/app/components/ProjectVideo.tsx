"use client";

import { useRef, useState } from "react";

type ProjectVideoProps = {
  src: string;
  /** Adds a subtle press animation -- a soft scale + gold-hairline flash,
   * nothing extravagant. Only the first video block on a project page
   * gets this per the brief. */
  pressAnimation?: boolean;
};

export default function ProjectVideo({ src, pressAnimation = false }: ProjectVideoProps) {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (!pressAnimation) return;
    setPressed(false);
    // restart the animation even on rapid repeat clicks
    requestAnimationFrame(() => setPressed(true));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPressed(false), 650);
  };

  return (
    <div
      className={`relative w-full aspect-[1864/978] overflow-hidden ${
        pressAnimation ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`h-full w-full object-cover transition-transform duration-[650ms] ${
          pressed ? "scale-[1.015]" : "scale-100"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
      />
      {pressAnimation && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 border border-white/70 transition-opacity duration-[650ms] ${
            pressed ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
        />
      )}
    </div>
  );
}
