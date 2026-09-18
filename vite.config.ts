import { lingui } from "@lingui/vite-plugin";
import stylex from "@stylexjs/unplugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import babel from "vite-plugin-babel";
import svgr from "vite-plugin-svgr";

// @vitejs/plugin-react 6 runs on oxc and no longer takes a `babel` option, so
// the Lingui macro needs its own babel pass. It has to run in dev as well:
// an unexpanded macro import throws at runtime.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
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
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      exclude: ["@edurune/art"],
      include: ["@xmldom/xmldom"],
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
      fs: {
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
      },
    },
  };
});
