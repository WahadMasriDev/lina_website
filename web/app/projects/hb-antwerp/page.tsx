"use client";

import { useRef, useState } from "react";
import Header from "../../components/Header";
import FooterLight from "../../components/FooterLight";
import Reveal from "../../components/Reveal";
import ProjectVideo from "../../components/ProjectVideo";

// Rebuilt against the "ready for dev" Figma frame (node 313:1710, "6TH
// PAGE"), fetched via Dev Mode / get_design_context. Like SolCotton, this
// project's own Figma frame is a *light* page -- white background, black
// text throughout (`bg-white` on the root, `text-black` on every text
// node) -- rather than the dark treatment most other project pages use.
// Header stays in its default dark-nav (white text) variant since it's
// composited over the dark hero video, same idea as Cheval Blanc/PSG's
// hero; the footer uses FooterLight to match the page's light background.
//
// Structure straight off the Figma frame: full-bleed looping hero video with
// the header on top, an intro row (title + case-study copy), a 2x2 grid
// of packaging detail shots, two full-width brochure/booklet shots, a
// "Propositions au clients" label + divider, a horizontally scrollable
// strip of four proposal renders, a pair of large gem-shaped box photos,
// and a final full-width strip shot -- then the shared light footer.
const IMG = "/images";

// Same pointer-drag scroller VideoCarousel uses for the "click and drag to
// move" behaviour Nezar wants everywhere there's a horizontal strip -- but
// for plain <img> cards instead of videos, and without the click-suppress
// wiring VideoCarousel needs (these images aren't clickable). `no-scrollbar`
// (globals.css) hides the native scrollbar in every browser; the row still
// scrolls with touch/trackpad, drag is just added on top for desktop mice.
function DragScrollRow({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const [grabbing, setGrabbing] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = startScrollRef.current - (e.clientX - startXRef.current);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setGrabbing(false);
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className={`no-scrollbar flex w-full select-none items-center gap-5 overflow-x-auto px-4 pb-2 sm:px-8 lg:px-[95px] ${
        grabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {children}
    </div>
  );
}

export default function HbAntwerpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-[70px] bg-white">
      {/* Hero -- full-bleed looping video (same real footage the earlier
          hb-antwerp.mp4 block used, already sized for web), header
          composited on top in its default (white-text) variant since the
          footage underneath is dark. Autoplays/loops as soon as the
          loading screen lifts, same as Cheval Blanc/PSG's hero video. */}
      <ProjectVideo
        src="/videos/hb-antwerp.mp4"
        autoPlayOnMount
        aspectClassName="aspect-[1920/1080]"
        overlay={
          <div className="absolute inset-x-0 top-0 z-10 px-4 sm:px-8">
            <Header />
          </div>
        }
      />

      {/* Title + case-study copy, side by side -- same layout every other
          project page's intro row uses, black text for the light page. */}
      <Reveal index={0} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col gap-8 text-black lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="shrink-0">
            <p className="text-2xl font-normal leading-normal">
              THIS IS <span className="font-bold">HB ANTWERP</span>
            </p>
            <p className="mt-1 text-lg font-normal leading-normal text-black/80">
              Luxury diamond company
            </p>
          </div>
          <div className="max-w-[695px] text-base font-normal leading-normal text-black/80 text-justify">
            <p>
              Conception d&rsquo;une série de coffrets transformant six
              diamants en objets de collection. Inspirés du diamant brut,
              de l&rsquo;architecture et des jeux de lumière, les concepts
              Hexaline, Vault Drop et Timeless Reflection explorent
              différentes façons de révéler chaque pierre. J&rsquo;ai
              développé la direction créative, le design des coffrets et
              les visualisations 3D finales, de la conception des formes
              et matériaux jusqu&rsquo;aux mécanismes d&rsquo;ouverture et
              aux systèmes d&rsquo;éclairage.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Packaging detail shots -- 2x2 grid matching Figma's "Project
          Container" (two rows of two images each). */}
      <Reveal index={1} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/hb-antwerp-box-open-1.jpg`}
            alt="HB Antwerp coffret, ouvert"
            className="aspect-[817/466] w-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/hb-antwerp-box-open-2.jpg`}
            alt="HB Antwerp coffret, ouvert de face"
            className="aspect-[817/465] w-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/hb-antwerp-boxes-pair.jpg`}
            alt="HB Antwerp coffrets, duo"
            className="aspect-[812/453] w-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/hb-antwerp-boxes-stacked.jpg`}
            alt="HB Antwerp coffrets, empilés"
            className="aspect-[817/454] w-full object-cover"
          />
        </div>
      </Reveal>

      {/* Booklet spreads -- two full-width shots, matching Figma's two
          stacked Rectangle blocks. */}
      <Reveal index={2} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/hb-antwerp-booklet-closed.jpg`}
            alt="HB Antwerp, livret fermé"
            className="w-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/hb-antwerp-booklet-open.jpg`}
            alt="HB Antwerp, livret ouvert"
            className="w-full object-cover"
          />
        </div>
      </Reveal>

      {/* "Propositions au clients" label + hairline divider, right-aligned
          per Figma's "Proposals Section" (342:2233). */}
      <Reveal index={3} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-end gap-3">
          <p className="text-base text-black">Propositions au clients</p>
          <div className="h-px w-[170px] bg-black/20" />
        </div>
      </Reveal>

      {/* Proposal renders -- horizontally scrollable strip, matching
          Figma's "Proposals Images" carousel row (four renders, all
          visible/draggable rather than one-at-a-time). */}
      <Reveal index={4} className="w-full">
        <DragScrollRow>
          {[
            { src: "hb-antwerp-proposal-1.jpg", alt: "HB Antwerp, proposition bois" },
            { src: "hb-antwerp-proposal-2.jpg", alt: "HB Antwerp, proposition graphique" },
            { src: "hb-antwerp-proposal-3.jpg", alt: "HB Antwerp, proposition marqueterie" },
            { src: "hb-antwerp-proposal-4.jpg", alt: "HB Antwerp, proposition facettée" },
          ].map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.src}
              src={`${IMG}/${img.src}`}
              alt={img.alt}
              draggable={false}
              className="h-[380px] w-auto shrink-0 object-cover"
            />
          ))}
        </DragScrollRow>
      </Reveal>

      {/* Final gem-shaped packaging shots -- a large side-by-side pair,
          then a full-width strip, matching Figma's closing "Project Image
          Group". */}
      <Reveal index={5} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-9">
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/hb-antwerp-gem-lit.jpg`}
              alt="HB Antwerp, coffret facetté éclairé"
              className="aspect-[832/825] w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/hb-antwerp-gem-closed.jpg`}
              alt="HB Antwerp, coffret facetté fermé"
              className="aspect-[805/825] w-full object-cover"
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/hb-antwerp-gem-trio.jpg`}
            alt="HB Antwerp, coffrets facettés, trio"
            className="aspect-[1332/480] w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal index={6} className="w-full pb-[31px]">
        <FooterLight />
      </Reveal>
    </div>
  );
}
