import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WaveTransition } from "./wave-transition.tsx";
import { Button } from "../../ui/primitives/button.tsx";
import { Stack } from "../../ui/primitives/stack.tsx";

const meta = {
  title: "Game/Wave transition",
  component: WaveTransition,
  tags: ["autodocs"],
  args: { wave: 2, total: 3 },
  render: function Preview(args) {
    const [revision, setRevision] = useState(0);
    return (
      <Stack align="center" gap="xl">
        <WaveTransition key={revision} {...args} />
        <Button onClick={() => setRevision((value) => value + 1)}>Replay</Button>
      </Stack>
    );
  },
} satisfies Meta<typeof WaveTransition>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NextWave: Story = {};
