import posthog from "posthog-js";
import { redactResetLinks } from "./redact-reset-links.ts";

export const analyticsClient = posthog;

export function initializeAnalytics(apiUrl: string) {
  const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
  const ingestionHost = import.meta.env.VITE_POSTHOG_HOST;
  if (!projectToken) return;
  const apiHost = new URL(apiUrl || window.location.origin, window.location.origin).hostname;
  posthog.init(projectToken, {
    ...(ingestionHost && { api_host: ingestionHost }),
    ui_host: "https://us.posthog.com",
    defaults: "2026-08-30",
    strict_script_versioning: true,
    opt_out_capturing_by_default: import.meta.env.DEV,
    capture_pageview: "history_change",
    capture_pageleave: true,
    before_send: (event) =>
      event ? { ...event, properties: redactResetLinks(event.properties) } : event,
    person_profiles: "identified_only",
    autocapture: false,
    rageclick: false,
    capture_dead_clicks: false,
    disable_session_recording: true,
    capture_exceptions: false,
    capture_heatmaps: false,
    capture_performance: false,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    advanced_disable_feature_flags: true,
    tracing_headers: [apiHost],
  });
}
