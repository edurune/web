import { defineConfig } from "@lingui/cli";

export default defineConfig({
  locales: ["en", "vi"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["src/locales/**", "**/*.stories.tsx"],
    },
  ],
});
