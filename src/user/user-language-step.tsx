import { Trans, useLingui } from "@lingui/react/macro";
import { TranslateIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { GetApiMeResponse } from "../api/generated/types.gen.ts";
import { Field } from "../ui/primitives/field.tsx";
import { RadioGroup, RadioOption } from "../ui/primitives/radio-group.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { press } from "../ui/tokens/press.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { OnboardingStep } from "./onboarding-step.tsx";

type UserLanguage = GetApiMeResponse["language"];
const styles = stylex.create({
  option: {
    inlineSize: layout.full,
    minBlockSize: space.huge,
    padding: space.lg,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBlockEndWidth: press.lipWidth,
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
    backgroundColor: { default: color.surfaceRaised, ":has([data-checked])": color.accentSoft },
  },
});

/** The account's learning language, independent of the interface locale. */
export function UserLanguageStep({
  value,
  onValueChange,
  onContinue,
  totalSteps,
  pending,
  error,
  style,
}: {
  value: UserLanguage;
  onValueChange: (value: UserLanguage) => void;
  onContinue: () => void;
  totalSteps?: number;
  pending?: boolean;
  error?: unknown;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  return (
    <OnboardingStep
      title={<Trans>Which language do you learn in?</Trans>}
      description={<Trans>Choose the language you’re most comfortable reading.</Trans>}
      icon={TranslateIcon}
      step={1}
      totalSteps={totalSteps}
      onContinue={onContinue}
      pending={pending}
      error={error}
      style={style}
    >
      <Field label={t`Learning language`} disabled={pending}>
        <RadioGroup
          name="language"
          value={value}
          disabled={pending}
          onValueChange={(next) => {
            if (next === "en" || next === "vi") onValueChange(next);
          }}
        >
          <RadioOption value="en" disabled={pending} style={styles.option}>
            <Trans>English</Trans>
          </RadioOption>
          <RadioOption value="vi" disabled={pending} style={styles.option}>
            <Trans>Vietnamese</Trans>
          </RadioOption>
        </RadioGroup>
      </Field>
    </OnboardingStep>
  );
}
