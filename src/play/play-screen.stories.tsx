import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { AppNavigation } from "../ui/app-navigation.tsx";
import { AppShell } from "../ui/app-shell.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { PlayScreen } from "./play-screen.tsx";

const styles = stylex.create({
  // The app shell owns its viewport; cancel the component preview's outer padding.
  viewport: { margin: `calc(-1 * ${space.xl})` },
});

const meta = {
  title: "Challenges/Screen",
  component: PlayScreen,
  parameters: { layout: "fullscreen" },
  render: (_, context) => (
    <div {...stylex.props(styles.viewport)}>
      <AppShell
        anonymous={context.parameters.guest === true}
        onLogin={() => {}}
        navigation={
          <AppNavigation
            active="challenges"
            onHome={() => {}}
            onSearch={() => {}}
            onChallenges={() => {}}
            onMe={() => {}}
          />
        }
      >
        <PlayScreen />
      </AppShell>
    </div>
  ),
} satisfies Meta<typeof PlayScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Guest: Story = { parameters: { guest: true } };
export const Vietnamese: Story = { globals: { locale: "vi" } };
