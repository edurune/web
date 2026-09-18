import { lingui } from "@lingui/vite-plugin";
import stylex from "@stylexjs/unplugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import babel from "vite-plugin-babel";
import { VitePWA } from "vite-plugin-pwa";
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
      react({ compiler: true }),
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
      process.env.STORYBOOK !== "true" &&
        VitePWA({
          registerType: "prompt",
          injectRegister: null,
          pwaAssets: { config: true, injectThemeColor: true },
          manifest: {
            id: "/",
            name: "EduRune",
            short_name: "EduRune",
            description: "Learn by clearing runic trials: lessons, practice, and boss battles.",
            lang: "en",
            dir: "ltr",
            start_url: "/",
            scope: "/",
            display: "standalone",
            display_override: ["standalone", "minimal-ui"],
            orientation: "portrait",
            background_color: "#f7f6f0",
            theme_color: "#f7f6f0",
            categories: ["education", "games"],
          },
          workbox: {
            globPatterns: ["**/*.{js,css,html,svg,ico,png,woff2}"],
            maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
            navigateFallback: "index.html",
            navigateFallbackDenylist: [/^\/api\//],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            runtimeCaching: [
              {
                urlPattern: ({ url }) => url.pathname.startsWith("/api/assets/"),
                handler: "CacheFirst",
                options: {
                  cacheName: "edurune-media",
                  expiration: {
                    maxEntries: 200,
                    maxAgeSeconds: 60 * 60 * 24 * 30,
                    purgeOnQuotaError: true,
                  },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
            ],
          },
          devOptions: {
            enabled: env.VITE_PWA_DEV === "true",
            type: "module",
            navigateFallback: "index.html",
          },
        }),
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
