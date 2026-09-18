import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { InfoIcon } from "@phosphor-icons/react";
import { defaultOutfit } from "@edurune/art/catalog";
import { Button } from "../ui/primitives/button.tsx";
import { CombatantInfoSheet, type CombatantInfoSheetProps } from "./combatant-info-sheet.tsx";

const combatant = {
  id: "enemy-1",
  teamId: "enemies",
  name: null,
  equipmentIds: ["weapon-oak-staff", "charm-herb-pouch"],
  skills: [
    {
      id: "skill-strike",
      manaCost: 2,
      targeting: "single_enemy",
      effects: [{ kind: "damage", multiplier: 1.2 }],
    },
  ],
  stats: { maxHealth: 60, attack: 12, defense: 6, speed: 8 },
  health: 42,
  mana: 3,
  guard: 0,
  shield: 0,
  effects: [],
} satisfies CombatantInfoSheetProps["combatant"];

const meta = {
  title: "Game/Combatant info",
  component: CombatantInfoSheet,
  tags: ["autodocs"],
  args: {
    open: true,
    identity: { kind: "enemy", enemyId: "acornling", role: "normal" },
    combatant,
    trigger: (
      <Button variant="secondary" iconEnd={InfoIcon} cue={null}>
        Combatant info
      </Button>
    ),
  },
  argTypes: {
    identity: { control: "object" },
    combatant: { control: "object" },
    trigger: { control: false },
  },
  render: function Preview(args) {
    const [, updateArgs] = useArgs<CombatantInfoSheetProps>();
    return <CombatantInfoSheet {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<typeof CombatantInfoSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enemy: Story = {};
export const Boss: Story = {
  args: {
    identity: { kind: "enemy", enemyId: "grove-guardian", role: "boss" },
    combatant: {
      ...combatant,
      stats: { maxHealth: 180, attack: 24, defense: 16, speed: 5 },
      health: 112,
      mana: 7,
    },
  },
};
export const Player: Story = {
  args: {
    identity: {
      kind: "player",
      cosmeticIds: Object.values(defaultOutfit).filter((id) => id !== null),
      hairStyle: "curved-bob",
      palette: { skin: "#c68642", hair: "#2c1b18", eyes: "#5b3a29" },
    },
    combatant: { ...combatant, id: "player", teamId: "player", name: "Mai" },
  },
};
