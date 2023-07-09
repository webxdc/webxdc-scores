import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/webxdc-scores.js"),
      name: "webxdc-scores",
      // the proper extensions will be added
      fileName: "webxdc-scores",
    },
  },

  // https://github.com/vitest-dev/vitest
  test: {
    environment: "jsdom",
  },
});
