// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    assetsInclude: [
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.png",
      "**/*.webp",
      "**/*.avif",
      "**/*.svg",
    ],

    resolve: {
      alias: {
        "@components": "/src/components",
        "@actions": "/src/actions",
        "@helpers": "/src/helpers",
        "@layouts": "/src/layouts",
        "@lib": "/src/lib",
        "@pages": "/src/pages",
        "@styles": "/src/styles",
        "@assets": "/src/assets",
      },
    },
  },
  output: "server",
  site: "https://silosremeco.com/",
  adapter: vercel({
    imageService: false,
  }),
  integrations: [sitemap()],
});
