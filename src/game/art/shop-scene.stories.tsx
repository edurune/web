import type { Meta, StoryObj } from "@storybook/react-vite";
import { cosmetics } from "@edurune/art/catalog";
import { ShopScene } from "./shop-scene.tsx";

const meta = {
  title: "Game/ShopScene",
  component: ShopScene,
  tags: ["autodocs"],
  args: { backgroundId: null },
  argTypes: {
    backgroundId: {
      control: "select",
      options: [
        null,
        ...cosmetics.filter((item) => item.slot === "background").map(({ id }) => id),
      ],
    },
  },
} satisfies Meta<typeof ShopScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interior: Story = {};
export const BackgroundPreview: Story = { args: { backgroundId: "flower-market" } };
