"use client";

import { useEffect, useRef, useState } from "react";
import { useAppReady } from "./AppReady";

type VideoCarouselProps = {
  /** In display order -- matches the Figma CAROUSEL component (node
   * 303:318) ordering, per Nezar's explicit ordering. */
  videos: readonly string[];
};

const AUTOPLAY_MS = 5500;
const DRAG_THRESHOLD_PX = 60;
const SLIDE_TRANSITION_MS = 700;

/**
 * Full-bleed, one-video-at-a-time carousel -- the same effect as the
 * image Carousel used on the PSG page (autoplay on an interval, pointer
 * drag/swipe to advance, dot indicators), adapted for video. The page
 * background is already black, so each portrait clip is shown in full
 * with object-contain rather than cropped to a wide frame -- any
 * letterboxing on the sides is invisible against the black page.
 */
export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const count = videos.length;
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const widthRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const ready = useAppReady();

  // Only the active slide actually plays -- the rest stay paused (and
  // unloaded via preload="none") so six clips aren't all decoding at
  // once. Same gating as everywhere else `ready` guards playback: these
  // mount underneath the loading screen before it lifts.
  useEffect(() => {
    if (!ready) return;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [index, ready]);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (draggingRef.current) return;
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (count <= 1) return;
    draggingRef.current = true;
    setDragging(true);
    startXRef.current = e.clientX;
    widthRef.current = containerRef.current?.clientWidth || 1;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setDragPx(e.clientX - startXRef.current);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (dragPx <= -DRAG_THRESHOLD_PX) {
      setIndex((i) => (i + 1) % count);
    } else if (dragPx >= DRAG_THRESHOLD_PX) {
      setIndex((i) => (i - 1 + count) % count);
    }
    setDragPx(0);
  };

  const dragPercent = (dragPx / widthRef.current) * 100;
  const translatePercent = -(index * 100) + dragPercent;

  return (
    <div
      ref={containerRef}
      className="relative h-[70vh] w-full select-none overflow-hidden bg-black sm:h-[80vh]"
    >
      <div
        className="flex h-full touch-pan-y"
        style={{
          transform: `translateX(${translatePercent}%)`,
          transition: dragging
            ? "none"
            : `transform ${SLIDE_TRANSITION_MS}ms cubic-bezier(.16,1,.3,1)`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {videos.map((src, i) => (
          <div
            key={src}
            className="flex h-full w-full flex-shrink-0 items-center justify-center"
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={src}
              muted
              loop
              playsInline
              preload={i === index ? "auto" : "none"}
              draggable={false}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          {videos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
