"use client";

import { useEffect, useRef, useState } from "react";

type ProjectSectionProps = {
  image: string;
  name: string;
  subtitle: string;
  video?: string;
  /** Extra photos to crossfade through on hover, for projects with no video yet. */
  images?: readonly string[];
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
  priority = false,
}: ProjectSectionProps) {
  const [hovering, setHovering] = useState(false);
  const [montageIndex, setMontageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const montage = images && images.length > 0 ? [image, ...images] : null;

  useEffect(() => {
    if (!hovering || !montage) return;
    const id = setInterval(() => {
      setMontageIndex((i) => (i + 1) % montage.length);
    }, MONTAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hovering, montage]);

  const handleEnter = () => {
    if (video) {
      setHovering(true);
      videoRef.current?.play().catch(() => {});
      return;
    }
    if (montage) {
      setHovering(true);
    }
  };

  const handleLeave = () => {
    if (video) {
      setHovering(false);
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      return;
    }
    if (montage) {
      setHovering(false);
      setMontageIndex(0);
    }
  };

  return (
    <section
      className="relative w-full aspect-[1864/978] overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {montage ? (
        montage.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={name}
            loading={priority && i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === (hovering ? montageIndex : 0) ? "opacity-100" : "opacity-0"
            }`}
          />
        ))
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          loading={priority ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            hovering && video ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {video && (
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
