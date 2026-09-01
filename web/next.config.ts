import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Static export: `next build` produces plain HTML/CSS/JS in ./out,
  // which the Dockerfile copies straight into the Apache container next
  // to api.php and todo/ — no separate Node server needed in production.
  output: "export",
  images: {
    // next/image's optimizer needs a server; static export has none.
    unoptimized: true,
  },
  turbopack: {
    // There's a stray package-lock.json one level up at the repo root
    // (C:\_ddm\lina_website), which makes Turbopack guess that's the
    // workspace root instead of this web/ folder -- and once it does,
    // its dev-server file watcher stops picking up new files here
    // (e.g. a freshly added component 404s with "Module not found"
    // even after a restart). Pin the root explicitly so that can't happen.
    root: path.join(__dirname),
  },
};

export default nextConfig;
