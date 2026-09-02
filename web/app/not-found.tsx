import Link from "next/link";
import Header from "./components/Header";

// Renders automatically for any route with no page.tsx -- including
// "/web-artifacts-builder", the deliberate placeholder every not-yet-built
// link on the site (nav items, comingSoon project cards) points at for
// now. Styled to match the rest of the site rather than a bare Next.js
// default: same Header, same dark canvas, and the same quiet, considered
// typography ContactSection and the project cards' "Coming soon"
// treatment already use, so landing here reads as "this part isn't built
// yet" rather than "you broke something." No Footer -- kept deliberately
// spare, just the header and the message. The header shows the full
// "LINA ZAKARIA" wordmark statically rather than the icon-only/hover
// treatment used elsewhere -- there's no hero content underneath here
// competing for attention, so the name can just sit there.
//
// A dimmed photo backdrop was tried here and reverted -- flat black is
// what was actually wanted. The one real issue was a subtle radial
// vignette that used to sit on <main> only: since it started right at
// the top of <main>, exactly where the header ends, it read as a visible
// seam -- the header's flat black meeting a slightly lighter patch right
// below it. Removed entirely so the black is flat and continuous behind
// the header all the way down, no seam.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header staticLogo />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-8">
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
