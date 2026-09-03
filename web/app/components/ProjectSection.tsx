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

// Per the latest direction: no animation on the text at all -- title and
// subtitle are just always there at full opacity, same as the rest of the
// (now un-animated) landing page. The video/photo carousel now plays on
// hover instead -- see `active` below.

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

  // Per the latest direction: the hero video/photo carousel plays on
  // hover, not automatically once scrolled into view. A hover can't
  // happen until the loading screen (which sits on top and captures
  // every pointer event while it's up) is gone, so there's no need to
  // also gate this on the app-ready signal the way the old
  // scroll-to-activate version did.
  const [hovered, setHovered] = useState(false);
  const descriptionVisible = true;
  const active = hovered;

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
  const LinkTag = comingSoon ? "a" : Link;
  const linkProps = comingSoon ? { href: href ?? "" } : { href: href ?? "" };

  return (
    <section
      className="relative h-screen w-full shrink-0 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

      {/* Plain text row now -- no longer its own link. The whole card is
          clickable via the full-cover link below instead, per Nezar's
          feedback ("press on the whole image project ... not only the
          explore more button"). */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 text-white sm:px-8"
        style={{
          paddingBottom: TEXT_INSET_BOTTOM,
        }}
      >
        {/* Always visible, no fade -- per the latest direction, text on
            the landing page doesn't animate at all. */}
        <div>
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
            text row's right edge via `justify-between` on the row above,
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
      </div>

      {/* Full-cover click target -- sits above everything else in the
          card (image, gradient, text) so clicking anywhere on the project
          image navigates to its page, not just the "explore more" label.
          Transparent; the visual hover/video treatment is still driven by
          the section's own onMouseEnter/onMouseLeave above. comingSoon
          sections have nothing to link to, so they stay unclickable. */}
      {href && (
        <LinkTag
          {...linkProps}
          aria-label={name}
          className="absolute inset-0 z-10"
        />
      )}
    </section>
  );
}
