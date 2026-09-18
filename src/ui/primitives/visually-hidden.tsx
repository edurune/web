import * as stylex from "@stylexjs/stylex";
import type { ElementType, ReactNode } from "react";

export interface VisuallyHiddenProps {
  children: ReactNode;
  as?: ElementType;
}

const styles = stylex.create({
  root: {
    position: "absolute",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: 0,
    border: 0,
    clipPath: "inset(50%)",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
});

/** Readable by assistive tech, invisible on screen. */
export function VisuallyHidden({ children, as: Component = "span" }: VisuallyHiddenProps) {
  return <Component {...stylex.props(styles.root)}>{children}</Component>;
}
