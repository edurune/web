import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { WardrobeShopCard } from "./wardrobe-shop-card.tsx";

const meta = {
  title: "Character/Wardrobe shop card",
  component: WardrobeShopCard,
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof WardrobeShopCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
