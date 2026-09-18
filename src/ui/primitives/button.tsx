import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, ElementType, MouseEvent } from "react";
import { color } from "../tokens/color.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, letterSpacing, lineHeight } from "../tokens/text.stylex.ts";
import type { Size } from "../types.ts";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import type { CueName } from "../sound/sound.ts";
import { Spinner } from "./spinner.tsx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

// Unknown props pass through so Base UI triggers can attach handlers and refs.
export interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "style"> {
  variant?: ButtonVariant;
  size?: Size;
  iconStart?: PhosphorIcon;
  iconEnd?: PhosphorIcon;
  loading?: boolean;
  fullWidth?: boolean;
  /** Render as a link or router Link while keeping button styling. */
  as?: ElementType;
  href?: string;
  to?: string;
  /** The cue this press means. `null` silences it. */
  cue?: CueName | null;
  /** Refuses the press and says so, instead of going dead like `disabled`. */
  blocked?: boolean;
  /** Opt in to a hover cue. Reserve it for surfaces meant to be browsed. */
  hover?: CueName | null;
  style?: StyleXStyles;
}

const preventPress = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();

const styles = stylex.create({
  root: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    blockSize: press.height,
    paddingBlock: 0,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBottomWidth: press.lipWidth,
    borderColor: press.edgeColor,
    borderRadius: radius.lg,
    fontFamily: font.display,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.wide,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    userSelect: "none",
    outlineColor: color.borderFocus,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
  pressable: {
    // Translation moves the complete contour, leaving its layout box untouched.
    translate: { default: "none", ":active:not(:disabled)": `0 ${press.lipTravel}` },
    transitionProperty: "translate, background-color",
    transitionDuration: duration.instant,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.none },
  },
  fullWidth: {
    inlineSize: "100%",
  },
  // Sits in the pressed geometry so it never reads as liftable, and keeps a
  // muted ink contour so it stays in the same family as the rest.
  disabled: {
    backgroundColor: color.disabledSurface,
    borderColor: color.borderDisabled,
    borderBottomWidth: press.edgeWidth,
    paddingBlockStart: press.lipTravel,
    color: color.textDisabled,
  },
  // Ghost carries no slab, so a disabled one must not grow a fill.
  disabledGhost: {
    backgroundColor: "transparent",
    color: color.textDisabled,
  },
  loadingLabel: {
    visibility: "hidden",
  },
  content: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    minInlineSize: space.none,
  },
  glyph: { display: "block", flexShrink: 0 },
  circle: { borderRadius: radius.circle },
  badge: {
    position: "absolute",
    insetBlockStart: `calc(-1 * ${space.xs})`,
    insetInlineEnd: `calc(-1 * ${space.xs})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minInlineSize: layout.notificationBadge,
    blockSize: layout.notificationBadge,
    paddingInline: space.xxs,
    borderWidth: borderWidth.thick,
    borderStyle: "solid",
    borderColor: color.borderStrong,
    borderRadius: radius.pill,
    backgroundColor: color.notificationFill,
    color: color.textInverse,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.tight,
    pointerEvents: "none",
  },
  // Centred with auto margins, not a transform: the spinner's own rotate
  // keyframes write `transform` and would replace a translate here.
  spinner: {
    position: "absolute",
    insetBlock: 0,
    insetInline: 0,
    margin: "auto",
  },
});

const sizes = stylex.create({
  sm: { paddingInline: space.md, fontSize: fontSize.sm, borderRadius: radius.md },
  md: { paddingInline: space.lg, fontSize: fontSize.md },
  lg: { paddingInline: space.xl, fontSize: fontSize.lg, borderRadius: radius.xl },
});

const depthSm = stylex.createTheme(press, { height: "32px", lipWidth: "4px", lipTravel: "2px" });
const depthMd = stylex.createTheme(press, { height: "44px" });
const depthLg = stylex.createTheme(press, { height: "56px", lipWidth: "6px", lipTravel: "4px" });
const sizeDepth = { sm: depthSm, md: depthMd, lg: depthLg };

const variants = stylex.create({
  primary: {
    backgroundColor: { default: color.accentFill, ":hover:not(:disabled)": color.accentFillHover },
    color: color.textOnFill,
  },
  secondary: {
    backgroundColor: {
      default: color.surfaceRaised,
      ":hover:not(:disabled)": color.neutralFillHover,
    },
    color: color.textPrimary,
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover:not(:disabled)": color.neutralSoft },
    color: color.textSecondary,
  },
  danger: {
    backgroundColor: {
      default: color.negativeFill,
      ":hover:not(:disabled)": color.negativeFillHover,
    },
    color: color.textOnFill,
  },
});

// Ghost carries no slab, so it stays flat and never sinks.
const ghostDepth = stylex.createTheme(press, {
  edgeWidth: "0px",
  lipWidth: "0px",
  lipTravel: "0px",
  edgeColor: "transparent",
});

const iconOnlySizes = stylex.create({
  sm: { inlineSize: "32px", paddingInline: 0 },
  md: { inlineSize: "44px", paddingInline: 0 },
  lg: { inlineSize: "56px", paddingInline: 0 },
});

export function Button({
  children,
  variant = "primary",
  size = "md",
  iconStart,
  iconEnd,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  as: Component = "button",
  href,
  to,
  cue = "press",
  hover = null,
  blocked = false,
  onClick,
  style,
  ...rest
}: ButtonProps) {
  const inert = disabled || loading;
  const refusing = blocked && !inert;
  const isButton = Component === "button";
  const StartGlyph = iconStart;
  const EndGlyph = iconEnd;
  const glyphSize = size === "lg" ? iconSize.lg : iconSize.sm;

  return (
    <Component
      {...rest}
      type={isButton ? type : undefined}
      disabled={isButton ? inert : undefined}
      href={href}
      to={to}
      aria-disabled={refusing || (!isButton && inert) || undefined}
      aria-busy={loading || undefined}
      data-uisfx={refusing ? "blocked" : inert ? undefined : (cue ?? undefined)}
      data-uisfx-hover={inert ? undefined : (hover ?? undefined)}
      onClick={refusing ? preventPress : onClick}
      {...stylex.props(
        sizeDepth[size],
        variant === "ghost" && ghostDepth,
        styles.root,
        sizes[size],
        variants[variant],
        !inert && !refusing && styles.pressable,
        fullWidth && styles.fullWidth,
        (inert || refusing) && (variant === "ghost" ? styles.disabledGhost : styles.disabled),
        style,
      )}
    >
      {loading ? <Spinner size={size === "lg" ? "md" : "sm"} style={styles.spinner} /> : null}
      {StartGlyph ? (
        <StartGlyph
          size={glyphSize}
          weight="bold"
          aria-hidden="true"
          {...stylex.props(styles.glyph, loading && styles.loadingLabel)}
        />
      ) : null}
      {children ? (
        <span {...stylex.props(styles.content, loading && styles.loadingLabel)}>{children}</span>
      ) : null}
      {EndGlyph ? (
        <EndGlyph
          size={glyphSize}
          weight="bold"
          aria-hidden="true"
          {...stylex.props(styles.glyph, loading && styles.loadingLabel)}
        />
      ) : null}
    </Component>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, "children" | "iconStart" | "iconEnd"> {
  icon: PhosphorIcon;
  label: string;
  shape?: "rounded" | "circle";
  /** Omit or pass zero to hide. Include its meaning in the accessible label. */
  badge?: number | "!";
}

export function IconButton({
  icon: Glyph,
  label,
  size = "md",
  shape = "rounded",
  badge,
  style,
  ...rest
}: IconButtonProps) {
  const badgeLabel = badge === "!" ? badge : badge && badge > 0 ? Math.min(badge, 99) : undefined;
  return (
    <Button
      {...rest}
      aria-label={label}
      size={size}
      style={[iconOnlySizes[size], shape === "circle" && styles.circle, style]}
    >
      <Glyph size={size === "lg" ? iconSize.lg : iconSize.md} weight="bold" aria-hidden="true" />
      {badgeLabel !== undefined && (
        <span aria-hidden="true" {...stylex.props(styles.badge)}>
          {badgeLabel}
        </span>
      )}
    </Button>
  );
}
