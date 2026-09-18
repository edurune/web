import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon } from "@phosphor-icons/react";
import type { StyleXStyles } from "@stylexjs/stylex";
import { NoticeBar } from "../ui/primitives/notice-bar.tsx";

export function GuestBanner({ onLogin, style }: { onLogin: () => void; style?: StyleXStyles }) {
  return (
    <NoticeBar
      tone="caution"
      iconEnd={ArrowRightIcon}
      onPress={onLogin}
      cue="forward"
      style={style}
    >
      <Trans>Log in to save your progress</Trans>
    </NoticeBar>
  );
}
