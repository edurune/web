import { createClient as createHeyApiClient, type Client } from "./generated/client/index.ts";

export interface CreateApiClientOptions {
  credentials?: RequestCredentials;
  fetch?: typeof fetch;
  mode?: RequestMode;
}

export class RateLimitError extends Error {
  readonly code = "TOO_MANY_REQUESTS";
  readonly retryAfterSeconds: number;

  constructor(seconds: number) {
    super("Too many requests.");
    this.retryAfterSeconds = seconds;
  }
}

export function retryAfterSeconds(response: Response): number {
  const header = response.headers.get("X-Retry-After");
  const seconds = Number(header);
  return header !== null && Number.isFinite(seconds) && seconds >= 0 ? Math.ceil(seconds) : 60;
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
    response?.status === 429 ? new RateLimitError(retryAfterSeconds(response)) : error,
  );
  return client;
}

export type ApiClient = Client;
