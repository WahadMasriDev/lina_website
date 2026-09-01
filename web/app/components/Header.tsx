// Logo sizing knobs -- tweak these directly if the lockup looks off
// against Figma. The two SVGs are each cropped tight to their own real
// content (no padding), so the height you set here is exactly the
// rendered height and the width follows automatically at the correct,
// undistorted aspect ratio.
const LOGO_ICON_HEIGHT = 44; // px, mark to the left
const LOGO_WORDMARK_HEIGHT = 32; // px, "LINA / ZAKARIA" block, right of the mark
const LOGO_GAP = 8; // px, space between the mark and the wordmark

type HeaderProps = {
  /**
   * Landing page only. Drives the floating header behaviour as you move
   * through the full-screen scroll-snap sections:
   *  - "full": solid black bar, sitting at rest at the very top.
   *  - "floating": a small, translucent, blurred pill -- the peek you get
   *    scrolling back up a little without reaching the top.
   *  - "hidden": gone entirely, while a project section fills the screen.
   * Every other page just renders the plain static header (mode is
   * ignored unless `overlay` is set).
   */
  mode?: "full" | "floating" | "hidden";
  /** Render as a fixed overlay above the page instead of in normal flow. */
  overlay?: boolean;
};

export default function Header({ mode = "full", overlay = false }: HeaderProps) {
  const hidden = overlay && mode === "hidden";
  const floating = overlay && mode === "floating";

  return (
    <div
      className={`${
        overlay ? "fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-8" : ""
      } transition-[opacity,transform,background-color] duration-[700ms] ease-out ${
        hidden ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        height: overlay ? 139 : undefined,
        paddingTop: overlay ? 30 : undefined,
        paddingBottom: overlay ? 30 : undefined,
        backgroundColor:
          overlay && !floating && !hidden ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)",
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      }}
    >
      <header
        className={`flex h-[79px] items-center justify-between transition-all duration-[700ms] ease-out ${
          floating
            ? "mx-auto w-full max-w-2xl scale-[0.92] rounded-full bg-black/35 px-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-8"
            : "w-full px-4 sm:px-8"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
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
    </div>
  );
}
