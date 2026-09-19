import posthog from "posthog-js";

const projectToken = "phc_vU4w9VdGwY9VDxddR9AFUHSfwVsx36j78bGKdMmnHSKx";
const ingestionHost = "https://t.settenhq.com";
const projectHost = "https://us.posthog.com";

export const analyticsClient = posthog;

export function initializeAnalytics(apiUrl: string) {
  const apiHost = new URL(apiUrl || window.location.origin, window.location.origin).hostname;
  posthog.init(projectToken, {
    api_host: ingestionHost,
    ui_host: projectHost,
    defaults: "2026-08-30",
    strict_script_versioning: true,
    opt_out_capturing_by_default: import.meta.env.DEV,
    capture_pageview: "history_change",
    capture_pageleave: true,
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
