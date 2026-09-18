import { Trans, useLingui } from "@lingui/react/macro";
import { TranslateIcon } from "@phosphor-icons/react";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { errorMessage } from "../api/error-messages.ts";
import type { EmailCredentials, SignUpDetails } from "../api/user/use-user-mutations.ts";
import { setLocalePreference } from "../i18n/i18n.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { Field } from "../ui/primitives/field.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { TextField } from "../ui/primitives/text-field.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Brand } from "../ui/brand.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { CaptchaChallenge, useCaptchaChallenge } from "./captcha-challenge.tsx";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    maxInlineSize: layout.portrait,
    minBlockSize: layout.viewport,
    marginInline: "auto",
    padding: space.xl,
    paddingBlockStart: `max(${space.xxxl}, ${layout.safeTop})`,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    marginBlockEnd: space.xl,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
  },
  language: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxs,
    marginBlockStart: "auto",
  },
});

export function LoginScreen({
  initialMode = "login",
  guest = false,
  pending,
  guestPending,
  error,
  onLogin,
  onSignUp,
  onGuest,
  onModeChange,
  style,
}: {
  initialMode?: "login" | "signup";
  guest?: boolean;
  pending?: boolean;
  guestPending?: boolean;
  error?: unknown;
  onLogin: (credentials: EmailCredentials) => Promise<unknown>;
  onSignUp: (details: SignUpDetails) => Promise<unknown>;
  onGuest: () => void;
  onModeChange: () => void;
  style?: StyleXStyles;
}) {
  const { t, i18n } = useLingui();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const captcha = useCaptchaChallenge();
  const signup = mode === "signup";
  const busy = pending || guestPending;
  return (
    <main {...stylex.props(styles.page, style)}>
      <div {...stylex.props(styles.brand)}>
        <Brand />
      </div>
      <Text variant="title">
        {signup ? <Trans>Create an account</Trans> : <Trans>Log in</Trans>}
      </Text>
      {guest && (
        <Text tone="secondary">
          {signup ? (
            <Trans>Create an account to keep your guest progress.</Trans>
          ) : (
            <Trans>Logging in switches to that account’s progress.</Trans>
          )}
        </Text>
      )}
      <div {...stylex.props(styles.content)}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy || !captcha.token) return;
            const credentials = { email: email.trim(), password, captchaToken: captcha.token };
            try {
              if (signup) await onSignUp({ ...credentials, name: name.trim() });
              else await onLogin(credentials);
            } catch {
              // The mutation error is displayed below the fields.
            } finally {
              captcha.reset();
            }
          }}
        >
          <Stack gap="lg">
            {signup && (
              <Field label={t`Name`} disabled={busy}>
                <TextField
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={100}
                  disabled={busy}
                />
              </Field>
            )}
            <Field label={t`Email`} disabled={busy}>
              <TextField
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
                disabled={busy}
              />
            </Field>
            <Field label={t`Password`} disabled={busy}>
              <TextField
                type="password"
                name="password"
                autoComplete={signup ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={signup ? 8 : undefined}
                maxLength={128}
                disabled={busy}
              />
            </Field>
            {error != null && <Alert tone="negative">{t(errorMessage(error))}</Alert>}
            <CaptchaChallenge control={captcha} language={i18n.locale} />
            {captcha.failed && (
              <Alert tone="negative">
                <Trans>Verification couldn’t load. Reload and try again.</Trans>
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              cue="unlock"
              loading={pending}
              disabled={guestPending || !captcha.token}
            >
              {signup ? <Trans>Create account</Trans> : <Trans>Log in</Trans>}
            </Button>
          </Stack>
        </form>
        <Button
          variant="secondary"
          fullWidth
          cue="forward"
          loading={guestPending}
          disabled={pending}
          onClick={onGuest}
        >
          <Trans>Continue as guest</Trans>
        </Button>
        <Button
          variant="ghost"
          cue="select"
          disabled={busy}
          onClick={() => {
            setMode(signup ? "login" : "signup");
            setPassword("");
            captcha.reset();
            onModeChange();
          }}
        >
          {signup ? (
            <Trans>Already have an account? Log in</Trans>
          ) : (
            <Trans>New here? Create an account</Trans>
          )}
        </Button>
      </div>
      <div role="group" aria-label={t`Interface language`} {...stylex.props(styles.language)}>
        <TranslateIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
        <Button
          size="sm"
          variant={i18n.locale === "en" ? "secondary" : "ghost"}
          cue="select"
          aria-pressed={i18n.locale === "en"}
          onClick={() => setLocalePreference("en")}
        >
          <Trans>English</Trans>
        </Button>
        <Button
          size="sm"
          variant={i18n.locale === "vi" ? "secondary" : "ghost"}
          cue="select"
          aria-pressed={i18n.locale === "vi"}
          onClick={() => setLocalePreference("vi")}
        >
          <Trans>Vietnamese</Trans>
        </Button>
      </div>
    </main>
  );
}
