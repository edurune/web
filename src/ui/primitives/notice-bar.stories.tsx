import { ArrowRightIcon, CloudArrowDownIcon, WifiSlashIcon, XIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, IconButton } from "./button.tsx";
import { NoticeBar } from "./notice-bar.tsx";
import { Stack } from "./stack.tsx";

const meta = {
  title: "Primitives/Notice bar",
  component: NoticeBar,
  tags: ["autodocs"],
  args: { tone: "info", children: "Your place in this unit is saved" },
  argTypes: {
    icon: { control: false },
    iconEnd: { control: false },
    actions: { control: false },
    onPress: { control: false },
    tone: { control: "inline-radio", options: ["info", "caution"] },
  },
} satisfies Meta<typeof NoticeBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { icon: CloudArrowDownIcon } };

export const Caution: Story = {
  args: {
    tone: "caution",
    icon: WifiSlashIcon,
    children: "You are offline. Some things will not load.",
  },
};

export const Pressable: Story = {
  args: {
    tone: "caution",
    iconEnd: ArrowRightIcon,
    cue: "forward",
    children: "Log in to save your progress",
    onPress: () => {},
  },
};

export const WithActions: Story = {
  args: {
    icon: CloudArrowDownIcon,
    children: "A new version is ready",
    actions: (
      <>
        <Button size="sm" variant="secondary" cue="start">
          Update
        </Button>
        <IconButton icon={XIcon} label="Dismiss" size="sm" variant="ghost" cue="close" />
      </>
    ),
  },
};

export const Stacked: Story = {
  render: () => (
    <Stack gap="none">
      <NoticeBar tone="caution" icon={WifiSlashIcon}>
        You are offline. Some things will not load.
      </NoticeBar>
      <NoticeBar tone="caution" iconEnd={ArrowRightIcon} cue="forward" onPress={() => {}}>
        Log in to save your progress
      </NoticeBar>
    </Stack>
  ),
};
