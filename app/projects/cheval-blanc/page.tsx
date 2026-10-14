"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import ProjectVideo from "../../components/ProjectVideo";
import VideoCarousel from "../../components/VideoCarousel";

// Rebuilt against the "ready for dev" Figma frame (node 313:211), which
// supersedes the earlier draft this page was built from. Real structural
// differences from before:
//  - The hero is full-bleed (no side padding), with the header composited
//    directly on top of the video instead of sitting in its own padded
//    row above it.
//  - There's a real case-study paragraph next to the title now (below),
//    which didn't exist in the earlier draft.
//  - The carousel sits directly under that intro row -- the old separate
//    "video 1 / video 2" blocks aren't part of this design at all.
//  - The closing image sequence is a specific 4-photo collage plus two
//    full-width shots, not a generic two-up grid.
const IMG = "/images/cheval-blanc";

const CAROUSEL_VIDEOS = [
  "/videos/cheval-blanc-carousel/1-birthday.mp4",
  "/videos/cheval-blanc-carousel/2-earth-day.mp4",
  "/videos/cheval-blanc-carousel/3-valentines.mp4",
  "/videos/cheval-blanc-carousel/4-moon-festival.mp4",
  "/videos/cheval-blanc-carousel/5-easter.mp4",
  "/videos/cheval-blanc-carousel/6-cny.mp4",
] as const;

export default function ChevalBlancPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-[70px] bg-black">
      {/* Hero -- full-bleed, header composited on top rather than sitting
          above it. Header renders in its normal (non-overlay) mode --
          this wrapper is what handles positioning it over the video --
          so it scrolls away with the rest of the page like every other
          project detail page, it just starts out layered on the video. */}
      <ProjectVideo
        src="/videos/cheval-blanc.mp4"
        pressAnimation
        autoPlayOnMount
        aspectClassName="aspect-[1920/1080]"
        overlay={
          <div className="absolute inset-x-0 top-0 z-10 px-4 sm:px-8">
            <Header />
          </div>
        }
      />

      {/* Title + real case-study copy, side by side. */}
      <Reveal index={0} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col gap-8 text-white lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="shrink-0">
            <p className="text-2xl font-normal leading-normal">
              THIS IS <span className="font-bold">CHEVAL BLANC</span>
            </p>
            <p className="mt-1 text-lg font-normal leading-normal text-white/90">
              Hotel de luxe à la samaritaine, LVMH
            </p>
          </div>
          <div className="max-w-[695px] text-base font-normal leading-normal text-white/90 text-justify">
            <p>
              Dans le cadre d&rsquo;un pitch réunissant plusieurs agences,
              Cheval Blanc nous a invités à imaginer une direction créative
              autour du thème du rêve. J&rsquo;ai proposé une direction
              artistique inspirée des constellations, que j&rsquo;ai ensuite
              développée et explorée en 3D.
            </p>
            <p className="mt-4">
              Cette proposition a été particulièrement appréciée et nous a
              permis de remporter le pitch.
            </p>
            <p className="mt-4">
              À la suite de cette première campagne, ReflexGroup s&rsquo;est
              vu confier les différentes prises de parole de Cheval Blanc
              tout au long de l&rsquo;année: Ramadan, Journée internationale
              des femmes, Earth Day, entre autres&nbsp;; pour lesquelles
              j&rsquo;ai participé à la conception et réalisé seule les
              univers et animations 3D.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Seasonal campaign carousel -- full-bleed, draggable, matching
          Figma's Cards group (313:294) card-for-card. */}
      <Reveal index={1} className="w-full">
        <VideoCarousel videos={CAROUSEL_VIDEOS} />
      </Reveal>

      {/* Closing sequence: full-width shot, a 4-photo collage, another
          full-width shot -- matches Figma's "Vertical group" (313:215). */}
      <Reveal index={2} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-11">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/cards-marble.jpg`}
            alt="Cheval Blanc printed cards on marble"
            className="w-full object-cover"
          />

          {/* The collage: one portrait shot offset right, two stacked
              shots further right, and a big block anchoring the bottom
              left -- an approximation of Figma's specific asymmetric
              layout using a responsive grid rather than literal
              absolute coordinates. */}
          <div className="grid w-full grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-5 sm:col-start-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${IMG}/card-spiral.jpg`}
                alt="Cheval Blanc card detail"
                className="w-full object-cover"
              />
            </div>
            <div className="col-span-12 sm:col-span-4 sm:col-start-9 sm:mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${IMG}/book-open-1.jpg`}
                alt="Cheval Blanc booklet, open"
                className="w-full object-cover"
              />
            </div>
            <div className="col-span-12 sm:col-span-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${IMG}/cards-trio.jpg`}
                alt="Cheval Blanc printed cards, trio"
                className="w-full object-cover"
              />
            </div>
            <div className="col-span-12 sm:col-span-4 sm:col-start-9">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${IMG}/book-open-2.jpg`}
                alt="Cheval Blanc booklet, open"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/cards-corner.jpg`}
            alt="Cheval Blanc printed cards, detail"
            className="w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal index={3} className="w-full pb-[31px]">
        <Footer />
      </Reveal>
    </div>
  );
}
