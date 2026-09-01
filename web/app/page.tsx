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
// normally) is a full-screen, one-project-at-a-time experience. Native
// scroll-snap turned out to feel too abrupt (a hard cut rather than a
// glide), so wheel/trackpad input is intercepted here and paged by hand:
// each tick moves exactly one section, eased in with a slow, deliberate
// easeInOutCubic over SECTION_ANIMATION_MS, and further input is ignored
// until that glide finishes. Touch scrolling is left to the browser's own
// (still snap-mandatory) behaviour.
//
// The header is a persistent, full-bleed frosted bar pinned to the top --
// same look at all times, on every project (see Header.tsx). The native
// scrollbar is hidden in favour of ProjectNav, a small dot column on the
// right that tracks the active section and jumps to any other on click.
const SECTION_ANIMATION_MS = 1500;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const sectionNames = [...projects.map((p) => p.name), "CONTACT"] as const;

export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
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
      if (isAnimatingRef.current || Math.abs(e.deltaY) < 2) return;
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
        className="no-scrollbar h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black"
      >
        {projects.map((project) => (
          <ProjectSection key={project.name} {...project} />
        ))}
        <div className="snap-start px-4 pb-[31px] sm:px-8">
          <Footer />
        </div>
      </div>
    </>
  );
}
