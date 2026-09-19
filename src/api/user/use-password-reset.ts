import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { retryAfterSeconds } from "../client.ts";
import { getApiMeQueryKey } from "../generated/@tanstack/react-query.gen.ts";

export interface PasswordResetRequest {
  email: string;
  captchaToken: string;
}

export interface PasswordResetDetails {
  token: string;
  newPassword: string;
}

export function useRequestPasswordResetMutation() {
  const client = useApiClient();
  return useMutation({
    mutationFn: async ({ email, captchaToken }: PasswordResetRequest) => {
      const result = await client.post({
        url: "/api/auth/request-password-reset",
        body: { email, redirectTo: new URL("/reset-password", window.location.origin).href },
        headers: { "x-captcha-response": captchaToken },
        throwOnError: true,
      });
      return retryAfterSeconds(result.response);
    },
  });
}

export function useResetPasswordMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PasswordResetDetails) =>
      client.post({
        url: "/api/auth/reset-password",
        body,
        throwOnError: true,
      }),
    onSuccess: () => {
      const queryKey = getApiMeQueryKey({ client });
      const session = queryClient.getQueryCache().find({ queryKey, exact: true });
      queryClient.removeQueries({ predicate: (query) => query !== session });
      return queryClient.resetQueries({ queryKey, exact: true });
    },
  });
}
