import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { OnboardingProgress } from "./onboarding-progress.tsx";

const meta = {
  title: "User/OnboardingProgress",
  component: OnboardingProgress,
  tags: ["autodocs"],
  args: { step: 1, totalSteps: 3 },
} satisfies Meta<typeof OnboardingProgress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const First: Story = {};
export const WithBack: Story = { args: { step: 2, onBack: fn() } };
export const Last: Story = { args: { step: 3, onBack: fn() } };
