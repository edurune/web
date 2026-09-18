import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import type { Rarity } from "../types.ts";
import { rarityBorder } from "./rarity-styles.ts";

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Shown while the image loads or when there is none. */
  fallback?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "rounded";
  /** Frames a cosmetic or equipment portrait in its tier colour. */
  rarity?: Rarity;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
    backgroundColor: color.surfaceSunken,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: color.borderStrong,
    color: color.textSecondary,
    fontFamily: font.display,
    fontWeight: fontWeight.bold,
    userSelect: "none",
    verticalAlign: "middle",
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  circle: { borderRadius: radius.circle },
  rounded: { borderRadius: radius.lg },
});

const sizes = stylex.create({
  sm: { width: "32px", height: "32px", fontSize: fontSize.xs },
  md: { width: "44px", height: "44px", fontSize: fontSize.sm },
  lg: { width: "64px", height: "64px", fontSize: fontSize.lg },
  xl: { width: "96px", height: "96px", fontSize: fontSize.xl },
});

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  shape = "circle",
  rarity,
  style,
}: AvatarProps) {
  return (
    <BaseAvatar.Root
      {...stylex.props(
        styles.root,
        styles[shape],
        sizes[size],
        rarity && rarityBorder[rarity],
        style,
      )}
    >
      {src ? <BaseAvatar.Image src={src} alt={alt} {...stylex.props(styles.image)} /> : null}
      <BaseAvatar.Fallback>{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
