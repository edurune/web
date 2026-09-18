import type { Meta, StoryObj } from "@storybook/react-vite";
import { RealmProgress } from "./realm-progress.tsx";

const meta = {
  title: "Game/RealmProgress",
  component: RealmProgress,
  tags: ["autodocs"],
  args: {
    progression: { level: 2, experience: 125, levelExperience: 100, nextLevelExperience: 300 },
  },
  argTypes: { progression: { control: "object" }, gained: { control: "number" } },
} satisfies Meta<typeof RealmProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {};
export const NewRealm: Story = {
  args: { progression: { level: 1, experience: 0, levelExperience: 0, nextLevelExperience: 100 } },
};
export const JustLeveledUp: Story = {
  args: {
    progression: { level: 2, experience: 100, levelExperience: 100, nextLevelExperience: 300 },
  },
};
export const EarnedThisRun: Story = {
  args: {
    progression: { level: 2, experience: 220, levelExperience: 100, nextLevelExperience: 300 },
    gained: 100,
  },
};
export const LevelledUpThisRun: Story = {
  args: {
    progression: { level: 3, experience: 340, levelExperience: 300, nextLevelExperience: 600 },
    gained: 100,
  },
};
export const MaximumLevel: Story = {
  args: {
    progression: {
      level: 30,
      experience: 43500,
      levelExperience: 43500,
      nextLevelExperience: null,
    },
  },
};
