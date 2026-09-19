import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import type { CourseCardProps } from "./course-card.tsx";
import { courseFixtures } from "./course-fixtures.ts";
import { CourseSpotlight } from "./course-spotlight.tsx";

const meta = {
  title: "Courses/Course spotlight",
  component: CourseSpotlight,
  tags: ["autodocs"],
  args: { course: courseFixtures[0]!, onJoin: () => {}, onOpen: () => {} },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CourseCardProps>();
    return (
      <CourseSpotlight
        {...args}
        onJoin={() => updateArgs({ course: { ...args.course, joined: true }, joinFailed: false })}
      />
    );
  },
} satisfies Meta<typeof CourseSpotlight>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {};
export const PlatformCourse: Story = {
  args: { course: { ...courseFixtures[0]!, creator: null } },
};
export const Joined: Story = { args: { course: { ...courseFixtures[0]!, joined: true } } };
export const Joining: Story = { args: { joining: true } };
export const JoinFailed: Story = { args: { joinFailed: true } };
