import { Plural, Trans, useLingui } from "@lingui/react/macro";
import {
  GearIcon,
  PencilSimpleIcon,
  ShoppingBagIcon,
  SparkleIcon,
  TShirtIcon,
  UserIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CharacterArea } from "../character/character-area.tsx";
import { errorMessage } from "../api/error-messages.ts";
import { useMeQuery, useMeSummaryQuery } from "../api/user/use-user-queries.ts";
import { useCharacterProfileQuery } from "../api/character/use-character-queries.ts";
import { CosmeticIcon } from "../game/art/cosmetic-icon.tsx";
import { ActionRow } from "../ui/primitives/action-row.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { wardrobeLayout } from "../ui/tokens/wardrobe.stylex.ts";
import { AppSettings } from "./app-settings.tsx";
import { ProfileSettings } from "./profile-settings.tsx";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  scroll: { flex: 1, minBlockSize: space.none },
  actions: { padding: space.lg },
  shop: { backgroundColor: color.cautionFill },
  appearance: {
    backgroundColor: { default: color.cautionFill, ":hover:not(:disabled)": color.cautionSoft },
  },
  preview: { inlineSize: wardrobeLayout.preview, blockSize: wardrobeLayout.preview },
  name: { display: "inline-flex", alignItems: "center", gap: space.sm },
  courseCount: {
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: space.xxs,
    borderInlineStartColor: color.borderStrong,
    paddingInlineStart: space.sm,
  },
});

export function ProfileScreen({ style }: { style?: StyleXStyles }) {
  const { t } = useLingui();
  const user = useMeQuery();
  const summary = useMeSummaryQuery();
  const profile = useCharacterProfileQuery();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const courses = summary.data?.courses;
  const completed = summary.data?.milestones.completed;
  const total = summary.data?.milestones.total;
  const previews = profile.data
    ? [
        profile.data.equipped.hat,
        profile.data.equipped.pet,
        profile.data.equipped.top,
        profile.data.equipped.shoes,
      ]
        .filter((id): id is string => id !== null)
        .slice(0, 2)
    : [];
  const openWardrobe = () => {
    void navigate({ to: "/wardrobe", search: { slot: "top" } });
  };
  return (
    <main {...stylex.props(styles.page, style)}>
      <CharacterArea
        characterActions={
          <>
            <IconButton
              icon={PencilSimpleIcon}
              label={t`Change appearance`}
              shape="circle"
              variant="secondary"
              cue="forward"
              style={styles.appearance}
              onClick={() => {
                void navigate({ to: "/appearance" });
              }}
            />
            <IconButton
              icon={TShirtIcon}
              label={t`Wardrobe`}
              shape="circle"
              cue="forward"
              onClick={openWardrobe}
            />
          </>
        }
        name={
          <span {...stylex.props(styles.name)}>
            <span>{user.data?.anonymous ? t`Guest` : user.data?.name}</span>
            {courses !== undefined && (
              <span {...stylex.props(styles.courseCount)}>
                <Plural value={courses} one="# course" other="# courses" />
              </span>
            )}
          </span>
        }
        actions={
          <IconButton
            icon={ShoppingBagIcon}
            label={t`Shop`}
            shape="circle"
            variant="secondary"
            cue="forward"
            style={styles.shop}
            onClick={() => {
              void navigate({ to: "/shop", search: { slot: "top" } });
            }}
          />
        }
      />
      <ScrollArea label={t`Profile`} indicator="none" style={styles.scroll}>
        <Stack gap="md" style={styles.actions}>
          {summary.error && (
            <Alert
              tone="negative"
              action={
                <Button
                  variant="secondary"
                  cue="retry"
                  onClick={() => {
                    void summary.refetch();
                  }}
                >
                  <Trans>Try again</Trans>
                </Button>
              }
            >
              {t(errorMessage(summary.error))}
            </Alert>
          )}
          <ActionRow
            icon={TShirtIcon}
            title={t`Wardrobe`}
            tone="sage"
            trailing={
              <Stack direction="row" gap="xs">
                {previews.map((id) => (
                  <CosmeticIcon key={id} cosmeticId={id} label="" style={styles.preview} />
                ))}
              </Stack>
            }
            onClick={openWardrobe}
          />
          <ActionRow
            icon={SparkleIcon}
            title={t`Milestones`}
            tone="gold"
            trailing={
              total ? (
                <Text variant="caption">
                  {completed} / {total}
                </Text>
              ) : undefined
            }
            onClick={() => {
              void navigate({ to: "/rewards" });
            }}
          />
          <ActionRow
            icon={UserIcon}
            title={t`Profile`}
            cue={null}
            onClick={() => setProfileOpen(true)}
          />
          <ActionRow
            icon={GearIcon}
            title={t`Settings`}
            cue={null}
            onClick={() => setSettingsOpen(true)}
          />
        </Stack>
      </ScrollArea>
      <ProfileSettings open={profileOpen} onOpenChange={setProfileOpen} />
      <AppSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
}
