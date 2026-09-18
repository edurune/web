import type { Meta, StoryObj } from "@storybook/react-vite";
import { equipments, type ItemMetadata } from "@edurune/art/catalog";
import { useLingui } from "@lingui/react/macro";
import { EquipmentIcon } from "./equipment-icon.tsx";
import { Stack } from "../../ui/primitives/stack.tsx";
import { Text } from "../../ui/primitives/text.tsx";

const meta = {
  title: "Game/EquipmentIcon",
  component: EquipmentIcon,
  tags: ["autodocs"],
  args: { equipmentId: "weapon-practice-sword" },
  render: function EquipmentPreview(args) {
    const { t } = useLingui();
    const item: ItemMetadata | undefined = equipments.find(({ id }) => id === args.equipmentId);
    return (
      <Stack direction="row" align="start">
        <EquipmentIcon {...args} />
        {item && (
          <Stack gap="xs">
            {item.name && <Text>{t(item.name)}</Text>}
            {item.description && <Text tone="muted">{t(item.description)}</Text>}
          </Stack>
        )}
      </Stack>
    );
  },
  argTypes: {
    equipmentId: { control: "select", options: equipments.map((item) => item.id) },
  },
} satisfies Meta<typeof EquipmentIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Weapon: Story = {};
export const Armor: Story = { args: { equipmentId: "armor-buckler" } };
export const Charm: Story = { args: { equipmentId: "charm-herb-pouch" } };
export const MissingEquipment: Story = { args: { equipmentId: "unavailable-equipment" } };
