import { DIFFICULTY_LABEL, RARITY_LABEL } from "@edurune/art/labels";
import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import {
  color,
  difficulty as difficultyVars,
  rarity as rarityVars,
} from "../tokens/color.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, letterSpacing } from "../tokens/text.stylex.ts";
import type { Difficulty, Rarity, Tone } from "../types.ts";
import { SparkleIcon } from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

export interface BadgeProps {
  children?: ReactNode;
  tone?: Tone;
  size?: "sm" | "md";
  icon?: PhosphorIcon;
  uppercase?: boolean;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
    borderRadius: radius.pill,
    fontFamily: font.body,
    fontWeight: fontWeight.bold,
    whiteSpace: "nowrap",
  },
  uppercase: {
    textTransform: "uppercase",
    letterSpacing: letterSpacing.caps,
  },
  chip: { borderWidth: 0, color: color.textInverse },
});

const sizes = stylex.create({
  sm: { paddingBlock: space.xs, paddingInline: space.sm, fontSize: fontSize.xs },
  md: { paddingBlock: space.sm, paddingInline: space.md, fontSize: fontSize.sm },
});

const tones = stylex.create({
  neutral: {
    backgroundColor: color.neutralSoft,
    color: color.textSecondary,
  },
  accent: {
    backgroundColor: color.accentSoft,
    color: color.accentStrong,
  },
  positive: {
    backgroundColor: color.positiveSoft,
    color: color.positiveStrong,
  },
  negative: {
    backgroundColor: color.negativeSoft,
    color: color.negativeStrong,
  },
  caution: {
    backgroundColor: color.cautionSoft,
    color: color.cautionStrong,
  },
  info: { backgroundColor: color.infoSoft, color: color.infoStrong },
});

export function Badge({
  children,
  tone = "neutral",
  size = "sm",
  icon: Glyph,
  uppercase = false,
  style,
}: BadgeProps) {
  return (
    <span
      {...stylex.props(styles.root, sizes[size], tones[tone], uppercase && styles.uppercase, style)}
    >
      {Glyph ? <Glyph size={iconSize.xs} weight="bold" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const rarityTones = stylex.create({
  common: {
    backgroundColor: rarityVars.commonText,
  },
  uncommon: {
    backgroundColor: rarityVars.uncommonText,
  },
  rare: {
    backgroundColor: rarityVars.rareText,
  },
  epic: {
    backgroundColor: rarityVars.epicText,
  },
  legendary: {
    backgroundColor: rarityVars.legendaryText,
  },
});

export interface RarityBadgeProps {
  rarity: Rarity;
  size?: "sm" | "md";
  style?: StyleXStyles;
}

export function RarityBadge({ rarity, size = "sm", style }: RarityBadgeProps) {
  const { t } = useLingui();
  return (
    <span {...stylex.props(styles.root, styles.chip, sizes[size], rarityTones[rarity], style)}>
      {rarity === "legendary" ? (
        <SparkleIcon size={iconSize.xs} weight="bold" aria-hidden="true" />
      ) : null}
      {t(RARITY_LABEL[rarity])}
    </span>
  );
}

const difficultyTones = stylex.create({
  easy: {
    backgroundColor: difficultyVars.easySurface,
    color: difficultyVars.easyText,
  },
  medium: {
    backgroundColor: difficultyVars.mediumSurface,
    color: difficultyVars.mediumText,
  },
  hard: {
    backgroundColor: difficultyVars.hardSurface,
    color: difficultyVars.hardText,
  },
});

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: "sm" | "md";
  style?: StyleXStyles;
}

export function DifficultyBadge({ difficulty, size = "sm", style }: DifficultyBadgeProps) {
  const { t } = useLingui();
  return (
    <span
      {...stylex.props(
        styles.root,
        styles.uppercase,
        sizes[size],
        difficultyTones[difficulty],
        style,
      )}
    >
      {t(DIFFICULTY_LABEL[difficulty])}
    </span>
  );
}
