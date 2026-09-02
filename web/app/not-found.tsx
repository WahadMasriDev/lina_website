"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "./components/Header";

// Renders automatically for any route with no page.tsx -- including
// "/web-artifacts-builder", the deliberate placeholder every not-yet-built
// link on the site (nav items, comingSoon project cards) points at for
// now. Styled to match the rest of the site rather than a bare Next.js
// default: same Header, same quiet, considered typography ContactSection
// and the project cards' "Coming soon" treatment already use, so landing
// here reads as "this part isn't built yet" rather than "you broke
// something." No Footer -- kept deliberately spare, just the header and
// the message. The header shows the full "LINA ZAKARIA" wordmark
// statically rather than the icon-only/hover treatment used elsewhere --
// there's no hero content underneath here competing for attention, so
// the name can just sit there.
//
// Flat black read as broken rather than intentional -- every other page
// on the site is built around photography, so a page with none of it
// felt like a dead end rather than "coming soon." This uses the same
// slow, dimmed, ever-crossfading background carousel ContactSection
// uses, at a heavier dim since there's no other content to balance
// against, so the site's identity carries through even on its emptiest
// page instead of leaving a plain void.
const BG_IMAGES = [
  "/images/cheval-blanc.png",
  "/images/solcotton.png",
  "/images/bose-bmw.png",
  "/images/psg-maison-shanghai.png",
] as const;
const BG_INTERVAL_MS = 4200;
const BG_CROSSFADE_MS = 2200;
const BG_DIM_OPACITY = 0.85;

export default function NotFound() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((i) => (i + 1) % BG_IMAGES.length);
    }, BG_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header staticLogo />

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-8">
        <div aria-hidden className="absolute inset-0">
          {BG_IMAGES.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
              style={{
                opacity: i === bgIndex ? 1 : 0,
                transitionDuration: `${BG_CROSSFADE_MS}ms`,
              }}
            />
          ))}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: BG_DIM_OPACITY }}
          />
        </div>

        {/* Same quiet top vignette ContactSection and the project cards
            use, layered above the dimmed carousel for a little extra
            depth toward the top edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 55%)",
          }}
        />

        <div className="relative">
          <p className="text-[13px] font-light uppercase tracking-[0.3em] text-white/40">
            Erreur
          </p>

          <h1 className="mt-6 text-[96px] font-light leading-none tracking-[-0.02em] text-white sm:text-[140px]">
            404
          </h1>

          <div className="mx-auto mt-8 h-px w-16 bg-white/30" />

          <p className="mx-auto mt-8 max-w-[420px] text-[15px] font-light leading-[24px] text-[#A8A8AD]">
            Cette page n&apos;existe pas encore.
            <br />
            <span className="font-semibold text-[#E6E6E8]">
              Elle arrive bientôt.
            </span>
          </p>

          <Link
            href="/"
            className="mt-12 inline-block text-[16px] font-light tracking-wide text-white underline decoration-white/40 decoration-1 underline-offset-4 transition-all duration-300 hover:font-semibold hover:decoration-white sm:text-[18px]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
