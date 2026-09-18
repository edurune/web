import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Trans } from "@lingui/react/macro";
import { Component, type ReactNode } from "react";
import { artSize } from "../../ui/tokens/art.stylex.ts";
import { Text } from "../../ui/primitives/text.tsx";

const styles = stylex.create({
  root: { display: "block", maxWidth: "100%", flexShrink: 0 },
  character: { width: artSize.character },
  equipment: { width: artSize.equipment },
  icon: { width: artSize.icon },
  scene: { width: artSize.scene },
  ratio: (ratio: string) => ({ aspectRatio: ratio }),
});
class ArtBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { failed: boolean; seen: string }
> {
  override state = { failed: false, seen: this.props.resetKey };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  static getDerivedStateFromProps(props: { resetKey: string }, state: { seen: string }) {
    return props.resetKey === state.seen ? null : { failed: false, seen: props.resetKey };
  }
  override render() {
    return this.state.failed ? (
      <div role="alert">
        <Text>
          <Trans>Artwork unavailable</Trans>
        </Text>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function ArtSurface({
  children,
  label,
  kind,
  ratio = "1",
  resetKey,
  style,
}: {
  children: ReactNode;
  label: string;
  kind: "character" | "equipment" | "icon" | "scene";
  ratio?: string;
  resetKey: string;
  style?: StyleXStyles;
}) {
  return (
    <ArtBoundary resetKey={resetKey}>
      <div
        role="img"
        aria-label={label}
        {...stylex.props(styles.root, styles[kind], styles.ratio(ratio), style)}
      >
        {children}
      </div>
    </ArtBoundary>
  );
}
