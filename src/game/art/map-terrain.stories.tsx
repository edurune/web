import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { regions } from "@edurune/art/catalog";
import { MapTerrain } from "./map-terrain.tsx";
import { layout } from "../../ui/tokens/layout.stylex.ts";
import { realmLayout } from "../../ui/tokens/realm.stylex.ts";

const styles = stylex.create({
  frame: { maxInlineSize: layout.portrait, inlineSize: layout.full },
  repeats: { aspectRatio: realmLayout.terrainReview },
});
const meta = {
  title: "Game/Map terrain",
  component: MapTerrain,
  tags: ["autodocs"],
  args: { sceneId: "forest-clearing", style: styles.repeats },
  argTypes: {
    sceneId: { control: "select", options: [null, ...regions.map((scene) => scene.id)] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MapTerrain>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Repeating: Story = {};
export const Legacy: Story = { args: { sceneId: null } };
