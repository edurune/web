import { GearSixIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.tsx";
import { Menu, MenuGroup, MenuItem } from "./menu.tsx";
import { Slider } from "./slider.tsx";
import { Stack } from "./stack.tsx";
import { iconSize } from "../tokens/scale.ts";

const meta = {
  title: "Primitives/Menu",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menus: Story = {
  render: () => (
    <Menu trigger={<Button variant="secondary">Account</Button>}>
      <MenuGroup label="Signed in as Ada">
        <MenuItem>
          <UserIcon size={iconSize.sm} weight="bold" />
          Character
        </MenuItem>
        <MenuItem>
          <GearSixIcon size={iconSize.sm} weight="bold" />
          Settings
        </MenuItem>
        <MenuItem disabled>
          <SignOutIcon size={iconSize.sm} weight="bold" />
          Sign out
        </MenuItem>
      </MenuGroup>
    </Menu>
  ),
};

export const Sliders: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Stack gap="xl">
        <Slider label="Music" defaultValue={70} />
        <Slider label="Sound effects" defaultValue={40} />
        <Slider label="Disabled" defaultValue={25} disabled />
      </Stack>
    </div>
  ),
};
