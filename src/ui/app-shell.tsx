import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { GuestBanner } from "../user/guest-banner.tsx";
import { color } from "./tokens/color.stylex.ts";
import { layout } from "./tokens/layout.stylex.ts";
import { space } from "./tokens/space.stylex.ts";

const styles = stylex.create({
  shell: {
    display: "flex",
    flexDirection: "column",
    blockSize: layout.viewport,
    inlineSize: layout.full,
    maxInlineSize: layout.portrait,
    marginInline: "auto",
    minInlineSize: space.none,
    minBlockSize: space.none,
    overflow: "hidden",
    backgroundColor: color.surfacePage,
    paddingBlockStart: layout.safeTop,
    isolation: "isolate",
  },
  body: {
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
});

export function AppShell({
  children,
  navigation,
  anonymous,
  onLogin,
  style,
}: {
  children: ReactNode;
  navigation?: ReactNode;
  anonymous: boolean;
  onLogin: () => void;
  style?: StyleXStyles;
}) {
  return (
    <div {...stylex.props(styles.shell, style)}>
      {anonymous && <GuestBanner onLogin={onLogin} />}
      <div {...stylex.props(styles.body)}>{children}</div>
      {navigation}
    </div>
  );
}
