import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarkdownContent } from "./markdown-content.tsx";

const meta = {
  title: "Primitives/Markdown content",
  component: MarkdownContent,
  tags: ["autodocs"],
  args: {
    markdown:
      "# Quadratic formula\n\nFor $ax^2 + bx + c = 0$:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n| Discriminant | Roots |\n| --- | --- |\n| $b^2 - 4ac > 0$ | Two real roots |\n| $b^2 - 4ac = 0$ | One real root |",
  },
} satisfies Meta<typeof MarkdownContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Document: Story = {};
export const Inline: Story = {
  args: { markdown: "Choose **$x = 2$**.", inline: true },
};
