"use client";

import { useEffect, useRef, useState } from "react";

// The final panel in the landing page's one-screen-at-a-time sequence --
// same full-bleed, full-height treatment as every ProjectSection, so
// reaching it doesn't feel like falling out of the experience into a
// bolted-on footer. A plain <footer> at this level of "luxury" styling
// read as an afterthought; this gives contact its own quiet, considered
// moment instead, with the legal/nav row folded into the bottom of it.
//
// Reveal is a simple one-time fade/rise on scroll-in -- deliberately NOT
// the heavier dim/wave/transfer choreography ProjectSection uses for
// project intros. That sequence is specifically an "introduction" to a
// body of work; this is closing copy, so it should feel calmer.
const REVEAL_DURATION_MS = 900;

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          setShown(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex h-screen w-full shrink-0 flex-col justify-between overflow-hidden bg-black px-4 pb-8 pt-[140px] sm:px-8 sm:pb-10"
    >
      {/* Same quiet vignette language as the project cards, just resting
          rather than sitting over a photo -- keeps the palette consistent
          without needing a new asset for this section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 55%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center text-center">
        <div
          className="transition-all ease-out"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(24px)",
            transitionDuration: `${REVEAL_DURATION_MS}ms`,
            transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
          }}
        >
          <h2 className="text-[40px] font-light uppercase leading-[1.05] tracking-[0.02em] text-white sm:text-[56px] md:text-[72px]">
            Travaillons ensemble ?
          </h2>

          <div className="mx-auto mt-8 h-px w-16 bg-white/30" />

          <p className="mx-auto mt-8 max-w-[480px] text-[15px] font-light leading-[24px] text-[#A8A8AD]">
            Je suis à votre disposition pour toute information
            <br />
            <span className="font-semibold text-[#E6E6E8]">
              du lundi au samedi, de 10h00 à 19h00.
            </span>
          </p>

          <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-14">
            <a
              href="mailto:lina.zakariaa@gmail.com"
              className="text-[16px] font-light tracking-wide text-white underline decoration-white/40 decoration-1 underline-offset-4 transition-all duration-300 hover:font-semibold hover:decoration-white sm:text-[18px]"
            >
              lina.zakariaa@gmail.com
            </a>
            <a
              href="tel:+33975181509"
              className="text-[16px] font-light tracking-wide text-white underline decoration-white/40 decoration-1 underline-offset-4 transition-all duration-300 hover:font-semibold hover:decoration-white sm:text-[18px]"
            >
              +33 9 75 18 15 09
            </a>
            <a
              href="https://wa.me/33975181509"
              className="text-[16px] font-light tracking-wide text-white underline decoration-white/40 decoration-1 underline-offset-4 transition-all duration-300 hover:font-semibold hover:decoration-white sm:text-[18px]"
            >
              WhatsApp
            </a>
          </div>

          <div className="mt-14 flex items-center justify-center gap-6">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-white/60 transition-colors hover:text-white"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://wa.me/33975181509"
              aria-label="WhatsApp"
              className="text-white/60 transition-colors hover:text-white"
            >
              <WhatsAppIcon />
            </a>
            <a
              href="mailto:lina.zakariaa@gmail.com"
              aria-label="Email"
              className="text-white/60 transition-colors hover:text-white"
            >
              <MailIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1100px] items-center justify-center border-t border-white/10 pt-6">
        <p className="text-[12px] leading-4 text-[#7A7A80]">
          © Lina Zakaria — Tous droits réservés
        </p>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
      <rect x="1" y="1" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13" cy="13" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="6" r="1.3" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M7.5 18.5 8.5 15C7.7 13.8 7.4 12.4 7.6 11 7.9 7.9 10.8 5.6 14 5.9c3.1.3 5.4 3 5.1 6.1-.3 3.1-3.1 5.4-6.3 5.1-1-.1-2-.5-2.8-1Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
      <rect x="1" y="1" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6" y="9" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 9.5 13 14.5l6.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
