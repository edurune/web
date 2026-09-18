import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "./stack.tsx";
import { Text } from "./text.tsx";
import type { TextTone, TextVariant } from "./text.tsx";

const meta = {
  title: "Primitives/Text",
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants: TextVariant[] = [
  "display",
  "title",
  "heading",
  "subheading",
  "body",
  "bodyStrong",
  "label",
  "caption",
  "overline",
  "stat",
];

const tones: TextTone[] = [
  "primary",
  "secondary",
  "muted",
  "disabled",
  "link",
  "positive",
  "negative",
  "caution",
];

export const Scale: Story = {
  args: { children: "Greetings and basics" },
  render: (args) => (
    <Stack gap="lg">
      {variants.map((variant) => (
        <Stack key={variant} gap="xxs">
          <Text variant="overline" tone="muted">
            {variant}
          </Text>
          <Text {...args} variant={variant} />
        </Stack>
      ))}
    </Stack>
  ),
};

export const Tones: Story = {
  args: { children: "Unit review unlocked" },
  render: (args) => (
    <Stack gap="xs">
      {tones.map((tone) => (
        <Text key={tone} {...args} variant="bodyStrong" tone={tone} />
      ))}
    </Stack>
  ),
};

export const Clamped: Story = {
  args: {
    lines: 2,
    children:
      "Waves clear one after another. Health and mana carry between waves, while guard, temporary effects, and initiative reset each time.",
  },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <Text {...args} />
    </div>
  ),
};
