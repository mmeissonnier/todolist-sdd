import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Fixed port: the shared e2e config expects http://localhost:5173 by default.
  server: { port: 5173, strictPort: true },
});
