import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { measure } from "../tokens/size.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { Stack } from "./stack.tsx";
import { Surface } from "./surface.tsx";
import { Text } from "./text.tsx";

export interface EmptyStateProps {
  icon?: PhosphorIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: space.md,
    minInlineSize: space.none,
    textAlign: "center",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: layout.emptyStateIcon,
    blockSize: layout.emptyStateIcon,
    backgroundColor: color.cautionFill,
    borderRadius: radius.circle,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
    color: color.textPrimary,
  },
  copy: { maxWidth: measure.narrow },
});

export function EmptyState({ icon: Glyph, title, description, action, style }: EmptyStateProps) {
  return (
    <Surface depth="lifted" padding="xxl" style={[styles.root, style]}>
      {Glyph ? (
        <div {...stylex.props(styles.badge)}>
          <Glyph size={iconSize.xl} weight="bold" aria-hidden="true" />
        </div>
      ) : null}
      <Stack gap="xxs" align="center" style={styles.copy}>
        <Text as="h2" variant="subheading" align="center">
          {title}
        </Text>
        {description ? (
          <Text tone="secondary" align="center">
            {description}
          </Text>
        ) : null}
      </Stack>
      {action}
    </Surface>
  );
}
