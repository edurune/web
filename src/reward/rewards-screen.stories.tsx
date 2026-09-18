import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { ApiProvider } from "../api/api-provider.tsx";
import { createApiClient } from "../api/client.ts";
import type { GetApiMilestonesProgressResponse } from "../api/generated/types.gen.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import dailyMeta from "./daily-reward-card.stories.tsx";
import { RewardsScreen } from "./rewards-screen.tsx";

const styles = stylex.create({
  screen: { maxInlineSize: layout.portrait, blockSize: layout.viewport, display: "flex" },
});

function Preview({
  claimed = false,
  empty = false,
  failed = false,
}: {
  claimed?: boolean;
  empty?: boolean;
  failed?: boolean;
}) {
  const [state] = useState(() => {
    let daily = { ...dailyMeta.args.reward, claimed };
    let coins = 120;
    let gems = 8;
    const items: GetApiMilestonesProgressResponse["items"] = empty
      ? []
      : [
          {
            objective: {
              id: "lessons",
              metric: "lessons_completed",
              scope: { kind: "all_courses" },
              target: 10,
              reward: { coins: 50, gems: 1 },
            },
            progress: 10,
            status: "completed",
          },
          {
            objective: {
              id: "practices",
              metric: "practices_completed",
              scope: { kind: "all_courses" },
              target: 20,
              reward: { coins: 100, gems: 2 },
            },
            progress: 12,
            status: "in_progress",
          },
          {
            objective: {
              id: "courses",
              metric: "courses_completed",
              scope: { kind: "all_courses" },
              target: 1,
              reward: { coins: 100, gems: 3 },
            },
            progress: 1,
            status: "claimed",
          },
        ];
    const client = createApiClient("https://storybook.invalid", {
      fetch: async (input) => {
        const request = input as Request;
        const path = new URL(request.url).pathname;
        if (path === "/api/daily-reward/claim") {
          daily = { ...daily, claimed: true, streak: daily.streak + 1 };
          coins += daily.reward.coins;
          gems += daily.reward.gems;
          return Response.json({});
        }
        if (path.endsWith("/claim")) {
          const item = items.find((entry) => path.includes(`/${entry.objective.id}/`));
          if (item) {
            item.status = "claimed";
            coins += item.objective.reward.coins;
            gems += item.objective.reward.gems;
          }
          return Response.json({});
        }
        if (path === "/api/daily-reward") return Response.json(daily);
        if (path === "/api/wallet") return Response.json({ coins, gems });
        if (path === "/api/milestones/progress")
          return failed
            ? Response.json({ code: "internal_error" }, { status: 500 })
            : Response.json({ items, nextCursor: null });
        return Response.json({ id: "storybook-user" });
      },
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const root = createRootRoute();
    const route = createRoute({
      getParentRoute: () => root,
      path: "/",
      component: RewardsScreen,
    });
    const router = createRouter({
      routeTree: root.addChildren([route]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    return { client, queryClient, router };
  });
  return (
    <ApiProvider client={state.client} queryClient={state.queryClient}>
      <div {...stylex.props(styles.screen)}>
        <RouterProvider router={state.router} />
      </div>
    </ApiProvider>
  );
}

const meta = { title: "Rewards/Screen", component: Preview } satisfies Meta<typeof Preview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const DailyClaimed: Story = { args: { claimed: true } };
export const NoMilestones: Story = { args: { empty: true } };
export const MilestonesUnavailable: Story = { args: { failed: true } };
