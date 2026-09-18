import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Button } from "../ui/primitives/button.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { cosmeticSlotLabels, cosmeticSlots, type CosmeticSlot } from "./cosmetics.ts";

const styles = stylex.create({
  root: { flex: 1, minInlineSize: space.none },
  content: { display: "flex", alignItems: "center", gap: space.xs, padding: space.sm },
});
export function CosmeticCategories({
  slot,
  onChange,
  style,
}: {
  slot: CosmeticSlot;
  onChange: (slot: CosmeticSlot) => void;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  return (
    <ScrollArea
      orientation="horizontal"
      indicator="fade"
      label={t`Categories`}
      style={[styles.root, style]}
      contentStyle={styles.content}
    >
      {cosmeticSlots.map((value) => (
        <Button
          key={value}
          size="sm"
          variant={slot === value ? "primary" : "secondary"}
          aria-pressed={slot === value}
          cue="select"
          onClick={() => onChange(value)}
        >
          {t(cosmeticSlotLabels[value])}
        </Button>
      ))}
    </ScrollArea>
  );
}
