import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: unknown) => void;
  children: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.lg, minWidth: 0 },
  list: {
    position: "relative",
    display: "flex",
    gap: space.xxs,
    padding: space.xxs,
    backgroundColor: color.surfaceSunken,
    borderRadius: radius.pill,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderColor: press.edgeColor,
  },
  indicator: {
    position: "absolute",
    insetBlock: space.xxs,
    insetInlineStart: 0,
    width: "var(--active-tab-width)",
    backgroundColor: color.surfaceRaised,
    borderRadius: radius.pill,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBottomWidth: press.lipWidth,
    borderColor: press.edgeColor,
    translate: "var(--active-tab-left) 0",
    transitionProperty: "translate, width",
    transitionDuration: duration.normal,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
  tab: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    flex: 1,
    minHeight: "36px",
    paddingInline: space.md,
    backgroundColor: "transparent",
    borderRadius: radius.pill,
    borderWidth: 0,
    color: { default: color.textMuted, ":is([data-active])": color.textPrimary },
    cursor: "pointer",
    fontFamily: font.display,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    outlineColor: { ":focus-visible": color.borderFocus },
    outlineStyle: { ":focus-visible": "solid" },
    outlineWidth: { ":focus-visible": "3px" },
    outlineOffset: { ":focus-visible": "2px" },
    whiteSpace: "nowrap",
  },
  panel: { minWidth: 0, outline: "none" },
});

export function Tabs({ value, defaultValue, onValueChange, children, style }: TabsProps) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      {...stylex.props(styles.root, style)}
    >
      {children}
    </BaseTabs.Root>
  );
}

export function TabList({ children, style }: { children: ReactNode; style?: StyleXStyles }) {
  return (
    <BaseTabs.List {...stylex.props(styles.list, style)}>
      <BaseTabs.Indicator {...stylex.props(styles.indicator)} />
      {children}
    </BaseTabs.List>
  );
}

export function Tab({
  value,
  children,
  style,
}: {
  value: string;
  children: ReactNode;
  style?: StyleXStyles;
}) {
  return (
    <BaseTabs.Tab value={value} data-uisfx="select" {...stylex.props(styles.tab, style)}>
      {children}
    </BaseTabs.Tab>
  );
}

export function TabPanel({
  value,
  children,
  style,
}: {
  value: string;
  children: ReactNode;
  style?: StyleXStyles;
}) {
  return (
    <BaseTabs.Panel value={value} {...stylex.props(styles.panel, style)}>
      {children}
    </BaseTabs.Panel>
  );
}
