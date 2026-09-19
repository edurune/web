import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { Text } from "../ui/primitives/text.tsx";
import { TextField } from "../ui/primitives/text-field.tsx";
import { RateLimitError } from "../api/client.ts";
import { errorMessage } from "../api/error-messages.ts";
import type { PasswordResetRequest } from "../api/user/use-password-reset.ts";
import { Brand } from "../ui/brand.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { Field } from "../ui/primitives/field.tsx";
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
  form: { display: "flex", flexDirection: "column", gap: space.lg },
});
function RecoveryLayout({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <main {...stylex.props(styles.page)}>
      <Brand />
      <Text as="h1" variant="title">
        {title}
      </Text>
      {children}
    </main>
  );
}

export function ForgotPasswordScreen({
  pending,
  sent,
  error,
  onRequest,
  onLogin,
}: {
  pending?: boolean;
  sent?: boolean;
  error?: unknown;
  onRequest: (details: PasswordResetRequest) => Promise<number>;
  onLogin: () => void;
}) {
  const { t, i18n } = useLingui();
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState({ email: "", deadline: 0 });
  const [now, setNow] = useState(Date.now);
  const captcha = useCaptchaChallenge();
  const normalizedEmail = email.trim().toLowerCase();
  const remainingSeconds =
    cooldown.email === normalizedEmail
      ? Math.max(0, Math.ceil((cooldown.deadline - now) / 1000))
      : 0;

  useEffect(() => {
    if (!cooldown.deadline) return;
    const timer = window.setInterval(() => {
      const time = Date.now();
      setNow(time);
      if (time >= cooldown.deadline) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown.deadline]);

  function wait(seconds: number) {
    const time = Date.now();
    setNow(time);
    setCooldown({ email: normalizedEmail, deadline: time + seconds * 1000 });
  }

  return (
    <RecoveryLayout title={<Trans>Forgot password?</Trans>}>
      <Text tone="secondary">
        <Trans>Enter your email address and we’ll send you a link to reset your password.</Trans>
      </Text>
      {sent && (
        <Alert tone="positive">
          <Trans>
            If an account exists for this email, you’ll receive a reset link. Check your inbox and
            spam folder.
          </Trans>
        </Alert>
      )}
      <form
        {...stylex.props(styles.form)}
        onSubmit={async (event) => {
          event.preventDefault();
          if (pending || !captcha.token || remainingSeconds > 0) return;
          try {
            wait(await onRequest({ email: email.trim(), captchaToken: captcha.token }));
          } catch (failure) {
            if (failure instanceof RateLimitError) wait(failure.retryAfterSeconds);
          } finally {
            captcha.reset();
          }
        }}
      >
        <Field label={t`Email`} disabled={pending}>
          <TextField
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
            disabled={pending}
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
          variant="primary"
          fullWidth
          loading={pending}
          disabled={!captcha.token || remainingSeconds > 0}
        >
          {remainingSeconds > 0 ? (
            <Trans>Resend in {remainingSeconds}s</Trans>
          ) : sent ? (
            <Trans>Resend reset link</Trans>
          ) : (
            <Trans>Send reset link</Trans>
          )}
        </Button>
      </form>
      <Button variant="ghost" onClick={onLogin} disabled={pending}>
        <Trans>Back to log in</Trans>
      </Button>
    </RecoveryLayout>
  );
}

export function ResetPasswordScreen({
  invalidLink,
  pending,
  complete,
  error,
  onReset,
  onRequestNewLink,
  onLogin,
}: {
  invalidLink?: boolean;
  pending?: boolean;
  complete?: boolean;
  error?: unknown;
  onReset: (newPassword: string) => Promise<unknown>;
  onRequestNewLink: () => void;
  onLogin: () => void;
}) {
  const { t } = useLingui();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [mismatch, setMismatch] = useState(false);

  return (
    <RecoveryLayout
      title={complete ? <Trans>Password updated</Trans> : <Trans>Reset password</Trans>}
    >
      {complete ? (
        <Alert tone="positive">
          <Trans>Your password has been changed. Log in with your new password.</Trans>
        </Alert>
      ) : invalidLink ? (
        <Alert tone="negative">
          <Trans>This reset link is invalid or has expired. Request a new one.</Trans>
        </Alert>
      ) : (
        <form
          {...stylex.props(styles.form)}
          onSubmit={async (event) => {
            event.preventDefault();
            if (pending) return;
            if (password !== confirmation) {
              setMismatch(true);
              return;
            }
            try {
              await onReset(password);
              setPassword("");
              setConfirmation("");
            } catch {
              // The mutation supplies the translated error below.
            }
          }}
        >
          <Field
            label={t`New password`}
            description={t`Use 8 to 128 characters.`}
            disabled={pending}
          >
            <TextField
              type="password"
              name="new-password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setMismatch(false);
              }}
              required
              minLength={8}
              maxLength={128}
              disabled={pending}
            />
          </Field>
          <Field
            label={t`Confirm new password`}
            error={mismatch ? t`Passwords do not match.` : undefined}
            disabled={pending}
          >
            <TextField
              type="password"
              name="confirm-password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value);
                setMismatch(false);
              }}
              required
              minLength={8}
              maxLength={128}
              disabled={pending}
            />
          </Field>
          {error != null && <Alert tone="negative">{t(errorMessage(error))}</Alert>}
          <Button type="submit" variant="primary" fullWidth loading={pending}>
            <Trans>Update password</Trans>
          </Button>
        </form>
      )}
      {!complete && (
        <Button variant="secondary" onClick={onRequestNewLink} disabled={pending}>
          <Trans>Request a new link</Trans>
        </Button>
      )}
      <Button variant="ghost" onClick={onLogin} disabled={pending}>
        <Trans>Back to log in</Trans>
      </Button>
    </RecoveryLayout>
  );
}
