import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { PublicUser } from "../api/generated/types.gen.ts";
import { Text } from "../ui/primitives/text.tsx";

const styles = stylex.create({ name: { overflowWrap: "anywhere" } });

export function CourseCreator({
  creator,
  tone = "secondary",
}: {
  creator: PublicUser | null;
  tone?: "secondary" | "inverse";
}) {
  const { t } = useLingui();
  const name = creator?.name ?? "EduRune";
  return (
    <Text variant="caption" tone={tone} style={styles.name}>
      {t`By ${name}`}
    </Text>
  );
}
