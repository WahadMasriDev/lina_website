import Link from "next/link";

// Matches the "footer 1" Figma spec (Dev Mode CSS export): column auto-layout,
// 40px vertical padding, 23px gap between the three rows, a contact block +
// social block split space-between, a hairline divider, then a bottom row
// with the copyright and nav links. Fixed pixel widths from the spec (1858px
// frame, 737px contact block, etc.) are relaxed to responsive flex/gap so it
// holds up at any viewport width instead of only at the Figma canvas size.
//
// The bottom nav's hrefs used to be bare "#work"/"#playground"/"#about"/
// "#contact" anchors -- this footer only actually renders on project
// detail pages (page.tsx doesn't use it, ContactSection has its own
// copyright row instead), so none of those ids exist on the page they're
// clicked from and every one of them was a dead link. Work and Contact
// now point back at the real sections on the landing page (real routes,
// so they stay <Link> for the client-side transition); Playground and
// About don't have pages yet, so they go to the placeholder route
// ("/404", see page.tsx) as plain <a> tags instead --
// that route has no page.tsx, so Next's client router can't find its
// route data and a <Link> to it silently fails to navigate. A real <a>
// forces a full page load, which correctly hits the static host's 404
// handling (our styled not-found.tsx).
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
              href="https://www.linkedin.com/in/lina-zakaria/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white hover:opacity-70"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://www.instagram.com/linakzak/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white hover:opacity-70"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.behance.net/linakzak"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Behance"
              className="text-white hover:opacity-70"
            >
              <BehanceIcon />
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
          <Link
            href="/"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            Work
          </Link>
          <a
            href="/404"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            Personal Playground
          </a>
          <a
            href="/404"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            About
          </a>
          <Link
            href="/#contact"
            className="text-[13px] uppercase leading-4 text-[#F5F5F7] hover:opacity-70"
          >
            Contact
          </Link>
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
    <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
      <g clipPath="url(#footer-ig-clip)">
        <path
          d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70312 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3312 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2812 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z"
          fill="currentColor"
        />
        <path
          d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z"
          fill="currentColor"
        />
        <path
          d="M39.6937 11.1843C39.6937 12.778 38.4 14.0624 36.8156 14.0624C35.2219 14.0624 33.9375 12.7687 33.9375 11.1843C33.9375 9.59053 35.2313 8.30615 36.8156 8.30615C38.4 8.30615 39.6937 9.5999 39.6937 11.1843Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="footer-ig-clip">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
      <g clipPath="url(#footer-li-clip)">
        <path
          d="M44.4469 0H3.54375C1.58437 0 0 1.54688 0 3.45938V44.5312C0 46.4437 1.58437 48 3.54375 48H44.4469C46.4062 48 48 46.4438 48 44.5406V3.45938C48 1.54688 46.4062 0 44.4469 0ZM14.2406 40.9031H7.11563V17.9906H14.2406V40.9031ZM10.6781 14.8688C8.39062 14.8688 6.54375 13.0219 6.54375 10.7437C6.54375 8.46562 8.39062 6.61875 10.6781 6.61875C12.9563 6.61875 14.8031 8.46562 14.8031 10.7437C14.8031 13.0125 12.9563 14.8688 10.6781 14.8688ZM40.9031 40.9031H33.7875V29.7656C33.7875 27.1125 33.7406 23.6906 30.0844 23.6906C26.3812 23.6906 25.8187 26.5875 25.8187 29.5781V40.9031H18.7125V17.9906H25.5375V21.1219H25.6312C26.5781 19.3219 28.9031 17.4188 32.3625 17.4188C39.5719 17.4188 40.9031 22.1625 40.9031 28.3313V40.9031Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="footer-li-clip">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function BehanceIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
      <rect x="1" y="1" width="46" height="46" rx="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M37.2751 16.9182H29.0234V14.8693H37.2784V16.9215L37.2751 16.9182ZM23.5289 25.328C24.0625 26.1516 24.3261 27.153 24.3261 28.329C24.3261 29.5478 24.0296 30.6348 23.4169 31.6C23.0087 32.278 22.4632 32.863 21.8153 33.3175C21.1674 33.7719 20.4315 34.0857 19.655 34.2386C18.7656 34.423 17.8005 34.5153 16.7595 34.5153H7.52948V14.0194H17.4282C19.9219 14.0589 21.6908 14.7836 22.735 16.2034C23.3609 17.073 23.6738 18.1173 23.6738 19.3328C23.6738 20.5845 23.3609 21.5892 22.7251 22.3502C22.376 22.7784 21.8555 23.1671 21.167 23.5163C22.208 23.8984 22.9985 24.4979 23.5289 25.328ZM12.2565 22.0998H16.5948C17.4842 22.0998 18.2056 21.9318 18.759 21.5925C19.3157 21.2532 19.5924 20.6537 19.5924 19.7907C19.5924 18.8354 19.2268 18.2029 18.4922 17.8999C17.7073 17.6648 16.8901 17.5558 16.0711 17.577H12.2565V22.0998ZM20.0108 28.0358C20.0108 26.9718 19.5727 26.2372 18.7063 25.8419C18.2188 25.6179 17.5336 25.5026 16.6574 25.4927H12.2565V30.9543H16.5882C17.4776 30.9543 18.1694 30.839 18.6635 30.5953C19.5595 30.1506 20.0108 29.3007 20.0108 28.0358ZM40.3387 24.7022C40.4375 25.3741 40.4836 26.3459 40.4671 27.6174H29.7778C29.8371 29.0932 30.3444 30.1242 31.3128 30.7139C31.8926 31.0861 32.5975 31.2673 33.4276 31.2673C34.3006 31.2673 35.0088 31.0466 35.5589 30.592C35.8865 30.3124 36.1542 29.9695 36.3462 29.584H40.2662C40.1608 30.4569 39.6897 31.3398 38.8431 32.239C37.5255 33.6654 35.6874 34.3802 33.3189 34.3802C31.4365 34.4046 29.6056 33.7655 28.1472 32.575C26.6583 31.3694 25.9072 29.4127 25.9072 26.6951C25.9072 24.1487 26.5825 22.1986 27.9298 20.8415C29.2804 19.481 31.0295 18.8057 33.1839 18.8057C34.4587 18.8057 35.6083 19.033 36.6361 19.4909C37.6573 19.9521 38.5038 20.6735 39.1692 21.665C39.7721 22.5412 40.1575 23.5492 40.3387 24.7022ZM36.4846 25.0843C36.4121 24.0631 36.0695 23.2923 35.4568 22.7652C34.8244 22.2266 34.0142 21.9425 33.1839 21.9681C32.1957 21.9681 31.4347 22.2546 30.8912 22.8113C30.3477 23.3713 30.0084 24.129 29.87 25.0843H36.4846Z"
        fill="currentColor"
      />
    </svg>
  );
}
