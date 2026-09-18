import type { Meta, StoryObj } from "@storybook/react-vite";
import { enemies } from "@edurune/art/catalog";
import { EnemyPortrait } from "./enemy-portrait.tsx";

const meta = {
  title: "Game/EnemyPortrait",
  component: EnemyPortrait,
  tags: ["autodocs"],
  args: { enemyId: "acornling", clip: "idle", animated: true },
  argTypes: {
    enemyId: { control: "select", options: enemies.map((item) => item.id) },
    clip: { control: "inline-radio" },
  },
} satisfies Meta<typeof EnemyPortrait>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EncounterPreview: Story = {};
export const BossPreview: Story = { args: { enemyId: "grove-guardian" } };
export const Attacking: Story = { args: { clip: "attack" } };
export const TakingHit: Story = { args: { clip: "hit" } };
export const Defeated: Story = { args: { clip: "defeat" } };
export const StillPortrait: Story = { args: { animated: false } };
