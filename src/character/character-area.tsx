import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { regionSceneUrls } from "@edurune/art/assets";
import { useMemo, type ReactNode } from "react";
import type { GetApiCharacterProfileResponse } from "../api/generated/types.gen.ts";
import {
  useCharacterProfileQuery,
  useWalletQuery,
} from "../api/character/use-character-queries.ts";
import { errorMessage } from "../api/error-messages.ts";
import { CharacterPortrait } from "../game/art/character-portrait.tsx";
import { ShopScene } from "../game/art/shop-scene.tsx";
import { CharacterButton } from "./character-button.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Badge } from "../ui/primitives/badge.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { WalletBalance } from "../wallet/wallet-balance.tsx";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  area: { flexShrink: 0, minInlineSize: space.none },
  scene: {
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    blockSize: layout.characterStage,
    overflow: "hidden",
    backgroundColor: color.surfaceWarm,
    borderBlockEndWidth: borderWidth.thick,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color.borderStrong,
  },
  compactScene: { blockSize: layout.homeCharacterStage },
  landscape: {
    position: "absolute",
    inset: space.none,
    inlineSize: layout.full,
    blockSize: layout.full,
    objectFit: "cover",
  },
  character: { position: "relative", width: layout.characterFigure },
  compactCharacter: { width: layout.homeCharacterFigure },
  // The bar spans the scene, so its empty middle must let presses reach the figure behind it.
  toolbar: {
    position: "absolute",
    insetBlockStart: space.lg,
    insetInline: space.lg,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: space.md,
    pointerEvents: "none",
  },
  toolbarGroup: { display: "flex", pointerEvents: "auto" },
  // Tucked against the figure's shoulder, not the far edge of the scene, so the controls
  // read as belonging to the character.
  characterActions: {
    position: "absolute",
    insetInlineStart: `calc(${layout.midpoint} + ${layout.characterFigure} / 2 - ${space.xl})`,
    insetBlockStart: layout.midpoint,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
  },
  compactCharacterActions: {
    insetInlineStart: `calc(${layout.midpoint} + ${layout.homeCharacterFigure} / 2 - ${space.xl})`,
  },
  name: {
    position: "absolute",
    insetInlineStart: space.lg,
    insetBlockEnd: space.md,
    maxInlineSize: `calc(${layout.full} - ${space.xxl})`,
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    backgroundColor: color.surfaceRaised,
  },
  error: { padding: space.lg },
});

/** Server-equipped character and wallet, shared by Home and Me. */
export function CharacterArea({
  name,
  compact = false,
  setting = "forest",
  actions,
  characterActions,
  preview,
  onCharacterClick,
  characterLabel,
  style,
}: {
  name?: ReactNode;
  compact?: boolean;
  /** Shop backgrounds fit into the alcove; other settings use the portrait frame. */
  setting?: "forest" | "shop";
  /** Top corner of the scene, opposite the wallet. */
  actions?: ReactNode;
  /** Controls that act on the figure itself, floated beside it. */
  characterActions?: ReactNode;
  /** Unsaved try-on only. The server profile remains untouched. */
  preview?: Partial<GetApiCharacterProfileResponse["equipped"]>;
  /** Makes the figure a press target; the label says where it leads. */
  onCharacterClick?: () => void;
  characterLabel?: string;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const profile = useCharacterProfileQuery();
  const wallet = useWalletQuery();
  const appearance = profile.data?.appearance;
  const equipped = { ...profile.data?.equipped, ...preview };
  const palette = useMemo(
    () =>
      appearance && {
        skin: appearance.skinTone,
        hair: appearance.hairColor,
        eyes: appearance.eyeColor,
      },
    [appearance],
  );
  const error = profile.error ?? wallet.error;
  const portraitProps = {
    cosmeticIds: Object.entries(equipped)
      .filter(([slot]) => setting !== "shop" || slot !== "background")
      .map(([, id]) => id)
      .filter((id): id is string => typeof id === "string"),
    hairStyle: appearance?.hairStyle ?? "none",
    palette,
    style: [styles.character, compact && styles.compactCharacter],
  };
  return (
    <section aria-label={t`Your character`} {...stylex.props(styles.area, style)}>
      <div {...stylex.props(styles.scene, compact && styles.compactScene)}>
        {setting === "shop" ? (
          <ShopScene backgroundId={equipped.background} style={styles.landscape} />
        ) : !equipped.background ? (
          <img
            src={regionSceneUrls["forest-clearing"]}
            alt=""
            {...stylex.props(styles.landscape)}
          />
        ) : null}
        {profile.data &&
          (onCharacterClick ? (
            <CharacterButton
              {...portraitProps}
              label={characterLabel ?? t`Your character`}
              onClick={onCharacterClick}
            />
          ) : (
            <CharacterPortrait {...portraitProps} label={t`Your character`} />
          ))}
        <div {...stylex.props(styles.toolbar)}>
          <span {...stylex.props(styles.toolbarGroup)}>
            <WalletBalance />
          </span>
          {actions && <span {...stylex.props(styles.toolbarGroup)}>{actions}</span>}
        </div>
        {characterActions && (
          <div
            {...stylex.props(styles.characterActions, compact && styles.compactCharacterActions)}
          >
            {characterActions}
          </div>
        )}
        {name && <Badge style={styles.name}>{name}</Badge>}
      </div>
      {error && (
        <div {...stylex.props(styles.error)}>
          <Alert
            tone="negative"
            action={
              <Button
                variant="secondary"
                cue="retry"
                onClick={() => {
                  void profile.refetch();
                  void wallet.refetch();
                }}
              >{t`Try again`}</Button>
            }
          >
            {t(errorMessage(error))}
          </Alert>
        </div>
      )}
    </section>
  );
}
