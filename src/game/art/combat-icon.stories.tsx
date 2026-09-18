import type { Meta, StoryObj } from "@storybook/react-vite";
import { icons } from "@edurune/art/catalog";
import { Surface } from "../../ui/primitives/surface.tsx";
import { CombatIcon } from "./combat-icon.tsx";

const meta = {
  title: "Game/CombatIcon",
  component: CombatIcon,
  tags: ["autodocs"],
  args: { iconId: "icon-action-attack", theme: "light" },
  argTypes: {
    iconId: { control: "select", options: icons.map((item) => item.id) },
    theme: { control: "inline-radio" },
  },
  decorators: [
    (Story, context) => (
      <Surface tone={context.args.theme === "dark" ? "inverse" : "raised"} depth="flat">
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof CombatIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AttackAction: Story = {};
export const HealthResource: Story = { args: { iconId: "icon-resource-health" } };
export const Defeated: Story = { args: { iconId: "icon-effect-defeat" } };
export const StatusIncrease: Story = {
  args: { iconId: "icon-status-max-health-up" },
};
export const DarkSurface: Story = { args: { theme: "dark" } };
