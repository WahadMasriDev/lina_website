"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProjectSectionProps = {
  image: string;
  name: string;
  subtitle: string;
  video?: string;
  /** Extra photos to slowly crossfade through, once the intro settles --
   * never includes `image` itself. */
  images?: readonly string[];
  /** No real assets yet -- fades to a dark "COMING SOON" once settled. */
  comingSoon?: boolean;
  priority?: boolean;
  /** "explore more" navigates here when set; sections without a built page
   * yet just don't link anywhere. */
  href?: string;
};

// Sped up per review feedback ("transition can be faster", referencing
// paulkalkbrenner.net's snappier pacing) -- was 2200/1400.
const MONTAGE_INTERVAL_MS = 1400;
const MONTAGE_CROSSFADE_MS = 650;
const MEDIA_FADE_MS = 1500;

// Reveal choreography, per review feedback: the old version was a whole
// intro sequence (card dims, title fades in centered and scaled up over
// the image, sweeps bold word-by-word, then glides down into its resting
// corner). That's gone -- "remove it all together" -- replaced with
// something much simpler: the hero image alone is visible the instant a
// section arrives, and the title/subtitle just fade in, in place, at their
// normal resting position, a beat later. No scaling, no centering, no
// word-sweep.
const TEXT_REVEAL_DELAY_MS = 500;
const TEXT_FADE_MS = 500;

// A beat of stillness before the video/photo carousel starts, every time
// a section becomes the active one. Without this, media would start the
// instant you arrive; this holds it back so there's always a still moment
// first.
const MEDIA_START_DELAY_MS = 1000;

// Once the video plays through to the end, it fades back to the static
// thumbnail, holds there for a beat, then fades back in and replays from
// the start -- on a loop, for as long as the section stays active. This is
// how long it holds on the thumbnail between plays.
const VIDEO_REPLAY_HOLD_MS = 1000;

// Exact Dev Mode CSS from Figma ("Project Component"), measured against
// one 1851.51px-wide reference frame -- desktop matches those numbers
// exactly. Font sizes and the title's box width scale down smoothly for
// narrower screens (via `clampVw`) but stop at a floor that stays
// readable, rather than shrinking in strict proportion all the way down
// to an unreadable few pixels on a phone. Line-heights use a unitless
// ratio (matching each element's own Figma font-size/line-height ratio)
// instead of their own separate clamp, so they always track the font
// size exactly instead of two independent curves drifting apart.
//
// The left/right inset isn't its own value any more -- per feedback, it
// needs to match the Header's own horizontal padding exactly (px-4 /
// sm:px-8, i.e. 16px under 640px, 32px from 640px up), so the title/
// "explore more" row lines up with the logo mark's own left edge rather
// than being sized around the title text. Applied as the same Tailwind
// classes below (not a computed value) so it's guaranteed to always
// match Header.tsx, including if that ever changes.
const REF_FRAME_WIDTH = 1851.51;
const clampVw = (minPx: number, targetPx: number, maxPx: number) =>
  `clamp(${minPx}px, ${(targetPx / REF_FRAME_WIDTH) * 100}vw, ${maxPx}px)`;

const GRADIENT_HEIGHT_VH = `${(452 / 1000) * 100}vh`; // 452/1000 of the frame's own height
const TEXT_INSET_BOTTOM = "40px"; // flat, exact Figma value at every screen size -- not scaled
const TITLE_FONT_SIZE = clampVw(20, 33.256, 33.256);
const TITLE_LINE_HEIGHT = 40 / 33.256; // unitless -- tracks TITLE_FONT_SIZE exactly
const TITLE_MARGIN_Y = "-2px"; // flat, matches Figma exactly
const SUBTITLE_FONT_SIZE = clampVw(16, 24, 24);
const SUBTITLE_LINE_HEIGHT = 29 / 24;
const EXPLORE_FONT_SIZE = clampVw(13, 20.568, 20.568);
const EXPLORE_LINE_HEIGHT = 25 / 20.568;
export default function ProjectSection({
  image,
  name,
  subtitle,
  video,
  images,
  comingSoon = false,
  priority = false,
  href,
}: ProjectSectionProps) {
  // Index into `images` (the extras only -- the thumbnail `image` is never
  // part of the rotation, so the carousel never just re-shows what's
  // already on screen).
  const [montageIndex, setMontageIndex] = useState(0);
  // Mount the <video> tag lazily, on first hover, rather than always. Some
  // browsers paint an unloaded <video> element as an opaque black box even
  // at opacity-0 (a compositor quirk, not a CSS bug) -- with the tag always
  // present that blacked out the hero photo underneath it permanently. Only
  // creating the element once we actually need it avoids that entirely.
  const [videoMounted, setVideoMounted] = useState(false);
  // "video" = playing/showing the video layer; "thumbnail" = the video has
  // just finished and we're holding on the static image before replaying.
  const [videoPhase, setVideoPhase] = useState<"video" | "thumbnail">("video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const replayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Whether the section is currently the one on screen. Text fades in a
  // beat after arriving, and fades back out (resetting) the moment you
  // scroll away, so it plays again fresh every time you come back --
  // there's no "only once" tracking any more, it's simple and repeatable.
  const [inView, setInView] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // High threshold: only counts as "arrived" once a section has
      // essentially fully taken over the screen.
      { threshold: 0.97 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      setTextVisible(false);
      return;
    }
    const id = setTimeout(() => setTextVisible(true), TEXT_REVEAL_DELAY_MS);
    return () => clearTimeout(id);
  }, [inView]);

  const descriptionVisible = textVisible;

  // Once the section is on screen and its text has faded in, the card's
  // video/photo carousel or "coming soon" starts playing on its own -- no
  // hover needed, and it stops the moment you scroll away. A short
  // MEDIA_START_DELAY_MS beat holds it back on every arrival so there's
  // always a still moment before anything starts moving.
  const [mediaReady, setMediaReady] = useState(false);
  useEffect(() => {
    if (!(inView && textVisible)) {
      setMediaReady(false);
      return;
    }
    const id = setTimeout(() => setMediaReady(true), MEDIA_START_DELAY_MS);
    return () => clearTimeout(id);
  }, [inView, textVisible]);

  const active = mediaReady;

  const montage = images && images.length > 0 ? images : null;

  useEffect(() => {
    if (!active || !montage) return;
    setMontageIndex(0); // always restart the carousel from the first extra photo
    const id = setInterval(() => {
      setMontageIndex((i) => (i + 1) % montage.length);
    }, MONTAGE_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- montage is a
    // fresh array each render; length is what actually matters here.
  }, [active, montage?.length]);

  // Mount the <video> tag lazily, once active, rather than always. Some
  // browsers paint an unloaded <video> element as an opaque black box even
  // at opacity-0 (a compositor quirk, not a CSS bug) -- with the tag always
  // present that blacked out the hero photo underneath it permanently. Only
  // creating the element once it's actually needed avoids that entirely.
  useEffect(() => {
    if (active && video) setVideoMounted(true);
  }, [active, video]);

  // Drives actually playing/pausing the <video> element. Runs after React
  // has committed the DOM (unlike calling play() straight from the mount
  // effect above, which was unreliable the first render -- videoRef.current
  // wasn't consistently populated yet at that point, so play() silently
  // no-op'd and the video sat at readyState 0 forever, opaque black,
  // having never even issued a network request).
  //
  // On leaving, the video pauses right away (freezing on its current
  // frame while the crossfade back to the static image covers it), but
  // the rewind to the start is deliberately delayed until that fade has
  // fully finished -- resetting immediately would visibly snap the video
  // back to frame 0 while it's still partly on screen. By the time the
  // reset happens it's already hidden, so the next visit always starts
  // clean from the beginning with nothing to see jump.
  useEffect(() => {
    if (!videoMounted) return;
    const el = videoRef.current;
    if (!el) return;

    if (active) {
      setVideoPhase("video");
      el.play().catch(() => {});
      return;
    }

    // Leaving the section: cancel any pending replay cycle so it doesn't
    // fire while we're away, and reset the phase so the next visit always
    // starts fresh on the video layer rather than mid-hold on the
    // thumbnail.
    if (replayTimeoutRef.current) {
      clearTimeout(replayTimeoutRef.current);
      replayTimeoutRef.current = null;
    }
    setVideoPhase("video");

    el.pause();
    const id = setTimeout(() => {
      el.currentTime = 0;
    }, MEDIA_FADE_MS + 50);
    return () => clearTimeout(id);
  }, [videoMounted, active]);

  // Runs when the video plays through to the end (native `loop` is off so
  // this actually fires): fade back to the static thumbnail, hold there at
  // full opacity for VIDEO_REPLAY_HOLD_MS, then rewind and fade back in to
  // replay -- for as long as the section stays active.
  //
  // The hold has to wait for the fade-to-thumbnail to actually finish
  // (MEDIA_FADE_MS) before it starts -- starting it immediately meant the
  // "hold" was really overlapping the fade itself, so the thumbnail never
  // sat still at full opacity before fading back out again.
  const handleVideoEnded = () => {
    setVideoPhase("thumbnail");
    if (replayTimeoutRef.current) clearTimeout(replayTimeoutRef.current);
    replayTimeoutRef.current = setTimeout(() => {
      replayTimeoutRef.current = setTimeout(() => {
        const el = videoRef.current;
        if (el) {
          el.currentTime = 0;
          el.play().catch(() => {});
        }
        setVideoPhase("video");
      }, VIDEO_REPLAY_HOLD_MS);
    }, MEDIA_FADE_MS);
  };

  // Belt-and-suspenders cleanup on unmount.
  useEffect(() => {
    return () => {
      if (replayTimeoutRef.current) clearTimeout(replayTimeoutRef.current);
    };
  }, []);

  const showingMontage = active && montage;
  const showingVideo = active && video && videoPhase === "video";

  // comingSoon projects link to the placeholder route in page.tsx
  // ("/404"), which has no page.tsx of its own -- a
  // <Link> soft-navigation to a route with no route data silently fails
  // to go anywhere, so those use a plain <a> instead, forcing a full page
  // load that correctly hits the static host's 404 handling (our styled
  // not-found.tsx). Finished projects (like Cheval Blanc) link to a real
  // page, so they keep the client-side <Link> transition.
  const Wrapper = href ? (comingSoon ? "a" : Link) : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full shrink-0 overflow-hidden"
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
          style={{
            opacity: showingVideo || showingMontage ? 0 : 1,
            transitionDuration: `${MEDIA_FADE_MS}ms`,
          }}
        />

        {montage &&
          montage.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
              style={{
                opacity: active && i === montageIndex ? 1 : 0,
                transitionDuration: `${MONTAGE_CROSSFADE_MS}ms`,
              }}
            />
          ))}

        {video && videoMounted && (
          <video
            ref={videoRef}
            src={video}
            muted
            playsInline
            preload="none"
            onEnded={handleVideoEnded}
            className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
            style={{
              opacity: showingVideo ? 1 : 0,
              transitionDuration: `${MEDIA_FADE_MS}ms`,
            }}
          />
        )}
      </div>

      {/* Figma "Gradiant": white-to-black, top-to-bottom, multiply blend --
          452/1000 of the frame height, anchored to the bottom. On a
          multiply blend, white (top) leaves the photo unchanged and black
          (bottom) fully darkens it, which is the same "rises from the
          bottom edge" look as before, just matched exactly to spec instead
          of an approximated rgba gradient. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 mix-blend-multiply"
        style={{
          height: GRADIENT_HEIGHT_VH,
          background: "linear-gradient(180deg, #FFFFFF 0%, #000000 100%)",
        }}
      />

      {comingSoon && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-black transition-opacity ease-out"
          style={{
            opacity: active ? 0.7 : 0,
            transitionDuration: `${MEDIA_FADE_MS}ms`,
          }}
        >
          <span
            className="text-xl font-bold uppercase tracking-[0.3em] text-white transition-opacity ease-out sm:text-2xl"
            style={{
              opacity: active ? 1 : 0,
              transitionDuration: `${MEDIA_FADE_MS}ms`,
              transitionDelay: active ? "150ms" : "0ms",
            }}
          >
            Coming soon
          </span>
        </div>
      )}

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Wrapper
        {...(wrapperProps as any)}
        className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 text-white sm:px-8"
        style={{
          paddingBottom: TEXT_INSET_BOTTOM,
        }}
      >
        {/* Sits at its resting position at all times -- only opacity
            animates, fading in TEXT_REVEAL_DELAY_MS after the section
            arrives on screen. No scale, no centering, no word-by-word
            bold sweep. */}
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transitionProperty: "opacity",
            transitionDuration: `${TEXT_FADE_MS}ms`,
            transitionTimingFunction: "ease-out",
          }}
        >
          {/* Figma: 'Inter', 33.256px / 40px line-height, -2px top+bottom
              margin -- "THIS IS " is regular (400), the project name is
              bold (700). No width constraint -- the box hugs the text
              instead of wrapping it, same as the subtitle below. */}
          <p
            className="whitespace-nowrap"
            style={{
              fontSize: TITLE_FONT_SIZE,
              lineHeight: TITLE_LINE_HEIGHT,
              marginTop: TITLE_MARGIN_Y,
              marginBottom: TITLE_MARGIN_Y,
            }}
          >
            THIS IS <span className="font-bold">{name}</span>
          </p>
          {/* Figma: 'Inter', 400, 24px / 29px line-height. Also hugs its
              own text, never wraps -- several subtitles (e.g. "Hotel de
              luxe à la samaritaine, LVMH") are longer than the title. */}
          <p
            className="whitespace-nowrap font-normal text-white/90 transition-opacity duration-500"
            style={{
              fontSize: SUBTITLE_FONT_SIZE,
              lineHeight: SUBTITLE_LINE_HEIGHT,
              opacity: descriptionVisible ? 1 : 0,
            }}
          >
            {subtitle}
          </p>
        </div>
        {/* Figma: 'Inter', 400, 20.568px / 25px line-height. Sits at the
            Wrapper's right edge via `justify-between` on the row above,
            inset by the same px-4/sm:px-8 as the title's left edge (and
            the Header's own padding) -- no arrow, just the label. */}
        <div
          className="hidden shrink-0 items-center font-normal text-white/90 transition-opacity duration-500 sm:flex"
          style={{
            fontSize: EXPLORE_FONT_SIZE,
            lineHeight: EXPLORE_LINE_HEIGHT,
            opacity: descriptionVisible ? 1 : 0,
          }}
        >
          explore more
        </div>
      </Wrapper>
    </section>
  );
}
