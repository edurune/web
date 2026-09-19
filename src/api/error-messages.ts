import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { ApiError } from "./generated/types.gen.ts";

export const businessErrorMessages = {
  unauthenticated: msg`Log in to continue.`,
  forbidden_origin: msg`This request isn’t allowed. Reload the app and try again.`,
  invalid_request: msg`Check your input and try again.`,
  not_found: msg`This content is no longer available.`,
  internal_error: msg`Something went wrong. Please try again.`,
  unknown_course: msg`This course is no longer available.`,
  wrong_course: msg`This item belongs to another course.`,
  unknown_equipment: msg`This equipment is no longer available.`,
  not_for_sale: msg`This item isn’t for sale.`,
  already_owned: msg`You already own this item.`,
  insufficient_medals: msg`You don’t have enough medals.`,
  equipment_not_owned: msg`You don’t own this equipment.`,
  conflicting_skill: msg`This equipment has a conflicting skill. Choose another item.`,
  balance_overflow: msg`Your balance can’t accept this reward. Please try again later.`,
  invalid_course_cursor: msg`The course list changed. Refresh to continue.`,
  invalid_course_age_range: msg`Choose a valid learner age range.`,
  invalid_course_biome_configuration: msg`Choose an available unit biome and try again.`,
  invalid_course_map_configuration: msg`Check the unit map layout and try again.`,
  not_lesson: msg`This activity isn’t a lesson.`,
  unknown_item: msg`This activity is no longer available.`,
  item_locked: msg`Complete the previous activities to unlock this one.`,
  incompatible_completion: msg`This activity has changed. Reload it to continue.`,
  battle_finished: msg`This battle has already ended.`,
  stale_turn: msg`The battle moved on. Refresh to see the current turn.`,
  invalid_actor: msg`It isn’t this character’s turn.`,
  invalid_target: msg`Choose an available target.`,
  unknown_skill: msg`This skill is no longer available.`,
  insufficient_mana: msg`You don’t have enough mana.`,
  practice_unavailable: msg`This practice is temporarily unavailable.`,
  wrong_question: msg`The question changed. Reload it to continue.`,
  incompatible_answer: msg`The question changed. Reload it to continue.`,
  invalid_selection: msg`Check your selection and try again.`,
  answer_too_long: msg`Your answer is too long.`,
  unknown_session: msg`This practice session is no longer available.`,
  not_practice: msg`This activity isn’t a practice.`,
  stale_revision: msg`Your session changed. Refresh to continue.`,
  unexpected_phase: msg`Your session changed. Refresh to continue.`,
  action_unavailable: msg`Choose an available action.`,
  unknown_cosmetic: msg`This cosmetic is no longer available.`,
  cosmetic_not_for_sale: msg`This item isn’t for sale.`,
  cosmetic_already_owned: msg`You already own this item.`,
  cosmetic_not_owned: msg`You don’t own this cosmetic.`,
  unknown_hair_style: msg`Choose an available hairstyle.`,
  insufficient_funds: msg`You don’t have enough currency for this purchase.`,
  encounter_unavailable: msg`This encounter is temporarily unavailable.`,
  unknown_objective: msg`This objective is no longer available.`,
  incomplete_objective: msg`Complete the objective before claiming its reward.`,
  daily_reward_day_changed: msg`A new day has started. Refresh to claim today’s reward.`,
  unknown_asset: msg`This media is no longer available.`,
  registered_account_required: msg`Create an account to author content.`,
  email_verification_required: msg`Verify your email to author content.`,
  unknown_authored_content: msg`This content is unavailable or belongs to another author.`,
  invalid_authored_content: msg`Check your content and its question and media references.`,
  invalid_upload: msg`Choose a supported media file within the upload limits.`,
  unknown_upload: msg`This media is no longer available.`,
  upload_not_ready: msg`This upload is not ready yet. Try again shortly.`,
  upload_unavailable: msg`Media uploads are temporarily unavailable.`,
  upload_quota_exceeded: msg`You have reached your upload limit.`,
  asset_in_use: msg`This media is attached to learning content and cannot be deleted.`,
} satisfies Record<ApiError["code"], MessageDescriptor>;

// Authentication routes are owned by the auth provider and excluded from OpenAPI.
const authErrorMessages: Record<string, MessageDescriptor> = {
  INVALID_EMAIL_OR_PASSWORD: msg`The email or password is incorrect.`,
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: msg`An account with this email already exists. Try logging in.`,
  USER_ALREADY_EXISTS: msg`An account with this email already exists. Try logging in.`,
  PASSWORD_TOO_SHORT: msg`Use at least 8 characters for your password.`,
  PASSWORD_TOO_LONG: msg`Use no more than 128 characters for your password.`,
  TOO_MANY_REQUESTS: msg`Too many attempts. Please wait and try again.`,
  MISSING_RESPONSE: msg`Complete verification and try again.`,
  VERIFICATION_FAILED: msg`Verification failed. Please try again.`,
  UNKNOWN_ERROR: msg`Something went wrong. Please try again.`,
};

export function isUnauthenticated(error: unknown): boolean {
  return Boolean(
    error && typeof error === "object" && "code" in error && error.code === "unauthenticated",
  );
}

/** Translate at the alert or toast call site; never display server-provided prose. */
export function errorMessage(error: unknown): MessageDescriptor {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    if (Object.hasOwn(businessErrorMessages, error.code))
      return businessErrorMessages[error.code as ApiError["code"]];
    if (Object.hasOwn(authErrorMessages, error.code)) return authErrorMessages[error.code]!;
  }
  return msg`Couldn’t complete the request. Check your connection and try again.`;
}
