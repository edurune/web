import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.tsx";
import { Stack } from "./stack.tsx";
import { ToastProvider, ToastViewport, useToastManager } from "./toast.tsx";

const meta = {
  title: "Primitives/Toast",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Triggers() {
  const toast = useToastManager();
  return (
    <Stack direction="row" gap="md">
      <Button
        onClick={() =>
          toast.add({ title: "Lesson complete", description: "You earned 10 medals." })
        }
      >
        Reward toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.add({ title: "Saved", description: "Your loadout is up to date." })}
      >
        Save toast
      </Button>
    </Stack>
  );
}

export const Toasts: Story = {
  render: () => (
    <ToastProvider>
      <Triggers />
      <ToastViewport />
    </ToastProvider>
  ),
};
