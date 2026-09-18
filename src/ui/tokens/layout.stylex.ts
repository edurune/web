import * as stylex from "@stylexjs/stylex";

export const layout = stylex.defineVars({
  portrait: "480px",
  full: "100%",
  viewport: "100dvh",
  viewportWidth: "100vw",
  midpoint: "50%",
  badge: "48px",
  notificationBadge: "20px",
  emptyStateIcon: "72px",
  cardSkeleton: "88px",
  courseLandscape: "132px",
  characterStage: "320px",
  characterFigure: "280px",
  homeCharacterStage: "240px",
  modeHeader: "160px",
  homeCharacterFigure: "216px",
  appearanceFigure: "min(216px, 28dvh)",
  navigation: "76px",
  safeTop: "env(safe-area-inset-top, 0px)",
  safeBottom: "env(safe-area-inset-bottom, 0px)",
});
