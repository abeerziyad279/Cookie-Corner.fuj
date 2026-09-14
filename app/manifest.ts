import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cookie Corner",
    short_name: "Cookie Corner",
    description: "Freshly baked cookies from Cookie Corner",
    start_url: "/",
    display: "standalone",
    background_color: "#f7e8e4",
    theme_color: "#f7e8e4",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}