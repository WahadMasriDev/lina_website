"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";
import ProjectNav from "./components/ProjectNav";
import ContactSection from "./components/ContactSection";

// Cheval Blanc is the only project with a finished video, so it's the only
// one that plays anything -- every other project is marked comingSoon for
// now, showing the "Coming soon" treatment instead of the old photo
// carousel, until real AI-generated animations replace it project by
// project. Cheval Blanc links to its real detail page; every comingSoon
// card links to the placeholder route below, so "explore more" always
// goes somewhere -- an elegant "not built yet" page -- rather than being
// a dead, unclickable card.
//
// `/404` is a deliberately nonexistent route: it has no
// page.tsx, so Next.js renders app/not-found.tsx for it. That page is
// this site's stand-in destination for every link that doesn't have a
// real page yet -- swap these hrefs for the real project pages as they
// get built.
const PLACEHOLDER_HREF = "/404";

const projects = [
  {
    image: "/images/cheval-blanc.png",
    video: "/videos/cheval-blanc.mp4",
    name: "CHEVAL BLANC",
    subtitle: "Hotel de luxe à la samaritaine, LVMH",
    href: "/projects/cheval-blanc",
  },
  {
    image: "/images/solcotton.png",
    name: "SOLCOTTON",
    subtitle: "Marque de cotton de luxe",
    comingSoon: true,
    href: PLACEHOLDER_HREF,
  },
  {
    image: "/images/bose-bmw.png",
    name: "BOSE X BMW",
    subtitle: "Interior design in Bejing",
    comingSoon: true,
    href: PLACEHOLDER_HREF,
  },
  {
    image: "/images/mcintosh-virgil-abloh.png",
    name: "MCINTOSH X VIRGIL ABLOH",
    subtitle: "Exposition au Grand Palais de Paris",
    comingSoon: true,
    href: PLACEHOLDER_HREF,
  },
  {
    image: "/images/psg-maison-shanghai.png",
    name: "PSG X LA MAISON SHANGHAI",
    subtitle: "Interior design project",
    comingSoon: true,
    href: PLACEHOLDER_HREF,
  },
  {
    image: "/images/hb-antwerp.png",
    name: "HB ANTWERP",
    subtitle: "Luxury diamond company",
    comingSoon: true,
    href: PLACEHOLDER_HREF,
  },
] as const;

// The landing page (only the landing page -- project detail pages scroll
// normally) is a full-screen, one-project-at-a-time experience. Wheel/
// trackpad input is intercepted and paged by hand: each tick moves
// exactly one section, eased over SECTION_ANIMATION_MS, and further input
// is ignored until that glide (plus a short cooldown, to swallow
// trailing momentum from the same physical gesture) finishes.
//
// Important: the container must NOT also have CSS scroll-snap turned on.
// With `scroll-snap-type` set, the browser snaps scrollTop straight to
// the nearest snap point the instant it's assigned, which was silently
// overriding this whole rAF loop and making every glide look like an
// instant jump no matter how long SECTION_ANIMATION_MS was. This is now
// the only thing driving scroll position on this page.
//
// The header is a persistent, full-bleed frosted bar pinned to the top --
// same look at all times, on every project (see Header.tsx). The native
// scrollbar is hidden in favour of ProjectNav, a small dot column on the
// right that tracks the active section and jumps to any other on click.
// Sped up per review feedback ("transition can be faster") -- was
// 1500/350, then 850/150, nudged a bit quicker again. This is the glide
// between projects itself (one wheel tick = one section), separate from
// the in-card photo montage crossfade (MONTAGE_CROSSFADE_MS in
// ProjectSection.tsx), which was sped up too.
const SECTION_ANIMATION_MS = 650;
const WHEEL_COOLDOWN_MS = 100;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const sectionNames = [...projects.map((p) => p.name), "CONTACT"] as const;

export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(projects.length, index));
    const startTop = el.scrollTop;
    const targetTop = clamped * window.innerHeight;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (Math.abs(targetTop - startTop) < 1) {
      currentIndexRef.current = clamped;
      setActiveIndex(clamped);
      return;
    }

    isAnimatingRef.current = true;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / SECTION_ANIMATION_MS);
      el.scrollTop = startTop + (targetTop - startTop) * easeInOutCubic(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        isAnimatingRef.current = false;
        cooldownUntilRef.current = performance.now() + WHEEL_COOLDOWN_MS;
        currentIndexRef.current = clamped;
        setActiveIndex(clamped);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (
        isAnimatingRef.current ||
        performance.now() < cooldownUntilRef.current ||
        Math.abs(e.deltaY) < 2
      ) {
        return;
      }
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollToIndex(currentIndexRef.current + direction);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollToIndex]);

  return (
    <>
      <Header overlay />
      <ProjectNav names={sectionNames} activeIndex={activeIndex} onSelect={scrollToIndex} />
      <div
        ref={scrollRef}
        className="no-scrollbar h-screen w-full overflow-y-auto bg-black"
      >
        {projects.map((project) => (
          <ProjectSection key={project.name} {...project} />
        ))}
        <ContactSection images={projects.map((p) => p.image)} />
      </div>
    </>
  );
}
