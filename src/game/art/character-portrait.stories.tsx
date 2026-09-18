import type { Meta, StoryObj } from "@storybook/react-vite";
import { defaultOutfit, hairstyles } from "@edurune/art/catalog";
import { CharacterPortrait } from "./character-portrait.tsx";

const meta = {
  title: "Game/CharacterPortrait",
  component: CharacterPortrait,
  tags: ["autodocs"],
  args: {
    cosmeticIds: Object.values(defaultOutfit).filter((id) => id !== null),
    hairStyle: "curved-bob",
    label: "Your character",
    clip: "idle",
    animated: true,
  },
  argTypes: {
    cosmeticIds: { control: "object" },
    hairStyle: {
      control: "select",
      options: ["none", ...hairstyles.map((item) => item.id).sort()],
    },
    palette: { control: "object" },
    clip: { control: "inline-radio" },
  },
} satisfies Meta<typeof CharacterPortrait>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StarterOutfit: Story = {};
export const FullOutfit: Story = { args: { cosmeticIds: ["ao-dai"] } };
export const StillPortrait: Story = { args: { animated: false } };
export const MissingCosmetic: Story = {
  args: { cosmeticIds: ["unavailable-cosmetic"], animated: false },
};
