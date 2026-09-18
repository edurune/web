import type { Meta, StoryObj } from "@storybook/react-vite";
import { CosmeticIcon } from "./cosmetic-icon.tsx";
const meta = {
  title: "Game/CosmeticIcon",
  component: CosmeticIcon,
  tags: ["autodocs"],
  args: { cosmeticId: "button-knit-vest", label: "Knitted vest" },
} satisfies Meta<typeof CosmeticIcon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Vest: Story = {};
