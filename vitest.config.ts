import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: ["node_modules/", "src/**/*.astro"],
    },
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@actions": path.resolve(__dirname, "./src/actions"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
});
