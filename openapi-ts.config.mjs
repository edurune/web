import { execFileSync } from "node:child_process";

import { defineConfig } from "@hey-api/openapi-ts";

const source = process.env.OPENAPI_SCHEMA;
if (!source) throw new Error("Set OPENAPI_SCHEMA.");

const input = source.endsWith(".ts")
  ? JSON.parse(
      execFileSync("bun", [source], {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
      }),
    )
  : source;

export default defineConfig({
  input,
  output: { path: "src/api/generated", module: { extension: ".ts" } },
  // The query plugin emits `*Options` and `*Mutation` builders, so screens and route
  // loaders share one query key per endpoint instead of writing their own.
  plugins: [
    "@hey-api/client-fetch",
    "@hey-api/typescript",
    "@hey-api/sdk",
    "@tanstack/react-query",
  ],
});
