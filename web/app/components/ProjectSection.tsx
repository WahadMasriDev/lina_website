"use client";

import { useEffect, useRef, useState } from "react";

type ProjectSectionProps = {
  image: string;
  name: string;
  subtitle: string;
  video?: string;
  /** Extra photos to crossfade through on hover -- never includes `image` itself. */
  images?: readonly string[];
  /** No real assets yet -- hover darkens the thumbnail and shows "COMING SOON". */
  comingSoon?: boolean;
  priority?: boolean;
};

const MONTAGE_INTERVAL_MS = 1400;

// The Figma design overlays a soft dark gradient ("Vector") on top of each
// hero photo, rising from the bottom edge, before the text sits on it. The
// real gradient asset couldn't be pulled from Figma this pass (MCP tool-call
// limit was hit mid fetch), so this reproduces the same visual — a
// bottom-up multiply-blend darkening — with a CSS gradient instead of the
// exported asset. Swap the `overlay` div for an <img> of the real asset
// if/when it's fetched.
export default function ProjectSection({
  image,
  name,
  subtitle,
  video,
  images,
  comingSoon = false,
  priority = false,
}: ProjectSectionProps) {
  const [hovering, setHovering] = useState(false);
  // Index into `images` (the extras only -- the thumbnail `image` is never
  // part of the rotation, so hovering never just re-shows what's already
  // on screen).
  const [montageIndex, setMontageIndex] = useState(0);
  // Mount the <video> tag lazily, on first hover, rather than always. Some
  // browsers paint an unloaded <video> element as an opaque black box even
  // at opacity-0 (a compositor quirk, not a CSS bug) -- with the tag always
  // present that blacked out the hero photo underneath it permanently. Only
  // creating the element once we actually need it avoids that entirely.
  const [videoMounted, setVideoMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const montage = images && images.length > 0 ? images : null;

  useEffect(() => {
    if (!hovering || !montage) return;
    // Land on the first extra photo immediately on hover instead of
    // waiting out the first interval tick -- only the swaps after that
    // are paced.
    setMontageIndex(0);
    const id = setInterval(() => {
      setMontageIndex((i) => (i + 1) % montage.length);
    }, MONTAGE_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- montage is a
    // fresh array each render; length is what actually matters here.
  }, [hovering, montage?.length]);

  // Drives actually playing/pausing the <video> element. Runs after React
  // has committed the DOM (unlike calling play() straight from the
  // mouseenter handler, which was unreliable the first time the element
  // mounts -- videoRef.current wasn't consistently populated yet at that
  // point, so play() silently no-op'd and the video sat at readyState 0
  // forever, opaque black, having never even issued a network request).
  useEffect(() => {
    if (!videoMounted) return;
    if (hovering) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [videoMounted, hovering]);

  const handleEnter = () => {
    setHovering(true);
    if (video) setVideoMounted(true);
  };

  const handleLeave = () => {
    setHovering(false);
  };

  const showingMontage = hovering && montage;

  return (
    <section
      className="relative w-full aspect-[1864/978] overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          (hovering && video) || showingMontage ? "opacity-0" : "opacity-100"
        }`}
      />

      {montage &&
        montage.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              hovering && i === montageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

      {video && videoMounted && (
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            hovering ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.55) 45%, transparent 100%)",
        }}
      />

      {comingSoon && (
        <div
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-300 ${
            hovering ? "opacity-70" : "opacity-0"
          }`}
        >
          <span
            className={`text-xl font-bold uppercase tracking-[0.3em] text-white transition-opacity delay-100 duration-300 sm:text-2xl ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          >
            Coming soon
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-10 flex items-end justify-between px-4 text-white sm:bottom-16 sm:px-8 md:bottom-20">
        <div>
          <p className="text-xl sm:text-2xl md:text-[33px] leading-normal">
            THIS IS <span className="font-bold">{name}</span>
          </p>
          <p className="mt-2 text-base sm:text-lg md:text-2xl leading-normal text-white/90">
            {subtitle}
          </p>
        </div>
        <p className="hidden sm:block shrink-0 text-sm md:text-[20px] leading-normal text-white/90">
          explore more
        </p>
      </div>
    </section>
  );
}
