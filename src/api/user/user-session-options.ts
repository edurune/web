import type { ApiClient } from "../client.ts";
import { getApiMeOptions } from "../generated/@tanstack/react-query.gen.ts";

export const userSessionOptions = (client: ApiClient) => ({
  ...getApiMeOptions({ client }),
  retry: false as const,
});
