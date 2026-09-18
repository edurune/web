import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Alert } from "./alert.tsx";
import { Button } from "./button.tsx";
import { Stack } from "./stack.tsx";
import { layout } from "../tokens/layout.stylex.ts";

const styles = stylex.create({ frame: { maxInlineSize: layout.portrait } });
const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: { tone: "info", title: "Progress saved", children: "You can continue on another device." },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Info: Story = {};
export const Positive: Story = { args: { tone: "positive" } };
export const Negative: Story = {
  args: {
    tone: "negative",
    title: "Couldn’t save",
    children: "Check your connection and try again.",
    action: <Button variant="secondary">Try again</Button>,
  },
};
export const GuestLogout: Story = {
  args: {
    tone: "caution",
    title: "Log out of this guest account?",
    children: "You’ll lose access to all your progress unless you create an account first.",
    action: (
      <Stack direction="row">
        <Button variant="danger">Log out</Button>
        <Button variant="secondary">Cancel</Button>
      </Stack>
    ),
  },
};
