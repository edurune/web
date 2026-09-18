import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import type { CueName } from "../sound/sound.ts";
import { useSoundWhen } from "../sound/use-sound-when.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { color } from "../tokens/color.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { control } from "../tokens/size.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";

export type NoticeTone = "info" | "caution";

export interface NoticeBarProps {
  tone?: NoticeTone;
  /** Glyph before the message. */
  icon?: PhosphorIcon;
  /** Glyph after the message, for a strip that leads somewhere. */
  iconEnd?: PhosphorIcon;
  children: ReactNode;
  /** Controls rendered after the message. */
  actions?: ReactNode;
  /** Makes the whole strip pressable. */
  onPress?: () => void;
  /** The cue this press means. `null` silences it. */
  cue?: CueName | null;
  /** The cue this strip's arrival means. `null` stays silent. */
  announce?: CueName | null;
  style?: StyleXStyles;
}

const styles = stylex.create({
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    minBlockSize: control.sm,
    flexShrink: 0,
    paddingBlock: space.xs,
    paddingInline: space.md,
    borderWidth: borderWidth.none,
    color: color.textPrimary,
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  pressable: {
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineColor: color.borderFocus,
    outlineOffset: space.xxs,
  },
  glyph: { display: "block", flexShrink: 0 },
  label: { minInlineSize: space.none },
});

const tones = stylex.create({
  info: { backgroundColor: color.infoSoft },
  caution: { backgroundColor: color.cautionSoft },
});

export function NoticeBar({
  tone = "info",
  icon: Glyph,
  iconEnd: EndGlyph,
  children,
  actions,
  onPress,
  cue = "press",
  announce = null,
  style,
}: NoticeBarProps) {
  useSoundWhen(announce, announce !== null);
  const content = (
    <>
      {Glyph ? (
        <Glyph
          size={iconSize.sm}
          weight="bold"
          aria-hidden="true"
          {...stylex.props(styles.glyph)}
        />
      ) : null}
      <span {...stylex.props(styles.label)}>{children}</span>
      {EndGlyph ? (
        <EndGlyph
          size={iconSize.sm}
          weight="bold"
          aria-hidden="true"
          {...stylex.props(styles.glyph)}
        />
      ) : null}
      {actions}
    </>
  );

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        data-uisfx={cue ?? undefined}
        {...stylex.props(styles.bar, tones[tone], styles.pressable, style)}
      >
        {content}
      </button>
    );
  }

  return (
    <div role="status" {...stylex.props(styles.bar, tones[tone], style)}>
      {content}
    </div>
  );
}
