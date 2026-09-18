import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { fn } from "storybook/test";
import { Field } from "../ui/primitives/field.tsx";
import { NumberField } from "../ui/primitives/number-field.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { OnboardingStep } from "./onboarding-step.tsx";

const styles = stylex.create({
  frame: {
    display: "flex",
    flexDirection: "column",
    inlineSize: layout.full,
    maxInlineSize: layout.portrait,
    blockSize: `calc(${layout.viewport} - ${space.xxl})`,
  },
});
const meta = {
  title: "User/OnboardingStep",
  component: OnboardingStep,
  tags: ["autodocs"],
  args: {
    title: "What year were you born?",
    description: "This helps us suggest courses for your age.",
    icon: CalendarBlankIcon,
    step: 2,
    totalSteps: 3,
    onContinue: fn(),
    onBack: fn(),
    children: (
      <Field label="Birth year">
        <NumberField
          autoComplete="bday-year"
          size="lg"
          min={1900}
          max={new Date().getUTCFullYear()}
          smallStep={1}
          allowOutOfRange
          format={{ useGrouping: false }}
        />
      </Field>
    ),
  },
  argTypes: { icon: { control: false }, children: { control: false }, error: { control: false } },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OnboardingStep>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
