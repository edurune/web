import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { AppNavigation, type AppNavigationProps } from "./app-navigation.tsx";

const meta = {
  title: "App/Navigation",
  component: AppNavigation,
  tags: ["autodocs"],
  args: {
    active: "search",
    onHome: () => {},
    onSearch: () => {},
    onChallenges: () => {},
    onMe: () => {},
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<AppNavigationProps>();
    return (
      <AppNavigation
        {...args}
        onHome={() => updateArgs({ active: "home" })}
        onSearch={() => updateArgs({ active: "search" })}
        onChallenges={() => updateArgs({ active: "challenges" })}
        onMe={() => updateArgs({ active: "me" })}
      />
    );
  },
} satisfies Meta<typeof AppNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {};
export const Home: Story = { args: { active: "home" } };
export const Challenges: Story = { args: { active: "challenges" } };
export const Me: Story = { args: { active: "me" } };
