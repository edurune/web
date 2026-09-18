import { I18nProvider } from "@lingui/react";
import { IconContext } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import "@fontsource-variable/nunito/wght.css";
import "../src/index.css";
import { activateLocale, i18n } from "../src/i18n/i18n.ts";
import { color } from "../src/ui/tokens/color.stylex.ts";
import { space } from "../src/ui/tokens/space.stylex.ts";
import { font, fontSize, lineHeight } from "../src/ui/tokens/text.stylex.ts";

const styles = stylex.create({
  canvas: {
    backgroundColor: color.surfacePage,
    color: color.textPrimary,
    fontFamily: font.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
    padding: space.xl,
  },
  fullscreen: { minHeight: "100dvh" },
});

const iconDefaults = { weight: "bold", color: "currentColor" } as const;

const preview: Preview = {
  globalTypes: {
    locale: {
      description: "Language",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "vi", title: "Tiếng Việt" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: "en" },
  argTypes: {
    style: { control: false, table: { type: { summary: "StyleXStyles" } } },
  },
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
      sort: "requiredFirst",
      matchers: { color: /(background|color)$/i },
    },
    a11y: { test: "error" },
  },
  decorators: [
    function WithLocale(Story, context) {
      useEffect(() => {
        activateLocale(context.globals.locale === "vi" ? "vi" : "en");
      }, [context.globals.locale]);
      return (
        <I18nProvider i18n={i18n}>
          <IconContext.Provider value={iconDefaults}>
            <div
              {...stylex.props(styles.canvas, context.viewMode === "story" && styles.fullscreen)}
            >
              <Story />
            </div>
          </IconContext.Provider>
        </I18nProvider>
      );
    },
  ],
};

export default preview;
