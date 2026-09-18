import * as stylex from "@stylexjs/stylex";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./chip.tsx";
import { Option } from "./option.tsx";
import { Stack } from "./stack.tsx";
import { Text } from "./text.tsx";
import { space } from "../tokens/space.stylex.ts";

const meta = {
  title: "Primitives/Answer",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const styles = stylex.create({
  bank: { display: "flex", flexWrap: "wrap", gap: space.sm },
  page: { maxWidth: "420px" },
});

export const Chips: Story = {
  render: () => (
    <Stack gap="xl" style={styles.page}>
      <Stack gap="sm">
        <Text variant="overline" tone="muted">
          states
        </Text>
        <div {...stylex.props(styles.bank)}>
          <Chip>bue</Chip>
          <Chip selected>nas</Chip>
          <Chip state="correct">no</Chip>
          <Chip state="incorrect">ches</Chip>
          <Chip spent>dias</Chip>
          <Chip disabled>tar</Chip>
        </div>
      </Stack>
      <Stack gap="sm">
        <Text variant="overline" tone="muted">
          small
        </Text>
        <div {...stylex.props(styles.bank)}>
          {[
            { id: "b1", letter: "b" },
            { id: "u1", letter: "u" },
            { id: "e1", letter: "e" },
            { id: "n1", letter: "n" },
            { id: "o1", letter: "o" },
            { id: "s1", letter: "s" },
          ].map(({ id, letter }) => (
            <Chip key={id} size="sm">
              {letter}
            </Chip>
          ))}
        </div>
      </Stack>
    </Stack>
  ),
};

export const Options: Story = {
  render: () => (
    <Stack gap="xl" style={styles.page}>
      <Stack gap="sm">
        <Text variant="overline" tone="muted">
          single select
        </Text>
        <Stack gap="sm">
          <Option>Buenos días</Option>
          <Option selected>Buenas noches</Option>
          <Option disabled>Hasta luego</Option>
        </Stack>
      </Stack>
      <Stack gap="sm">
        <Text variant="overline" tone="muted">
          graded
        </Text>
        <Stack gap="sm">
          <Option state="correct">Buenas noches</Option>
          <Option selected state="incorrect">
            Buenos días
          </Option>
          <Option>Por favor</Option>
        </Stack>
      </Stack>
      <Stack gap="sm">
        <Text variant="overline" tone="muted">
          multi select
        </Text>
        <Stack gap="sm">
          <Option multi selected>
            Greetings
          </Option>
          <Option multi selected>
            Farewells
          </Option>
          <Option multi>Numbers</Option>
        </Stack>
      </Stack>
    </Stack>
  ),
};
