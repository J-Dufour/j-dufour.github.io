import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  root: "src/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        glyphimg: resolve(__dirname, "src/glyphimg/index.html"),
        telepointer: resolve(__dirname, "src/telepointer/index.html"),
      },
    },
  },
  optimizeDeps: {
    exclude: ["glyphimg"],
  },
});
