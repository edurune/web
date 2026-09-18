import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { BottomSheet, BottomSheetClose, type BottomSheetProps } from "./bottom-sheet.tsx";
import { Button } from "./button.tsx";
import { Stack } from "./stack.tsx";
import { Text } from "./text.tsx";

const meta = {
  title: "Primitives/Bottom sheet",
  component: BottomSheet,
  tags: ["autodocs"],
  args: {
    open: false,
    title: "Greeting practice",
    description: "Practice greetings and introductions in battle.",
    dismissible: true,
    trigger: <Button>Open sheet</Button>,
    footer: <BottomSheetClose render={<Button fullWidth>Done</Button>} />,
  },
  argTypes: {
    trigger: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  render: function Preview(args) {
    const [, updateArgs] = useArgs<BottomSheetProps>();
    return <BottomSheet {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<typeof BottomSheet>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongContent: Story = {
  args: {
    children: (
      <Stack gap="lg">
        {Array.from({ length: 24 }, (_, index) => (
          <Text key={index}>Scrollable content {index + 1}</Text>
        ))}
      </Stack>
    ),
  },
};
export const PendingAction: Story = {
  args: {
    dismissible: false,
    footer: (
      <Button fullWidth loading>
        Practice
      </Button>
    ),
  },
};
