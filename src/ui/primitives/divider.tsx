import { Separator } from "@base-ui/react/separator";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "../tokens/color.stylex.ts";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  tone?: "subtle" | "strong";
  style?: StyleXStyles;
}

const styles = stylex.create({
  horizontal: { alignSelf: "stretch", height: "2px", borderRadius: "2px" },
  vertical: { alignSelf: "stretch", width: "2px", borderRadius: "2px" },
  subtle: { backgroundColor: color.borderSubtle },
  strong: { backgroundColor: color.borderStrong },
});

export function Divider({ orientation = "horizontal", tone = "subtle", style }: DividerProps) {
  return (
    <Separator
      orientation={orientation}
      {...stylex.props(styles[orientation], styles[tone], style)}
    />
  );
}
