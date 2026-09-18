import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
if (!siteKey?.trim()) throw new Error("VITE_TURNSTILE_SITE_KEY is required.");

export function useCaptchaChallenge() {
  const [token, setToken] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return {
    token,
    failed,
    attempt,
    complete(value: string) {
      setToken(value);
      setFailed(false);
    },
    expire() {
      setToken(null);
    },
    fail() {
      setToken(null);
      setFailed(true);
    },
    reset() {
      setToken(null);
      setFailed(false);
      setAttempt((value) => value + 1);
    },
  };
}

export function CaptchaChallenge({
  control,
  language,
}: {
  control: ReturnType<typeof useCaptchaChallenge>;
  language: string;
}) {
  return (
    <Turnstile
      key={control.attempt}
      siteKey={siteKey}
      options={{
        size: "flexible",
        theme: "light",
        language,
        action: "authentication",
        responseField: false,
      }}
      onSuccess={control.complete}
      onExpire={control.expire}
      onTimeout={control.expire}
      onError={control.fail}
      onUnsupported={control.fail}
      scriptOptions={{ onError: control.fail }}
    />
  );
}
