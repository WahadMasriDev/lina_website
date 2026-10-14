// Shared project list -- used by the landing page (full cards, image/video
// included) and by Header's WORK dropdown (name + href only). Keeping a
// single source of truth means adding/renaming a project never requires
// updating the nav separately from the landing page.
export const PROJECT_LINKS = [
  { name: "CHEVAL BLANC", href: "/projects/cheval-blanc" },
  { name: "SOLCOTTON", href: "/projects/solcotton" },
  { name: "BOSE X BEIJING", href: "/projects/bose-beijing" },
  { name: "MCINTOSH X VIRGIL ABLOH", href: "/projects/mcintosh-abloh" },
  { name: "PSG X LA MAISON SHANGHAI", href: "/projects/psg-maison-shanghai" },
  { name: "HB ANTWERP", href: "/projects/hb-antwerp" },
] as const;
