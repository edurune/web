import { brandUrls } from "@edurune/art/assets";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import { artSize } from "./tokens/art.stylex.ts";
import { layout } from "./tokens/layout.stylex.ts";
import { space } from "./tokens/space.stylex.ts";

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    maxInlineSize: layout.full,
  },
  mark: {
    display: "block",
    inlineSize: artSize.brandMark,
    blockSize: "auto",
    flexShrink: 0,
  },
  wordmark: {
    display: "block",
    inlineSize: artSize.brandWordmark,
    minInlineSize: space.none,
    maxInlineSize: layout.full,
    blockSize: "auto",
  },
});

export function Brand({
  variant = "lockup",
  style,
}: {
  variant?: "mark" | "wordmark" | "lockup";
  style?: StyleXStyles;
}) {
  return (
    <span role="img" aria-label="EduRune" {...stylex.props(styles.root, style)}>
      {variant !== "wordmark" && (
        <img src={brandUrls["rune-gate"]} alt="" {...stylex.props(styles.mark)} />
      )}
      {variant !== "mark" && (
        <img src={brandUrls["carved-wordmark"]} alt="" {...stylex.props(styles.wordmark)} />
      )}
    </span>
  );
}
