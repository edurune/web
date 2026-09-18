import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { InfoIcon } from "@phosphor-icons/react";
import { Button } from "../ui/primitives/button.tsx";
import { EquipmentInfoSheet, type EquipmentInfoSheetProps } from "./equipment-info-sheet.tsx";

const equipment = {
  slot: "weapon",
  rarity: "rare",
  equipment: {
    id: "weapon-ember-blade",
    statModifiers: { maxHealth: 0, attack: 9, defense: 0, speed: -2 },
    skills: [
      {
        id: "skill-power-strike",
        manaCost: 40,
        targeting: "single_enemy",
        effects: [{ kind: "damage", multiplier: 2 }],
      },
    ],
  },
} satisfies EquipmentInfoSheetProps["equipment"];

const meta = {
  title: "Realm/Equipment info",
  component: EquipmentInfoSheet,
  tags: ["autodocs"],
  args: {
    open: true,
    equipment,
    trigger: (
      <Button variant="secondary" iconEnd={InfoIcon} cue={null}>
        Equipment info
      </Button>
    ),
  },
  argTypes: { equipment: { control: "object" }, trigger: { control: false } },
  render: function Preview(args) {
    const [, updateArgs] = useArgs<EquipmentInfoSheetProps>();
    return <EquipmentInfoSheet {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<typeof EquipmentInfoSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Weapon: Story = {};
export const Charm: Story = {
  args: {
    equipment: {
      slot: "charm",
      rarity: "common",
      equipment: {
        id: "charm-ward-stone",
        statModifiers: { maxHealth: 12, attack: 0, defense: 4, speed: 0 },
        skills: [],
      },
    },
  },
};
