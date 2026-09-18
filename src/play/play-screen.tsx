import { backgroundUrls } from "@edurune/art/assets";
import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { Button } from "../ui/primitives/button.tsx";
import { Dialog, DialogClose } from "../ui/primitives/dialog.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  scroll: { flex: 1, minBlockSize: space.none },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    padding: space.lg,
    paddingBlockEnd: space.xl,
  },
  header: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    blockSize: layout.modeHeader,
    overflow: "hidden",
    backgroundColor: color.surfaceWarm,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: borderWidth.thick,
    borderBlockEndColor: color.borderStrong,
  },
  headerArt: {
    position: "absolute",
    inset: space.none,
    inlineSize: layout.full,
    blockSize: layout.full,
    objectFit: "cover",
  },
  title: { position: "relative", paddingInline: space.lg },
  card: { overflow: "hidden" },
  art: { display: "block", inlineSize: layout.full, blockSize: "auto" },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    padding: space.lg,
  },
  dungeon: { backgroundColor: color.infoSoft },
  action: { marginBlockStart: space.xs },
});

export function PlayScreen() {
  const { t } = useLingui();
  const modes = [
    {
      id: "versus",
      title: t`Versus`,
      description: t`Face off against other players. May the sharpest mind win.`,
      artwork: backgroundUrls["versus-faceoff"],
      action: t`Enter Versus`,
    },
    {
      id: "infinite-dungeon",
      title: t`Infinite Dungeon`,
      description: t`Fight your way through an endless dungeon and see how deep your knowledge goes.`,
      artwork: backgroundUrls["infinite-dungeon-entry"],
      action: t`Enter the dungeon`,
    },
  ];

  return (
    <main {...stylex.props(styles.page)}>
      <ScrollArea label={t`Game modes`} indicator="none" style={styles.scroll}>
        <header {...stylex.props(styles.header)}>
          <img
            src={backgroundUrls["mode-banner"]}
            alt=""
            width="960"
            height="540"
            {...stylex.props(styles.headerArt)}
          />
          <Text as="h1" variant="title" style={styles.title}>
            <Trans>Challenges</Trans>
          </Text>
        </header>
        <div {...stylex.props(styles.content)}>
          {modes.map((mode) => (
            <Surface
              key={mode.id}
              as="article"
              aria-labelledby={`${mode.id}-title`}
              tone="warm"
              depth="lifted"
              padding="none"
              corner="xl"
              style={[styles.card, mode.id === "infinite-dungeon" && styles.dungeon]}
            >
              <img
                src={mode.artwork}
                alt=""
                width="960"
                height="540"
                {...stylex.props(styles.art)}
              />
              <div {...stylex.props(styles.details)}>
                <Text as="h2" variant="heading" id={`${mode.id}-title`}>
                  {mode.title}
                </Text>
                <Text tone="secondary">{mode.description}</Text>
                <Dialog
                  title={t`Coming soon`}
                  description={t`This mode is not available yet.`}
                  trigger={
                    <Button
                      variant="secondary"
                      fullWidth
                      iconEnd={ArrowRightIcon}
                      style={styles.action}
                    >
                      {mode.action}
                    </Button>
                  }
                  footer={
                    <DialogClose
                      render={
                        <Button fullWidth>
                          <Trans>Got it</Trans>
                        </Button>
                      }
                    />
                  }
                />
              </div>
            </Surface>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
