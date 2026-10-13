import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Node 22+'s built-in --experimental-webstorage global collides with
    // jsdom's own localStorage/sessionStorage implementation, leaving
    // window.localStorage undefined. Disable it in the worker process.
    execArgv: ["--no-experimental-webstorage"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
