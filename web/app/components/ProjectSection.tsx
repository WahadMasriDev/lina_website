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

const MONTAGE_INTERVAL_MS = 2200;
const MONTAGE_CROSSFADE_MS = 1400;
const MEDIA_FADE_MS = 900;

// Intro choreography, timed from the moment a section first becomes
// active:
//  1. dimmed -- card darkens, title invisible.
//  2. wave   -- title fades in centered over the card and sweeps bold
//               word by word ("this" -> "is" -> name), ~2s total.
//  3. transfer -- the title glides down to its resting spot in the
//               bottom-left corner while the card brightens back up.
//  4. settled -- subtitle and "explore more" fade in on the completed,
//               static look, and the video/photo carousel (or "coming
//               soon") starts playing on its own -- no hover required.
// This only ever plays once per section, the first time it's reached --
// it's an introduction, not a loop, so leaving and coming back later
// leaves it settled rather than replaying.
const WAVE_START_DELAY_MS = 150;
const WAVE_STEP_MS = 700;
const WAVE_HOLD_MS = 600; // lets "name" finish bolding before the card unfolds
const TRANSFER_DURATION_MS = 950;
const TRANSFER_HOLD_MS = 200;

// Separate from the once-only text intro above: every time a section
// becomes the active one -- including repeat visits, after the text
// intro has already played -- its image gets a quick settle-in (a soft
// zoom easing down to rest). Paired with a high IntersectionObserver
// threshold (so this only fires once a section has essentially fully
// arrived, not mid-glide), it reads as "I just scrolled to a new
// project" every time, not just the first time.
const ARRIVE_SETTLE_MS = 1100;

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaWrapRef = useRef<HTMLDivElement | null>(null);

  // "THIS <wave> IS <wave> NAME" -- each project section is a full-screen
  // scroll-snap panel on the landing page, so "becoming active" the first
  // time (snapped to, mostly on screen) is the moment this intro plays.
  const [wave, setWave] = useState<"idle" | "this" | "is" | "name">("idle");
  const [phase, setPhase] = useState<
    "idle" | "dimmed" | "wave" | "transfer" | "settled"
  >("idle");
  // Once the intro has fully played, it's done for good -- scrolling away
  // and back must not replay it or reset the card to dimmed/hidden.
  const hasPlayedRef = useRef(false);

  // The recurring "I just arrived" settle cue -- driven imperatively via a
  // ref rather than React state, so each arrival is a clean single
  // zoomed-in -> rest motion (jump to scaled-up with no transition, force
  // a reflow, then transition back down) instead of a state toggle that
  // would have to animate up AND back down every time.
  const playArriveSettle = () => {
    const wrap = mediaWrapRef.current;
    if (!wrap) return;
    wrap.style.transition = "none";
    wrap.style.transform = "scale(1.07)";
    void wrap.offsetHeight; // force reflow so the jump above isn't animated
    wrap.style.transition = `transform ${ARRIVE_SETTLE_MS}ms cubic-bezier(.16,1,.3,1)`;
    wrap.style.transform = "scale(1)";
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        timers.forEach(clearTimeout);
        timers.length = 0;

        if (!entry.isIntersecting) {
          if (!hasPlayedRef.current) {
            setPhase("idle");
            setWave("idle");
          }
          return;
        }

        // Every arrival gets the settle-in, first visit or not.
        playArriveSettle();

        if (hasPlayedRef.current) {
          // Already introduced -- stay settled, just replay the arrival cue.
          return;
        }

        setPhase("dimmed");
        setWave("idle");

        schedule(() => setPhase("wave"), WAVE_START_DELAY_MS);
        schedule(() => setWave("this"), WAVE_START_DELAY_MS);
        schedule(() => setWave("is"), WAVE_START_DELAY_MS + WAVE_STEP_MS);
        schedule(() => setWave("name"), WAVE_START_DELAY_MS + WAVE_STEP_MS * 2);

        const transferAt = WAVE_START_DELAY_MS + WAVE_STEP_MS * 2 + WAVE_HOLD_MS;
        schedule(() => setPhase("transfer"), transferAt);
        schedule(() => {
          setPhase("settled");
          hasPlayedRef.current = true;
        }, transferAt + TRANSFER_DURATION_MS + TRANSFER_HOLD_MS);
      },
      // High threshold: only counts as "arrived" once a section has
      // essentially fully taken over the screen, so the slide itself is
      // still clearly visible before any dimming/settle effect kicks in.
      { threshold: 0.97 }
    );
    observer.observe(el);
    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  const introHidden = phase === "idle" || phase === "dimmed";
  const centered = phase === "idle" || phase === "dimmed" || phase === "wave";
  const dimmed = phase === "dimmed" || phase === "wave";
  const descriptionVisible = phase === "settled";
  // Once the intro has settled, the card takes over on its own -- no
  // hover needed for the video/photo carousel or the "coming soon" look.
  const active = phase === "settled";

  const montage = images && images.length > 0 ? images : null;

  useEffect(() => {
    if (!active || !montage) return;
    const id = setInterval(() => {
      setMontageIndex((i) => (i + 1) % montage.length);
    }, MONTAGE_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- montage is a
    // fresh array each render; length is what actually matters here.
  }, [active, montage?.length]);

  // Mount the <video> tag lazily, once the intro settles, rather than
  // always. Some browsers paint an unloaded <video> element as an opaque
  // black box even at opacity-0 (a compositor quirk, not a CSS bug) --
  // with the tag always present that blacked out the hero photo
  // underneath it permanently. Only creating the element once it's
  // actually needed avoids that entirely.
  useEffect(() => {
    if (active && video) setVideoMounted(true);
  }, [active, video]);

  // Drives actually playing/pausing the <video> element. Runs after React
  // has committed the DOM (unlike calling play() straight from the mount
  // effect above, which was unreliable the first render -- videoRef.current
  // wasn't consistently populated yet at that point, so play() silently
  // no-op'd and the video sat at readyState 0 forever, opaque black,
  // having never even issued a network request).
  useEffect(() => {
    if (!videoMounted) return;
    if (active) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
    }
  }, [videoMounted, active]);

  const showingMontage = active && montage;

  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full shrink-0 snap-start overflow-hidden"
    >
      {/* Every arrival (first time or a repeat visit) gets a soft zoom
          settling down to rest -- this is what actually sells "I just
          scrolled to a new project" on repeat visits, once the one-time
          dim+wave intro no longer plays. */}
      <div ref={mediaWrapRef} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
          style={{
            opacity: (active && video) || showingMontage ? 0 : 1,
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
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
            style={{
              opacity: active ? 1 : 0,
              transitionDuration: `${MEDIA_FADE_MS}ms`,
            }}
          />
        )}
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.55) 45%, transparent 100%)",
        }}
      />

      {/* Intro-only darkening: the card starts dimmed while the title
          animates centered over it, then brightens back up as the title
          transfers down to its resting corner. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black transition-opacity ease-out"
        style={{
          opacity: dimmed ? 0.78 : 0,
          transitionDuration: `${TRANSFER_DURATION_MS}ms`,
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
        className="absolute inset-x-0 bottom-10 flex items-end justify-between px-4 text-white sm:bottom-16 sm:px-8 md:bottom-20"
      >
        {/* This block is the "animation" -- it starts hidden and centered
            (scaled up) over the middle of the card, plays the bold word
            wave there, then glides down/back to size into its resting
            bottom-left spot once the wave finishes. The subtitle rides
            along but stays invisible until settled, so it never flashes
            at the wrong scale mid-transfer. */}
        <div
          style={{
            transform: centered
              ? "translate(6vw, -36vh) scale(1.4)"
              : "translate(0, 0) scale(1)",
            opacity: introHidden ? 0 : 1,
            transitionProperty: "transform, opacity",
            transitionDuration: `${TRANSFER_DURATION_MS}ms, 700ms`,
            transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
          }}
        >
          {/* Figma: 'Inter', 33.256px / 40px line-height -- "THIS IS " is
              regular (400), the project name is bold (700). The intro wave
              sweeps bold across the three tokens on activation, then rests
              here (name bold, rest regular). Font-weight transitions
              smoothly because Inter Variable supports interpolating it. */}
          <p className="text-xl sm:text-2xl md:text-[33.256px] md:leading-[40px]">
            <span
              className="inline-block transition-[font-weight] duration-500"
              style={{ fontWeight: wave === "this" ? 700 : 400 }}
            >
              THIS
            </span>{" "}
            <span
              className="inline-block transition-[font-weight] duration-500"
              style={{ fontWeight: wave === "is" ? 700 : 400 }}
            >
              IS
            </span>{" "}
            <span
              className="inline-block transition-[font-weight] duration-500"
              style={{ fontWeight: wave === "name" ? 700 : 400 }}
            >
              {name}
            </span>
          </p>
          {/* Figma: 'Inter', 400, 24px / 29px line-height */}
          <p
            className="mt-2 text-base font-normal leading-normal text-white/90 transition-opacity duration-500 md:text-[24px] md:leading-[29px]"
            style={{ opacity: descriptionVisible ? 1 : 0 }}
          >
            {subtitle}
          </p>
        </div>
        {/* Figma: 'Inter', 400, 20.568px / 25px line-height -- once settled,
            a small arrow quietly nudges back and forth on a loop to draw
            the eye toward it as something clickable, rather than sitting
            fully static. */}
        <div
          className="hidden shrink-0 items-center gap-2 text-sm font-normal text-white/90 transition-opacity duration-500 sm:flex md:text-[20.568px] md:leading-[25px]"
          style={{ opacity: descriptionVisible ? 1 : 0 }}
        >
          <span>explore more</span>
          <span
            aria-hidden
            className="inline-block"
            style={
              descriptionVisible
                ? { animation: "explore-nudge 2.2s ease-in-out infinite" }
                : undefined
            }
          >
            →
          </span>
        </div>
      </Wrapper>
    </section>
  );
}
