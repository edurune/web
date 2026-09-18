import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowLeftIcon, ShoppingBagIcon, TShirtIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useCharacterProfileQuery } from "../api/character/use-character-queries.ts";
import {
  useEquipCosmeticMutation,
  useUnequipCosmeticMutation,
} from "../api/character/use-character-mutations.ts";
import { useWardrobeQuery } from "../api/character/use-cosmetic-queries.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
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
import { WardrobeShopCard } from "./wardrobe-shop-card.tsx";
import { cosmeticMetadata } from "./cosmetics.ts";
import type { WardrobeSearch } from "./cosmetics.ts";
import { CatalogControls, type CatalogSearch } from "../ui/catalog-controls.tsx";

export function WardrobeScreen({
  search,
  style,
}: {
  search: WardrobeSearch;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const { slot } = search;
  const wardrobe = useWardrobeQuery({ ...search, limit: 20 });
  const profile = useCharacterProfileQuery();
  const equip = useEquipCosmeticMutation();
  const unequip = useUnequipCosmeticMutation();
  const items = wardrobe.data?.pages.flatMap((page) => page.items) ?? [];
  const busy = equip.isPending || unequip.isPending;
  const error = wardrobe.error ?? equip.error ?? unequip.error;
  const covered =
    profile.data?.equipped.full_body &&
    ["top", "bottom", "shoes", "hat", "accessory"].includes(slot);
  const openShop = () => {
    void navigate({ to: "/shop", search: { ...search, slot } });
  };
  const updateCatalog = (next: CatalogSearch) => {
    equip.reset();
    unequip.reset();
    void navigate({
      to: "/wardrobe",
      search: { ...search, rarity: next.rarity, direction: next.direction },
      replace: true,
    });
  };
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
          <Trans>Wardrobe</Trans>
        </Text>
        <IconButton
          icon={ShoppingBagIcon}
          label={t`Shop`}
          size="sm"
          cue="forward"
          onClick={openShop}
        />
      </header>
      <CharacterArea compact />
      <div {...stylex.props(styles.catalogBar)}>
        <CosmeticCategories
          slot={slot}
          onChange={(next) => {
            equip.reset();
            unequip.reset();
            void navigate({ to: "/wardrobe", search: { ...search, slot: next }, replace: true });
          }}
        />
        <CatalogControls search={search} onChange={updateCatalog} />
      </div>
      <ScrollArea
        label={t`Wardrobe`}
        indicator="none"
        style={styles.scroll}
        contentStyle={styles.content}
      >
        {error && (
          <Alert
            tone="negative"
            action={
              wardrobe.error && (
                <Button
                  variant="secondary"
                  cue="retry"
                  onClick={() => {
                    void wardrobe.refetch();
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
                loading={unequip.isPending}
                disabled={busy}
                onClick={() => unequip.mutate({ body: { slot: "full_body" } })}
              >
                <Trans>Remove outfit</Trans>
              </Button>
            }
          >
            <Trans>Your outfit covers these clothes.</Trans>
          </Alert>
        )}
        {wardrobe.isPending && <Skeleton height={wardrobeLayout.tile} corner="lg" />}
        {wardrobe.data && items.length === 0 && (
          <EmptyState icon={TShirtIcon} title={t`Nothing here yet`} />
        )}
        {wardrobe.data && (
          <div {...stylex.props(styles.grid)}>
            {items.length > 0 && (
              <CosmeticTile
                label={t`None`}
                selected={profile.data?.equipped[slot] === null}
                disabled={busy}
                blocked={!profile.data?.equipped[slot]}
                loading={unequip.isPending && unequip.variables?.body.slot === slot}
                onClick={() => unequip.mutate({ body: { slot } })}
              />
            )}
            {items.map((item) => {
              const metadata = cosmeticMetadata.get(item.cosmetic.id);
              return (
                <CosmeticTile
                  key={item.cosmetic.id}
                  cosmeticId={item.cosmetic.id}
                  label={metadata?.name ? t(metadata.name) : t`Cosmetic`}
                  equipped={item.equipped}
                  disabled={busy}
                  blocked={!item.available}
                  loading={equip.isPending && equip.variables?.body.cosmeticId === item.cosmetic.id}
                  onClick={() => equip.mutate({ body: { cosmeticId: item.cosmetic.id } })}
                />
              );
            })}
            <WardrobeShopCard onClick={openShop} />
          </div>
        )}
        {wardrobe.hasNextPage && (
          <LoadMoreButton
            autoLoad={!wardrobe.isError}
            loading={wardrobe.isFetchingNextPage}
            disabled={wardrobe.isFetching}
            onLoadMore={() => {
              if (!wardrobe.isFetching) void wardrobe.fetchNextPage({ cancelRefetch: false });
            }}
          >
            <Trans>Load more</Trans>
          </LoadMoreButton>
        )}
      </ScrollArea>
    </main>
  );
}
