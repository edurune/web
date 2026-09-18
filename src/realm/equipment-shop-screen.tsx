import { Trans, useLingui } from "@lingui/react/macro";
import { PackageIcon, CheckIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useEquipmentShopQuery, useLoadoutQuery } from "../api/realm/use-realm-queries.ts";
import {
  useEquipEquipmentMutation,
  usePurchaseEquipmentMutation,
} from "../api/realm/use-realm-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Button } from "../ui/primitives/button.tsx";
import { CurrencyAmount } from "../ui/primitives/currency-amount.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { iconSize } from "../ui/tokens/scale.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { EquipmentCard } from "./equipment-card.tsx";
import { equipmentSlots, slotLabels, type EquipmentSlot } from "./equipment.ts";
import { realmStyles } from "./realm-layout.ts";
import { CatalogControls, type CatalogSearch } from "../ui/catalog-controls.tsx";
import type { EquipmentShopSearch } from "./equipment.ts";

const styles = stylex.create({
  categories: { display: "flex", alignItems: "center", gap: space.xs },
});

export function EquipmentShopScreen({
  courseId,
  search,
}: {
  courseId: string;
  search: EquipmentShopSearch;
}) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const shop = useEquipmentShopQuery(courseId, { ...search, limit: 20 });
  const loadout = useLoadoutQuery(courseId);
  const purchase = usePurchaseEquipmentMutation(courseId);
  const equip = useEquipEquipmentMutation(courseId);
  const items = shop.data?.pages.flatMap((page) => page.items) ?? [];
  const equippedIds = new Set(loadout.data?.equipped.map((entry) => entry.equipment.id));
  const pending = purchase.isPending || equip.isPending;
  const error = purchase.error ?? equip.error ?? shop.error ?? loadout.error;
  const reset = () => {
    purchase.reset();
    equip.reset();
  };
  const filter = (nextSlot?: EquipmentSlot) => {
    reset();
    void navigate({
      to: "/courses/$courseId/shop",
      params: { courseId },
      search: { ...search, slot: nextSlot },
      replace: true,
    });
  };
  const updateCatalog = (next: CatalogSearch) => {
    reset();
    void navigate({
      to: "/courses/$courseId/shop",
      params: { courseId },
      search: {
        ...search,
        rarity: next.rarity,
        direction: next.direction,
        sort: next.sort,
      },
      replace: true,
    });
  };
  return (
    <main {...stylex.props(realmStyles.page)}>
      <div {...stylex.props(realmStyles.toolbar)}>
        <ScrollArea
          orientation="horizontal"
          indicator="fade"
          label={t`Equipment categories`}
          style={realmStyles.grow}
          contentStyle={styles.categories}
        >
          <Button
            size="sm"
            variant={!search.slot ? "primary" : "secondary"}
            aria-pressed={!search.slot}
            cue="select"
            onClick={() => filter()}
          >
            <Trans>All</Trans>
          </Button>
          {equipmentSlots.map((value) => (
            <Button
              key={value}
              size="sm"
              variant={search.slot === value ? "primary" : "secondary"}
              aria-pressed={search.slot === value}
              cue="select"
              onClick={() => filter(value)}
            >
              {t(slotLabels[value])}
            </Button>
          ))}
        </ScrollArea>
        <CatalogControls search={search} showCost onChange={updateCatalog} />
      </div>
      <ScrollArea
        label={t`Course shop`}
        indicator="none"
        style={realmStyles.scroll}
        contentStyle={realmStyles.content}
      >
        {error && (
          <Alert tone="negative" title={t`Couldn’t complete the request`}>
            {t(errorMessage(error))}
            <Button
              variant="secondary"
              cue="retry"
              onClick={() => {
                reset();
                void shop.refetch();
                void loadout.refetch();
              }}
            >
              <Trans>Try again</Trans>
            </Button>
          </Alert>
        )}
        {shop.isPending ? (
          <Skeleton />
        ) : !items.length && !shop.isError ? (
          <EmptyState icon={PackageIcon} title={t`No equipment here`} />
        ) : null}
        <div {...stylex.props(realmStyles.grid)}>
          {items.map((item) => {
            const owned = item.reason === "already_owned";
            const id = item.equipment.equipment.id;
            const equipped = equippedIds.has(id);
            return (
              <EquipmentCard
                key={id}
                equipment={item.equipment}
                action={
                  owned ? (
                    <Button
                      fullWidth
                      variant={equipped ? "secondary" : "primary"}
                      cue="select"
                      blocked={equipped}
                      disabled={pending}
                      loading={equip.isPending && equip.variables?.body.equipmentId === id}
                      onClick={() =>
                        equip.mutate({ path: { courseId }, body: { equipmentId: id } })
                      }
                    >
                      {equipped ? (
                        <>
                          <CheckIcon size={iconSize.sm} weight="bold" />
                          <Trans>Equipped</Trans>
                        </>
                      ) : (
                        <Trans>Equip</Trans>
                      )}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      cue="purchase"
                      blocked={!item.available}
                      disabled={pending}
                      loading={purchase.isPending && purchase.variables?.body.equipmentId === id}
                      aria-label={t`Buy equipment`}
                      onClick={() =>
                        purchase.mutate({ path: { courseId }, body: { equipmentId: id } })
                      }
                    >
                      <CurrencyAmount kind="medal" amount={item.medalCost} />
                    </Button>
                  )
                }
              />
            );
          })}
        </div>
        {shop.hasNextPage && (
          <LoadMoreButton
            autoLoad={!shop.isError}
            loading={shop.isFetchingNextPage}
            disabled={shop.isFetching}
            onLoadMore={() => {
              if (!shop.isFetching) void shop.fetchNextPage({ cancelRefetch: false });
            }}
          >
            <Trans>Load more</Trans>
          </LoadMoreButton>
        )}
      </ScrollArea>
    </main>
  );
}
