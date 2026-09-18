import type { Meta, StoryObj } from "@storybook/react-vite";
import { Brand } from "./brand.tsx";

const meta = {
  title: "Brand/Brand",
  component: Brand,
  tags: ["autodocs"],
  args: { variant: "lockup" },
  argTypes: { variant: { control: "inline-radio" } },
} satisfies Meta<typeof Brand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lockup: Story = {};
export const Mark: Story = { args: { variant: "mark" } };
export const Wordmark: Story = { args: { variant: "wordmark" } };
