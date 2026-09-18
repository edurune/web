import type { StyleXStyles } from "@stylexjs/stylex";
import { Fragment } from "react";
import { useWalletQuery } from "../api/character/use-character-queries.ts";
import { useMeQuery } from "../api/user/use-user-queries.ts";
import { CurrencyChip } from "../ui/primitives/currency-chip.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { control } from "../ui/tokens/size.stylex.ts";

export function WalletBalance({ style }: { style?: StyleXStyles }) {
  const wallet = useWalletQuery();
  const user = useMeQuery();
  return (
    <Stack direction="row" gap="xs" wrap={false} style={style}>
      {wallet.data ? (
        <Fragment key={user.data?.id}>
          <CurrencyChip kind="coin" amount={wallet.data.coins} />
          <CurrencyChip kind="gem" amount={wallet.data.gems} />
        </Fragment>
      ) : (
        <Skeleton width={layout.badge} height={control.sm} corner="pill" />
      )}
    </Stack>
  );
}
