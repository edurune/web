import { QueryClientProvider } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ApiContext } from "./api-context.ts";
import type { ApiClient } from "./client.ts";

export interface ApiProviderProps {
  children: ReactNode;
  client: ApiClient;
  queryClient: QueryClient;
}

export function ApiProvider({ children, client, queryClient }: ApiProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext value={{ client }}>{children}</ApiContext>
    </QueryClientProvider>
  );
}
