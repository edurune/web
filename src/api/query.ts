import type { QueryClient, QueryKey } from "@tanstack/react-query";

export function invalidateQueries(client: QueryClient, queries: Iterable<{ queryKey: QueryKey }>) {
  return Promise.all(Array.from(queries, ({ queryKey }) => client.invalidateQueries({ queryKey })));
}
