/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Dog Training Assistant",
        short_name: "DogTrainer",
        start_url: "/",
        display: "standalone",
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["src/**/*.test.{ts,tsx}", "src/**/__tests__/**/*.{ts,tsx}"],
    exclude: ["e2e/**", "**/e2e/**", "node_modules/**", "dist/**"],
  },
});
