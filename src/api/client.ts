import { createClient as createHeyApiClient, type Client } from "./generated/client/index.ts";

export interface CreateApiClientOptions {
  credentials?: RequestCredentials;
  fetch?: typeof fetch;
  mode?: RequestMode;
}

/** Talks to the API origin directly. Sessions are cookie-based, so credentials travel along. */
export function createApiClient(baseUrl: string, options?: CreateApiClientOptions): ApiClient {
  const client = createHeyApiClient({
    baseUrl,
    credentials: options?.credentials ?? "include",
    mode: options?.mode ?? "cors",
    ...(options?.fetch && { fetch: options.fetch }),
  });
  client.interceptors.error.use((error, response) =>
    response?.status === 429 ? { code: "TOO_MANY_REQUESTS" } : error,
  );
  return client;
}

export type ApiClient = Client;
