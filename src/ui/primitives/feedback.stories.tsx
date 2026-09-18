import { MapTrifoldIcon, UserIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./alert.tsx";
import { Avatar } from "./avatar.tsx";
import { Button } from "./button.tsx";
import { Divider } from "./divider.tsx";
import { EmptyState } from "./empty-state.tsx";
import { Link } from "./link.tsx";
import { Skeleton } from "./skeleton.tsx";
import { Spinner } from "./spinner.tsx";
import { Stack } from "./stack.tsx";
import { Surface } from "./surface.tsx";
import { Text } from "./text.tsx";
import type { Rarity } from "../types.ts";

const meta = {
  title: "Primitives/Feedback",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

export const Alerts: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Stack gap="md">
        <Alert tone="info" title="Unit reviews mix the whole unit">
          Questions come from every bank in the unit, not just the last lesson.
        </Alert>
        <Alert tone="positive" title="Progress saved" />
        <Alert tone="caution" title="Low mana">
          Skills still spend their cost when they miss.
        </Alert>
        <Alert
          tone="negative"
          title="Session out of date"
          action={
            <Button size="sm" variant="secondary">
              Reload
            </Button>
          }
        >
          Someone else advanced this battle. Reload to catch up.
        </Alert>
      </Stack>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Stack gap="xl">
        <Stack direction="row" gap="lg" align="center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" label="Loading course" />
        </Stack>
        <Surface depth="outlined">
          <Stack gap="md">
            <Skeleton width="160px" height="22px" />
            <Skeleton lines={3} />
            <Skeleton height="44px" corner="lg" />
          </Stack>
        </Surface>
      </Stack>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <EmptyState
        icon={MapTrifoldIcon}
        title="No courses yet"
        description="Join a course to start earning medals and unlocking equipment."
        action={<Button>Browse courses</Button>}
      />
    </div>
  ),
};

export const Avatars: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="center">
        <Avatar size="sm" fallback={<UserIcon size={16} weight="bold" />} />
        <Avatar size="md" fallback="AD" />
        <Avatar size="lg" fallback="AD" />
        <Avatar size="xl" fallback={<UserIcon size={40} weight="bold" />} />
      </Stack>
      <Stack direction="row" gap="md" align="center">
        {rarities.map((rarity) => (
          <Avatar key={rarity} shape="rounded" size="lg" rarity={rarity} fallback={rarity[0]} />
        ))}
      </Stack>
    </Stack>
  ),
};

export const Separators: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Stack gap="md">
        <Text>Above</Text>
        <Divider />
        <Text>Between</Text>
        <Divider tone="strong" />
        <Stack direction="row" gap="md" align="center">
          <Text>Left</Text>
          <Divider orientation="vertical" />
          <Text>Right</Text>
        </Stack>
        <Link href="https://example.com" external>
          An external link
        </Link>
      </Stack>
    </div>
  ),
};
