import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { control } from "../ui/tokens/size.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../ui/tokens/text.stylex.ts";

const styles = stylex.create({
  banner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    minBlockSize: control.sm,
    flexShrink: 0,
    paddingBlock: space.xs,
    paddingInline: space.md,
    backgroundColor: color.cautionSoft,
    color: color.textPrimary,
    borderWidth: borderWidth.none,
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineColor: color.borderFocus,
    outlineOffset: space.xxs,
  },
});

export function GuestBanner({ onLogin, style }: { onLogin: () => void; style?: StyleXStyles }) {
  return (
    <button
      type="button"
      onClick={onLogin}
      data-uisfx="forward"
      {...stylex.props(styles.banner, style)}
    >
      <Trans>Log in to save your progress</Trans>
      <ArrowRightIcon weight="bold" size={iconSize.sm} aria-hidden="true" />
    </button>
  );
}
