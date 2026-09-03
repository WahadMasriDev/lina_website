"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import Carousel from "../../components/Carousel";

// Built against the "ready for dev" Figma frame (node 313:1411, "5TH
// PAGE") -- the standard dark treatment every other project page but
// SolCotton uses (bg-black, white text), confirmed via get_design_context.
// Structure: full-bleed hero photo with the header composited on top, an
// intro row (title + case-study copy + a "Read more" affordance -- no
// extra copy exists to expand into, so like the other placeholder nav
// items it just points at the site's placeholder route), a full-bleed,
// full-size autoplaying carousel (swipe/drag also works) cycling through
// the interior renders one at a time -- per Nezar's feedback this section
// is a carousel in the real design, not the static two-up row Figma's
// flat export first suggested -- then the same "Image Collection" shape
// SolCotton uses: one full-width shot, a row of four narrower photos, a
// pair of two, a final full-width shot, and the shared footer.
const IMG = "/images";

export default function PsgMaisonShanghaiPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-[70px] bg-black">
      {/* Hero -- full-bleed, header composited on top, same treatment as
          Cheval Blanc/SolCotton's hero. */}
      <div className="relative w-full aspect-[1922.57/1043.11] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/psg-hero.jpg`}
          alt="PSG x La Maison Shanghai"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 z-10 px-4 sm:px-8">
          <Header />
        </div>
      </div>

      {/* Title + case-study copy, side by side -- same layout SolCotton's
          intro row uses. The "Read more" affordance has no further copy
          behind it in the design, so it's a placeholder link like the
          Header's own ABOUT/PERSONAL PLAYGROUND items. */}
      <Reveal index={0} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col gap-8 text-white lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="shrink-0">
            <p className="text-2xl font-normal leading-normal">
              THIS IS{" "}
              <span className="font-bold">PSG X LA MAISON SHANGHAI</span>
            </p>
            <p className="mt-1 text-lg font-normal leading-normal text-white/90">
              International activation &amp; interior design
            </p>
          </div>
          <div className="max-w-[647px] text-base font-normal leading-normal text-white/90">
            <p>
              ICI C&rsquo;EST PARIS — La Maison Shanghai est une activation
              internationale imaginée par le Paris Saint-Germain pour faire
              rayonner l&rsquo;univers culturel du club au-delà du football.
              Pensée comme un lieu de vie temporaire mêlant sport, art,
              musique, mode et gastronomie, l&rsquo;édition de Shanghai
              repose sur le dialogue entre deux villes&nbsp;: l&rsquo;identité
              architecturale du Parc des Princes rencontre la verticalité et
              l&rsquo;énergie urbaine de Shanghai. Les volumes se déploient
              dans l&rsquo;espace, les perspectives se croisent et
              l&rsquo;architecture devient le support d&rsquo;une fusion
              culturelle entre Paris et la scène locale.
            </p>
            <a
              href="/404"
              className="mt-6 inline-block border-b border-white/70 text-base italic leading-normal hover:opacity-70"
            >
              Read more
            </a>
          </div>
        </div>
      </Reveal>

      {/* Full-bleed, full-size carousel -- one interior render at a time,
          autoplaying with swipe/drag support, replacing the static
          side-by-side "Frame 21" pair. */}
      <Reveal index={1} className="w-full">
        <Carousel
          images={[
            {
              src: `${IMG}/psg-shot-1.jpg`,
              alt: "PSG x La Maison Shanghai, interior render",
            },
            {
              src: `${IMG}/psg-shot-2.jpg`,
              alt: "PSG x La Maison Shanghai, interior render",
            },
          ]}
          className="aspect-[16/9]"
        />
      </Reveal>

      {/* Image collection: full-width shot, a row of four narrower photos,
          a pair of two, a final full-width shot -- matches Figma's "Frame
          18" (313:1533) image-for-image. */}
      <Reveal index={2} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/psg-full-1.jpg`}
            alt="PSG x La Maison Shanghai, wide interior shot"
            className="w-full object-cover"
          />

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/psg-strip-1.jpg`}
              alt="PSG x La Maison Shanghai, detail"
              className="aspect-[397/608] w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/psg-strip-2.jpg`}
              alt="PSG x La Maison Shanghai, detail"
              className="aspect-[394/605] w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/psg-strip-3.jpg`}
              alt="PSG x La Maison Shanghai, detail"
              className="aspect-[393/607] w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/psg-strip-4.jpg`}
              alt="PSG x La Maison Shanghai, detail"
              className="aspect-[398/604] w-full object-cover"
            />
          </div>

          <div className="flex w-full flex-col items-center gap-5 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/psg-pair-1.jpg`}
              alt="PSG x La Maison Shanghai, interior render"
              className="aspect-[979.05/784.42] w-full object-cover sm:w-[60.5%]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/psg-pair-2.jpg`}
              alt="PSG x La Maison Shanghai, on-site photo"
              className="aspect-[628/784] w-full object-cover sm:w-[38.5%]"
            />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/psg-full-2.jpg`}
            alt="PSG x La Maison Shanghai, wide interior shot"
            className="w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal index={3} className="w-full px-4 pb-[31px] sm:px-8">
        <Footer />
      </Reveal>
    </div>
  );
}
