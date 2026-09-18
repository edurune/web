import { Trans, useLingui } from "@lingui/react/macro";
import { DotsThreeVerticalIcon, GearSixIcon } from "@phosphor-icons/react";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { IconButton, type ButtonVariant } from "../ui/primitives/button.tsx";
import { Menu, MenuItem } from "../ui/primitives/menu.tsx";
import { iconSize } from "../ui/tokens/scale.ts";
import { AppSettings } from "./app-settings.tsx";

/** Keeps global preferences reachable from screens without the main navigation. */
export function SettingsMenu({
  variant = "ghost",
  children,
  style,
}: {
  variant?: ButtonVariant;
  /** Screen-specific items listed above the shared preferences. */
  children?: ReactNode;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <Menu
        align="end"
        trigger={
          <IconButton
            icon={DotsThreeVerticalIcon}
            label={t`More options`}
            variant={variant}
            cue={null}
            style={style}
          />
        }
      >
        {children}
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <GearSixIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
          <Trans>Settings</Trans>
        </MenuItem>
      </Menu>
      <AppSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
