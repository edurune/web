import type { ApiClient } from "./client.ts";

export function assetUrl(client: ApiClient, assetId: string): string {
  return client.buildUrl({ url: "/api/assets/{assetId}", path: { assetId } });
}
