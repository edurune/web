import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import * as stylex from "@stylexjs/stylex";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { MissionCard, type MissionCardProps } from "./mission-card.tsx";

const styles = stylex.create({ card: { maxInlineSize: layout.portrait } });
const meta = {
  title: "Objectives/Mission card",
  component: MissionCard,
  tags: ["autodocs"],
  args: {
    mission: {
      objective: {
        id: "finish-lessons",
        metric: "lessons_completed",
        scope: { kind: "all_courses" },
        target: 2,
        reward: { coins: 30, gems: 0 },
      },
      progress: 1,
      status: "in_progress",
    },
    onClaim: () => {},
    onOpenCourse: () => {},
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<MissionCardProps>();
    return (
      <MissionCard
        {...args}
        style={styles.card}
        onClaim={() => updateArgs({ mission: { ...args.mission, status: "claimed" } })}
      />
    );
  },
} satisfies Meta<typeof MissionCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const InProgress: Story = {};
export const Ready: Story = {
  args: { mission: { ...meta.args.mission, progress: 2, status: "completed" } },
};
export const Claimed: Story = {
  args: { mission: { ...meta.args.mission, progress: 2, status: "claimed" } },
};

export const StudyDays: Story = {
  args: {
    mission: {
      objective: {
        id: "study-days-500",
        metric: "study_days",
        scope: { kind: "all_courses" },
        target: 500,
        reward: { coins: 250, gems: 2 },
      },
      progress: 300,
      status: "in_progress",
    },
  },
};

export const Accuracy: Story = {
  args: {
    mission: {
      objective: {
        id: "daily-accurate-battles-2",
        metric: "accurate_battles_won",
        scope: { kind: "all_courses" },
        target: 2,
        reward: { coins: 20, gems: 0 },
      },
      progress: 1,
      status: "in_progress",
    },
  },
};
