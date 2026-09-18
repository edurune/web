import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { ErrorBoundary } from "./error-boundary.tsx";

const meta = {
  title: "App/Error boundary",
  component: ErrorBoundary,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

function BrokenScreen(): ReactNode {
  throw new Error("Preview error");
}

export const Recovery: Story = {
  args: { children: <BrokenScreen />, onReload: () => {} },
};
