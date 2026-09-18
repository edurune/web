import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BattleFeedback } from "./battle-feedback.tsx";
import { Button } from "../../ui/primitives/button.tsx";
import { Stack } from "../../ui/primitives/stack.tsx";

const meta = {
  title: "Game/Battle feedback",
  component: BattleFeedback,
  tags: ["autodocs"],
  args: {
    event: {
      kind: "damage_dealt",
      wave: 1,
      turn: 1,
      sourceId: "player",
      targetId: "enemy",
      amount: 24,
      absorbed: 0,
    },
  },
  render: function Preview(args) {
    const [revision, setRevision] = useState(0);
    return (
      <Stack align="center" gap="xl">
        <BattleFeedback key={revision} {...args} />
        <Button onClick={() => setRevision((value) => value + 1)}>Replay</Button>
      </Stack>
    );
  },
} satisfies Meta<typeof BattleFeedback>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Damage: Story = {};
export const Absorbed: Story = {
  args: {
    event: {
      kind: "damage_dealt",
      wave: 1,
      turn: 1,
      sourceId: "enemy",
      targetId: "player",
      amount: 5,
      absorbed: 12,
    },
  },
};
export const Healing: Story = {
  args: {
    event: {
      kind: "health_restored",
      wave: 1,
      turn: 1,
      sourceId: "player",
      targetId: "player",
      amount: 20,
    },
  },
};
export const Miss: Story = {
  args: {
    event: {
      kind: "action_resolved",
      wave: 1,
      turn: 1,
      actorId: "player",
      action: { kind: "attack" },
      targetId: "enemy",
      outcome: "miss",
    },
  },
};
