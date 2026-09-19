import { createFileRoute } from "@tanstack/react-router";
import { useRequestPasswordResetMutation } from "../api/user/use-password-reset.ts";
import { ForgotPasswordScreen } from "../user/password-recovery-screen.tsx";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const request = useRequestPasswordResetMutation();
  const navigate = Route.useNavigate();
  return (
    <ForgotPasswordScreen
      pending={request.isPending}
      sent={request.isSuccess}
      error={request.error}
      onRequest={(details) => request.mutateAsync(details)}
      onLogin={() => void navigate({ to: "/login", search: {} })}
    />
  );
}
