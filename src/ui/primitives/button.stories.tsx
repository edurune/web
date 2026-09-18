import { ArrowRightIcon, CoinsIcon, GearSixIcon, SwordIcon, XIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, IconButton } from "./button.tsx";
import type { ButtonVariant } from "./button.tsx";
import { Stack } from "./stack.tsx";
import { Text } from "./text.tsx";
import type { Size } from "../types.ts";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Start battle" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants: ButtonVariant[] = ["primary", "secondary", "ghost", "danger"];
const sizes: Size[] = ["sm", "md", "lg"];

export const Variants: Story = {
  render: (args) => (
    <Stack gap="md" direction="row">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} />
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md" direction="row" align="center">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size} />
      ))}
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg">
      {variants.map((variant) => (
        <Stack key={variant} gap="xxs">
          <Text variant="overline" tone="muted">
            {variant}
          </Text>
          <Stack direction="row" gap="md">
            <Button {...args} variant={variant} />
            <Button {...args} variant={variant} loading />
            <Button {...args} variant={variant} disabled />
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Stack direction="row" gap="md">
      <Button {...args} iconStart={SwordIcon} />
      <Button {...args} variant="secondary" iconEnd={ArrowRightIcon}>
        Continue
      </Button>
      <Button {...args} variant="secondary" iconStart={CoinsIcon}>
        250
      </Button>
      <IconButton icon={GearSixIcon} label="Settings" variant="secondary" />
      <IconButton icon={XIcon} label="Close" variant="ghost" />
    </Stack>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Stack gap="sm">
        <Button {...args} size="lg" fullWidth />
        <Button {...args} variant="secondary" fullWidth>
          Review unit
        </Button>
      </Stack>
    </div>
  ),
};
