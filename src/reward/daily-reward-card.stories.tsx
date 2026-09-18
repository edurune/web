import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import * as stylex from "@stylexjs/stylex";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { DailyRewardCard, type DailyRewardCardProps } from "./daily-reward-card.tsx";

const styles = stylex.create({ card: { maxInlineSize: layout.portrait } });
const meta = {
  title: "Rewards/Daily reward card",
  component: DailyRewardCard,
  tags: ["autodocs"],
  args: {
    title: "Daily reward",
    reward: {
      day: "2026-09-16",
      startsAt: "2026-09-16T00:00:00Z",
      resetsAt: "2026-09-17T00:00:00Z",
      timeZone: "UTC",
      claimed: false,
      streak: 3,
      rewardDay: 4,
      reward: { coins: 30, gems: 0 },
      rewards: [
        { coins: 10, gems: 0 },
        { coins: 15, gems: 0 },
        { coins: 20, gems: 0 },
        { coins: 30, gems: 0 },
        { coins: 40, gems: 0 },
        { coins: 50, gems: 0 },
        { coins: 0, gems: 2 },
      ],
    },
    onClaim: () => {},
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DailyRewardCardProps>();
    return (
      <DailyRewardCard
        {...args}
        style={styles.card}
        onClaim={() =>
          updateArgs({ reward: { ...args.reward, claimed: true, streak: args.reward.streak + 1 } })
        }
      />
    );
  },
} satisfies Meta<typeof DailyRewardCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const Claiming: Story = { args: { claiming: true } };
export const Claimed: Story = {
  args: { reward: { ...meta.args.reward, claimed: true, streak: 4 } },
};
export const FirstDay: Story = {
  args: {
    reward: { ...meta.args.reward, streak: 0, rewardDay: 1, reward: meta.args.reward.rewards[0]! },
  },
};
export const FinalDay: Story = {
  args: {
    reward: {
      ...meta.args.reward,
      streak: 6,
      rewardDay: 7,
      reward: { coins: 50, gems: 1 },
      rewards: [...meta.args.reward.rewards.slice(0, 6), { coins: 50, gems: 1 }],
    },
  },
};
