import { Trans, useLingui } from "@lingui/react/macro";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { Field } from "../ui/primitives/field.tsx";
import { NumberField } from "../ui/primitives/number-field.tsx";
import { OnboardingStep } from "./onboarding-step.tsx";

/** Collects a four-digit year without inferring or preselecting an age. */
export function BirthYearStep({
  value,
  onValueChange,
  onContinue,
  onBack,
  totalSteps,
  pending,
  error,
  style,
}: {
  value: number | null;
  onValueChange: (value: number | null) => void;
  onContinue: (year: number) => void;
  onBack: () => void;
  totalSteps?: number;
  pending?: boolean;
  error?: unknown;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const [submitted, setSubmitted] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const currentYear = new Date().getUTCFullYear();
  const valid = value !== null && Number.isInteger(value) && value >= 1900 && value <= currentYear;
  const invalid = submitted && !valid;
  return (
    <OnboardingStep
      title={<Trans>What year were you born?</Trans>}
      description={<Trans>This helps us suggest courses for your age.</Trans>}
      icon={CalendarBlankIcon}
      step={2}
      totalSteps={totalSteps}
      onContinue={() => {
        setSubmitted(true);
        if (valid) onContinue(value);
        else input.current?.focus();
      }}
      onBack={onBack}
      pending={pending}
      error={error}
      style={style}
    >
      <Field
        label={t`Birth year`}
        description={t`Enter your four-digit birth year.`}
        error={invalid ? t`Enter a year from 1900 to ${currentYear}.` : undefined}
        disabled={pending}
      >
        <NumberField
          inputRef={input}
          name="birthYear"
          autoComplete="bday-year"
          size="lg"
          value={value}
          min={1900}
          max={currentYear}
          step={1}
          smallStep={1}
          allowOutOfRange
          format={{ useGrouping: false }}
          invalid={invalid}
          disabled={pending}
          required
          onValueChange={onValueChange}
        />
      </Field>
    </OnboardingStep>
  );
}
