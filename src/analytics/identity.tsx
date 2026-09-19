import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { useMeQuery } from "../api/user/use-user-queries.ts";

export function AnalyticsIdentity() {
  const analytics = usePostHog();
  const user = useMeQuery().data;
  const userId = user?.id;
  const anonymous = user?.anonymous;
  const language = user?.language;

  useEffect(() => {
    if (!import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || !userId || anonymous) return;
    analytics.identify(userId, {
      language,
    });
  }, [analytics, anonymous, language, userId]);

  return null;
}
