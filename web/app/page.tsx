import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";
import Footer from "./components/Footer";

// Projects with more than one usable photo in their assets folder get a
// hover montage (crossfading through the extra shots) as a stand-in for a
// real video. McIntosh, HB Antwerp and Infiniment Coty only ever had the one
// landing photo -- nothing to montage until more assets show up for them.
const projects = [
  {
    image: "/images/cheval-blanc.png",
    video: "/videos/cheval-blanc.mp4",
    name: "CHEVAL BLANC",
    subtitle: "Hotel de luxe à la samaritaine, LVMH",
  },
  {
    image: "/images/solcotton.png",
    images: ["/images/solcotton-2.jpg", "/images/solcotton-3.jpg"],
    name: "SOLCOTTON",
    subtitle: "Marque de cotton de luxe",
  },
  {
    image: "/images/bose-bmw.png",
    images: ["/images/bose-bmw-2.jpg", "/images/bose-bmw-3.jpg"],
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
    images: [
      "/images/psg-maison-shanghai-2.jpg",
      "/images/psg-maison-shanghai-3.jpg",
    ],
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
    <div className="flex min-h-screen flex-col items-center gap-5 bg-black px-4 pt-[31px] pb-[31px] sm:px-8">
      <Header />
      <div className="flex w-full flex-col gap-5">
        {projects.map((project) => (
          <ProjectSection key={project.name} {...project} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
