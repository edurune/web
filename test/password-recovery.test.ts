import assert from "node:assert/strict";
import { test } from "node:test";
import { redactResetLinks } from "../src/analytics/redact-reset-links.ts";
import { createApiClient, RateLimitError } from "../src/api/client.ts";

test("recovery tokens are removed from page, referrer, and person analytics properties", () => {
  const link = "https://app.example/reset-password?token=private-value#fragment";
  const properties = {
    $current_url: link,
    $referrer: link,
    $set_once: { $initial_current_url: link },
    $set: { $referrer: link },
    course: "lesson",
    $pathname: "/reset-password",
  };
  const result = redactResetLinks(properties);
  assert.deepEqual(result, {
    $current_url: "https://app.example/reset-password",
    $referrer: "https://app.example/reset-password",
    $set_once: { $initial_current_url: "https://app.example/reset-password" },
    $set: { $referrer: "https://app.example/reset-password" },
    course: "lesson",
    $pathname: "/reset-password",
  });
  assert.equal(properties.$current_url, link);
});

test("password recovery preserves retry deadlines and invalid-link errors", async () => {
  const client = createApiClient("http://localhost:3000", {
    fetch: async (input) => {
      const request = new Request(input);
      if (new URL(request.url).pathname === "/api/auth/request-password-reset") {
        assert.equal(request.headers.get("x-captcha-response"), "test-challenge");
        return new Response("Too many requests", {
          status: 429,
          headers: { "X-Retry-After": "23" },
        });
      }
      return Response.json({ code: "INVALID_TOKEN" }, { status: 400 });
    },
  });
  await assert.rejects(
    client.post({
      url: "/api/auth/request-password-reset",
      body: { email: "test@example.com", redirectTo: "http://localhost/reset-password" },
      headers: { "x-captcha-response": "test-challenge" },
      throwOnError: true,
    }),
    (error: unknown) => error instanceof RateLimitError && error.retryAfterSeconds === 23,
  );
  await assert.rejects(
    client.post({
      url: "/api/auth/reset-password",
      body: { token: "expired", newPassword: "replacement-password" },
      throwOnError: true,
    }),
    { code: "INVALID_TOKEN" },
  );
});
