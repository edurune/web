import type { Meta, StoryObj } from "@storybook/react-vite";
import { LessonContent } from "./lesson-content.tsx";
const meta = {
  title: "Course/Lesson content",
  component: LessonContent,
  tags: ["autodocs"],
  args: {
    markdown:
      "## Linear relationships\n\nThe slope is $m = \\frac{\\Delta y}{\\Delta x}$.\n\n$$y = mx + b$$\n\n| Symbol | Meaning |\n| --- | --- |\n| $m$ | slope |\n| $b$ | vertical intercept |\n\n> Use two points to calculate $m$.\n\n- Substitute the slope.\n- Solve for **$b$**.",
  },
} satisfies Meta<typeof LessonContent>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SafeContent: Story = {
  args: {
    markdown:
      "## Only lesson content\n\n<script>alert('unsafe')</script>\n\n[Unsafe link](javascript:alert(1))\n\n<iframe src='https://example.com'></iframe>\n\nThis paragraph remains readable.",
  },
};
