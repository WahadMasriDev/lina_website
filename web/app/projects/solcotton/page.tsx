"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import ProjectVideo from "../../components/ProjectVideo";

// Same structural pattern as the Cheval Blanc detail page: hero, main
// video, two supporting stills, footer -- built from the real assets in
// web/assets/SOLCOTTON/.
export default function SolCottonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-5 bg-black px-4 pt-[31px] pb-[31px] sm:px-8">
      <Header />

      <div className="flex w-full flex-col gap-5">
        <Reveal index={0}>
          <section className="relative w-full aspect-[1864/978] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/solcotton.png"
              alt="SolCotton"
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
                THIS IS <span className="font-bold">SOLCOTTON</span>
              </p>
              <p className="mt-2 whitespace-nowrap text-base font-normal leading-normal text-white/90 md:text-[24px] md:leading-[29px]">
                Marque de cotton de luxe
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal index={1}>
          <ProjectVideo src="/videos/solcotton.mp4" pressAnimation />
        </Reveal>

        <Reveal index={2}>
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/solcotton-2.jpg"
              alt="SolCotton detail"
              className="w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/solcotton-3.jpg"
              alt="SolCotton detail"
              className="w-full object-cover"
            />
          </div>
        </Reveal>
      </div>

      <Reveal index={3} className="w-full">
        <Footer />
      </Reveal>
    </div>
  );
}
