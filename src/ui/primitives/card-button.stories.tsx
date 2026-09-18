import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardButton } from "./card-button.tsx";
const meta = {
  title: "Primitives/Card button",
  component: CardButton,
  tags: ["autodocs"],
  args: { children: "Greetings and introductions", disabled: false },
} satisfies Meta<typeof CardButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
