import { defineConfig, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

const crossOriginIsolateMiddleware = () => ({
  name: "vite-coi-middleware",
  configureServer(server: ViteDevServer) {
    server.middlewares.use((_, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), crossOriginIsolateMiddleware()],
});
