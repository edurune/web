import { createFileRoute } from "@tanstack/react-router";
import { useResetPasswordMutation } from "../api/user/use-password-reset.ts";
import { ResetPasswordScreen } from "../user/password-recovery-screen.tsx";

interface ResetPasswordSearch {
  token?: string;
  error?: string;
}

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    ...(typeof search.token === "string" && search.token && { token: search.token }),
    ...(typeof search.error === "string" && { error: search.error }),
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token, error } = Route.useSearch();
  const reset = useResetPasswordMutation();
  const navigate = Route.useNavigate();
  return (
    <ResetPasswordScreen
      invalidLink={!token || Boolean(error)}
      pending={reset.isPending}
      complete={reset.isSuccess}
      error={reset.error}
      onReset={async (newPassword) => {
        if (!token) return;
        await reset.mutateAsync({ token, newPassword });
        await navigate({ to: "/reset-password", search: {}, replace: true });
      }}
      onRequestNewLink={() => void navigate({ to: "/forgot-password", replace: true })}
      onLogin={() => void navigate({ to: "/login", search: {}, replace: true })}
    />
  );
}
