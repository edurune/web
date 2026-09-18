import { Toast as BaseToast } from "@base-ui/react/toast";
import { XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { color } from "../tokens/color.stylex.ts";
import type { CueName } from "../sound/sound.ts";
import { useSoundWhen } from "../sound/use-sound-when.ts";
import { press } from "../tokens/press.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";

export const ToastProvider = BaseToast.Provider;
export const useToastManager = BaseToast.useToastManager;

const styles = stylex.create({
  viewport: {
    position: "fixed",
    insetBlockEnd: space.lg,
    insetInlineEnd: space.lg,
    zIndex: layer.toast,
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    width: "min(360px, calc(100vw - 32px))",
  },
  toast: {
    display: "flex",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    backgroundColor: color.surfaceRaised,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: "2px",
    borderBottomWidth: press.lipWidth,
    borderColor: color.borderStrong,
    opacity: {
      default: 1,
      ":is([data-starting-style])": 0,
      ":is([data-ending-style])": 0,
    },
    transform: {
      default: "translateY(0)",
      ":is([data-starting-style])": "translateY(12px)",
      ":is([data-ending-style])": "translateY(12px)",
    },
    transitionProperty: "opacity, transform",
    transitionDuration: duration.normal,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
  body: { display: "flex", flexDirection: "column", gap: space.xxs, flex: 1, minWidth: 0 },
  title: {
    fontFamily: font.display,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: color.textPrimary,
  },
  description: {
    fontFamily: font.body,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.snug,
    color: color.textSecondary,
  },
  close: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "24px",
    height: "24px",
    backgroundColor: "transparent",
    borderRadius: radius.sm,
    borderWidth: 0,
    color: color.textMuted,
    cursor: "pointer",
    outline: "none",
  },
});

export function ToastViewport() {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport {...stylex.props(styles.viewport)}>
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

const typeCues: Record<string, CueName> = {
  success: "success",
  error: "error",
  warning: "warning",
  loading: "queued",
};

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => <ToastRow key={toast.id} toast={toast} />);
}

function ToastRow({ toast }: { toast: BaseToast.Root.ToastObject }) {
  useSoundWhen(typeCues[toast.type ?? ""] ?? "notification", true);
  return (
    <BaseToast.Root toast={toast} {...stylex.props(styles.toast)}>
      <div {...stylex.props(styles.body)}>
        <BaseToast.Title {...stylex.props(styles.title)} />
        <BaseToast.Description {...stylex.props(styles.description)} />
      </div>
      <BaseToast.Close aria-label="Close" {...stylex.props(styles.close)}>
        <XIcon size={iconSize.sm} weight="bold" />
      </BaseToast.Close>
    </BaseToast.Root>
  );
}
