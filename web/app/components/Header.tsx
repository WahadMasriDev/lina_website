export default function Header() {
  return (
    <header className="flex h-[79px] w-full items-center justify-between px-4 sm:px-8">
      <div className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.svg"
          alt="Lina Zakaria"
          className="h-9 w-auto sm:h-11"
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
