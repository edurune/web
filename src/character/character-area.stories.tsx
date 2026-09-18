import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { QueryClient } from "@tanstack/react-query";
import { defaultOutfit } from "@edurune/art/catalog";
import { useState } from "react";
import { ApiProvider } from "../api/api-provider.tsx";
import { createApiClient } from "../api/client.ts";
import {
  getApiCharacterProfileOptions,
  getApiWalletOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { CharacterArea } from "./character-area.tsx";

const styles = stylex.create({
  frame: { inlineSize: layout.full, maxInlineSize: layout.portrait },
});

const meta = {
  title: "Character/CharacterArea",
  component: CharacterArea,
  tags: ["autodocs"],
  args: {
    compact: true,
    setting: "shop",
  },
  argTypes: {
    setting: { control: "inline-radio" },
    preview: { control: "object" },
    name: { control: "text" },
    actions: { control: false },
    characterActions: { control: false },
  },
  decorators: [
    function WithCharacter(Story) {
      const [api] = useState(() => {
        const client = createApiClient("http://storybook.invalid");
        const queryClient = new QueryClient({
          defaultOptions: { queries: { enabled: false, staleTime: Infinity } },
        });
        queryClient.setQueryData(getApiCharacterProfileOptions({ client }).queryKey, {
          appearance: {
            skinTone: "#e6b18a",
            hairStyle: "rounded-curls",
            hairColor: "#514543",
            eyeColor: "#303047",
          },
          equipped: defaultOutfit,
          appearanceChosen: true,
        });
        queryClient.setQueryData(getApiWalletOptions({ client }).queryKey, { coins: 10, gems: 0 });
        return { client, queryClient };
      });
      return (
        <ApiProvider {...api}>
          <div {...stylex.props(styles.frame)}>
            <Story />
          </div>
        </ApiProvider>
      );
    },
  ],
} satisfies Meta<typeof CharacterArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shop: Story = {};
export const FullHeight: Story = { args: { compact: false } };
export const BackgroundPreview: Story = {
  args: { preview: { background: "clover-meadow" } },
};
export const FlowerMarketPreview: Story = {
  args: { preview: { background: "flower-market" } },
};
export const Forest: Story = { args: { setting: "forest" } };
