"use client";

import { useEffect, useRef, useState } from "react";
import { useAppReady } from "./AppReady";

type VideoCarouselProps = {
  /** In display order, left to right -- matches the Figma CAROUSEL
   * component (node 303:318) exactly, per Nezar's explicit ordering. */
  videos: readonly string[];
};

// Figma's CAROUSEL component (node 303:318): a horizontal row of portrait
// video cards, 595:1058 (~0.562 aspect, same as a 1080x1920 vertical
// video), 25px apart. Nezar asked for it to be draggable -- "i can drag
// them to make them move" -- so this is a plain horizontal scroller
// (native touch/trackpad scroll works out of the box) with mouse-drag
// added on top for desktop, rather than a scripted auto-advancing
// carousel with prev/next arrows.
const CARD_GAP_PX = 25;
const CARD_ASPECT = 595 / 1058;

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const movedRef = useRef(false);
  const [grabbing, setGrabbing] = useState(false);
  const ready = useAppReady();

  // Every card plays on loop, muted, as soon as the loading screen has
  // actually finished -- same reasoning as everywhere else `ready` gates
  // playback: these are mounted (and would otherwise start) underneath
  // the covering loading screen well before it lifts.
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    if (!ready) return;
    videoRefs.current.forEach((v) => v?.play().catch(() => {}));
  }, [ready]);

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startScrollRef.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 3) movedRef.current = true;
    track.scrollLeft = startScrollRef.current - delta;
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setGrabbing(false);
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  // Dragging shouldn't also register as a click on the video underneath.
  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      className={`no-scrollbar flex w-full select-none overflow-x-auto ${
        grabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ gap: `${CARD_GAP_PX}px` }}
    >
      {videos.map((src, i) => (
        <div
          key={src}
          className="relative shrink-0"
          style={{
            width: `min(70vw, ${1058 * CARD_ASPECT}px)`,
            aspectRatio: `${CARD_ASPECT}`,
          }}
        >
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src}
            muted
            loop
            playsInline
            preload="none"
            draggable={false}
            className="pointer-events-none h-full w-full rounded-sm object-cover"
          />
        </div>
      ))}
    </div>
  );
}
