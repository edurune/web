import type { Meta, StoryObj } from "@storybook/react-vite";
import { TShirtIcon, SparkleIcon, GearSixIcon } from "@phosphor-icons/react";
import { ActionRow } from "./action-row.tsx";
const meta = {
  title: "Primitives/Action row",
  component: ActionRow,
  tags: ["autodocs"],
  args: { icon: TShirtIcon, title: "Wardrobe", detail: "41 owned", tone: "sage" },
  argTypes: {
    icon: { control: false },
    tone: { control: "select", options: ["sage", "gold", "neutral"] },
  },
} satisfies Meta<typeof ActionRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Wardrobe: Story = {};
export const Milestones: Story = {
  args: {
    icon: SparkleIcon,
    title: "Milestones",
    detail: undefined,
    trailing: "4 / 22",
    tone: "gold",
  },
};
export const Settings: Story = {
  args: { icon: GearSixIcon, title: "Settings", detail: undefined, tone: "neutral" },
};
