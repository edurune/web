import type { Meta, StoryObj } from "@storybook/react-vite";
import { BattleLog } from "./battle-log.tsx";

const meta = {
  title: "Game/Battle log",
  component: BattleLog,
  tags: ["autodocs"],
  args: { message: "Moss slime lost 24 HP.", iconId: "icon-resource-health" },
} satisfies Meta<typeof BattleLog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Damage: Story = {};
export const Defeated: Story = {
  args: { message: "Acornling was defeated.", iconId: "icon-effect-defeat" },
};
export const Move: Story = {
  args: { message: "Grove guardian used Root wall.", iconId: "icon-effect-shield" },
};
export const Idle: Story = { args: { message: "Your turn.", iconId: "icon-action-attack" } };
