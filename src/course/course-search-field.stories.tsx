import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { CourseSearchField, type CourseSearchFieldProps } from "./course-search-field.tsx";

const meta = {
  title: "Courses/Course search field",
  component: CourseSearchField,
  tags: ["autodocs"],
  args: { value: "", onChange: () => {}, onSubmit: () => {} },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CourseSearchFieldProps>();
    return <CourseSearchField {...args} onChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<typeof CourseSearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithQuery: Story = { args: { value: "English" } };
