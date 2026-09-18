import type { Meta, StoryObj } from "@storybook/react-vite";
import { hairstyles } from "@edurune/art/catalog";
import { HairstylePicker } from "./hairstyle-picker.tsx";

const meta = {
  title: "Character/HairstylePicker",
  component: HairstylePicker,
  tags: ["autodocs"],
  args: {
    label: "Hair style",
    options: [
      { value: "none", label: "No hair" },
      ...hairstyles.map((item) => ({ value: item.id, label: item.name.message ?? item.id })),
    ],
    palette: { skin: "#c68642", hair: "#2c1b18", eyes: "#5b3a29" },
    defaultValue: "none",
  },
} satisfies Meta<typeof HairstylePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Choices: Story = {};
export const TexturedHair: Story = {
  args: {
    defaultValue: "coily-crown",
    palette: { skin: "#593d32", hair: "#2c1b18", eyes: "#956b30" },
  },
};
export const Disabled: Story = { args: { disabled: true } };
