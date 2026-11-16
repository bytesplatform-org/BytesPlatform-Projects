import type { NextConfig } from "next";
import { basePath } from "./src/lib/site";

/** Case studies with a PDF in public/case-studies/<slug>.pdf */
const CASE_STUDIES = [
  "quantiva-hq",
  "intellimaint-ai",
  "aegis-creek",
  "team-smith-logistics",
  "the-benavente-group",
  "cascadia-health",
  "goldway-capital",
  "trident-foundation-systems",
  "gilbert-and-sons",
  "rob-does-it",
  "weisz-sports-management",
  "sqush-llc",
].join("|");

/** Case studies published as web pages: public/case-studies/<slug>.html */
const HTML_CASE_STUDIES = [
  "amins-consult",
  "dawg-team-apparel-usa",
  "em-painting-tx",
  "royalty-with-a-purpose",
  "safe-travel-charters",
  "on-top-home-services",
  "jobco-supply",
  "this-week-in-public-health",
  "cfws-llc",
  "5dccs",
  "nexus-alliance",
  "fairpath-consultants",
].join("|");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Served at the root of https://portfolio.bytesplatform.com, so basePath is
  // empty; it stays wired up in case the app moves under a prefix again.
  basePath,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 430, 640, 768, 1024, 1280, 1440, 1920, 2560],
    // Every quality passed to next/image: showcase frames (90) and the viewer (92)
    qualities: [75, 90, 92],
  },
  // Case studies live on our own domain: /case-studies/<slug> serves
  // public/case-studies/<slug>.pdf (browser PDF viewer) or <slug>.html
  async rewrites() {
    return [
      { source: `/case-studies/:slug(${CASE_STUDIES})`, destination: "/case-studies/:slug.pdf" },
      { source: `/case-studies/:slug(${HTML_CASE_STUDIES})`, destination: "/case-studies/:slug.html" },
    ];
  },
  async headers() {
    return [
      {
        source: `/case-studies/:slug(${CASE_STUDIES})`,
        headers: [{ key: "Content-Disposition", value: 'inline; filename="BytesPlatform-:slug-case-study.pdf"' }],
      },
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
