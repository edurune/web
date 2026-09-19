import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import audioUrl from "uisfx/sounds/organic/streaming.mp3?url";
import { ApiProvider } from "../api/api-provider.tsx";
import { createApiClient } from "../api/client.ts";
import { AnswerInput, type AnswerInputProps } from "./answer-input.tsx";
import type { Question } from "./session.ts";

const choice: Question = {
  id: "greeting",
  questionText: "Which phrase means **‘hello’**?",
  images: [],
  difficulty: "easy",
  interaction: {
    kind: "choice",
    mode: "single",
    options: [
      { id: "a", value: "**Hello**", images: [] },
      { id: "b", value: "Goodbye", images: [] },
      { id: "c", value: "Thank you", images: [] },
    ],
  },
};
const meta = {
  title: "Practice/Answer input",
  component: AnswerInput,
  tags: ["autodocs"],
  args: { question: choice, answer: null, disabled: false, onChange: fn() },
  decorators: [
    function WithApi(Story) {
      const [api] = useState(() => {
        const client = {
          ...createApiClient("https://storybook.invalid"),
          buildUrl: () => audioUrl,
        };
        const queryClient = new QueryClient({
          defaultOptions: { queries: { enabled: false, staleTime: Infinity } },
        });
        return { client, queryClient };
      });
      return (
        <ApiProvider {...api}>
          <Story />
        </ApiProvider>
      );
    },
  ],
  render: (args) => (
    <AnswerInteraction
      {...args}
      key={JSON.stringify([args.question, args.answer, args.disabled, args.correct])}
    />
  ),
} satisfies Meta<typeof AnswerInput>;
export default meta;
type Story = StoryObj<typeof meta>;

function AnswerInteraction(props: AnswerInputProps) {
  const [answer, setAnswer] = useState(props.answer);
  return (
    <AnswerInput
      {...props}
      answer={answer}
      onChange={(value) => {
        props.onChange(value);
        setAnswer(value);
      }}
    />
  );
}

export const SingleChoice: Story = {};
export const AudioPrompt: Story = {
  args: {
    question: {
      ...choice,
      questionText: "Listen to the clip. Which phrase do you hear?",
      attachments: [
        {
          assetId: "spoken-greeting",
          kind: "audio",
          description: "Spoken greeting",
        },
      ],
    },
  },
};
export const MultipleChoice: Story = {
  args: {
    question: {
      ...choice,
      questionText: "Choose both polite expressions.",
      interaction: {
        kind: "choice",
        mode: "multiple",
        options: [
          { id: "please", value: "Please", images: [] },
          { id: "morning", value: "Morning", images: [] },
          { id: "thanks", value: "Thank you", images: [] },
        ],
      },
    },
  },
};
export const TypedAnswer: Story = {
  args: {
    question: {
      ...choice,
      questionText: "Type a greeting.",
      interaction: {
        kind: "text",
        maxLength: 30,
        caseSensitive: false,
        control: { kind: "text_input" },
      },
    },
  },
};
export const NumericAnswer: Story = {
  args: {
    question: {
      ...choice,
      questionText: "What is 7 + 5?",
      interaction: { kind: "number" },
    },
  },
};
export const NumericKeyboardAndTiles: Story = {
  args: NumericAnswer.args,
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("textbox");
    const key = (name: string) => canvas.getByRole("button", { name });
    await userEvent.keyboard("0");
    await waitFor(() =>
      expect(args.onChange).toHaveBeenLastCalledWith({ kind: "number", value: 0 }),
    );
    await expect(input).toHaveValue("0");
    await userEvent.click(key("Clear"));
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(null));
    await userEvent.click(key("Change sign"));
    await expect(input).toHaveValue("-");
    await expect(args.onChange).toHaveBeenLastCalledWith(null);
    await userEvent.click(key("1"));
    await userEvent.click(key("Decimal point"));
    await userEvent.click(key("2"));
    await userEvent.click(key("5"));
    await waitFor(() => expect(input).toHaveValue("-1.25"));
    await expect(args.onChange).toHaveBeenLastCalledWith({ kind: "number", value: -1.25 });
    await userEvent.click(key("Remove 2"));
    await expect(input).toHaveValue("-1.5");
    await userEvent.click(key("Backspace"));
    await expect(input).toHaveValue("-1.");
    await userEvent.click(key("Clear"));
    await userEvent.keyboard("2,50x");
    await expect(input).toHaveValue("2.50");
    await expect(args.onChange).toHaveBeenLastCalledWith({ kind: "number", value: 2.5 });
    await userEvent.keyboard("{Backspace}");
    await expect(input).toHaveValue("2.5");
  },
};
export const NumericZero: Story = {
  args: { ...NumericAnswer.args, answer: { kind: "number", value: 0 } },
};
export const NumericNegativeDecimal: Story = {
  args: { ...NumericAnswer.args, answer: { kind: "number", value: -1.25 } },
};
export const NumericCorrect: Story = {
  args: {
    ...NumericAnswer.args,
    answer: { kind: "number", value: 12 },
    disabled: true,
    correct: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox")).toHaveValue("12");
    await Promise.all(canvas.getAllByRole("button").map((button) => expect(button).toBeDisabled()));
  },
};
export const NumericIncorrect: Story = {
  args: {
    ...NumericAnswer.args,
    answer: { kind: "number", value: 6 },
    disabled: true,
    correct: false,
  },
};
export const LetterBank: Story = {
  args: {
    question: {
      ...choice,
      questionText: "Spell ‘hello’.",
      interaction: {
        kind: "text",
        maxLength: 5,
        caseSensitive: false,
        control: {
          kind: "letter_bank",
          letters: [
            { id: "l1", value: "L", images: [] },
            { id: "h", value: "H", images: [] },
            { id: "o", value: "O", images: [] },
            { id: "e", value: "E", images: [] },
            { id: "l2", value: "L", images: [] },
          ],
        },
      },
    },
  },
};
export const LetterBankReadOnly: Story = {
  args: {
    ...LetterBank.args,
    answer: {
      kind: "text",
      response: { kind: "letter_bank", letterIds: ["h", "e", "l1", "l2", "o"] },
    },
    disabled: true,
    correct: true,
  },
};
export const Ordering: Story = {
  args: {
    question: {
      ...choice,
      questionText: "Build a greeting. You won’t need every tile.",
      interaction: {
        kind: "ordering",
        items: [
          { id: "name", value: "name", images: [] },
          { id: "my", value: "My", images: [] },
          { id: "mai", value: "Mai", images: [] },
          { id: "is", value: "is", images: [] },
          { id: "distractor", value: "am", images: [] },
        ],
      },
    },
  },
};
export const Matching: Story = {
  args: {
    question: {
      ...choice,
      questionText: "Match each expression.",
      interaction: {
        kind: "matching",
        left: [
          { id: "hello", value: "Hello", images: [] },
          { id: "thanks", value: "Thank you", images: [] },
          { id: "bye", value: "Goodbye", images: [] },
        ],
        right: [
          { id: "tam-biet", value: "Tạm biệt", images: [] },
          { id: "xin-chao", value: "Xin chào", images: [] },
          { id: "cam-on", value: "Cảm ơn", images: [] },
        ],
      },
    },
  },
};
export const Correct: Story = {
  args: { answer: { kind: "choice", optionIds: ["a"] }, correct: true, disabled: true },
};
export const Incorrect: Story = {
  args: { answer: { kind: "choice", optionIds: ["b"] }, correct: false, disabled: true },
};
