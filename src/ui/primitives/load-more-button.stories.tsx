import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { LoadMoreButton } from "./load-more-button.tsx";
import { ScrollArea } from "./scroll-area.tsx";
import { Text } from "./text.tsx";
import { space } from "../tokens/space.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";

const styles = stylex.create({
  frame: { blockSize: `calc(${space.huge} * 4)`, maxInlineSize: layout.portrait },
  content: { display: "flex", flexDirection: "column", gap: space.lg, padding: space.sm },
});
const meta = {
  title: "Primitives/LoadMoreButton",
  component: LoadMoreButton,
  tags: ["autodocs"],
  args: { children: "Load more", autoLoad: true, onLoadMore: () => {} },
  render: function Render(args) {
    const [count, setCount] = useState(12);
    return (
      <ScrollArea style={styles.frame} contentStyle={styles.content}>
        {Array.from({ length: count }, (_, index) => (
          <Text key={index}>Item {index + 1}</Text>
        ))}
        <LoadMoreButton {...args} onLoadMore={() => setCount((value) => value + 12)} />
      </ScrollArea>
    );
  },
} satisfies Meta<typeof LoadMoreButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OnScroll: Story = {};
export const Manual: Story = { args: { autoLoad: false } };
export const Loading: Story = { args: { loading: true } };
export const Retry: Story = { args: { autoLoad: false, children: "Try again" } };
