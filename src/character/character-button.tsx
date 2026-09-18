import * as stylex from "@stylexjs/stylex";
import { CharacterPortrait, type CharacterPortraitProps } from "../game/art/character-portrait.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { press } from "../ui/tokens/press.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { hoverCue } from "../ui/sound/hover-cue.ts";

const styles = stylex.create({
  button: {
    position: "relative",
    display: "block",
    inlineSize: layout.characterFigure,
    padding: space.none,
    borderWidth: borderWidth.none,
    borderRadius: radius.xl,
    backgroundColor: color.surfaceTransparent,
    color: color.textPrimary,
    cursor: "pointer",
    outlineColor: color.borderFocus,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
    translate: { default: "none", ":active": `0 ${press.lipTravel}` },
  },
  portrait: { inlineSize: layout.full },
});

/** The character itself as a press target, on screens where tapping it leads somewhere. */
export function CharacterButton({
  onClick,
  label,
  style,
  ...portrait
}: CharacterPortraitProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      data-uisfx="forward"
      {...hoverCue}
      {...stylex.props(styles.button, style)}
    >
      <span aria-hidden="true">
        <CharacterPortrait {...portrait} label="" style={styles.portrait} />
      </span>
    </button>
  );
}
