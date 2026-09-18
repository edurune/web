import type { CharacterView, SessionView } from "../api/generated/types.gen.ts";
export type Rarity = CharacterView["cosmetics"][number]["cosmetic"]["rarity"];

export type Difficulty = SessionView["encounter"]["difficulty"];

export type CurrencyKind = "coin" | "gem" | "medal";

export type ResourceKind = "health" | "mana" | "shield" | "progress";

export type Tone = "neutral" | "accent" | "positive" | "negative" | "caution" | "info";

export type Size = "sm" | "md" | "lg";
