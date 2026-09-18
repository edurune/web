import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { CosmeticTile } from "./cosmetic-tile.tsx";
import { wardrobeLayout } from "../ui/tokens/wardrobe.stylex.ts";

const styles = stylex.create({ frame: { inlineSize: wardrobeLayout.tile } });
const meta = {
  title: "Character/CosmeticTile",
  component: CosmeticTile,
  tags: ["autodocs"],
  args: {
    cosmeticId: "button-knit-vest",
    label: "Button knit vest",
    price: { currency: "coin", amount: 120 },
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CosmeticTile>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ForSale: Story = {};
export const Owned: Story = { args: { owned: true } };
export const Worn: Story = { args: { owned: true, equipped: true } };
export const TryingOn: Story = { args: { selected: true } };
export const Buying: Story = { args: { loading: true, disabled: true } };
export const PetForSale: Story = {
  args: {
    cosmeticId: "button-nose-pug",
    label: "Button-nose pug",
    price: { currency: "coin", amount: 30 },
  },
};
export const WardrobePet: Story = {
  args: { cosmeticId: "button-nose-pug", label: "Button-nose pug", price: undefined },
};
export const Background: Story = {
  args: { cosmeticId: "flower-market", label: "Flower market" },
};
