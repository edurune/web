import { useState } from "react";
import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Field } from "../ui/primitives/field.tsx";
import { TextField } from "../ui/primitives/text-field.tsx";
import { Chip } from "../ui/primitives/chip.tsx";
import { MarkdownContent } from "../ui/primitives/markdown-content.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { answerLength, type Question } from "./session.ts";

type TextInteraction = Extract<Question["interaction"], { kind: "text" }>;
type Bank = Extract<TextInteraction["control"], { kind: "letter_bank" }>;
export interface LetterBankProps {
  letters: Bank["letters"];
  selected: string[];
  maxLength: number;
  disabled?: boolean;
  correct?: boolean;
  onChange: (ids: string[]) => void;
  style?: StyleXStyles;
}

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const normalized = (value: string) => value.normalize("NFC").toLowerCase();
const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.lg },
  bank: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: space.sm,
    paddingBlockEnd: space.xs,
  },
});

/** Typing and tapping consume the same finite set of server-issued letter IDs. */
export function LetterBank({
  letters,
  selected,
  maxLength,
  disabled = false,
  correct,
  onChange,
  style,
}: LetterBankProps) {
  const { t } = useLingui();
  const [composition, setComposition] = useState<string | null>(null);
  const value = selected
    .map((id) => letters.find((letter) => letter.id === id)?.value ?? "")
    .join("");
  const changeText = (text: string) => {
    if (disabled) return;
    const available = [...letters];
    const ids: string[] = [];
    let length = 0;
    for (const { segment } of graphemes.segment(text)) {
      const exact = available.findIndex((letter) => letter.value === segment);
      const index =
        exact >= 0
          ? exact
          : available.findIndex((letter) => normalized(letter.value) === normalized(segment));
      const letter = available[index];
      if (!letter) continue;
      const nextLength = length + answerLength(letter.value);
      if (nextLength > maxLength) break;
      length = nextLength;
      ids.push(letter.id);
      available.splice(index, 1);
    }
    onChange(ids);
  };
  return (
    <div {...stylex.props(styles.root, style)}>
      <Field label={t`Your answer`}>
        <TextField
          size="lg"
          cue="typing"
          value={composition ?? value}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          autoFocus
          readOnly={disabled}
          invalid={correct === false}
          placeholder={t`Type or tap letters`}
          onCompositionStart={(event) => setComposition(event.currentTarget.value)}
          onCompositionEnd={(event) => {
            setComposition(null);
            changeText(event.currentTarget.value);
          }}
          onChange={(event) => {
            if (
              composition !== null ||
              (event.nativeEvent instanceof InputEvent && event.nativeEvent.isComposing)
            )
              setComposition(event.target.value);
            else changeText(event.target.value);
          }}
        />
      </Field>
      <div {...stylex.props(styles.bank)}>
        {letters.map((letter) => (
          <Chip
            key={letter.id}
            cue="check"
            spent={selected.includes(letter.id)}
            disabled={disabled || answerLength(value + letter.value) > maxLength}
            onClick={() => {
              if (!disabled && !selected.includes(letter.id)) onChange([...selected, letter.id]);
            }}
          >
            <MarkdownContent markdown={letter.value} inline />
          </Chip>
        ))}
      </div>
    </div>
  );
}
