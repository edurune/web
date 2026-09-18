import { useLingui } from "@lingui/react/macro";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { IconButton } from "../ui/primitives/button.tsx";
import { Meter } from "../ui/primitives/meter.tsx";
import { space } from "../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  root: { display: "flex", alignItems: "center", gap: space.md, padding: space.lg, flexShrink: 0 },
  meter: { flex: 1 },
});

/** Progress through account preferences and character creation. */
export function OnboardingProgress({
  step,
  totalSteps = 3,
  onBack,
  disabled,
  style,
}: {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
  disabled?: boolean;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  return (
    <div {...stylex.props(styles.root, style)}>
      {onBack && (
        <IconButton
          icon={ArrowLeftIcon}
          label={t`Back`}
          variant="ghost"
          cue="back"
          onClick={onBack}
          disabled={disabled}
        />
      )}
      <Meter
        value={step}
        max={totalSteps}
        size="sm"
        label={t`Getting started`}
        valueLabel={t`Step ${step} of ${totalSteps}`}
        style={styles.meter}
      />
    </div>
  );
}
