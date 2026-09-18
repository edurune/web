import { Trans, useLingui } from "@lingui/react/macro";
import { useNavigate } from "@tanstack/react-router";
import { BackpackIcon, CaretRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { BottomSheet } from "../ui/primitives/bottom-sheet.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Text } from "../ui/primitives/text.tsx";
import type { MapNode } from "./course-path.tsx";
import { useStartSessionMutation } from "../api/session/use-session-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Badge, DifficultyBadge } from "../ui/primitives/badge.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  actions: { display: "flex", gap: space.sm, inlineSize: layout.full },
  start: { flex: 1, minInlineSize: space.none },
  badges: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: space.sm },
});

export function PracticeSheet({
  courseId,
  node,
  open,
  onOpenChange,
  onClose,
}: {
  courseId: string;
  node: Extract<MapNode, { kind: "practice" }> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { t } = useLingui();
  const start = useStartSessionMutation();
  const hasActiveSession = Boolean(node?.activeSessionId);
  return (
    <BottomSheet
      open={open}
      dismissible={!start.isPending}
      title={node?.title}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(next) => {
        if (!next) {
          start.reset();
          onClose();
        }
      }}
      footer={
        <div {...stylex.props(styles.actions)}>
          <IconButton
            icon={BackpackIcon}
            label={t`Loadout`}
            size="lg"
            variant="secondary"
            cue="forward"
            disabled={start.isPending || !node}
            onClick={() => {
              onClose();
              void navigate({ to: "/courses/$courseId/loadout", params: { courseId } });
            }}
          />
          <Button
            size="lg"
            cue={hasActiveSession ? "forward" : "start"}
            iconEnd={CaretRightIcon}
            style={styles.start}
            loading={start.isPending}
            disabled={start.isPending || !node}
            onClick={() =>
              node &&
              start.mutate(
                { path: { courseId, itemId: node.id }, body: {} },
                {
                  onSuccess: (result) => {
                    onClose();
                    void navigate({
                      to: "/courses/$courseId/practices/$itemId/sessions/$sessionId",
                      params: { courseId, itemId: node.id, sessionId: result.id },
                    });
                  },
                },
              )
            }
          >
            {hasActiveSession ? <Trans>Continue battle</Trans> : <Trans>Practice</Trans>}
          </Button>
        </div>
      }
    >
      <Stack gap="lg">
        {node && (
          <div {...stylex.props(styles.badges)}>
            <DifficultyBadge difficulty={node.encounter.difficulty} />
            {node.encounter.kind === "boss" && (
              <Badge tone="negative">
                <Trans>Boss</Trans>
              </Badge>
            )}
          </div>
        )}
        {node?.description && <Text>{node.description}</Text>}
        {start.error && <Alert tone="negative">{t(errorMessage(start.error))}</Alert>}
      </Stack>
    </BottomSheet>
  );
}
