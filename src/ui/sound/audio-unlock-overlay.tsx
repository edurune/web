import { Trans } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import { useSyncExternalStore } from "react";
import { color } from "../tokens/color.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { getAudioBlocked, subscribeToAudioBlocked } from "./audio-gate.ts";
import { unlockMusic } from "./music.ts";
import { unlockSound } from "./sound.ts";

const styles = stylex.create({
  overlay: {
    position: "fixed",
    inset: space.none,
    zIndex: layer.tooltip,
    display: "grid",
    placeItems: "center",
    padding: space.xl,
    appearance: "none",
    borderWidth: space.none,
    backgroundColor: color.surfaceAudioScrim,
    color: color.textInverse,
    cursor: "pointer",
    fontFamily: font.display,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
});

export function AudioUnlockOverlay() {
  const blocked = useSyncExternalStore(subscribeToAudioBlocked, getAudioBlocked, getAudioBlocked);
  if (!blocked) return null;

  return (
    <button
      type="button"
      {...stylex.props(styles.overlay)}
      onClick={() => void Promise.all([unlockSound(), unlockMusic()])}
    >
      <Trans>Click to resume</Trans>
    </button>
  );
}
