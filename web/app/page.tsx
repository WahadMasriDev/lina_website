"use client";

import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";
import ContactSection from "./components/ContactSection";

// Real assets now exist for every project, including PSG (still stills
// only, no video -- its card just doesn't get the hover-video treatment,
// same as every other project's own photo-at-rest state). All six now
// link to a real detail page.
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
    video: "/videos/solcotton.mp4",
    name: "SOLCOTTON",
    subtitle: "Marque de cotton de luxe",
    href: "/projects/solcotton",
  },
  {
    image: "/images/bose-beijing.png",
    video: "/videos/bose-beijing.mp4",
    name: "BOSE X BEIJING",
    subtitle: "Interior design in Beijing",
    href: "/projects/bose-beijing",
  },
  {
    image: "/images/mcintosh-virgil-abloh.png",
    video: "/videos/mcintosh-abloh.mp4",
    name: "MCINTOSH X VIRGIL ABLOH",
    subtitle: "Exposition au Grand Palais de Paris",
    href: "/projects/mcintosh-abloh",
  },
  {
    image: "/images/psg-maison-shanghai.png",
    name: "PSG X LA MAISON SHANGHAI",
    subtitle: "International activation & interior design",
    href: "/projects/psg-maison-shanghai",
  },
  {
    image: "/images/hb-antwerp.png",
    video: "/videos/hb-antwerp.mp4",
    name: "HB ANTWERP",
    subtitle: "Luxury diamond company",
    href: "/projects/hb-antwerp",
  },
] as const;

// Reverted back to match the Figma source of truth (node 127:568,
// "Landing") to the letter: a plain, continuously-scrolling stacked page
// -- no wheel-jacked full-screen paging, no side dot navigator (neither
// exists in the design). The header sits static at the top, inside the
// same padding as everything else, and scrolls away normally instead of
// staying pinned. Spacing matches Figma exactly: 31px of black padding
// around the whole page, 20px between every stacked block -- the same
// convention the Cheval Blanc detail page already uses.
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-5 bg-black px-4 pt-[31px] pb-[31px] sm:px-8">
      <Header />

      <div className="flex w-full flex-col gap-5">
        {projects.map((project) => (
          <ProjectSection key={project.name} {...project} />
        ))}
      </div>

      <ContactSection images={projects.map((p) => p.image)} />
    </div>
  );
}
