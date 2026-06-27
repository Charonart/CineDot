import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler disabled: causes `getImageNode` crash when third-party
  // libraries (e.g. Framer Motion, Swiper) use non-standard React patterns.
  // Re-enable only after verifying all deps are compatible with the compiler.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
};

export default nextConfig;
