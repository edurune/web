import type { Meta, StoryObj } from "@storybook/react-vite";
import { defaultOutfit, hairstyles, regions } from "@edurune/art/catalog";
import { BattleScene } from "./battle-scene.tsx";

const meta = {
  title: "Game/BattleScene",
  component: BattleScene,
  tags: ["autodocs"],
  args: {
    sceneId: "forest-clearing",
    enemyIds: ["acornling"],
    cosmeticIds: Object.values(defaultOutfit).filter((id) => id !== null),
    hairStyle: "curved-bob",
    layout: "wide",
    animated: true,
  },
  argTypes: {
    sceneId: { control: "select", options: regions.map((item) => item.id) },
    enemyIds: { control: "object" },
    cosmeticIds: { control: "object" },
    hairStyle: {
      control: "select",
      options: ["none", ...hairstyles.map((item) => item.id).sort()],
    },
    palette: { control: "object" },
    layout: { control: "inline-radio" },
    actorClips: { control: "object" },
    effect: { control: "object" },
    defeatedActors: { control: "object" },
  },
} satisfies Meta<typeof BattleScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleEnemy: Story = {};
export const EnemyParty: Story = { args: { enemyIds: ["moss-slime", "acornling", "capling"] } };
export const BossEncounter: Story = {
  args: { enemyIds: ["moss-slime", "acornling", "capling", "grove-guardian"] },
};
export const CompactEncounter: Story = {
  args: { layout: "compact", enemyIds: ["moss-slime", "acornling", "capling"] },
};
export const PlayerAttack: Story = {
  args: {
    actorClips: { player: "attack", "enemy-0": "hit" },
    effect: { id: "impact-hit", target: "enemy-0" },
  },
};
export const DefeatedEnemy: Story = {
  args: { enemyIds: ["acornling", "capling"], defeatedActors: ["enemy-0"] },
};
