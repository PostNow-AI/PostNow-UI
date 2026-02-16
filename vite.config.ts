import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    allowedHosts: ["workable-wealthy-haddock.ngrok-free.app", "localhost", "*"],
  },
  define: {
    // Substituir variáveis de ambiente no código
    __CLARITY_ID__: JSON.stringify(process.env.VITE_CLARITY_ID || ""),
  },
});
