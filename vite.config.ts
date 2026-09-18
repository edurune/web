import { fileURLToPath } from "node:url";
import { lingui } from "@lingui/vite-plugin";
import stylex from "@stylexjs/unplugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import svgr from "vite-plugin-svgr";

// @vitejs/plugin-react 6 runs on oxc and no longer takes a `babel` option, so
// the Lingui macro needs its own babel pass. It has to run in dev as well:
// an unexpanded macro import throws at runtime.
export default defineConfig({
  plugins: [
    svgr({ svgrOptions: { svgo: false } }),
    stylex.vite({ useCSSLayers: true }),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    babel({
      // Router-split ids carry a ?tsr-split= query, so this cannot anchor on $.
      include: /\.[jt]sx?(\?|$)/,
      exclude: /node_modules\/(?!.*@edurune\/art\/)/,
      babelConfig: {
        babelrc: false,
        configFile: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: ["@lingui/babel-plugin-lingui-macro"],
      },
    }),
    lingui(),
  ],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: { exclude: ["@edurune/art"] },
  server: {
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
});
