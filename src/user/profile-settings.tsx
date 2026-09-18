import { Trans, useLingui } from "@lingui/react/macro";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMeQuery } from "../api/user/use-user-queries.ts";
import { useSignOutMutation, useUpdateUserMutation } from "../api/user/use-user-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import type { GetApiMeResponse } from "../api/generated/types.gen.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { Dialog } from "../ui/primitives/dialog.tsx";
import { Select } from "../ui/primitives/select.tsx";
import { Field } from "../ui/primitives/field.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { NumberField } from "../ui/primitives/number-field.tsx";
import { TextField } from "../ui/primitives/text-field.tsx";

export function ProfileSettings({
  open,
  onOpenChange,
  style,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const user = useMeQuery();
  const logout = useSignOutMutation();
  const update = useUpdateUserMutation();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [name, setName] = useState(user.data?.name ?? "");
  const [birthYear, setBirthYear] = useState<number | null>(user.data?.birthYear ?? null);
  const [language, setLanguage] = useState<GetApiMeResponse["language"]>(
    user.data?.language ?? "en",
  );
  const guest = user.data?.anonymous === true;
  const trimmedName = name.trim();
  const invalidName = !guest && trimmedName.length === 0;
  const currentYear = new Date().getFullYear();
  const invalidBirthYear =
    birthYear !== null &&
    (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear);
  const signOut = () =>
    logout.mutate(undefined, {
      onSuccess: () => {
        void navigate({ to: "/login", replace: true });
      },
    });
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) {
          setConfirm(false);
          logout.reset();
          update.reset();
        }
      }}
      title={t`Profile`}
      style={style}
    >
      <Stack gap="xl">
        {!guest && (
          <Field label={t`Name`} error={invalidName ? t`Enter your name.` : undefined}>
            <TextField
              name="name"
              autoComplete="name"
              value={name}
              maxLength={100}
              invalid={invalidName}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
        )}
        <Field
          label={t`Birth year`}
          error={invalidBirthYear ? t`Enter a year from 1900 to ${currentYear}.` : undefined}
        >
          <NumberField
            name="birthYear"
            autoComplete="bday-year"
            value={birthYear}
            min={1900}
            max={currentYear}
            smallStep={1}
            allowOutOfRange
            format={{ useGrouping: false }}
            invalid={invalidBirthYear}
            onValueChange={setBirthYear}
          />
        </Field>
        <Field label={t`Learning language`}>
          <Select
            value={language}
            options={[
              { value: "en", label: t`English` },
              { value: "vi", label: t`Vietnamese` },
            ]}
            onValueChange={(locale) => {
              if (locale === "en" || locale === "vi") {
                setLanguage(locale);
              }
            }}
          />
        </Field>
        <Button
          cue="check"
          loading={update.isPending}
          disabled={invalidName || invalidBirthYear || update.isPending}
          onClick={() =>
            update.mutate(
              guest ? { birthYear, language } : { name: trimmedName, birthYear, language },
              {
                onSuccess: () => {
                  onOpenChange(false);
                },
              },
            )
          }
        >
          <Trans>Save profile</Trans>
        </Button>
        {update.error && <Alert tone="negative">{t(errorMessage(update.error))}</Alert>}
        <Stack gap="md">
          {user.data?.anonymous && (
            <Button
              cue="forward"
              onClick={() => {
                void navigate({ to: "/login" });
              }}
            >
              <Trans>Save your progress</Trans>
            </Button>
          )}
          {logout.error && <Alert tone="negative">{t(errorMessage(logout.error))}</Alert>}
          {confirm ? (
            <Alert
              tone="caution"
              title={t`Log out of this guest account?`}
              action={
                <Stack direction="row">
                  <Button variant="danger" cue="lock" loading={logout.isPending} onClick={signOut}>
                    <Trans>Log out</Trans>
                  </Button>
                  <Button
                    variant="secondary"
                    cue="cancel"
                    disabled={logout.isPending}
                    onClick={() => setConfirm(false)}
                  >
                    <Trans>Cancel</Trans>
                  </Button>
                </Stack>
              }
            >
              <Trans>
                You’ll lose access to all your progress unless you create an account first.
              </Trans>
            </Alert>
          ) : (
            <Button
              variant="secondary"
              cue="lock"
              loading={logout.isPending}
              onClick={() => (user.data?.anonymous ? setConfirm(true) : signOut())}
            >
              <Trans>Log out</Trans>
            </Button>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}
