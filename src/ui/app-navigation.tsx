import { Trans, useLingui } from "@lingui/react/macro";
import {
  GameControllerIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { borderWidth } from "./tokens/border.stylex.ts";
import { color } from "./tokens/color.stylex.ts";
import { layout } from "./tokens/layout.stylex.ts";
import { iconSize } from "./tokens/scale.ts";
import { space } from "./tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "./tokens/text.stylex.ts";

export interface AppNavigationProps {
  active: "home" | "search" | "challenges" | "me";
  onHome: () => void;
  onSearch: () => void;
  onChallenges: () => void;
  onMe: () => void;
  style?: StyleXStyles;
}

const styles = stylex.create({
  nav: {
    display: "flex",
    flexShrink: 0,
    minBlockSize: layout.navigation,
    paddingBlockStart: space.sm,
    paddingBlockEnd: `max(${space.sm}, ${layout.safeBottom})`,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: borderWidth.thick,
    borderBlockStartColor: color.borderStrong,
    backgroundColor: color.surfaceRaised,
  },
  destination: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    flex: 1,
    padding: space.xs,
    borderWidth: borderWidth.none,
    backgroundColor: color.surfaceRaised,
    color: {
      default: color.textSecondary,
      ":is([data-active])": color.accentStrong,
      ":disabled": color.textMuted,
    },
    fontFamily: font.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    cursor: { default: "pointer", ":disabled": "default" },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineColor: color.borderFocus,
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
});

export function AppNavigation({
  active,
  onHome,
  onSearch,
  onChallenges,
  onMe,
  style,
}: AppNavigationProps) {
  const { t } = useLingui();
  return (
    <nav aria-label={t`Main navigation`} {...stylex.props(styles.nav, style)}>
      <button
        type="button"
        onClick={onHome}
        data-active={active === "home" || undefined}
        aria-current={active === "home" ? "page" : undefined}
        data-uisfx="select"
        {...stylex.props(styles.destination)}
      >
        <HouseIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        <Trans>Home</Trans>
      </button>
      <button
        type="button"
        onClick={onSearch}
        data-active={active === "search" || undefined}
        aria-current={active === "search" ? "page" : undefined}
        data-uisfx="select"
        {...stylex.props(styles.destination)}
      >
        <MagnifyingGlassIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        <Trans>Search</Trans>
      </button>
      <button
        type="button"
        onClick={onChallenges}
        data-active={active === "challenges" || undefined}
        aria-current={active === "challenges" ? "page" : undefined}
        data-uisfx="select"
        {...stylex.props(styles.destination)}
      >
        <GameControllerIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        <Trans>Challenges</Trans>
      </button>
      <button
        type="button"
        onClick={onMe}
        data-active={active === "me" || undefined}
        aria-current={active === "me" ? "page" : undefined}
        data-uisfx="select"
        {...stylex.props(styles.destination)}
      >
        <UserIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        <Trans>Me</Trans>
      </button>
    </nav>
  );
}
