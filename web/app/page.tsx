import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";

const projects = [
  {
    image: "/images/cheval-blanc.png",
    name: "CHEVAL BLANC",
    subtitle: "Hotel de luxe à la samaritaine, LVMH",
  },
  {
    image: "/images/solcotton.png",
    name: "SOLCOTTON",
    subtitle: "Marque de cotton de luxe",
  },
  {
    image: "/images/bose-bmw.png",
    name: "BOSE X BMW",
    subtitle: "Interior design in Bejing",
  },
  {
    image: "/images/mcintosh-virgil-abloh.png",
    name: "MCINTOSH X VIRGIL ABLOH",
    subtitle: "Exposition au Grand Palais de Paris",
  },
  {
    image: "/images/psg-maison-shanghai.png",
    name: "PSG X LA MAISON SHANGHAI",
    subtitle: "Interior design project",
  },
  {
    image: "/images/hb-antwerp.png",
    name: "HB ANTWERP",
    subtitle: "Luxury diamond company",
  },
  {
    image: "/images/infiniment-coty.png",
    name: "INFINIMENT COTY",
    subtitle: "Marque de parfum de luxe",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-black px-4 sm:px-8">
      <Header />
      <div className="flex w-full flex-col gap-5">
        {projects.map((project) => (
          <ProjectSection key={project.name} {...project} />
        ))}
      </div>
    </div>
  );
}
