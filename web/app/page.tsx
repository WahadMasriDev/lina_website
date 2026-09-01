"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";
import ProjectNav from "./components/ProjectNav";
import Footer from "./components/Footer";

// Projects with more than one usable photo in their assets folder get a
// hover montage (crossfading through the extra shots, never re-showing the
// thumbnail itself) as a stand-in for a real video. McIntosh and HB Antwerp
// only ever had the one landing photo -- marked comingSoon until real
// assets show up. Infiniment Coty isn't happening, so it's not listed here.
// `href` only exists on Cheval Blanc for now -- that's the only project
// with a real detail page built; the others don't link anywhere yet.
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
    images: ["/images/solcotton-2.jpg", "/images/solcotton-3.jpg"],
    name: "SOLCOTTON",
    subtitle: "Marque de cotton de luxe",
  },
  {
    image: "/images/bose-bmw.png",
    images: ["/images/bose-bmw-2.jpg", "/images/bose-bmw-3.jpg"],
    name: "BOSE X BMW",
    subtitle: "Interior design in Bejing",
  },
  {
    image: "/images/mcintosh-virgil-abloh.png",
    name: "MCINTOSH X VIRGIL ABLOH",
    subtitle: "Exposition au Grand Palais de Paris",
    comingSoon: true,
  },
  {
    image: "/images/psg-maison-shanghai.png",
    images: [
      "/images/psg-maison-shanghai-2.jpg",
      "/images/psg-maison-shanghai-3.jpg",
    ],
    name: "PSG X LA MAISON SHANGHAI",
    subtitle: "Interior design project",
  },
  {
    image: "/images/hb-antwerp.png",
    name: "HB ANTWERP",
    subtitle: "Luxury diamond company",
    comingSoon: true,
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
const SECTION_ANIMATION_MS = 1500;
const WHEEL_COOLDOWN_MS = 350;

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
        <div className="px-4 pb-[31px] sm:px-8">
          <Footer />
        </div>
      </div>
    </>
  );
}
