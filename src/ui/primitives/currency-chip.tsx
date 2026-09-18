import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState } from "react";
import { color, currency } from "../tokens/color.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { control } from "../tokens/size.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { fontSize } from "../tokens/text.stylex.ts";
import type { CurrencyKind } from "../types.ts";
import { CurrencyAmount } from "./currency-amount.tsx";

const float = stylex.keyframes({
  "0%": { opacity: 0, transform: `translateY(${space.sm})` },
  "15%": { opacity: 1, transform: `translateY(${space.none})` },
  "70%": { opacity: 1 },
  "100%": { opacity: 0, transform: `translateY(calc(-1 * ${space.sm}))` },
});
const fade = stylex.keyframes({
  "0%": { opacity: 0 },
  "15%": { opacity: 1 },
  "70%": { opacity: 1 },
  "100%": { opacity: 0 },
});
const styles = stylex.create({
  root: { position: "relative", display: "inline-flex", flexShrink: 0 },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minBlockSize: control.sm,
    paddingInline: space.sm,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBlockEndWidth: press.lipWidth,
    borderColor: color.borderStrong,
    borderRadius: radius.pill,
  },
  amount: { fontSize: fontSize.lg },
  delta: {
    position: "absolute",
    insetBlockStart: layout.full,
    insetInlineEnd: space.none,
    zIndex: layer.raised,
    display: "inline-flex",
    alignItems: "center",
    pointerEvents: "none",
    animationName: { default: float, "@media (prefers-reduced-motion: reduce)": fade },
    animationDuration: duration.reward,
    animationTimingFunction: easing.standard,
    animationFillMode: "both",
  },
  deltaAmount: { fontSize: fontSize.md },
});
const tones = stylex.create({
  coin: { backgroundColor: currency.coinSurface },
  gem: { backgroundColor: currency.gemSurface },
  medal: { backgroundColor: currency.medalSurface },
});

export interface CurrencyChipProps {
  kind: CurrencyKind;
  /** Authoritative balance. Changes animate; the initial value does not. */
  amount: number;
  style?: StyleXStyles;
}

export function CurrencyChip({ kind, amount, style }: CurrencyChipProps) {
  const [change, setChange] = useState({ kind, amount, delta: 0, revision: 0 });
  if (change.kind !== kind || change.amount !== amount) {
    setChange({
      kind,
      amount,
      delta: change.kind === kind ? amount - change.amount : 0,
      revision: change.revision + 1,
    });
  }

  return (
    <span {...stylex.props(styles.root, style)}>
      <span role="status" aria-atomic="true" {...stylex.props(styles.chip, tones[kind])}>
        <CurrencyAmount kind={kind} amount={amount} size="sm" style={styles.amount} />
      </span>
      {change.delta !== 0 && (
        <span
          key={change.revision}
          aria-hidden="true"
          {...stylex.props(styles.delta)}
          onAnimationEnd={() => {
            setChange((current) =>
              current.revision === change.revision ? { ...current, delta: 0 } : current,
            );
          }}
        >
          <CurrencyAmount
            kind={kind}
            amount={change.delta}
            size="sm"
            signed
            style={styles.deltaAmount}
          />
        </span>
      )}
    </span>
  );
}
