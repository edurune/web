import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { Button } from "./button.tsx";
import { CurrencyChip, type CurrencyChipProps } from "./currency-chip.tsx";
import { Stack } from "./stack.tsx";

const meta = {
  title: "Primitives/Currency chip",
  component: CurrencyChip,
  tags: ["autodocs"],
  args: { kind: "coin", amount: 640 },
  argTypes: { kind: { control: "select", options: ["coin", "gem", "medal"] } },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CurrencyChipProps>();
    return (
      <Stack gap="xxxl" align="start">
        <CurrencyChip {...args} />
        <Stack direction="row">
          <Button onClick={() => updateArgs({ amount: args.amount + 10 })}>Earn 10</Button>
          <Button
            variant="secondary"
            disabled={args.amount < 10}
            onClick={() => updateArgs({ amount: args.amount - 10 })}
          >
            Spend 10
          </Button>
        </Stack>
      </Stack>
    );
  },
} satisfies Meta<typeof CurrencyChip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Coins: Story = {};
export const Gems: Story = { args: { kind: "gem", amount: 12 } };
export const Medals: Story = { args: { kind: "medal", amount: 24 } };
export const Empty: Story = { args: { amount: 0 } };
