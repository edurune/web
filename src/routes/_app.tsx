import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { interfaceMusicUrls } from "@edurune/art/assets";
import { isUnauthenticated } from "../api/error-messages.ts";
import { userSessionOptions } from "../api/user/user-session-options.ts";
import { getApiCharacterProfileOptions } from "../api/generated/@tanstack/react-query.gen.ts";
import { useMeQuery } from "../api/user/use-user-queries.ts";
import { AppShell } from "../ui/app-shell.tsx";
import { AppNavigation } from "../ui/app-navigation.tsx";
import { useMusic } from "../ui/sound/use-music.ts";

const MENU_MUSIC_PATHS = new Set(["/", "/search", "/me", "/wardrobe", "/missions", "/rewards"]);

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(userSessionOptions(context.apiClient));
      const profile = await context.queryClient.ensureQueryData(
        getApiCharacterProfileOptions({ client: context.apiClient }),
      );
      if (!profile.appearanceChosen || user.birthYear === null)
        throw redirect({ to: "/onboarding", replace: true });
    } catch (error) {
      if (isUnauthenticated(error)) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: ProtectedApp,
});

function ProtectedApp() {
  const user = useMeQuery();
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();
  const backgroundMusic = pathname.endsWith("/shop")
    ? interfaceMusicUrls.shop
    : pathname === "/challenges"
      ? interfaceMusicUrls.challenges
      : MENU_MUSIC_PATHS.has(pathname)
        ? interfaceMusicUrls.menu
        : null;
  useMusic(backgroundMusic);
  const hideNavigation =
    pathname.startsWith("/courses/") ||
    pathname === "/missions" ||
    pathname === "/rewards" ||
    pathname === "/wardrobe" ||
    pathname === "/shop" ||
    pathname === "/appearance";
  return (
    <AppShell
      anonymous={user.data?.anonymous === true}
      onLogin={() => {
        void navigate({ to: "/login" });
      }}
      navigation={
        !hideNavigation && (
          <AppNavigation
            active={
              pathname === "/search"
                ? "search"
                : pathname === "/challenges"
                  ? "challenges"
                  : pathname === "/me"
                    ? "me"
                    : "home"
            }
            onHome={() => {
              void navigate({ to: "/" });
            }}
            onSearch={() => {
              void navigate({ to: "/search", search: {} });
            }}
            onChallenges={() => {
              void navigate({ to: "/challenges" });
            }}
            onMe={() => {
              void navigate({ to: "/me" });
            }}
          />
        )
      }
    >
      <Outlet />
    </AppShell>
  );
}
