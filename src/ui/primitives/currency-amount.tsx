import { CoinsIcon, DiamondIcon, MedalIcon } from "@phosphor-icons/react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color, currency } from "../tokens/color.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import type { CurrencyKind, Size } from "../types.ts";
import { VisuallyHidden } from "./visually-hidden.tsx";

export interface CurrencyAmountProps {
  kind: CurrencyKind;
  amount: number;
  size?: Size;
  /** Renders an explicit + or - for rewards and costs. */
  signed?: boolean;
  style?: StyleXStyles;
}

// coin and gem are global; medal belongs to one course realm.
const names = {
  coin: msg`coins`,
  gem: msg`gems`,
  medal: msg`medals`,
};

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    color: color.textPrimary,
    fontFamily: font.display,
    fontWeight: fontWeight.bold,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  positive: { color: color.positiveStrong },
  negative: { color: color.negativeStrong },
});

const sizes = stylex.create({
  sm: { fontSize: fontSize.sm },
  md: { fontSize: fontSize.lg },
  lg: { fontSize: fontSize.xxl },
});

const glyphTones = stylex.create({
  coin: { color: currency.coinStroke },
  gem: { color: currency.gemStroke },
  medal: { color: currency.medalStroke },
});

const glyphSizes: Record<Size, number> = {
  sm: iconSize.sm,
  md: iconSize.lg,
  lg: iconSize.xl,
};

export function CurrencyAmount({
  kind,
  amount,
  size = "md",
  signed = false,
  style,
}: CurrencyAmountProps) {
  const { t, i18n } = useLingui();
  const formatted = new Intl.NumberFormat(i18n.locale).format(Math.abs(amount));
  const prefix = signed ? (amount < 0 ? "-" : "+") : amount < 0 ? "-" : "";

  return (
    <span
      {...stylex.props(
        styles.root,
        sizes[size],
        signed && amount > 0 && styles.positive,
        signed && amount < 0 && styles.negative,
        style,
      )}
    >
      {kind === "coin" && (
        <CoinsIcon
          size={glyphSizes[size]}
          weight="fill"
          aria-hidden="true"
          {...stylex.props(glyphTones.coin)}
        />
      )}
      {kind === "gem" && (
        <DiamondIcon
          size={glyphSizes[size]}
          weight="fill"
          aria-hidden="true"
          {...stylex.props(glyphTones.gem)}
        />
      )}
      {kind === "medal" && (
        <MedalIcon
          size={glyphSizes[size]}
          weight="fill"
          aria-hidden="true"
          {...stylex.props(glyphTones.medal)}
        />
      )}
      <span aria-hidden="true">
        {prefix}
        {formatted}
      </span>
      <VisuallyHidden>
        {prefix}
        {formatted} {t(names[kind])}
      </VisuallyHidden>
    </span>
  );
}
