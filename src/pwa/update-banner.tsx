import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowClockwiseIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { NoticeBar } from "../ui/primitives/notice-bar.tsx";

export interface UpdateBannerProps {
  applying?: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
  style?: StyleXStyles;
}

const styles = stylex.create({
  action: { flexShrink: 0 },
});

export function UpdateBanner({ applying = false, onUpdate, onDismiss, style }: UpdateBannerProps) {
  const { t } = useLingui();
  return (
    <NoticeBar
      tone="info"
      icon={ArrowClockwiseIcon}
      announce="notification"
      style={style}
      actions={
        <>
          <Button
            size="sm"
            variant="secondary"
            cue="start"
            loading={applying}
            onClick={onUpdate}
            style={styles.action}
          >
            <Trans>Update</Trans>
          </Button>
          <IconButton
            icon={XIcon}
            label={t`Dismiss`}
            size="sm"
            variant="ghost"
            cue="close"
            onClick={onDismiss}
            style={styles.action}
          />
        </>
      }
    >
      <Trans>A new version is ready</Trans>
    </NoticeBar>
  );
}
