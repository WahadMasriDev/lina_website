// Logo sizing knobs -- tweak these directly if the lockup looks off
// against Figma. The two SVGs are each cropped tight to their own real
// content (no padding), so the height you set here is exactly the
// rendered height and the width follows automatically at the correct,
// undistorted aspect ratio.
const LOGO_ICON_HEIGHT = 44; // px, mark to the left
const LOGO_WORDMARK_HEIGHT = 32; // px, "LINA / ZAKARIA" block, right of the mark
const LOGO_GAP = 8; // px, space between the mark and the wordmark

type HeaderProps = {
  /** Landing page only: a persistent, full-bleed frosted bar pinned to
   * the very top -- flush edge to edge, same look on every project, no
   * hide/show or hover state. Reference: the "stays in place, fills the
   * sides" screenshot. */
  overlay?: boolean;
};

export default function Header({ overlay = false }: HeaderProps) {
  return (
    <header
      className={`flex h-[96px] w-full items-center justify-between px-4 sm:px-8 ${
        overlay ? "fixed inset-x-0 top-0 z-50 backdrop-blur-md" : ""
      }`}
      style={
        overlay
          ? {
              background:
                "linear-gradient(to bottom, rgba(10,10,12,0.6) 0%, rgba(10,10,12,0.32) 70%, rgba(10,10,12,0) 100%)",
            }
          : undefined
      }
    >
      <div className="flex items-center" style={{ gap: LOGO_GAP }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-icon.svg"
          alt=""
          aria-hidden
          style={{ height: LOGO_ICON_HEIGHT }}
          className="w-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-wordmark.svg"
          alt="Lina Zakaria"
          style={{ height: LOGO_WORDMARK_HEIGHT }}
          className="w-auto"
        />
      </div>

      {/*
        Figma: 'Acumin Variable Concept', weight 194, 15px/18px. That's a
        paid Adobe Fonts family we can't self-host the way we did Inter --
        falling back to the site sans-serif stack at a light weight until
        real font files are provided.
      */}
      <nav className="hidden md:flex w-[360px] items-center justify-between text-[15px] leading-[18px] font-light text-white">
        <a href="#about" className="hover:opacity-70">
          ABOUT
        </a>
        <a href="#playground" className="hover:opacity-70">
          PERSONAL PLAYGROUND
        </a>
        <a href="#work" className="hover:opacity-70">
          WORK
        </a>
      </nav>
    </header>
  );
}
