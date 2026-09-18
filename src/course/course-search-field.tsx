import { useLingui } from "@lingui/react/macro";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useRef } from "react";
import { Button } from "../ui/primitives/button.tsx";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { control } from "../ui/tokens/size.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { font, fontSize } from "../ui/tokens/text.stylex.ts";
import { courseSearchLimit } from "./course-search.ts";

export interface CourseSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  style?: StyleXStyles;
}

const styles = stylex.create({
  form: {
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    paddingInline: space.xs,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
    backgroundColor: color.surfaceRaised,
    outlineStyle: { default: "none", ":has(:focus-visible)": "solid" },
    outlineColor: color.borderFocus,
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
  input: {
    minInlineSize: space.none,
    flex: 1,
    blockSize: control.md,
    padding: space.none,
    borderWidth: borderWidth.none,
    outlineStyle: "none",
    backgroundColor: color.surfaceTransparent,
    color: color.textPrimary,
    fontFamily: font.body,
    fontSize: fontSize.lg,
    "::placeholder": { color: color.textMuted },
    "::-webkit-search-cancel-button": { display: "none" },
  },
  action: {
    inlineSize: control.md,
    paddingInline: space.none,
    flexShrink: 0,
    outlineStyle: "none",
  },
});

export function CourseSearchField({
  value,
  onChange,
  onSubmit,
  disabled,
  style,
}: CourseSearchFieldProps) {
  const { t } = useLingui();
  const input = useRef<HTMLInputElement>(null);
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
      {...stylex.props(styles.form, style)}
    >
      <Button
        type="submit"
        variant="ghost"
        cue="send"
        disabled={disabled}
        aria-label={t`Search courses`}
        style={styles.action}
      >
        <MagnifyingGlassIcon size={iconSize.md} weight="bold" aria-hidden="true" />
      </Button>
      <input
        ref={input}
        type="search"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        maxLength={courseSearchLimit}
        aria-label={t`Search courses`}
        placeholder={t`Search courses`}
        autoComplete="off"
        enterKeyHint="search"
        {...stylex.props(styles.input)}
      />
      {value && (
        <Button
          variant="ghost"
          cue="cancel"
          disabled={disabled}
          aria-label={t`Clear search`}
          style={styles.action}
          onClick={() => {
            onChange("");
            onSubmit("");
            input.current?.focus();
          }}
        >
          <XIcon size={iconSize.md} weight="bold" aria-hidden="true" />
        </Button>
      )}
    </form>
  );
}
