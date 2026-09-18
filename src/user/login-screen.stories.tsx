import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginScreen } from "./login-screen.tsx";

const meta = {
  title: "Account/Login",
  component: LoginScreen,
  parameters: { layout: "fullscreen" },
  args: {
    onLogin: async () => {},
    onSignUp: async () => {},
    onGuest: () => {},
    onModeChange: () => {},
  },
} satisfies Meta<typeof LoginScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {};
export const CreateAccount: Story = { args: { initialMode: "signup" } };
export const UpgradeGuest: Story = { args: { initialMode: "signup", guest: true } };
export const RejectedVerification: Story = { args: { error: { code: "VERIFICATION_FAILED" } } };
