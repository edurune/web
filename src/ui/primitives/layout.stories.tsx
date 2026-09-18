import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Meter } from "./meter.tsx";
import { Stack } from "./stack.tsx";
import { Surface } from "./surface.tsx";
import { Text } from "./text.tsx";
import { color } from "../tokens/color.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import type { SpaceToken } from "../tokens/scale.ts";

const meta = {
  title: "Primitives/Layout",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const styles = stylex.create({
  block: {
    width: "56px",
    height: "32px",
    backgroundColor: color.accentFill,
    borderRadius: radius.sm,
  },
});

const gaps: SpaceToken[] = ["xs", "sm", "md", "lg", "xl"];

export const StackGaps: Story = {
  render: () => (
    <Stack gap="lg">
      {gaps.map((gap) => (
        <Stack key={gap} gap="xxs">
          <Text variant="overline" tone="muted">
            gap {gap}
          </Text>
          <Stack direction="row" gap={gap}>
            <div {...stylex.props(styles.block)} />
            <div {...stylex.props(styles.block)} />
            <div {...stylex.props(styles.block)} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Stack direction="row" gap="lg" align="stretch">
      <Surface depth="flat" tone="sunken">
        <Text variant="label">flat</Text>
      </Surface>
      <Surface depth="outlined">
        <Text variant="label">outlined</Text>
      </Surface>
      <Surface depth="lifted">
        <Text variant="label">lifted</Text>
      </Surface>
      <Surface tone="warm" depth="outlined">
        <Text variant="label">warm</Text>
      </Surface>
      <Surface tone="inverse" depth="flat">
        <Text variant="label" tone="inverse">
          inverse
        </Text>
      </Surface>
    </Stack>
  ),
};

export const Meters: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Stack gap="lg">
        <Meter value={5} max={8} label="Unit progress" valueLabel="5 of 8" />
        <Meter value={5} gain={3} max={8} label="Experience" valueLabel="5 / 8 XP" />
        <Meter value={2} max={3} label="Wave" valueLabel="2 of 3" tone="info" size="sm" />
        <Meter value={8} max={8} label="Daily mission" valueLabel="Complete" tone="positive" />
        <Meter
          value={1}
          max={10}
          label="Turn limit"
          valueLabel="1 of 10"
          tone="caution"
          size="lg"
        />
      </Stack>
    </div>
  ),
};
