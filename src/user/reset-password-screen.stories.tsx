import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResetPasswordScreen } from "./password-recovery-screen.tsx";

const meta = {
  title: "Account/Reset Password",
  component: ResetPasswordScreen,
  parameters: { layout: "fullscreen" },
  args: { onReset: async () => {}, onRequestNewLink: () => {}, onLogin: () => {} },
} satisfies Meta<typeof ResetPasswordScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NewPassword: Story = {};
export const InvalidLink: Story = { args: { invalidLink: true } };
export const ExpiredOnSubmit: Story = { args: { error: { code: "INVALID_TOKEN" } } };
export const Updated: Story = { args: { complete: true } };
