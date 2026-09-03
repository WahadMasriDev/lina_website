import Link from "next/link";
import {
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
  InstagramIcon,
  LinkedInIcon,
  BehanceIcon,
} from "./Footer";

// Same "footer 1" Figma layout as the shared dark Footer, but rebuilt for
// SolCotton's light page (node 313:664 in the "ready for dev" frame): white
// background, black text throughout instead of the site's usual dark
// palette. Kept as its own component rather than a `light` prop on Footer
// so every other project page's dark footer is untouched.
export default function FooterLight() {
  return (
    <footer className="flex w-full flex-col items-stretch gap-6 px-4 py-10 sm:gap-[23px] sm:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold leading-6 text-black">
          CONTACTEZ MOI
        </h2>
      </div>

      <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[737px]">
          <div className="h-[2px] w-8 bg-black" />
          <p className="mt-4 max-w-[400px] text-[15px] leading-[18px] text-black/70">
            Je suis à votre disposition pour toute information du lundi au
            samedi, de 10h00 à 19h00.
          </p>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-[77px]">
            <a
              href="mailto:lina.zakariaa@gmail.com"
              className="flex items-center gap-2 text-[14px] leading-[17px] text-black hover:opacity-70"
            >
              <MailIcon />
              lina.zakariaa@gmail.com
            </a>
            <a
              href="tel:+33975181509"
              className="flex items-center gap-2 text-[14px] leading-[17px] text-black hover:opacity-70"
            >
              <PhoneIcon />
              +33 9 75 18 15 09
            </a>
            <a
              href="https://wa.me/33975181509"
              className="flex items-center gap-2 text-[14px] leading-[17px] text-black/70 hover:opacity-70"
            >
              <WhatsAppIcon />
              WhatsApp — +33 9 75 18 15 09
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-[13px]">
          <p className="text-[12px] leading-[15px] tracking-wide text-black/60">
            SUIVEZ-MOI
          </p>
          <div className="flex items-center gap-[19px]">
            <a
              href="https://www.linkedin.com/in/lina-zakaria/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-black hover:opacity-70"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://www.instagram.com/linakzak/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-black hover:opacity-70"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.behance.net/linakzak"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Behance"
              className="text-black hover:opacity-70"
            >
              <BehanceIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-black/10" />

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-4 text-black/60">
          © Lina Zakaria — Tous droits réservés
        </p>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <Link
            href="/"
            className="text-[13px] uppercase leading-4 text-black hover:opacity-70"
          >
            Work
          </Link>
          <a
            href="/404"
            className="text-[13px] uppercase leading-4 text-black hover:opacity-70"
          >
            Personal Playground
          </a>
          <Link
            href="/about"
            className="text-[13px] uppercase leading-4 text-black hover:opacity-70"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="text-[13px] uppercase leading-4 text-black hover:opacity-70"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
