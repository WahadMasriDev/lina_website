"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";
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
// normally) is a full-screen scroll-snap experience: each project takes
// the whole viewport and scrolling jumps cleanly to the next one, using
// native CSS scroll-snap (plus `scroll-smooth` so momentum into a snap
// point eases rather than hard-cuts) for the "stuck, then a smooth jump"
// feel rather than hijacking wheel events by hand.
//
// The header lives outside the snap flow entirely now -- a fixed overlay
// whose look is driven by scroll position/direction on the container
// below it: solid black at rest at the very top, gone once you're inside
// a project, and a small floating translucent pill when you scroll back
// up a little without reaching the top again.
export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef(0);
  const [headerMode, setHeaderMode] = useState<"full" | "floating" | "hidden">(
    "full"
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const top = el.scrollTop;
      const goingUp = top < lastScrollTop.current;
      lastScrollTop.current = top;

      if (top < 40) {
        setHeaderMode("full");
      } else if (goingUp) {
        setHeaderMode("floating");
      } else {
        setHeaderMode("hidden");
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header overlay mode={headerMode} />
      <div
        ref={scrollRef}
        className="h-screen w-full snap-y snap-mandatory scroll-smooth overflow-y-auto bg-black"
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
