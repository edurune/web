import { useState } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import { SkillChip } from "./skill-chip.tsx";
import { PlusIcon, PackageIcon, CaretRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useLoadoutQuery, useEquipmentInventoryQuery } from "../api/realm/use-realm-queries.ts";
import {
  useEquipEquipmentMutation,
  useUnequipEquipmentMutation,
} from "../api/realm/use-realm-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import { RealmProgress } from "../game/realm-progress.tsx";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { EquipmentIcon } from "../game/art/equipment-icon.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { CardButton } from "../ui/primitives/card-button.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { RarityBadge } from "../ui/primitives/badge.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Dialog } from "../ui/primitives/dialog.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import {
  equipmentMetadata,
  equipmentSlots,
  slotLabels,
  stats,
  statLabels,
  statIcons,
  type EquipmentSlot,
} from "./equipment.ts";
import { EquipmentCard } from "./equipment-card.tsx";
import { realmStyles } from "./realm-layout.ts";
import { CatalogControls, type CatalogSearch } from "../ui/catalog-controls.tsx";

const styles = stylex.create({
  stats: { display: "grid", gridTemplateColumns: realmLayout.statColumns, gap: space.sm },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: space.xs },
  slot: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    textAlign: "start",
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
    outlineColor: color.borderFocus,
  },
  name: { overflowWrap: "anywhere" },
  skills: { display: "flex", flexWrap: "wrap", gap: space.sm },
});
export function LoadoutScreen({ courseId }: { courseId: string }) {
  const { t } = useLingui();
  const query = useLoadoutQuery(courseId);
  const [slot, setSlot] = useState<EquipmentSlot | null>(null);
  const loadout = query.data;
  return (
    <ScrollArea
      label={t`Loadout`}
      indicator="none"
      style={realmStyles.scroll}
      contentStyle={realmStyles.content}
    >
      {query.isError && (
        <Alert tone="negative" title={t`Couldn’t load your equipment`}>
          {t(errorMessage(query.error))}
          <Button
            cue="retry"
            onClick={() => {
              void query.refetch();
            }}
          >
            <Trans>Try again</Trans>
          </Button>
        </Alert>
      )}
      {!loadout ? (
        query.isPending && <Skeleton />
      ) : (
        <>
          <Surface depth="lifted" tone="warm">
            <RealmProgress progression={loadout.progression} />
          </Surface>
          <div {...stylex.props(styles.stats)}>
            {stats.map((stat) => {
              const delta = loadout.stats[stat] - loadout.progression.baseStats[stat];
              return (
                <Surface key={stat} depth="lifted" padding="sm" style={styles.stat}>
                  <CombatIcon
                    iconId={statIcons[stat]}
                    label={t(statLabels[stat])}
                    style={realmStyles.icon}
                  />
                  <Text variant="stat">{loadout.stats[stat]}</Text>
                  <Text
                    variant="label"
                    tone={delta < 0 ? "negative" : delta > 0 ? "positive" : "secondary"}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta}
                  </Text>
                </Surface>
              );
            })}
          </div>
          {equipmentSlots.map((value) => {
            const item = loadout.equipped.find((entry) => entry.slot === value);
            const id = item?.equipment.id;
            const descriptor = id ? equipmentMetadata.get(id)?.name : undefined;
            return (
              <CardButton key={value} cue={null} onClick={() => setSlot(value)} style={styles.slot}>
                {id ? (
                  <EquipmentIcon equipmentId={id} style={realmStyles.art} />
                ) : (
                  <PlusIcon size={iconSize.xl} weight="bold" aria-hidden="true" />
                )}
                <Stack gap="xs" style={realmStyles.grow}>
                  <Text variant="label" tone="secondary">
                    {t(slotLabels[value])}
                  </Text>
                  <Text variant="bodyStrong" style={styles.name}>
                    {descriptor ? t(descriptor) : (id ?? <Trans>Empty</Trans>)}
                  </Text>
                  {item && (
                    <div>
                      <RarityBadge rarity={item.rarity} />
                    </div>
                  )}
                </Stack>
                <CaretRightIcon size={iconSize.md} weight="bold" aria-hidden="true" />
              </CardButton>
            );
          })}
          {loadout.skills.length > 0 && (
            <Stack gap="sm">
              <Text as="h2" variant="subheading">
                <Trans>Skills</Trans>
              </Text>
              <div {...stylex.props(styles.skills)}>
                {loadout.skills.map((skill) => (
                  <SkillChip key={skill.id} skill={skill} />
                ))}
              </div>
            </Stack>
          )}
        </>
      )}
      {slot && (
        <EquipmentPicker
          courseId={courseId}
          slot={slot}
          occupied={loadout?.equipped.some((item) => item.slot === slot) === true}
          onClose={() => setSlot(null)}
        />
      )}
    </ScrollArea>
  );
}

function EquipmentPicker({
  courseId,
  slot,
  occupied,
  onClose,
}: {
  courseId: string;
  slot: EquipmentSlot;
  occupied: boolean;
  onClose: () => void;
}) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const [catalogSearch, setCatalogSearch] = useState<CatalogSearch>({});
  const inventory = useEquipmentInventoryQuery(courseId, {
    slot,
    rarity: catalogSearch.rarity,
    direction: catalogSearch.direction,
  });
  const equip = useEquipEquipmentMutation(courseId);
  const unequip = useUnequipEquipmentMutation(courseId);
  const pending = equip.isPending || unequip.isPending;
  const error = equip.error ?? unequip.error ?? inventory.error;
  const items = inventory.data?.pages.flatMap((page) => page.items) ?? [];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t(slotLabels[slot])}
      footer={
        occupied && (
          <Button
            variant="secondary"
            cue="deselect"
            disabled={pending}
            loading={unequip.isPending}
            onClick={() =>
              unequip.mutate({ path: { courseId }, body: { slot } }, { onSuccess: onClose })
            }
          >
            <Trans>Unequip</Trans>
          </Button>
        )
      }
    >
      <Stack gap="md">
        <CatalogControls
          search={catalogSearch}
          onChange={(next) => {
            equip.reset();
            unequip.reset();
            setCatalogSearch(next);
          }}
        />
        {error && (
          <Alert tone="negative" title={t`Couldn’t complete the request`}>
            {t(errorMessage(error))}
            <Button
              variant="secondary"
              cue="retry"
              onClick={() => {
                equip.reset();
                unequip.reset();
                void inventory.refetch();
              }}
            >
              <Trans>Try again</Trans>
            </Button>
          </Alert>
        )}
        {inventory.isPending ? (
          <Skeleton />
        ) : !items.length && !inventory.isError ? (
          <EmptyState
            icon={PackageIcon}
            title={t`No equipment yet`}
            action={
              <Button
                cue="forward"
                onClick={() => {
                  onClose();
                  void navigate({
                    to: "/courses/$courseId/shop",
                    params: { courseId },
                    search: { slot },
                  });
                }}
              >
                <Trans>Open shop</Trans>
              </Button>
            }
          />
        ) : null}
        {items.map((item) => (
          <EquipmentCard
            key={item.equipment.equipment.id}
            equipment={item.equipment}
            detail={
              item.reason === "conflicting_skill" ? (
                <Text tone="negative">
                  <Trans>Skill already equipped</Trans>
                </Text>
              ) : undefined
            }
            action={
              <Button
                fullWidth
                cue="select"
                blocked={!item.available}
                disabled={pending}
                loading={
                  equip.isPending &&
                  equip.variables?.body.equipmentId === item.equipment.equipment.id
                }
                onClick={() =>
                  equip.mutate(
                    { path: { courseId }, body: { equipmentId: item.equipment.equipment.id } },
                    { onSuccess: onClose },
                  )
                }
              >
                {item.equipped ? <Trans>Equipped</Trans> : <Trans>Equip</Trans>}
              </Button>
            }
          />
        ))}
        {inventory.hasNextPage && (
          <LoadMoreButton
            autoLoad={!inventory.isError}
            disabled={inventory.isFetching}
            loading={inventory.isFetchingNextPage}
            onLoadMore={() => {
              if (!inventory.isFetching) void inventory.fetchNextPage({ cancelRefetch: false });
            }}
          >
            <Trans>Load more</Trans>
          </LoadMoreButton>
        )}
      </Stack>
    </Dialog>
  );
}
