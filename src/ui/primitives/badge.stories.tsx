import { BookOpenTextIcon, CheckIcon, FireIcon, LockSimpleIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, DifficultyBadge, RarityBadge } from "./badge.tsx";
import { Stack } from "./stack.tsx";
import { Text } from "./text.tsx";
import type { Difficulty, Rarity, Tone } from "../types.ts";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const tones: Tone[] = ["neutral", "accent", "positive", "negative", "caution", "info"];
const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap="sm">
      {tones.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </Stack>
  ),
};

export const Rarities: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack direction="row" gap="sm">
        {rarities.map((rarity) => (
          <RarityBadge key={rarity} rarity={rarity} />
        ))}
      </Stack>
      <Stack direction="row" gap="sm">
        {rarities.map((rarity) => (
          <RarityBadge key={rarity} rarity={rarity} size="md" />
        ))}
      </Stack>
    </Stack>
  ),
};

export const Difficulties: Story = {
  render: () => (
    <Stack direction="row" gap="sm">
      {difficulties.map((value) => (
        <DifficultyBadge key={value} difficulty={value} />
      ))}
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Stack gap="md">
      <Text variant="overline" tone="muted">
        status
      </Text>
      <Stack direction="row" gap="sm">
        <Badge tone="positive" icon={CheckIcon}>
          Completed
        </Badge>
        <Badge tone="neutral" icon={LockSimpleIcon}>
          Locked
        </Badge>
        <Badge tone="caution" icon={FireIcon}>
          Boss wave
        </Badge>
        <Badge tone="info" icon={BookOpenTextIcon}>
          Lesson
        </Badge>
      </Stack>
    </Stack>
  ),
};
