import { createContext, use } from "react";
import type { ApiClient } from "./client.ts";

export const ApiContext = createContext<{ client: ApiClient } | null>(null);

export function useApiClient(): ApiClient {
  const context = use(ApiContext);
  if (!context) throw new Error("useApiClient must be used within an ApiProvider.");
  return context.client;
}
