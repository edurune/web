import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { ShopItemTray } from "./shop-item-tray.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { CurrencyAmount } from "../ui/primitives/currency-amount.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";

const styles = stylex.create({ frame: { maxInlineSize: layout.portrait } });
const meta = {
  title: "Character/ShopItemTray",
  component: ShopItemTray,
  tags: ["autodocs"],
  args: {
    name: "Acorn squirrel",
    rarity: "uncommon",
    action: (
      <Button size="sm">
        <CurrencyAmount kind="coin" amount={50} size="sm" />
        Buy
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShopItemTray>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ForSale: Story = {};
export const InsufficientFunds: Story = {
  args: {
    detail: "Not enough coins",
    action: (
      <Button size="sm" disabled>
        <CurrencyAmount kind="coin" amount={50} size="sm" />
        Buy
      </Button>
    ),
  },
};
export const Owned: Story = { args: { action: <Button size="sm">Wear</Button> } };
