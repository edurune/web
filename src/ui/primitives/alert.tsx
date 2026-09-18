import { CheckCircleIcon, InfoIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { Stack } from "./stack.tsx";
import { Text } from "./text.tsx";
import type { CueName } from "../sound/sound.ts";
import { useSoundWhen } from "../sound/use-sound-when.ts";

export type AlertTone = "info" | "positive" | "caution" | "negative";

export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Replaces the tone's default glyph. */
  icon?: PhosphorIcon;
  /** Call to action rendered under the message. */
  action?: ReactNode;
  style?: StyleXStyles;
}

const defaultGlyphs: Record<AlertTone, PhosphorIcon> = {
  info: InfoIcon,
  positive: CheckCircleIcon,
  caution: WarningIcon,
  negative: WarningCircleIcon,
};

const toneCues: Record<AlertTone, CueName> = {
  info: "info",
  positive: "success",
  caution: "warning",
  negative: "error",
};

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
    color: color.textPrimary,
    minInlineSize: space.none,
  },
  glyph: { display: "block", flexShrink: 0 },
  copy: { flex: 1, minInlineSize: space.none, overflowWrap: "anywhere" },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});

const tones = stylex.create({
  info: {
    backgroundColor: color.infoFill,
  },
  positive: {
    backgroundColor: color.positiveFill,
  },
  caution: {
    backgroundColor: color.cautionFill,
  },
  negative: {
    backgroundColor: color.negativeFill,
  },
});

export function Alert({ tone = "info", title, children, icon, action, style }: AlertProps) {
  const Glyph = icon ?? defaultGlyphs[tone];
  useSoundWhen(toneCues[tone], true);
  return (
    <div
      role={tone === "negative" ? "alert" : "status"}
      {...stylex.props(styles.root, tones[tone], style)}
    >
      <Glyph size={iconSize.lg} weight="bold" aria-hidden="true" {...stylex.props(styles.glyph)} />
      <Stack gap="sm" style={styles.copy}>
        {title ? (
          <Text variant="bodyStrong" tone="inherit" style={styles.title}>
            {title}
          </Text>
        ) : null}
        {children ? (
          <Text variant="body" tone="inherit">
            {children}
          </Text>
        ) : null}
        {action}
      </Stack>
    </div>
  );
}
