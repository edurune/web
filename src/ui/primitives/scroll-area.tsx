import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { CaretDownIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useEffect, useImperativeHandle, useState } from "react";
import type { ReactNode, Ref, UIEventHandler } from "react";
import { borderWidth } from "../tokens/border.stylex.ts";
import { color } from "../tokens/color.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { scroll } from "../tokens/scroll.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { Button } from "./button.tsx";

export interface ScrollAreaProps {
  children: ReactNode;
  label?: string;
  orientation?: "vertical" | "horizontal";
  /** Show a scrollbar, fade overflowing edges, or hide both cues. */
  indicator?: "scrollbar" | "fade" | "none";
  /** Caption for a pressable that appears while content remains below. */
  hint?: string;
  contentStyle?: StyleXStyles;
  viewportRef?: Ref<HTMLDivElement>;
  onScroll?: UIEventHandler<HTMLDivElement>;
  style?: StyleXStyles;
}

const endSlack = 4;

const styles = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minBlockSize: space.none,
    minInlineSize: space.none,
    maxInlineSize: layout.full,
  },
  viewport: {
    inlineSize: layout.full,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    minBlockSize: space.none,
    borderRadius: "inherit",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineColor: color.borderFocus,
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
  content: { inlineSize: layout.full },
  horizontal: { inlineSize: "max-content" },
  fadeX: {
    maskImage: {
      default: "none",
      ":is([data-overflow-x-start])": scroll.fadeStartX,
      ":is([data-overflow-x-end])": scroll.fadeEndX,
      ":is([data-overflow-x-start][data-overflow-x-end])": scroll.fadeBothX,
    },
  },
  fadeY: {
    maskImage: {
      default: "none",
      ":is([data-overflow-y-start])": scroll.fadeStartY,
      ":is([data-overflow-y-end])": scroll.fadeEndY,
      ":is([data-overflow-y-start][data-overflow-y-end])": scroll.fadeBothY,
    },
  },
  scrollbar: {
    display: "flex",
    padding: space.xxs,
    borderRadius: radius.pill,
    backgroundColor: color.surfaceSunken,
    userSelect: "none",
  },
  verticalBar: { inlineSize: scroll.thickness, marginBlock: space.xs, marginInlineEnd: space.xxs },
  horizontalBar: { blockSize: scroll.thickness, marginInline: space.xs, marginBlockEnd: space.xxs },
  hint: {
    position: "absolute",
    insetBlockEnd: space.md,
    insetInline: space.none,
    display: "flex",
    justifyContent: "center",
    zIndex: layer.raised,
    pointerEvents: "none",
  },
  hintButton: { pointerEvents: "auto", borderRadius: radius.pill },
  thumb: { borderRadius: radius.pill, backgroundColor: color.textMuted },
  verticalThumb: { inlineSize: layout.full, minBlockSize: scroll.thumbMinimum },
  horizontalThumb: { blockSize: layout.full, minInlineSize: scroll.thumbMinimum },
});

export function ScrollArea({
  children,
  label,
  orientation = "vertical",
  indicator = "scrollbar",
  hint,
  contentStyle,
  viewportRef,
  onScroll,
  style,
}: ScrollAreaProps) {
  const horizontal = orientation === "horizontal";
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [remaining, setRemaining] = useState(false);
  const [reached, setReached] = useState(false);
  useImperativeHandle(viewportRef, () => viewport!, [viewport]);
  const wantsHint = Boolean(hint) && !horizontal;
  useEffect(() => {
    if (!viewport || !wantsHint) return;
    const measure = () => {
      const overflow = viewport.scrollHeight - viewport.clientHeight;
      const more = overflow > endSlack && overflow - viewport.scrollTop > endSlack;
      setRemaining(more);
      if (overflow > endSlack && !more) setReached(true);
    };
    measure();
    viewport.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    for (const child of viewport.children) observer.observe(child);
    return () => {
      viewport.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [viewport, wantsHint]);
  return (
    <BaseScrollArea.Root {...stylex.props(styles.root, style)}>
      <BaseScrollArea.Viewport
        ref={setViewport}
        onScroll={onScroll}
        role={label ? "region" : undefined}
        aria-label={label}
        {...stylex.props(
          styles.viewport,
          indicator === "fade" && (horizontal ? styles.fadeX : styles.fadeY),
        )}
        style={{
          overflowX: horizontal ? "auto" : "hidden",
          overflowY: horizontal ? "hidden" : "auto",
        }}
      >
        <BaseScrollArea.Content
          {...stylex.props(styles.content, horizontal && styles.horizontal, contentStyle)}
          style={{ minWidth: horizontal ? layout.full : space.none }}
        >
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {indicator === "scrollbar" && (
        <BaseScrollArea.Scrollbar
          orientation={orientation}
          {...stylex.props(
            styles.scrollbar,
            horizontal ? styles.horizontalBar : styles.verticalBar,
          )}
        >
          <BaseScrollArea.Thumb
            {...stylex.props(
              styles.thumb,
              horizontal ? styles.horizontalThumb : styles.verticalThumb,
            )}
          />
        </BaseScrollArea.Scrollbar>
      )}
      {wantsHint && remaining && !reached && (
        <div {...stylex.props(styles.hint)}>
          <Button
            size="sm"
            variant="secondary"
            iconEnd={CaretDownIcon}
            cue="forward"
            style={styles.hintButton}
            onClick={() => viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" })}
          >
            {hint}
          </Button>
        </div>
      )}
    </BaseScrollArea.Root>
  );
}
