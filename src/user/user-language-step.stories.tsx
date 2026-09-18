import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { UserLanguageStep } from "./user-language-step.tsx";

const styles = stylex.create({
  frame: {
    display: "flex",
    flexDirection: "column",
    inlineSize: layout.full,
    maxInlineSize: layout.portrait,
    blockSize: `calc(${layout.viewport} - ${space.xxl})`,
  },
});
const meta = {
  title: "User/UserLanguageStep",
  component: UserLanguageStep,
  tags: ["autodocs"],
  args: { value: "en", onValueChange: fn(), onContinue: fn(), totalSteps: 3, pending: false },
  argTypes: {
    value: { control: "inline-radio", options: ["en", "vi"] },
    error: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <UserLanguageStep
        {...args}
        onValueChange={(value) => {
          args.onValueChange(value);
          updateArgs({ value });
        }}
      />
    );
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserLanguageStep>;
export default meta;
type Story = StoryObj<typeof meta>;
export const English: Story = {};
export const Vietnamese: Story = { args: { value: "vi" } };
export const Saving: Story = { args: { pending: true } };
export const SaveError: Story = { args: { error: new Error("Network unavailable") } };
