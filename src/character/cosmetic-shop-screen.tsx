import { Trans, useLingui } from "@lingui/react/macro";
import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  TShirtIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { GetApiCharacterProfileResponse } from "../api/generated/types.gen.ts";
import { useCharacterProfileQuery } from "../api/character/use-character-queries.ts";
import {
  useEquipCosmeticMutation,
  usePurchaseCosmeticMutation,
  useUnequipCosmeticMutation,
} from "../api/character/use-character-mutations.ts";
import { useCosmeticShopQuery } from "../api/character/use-cosmetic-queries.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { CurrencyAmount } from "../ui/primitives/currency-amount.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { wardrobeLayout } from "../ui/tokens/wardrobe.stylex.ts";
import { CharacterArea } from "./character-area.tsx";
import { CosmeticCategories } from "./cosmetic-categories.tsx";
import { cosmeticLayout as styles } from "./cosmetic-layout.ts";
import { CosmeticTile } from "./cosmetic-tile.tsx";
import { cosmeticMetadata, type CosmeticShopSearch, type CosmeticSlot } from "./cosmetics.ts";
import { ShopItemTray } from "./shop-item-tray.tsx";
import { CatalogControls, type CatalogSearch } from "../ui/catalog-controls.tsx";

export function CosmeticShopScreen({
  search,
  style,
}: {
  search: CosmeticShopSearch;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const { slot } = search;
  const shop = useCosmeticShopQuery({ ...search, limit: 20 });
  const profile = useCharacterProfileQuery();
  const purchase = usePurchaseCosmeticMutation();
  const equip = useEquipCosmeticMutation();
  const unequip = useUnequipCosmeticMutation();
  const [selection, setSelection] = useState<{ id: string; slot: CosmeticSlot }>();
  const [preview, setPreview] = useState<Partial<GetApiCharacterProfileResponse["equipped"]>>({});
  const selectedPage = useCosmeticShopQuery({
    ...search,
    slot: selection?.slot ?? slot,
    limit: 20,
  });
  const items = shop.data?.pages.flatMap((page) => page.items) ?? [];
  const selected = selectedPage.data?.pages
    .flatMap((page) => page.items)
    .find((item) => item.cosmetic.id === selection?.id);
  const tryingOn = Object.entries(preview).some(
    ([key, id]) => profile.data?.equipped[key as CosmeticSlot] !== id,
  );
  const resetPreview = () => {
    setPreview({});
    setSelection(undefined);
  };
  const updateCatalog = (next: CatalogSearch) => {
    purchase.reset();
    equip.reset();
    unequip.reset();
    void navigate({
      to: "/shop",
      search: {
        ...search,
        rarity: next.rarity,
        direction: next.direction,
        sort: next.sort,
        currency: next.currency,
      },
      replace: true,
    });
  };
  const metadata = selected && cosmeticMetadata.get(selected.cosmetic.id);
  const owned = selected?.reason === "already_owned";
  const worn = selected && profile.data?.equipped[selected.cosmetic.slot] === selected.cosmetic.id;
  const busy = purchase.isPending || equip.isPending || unequip.isPending;
  const error = shop.error ?? selectedPage.error ?? purchase.error ?? equip.error ?? unequip.error;
  const covered =
    selected &&
    profile.data?.equipped.full_body &&
    ["top", "bottom", "shoes", "hat", "accessory"].includes(selected.cosmetic.slot);
  return (
    <main {...stylex.props(styles.page, style)}>
      <header {...stylex.props(styles.header)}>
        <IconButton
          icon={ArrowLeftIcon}
          label={t`Back to Me`}
          variant="ghost"
          size="sm"
          cue="back"
          onClick={() => {
            void navigate({ to: "/me" });
          }}
        />
        <Text as="h1" variant="bodyStrong" style={styles.title}>
          <Trans>Shop</Trans>
        </Text>
        <IconButton
          icon={TShirtIcon}
          label={t`Wardrobe`}
          size="sm"
          cue="forward"
          onClick={() => {
            void navigate({
              to: "/wardrobe",
              search: { slot, rarity: search.rarity, direction: search.direction },
            });
          }}
        />
      </header>
      <CharacterArea
        compact
        setting="shop"
        preview={preview}
        name={tryingOn ? <Trans>Trying on</Trans> : undefined}
        actions={
          selection && (
            <IconButton
              icon={ArrowCounterClockwiseIcon}
              label={t`Reset preview`}
              variant="secondary"
              size="sm"
              cue="undo"
              onClick={resetPreview}
            />
          )
        }
      />
      <div {...stylex.props(styles.catalogBar)}>
        <CosmeticCategories
          slot={slot}
          onChange={(next) => {
            purchase.reset();
            equip.reset();
            unequip.reset();
            void navigate({ to: "/shop", search: { ...search, slot: next }, replace: true });
          }}
        />
        <CatalogControls search={search} showCost showCurrency onChange={updateCatalog} />
      </div>
      <ScrollArea
        label={t`Shop`}
        indicator="none"
        style={styles.scroll}
        contentStyle={styles.content}
      >
        {error && (
          <Alert
            tone="negative"
            action={
              (shop.error || selectedPage.error) && (
                <Button
                  variant="secondary"
                  cue="retry"
                  onClick={() => {
                    void shop.refetch();
                    void selectedPage.refetch();
                  }}
                >
                  <Trans>Try again</Trans>
                </Button>
              )
            }
          >
            {t(errorMessage(error))}
          </Alert>
        )}
        {covered && (
          <Alert
            action={
              <Button
                size="sm"
                variant="secondary"
                cue="deselect"
                disabled={busy}
                loading={unequip.isPending}
                onClick={() => unequip.mutate({ body: { slot: "full_body" } })}
              >
                <Trans>Remove outfit</Trans>
              </Button>
            }
          >
            <Trans>Your outfit covers these clothes.</Trans>
          </Alert>
        )}
        {shop.isPending && <Skeleton height={wardrobeLayout.tile} corner="lg" />}
        {shop.data && items.length === 0 && (
          <EmptyState icon={ShoppingBagIcon} title={t`Nothing here yet`} />
        )}
        {items.length > 0 && (
          <div {...stylex.props(styles.grid)}>
            {items.map((item) => {
              const itemMetadata = cosmeticMetadata.get(item.cosmetic.id);
              return (
                <CosmeticTile
                  key={item.cosmetic.id}
                  cosmeticId={item.cosmetic.id}
                  label={itemMetadata?.name ? t(itemMetadata.name) : t`Cosmetic`}
                  price={item.price}
                  owned={item.reason === "already_owned"}
                  equipped={profile.data?.equipped[item.cosmetic.slot] === item.cosmetic.id}
                  selected={preview[item.cosmetic.slot] === item.cosmetic.id}
                  disabled={busy}
                  onClick={() => {
                    purchase.reset();
                    equip.reset();
                    setSelection({ id: item.cosmetic.id, slot: item.cosmetic.slot });
                    setPreview((current) => ({
                      ...current,
                      [item.cosmetic.slot]: item.cosmetic.id,
                    }));
                  }}
                />
              );
            })}
          </div>
        )}
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
      {selected && (
        <ShopItemTray
          name={metadata?.name ? t(metadata.name) : t`Cosmetic`}
          rarity={selected.cosmetic.rarity}
          detail={
            selected.reason === "insufficient_funds"
              ? selected.price.currency === "coin"
                ? t`Not enough coins`
                : t`Not enough gems`
              : undefined
          }
          action={
            owned ? (
              <Button
                size="sm"
                cue="select"
                blocked={worn || !!covered}
                disabled={busy}
                loading={equip.isPending}
                onClick={() =>
                  equip.mutate({ body: { cosmeticId: selected.cosmetic.id, ref: "shop" } })
                }
              >
                {worn ? <Trans>Worn</Trans> : <Trans>Wear</Trans>}
              </Button>
            ) : (
              <Button
                size="sm"
                cue="purchase"
                blocked={!selected.available}
                disabled={busy}
                loading={purchase.isPending}
                onClick={() => purchase.mutate({ body: { cosmeticId: selected.cosmetic.id } })}
              >
                <CurrencyAmount
                  kind={selected.price.currency}
                  amount={selected.price.amount}
                  size="sm"
                />
                <Trans>Buy</Trans>
              </Button>
            )
          }
        />
      )}
    </main>
  );
}
