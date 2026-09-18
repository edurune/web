import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  getApiCharacterAppearanceOptionsOptions,
  getApiCharacterProfileOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
import { isUnauthenticated } from "../api/error-messages.ts";
import { userSessionOptions } from "../api/user/user-session-options.ts";
import { OnboardingScreen } from "../user/onboarding-screen.tsx";
import { PwaNotices } from "../pwa/pwa-notices.tsx";
import { AppShell } from "../ui/app-shell.tsx";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(userSessionOptions(context.apiClient));
      const profile = await context.queryClient.ensureQueryData(
        getApiCharacterProfileOptions({ client: context.apiClient }),
      );
      if (profile.appearanceChosen && user.birthYear !== null)
        throw redirect({ to: "/", replace: true });
    } catch (error) {
      if (isUnauthenticated(error)) throw redirect({ to: "/login", replace: true });
      throw error;
    }
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      getApiCharacterAppearanceOptionsOptions({ client: context.apiClient }),
    ),
  component: Onboarding,
});

function Onboarding() {
  const navigate = Route.useNavigate();
  return (
    <AppShell
      notices={<PwaNotices />}
      anonymous={false}
      onLogin={() => {
        void navigate({ to: "/login" });
      }}
    >
      <OnboardingScreen />
    </AppShell>
  );
}
