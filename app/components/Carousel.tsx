"use client";

import { useEffect, useRef, useState } from "react";

type CarouselImage = {
  src: string;
  alt: string;
};

type CarouselProps = {
  images: CarouselImage[];
  className?: string;
};

const AUTOPLAY_MS = 4500;
const DRAG_THRESHOLD_PX = 60;
const SLIDE_TRANSITION_MS = 700;

/**
 * Full-bleed, one-at-a-time image carousel. Autoplays on a fixed interval
 * and also responds to pointer drag / touch swipe -- dragging past the
 * threshold advances or retreats a slide, otherwise the track snaps back.
 * Autoplay pauses for the duration of an active drag so a mid-swipe
 * doesn't get yanked out from under the user, and resumes right after.
 */
export default function Carousel({ images, className = "" }: CarouselProps) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const widthRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

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
      className={`relative w-full overflow-hidden select-none ${className}`}
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
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="h-full w-full flex-shrink-0 object-cover"
            draggable={false}
          />
        ))}
      </div>

      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          {images.map((_, i) => (
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
