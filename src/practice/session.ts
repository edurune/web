import { msg } from "@lingui/core/macro";
import type { SessionView, SubmitAnswerCommand } from "../api/generated/types.gen.ts";
export { enemyMetadata, skillMetadata } from "../game/art/catalog.ts";

export type ActionPhase = Extract<SessionView["phase"], { kind: "awaiting_action" }>;
export type AnswerPhase = Extract<SessionView["phase"], { kind: "awaiting_answer" }>;
export type ActionOption = ActionPhase["actions"][number];
export type Question = AnswerPhase["question"];
export type Answer = SubmitAnswerCommand["submission"]["answer"];
export const actionLabels = { attack: msg`Attack`, defend: msg`Defend`, skill: msg`Skill` };
export const targetLabels = {
  self: msg`Self`,
  single_enemy: msg`One enemy`,
  all_enemies: msg`All enemies`,
  all_allies: msg`All allies`,
};
export function actionKey(action: ActionOption["action"]): string {
  return action.kind === "skill" ? action.skillId : action.kind;
}
export function skillIcon(skill: SessionView["combatants"][number]["skills"][number]): string {
  const effect = skill.effects[0];
  if (!effect) return "icon-action-skill";
  return effect.kind === "modify_stat"
    ? `icon-status-${effect.stat === "maxHealth" ? "max-health" : effect.stat}-${effect.amount < 0 ? "down" : "up"}`
    : `icon-effect-${effect.kind}`;
}

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
export const answerLength = (value: string) => [...graphemes.segment(value)].length;

/** Readiness only; the server owns validity and grading. Ordering may include distractors. */
export function answerReady(question: Question, answer: Answer | null): boolean {
  if (!answer) return false;
  switch (answer.kind) {
    case "choice":
      return answer.optionIds.length > 0;
    case "matching":
      return (
        question.interaction.kind === "matching" &&
        answer.pairs.length === question.interaction.left.length
      );
    case "ordering":
      return answer.itemIds.length > 0;
    case "number":
      return question.interaction.kind === "number" && Number.isFinite(answer.value);
    case "text": {
      if (question.interaction.kind !== "text") return false;
      const control = question.interaction.control;
      const response = answer.response;
      const value =
        response.kind === "text_input"
          ? response.value
          : control.kind === "letter_bank"
            ? response.letterIds
                .map((id) => control.letters.find((letter) => letter.id === id)?.value ?? "")
                .join("")
            : "";
      return value.trim().length > 0 && answerLength(value) <= question.interaction.maxLength;
    }
  }
}
