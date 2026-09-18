import type { Meta, StoryObj } from "@storybook/react-vite";
import { hairstyles } from "@edurune/art/catalog";
import { HairstyleIcon } from "./hairstyle-icon.tsx";

const meta = {
  title: "Game/HairstyleIcon",
  component: HairstyleIcon,
  tags: ["autodocs"],
  args: { hairStyle: "curved-bob", label: "Bob", palette: { hair: "#2c1b18" } },
  argTypes: { hairStyle: { control: "select", options: hairstyles.map((item) => item.id) } },
} satisfies Meta<typeof HairstyleIcon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Bob: Story = {};
export const LongHair: Story = { args: { hairStyle: "long-ribbon-cut", label: "Long hair" } };
