/// <reference types="vitest" />
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// @ts-expect-error - This is a Vite plugin.
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // To configure tsconfig-paths, we need to use the plugin.
    tsconfigPaths(),
    // To configure React, we need to use the plugin.
    react(),
    // To configure TanStack Router, we need to use the plugin.
    TanStackRouterVite(),

    eslint(),
  ],
  test: {
    globals: true,
  },
});
