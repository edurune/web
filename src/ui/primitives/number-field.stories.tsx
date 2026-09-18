import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { Field } from "./field.tsx";
import { NumberField, type NumberFieldProps } from "./number-field.tsx";

const meta = {
  title: "Primitives/NumberField",
  component: NumberField,
  tags: ["autodocs"],
  args: {
    value: null,
    min: 1900,
    max: new Date().getUTCFullYear(),
    smallStep: 1,
    allowOutOfRange: true,
    format: { useGrouping: false },
    autoComplete: "bday-year",
    required: true,
  },
  argTypes: { value: { control: "number" }, inputRef: { control: false } },
  render: function Render(args) {
    const [, updateArgs] = useArgs<NumberFieldProps>();
    return (
      <Field label="Birth year">
        <NumberField {...args} onValueChange={(value) => updateArgs({ value })} />
      </Field>
    );
  },
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const Filled: Story = { args: { value: 2000 } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { value: 2000, disabled: true } };
export const Invalid: Story = { args: { value: 1899, invalid: true } };
