import * as stylex from "@stylexjs/stylex";
import { color } from "../ui/tokens/color.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { wardrobeLayout } from "../ui/tokens/wardrobe.stylex.ts";

export const cosmeticLayout = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    padding: space.sm,
    flexShrink: 0,
    borderBlockEndWidth: borderWidth.thick,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color.borderStrong,
    backgroundColor: color.surfaceRaised,
  },
  title: { flex: 1 },
  catalogBar: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    minInlineSize: space.none,
    paddingInlineEnd: space.sm,
    flexShrink: 0,
  },
  scroll: { flex: 1, minBlockSize: space.none },
  content: { display: "flex", flexDirection: "column", gap: space.md, padding: space.lg },
  grid: { display: "grid", gridTemplateColumns: wardrobeLayout.columns, gap: space.sm },
});
