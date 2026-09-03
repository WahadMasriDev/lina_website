"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import ProjectVideo from "../../components/ProjectVideo";

// Rebuilt against the "ready for dev" Figma frame (node 345:2540, "4TH
// PAGE") -- the standard dark treatment every other project page but
// SolCotton/Bose x Beijing uses (bg-black, white text). Structure: a
// full-bleed HERO VIDEO (not a static photo -- per Nezar's explicit
// direction, "the first element is a video too") with the header
// composited on top and autoplaying as soon as the page is ready, same
// treatment as Cheval Blanc's hero; an intro row (title + case-study
// copy, justified like every other project page); then the three real
// exhibition photos Figma's own screenshots reference -- the walking
// shot, the McIntosh equipment close-up, and the blurred-figure/orange-
// graphic pair -- grouped with Figma's own tight 47px rhythm between
// them (313:1533-style "Image Collection" pattern, inset to the page's
// side margins rather than full-bleed, matching Figma's own ~116px
// inset); and the shared footer.
const IMG = "/images";

export default function McIntoshAblohPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-[70px] bg-black">
      {/* Hero video -- full-bleed, header composited on top, autoplaying
          immediately (ProjectVideo's autoPlayOnMount) rather than only
          on hover, same treatment as Cheval Blanc's hero. */}
      <ProjectVideo
        src="/videos/mcintosh-abloh.mp4"
        pressAnimation
        autoPlayOnMount
        aspectClassName="aspect-[1920/1002]"
        overlay={
          <div className="absolute inset-x-0 top-0 z-10 px-4 sm:px-8">
            <Header />
          </div>
        }
      />

      {/* Title + case-study copy, side by side -- same layout every
          other project page uses. */}
      <Reveal index={0} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col gap-8 text-white lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="shrink-0">
            <p className="text-2xl font-normal leading-normal">
              THIS IS{" "}
              <span className="font-bold">MCINTOSH X VIRGIL ABLOH</span>
            </p>
            <p className="mt-1 text-lg font-normal leading-normal text-white/90">
              Exposition au Grand Palais de Paris
            </p>
          </div>
          <div className="max-w-[695px] text-base font-normal leading-normal text-white/90 text-justify">
            <p>
              ReflexGroup s&rsquo;est associé à McIntosh et aux Virgil
              Abloh Archives à l&rsquo;occasion de l&rsquo;exposition
              Virgil Abloh: The Codes au Grand Palais à Paris.
            </p>
            <p className="mt-4">
              De mon côté, j&rsquo;ai travaillé sur la scénographie
              autour du prototype unique de Virgil Abloh, ainsi que sur
              la création et le développement de plusieurs contenus
              visuels destinés à la communication de l&rsquo;exposition,
              notamment la photographie et le hero video pour les
              réseaux sociaux.
            </p>
          </div>
        </div>
      </Reveal>

      {/* The three real exhibition photos -- walking shot, equipment
          close-up, then the blurred-figure/orange-graphic pair -- Figma's
          own tight 47px rhythm between them, inset to the page's side
          margins (matches Figma's own ~116px inset, not full-bleed). */}
      <Reveal index={1} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-[47px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/mcintosh-abloh-exhibit.jpg`}
            alt="McIntosh x Virgil Abloh, exhibition visitors"
            className="aspect-[1688/1171] w-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/mcintosh-abloh-3.jpg`}
            alt="McIntosh x Virgil Abloh, amplifier detail"
            className="aspect-[1688/1685] w-full object-cover"
          />
          <div className="flex w-full flex-col items-center gap-[23px] sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/mcintosh-abloh-pedestal.jpg`}
              alt="McIntosh x Virgil Abloh, prototype on display"
              className="aspect-[2/3] w-full min-w-0 flex-1 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/mcintosh-abloh-orange.jpg`}
              alt="McIntosh x Virgil Abloh, exhibition graphics"
              className="aspect-[2/3] w-full min-w-0 flex-1 object-cover"
            />
          </div>
        </div>
      </Reveal>

      <Reveal index={2} className="w-full px-4 pb-[31px] sm:px-8">
        <Footer />
      </Reveal>
    </div>
  );
}
