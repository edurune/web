import type { Meta, StoryObj } from "@storybook/react-vite";
import { defaultOutfit } from "@edurune/art/catalog";
import { CharacterButton } from "./character-button.tsx";

const meta = {
  title: "Character/CharacterButton",
  component: CharacterButton,
  tags: ["autodocs"],
  args: {
    cosmeticIds: Object.values(defaultOutfit).filter((id) => id !== null),
    hairStyle: "curved-bob",
    label: "Your profile",
    onClick: () => {},
  },
} satisfies Meta<typeof CharacterButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Pressable: Story = {};
