import { createFileRoute } from "@tanstack/react-router";
import { isUnauthenticated } from "../api/error-messages.ts";
import { userSessionOptions } from "../api/user/user-session-options.ts";
import {
  useAnonymousSignInMutation,
  useEmailSignInMutation,
  useEmailSignUpMutation,
} from "../api/user/use-user-mutations.ts";
import { LoginScreen } from "../user/login-screen.tsx";
import { useMeQuery } from "../api/user/use-user-queries.ts";

interface LoginSearch {
  return_to?: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    ...(typeof search.return_to === "string" && { return_to: search.return_to }),
  }),
  loader: async ({ context }) => {
    try {
      return await context.queryClient.ensureQueryData(userSessionOptions(context.apiClient));
    } catch (error) {
      if (isUnauthenticated(error)) return null;
      throw error;
    }
  },
  component: Login,
});

function Login() {
  const initialUser = Route.useLoaderData();
  const search = Route.useSearch();
  const user = useMeQuery().data ?? initialUser;
  const navigate = Route.useNavigate();
  const login = useEmailSignInMutation();
  const signup = useEmailSignUpMutation();
  const guest = useAnonymousSignInMutation();
  const onSuccess = () => {
    void navigate({ to: search.return_to ?? "/", replace: true });
  };
  return (
    <LoginScreen
      initialMode={user?.anonymous ? "signup" : "login"}
      guest={user?.anonymous}
      pending={login.isPending || signup.isPending}
      guestPending={guest.isPending}
      error={login.error ?? signup.error ?? guest.error}
      onLogin={(credentials) => login.mutateAsync(credentials, { onSuccess })}
      onSignUp={(details) =>
        signup.mutateAsync(
          {
            ...details,
            ...(user?.anonymous ? { birthYear: user.birthYear, language: user.language } : {}),
          },
          { onSuccess },
        )
      }
      onGuest={() => guest.mutate(undefined, { onSuccess })}
      onModeChange={() => {
        login.reset();
        signup.reset();
        guest.reset();
      }}
    />
  );
}
