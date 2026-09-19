import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForgotPasswordScreen } from "./password-recovery-screen.tsx";

const meta = {
  title: "Account/Forgot Password",
  component: ForgotPasswordScreen,
  parameters: { layout: "fullscreen" },
  args: { onRequest: async () => 60, onLogin: () => {} },
} satisfies Meta<typeof ForgotPasswordScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const RequestLink: Story = {};
export const EmailSent: Story = { args: { sent: true } };
export const Pending: Story = { args: { pending: true } };
export const RateLimited: Story = { args: { error: { code: "TOO_MANY_REQUESTS" } } };
