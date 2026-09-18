import { regions } from "@edurune/art/catalog";
import { encounterMusicUrls, interfaceMusicUrls, victoryMusicUrls } from "@edurune/art/assets";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../primitives/button.tsx";
import { Stack } from "../primitives/stack.tsx";
import { Text } from "../primitives/text.tsx";
import { playStinger } from "./music.ts";
import { useMusic } from "./use-music.ts";

const sceneIds = regions.map((scene) => scene.id);

interface MusicReviewProps {
  /** Which biome's encounter music to audition. */
  scene: (typeof sceneIds)[number];
  /** Select the region's boss track. */
  boss: boolean;
}

function MusicReview({ scene, boss }: MusicReviewProps) {
  const src = encounterMusicUrls[scene]![boss ? "boss" : "normal"];
  return (
    <LoopingMusicReview
      src={src}
      description="The region track loops and fades in as it does during battle."
    />
  );
}

function LoopingMusicReview({ src, description }: { src: string; description: string }) {
  const [playing, setPlaying] = useState(false);
  useMusic(playing ? src : null, "scene");
  return (
    <Stack gap="md" align="start">
      <Text variant="bodyStrong">{src}</Text>
      <Text variant="caption" tone="secondary">
        {description}
      </Text>
      <Stack direction="row" gap="sm">
        <Button cue={null} onClick={() => setPlaying(true)}>
          Play
        </Button>
        <Button cue={null} variant="secondary" onClick={() => setPlaying(false)}>
          Stop
        </Button>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: "Sound/Music",
  component: MusicReview,
  tags: ["autodocs"],
  argTypes: {
    scene: { control: "select", options: sceneIds },
    boss: { control: "boolean" },
  },
} satisfies Meta<typeof MusicReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Encounter: Story = {
  args: { scene: "forest-clearing", boss: false },
};

export const BossEncounter: Story = {
  args: { scene: "forest-clearing", boss: true },
};

export const Challenges: StoryObj = {
  render: () => (
    <LoopingMusicReview
      src={interfaceMusicUrls.challenges}
      description="Background music for the Challenges page."
    />
  ),
};

export const Versus: StoryObj = {
  render: () => (
    <LoopingMusicReview
      src={interfaceMusicUrls.versus}
      description="Tournament music reserved for the future Versus screen."
    />
  ),
};

export const Victory: StoryObj = {
  render: () => (
    <Stack gap="md" align="start">
      <Text variant="caption" tone="secondary">
        Victory tracks play once after encounter music stops.
      </Text>
      <Stack direction="row" gap="sm">
        {(["active", "a", "b", "c"] as const).map((take) => (
          <Button
            key={take}
            cue={null}
            variant="secondary"
            onClick={() => playStinger(victoryMusicUrls[take]!)}
          >
            Take {take.toUpperCase()}
          </Button>
        ))}
      </Stack>
    </Stack>
  ),
};
