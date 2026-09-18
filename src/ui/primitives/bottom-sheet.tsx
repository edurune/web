import { useState, type ReactElement, type ReactNode } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { useLingui } from "@lingui/react/macro";
import { XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { IconButton } from "./button.tsx";
import { ScrollArea } from "./scroll-area.tsx";
import { useOverlayCues } from "../sound/use-overlay-cues.ts";
import { color } from "../tokens/color.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";
import { sheet, sheetGesture } from "../tokens/sheet.stylex.ts";

export interface BottomSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Keep the content mounted until the exit transition finishes. */
  onOpenChangeComplete?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  trigger?: ReactElement;
  /** Actions stay pinned while long content scrolls. */
  footer?: ReactNode;
  /** Prevent dismissal while an action is being submitted. */
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
      default: `calc(1 - ${sheetGesture.progress})`,
      ":is([data-starting-style])": 0,
      ":is([data-ending-style])": 0,
    },
    transitionProperty: "opacity",
    transitionDuration: duration.normal,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.none },
  },
  viewport: {
    position: "fixed",
    inset: space.none,
    zIndex: layer.overlay,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    overflow: "hidden",
  },
  popup: {
    display: "flex",
    flexDirection: "column",
    inlineSize: layout.full,
    maxInlineSize: layout.portrait,
    maxBlockSize: sheet.maxHeight,
    minBlockSize: space.none,
    padding: space.lg,
    paddingBlockEnd: `max(${space.lg}, ${layout.safeBottom})`,
    gap: space.md,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBlockEndWidth: press.lipWidth,
    borderColor: color.borderStrong,
    borderStartStartRadius: radius.xxl,
    borderStartEndRadius: radius.xxl,
    backgroundColor: color.surfaceRaised,
    color: color.textPrimary,
    outline: "none",
    overflow: "hidden",
    transform: {
      default: `translateY(${sheetGesture.movement})`,
      ":is([data-starting-style])": `translateY(calc(${layout.full} + ${space.lg} + ${layout.safeBottom}))`,
      ":is([data-ending-style])": `translateY(calc(${layout.full} + ${space.lg} + ${layout.safeBottom}))`,
    },
    transitionProperty: "transform",
    transitionDuration: {
      default: duration.slow,
      ":is([data-swiping])": duration.none,
      ":is([data-ending-style])": `calc(${duration.slow} * ${sheetGesture.strength})`,
    },
    transitionTimingFunction: easing.entrance,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.none },
  },
  content: { display: "flex", flexDirection: "column", gap: space.lg, minBlockSize: space.none },
  header: { display: "flex", alignItems: "center", gap: space.md, flexShrink: 0 },
  title: {
    flex: 1,
    minInlineSize: space.none,
    margin: space.none,
    fontFamily: font.display,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    overflowWrap: "anywhere",
  },
  scroll: { flexShrink: 1, minBlockSize: space.none },
  body: { display: "flex", flexDirection: "column", gap: space.md },
  description: {
    margin: space.none,
    fontFamily: font.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
    color: color.textSecondary,
  },
  footer: { flexShrink: 0, display: "flex", alignItems: "center", gap: space.sm },
});

/** A portrait-width, swipe-dismissable sheet with a fixed header and action row. */
export function BottomSheet({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  title,
  description,
  trigger,
  footer,
  dismissible = true,
  children,
  style,
}: BottomSheetProps) {
  const { t } = useLingui();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false);
  useOverlayCues(open ?? uncontrolled);
  return (
    <Drawer.Root
      open={open}
      defaultOpen={defaultOpen}
      swipeDirection="down"
      disablePointerDismissal={!dismissible}
      onOpenChange={(next, details) => {
        if (!next && !dismissible) details.cancel();
        else {
          setUncontrolled(next);
          onOpenChange?.(next);
        }
      }}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      {trigger && <Drawer.Trigger render={trigger} />}
      <Drawer.Portal>
        <Drawer.Backdrop {...stylex.props(styles.backdrop)} />
        <Drawer.Viewport {...stylex.props(styles.viewport)}>
          <Drawer.Popup
            data-base-ui-swipe-ignore={!dismissible || undefined}
            {...stylex.props(styles.popup, style)}
          >
            <Drawer.Content {...stylex.props(styles.content)}>
              <div {...stylex.props(styles.header)}>
                <Drawer.Title {...stylex.props(styles.title)}>{title}</Drawer.Title>
                <Drawer.Close
                  render={
                    <IconButton
                      icon={XIcon}
                      label={t`Close`}
                      variant="ghost"
                      size="sm"
                      cue={null}
                      disabled={!dismissible}
                    />
                  }
                />
              </div>
              {(description || children) && (
                <ScrollArea indicator="fade" style={styles.scroll} contentStyle={styles.body}>
                  {description && (
                    <Drawer.Description {...stylex.props(styles.description)}>
                      {description}
                    </Drawer.Description>
                  )}
                  {children}
                </ScrollArea>
              )}
              {footer && <div {...stylex.props(styles.footer)}>{footer}</div>}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export const BottomSheetClose = Drawer.Close;
