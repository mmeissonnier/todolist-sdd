import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // Own port, so the Vue app can run next to the React app (5173).
  // `pnpm e2e:vue` points the shared e2e suite at this address.
  server: { port: 5174, strictPort: true },
});
