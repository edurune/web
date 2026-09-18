import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowRightIcon, type Icon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useEffect, useRef, type ReactNode } from "react";
import { errorMessage } from "../api/error-messages.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../ui/tokens/text.stylex.ts";
import { OnboardingProgress } from "./onboarding-progress.tsx";

const styles = stylex.create({
  form: {
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
    gap: space.xxl,
    padding: space.xl,
    paddingBlockStart: space.xxl,
  },
  introduction: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: space.lg,
    textAlign: "center",
  },
  icon: {
    display: "grid",
    placeItems: "center",
    inlineSize: layout.emptyStateIcon,
    blockSize: layout.emptyStateIcon,
    borderRadius: radius.circle,
    backgroundColor: color.cautionFill,
    color: color.textPrimary,
  },
  heading: {
    margin: space.none,
    outline: "none",
    fontFamily: font.display,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    flexShrink: 0,
    padding: space.lg,
    paddingBlockEnd: `max(${space.lg}, ${layout.safeBottom})`,
  },
});

/** One question with its own progress, validation, and continue action. */
export function OnboardingStep({
  title,
  description,
  icon: Glyph,
  step,
  totalSteps = 3,
  children,
  onContinue,
  onBack,
  pending,
  error,
  style,
}: {
  title: ReactNode;
  description: ReactNode;
  icon: Icon;
  step: number;
  totalSteps?: number;
  children: ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  pending?: boolean;
  error?: unknown;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <form
      noValidate
      {...stylex.props(styles.form, style)}
      onSubmit={(event) => {
        event.preventDefault();
        if (!pending) onContinue();
      }}
    >
      <OnboardingProgress step={step} totalSteps={totalSteps} onBack={onBack} disabled={pending} />
      <ScrollArea
        label={t`Getting started`}
        indicator="fade"
        style={styles.scroll}
        contentStyle={styles.content}
      >
        <div {...stylex.props(styles.introduction)}>
          <span aria-hidden="true" {...stylex.props(styles.icon)}>
            <Glyph size={iconSize.xl} weight="bold" />
          </span>
          <h1 ref={heading} tabIndex={-1} {...stylex.props(styles.heading)}>
            {title}
          </h1>
          <Text tone="secondary">{description}</Text>
        </div>
        {children}
      </ScrollArea>
      <div {...stylex.props(styles.footer)}>
        {error != null && <Alert tone="negative">{t(errorMessage(error))}</Alert>}
        <Button
          type="submit"
          fullWidth
          size="lg"
          cue="forward"
          loading={pending}
          disabled={pending}
          iconEnd={ArrowRightIcon}
        >
          <Trans>Continue</Trans>
        </Button>
      </div>
    </form>
  );
}
