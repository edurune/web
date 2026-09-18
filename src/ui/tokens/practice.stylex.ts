import * as stylex from "@stylexjs/stylex";

export const practiceLayout = stylex.defineVars({
  actionColumns: "repeat(3, minmax(0, 1fr))",
  enemyStatColumns: "repeat(3, minmax(0, 1fr))",
  pairColumns: "repeat(2, minmax(0, 1fr))",
  numberPadColumns: "repeat(3, minmax(0, 1fr))",
  numberPadWidth: "320px",
  actionHeight: "72px",
  moveIcon: "28px",
  targetLabel: "112px",
  targetRing: "4px",
  compactArena: "min(100cqi, 32dvh)",
  wideArena: "56.25cqi",
  wideArenaWidth: "100cqi",
  sceneRatio: "16 / 9",
  arenaRatio: "16 / 9",
  resourceHeight: "48px",
  logHeight: "52px",
  targetMarker: "24px",
});

export const battleMotion = stylex.defineConsts({
  feedback: "1000ms",
  wave: "1400ms",
});
