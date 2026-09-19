/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly VITE_POSTHOG_PROJECT_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
