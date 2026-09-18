import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatchPicker } from "./color-swatch-picker.tsx";

const meta = {
  title: "Primitives/ColorSwatchPicker",
  component: ColorSwatchPicker,
  tags: ["autodocs"],
  args: {
    label: "Skin tone",
    colors: ["#f7d9c4", "#e6b18a", "#c68642", "#a06740", "#6f4527", "#452c21"],
    defaultValue: "#c68642",
    size: "md",
  },
} satisfies Meta<typeof ColorSwatchPicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Choices: Story = {};
export const Disabled: Story = { args: { disabled: true } };
