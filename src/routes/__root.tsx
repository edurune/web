import * as stylex from "@stylexjs/stylex";
import type { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect } from "react";
import { errorMessage } from "../api/error-messages.ts";
import { startSound } from "../ui/sound/sound.ts";
import { startMusic } from "../ui/sound/music.ts";
import { AudioUnlockOverlay } from "../ui/sound/audio-unlock-overlay.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import type { ApiClient } from "../api/index.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { font, fontSize, lineHeight } from "../ui/tokens/text.stylex.ts";

/** Both reach every loader, so a route can prime the cache before its screen mounts. */
export interface RouterContext {
  queryClient: QueryClient;
  apiClient: ApiClient;
}

const styles = stylex.create({
  app: {
    backgroundColor: color.surfacePage,
    color: color.textPrimary,
    fontFamily: font.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
    minHeight: layout.viewport,
  },
  error: { maxInlineSize: layout.portrait, marginInline: "auto", padding: space.xl },
});

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: RequestError,
  component: RootLayout,
});

function RootLayout() {
  useEffect(() => {
    const stopSound = startSound();
    const stopMusic = startMusic();
    return () => {
      stopSound();
      stopMusic();
    };
  }, []);
  return (
    <div {...stylex.props(styles.app)}>
      <Outlet />
      <AudioUnlockOverlay />
    </div>
  );
}

function RequestError({ error }: ErrorComponentProps) {
  const { t } = useLingui();
  const router = useRouter();
  return (
    <div {...stylex.props(styles.error)}>
      <Alert
        tone="negative"
        action={
          <Button
            variant="secondary"
            cue="retry"
            onClick={() => {
              void router.invalidate();
            }}
          >
            <Trans>Try again</Trans>
          </Button>
        }
      >
        {t(errorMessage(error))}
      </Alert>
    </div>
  );
}
