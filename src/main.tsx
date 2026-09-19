import { I18nProvider } from "@lingui/react";
import { IconContext } from "@phosphor-icons/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PostHogProvider } from "@posthog/react";
import "@fontsource-variable/nunito/wght.css";
import "./index.css";
import { ApiProvider, API_URL, createApiClient, createQueryClient } from "./api/index.ts";
import { ErrorBoundary } from "./app/error-boundary.tsx";
import { i18n } from "./i18n/i18n.ts";
import { recoverApp, registerServiceWorker } from "./pwa/service-worker.ts";
import { routeTree } from "./routeTree.gen.ts";
import { analyticsClient, initializeAnalytics } from "./analytics/client.ts";
import { AnalyticsIdentity } from "./analytics/identity.tsx";

initializeAnalytics(API_URL);
const apiClient = createApiClient(API_URL);
const queryClient = createQueryClient();
const iconDefaults = { weight: "bold" } as const;

const router = createRouter({
  routeTree,
  context: { queryClient, apiClient },
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={analyticsClient}>
      <ErrorBoundary onReload={recoverApp}>
        <I18nProvider i18n={i18n}>
          <IconContext.Provider value={iconDefaults}>
            <ApiProvider client={apiClient} queryClient={queryClient}>
              <AnalyticsIdentity />
              <RouterProvider router={router} />
            </ApiProvider>
          </IconContext.Provider>
        </I18nProvider>
      </ErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
);
