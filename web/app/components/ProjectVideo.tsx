"use client";

import { useRef, useState } from "react";

type ProjectVideoProps = {
  src: string;
  /** Adds a subtle press animation -- a soft scale + gold-hairline flash,
   * nothing extravagant. Only the first video block on a project page
   * gets this per the brief. */
  pressAnimation?: boolean;
  /** Defaults to the Figma "Project Video" block's own ratio. The hero at
   * the top of a project page uses the wider 1920:1080 frame instead. */
  aspectClassName?: string;
  /** Composited on top of the video (e.g. the header, for a full-bleed
   * hero) -- sits in its own absolutely-positioned layer above it. */
  overlay?: React.ReactNode;
};

// Per the latest direction: these no longer autoplay on their own --
// static at rest, plays on hover, same "hero animation on hover"
// treatment across every project video on the site. A hover can't happen
// until the loading screen (which sits on top and captures every
// pointer event while it's up) is gone, so there's no need to also gate
// this on the app-ready signal the way the old autoplay version did.
export default function ProjectVideo({
  src,
  pressAnimation = false,
  aspectClassName = "aspect-[1864/978]",
  overlay,
}: ProjectVideoProps) {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (!pressAnimation) return;
    setPressed(false);
    // restart the animation even on rapid repeat clicks
    requestAnimationFrame(() => setPressed(true));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPressed(false), 650);
  };

  // Each hover replays the animation from the start, rather than resuming
  // wherever a previous hover left off -- "the hero animation runs on
  // hover" reads as a discrete replay, not a pause/resume.
  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div
      className={`relative w-full ${aspectClassName} overflow-hidden ${
        pressAnimation ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
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
      {overlay}
    </div>
  );
}
