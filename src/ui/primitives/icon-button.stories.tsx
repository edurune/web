import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClipboardTextIcon, GiftIcon } from "@phosphor-icons/react";
import { IconButton } from "./button.tsx";

const meta = {
  title: "Primitives/Icon button",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    icon: GiftIcon,
    label: "Daily reward available",
    shape: "circle",
    badge: "!",
    size: "lg",
  },
  argTypes: {
    icon: { control: false },
    shape: { control: "select", options: ["rounded", "circle"] },
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Reward: Story = {};
export const Missions: Story = {
  args: {
    icon: ClipboardTextIcon,
    label: "Missions, 3 rewards ready",
    variant: "secondary",
    badge: 3,
  },
};
export const NoBadge: Story = { args: { badge: 0, label: "Daily reward" } };
