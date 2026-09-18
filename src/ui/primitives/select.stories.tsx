import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import * as stylex from "@stylexjs/stylex";
import { Select, type SelectProps } from "./select.tsx";
import { Field } from "./field.tsx";
import { layout } from "../tokens/layout.stylex.ts";

const styles = stylex.create({ frame: { maxInlineSize: layout.portrait } });
const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    options: [
      { value: "en", label: "English" },
      { value: "vi", label: "Vietnamese" },
    ],
    value: "en",
    placeholder: "Choose a language",
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SelectProps>();
    return (
      <Field label="Language" style={styles.frame}>
        <Select
          {...args}
          onValueChange={(value) => {
            if (typeof value === "string") updateArgs({ value });
          }}
        />
      </Field>
    );
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Language: Story = {};
export const Disabled: Story = { args: { disabled: true } };
