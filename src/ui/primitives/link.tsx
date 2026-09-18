import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ElementType, ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { fontWeight } from "../tokens/text.stylex.ts";

export interface LinkProps {
  children: ReactNode;
  href?: string;
  to?: string;
  /** Swap for the router Link when navigating inside the app. */
  as?: ElementType;
  external?: boolean;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xxs,
    borderRadius: "4px",
    color: { default: color.textLink, ":hover": color.infoStrong },
    fontWeight: fontWeight.semibold,
    textDecorationLine: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "3px",
    outlineColor: { ":focus-visible": color.borderFocus },
    outlineStyle: { ":focus-visible": "solid" },
    outlineWidth: { ":focus-visible": "3px" },
    outlineOffset: { ":focus-visible": "2px" },
  },
});

export function Link({ children, href, to, as: Component = "a", external, style }: LinkProps) {
  return (
    <Component
      href={href}
      to={to}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      {...stylex.props(styles.root, style)}
    >
      {children}
    </Component>
  );
}
