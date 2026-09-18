import { Trans } from "@lingui/react/macro";
import { WifiSlashIcon } from "@phosphor-icons/react";
import type { StyleXStyles } from "@stylexjs/stylex";
import { NoticeBar } from "../ui/primitives/notice-bar.tsx";

export function OfflineBanner({ style }: { style?: StyleXStyles }) {
  return (
    <NoticeBar tone="caution" icon={WifiSlashIcon} announce="warning" style={style}>
      <Trans>You are offline. Some things will not load.</Trans>
    </NoticeBar>
  );
}
