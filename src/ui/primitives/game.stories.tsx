import { HeartIcon, LightningIcon, ShieldIcon, SwordIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { appearanceColors } from "../../character/appearance-colors.ts";
import { ColorSwatchPicker } from "./color-swatch-picker.tsx";
import { CurrencyAmount } from "./currency-amount.tsx";
import { Divider } from "./divider.tsx";
import { StatDelta } from "./stat-delta.tsx";
import { Stack } from "./stack.tsx";
import { Surface } from "./surface.tsx";
import { Text } from "./text.tsx";

const meta = {
  title: "Primitives/Game",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Currencies: Story = {
  render: () => (
    <Stack gap="xl">
      <Stack direction="row" gap="lg" align="center">
        <CurrencyAmount kind="coin" amount={1240} size="sm" />
        <CurrencyAmount kind="gem" amount={18} size="sm" />
        <CurrencyAmount kind="medal" amount={65} size="sm" />
      </Stack>
      <Stack direction="row" gap="lg" align="center">
        <CurrencyAmount kind="coin" amount={1240} />
        <CurrencyAmount kind="gem" amount={18} />
        <CurrencyAmount kind="medal" amount={65} />
      </Stack>
      <Stack direction="row" gap="lg" align="center">
        <CurrencyAmount kind="coin" amount={128400} size="lg" />
        <CurrencyAmount kind="medal" amount={10} size="lg" signed />
        <CurrencyAmount kind="coin" amount={-120} size="lg" signed />
      </Stack>
    </Stack>
  ),
};

export const Stats: Story = {
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Surface depth="lifted">
        <Stack gap="sm">
          <Text variant="subheading">Tide blade</Text>
          <Divider />
          <StatDelta label="Attack" value={4} icon={SwordIcon} />
          <StatDelta label="Defense" value={-1} icon={ShieldIcon} />
          <StatDelta label="Max health" value={0} icon={HeartIcon} />
          <StatDelta label="Speed" value={2} icon={LightningIcon} />
        </Stack>
      </Surface>
    </div>
  ),
};

const skinTones = appearanceColors.skinTone.map((option) => option.value);
const hairColors = appearanceColors.hairColor.map((option) => option.value);
const eyeColors = appearanceColors.eyeColor.map((option) => option.value);

function Appearance() {
  const [skin, setSkin] = useState<string>(appearanceColors.skinTone[3].value);
  const [hair, setHair] = useState<string>(appearanceColors.hairColor[1].value);
  const [eyes, setEyes] = useState<string>(appearanceColors.eyeColor[2].value);

  return (
    <div style={{ maxWidth: 360 }}>
      <Stack gap="xl">
        <Stack gap="sm">
          <Text variant="label">Skin tone</Text>
          <ColorSwatchPicker
            label="Skin tone"
            colors={skinTones}
            value={skin}
            onValueChange={(next) => setSkin(next as string)}
          />
        </Stack>
        <Stack gap="sm">
          <Text variant="label">Hair colour</Text>
          <ColorSwatchPicker
            label="Hair colour"
            colors={hairColors}
            value={hair}
            onValueChange={(next) => setHair(next as string)}
          />
        </Stack>
        <Stack gap="sm">
          <Text variant="label">Eye colour</Text>
          <ColorSwatchPicker
            label="Eye colour"
            colors={eyeColors}
            value={eyes}
            size="sm"
            onValueChange={(next) => setEyes(next as string)}
          />
        </Stack>
        <Text variant="caption" tone="muted">
          {skin} · {hair} · {eyes}
        </Text>
      </Stack>
    </div>
  );
}

export const Appearances: Story = {
  render: () => <Appearance />,
};
