import type { Meta, StoryObj } from "@storybook/react-vite";
import { backgroundUrls } from "@edurune/art/assets";
import { backgroundIds, type BackgroundId } from "@edurune/art/catalog";
import * as stylex from "@stylexjs/stylex";
import { artSize } from "../../ui/tokens/art.stylex.ts";
import { layout } from "../../ui/tokens/layout.stylex.ts";
import { space } from "../../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  art: {
    display: "block",
    inlineSize: layout.full,
    maxInlineSize: artSize.scene,
    blockSize: "auto",
  },
  card: { maxInlineSize: layout.portrait },
  gallery: { display: "grid", gap: space.xl },
});

function Background({ id, cardSize = false }: { id: BackgroundId; cardSize?: boolean }) {
  return (
    <img
      src={backgroundUrls[id]}
      alt={
        id === "mode-banner"
          ? "Green hills and a winding path framed by ancient gateposts"
          : id === "versus-faceoff"
            ? "A low-angle face-off between two travelers with distant monsters above"
            : id === "versus"
              ? "Two travelers and their monsters face off"
              : id === "infinite-dungeon-entry"
                ? "A low camera looks up at a traveler emerging from a high dungeon doorway"
                : "A traveler at an endless dungeon entrance"
      }
      width="960"
      height="540"
      {...stylex.props(styles.art, cardSize && styles.card)}
    />
  );
}

const meta = {
  title: "Game/Backgrounds",
  component: Background,
  args: { id: "versus" },
  argTypes: { id: { control: "select", options: backgroundIds } },
} satisfies Meta<typeof Background>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Versus: Story = {};
export const ModeHeader: Story = { args: { id: "mode-banner" } };
export const VersusFaceoff: Story = { args: { id: "versus-faceoff" } };
export const InfiniteDungeon: Story = { args: { id: "infinite-dungeon" } };
export const InfiniteDungeonDoorway: Story = { args: { id: "infinite-dungeon-entry" } };
export const CardSize: Story = {
  render: () => (
    <div {...stylex.props(styles.gallery)}>
      {backgroundIds.map((id) => (
        <Background key={id} id={id} cardSize />
      ))}
    </div>
  ),
};
