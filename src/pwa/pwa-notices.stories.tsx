import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stack } from "../ui/primitives/stack.tsx";
import { OfflineBanner } from "./offline-banner.tsx";
import { UpdateBanner } from "./update-banner.tsx";

const meta = {
  title: "App/PWA notices",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Update: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <UpdateBanner onUpdate={() => {}} onDismiss={() => {}} />
    </div>
  ),
};

export const Applying: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <UpdateBanner applying onUpdate={() => {}} onDismiss={() => {}} />
    </div>
  ),
};

export const Offline: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <OfflineBanner />
    </div>
  ),
};

export const Both: Story = {
  render: function Notices() {
    const [applying, setApplying] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    return (
      <div style={{ maxWidth: 480 }}>
        <Stack gap="none">
          <OfflineBanner />
          {!dismissed && (
            <UpdateBanner
              applying={applying}
              onUpdate={() => setApplying(true)}
              onDismiss={() => setDismissed(true)}
            />
          )}
        </Stack>
      </div>
    );
  },
};
