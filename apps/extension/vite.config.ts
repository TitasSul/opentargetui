import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.ts"),
        background: resolve(__dirname, "src/background.ts"),
        popup: resolve(__dirname, "popup.html")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
