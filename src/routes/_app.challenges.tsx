import { createFileRoute } from "@tanstack/react-router";
import { PlayScreen } from "../play/play-screen.tsx";

export const Route = createFileRoute("/_app/challenges")({
  component: PlayScreen,
});
