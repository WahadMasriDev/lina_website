"use client";

import Header from "../../components/Header";
import FooterLight from "../../components/FooterLight";
import Reveal from "../../components/Reveal";

// Built against the "ready for dev" Figma frame (node 342:2319, "3RD
// PAGE" / Component3rdPage) -- a light page like SolCotton: white
// background, black text throughout (confirmed via get_design_context:
// `bg-white` on the root). Figma's own text layer reads "BOSE X BEJING"
// (their typo) -- per Nezar's direction the whole project is renamed to
// Beijing everywhere (route, file names, landing card), with the on-page
// copy corrected to "BOSE X BEIJING". Structure: full-bleed hero photo
// with the header composited on top (the hero itself is a dark room
// photo, so the default white-text Header works, unlike SolCotton's
// light variant), an intro row (title + case-study copy), a small "3D
// renders de l'espace" gallery heading with its underline plus one photo,
// a full-width group shot, a side-by-side pair, a full-bleed closing
// shot, two more full-bleed shots leading into the footer, and the
// shared light footer.
const IMG = "/images";

export default function BoseBeijingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-[70px] bg-white">
      {/* Hero -- full-bleed, header composited on top, same treatment as
          Cheval Blanc/PSG's hero. */}
      <div className="relative w-full aspect-[1924.946/1018.104] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/bose-beijing-hero.jpg`}
          alt="Bose x Beijing"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 z-10 px-4 sm:px-8">
          <Header />
        </div>
      </div>

      {/* Title + case-study copy, side by side -- same layout every other
          project page uses. */}
      <Reveal index={0} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col gap-8 text-black lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="shrink-0">
            <p className="text-2xl font-normal leading-normal">
              THIS IS <span className="font-bold">BOSE X BEIJING</span>
            </p>
            <p className="mt-1 text-lg font-normal leading-normal text-black/80">
              Marque audio premium
            </p>
          </div>
          <div className="max-w-[647px] text-base font-normal leading-normal text-black/80 text-justify">
            <p>
              En collaboration avec Arnaud Faverjon, j&rsquo;ai participé à
              la conception de l&rsquo;espace et réalisé sa modélisation 3D
              complète. L&rsquo;expérience faisait converger son, design et
              culture afin de valoriser l&rsquo;univers audio premium de
              Bose, tout en respectant les identités de McIntosh et Sonus
              faber. Les visualisations ont permis de mettre en scène le
              concept et de faciliter sa présentation et sa validation
              auprès du client.
            </p>
          </div>
        </div>
      </Reveal>

      {/* "3D renders de l'espace" -- small heading + underline, then one
          photo -- matches Figma's "Gallery" (342:2341). */}
      <Reveal index={1} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-end gap-[11px]">
          <div className="flex w-fit flex-col items-start">
            <p className="whitespace-nowrap text-base font-normal leading-normal text-black">
              3D renders de l&rsquo;espace
            </p>
            <div className="mt-1 h-px w-full bg-black/30" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/bose-beijing-3d-renders.jpg`}
            alt="Bose x Beijing, 3D renders of the space"
            className="aspect-[1558/872] w-full object-cover"
          />
        </div>
      </Reveal>

      {/* Gallery: full-width group photo, then a side-by-side pair --
          matches Figma's "Gallery Section" (342:2346). */}
      <Reveal index={2} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-[30px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/bose-beijing-gallery-group.jpg`}
            alt="Bose x Beijing, exhibition space"
            className="w-full object-cover"
          />
          <div className="flex w-full items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/bose-beijing-dual-left.jpg`}
              alt="Bose x Beijing, visitors viewing the display"
              className="aspect-[812.381/894.956] w-1/2 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/bose-beijing-dual-right.jpg`}
              alt="Bose x Beijing, McIntosh display detail"
              className="aspect-[813/895] w-1/2 object-cover"
            />
          </div>
        </div>
      </Reveal>

      {/* Full-bleed closing shot -- matches Figma's "Rectangle"
          (342:2352). */}
      <Reveal index={3} className="w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/bose-beijing-phones.jpg`}
          alt="Bose x Beijing, visitors photographing the display"
          className="aspect-[1924.946/648.5] w-full object-cover"
        />
      </Reveal>

      {/* Two more shots leading into the footer, inset to the page's
          side margins like the rest of the content (not full-bleed) --
          matches Figma's "Footer Content" (342:2353). */}
      <Reveal index={4} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-[23px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/bose-beijing-table-display.jpg`}
            alt="Bose x Beijing, product display table"
            className="w-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/bose-beijing-shelf.jpg`}
            alt="Bose x Beijing, audio equipment shelf"
            className="w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal index={5} className="w-full px-4 pb-[31px] sm:px-8">
        <FooterLight />
      </Reveal>
    </div>
  );
}
