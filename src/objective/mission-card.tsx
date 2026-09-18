import { Plural, Trans, useLingui } from "@lingui/react/macro";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { GetApiMissionsCurrentResponse } from "../api/generated/types.gen.ts";
import { Button } from "../ui/primitives/button.tsx";
import { CurrencyAmount } from "../ui/primitives/currency-amount.tsx";
import { Meter } from "../ui/primitives/meter.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import type { CueName } from "../ui/sound/sound.ts";

type Mission = GetApiMissionsCurrentResponse["missions"][number];

function ObjectiveLabel({ objective }: { objective: Mission["objective"] }) {
  const target = objective.target;
  switch (objective.metric) {
    case "lessons_completed":
      return <Plural value={target} one="Finish # lesson" other="Finish # lessons" />;
    case "practices_completed":
      return <Plural value={target} one="Clear # practice" other="Clear # practices" />;
    case "battles_won":
      return <Plural value={target} one="Win # battle" other="Win # battles" />;
    case "units_completed":
      return <Plural value={target} one="Clear # unit" other="Clear # units" />;
    case "courses_completed":
      return <Plural value={target} one="Complete # course" other="Complete # courses" />;
    case "study_days":
      return <Plural value={target} one="Learn on # day" other="Learn on # days" />;
    case "correct_answers":
      return (
        <Plural
          value={target}
          one="Answer # question correctly in won battles"
          other="Answer # questions correctly in won battles"
        />
      );
    case "reviews_won":
      return <Plural value={target} one="Win # unit review" other="Win # unit reviews" />;
    case "replays_won":
      return <Plural value={target} one="Win # practice replay" other="Win # practice replays" />;
    case "accurate_battles_won":
      return (
        <Plural
          value={target}
          one="Win # battle with at least 80% accuracy"
          other="Win # battles with at least 80% accuracy"
        />
      );
    case "perfect_battles_won":
      return (
        <Plural
          value={target}
          one="Win # battle with perfect accuracy"
          other="Win # battles with perfect accuracy"
        />
      );
  }
}

function ObjectiveDetail({ metric }: { metric: Mission["objective"]["metric"] }) {
  switch (metric) {
    case "study_days":
      return (
        <Trans>
          Complete a new lesson or submit a practice answer. Days do not need to be consecutive.
        </Trans>
      );
    case "correct_answers":
      return <Trans>Only the first answer to each question in a won battle counts.</Trans>;
    case "accurate_battles_won":
    case "perfect_battles_won":
      return (
        <Trans>
          Answer at least 5 different questions in each battle. Accuracy uses your first answer to
          each question.
        </Trans>
      );
    default:
      return null;
  }
}

export interface MissionCardProps {
  mission: Mission;
  claiming?: boolean;
  claimDisabled?: boolean;
  /** A daily mission pays out; a permanent milestone is worth more noise. */
  claimCue?: CueName;
  onClaim: () => void;
  onOpenCourse: (courseId: string) => void;
  style?: StyleXStyles;
}

export function MissionCard({
  mission,
  claiming,
  claimDisabled,
  claimCue = "reward",
  onClaim,
  onOpenCourse,
  style,
}: MissionCardProps) {
  const { t } = useLingui();
  const { objective, progress, status } = mission;
  const target = objective.target;
  const scope = objective.scope;
  return (
    <Surface depth="lifted" padding="md" style={style}>
      <Stack gap="sm">
        <Text variant="bodyStrong">
          <ObjectiveLabel objective={objective} />
        </Text>
        {["study_days", "correct_answers", "accurate_battles_won", "perfect_battles_won"].includes(
          objective.metric,
        ) && (
          <Text variant="caption" tone="muted">
            <ObjectiveDetail metric={objective.metric} />
          </Text>
        )}
        <Meter
          label={t`Progress`}
          size="sm"
          value={progress}
          max={target}
          valueLabel={t`${progress} of ${target} complete`}
        />
        {scope.kind === "course" && (
          <Button
            variant="ghost"
            size="sm"
            cue="forward"
            onClick={() => {
              onOpenCourse(scope.courseId);
            }}
          >
            <Trans>View course</Trans>
          </Button>
        )}
        <Stack direction="row" justify="between">
          <Stack direction="row" gap="sm">
            {objective.reward.coins > 0 && (
              <CurrencyAmount kind="coin" amount={objective.reward.coins} size="sm" />
            )}
            {objective.reward.gems > 0 && (
              <CurrencyAmount kind="gem" amount={objective.reward.gems} size="sm" />
            )}
          </Stack>
          {status === "completed" && (
            <Button
              size="sm"
              cue={claimCue}
              loading={claiming}
              disabled={claimDisabled}
              onClick={onClaim}
            >
              <Trans>Claim</Trans>
            </Button>
          )}
          {status === "claimed" && (
            <Text variant="caption" tone="positive">
              <Trans>Claimed</Trans>
            </Text>
          )}
        </Stack>
      </Stack>
    </Surface>
  );
}
