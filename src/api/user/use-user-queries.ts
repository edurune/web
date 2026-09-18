import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { userSessionOptions } from "./user-session-options.ts";
import { getApiMeSummaryOptions } from "../generated/@tanstack/react-query.gen.ts";

export function useMeQuery() {
  return useQuery(userSessionOptions(useApiClient()));
}

export function useMeSummaryQuery() {
  return useQuery(getApiMeSummaryOptions({ client: useApiClient() }));
}
