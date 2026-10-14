"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

// Built against the "ready for dev" Figma frame (node 96:204, "About page
// first draft"), fetched via Dev Mode / get_design_context. Standard dark
// treatment (bg-black, white text) like most project pages, just without
// a hero -- Header sits in normal flow at the top like the landing page,
// not overlaid. "About me" / "LINA ZAKARIA" use 'Gotham Narrow Bold' in
// Figma, a paid family this project doesn't self-host (same situation as
// the nav's 'Acumin Variable Concept', see Header.tsx) -- falling back to
// the site's sans-serif stack at font-bold until real font files are
// provided. The bio photo is Lina's own (rotated -90deg in Figma to fix
// a sideways phone-camera orientation); pre-rotated here on export rather
// than shipping the sideways file with a CSS transform, so it's just a
// normal upright image.
export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-[70px] bg-black">
      <div className="w-full px-4 sm:px-8">
        <Header />
      </div>

      <Reveal index={0} className="w-full px-4 sm:px-8 lg:px-[95px]">
        <div className="flex w-full flex-col gap-[21px]">
          <h1 className="text-[48px] font-bold leading-none text-white">
            About me
          </h1>

          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-end lg:gap-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-lina.jpg"
              alt="Lina Zakaria"
              className="w-full object-cover lg:w-[54%]"
            />

            <div className="flex w-full flex-col gap-[43px] text-white lg:w-[46%]">
              <h2 className="text-[48px] font-bold leading-none">
                LINA ZAKARIA
              </h2>
              <div className="flex flex-col gap-4 text-base leading-normal text-white/90">
                <p>
                  Je suis Directrice Artistique Junior, basée à Paris, avec
                  un goût assez prononcé pour les idées qui commencent par
                  «&nbsp;attends, j&rsquo;ai peut-être un truc…&nbsp;» et
                  finissent en identité de marque, scénographie, animation
                  3D ou concept de campagne.
                </p>
                <p>
                  J&rsquo;aime toucher à tout&nbsp;: direction artistique,
                  branding, 3D, image, motion, set design, expériences
                  physiques et digitales. Pour moi, le plus intéressant
                  n&rsquo;est pas simplement de faire quelque chose de
                  beau, mais de comprendre pourquoi une image attire,
                  pourquoi une couleur provoque une émotion, pourquoi
                  certains détails restent en tête. C&rsquo;est
                  probablement pour ça que je m&rsquo;intéresse autant à
                  la psychologie, à la perception, à la sémiologie, au
                  cinéma et à la photographie.
                </p>
                <p>
                  Je travaille principalement autour des univers du luxe,
                  de la beauté, de la mode et de la culture, où j&rsquo;aime
                  trouver l&rsquo;équilibre entre une esthétique très
                  travaillée et une idée suffisamment simple pour être
                  comprise immédiatement.
                </p>
                <p>
                  Je peux passer beaucoup trop de temps sur un détail que
                  personne ne remarquera consciemment, mais qui, je
                  l&rsquo;espère, changera quand même complètement la
                  manière dont on ressent le projet.
                </p>
                <p>
                  En résumé&nbsp;: j&rsquo;aime créer des univers, raconter
                  des histoires et transformer une idée un peu floue en
                  quelque chose qu&rsquo;on a envie de regarder, de
                  toucher ou de vivre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal index={1} className="w-full px-4 pb-[31px] sm:px-8">
        <Footer />
      </Reveal>
    </div>
  );
}
