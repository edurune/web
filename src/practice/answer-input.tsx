import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import { BackspaceIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Chip } from "../ui/primitives/chip.tsx";
import { Option } from "../ui/primitives/option.tsx";
import { Field } from "../ui/primitives/field.tsx";
import { TextField } from "../ui/primitives/text-field.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Badge } from "../ui/primitives/badge.tsx";
import { IconButton } from "../ui/primitives/button.tsx";
import { MarkdownContent } from "../ui/primitives/markdown-content.tsx";
import { VisuallyHidden } from "../ui/primitives/visually-hidden.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { control as controlSize } from "../ui/tokens/size.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../ui/tokens/text.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { practiceLayout } from "../ui/tokens/practice.stylex.ts";
import { MediaAttachments } from "../asset/media-attachments.tsx";
import { answerLength, type Answer, type Question } from "./session.ts";
import { LetterBank } from "./letter-bank.tsx";
import { ContentImages } from "./content-images.tsx";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    minInlineSize: space.none,
    margin: space.none,
    padding: space.none,
    borderWidth: borderWidth.none,
  },
  question: {
    fontFamily: font.display,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  bank: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: space.sm,
    paddingBlockEnd: space.xs,
  },
  tray: { minBlockSize: practiceLayout.actionHeight },
  pairs: { display: "grid", gridTemplateColumns: practiceLayout.pairColumns, gap: space.md },
  column: { display: "flex", flexDirection: "column", gap: space.md, minInlineSize: space.none },
  pair: {
    inlineSize: "100%",
    blockSize: "auto",
    minBlockSize: practiceLayout.actionHeight,
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    paddingBlock: space.sm,
  },
  token: {
    maxInlineSize: "100%",
    whiteSpace: "normal",
    blockSize: "auto",
    minBlockSize: practiceLayout.actionHeight,
    paddingBlock: space.sm,
    overflowWrap: "anywhere",
  },
  numeric: { display: "flex", flexDirection: "column", gap: space.lg },
  numberTray: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    outlineColor: color.borderFocus,
    outlineStyle: { default: "none", ":has(input:focus-visible)": "solid" },
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
  digits: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
    gap: space.xs,
    minInlineSize: space.none,
  },
  numberKeys: {
    display: "grid",
    gridTemplateColumns: practiceLayout.numberPadColumns,
    gap: space.sm,
    inlineSize: "100%",
    maxInlineSize: practiceLayout.numberPadWidth,
    alignSelf: "center",
  },
  numberKey: { minBlockSize: controlSize.lg, fontSize: fontSize.xl },
  digit: { minInlineSize: controlSize.md, paddingInline: space.sm, fontSize: fontSize.xl },
  edit: { flexShrink: 0 },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: space.sm,
    maxInlineSize: "100%",
  },
});

export interface AnswerInputProps {
  question: Question;
  answer: Answer | null;
  onChange: (answer: Answer | null) => void;
  disabled?: boolean;
  /** Server evaluation, not a local guess. No answer key is sent to the client. */
  correct?: boolean;
  style?: StyleXStyles;
}

/** One question's answer editor. Mount a new editor for each committed turn. */
export function AnswerInput({
  question,
  answer,
  onChange,
  disabled = false,
  correct,
  style,
}: AnswerInputProps) {
  const { t } = useLingui();
  const questionLabelId = useId();
  const [leftId, setLeftId] = useState<string | null>(null);
  const interaction = question.interaction;
  const state = correct === undefined ? "default" : correct ? "correct" : "incorrect";
  let control;
  if (interaction.kind === "choice") {
    const selected = answer?.kind === "choice" ? answer.optionIds : [];
    control = (
      <>
        {interaction.mode === "multiple" && (
          <Text variant="caption" tone="secondary">
            <Trans>Choose all that apply</Trans>
          </Text>
        )}
        {interaction.options.map((option) => (
          <Option
            key={option.id}
            multi={interaction.mode === "multiple"}
            selected={selected.includes(option.id)}
            state={selected.includes(option.id) ? state : "default"}
            onClick={() =>
              onChange({
                kind: "choice",
                optionIds:
                  interaction.mode === "single"
                    ? [option.id]
                    : selected.includes(option.id)
                      ? selected.filter((id) => id !== option.id)
                      : [...selected, option.id],
              })
            }
          >
            <span {...stylex.props(styles.content)}>
              <ContentImages images={option.images} />
              <MarkdownContent markdown={option.value} inline />
            </span>
          </Option>
        ))}
      </>
    );
  } else if (interaction.kind === "text" && interaction.control.kind === "text_input") {
    const value =
      answer?.kind === "text" && answer.response.kind === "text_input" ? answer.response.value : "";
    const limit = interaction.maxLength;
    const tooLong = answerLength(value) > limit;
    control = (
      <Field
        label={t`Your answer`}
        error={tooLong ? t`Use no more than ${limit} characters.` : undefined}
      >
        <TextField
          size="lg"
          cue="typing"
          value={value}
          autoComplete="off"
          readOnly={disabled}
          autoFocus
          invalid={tooLong || correct === false}
          onChange={(event) =>
            onChange({ kind: "text", response: { kind: "text_input", value: event.target.value } })
          }
        />
      </Field>
    );
  } else if (interaction.kind === "number") {
    control = (
      <NumericAnswer answer={answer} disabled={disabled} correct={correct} onChange={onChange} />
    );
  } else if (interaction.kind === "matching") {
    const pairs = answer?.kind === "matching" ? answer.pairs : [];
    control = (
      <div {...stylex.props(styles.pairs)}>
        <div {...stylex.props(styles.column)}>
          {interaction.left.map((item, index) => {
            const paired = pairs.some((pair) => pair.leftId === item.id);
            return (
              <Chip
                key={item.id}
                cue={leftId === item.id ? "deselect" : "select"}
                selected={leftId === item.id || paired}
                state={paired ? state : "default"}
                style={styles.pair}
                onClick={() => setLeftId(leftId === item.id ? null : item.id)}
              >
                <Badge>{index + 1}</Badge>
                <span {...stylex.props(styles.content)}>
                  <ContentImages images={item.images} />
                  <MarkdownContent markdown={item.value} inline />
                </span>
              </Chip>
            );
          })}
        </div>
        <div {...stylex.props(styles.column)}>
          {interaction.right.map((item) => {
            const pair = pairs.find((value) => value.rightId === item.id);
            const number = pair
              ? interaction.left.findIndex((value) => value.id === pair.leftId) + 1
              : null;
            return (
              <Chip
                key={item.id}
                cue={leftId ? "drop" : pair ? "cancel" : "invalid-drop"}
                selected={Boolean(pair)}
                state={pair ? state : "default"}
                style={styles.pair}
                onClick={() => {
                  if (!leftId) {
                    if (pair)
                      onChange({
                        kind: "matching",
                        pairs: pairs.filter((value) => value !== pair),
                      });
                    return;
                  }
                  onChange({
                    kind: "matching",
                    pairs: [
                      ...pairs.filter(
                        (value) => value.leftId !== leftId && value.rightId !== item.id,
                      ),
                      { leftId, rightId: item.id },
                    ],
                  });
                  setLeftId(null);
                }}
              >
                {number !== null && <Badge>{number}</Badge>}
                <span {...stylex.props(styles.content)}>
                  <ContentImages images={item.images} />
                  <MarkdownContent markdown={item.value} inline />
                </span>
              </Chip>
            );
          })}
        </div>
      </div>
    );
  } else if (interaction.kind === "text" && interaction.control.kind === "letter_bank") {
    control = (
      <LetterBank
        letters={interaction.control.letters}
        selected={
          answer?.kind === "text" && answer.response.kind === "letter_bank"
            ? answer.response.letterIds
            : []
        }
        maxLength={interaction.maxLength}
        disabled={disabled}
        correct={correct}
        onChange={(letterIds) =>
          onChange({ kind: "text", response: { kind: "letter_bank", letterIds } })
        }
      />
    );
  } else if (interaction.kind === "ordering") {
    const items = interaction.items;
    const selected = answer?.kind === "ordering" ? answer.itemIds : [];
    const change = (ids: string[]) => onChange({ kind: "ordering", itemIds: ids });
    control = (
      <>
        <Surface tone="warm" padding="md" style={[styles.bank, styles.tray]}>
          {selected.length === 0 && (
            <Text tone="secondary">
              <Trans>Tap tiles to build your answer</Trans>
            </Text>
          )}
          {selected.map((id) => {
            const selectedItem = items.find((candidate) => candidate.id === id)!;
            const value = selectedItem.value;
            return (
              <Chip
                key={id}
                cue="uncheck"
                selected
                state={state}
                aria-label={t`Remove ${value}`}
                style={styles.token}
                onClick={() => change(selected.filter((itemId) => itemId !== id))}
              >
                <span {...stylex.props(styles.content)}>
                  <ContentImages images={selectedItem.images} />
                  <MarkdownContent markdown={selectedItem.value} inline />
                </span>
              </Chip>
            );
          })}
        </Surface>
        <div {...stylex.props(styles.bank)}>
          {items.map((item) => (
            <Chip
              key={item.id}
              cue="check"
              spent={selected.includes(item.id)}
              style={styles.token}
              onClick={() => change([...selected, item.id])}
            >
              <span {...stylex.props(styles.content)}>
                <ContentImages images={item.images} />
                <MarkdownContent markdown={item.value} inline />
              </span>
            </Chip>
          ))}
        </div>
      </>
    );
  }
  return (
    <fieldset
      disabled={disabled}
      aria-labelledby={questionLabelId}
      {...stylex.props(styles.root, style)}
    >
      <ContentImages images={question.images} />
      <MediaAttachments key={question.id} attachments={question.attachments ?? []} />
      <MarkdownContent
        id={questionLabelId}
        markdown={question.questionText}
        style={styles.question}
      />
      {control}
    </fieldset>
  );
}

function NumericAnswer({
  answer,
  onChange,
  disabled = false,
  correct,
}: Pick<AnswerInputProps, "answer" | "onChange" | "disabled" | "correct">) {
  const { t } = useLingui();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const currentValue = answer?.kind === "number" ? answer.value : null;
  const [draft, setDraft] = useState({ text: currentValue?.toString() ?? "", value: currentValue });
  const text = Object.is(draft.value, currentValue) ? draft.text : (currentValue?.toString() ?? "");
  const state = correct === undefined ? "default" : correct ? "correct" : "incorrect";
  const change = useCallback(
    (next: string) => {
      if (disabled) return;
      const normalized = next.replace(",", ".");
      if (!/^-?\d*(?:\.\d*)?$/.test(normalized)) return;
      // A partial sign or decimal point is editable, but cannot be submitted as zero.
      const number = /\d/.test(normalized) ? Number(normalized) : null;
      if (number !== null && !Number.isFinite(number)) return;
      setDraft({ text: normalized, value: number });
      onChange(number === null ? null : { kind: "number", value: number });
    },
    [disabled, onChange],
  );
  const tap = useCallback(
    (next: string) => {
      change(next);
      input.current?.focus({ preventScroll: true });
    },
    [change],
  );
  useEffect(() => {
    const editor = root.current;
    if (!editor || disabled) return;
    const document = editor.ownerDocument;
    const typeNumber = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      const target = event.target;
      if (target === input.current) return;
      if (target instanceof Node && target !== document.body && !editor.contains(target)) return;
      if (/^\d$/.test(event.key) || event.key === "." || event.key === ",") {
        event.preventDefault();
        tap(text + event.key);
      } else if (event.key === "-") {
        event.preventDefault();
        tap(text.startsWith("-") ? text.slice(1) : `-${text}`);
      } else if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        tap(event.key === "Backspace" ? text.slice(0, -1) : "");
      } else if (event.key === "Enter" && target === document.body) {
        event.preventDefault();
        editor.closest("form")?.requestSubmit();
      }
    };
    document.addEventListener("keydown", typeNumber);
    return () => document.removeEventListener("keydown", typeNumber);
  }, [disabled, text, tap]);
  return (
    <div ref={root} {...stylex.props(styles.numeric)}>
      <Surface
        tone="warm"
        padding="md"
        style={[styles.tray, styles.numberTray]}
        onClick={() => input.current?.focus({ preventScroll: true })}
      >
        <VisuallyHidden>
          <input
            ref={input}
            aria-label={t`Your answer`}
            aria-invalid={correct === false || undefined}
            value={text}
            inputMode="none"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            readOnly={disabled}
            onChange={(event) => change(event.target.value)}
          />
        </VisuallyHidden>
        <div {...stylex.props(styles.digits)}>
          {text.length === 0 && (
            <Text tone="secondary">
              <Trans>Type or tap numbers</Trans>
            </Text>
          )}
          {[...text].map((value, index) => (
            <Chip
              // eslint-disable-next-line react/no-array-index-key -- Repeated digits occupy ordered answer positions.
              key={index}
              state={state}
              disabled={disabled}
              cue="uncheck"
              aria-label={t`Remove ${value}`}
              style={styles.digit}
              onClick={() => tap(text.slice(0, index) + text.slice(index + 1))}
            >
              {value}
            </Chip>
          ))}
        </div>
        <IconButton
          icon={XIcon}
          label={t`Clear`}
          variant="ghost"
          disabled={disabled || text.length === 0}
          cue="cancel"
          onClick={() => tap("")}
          style={styles.edit}
        />
        <IconButton
          icon={BackspaceIcon}
          label={t`Backspace`}
          variant="ghost"
          disabled={disabled || text.length === 0}
          cue="uncheck"
          onClick={() => tap(text.slice(0, -1))}
          style={styles.edit}
        />
      </Surface>
      <div role="group" aria-label={t`Number pad`} {...stylex.props(styles.numberKeys)}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "±", "0", "."].map((key) => (
          <Chip
            key={key}
            cue="check"
            disabled={disabled || (key === "." && text.includes("."))}
            aria-label={key === "±" ? t`Change sign` : key === "." ? t`Decimal point` : undefined}
            style={styles.numberKey}
            onClick={() =>
              tap(key === "±" ? (text.startsWith("-") ? text.slice(1) : `-${text}`) : text + key)
            }
          >
            {key}
          </Chip>
        ))}
      </div>
    </div>
  );
}
