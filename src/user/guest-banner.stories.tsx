import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuestBanner } from "./guest-banner.tsx";
const meta = {
  title: "Account/Guest banner",
  component: GuestBanner,
  tags: ["autodocs"],
  args: { onLogin: () => {} },
} satisfies Meta<typeof GuestBanner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
