import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` produces plain HTML/CSS/JS in ./out,
  // which the Dockerfile copies straight into the Apache container next
  // to api.php and todo/ — no separate Node server needed in production.
  output: "export",
  images: {
    // next/image's optimizer needs a server; static export has none.
    unoptimized: true,
  },
};

export default nextConfig;
