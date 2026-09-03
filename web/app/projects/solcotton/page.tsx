"use client";

import Header from "../../components/Header";
import FooterLight from "../../components/FooterLight";
import Reveal from "../../components/Reveal";

// Rebuilt against the "ready for dev" Figma frame (node 313:639). Unlike
// every other project page, SolCotton's own Figma frame is a *light* page
// -- white background, black text and a black logo throughout (confirmed
// via get_design_context: `bg-white` on the root, `text-black` on every
// text node) -- not the dark treatment the rest of the site uses. It's a
// full-bleed hero photo, an intro row (title + case-study copy), and a
// stack of full-width/paired product and lifestyle shots before a
// light-themed footer (FooterLight, since the shared Footer is dark-only).
const IMG = "/images";

export default function SolCottonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-[70px] bg-white">
      {/* Hero -- full-bleed, header composited on top in its light (black
          text/logo) variant since the hero itself is a light product
          render, not a dark photo. */}
      <div className="relative w-full aspect-[1921.63/1017.55] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/solcotton.png`}
          alt="SolCotton packaging"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 z-10 px-4 sm:px-8">
          <Header light />
        </div>
      </div>

      {/* Title + case-study copy, side by side -- same layout Cheval
          Blanc's intro row uses, just black text instead of white. */}
      <Reveal index={0} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col gap-8 text-black lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="shrink-0">
            <p className="text-2xl font-normal leading-normal">
              THIS IS <span className="font-bold">SOL COTTON</span>
            </p>
            <p className="mt-1 text-lg font-normal leading-normal text-black/80">
              Marque de cotton de luxe
            </p>
          </div>
          <div className="max-w-[695px] text-base font-normal leading-normal text-black/80 text-justify">
            <p>
              Pour Sol Cotton, mon travail s&rsquo;est principalement concentré
              sur la conception et la réalisation du packaging, avec
              l&rsquo;objectif de traduire l&rsquo;univers de la marque à
              travers une identité plus premium, cohérente et reconnaissable.
            </p>
            <p className="mt-4">
              J&rsquo;ai également proposé une piste de refonte du logo et du
              monogramme, intégrant la notion de coton dans le «&nbsp;O&nbsp;».
              Cette proposition a beaucoup plu au client, même si elle
              n&rsquo;a finalement pas été retenue, la marque ayant préféré
              conserver son identité existante pour des raisons de budget.
            </p>
            <p className="mt-4">
              Enfin, j&rsquo;ai participé à la session photo, en contribuant
              à la mise en scène et à la cohérence visuelle des contenus
              produits pour la marque.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Image collection: full-width shot, a side-by-side pair, three more
          full-width shots -- matches Figma's "Image Collection" (313:650)
          image-for-image, including its 33px gap. */}
      <Reveal index={1} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col items-center gap-[33px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/solcotton-bathroom.jpg`}
            alt="SolCotton, bathroom scene"
            className="w-full object-cover"
          />

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/solcotton-model-1.jpg`}
              alt="SolCotton, model portrait"
              className="aspect-[818/897] w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/solcotton-model-2.jpg`}
              alt="SolCotton, model portrait"
              className="aspect-[816/902] w-full object-cover"
            />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/solcotton-cotton-field.jpg`}
            alt="Raw cotton"
            className="w-full object-cover"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/solcotton-detail.jpg`}
            alt="SolCotton product detail"
            className="w-full object-cover"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/solcotton-boxes-stacked.jpg`}
            alt="SolCotton packaging, stacked"
            className="w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal index={2} className="w-full px-4 pb-[31px] sm:px-8">
        <FooterLight />
      </Reveal>
    </div>
  );
}
