import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

const paper = "#f7f6f0";

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  images: ["public/brand-mark.svg"],
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: paper } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: paper } },
  },
});
