import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import type { ApiClient } from "../client.ts";
import { getApiMeOptions } from "../generated/@tanstack/react-query.gen.ts";
import { getApiMe } from "../generated/sdk.gen.ts";
import { isUnauthenticated } from "../error-messages.ts";
import type { GetApiMeResponse } from "../generated/types.gen.ts";

// better-auth routes are hidden from the OpenAPI document, so these are written out.
export interface EmailCredentials {
  email: string;
  password: string;
  captchaToken: string;
}

export interface SignUpDetails extends EmailCredentials {
  name: string;
  birthYear?: GetApiMeResponse["birthYear"];
  language?: GetApiMeResponse["language"];
}

export type UserPreferences = Partial<Pick<GetApiMeResponse, "name" | "birthYear" | "language">>;

function useSessionInvalidation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return () => {
    const { queryKey } = getApiMeOptions({ client });
    const sessionQuery = queryClient.getQueryCache().find({ queryKey, exact: true });
    queryClient.removeQueries({ predicate: (query) => query !== sessionQuery });
    return queryClient.invalidateQueries({ queryKey });
  };
}

function useSessionMutation<Body extends { captchaToken: string }>(url: string) {
  const client = useApiClient();
  return useMutation({
    mutationFn: ({ captchaToken, ...body }: Body) => post(client, url, body, captchaToken),
    onSuccess: useSessionInvalidation(),
  });
}

const post = (client: ApiClient, url: string, body: unknown, captchaToken?: string) =>
  client.post({
    url,
    body,
    ...(captchaToken && { headers: { "x-captcha-response": captchaToken } }),
    throwOnError: true,
  });

export function useAnonymousSignInMutation() {
  const client = useApiClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await getApiMe({ client, throwOnError: true });
      } catch (error) {
        if (!isUnauthenticated(error)) throw error;
        await post(client, "/api/auth/sign-in/anonymous", {});
      }
    },
    onSuccess: useSessionInvalidation(),
  });
}

export function useUpdateUserMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UserPreferences) => post(client, "/api/auth/update-user", body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getApiMeOptions({ client }).queryKey }),
  });
}

export function useEmailSignInMutation() {
  return useSessionMutation<EmailCredentials>("/api/auth/sign-in/email");
}

/** Signing up while anonymous carries that guest's progress onto the new account. */
export function useEmailSignUpMutation() {
  return useSessionMutation<SignUpDetails>("/api/auth/sign-up/email");
}

export function useSignOutMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => post(client, "/api/auth/sign-out", {}),
    onSuccess: () => queryClient.clear(),
  });
}
