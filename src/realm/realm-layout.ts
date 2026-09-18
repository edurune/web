import * as stylex from "@stylexjs/stylex";
import { color } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";

export const realmStyles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  scroll: { flex: 1, minBlockSize: space.none },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    padding: space.lg,
    minInlineSize: space.none,
  },
  row: { display: "flex", alignItems: "center", gap: space.sm, minInlineSize: space.none },
  grow: { flex: 1, minInlineSize: space.none },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    flexShrink: 0,
    borderBlockEndWidth: borderWidth.thick,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color.borderStrong,
  },
  grid: { display: "grid", gridTemplateColumns: realmLayout.shopColumns, gap: space.md },
  art: { inlineSize: realmLayout.slotArt },
  icon: { inlineSize: realmLayout.statIcon },
});
