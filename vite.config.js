import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/webxdc-scores.js"),
      name: "webxdc-scores",
      // the proper extensions will be added
      fileName: "webxdc-scores",
    },
  },
});
