import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { useLingui } from "@lingui/react/macro";
import { XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";
import { IconButton } from "./button.tsx";
import { useOverlayCues } from "../sound/use-overlay-cues.ts";
import { ScrollArea } from "./scroll-area.tsx";
import { layout } from "../tokens/layout.stylex.ts";

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Opens the dialog. Omit when driving `open` yourself. */
  trigger?: ReactNode;
  /** Buttons pinned under the content. */
  footer?: ReactNode;
  dismissible?: boolean;
  children?: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  backdrop: {
    position: "fixed",
    inset: space.none,
    zIndex: layer.overlay,
    backgroundColor: color.surfaceScrim,
    opacity: {
      default: 1,
      ":is([data-starting-style])": 0,
      ":is([data-ending-style])": 0,
    },
    transitionProperty: "opacity",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.instant },
  },
  popup: {
    position: "fixed",
    insetBlockStart: layout.midpoint,
    insetInlineStart: layout.midpoint,
    zIndex: layer.overlay,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    width: `calc(${layout.viewportWidth} - ${space.xxl})`,
    maxWidth: `calc(${layout.portrait} - ${space.xl})`,
    maxHeight: `calc(${layout.viewport} - ${space.xxxl})`,
    overflow: "hidden",
    padding: space.xl,
    backgroundColor: color.surfaceRaised,
    borderRadius: radius.xxl,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBottomWidth: press.lipWidth,
    borderColor: color.borderStrong,
    opacity: {
      default: 1,
      ":is([data-starting-style])": 0,
      ":is([data-ending-style])": 0,
    },
    transform: {
      default: "translate(-50%, -50%) scale(1)",
      ":is([data-starting-style])": "translate(-50%, -50%) scale(0.94)",
      ":is([data-ending-style])": "translate(-50%, -50%) scale(0.94)",
    },
    outline: "none",
    transitionProperty: "opacity, transform",
    transitionDuration: duration.normal,
    transitionTimingFunction: easing.bounce,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.instant },
  },
  header: {
    flexShrink: 0,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: space.md,
  },
  title: {
    margin: space.none,
    fontFamily: font.display,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    color: color.textPrimary,
  },
  description: {
    margin: space.none,
    flexShrink: 0,
    fontFamily: font.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
    color: color.textSecondary,
  },
  content: { minBlockSize: space.none, flexShrink: 1 },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: space.sm,
    flexWrap: "wrap",
    flexShrink: 0,
  },
});

export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  trigger,
  footer,
  dismissible = true,
  children,
  style,
}: DialogProps) {
  const { t } = useLingui();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false);
  useOverlayCues(open ?? uncontrolled);
  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next: boolean) => {
        setUncontrolled(next);
        onOpenChange?.(next);
      }}
    >
      {trigger ? <BaseDialog.Trigger render={trigger as never} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop {...stylex.props(styles.backdrop)} />
        <BaseDialog.Popup {...stylex.props(styles.popup, style)}>
          <div {...stylex.props(styles.header)}>
            <BaseDialog.Title {...stylex.props(styles.title)}>{title}</BaseDialog.Title>
            {dismissible ? (
              <BaseDialog.Close
                render={
                  <IconButton icon={XIcon} label={t`Close`} variant="ghost" size="sm" cue={null} />
                }
              />
            ) : null}
          </div>
          {description ? (
            <BaseDialog.Description {...stylex.props(styles.description)}>
              {description}
            </BaseDialog.Description>
          ) : null}
          {children && (
            <ScrollArea indicator="none" style={styles.content}>
              {children}
            </ScrollArea>
          )}
          {footer ? <div {...stylex.props(styles.footer)}>{footer}</div> : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export const DialogClose = BaseDialog.Close;
