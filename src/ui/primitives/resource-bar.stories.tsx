import { DropIcon, HeartIcon, ShieldIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "./meter.tsx";
import { ResourceBar } from "./resource-bar.tsx";
import { Stack } from "./stack.tsx";
import { Surface } from "./surface.tsx";
import { Text } from "./text.tsx";

const meta = {
  title: "Primitives/ResourceBar",
  component: ResourceBar,
} satisfies Meta<typeof ResourceBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kinds: Story = {
  args: { kind: "health", value: 42, max: 60, label: "Health", icon: HeartIcon },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Stack gap="md">
        <ResourceBar {...args} />
        <ResourceBar kind="mana" value={12} max={30} label="Mana" icon={DropIcon} />
        <ResourceBar kind="shield" value={8} max={20} label="Shield" icon={ShieldIcon} />
      </Stack>
    </div>
  ),
};

export const LowHealth: Story = {
  args: { kind: "health", value: 24, max: 60, label: "Health", icon: HeartIcon },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Stack gap="md">
        <ResourceBar {...args} />
        <ResourceBar {...args} value={9} />
        <Text variant="caption" tone="muted">
          Health fill turns yellow below half and red at or below a quarter.
        </Text>
      </Stack>
    </div>
  ),
};

export const WithAbsorb: Story = {
  args: { kind: "health", value: 40, max: 60, shield: 15, label: "Health", icon: HeartIcon },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ResourceBar {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  args: { kind: "health", value: 42, max: 60, label: "Health", icon: HeartIcon },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Stack gap="md">
        <ResourceBar {...args} size="sm" />
        <ResourceBar {...args} size="md" />
        <ResourceBar {...args} size="lg" />
      </Stack>
    </div>
  ),
};

export const InCombatantCard: Story = {
  args: { kind: "health", value: 42, max: 60, label: "Health", icon: HeartIcon },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Surface padding="lg" corner="xl" depth="outlined">
        <Stack gap="md">
          <Text variant="subheading">Crystal golem</Text>
          <ResourceBar {...args} />
          <ResourceBar kind="mana" value={12} max={30} label="Mana" icon={DropIcon} />
          <Meter value={2} max={3} label="Wave" valueLabel="2 / 3" tone="info" size="sm" />
        </Stack>
      </Surface>
    </div>
  ),
};
