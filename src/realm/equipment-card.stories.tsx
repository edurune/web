import type { Meta, StoryObj } from "@storybook/react-vite";
import { EquipmentCard } from "./equipment-card.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { CurrencyAmount } from "../ui/primitives/currency-amount.tsx";
const meta = {
  title: "Realm/Equipment card",
  component: EquipmentCard,
  tags: ["autodocs"],
  args: {
    equipment: {
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
          {
            id: "skill-sweep",
            manaCost: 30,
            targeting: "all_enemies",
            effects: [{ kind: "damage", multiplier: 0.95 }],
          },
        ],
      },
    },
    action: (
      <Button fullWidth>
        <CurrencyAmount kind="medal" amount={140} />
      </Button>
    ),
  },
  argTypes: { equipment: { control: "object" }, action: { control: false } },
} satisfies Meta<typeof EquipmentCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ForSale: Story = {};
export const Owned: Story = {
  args: {
    action: (
      <Button fullWidth disabled>
        Owned
      </Button>
    ),
  },
};
