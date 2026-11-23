import type { MetadataRoute } from "next";

/**
 * Web app manifest: lets customers "Add to home screen" and open Ojarun like
 * an app (own icon, no browser bar). Served by Next.js at /manifest.webmanifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ojarun — Market to your doorstep",
    short_name: "Ojarun",
    description:
      "Fresh food from local markets in Ibadan, picked by trained agents and delivered to your doorstep.",
    start_url: "/marketplace",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#004a19",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
