"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import ProjectVideo from "../../components/ProjectVideo";

// Real Cheval Blanc assets found in web/assets/CHEVAL BLANC/. Only 6
// usable stills exist there today (plus the 2 campaign videos below), so
// this sequence uses everything that's real rather than padding out to
// match every placeholder slot in the Figma mock. Swap/add images as more
// real assets come in -- see web/assets/CHEVAL BLANC/.
const IMG = "/images/cheval-blanc";

export default function ChevalBlancPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-5 bg-black px-4 pt-[31px] pb-[31px] sm:px-8">
      <Header />

      <div className="flex w-full flex-col gap-5">
        {/* Hero */}
        <Reveal index={0}>
          <section className="relative w-full aspect-[1864/978] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cheval-blanc.png"
              alt="Cheval Blanc"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3 mix-blend-multiply"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.55) 45%, transparent 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-10 px-4 text-white sm:bottom-16 sm:px-8 md:bottom-20">
              <p className="text-xl font-normal sm:text-2xl md:text-[33.256px] md:leading-[40px]">
                THIS IS <span className="font-bold">CHEVAL BLANC</span>
              </p>
              <p className="mt-2 whitespace-nowrap text-base font-normal leading-normal text-white/90 md:text-[24px] md:leading-[29px]">
                Hotel de luxe à la samaritaine, LVMH
              </p>
            </div>
          </section>
        </Reveal>

        {/* Video 1 -- the one with the press animation */}
        <Reveal index={1}>
          <ProjectVideo src="/videos/cheval-blanc.mp4" pressAnimation />
        </Reveal>

        {/* Video 2 */}
        <Reveal index={2}>
          <ProjectVideo src="/videos/cheval-blanc-2.mp4" />
        </Reveal>

        {/* Big wide shot */}
        <Reveal index={3}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/cards-marble.jpg`}
            alt="Cheval Blanc printed cards on marble"
            className="w-full object-cover"
          />
        </Reveal>

        {/* Centered single shot */}
        <Reveal index={4}>
          <div className="flex w-full justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/card-spiral.jpg`}
              alt="Cheval Blanc card detail"
              className="w-full max-w-md object-cover sm:max-w-lg"
            />
          </div>
        </Reveal>

        {/* Two-up: book pages */}
        <Reveal index={5}>
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/book-open-1.jpg`}
              alt="Cheval Blanc booklet, open"
              className="w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/book-open-2.jpg`}
              alt="Cheval Blanc booklet, open"
              className="w-full object-cover"
            />
          </div>
        </Reveal>

        {/* Two-up: card details */}
        <Reveal index={6}>
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/cards-trio.jpg`}
              alt="Cheval Blanc printed cards, trio"
              className="w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/cards-corner.jpg`}
              alt="Cheval Blanc printed cards, detail"
              className="w-full object-cover"
            />
          </div>
        </Reveal>
      </div>

      <Reveal index={7} className="w-full">
        <Footer />
      </Reveal>
    </div>
  );
}
