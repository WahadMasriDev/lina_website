// Matches the "footer 1" Figma spec (Dev Mode CSS export): column auto-layout,
// 40px vertical padding, 23px gap between the three rows, a contact block +
// social block split space-between, a hairline divider, then a bottom row
// with the copyright and nav links. Fixed pixel widths from the spec (1858px
// frame, 737px contact block, etc.) are relaxed to responsive flex/gap so it
// holds up at any viewport width instead of only at the Figma canvas size.
export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-stretch gap-6 px-4 py-10 sm:gap-[23px] sm:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold leading-6 text-[#F5F5F5]">
          CONTACTEZ MOI
        </h2>
      </div>

      <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[737px]">
          <div className="h-[2px] w-8 bg-white" />
          <p className="mt-4 max-w-[400px] text-[15px] leading-[18px] text-[#A8A8AD]">
            Je suis à votre disposition pour toute information du lundi au
            samedi, de 10h00 à 19h00.
          </p>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-[77px]">
            <a
              href="mailto:lina.zakariaa@gmail.com"
              className="flex items-center gap-2 text-[14px] leading-[17px] text-[#E6E6E8] hover:opacity-70"
            >
              <MailIcon />
              lina.zakariaa@gmail.com
            </a>
            <a
              href="tel:+33975181509"
              className="flex items-center gap-2 text-[14px] leading-[17px] text-[#E6E6E8] hover:opacity-70"
            >
              <PhoneIcon />
              +33 9 75 18 15 09
            </a>
            <a
              href="https://wa.me/33975181509"
              className="flex items-center gap-2 text-[14px] leading-[17px] text-[#E6E6E8] hover:opacity-70"
            >
              <WhatsAppIcon />
              WhatsApp — +33 9 75 18 15 09
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-[13px]">
          <p className="text-[12px] leading-[15px] tracking-wide text-[#7A7A80]">
            SUIVEZ-MOI
          </p>
          <div className="flex items-center gap-[19px]">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-white hover:opacity-70"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://wa.me/33975181509"
              aria-label="WhatsApp"
              className="text-white hover:opacity-70"
            >
              <WhatsAppCircleIcon />
            </a>
            <a
              href="mailto:lina.zakariaa@gmail.com"
              aria-label="Email"
              className="text-white hover:opacity-70"
            >
              <MailCircleIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-4 text-[#929298]">
          © Lina Zakaria — Tous droits réservés
        </p>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <a
            href="#work"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            Work
          </a>
          <a
            href="#playground"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            Personal Playground
          </a>
          <a
            href="#about"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <rect x="1" y="1" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 1.8 9 7.5l7.5-5.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 2.5c-.7 0-1.3.6-1.2 1.3.3 6 5.1 10.9 11.2 11.2.7 0 1.3-.5 1.3-1.2v-2.3c0-.6-.4-1.1-1-1.2l-2.4-.5c-.5-.1-1 .1-1.3.4l-.8.8a9.6 9.6 0 0 1-4-4l.8-.8c.3-.3.5-.8.4-1.3l-.5-2.4c-.1-.6-.6-1-1.2-1H2z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5 13.5 5.9 10.5C5.2 9.5 4.9 8.3 5 7.1 5.3 4.4 7.7 2.3 10.4 2.6 13 2.9 15 5.2 14.7 8 14.4 10.7 12 12.7 9.3 12.4c-.9-.1-1.8-.4-2.6-.9Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="1" y="1" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13" cy="13" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="6" r="1.3" fill="currentColor" />
    </svg>
  );
}

function WhatsAppCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
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

function MailCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="1" y="1" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6" y="9" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 9.5 13 14.5l6.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
