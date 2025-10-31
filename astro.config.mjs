// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@components": "/src/components",
        "@assets": "/srcassets",
        "@actions": "/src/actions",
        "@helpers": "/src/helpers",
        "@layouts": "/src/layouts",
        "@lib": "/src/lib",
        "@pages": "/src/pages",
        "@styles": "/src/styles",
      },
    },
  },
  output: "server",
  adapter: vercel({
    imageService: false,
  }),
});
