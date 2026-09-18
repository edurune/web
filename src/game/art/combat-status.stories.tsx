import type { Meta, StoryObj } from "@storybook/react-vite";
import { CombatStatus } from "./combat-status.tsx";

const meta = {
  title: "Game/Combat status",
  component: CombatStatus,
  tags: ["autodocs"],
  args: {
    guard: 0,
    effects: [
      { id: 1, kind: "modify_stat", stat: "attack", amount: 8 },
      { id: 2, kind: "modify_stat", stat: "speed", amount: -3 },
      { id: 3, kind: "shield", remaining: 12 },
    ],
  },
} satisfies Meta<typeof CombatStatus>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ActiveEffects: Story = {};
export const Guard: Story = { args: { guard: 0.5, effects: [] } };
export const Stacked: Story = {
  args: {
    effects: [
      { id: 1, kind: "modify_stat", stat: "defense", amount: 4 },
      { id: 2, kind: "modify_stat", stat: "defense", amount: 6 },
    ],
  },
};
export const Clear: Story = { args: { effects: [] } };
