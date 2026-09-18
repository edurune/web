import { InfoIcon, TrophyIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, IconButton } from "./button.tsx";
import { Dialog, DialogClose } from "./dialog.tsx";
import { Popover } from "./popover.tsx";
import { Stack } from "./stack.tsx";
import { Tab, TabList, TabPanel, Tabs } from "./tabs.tsx";
import { Text } from "./text.tsx";
import { Tooltip, TooltipProvider } from "./tooltip.tsx";

const meta = {
  title: "Primitives/Overlay",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialogs: Story = {
  render: () => (
    <Stack direction="row" gap="md">
      <Dialog
        trigger={<Button>Abandon battle</Button>}
        title="Abandon this battle?"
        description="You keep nothing from an abandoned session. The encounter stays the same when you retry."
        footer={
          <>
            <DialogClose render={<Button variant="secondary">Keep fighting</Button>} />
            <DialogClose render={<Button variant="danger">Abandon</Button>} />
          </>
        }
      />
      <Dialog
        trigger={<Button variant="secondary">Show reward</Button>}
        title="Unit cleared"
        description="First win on this practice awards 10 medals."
        footer={<DialogClose render={<Button>Collect</Button>} />}
      >
        <Stack direction="row" gap="sm" align="center">
          <TrophyIcon size={32} weight="fill" />
          <Text variant="stat">+10</Text>
        </Stack>
      </Dialog>
    </Stack>
  ),
};

export const Tooltips: Story = {
  render: () => (
    <TooltipProvider>
      <Stack direction="row" gap="lg">
        <Tooltip content="Medals only count inside this course.">
          <Button variant="secondary">Medals</Button>
        </Tooltip>
        <Tooltip content="Spends mana even when the action misses." side="right">
          <IconButton icon={InfoIcon} label="Skill cost" variant="ghost" />
        </Tooltip>
      </Stack>
    </TooltipProvider>
  ),
};

export const Popovers: Story = {
  render: () => (
    <Popover trigger={<Button variant="secondary">Stat breakdown</Button>} title="Attack">
      <Stack gap="xxs">
        <Text variant="caption">Base 12</Text>
        <Text variant="caption">Tide blade +4</Text>
        <Text variant="caption">Ember guard -1</Text>
      </Stack>
    </Popover>
  ),
};

export const TabbedPanels: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Tabs defaultValue="weapon">
        <TabList>
          <Tab value="weapon">Weapon</Tab>
          <Tab value="armor">Armor</Tab>
          <Tab value="charm">Charm</Tab>
        </TabList>
        <TabPanel value="weapon">
          <Text>Weapons change attack and can grant skills.</Text>
        </TabPanel>
        <TabPanel value="armor">
          <Text>Armor mostly changes defence and max health.</Text>
        </TabPanel>
        <TabPanel value="charm">
          <Text>Charms lean on speed and situational skills.</Text>
        </TabPanel>
      </Tabs>
    </div>
  ),
};
