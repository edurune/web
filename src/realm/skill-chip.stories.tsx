import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkillChip } from "./skill-chip.tsx";
const meta = {
  title: "Realm/Skill chip",
  component: SkillChip,
  tags: ["autodocs"],
  args: {
    skill: {
      id: "skill-mend",
      manaCost: 20,
      targeting: "self",
      effects: [{ kind: "heal", amount: 18 }],
    },
  },
  argTypes: { skill: { control: "object" } },
} satisfies Meta<typeof SkillChip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Healing: Story = {};
export const MultipleEffects: Story = {
  args: {
    skill: {
      id: "skill-lunge",
      manaCost: 20,
      targeting: "single_enemy",
      effects: [
        { kind: "damage", multiplier: 1.25 },
        { kind: "modify_stat", stat: "defense", amount: -2, duration: 2 },
      ],
    },
  },
};
