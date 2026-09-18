import { RARITY_LABEL } from "@edurune/art/labels";
import { FunnelIcon, SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import { IconButton } from "./primitives/button.tsx";
import { Field } from "./primitives/field.tsx";
import { Popover } from "./primitives/popover.tsx";
import { RadioGroup, RadioOption } from "./primitives/radio-group.tsx";
import { Select } from "./primitives/select.tsx";
import { Stack } from "./primitives/stack.tsx";
import { space } from "./tokens/space.stylex.ts";
import { catalogRarities } from "./catalog-search.ts";
import type { CatalogSearch } from "./catalog-search.ts";
export type { CatalogSearch } from "./catalog-search.ts";

const styles = stylex.create({
  controls: { display: "flex", alignItems: "center", gap: space.xs, flexShrink: 0 },
  popup: { inlineSize: "15rem", maxInlineSize: "calc(100vw - 2rem)" },
});

export function CatalogControls({
  search,
  showCost = false,
  showCurrency = false,
  onChange,
}: {
  search: CatalogSearch;
  showCost?: boolean;
  showCurrency?: boolean;
  onChange: (search: CatalogSearch) => void;
}) {
  const { t } = useLingui();
  const order = `${search.sort ?? "rarity"}_${search.direction ?? "asc"}`;
  const filterCount =
    Number(Boolean(search.rarity)) + Number(showCurrency && Boolean(search.currency));
  const customOrder = order !== "rarity_asc";
  const orderOptions = [
    { value: "rarity_asc", label: t`Common first` },
    { value: "rarity_desc", label: t`Legendary first` },
    ...(showCost
      ? [
          { value: "cost_asc", label: t`Lowest cost` },
          { value: "cost_desc", label: t`Highest cost` },
        ]
      : []),
  ];
  return (
    <div {...stylex.props(styles.controls)}>
      <Popover
        title={t`Filter`}
        style={styles.popup}
        trigger={
          <IconButton
            icon={FunnelIcon}
            label={filterCount ? t`Filter (${filterCount})` : t`Filter`}
            size="sm"
            variant={filterCount ? "primary" : "secondary"}
            badge={filterCount || undefined}
            cue={null}
          />
        }
      >
        <Stack gap="md">
          <Field label={t`Rarity`}>
            <Select
              size="sm"
              value={search.rarity ?? "all"}
              options={[
                { value: "all", label: t`All rarities` },
                ...catalogRarities.map((rarity) => ({
                  value: rarity,
                  label: t(RARITY_LABEL[rarity]),
                })),
              ]}
              onValueChange={(value) =>
                onChange({
                  ...search,
                  rarity:
                    typeof value === "string"
                      ? catalogRarities.find((rarity) => rarity === value)
                      : undefined,
                })
              }
            />
          </Field>
          {showCurrency && (
            <Field label={t`Currency`}>
              <Select
                size="sm"
                value={search.currency ?? "all"}
                options={[
                  { value: "all", label: t`All currencies` },
                  { value: "coin", label: t`Coins` },
                  { value: "gem", label: t`Gems` },
                ]}
                onValueChange={(value) =>
                  onChange({
                    ...search,
                    currency: value === "coin" || value === "gem" ? value : undefined,
                  })
                }
              />
            </Field>
          )}
        </Stack>
      </Popover>
      <Popover
        title={t`Sort`}
        style={styles.popup}
        trigger={
          <IconButton
            icon={search.direction === "desc" ? SortDescendingIcon : SortAscendingIcon}
            label={t`Sort`}
            size="sm"
            variant={customOrder ? "primary" : "secondary"}
            cue={null}
          />
        }
      >
        <RadioGroup
          value={order}
          onValueChange={(value) => {
            if (typeof value !== "string") return;
            const [sort, direction] = value.split("_");
            if (
              (sort === "rarity" || (showCost && sort === "cost")) &&
              (direction === "asc" || direction === "desc")
            )
              onChange({ ...search, sort, direction });
          }}
        >
          {orderOptions.map((option) => (
            <RadioOption key={option.value} value={option.value}>
              {option.label}
            </RadioOption>
          ))}
        </RadioGroup>
      </Popover>
    </div>
  );
}
