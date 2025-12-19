import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  output: "server",

  adapter: vercel({
    imageService: true,
    devImageService: "sharp",
  }),

  site: "https://silosremeco.com",

  security: {
    allowedDomains: [
      {
        protocol: "https",
        hostname: "noiydfvnlzwoekvvyabq.supabase.co",
      },
    ],
  },

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "noiydfvnlzwoekvvyabq.supabase.co",
        pathname: "/storage/v1/object/public/silos_img/**",
      },
    ],
    domains: ["noiydfvnlzwoekvvyabq.supabase.co"],
  },
  server: {
    allowedOrigins: ["https://silosremeco.com"],
  },
});
