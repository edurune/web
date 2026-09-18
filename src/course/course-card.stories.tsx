import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { CourseCard, type CourseCardProps } from "./course-card.tsx";
import { courseFixtures } from "./course-fixtures.ts";

const meta = {
  title: "Courses/Course card",
  component: CourseCard,
  tags: ["autodocs"],
  args: { course: courseFixtures[0]!, onJoin: () => {}, onOpen: () => {} },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CourseCardProps>();
    return (
      <CourseCard
        {...args}
        onJoin={() => updateArgs({ course: { ...args.course, joined: true }, joinFailed: false })}
      />
    );
  },
} satisfies Meta<typeof CourseCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {};
export const Joined: Story = { args: { course: courseFixtures[1]! } };
export const Joining: Story = { args: { joining: true } };
export const JoinFailed: Story = { args: { joinFailed: true } };
export const LongTitle: Story = {
  args: {
    course: {
      ...courseFixtures[0]!,
      title: "Everyday conversations: your first steps in a new language",
    },
  },
};
