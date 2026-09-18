import { Trans } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { SessionView } from "../api/generated/types.gen.ts";
import { DifficultyBadge } from "../ui/primitives/badge.tsx";
import { BottomSheet, BottomSheetClose } from "../ui/primitives/bottom-sheet.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { space } from "../ui/tokens/space.stylex.ts";

export interface PracticeInfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  unitTitle?: string;
  itemTitle?: string;
  description?: string;
  difficulty: SessionView["encounter"]["difficulty"];
  style?: StyleXStyles;
}

const styles = stylex.create({
  facts: { display: "flex", flexDirection: "column", gap: space.md, margin: space.none },
  fact: { display: "flex", flexDirection: "column", gap: space.xxs },
  value: { margin: space.none },
});

export function PracticeInfoSheet({
  open,
  onOpenChange,
  courseTitle,
  unitTitle,
  itemTitle,
  description,
  difficulty,
  style,
}: PracticeInfoSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={itemTitle ?? <Trans>Practice</Trans>}
      description={description}
      footer={
        <BottomSheetClose render={<Button fullWidth cue={null} />}>
          <Trans>Back to battle</Trans>
        </BottomSheetClose>
      }
      style={style}
    >
      <dl {...stylex.props(styles.facts)}>
        <div {...stylex.props(styles.fact)}>
          <Text as="dt" variant="label" tone="secondary">
            <Trans>Course</Trans>
          </Text>
          <Text as="dd" variant="bodyStrong" style={styles.value}>
            {courseTitle}
          </Text>
        </div>
        {unitTitle && (
          <div {...stylex.props(styles.fact)}>
            <Text as="dt" variant="label" tone="secondary">
              <Trans>Unit</Trans>
            </Text>
            <Text as="dd" variant="bodyStrong" style={styles.value}>
              {unitTitle}
            </Text>
          </div>
        )}
        <div {...stylex.props(styles.fact)}>
          <Text as="dt" variant="label" tone="secondary">
            <Trans>Difficulty</Trans>
          </Text>
          <dd {...stylex.props(styles.value)}>
            <DifficultyBadge difficulty={difficulty} size="md" />
          </dd>
        </div>
      </dl>
    </BottomSheet>
  );
}
