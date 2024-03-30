/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // To configure tsconfig-paths, we need to use the plugin.
    tsconfigPaths(),
    // To configure React, we need to use the plugin.
    react(),
    // To configure TanStack Router, we need to use the plugin.
    TanStackRouterVite(),
  ],
  test: {
    globals: true,
  },
});
