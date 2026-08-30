type ProjectSectionProps = {
  image: string;
  name: string;
  subtitle: string;
  priority?: boolean;
};

// The Figma design overlays a soft diagonal dark gradient ("Vector") on top of
// each hero photo before the text sits on it. The real gradient asset
// couldn't be pulled from Figma this pass (MCP tool-call limit was hit mid
// fetch), so this reproduces the same visual — a diagonal multiply-blend
// darkening band running through the lower third — with a CSS gradient
// instead of the exported asset. Swap the `overlay` div for an <img> of the
// real asset if/when it's fetched.
export default function ProjectSection({
  image,
  name,
  subtitle,
  priority = false,
}: ProjectSectionProps) {
  return (
    <section className="relative w-full aspect-[1864/978] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        loading={priority ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(10,10,12,0.75) 62%, rgba(10,10,12,0.35) 78%, transparent 92%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-10 flex items-end justify-between px-4 text-white sm:bottom-16 sm:px-8 md:bottom-20">
        <div>
          <p className="text-xl sm:text-2xl md:text-[33px] leading-normal">
            THIS IS <span className="font-bold">{name}</span>
          </p>
          <p className="mt-2 text-base sm:text-lg md:text-2xl leading-normal text-white/90">
            {subtitle}
          </p>
        </div>
        <p className="hidden sm:block shrink-0 text-sm md:text-[20px] leading-normal text-white/90">
          explore more
        </p>
      </div>
    </section>
  );
}
