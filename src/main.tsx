import { I18nProvider } from "@lingui/react";
import { IconContext } from "@phosphor-icons/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/nunito/wght.css";
import "./index.css";
import { ApiProvider, API_URL, createApiClient, createQueryClient } from "./api/index.ts";
import { i18n } from "./i18n/i18n.ts";
import { registerServiceWorker } from "./pwa/service-worker.ts";
import { routeTree } from "./routeTree.gen.ts";

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
    <I18nProvider i18n={i18n}>
      <IconContext.Provider value={iconDefaults}>
        <ApiProvider client={apiClient} queryClient={queryClient}>
          <RouterProvider router={router} />
        </ApiProvider>
      </IconContext.Provider>
    </I18nProvider>
  </StrictMode>,
);
