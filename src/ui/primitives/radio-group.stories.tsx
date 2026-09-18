import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { Field } from "./field.tsx";
import { RadioGroup, RadioOption } from "./radio-group.tsx";

const meta = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    value: "en",
    name: "language",
    children: (
      <>
        <RadioOption value="en">English</RadioOption>
        <RadioOption value="vi">Vietnamese</RadioOption>
      </>
    ),
  },
  argTypes: { children: { control: false } },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Field label="Learning language">
        <RadioGroup {...args} onValueChange={(value) => updateArgs({ value })} />
      </Field>
    );
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Vertical: Story = {};
export const Horizontal: Story = { args: { orientation: "horizontal" } };
export const Disabled: Story = { args: { disabled: true } };
