import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/play")({
  beforeLoad: () => {
    throw redirect({ to: "/challenges", replace: true });
  },
});
