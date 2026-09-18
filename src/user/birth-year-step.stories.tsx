import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { BirthYearStep } from "./birth-year-step.tsx";

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
  title: "User/BirthYearStep",
  component: BirthYearStep,
  tags: ["autodocs"],
  args: {
    value: null,
    onValueChange: fn(),
    onContinue: fn(),
    onBack: fn(),
    totalSteps: 3,
    pending: false,
  },
  argTypes: { value: { control: "number" }, error: { control: false } },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <BirthYearStep
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
} satisfies Meta<typeof BirthYearStep>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const Filled: Story = { args: { value: 2000 } };
export const InvalidYear: Story = { args: { value: 1899 } };
export const Saving: Story = { args: { value: 2000, pending: true } };
export const SaveError: Story = {
  args: { value: 2000, error: new Error("Network unavailable") },
};
