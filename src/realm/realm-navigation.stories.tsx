import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { RealmNavigation } from "./realm-navigation.tsx";
const meta = {
  title: "Realm/Navigation",
  component: RealmNavigation,
  tags: ["autodocs"],
  args: { active: "map", onNavigate: () => undefined },
  argTypes: { active: { control: "radio", options: ["map", "loadout", "shop"] } },
  render: function Preview(args) {
    const [, update] = useArgs();
    return <RealmNavigation {...args} onNavigate={(active) => update({ active })} />;
  },
} satisfies Meta<typeof RealmNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Map: Story = {};
export const Loadout: Story = { args: { active: "loadout" } };
