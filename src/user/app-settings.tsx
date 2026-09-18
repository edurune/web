import { Trans, useLingui } from "@lingui/react/macro";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState } from "react";
import { setLocalePreference } from "../i18n/i18n.ts";
import { Dialog } from "../ui/primitives/dialog.tsx";
import { Select } from "../ui/primitives/select.tsx";
import { Field } from "../ui/primitives/field.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Switch } from "../ui/primitives/switch.tsx";
import { isMusicEnabled, setMusicEnabled } from "../ui/sound/music.ts";
import { isSoundEnabled, playSound, setSoundEnabled } from "../ui/sound/sound.ts";

export function AppSettings({
  open,
  onOpenChange,
  style,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  style?: StyleXStyles;
}) {
  const { t, i18n } = useLingui();
  const [sound, setSound] = useState(isSoundEnabled);
  const [music, setMusic] = useState(isMusicEnabled);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={t`Settings`} style={style}>
      <Stack gap="xl">
        <Switch
          checked={sound}
          onCheckedChange={(next) => {
            setSound(next);
            setSoundEnabled(next);
            if (next) playSound("toggle-on");
          }}
        >
          <Trans>Sound effects</Trans>
        </Switch>
        <Switch
          checked={music}
          onCheckedChange={(next) => {
            setMusic(next);
            setMusicEnabled(next);
          }}
        >
          <Trans>Music</Trans>
        </Switch>
        <Field label={t`Interface language`}>
          <Select
            value={i18n.locale}
            options={[
              { value: "en", label: t`English` },
              { value: "vi", label: t`Vietnamese` },
            ]}
            onValueChange={(locale) => {
              if (locale === "en" || locale === "vi") setLocalePreference(locale);
            }}
          />
        </Field>
      </Stack>
    </Dialog>
  );
}
