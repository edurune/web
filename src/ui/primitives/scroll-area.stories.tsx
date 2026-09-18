import * as stylex from "@stylexjs/stylex";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./scroll-area.tsx";
import { Button } from "./button.tsx";
import { layout } from "../tokens/layout.stylex.ts";
import { scroll } from "../tokens/scroll.stylex.ts";
import { space } from "../tokens/space.stylex.ts";

const styles = stylex.create({
  root: { maxInlineSize: layout.portrait, blockSize: scroll.demoHeight },
  horizontal: { blockSize: "auto" },
  content: { display: "flex", flexDirection: "column", gap: space.sm, padding: space.lg },
  row: { flexDirection: "row" },
});
const meta = {
  title: "Primitives/Scroll area",
  component: ScrollArea,
  tags: ["autodocs"],
  args: {
    orientation: "vertical",
    indicator: "scrollbar",
    label: "Scrollable items",
    children: null,
  },
  argTypes: { indicator: { control: "radio", options: ["scrollbar", "fade", "none"] } },
  render: (args) => (
    <ScrollArea
      {...args}
      style={[styles.root, args.orientation === "horizontal" && styles.horizontal]}
      contentStyle={[styles.content, args.orientation === "horizontal" && styles.row]}
    >
      {Array.from({ length: 12 }, (_, index) => (
        <Button key={index} variant="secondary">
          Item {index + 1}
        </Button>
      ))}
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Scrollbar: Story = {};
export const Fade: Story = { args: { indicator: "fade" } };
export const Hidden: Story = { args: { indicator: "none" } };
export const Horizontal: Story = { args: { orientation: "horizontal", indicator: "fade" } };
export const MoreBelow: Story = { args: { indicator: "fade", hint: "More below" } };
