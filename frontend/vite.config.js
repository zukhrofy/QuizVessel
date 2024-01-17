import path from "path";
import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), eslint(), svgr()],
    base: "http://localhost:5173/",
  };
});
