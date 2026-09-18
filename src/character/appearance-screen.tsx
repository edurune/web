import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { defaultOutfit, hairstyles } from "@edurune/art/catalog";
import { useMemo, useState } from "react";
import type { GetApiCharacterProfileResponse } from "../api/generated/types.gen.ts";
import {
  useAppearanceOptionsQuery,
  useCharacterProfileQuery,
} from "../api/character/use-character-queries.ts";
import { useUpdateAppearanceMutation } from "../api/character/use-character-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import { CharacterPortrait } from "../game/art/character-portrait.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { ColorSwatchPicker } from "../ui/primitives/color-swatch-picker.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { appearanceColors } from "./appearance-colors.ts";
import { HairstylePicker } from "./hairstyle-picker.tsx";
import { OnboardingProgress } from "../user/onboarding-progress.tsx";

type Appearance = GetApiCharacterProfileResponse["appearance"];

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    flexShrink: 0,
  },
  preview: {
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: color.cautionFill,
  },
  character: { inlineSize: layout.appearanceFigure },
  scroll: { flex: 1, minBlockSize: space.none },
  controls: { padding: space.lg, gap: space.xl },
  footer: {
    flexShrink: 0,
    padding: space.lg,
    paddingBlockEnd: `max(${space.lg}, ${layout.safeBottom})`,
  },
});

export function AppearanceScreen({
  onboarding = false,
  onBack,
  style,
}: {
  onboarding?: boolean;
  onBack?: () => void;
  style?: StyleXStyles;
}) {
  const profile = useCharacterProfileQuery();
  const options = useAppearanceOptionsQuery();
  if (!profile.data || !options.data) return null;
  return (
    <AppearanceEditor
      initial={profile.data}
      hairStyles={options.data.hairStyles}
      onboarding={onboarding}
      onBack={onBack}
      style={style}
    />
  );
}

function AppearanceEditor({
  initial,
  hairStyles,
  onboarding,
  onBack,
  style,
}: {
  initial: GetApiCharacterProfileResponse;
  hairStyles: { id: string }[];
  onboarding: boolean;
  onBack?: () => void;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const save = useUpdateAppearanceMutation();
  const [appearance, setAppearance] = useState<Appearance>(initial.appearance);
  const palette = useMemo(
    () => ({ skin: appearance.skinTone, hair: appearance.hairColor, eyes: appearance.eyeColor }),
    [appearance],
  );
  const change = <Key extends keyof Appearance>(key: Key, value: Appearance[Key]) => {
    setAppearance((current) => ({ ...current, [key]: value }));
    save.reset();
  };
  const options = hairStyles.flatMap(({ id }) => {
    if (id === "none") return [{ value: id, label: t`No hair` }];
    const metadata = hairstyles.find((item) => item.id === id);
    return metadata ? [{ value: id, label: t(metadata.name) }] : [];
  });
  const swatches = (key: keyof typeof appearanceColors, label: string) => {
    const choices = appearanceColors[key].map((option) => ({
      value: option.value as string,
      label: t(option.label),
    }));
    const current = appearance[key];
    if (!choices.some((option) => option.value === current))
      choices.push({ value: current, label: t`Current color` });
    return (
      <Stack gap="md">
        <Text variant="bodyStrong">{label}</Text>
        <ColorSwatchPicker
          label={label}
          colors={choices.map((option) => option.value)}
          labels={Object.fromEntries(choices.map((option) => [option.value, option.label]))}
          value={current}
          disabled={save.isPending}
          onValueChange={(value) => {
            if (typeof value === "string") change(key, value);
          }}
        />
      </Stack>
    );
  };
  // Headwear and full outfits can hide the features being edited; saved clothes stay untouched.
  const clothes = initial.equipped.full_body ? defaultOutfit : initial.equipped;
  const cosmeticIds = [clothes.top, clothes.bottom, clothes.shoes].filter(
    (id): id is string => id !== null,
  );
  return (
    <form
      {...stylex.props(styles.page, style)}
      onSubmit={(event) => {
        event.preventDefault();
        if (save.isPending) return;
        save.mutate(
          { body: appearance },
          {
            onSuccess: () => {
              void navigate({ to: onboarding ? "/" : "/me", replace: true });
            },
          },
        );
      }}
    >
      {onboarding && <OnboardingProgress step={3} onBack={onBack} disabled={save.isPending} />}
      <header {...stylex.props(styles.header)}>
        {!onboarding && (
          <IconButton
            icon={ArrowLeftIcon}
            label={t`Back to Me`}
            variant="ghost"
            cue="back"
            disabled={save.isPending}
            onClick={() => {
              void navigate({ to: "/me" });
            }}
          />
        )}
        <Text as="h1" variant="heading">
          {onboarding ? <Trans>Make it you</Trans> : <Trans>Appearance</Trans>}
        </Text>
      </header>
      <div {...stylex.props(styles.preview)}>
        <CharacterPortrait
          cosmeticIds={cosmeticIds}
          hairStyle={appearance.hairStyle}
          palette={palette}
          label={t`Your character`}
          style={styles.character}
        />
      </div>
      <ScrollArea label={t`Appearance`} indicator="fade" style={styles.scroll}>
        <Stack style={styles.controls}>
          {swatches("skinTone", t`Skin tone`)}
          <Stack gap="md">
            <Text variant="bodyStrong">
              <Trans>Hair style</Trans>
            </Text>
            <HairstylePicker
              label={t`Hair style`}
              options={options}
              palette={palette}
              value={appearance.hairStyle}
              onValueChange={(value) => change("hairStyle", value)}
              disabled={save.isPending}
            />
          </Stack>
          {swatches("hairColor", t`Hair color`)}
          {swatches("eyeColor", t`Eye color`)}
        </Stack>
      </ScrollArea>
      <Stack gap="md" style={styles.footer}>
        {save.error && <Alert tone="negative">{t(errorMessage(save.error))}</Alert>}
        <Button
          type="submit"
          fullWidth
          size="lg"
          cue={onboarding ? "forward" : "checkpoint"}
          loading={save.isPending}
          iconEnd={onboarding ? ArrowRightIcon : undefined}
        >
          {onboarding ? <Trans>Continue</Trans> : <Trans>Save appearance</Trans>}
        </Button>
      </Stack>
    </form>
  );
}
