import { useCallback, useEffect, useRef, type SyntheticEvent } from "react";
import * as stylex from "@stylexjs/stylex";
import { assetUrl, useApiClient } from "../api/index.ts";
import type { MediaReference } from "../api/generated/types.gen.ts";
import { holdAudioFocus } from "../ui/sound/audio-focus.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { Text } from "../ui/primitives/text.tsx";

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.md, minInlineSize: 0 },
  figure: { display: "flex", flexDirection: "column", gap: space.sm, margin: 0 },
  media: { display: "block", inlineSize: "100%", maxInlineSize: "100%", borderRadius: radius.md },
  image: { blockSize: "auto" },
});

export function MediaAttachments({ attachments }: { attachments: MediaReference[] }) {
  const client = useApiClient();
  if (attachments.length === 0) return null;
  return (
    <div {...stylex.props(styles.root)}>
      {attachments.map((attachment) => {
        const url = assetUrl(client, attachment.assetId);
        return (
          <figure key={attachment.assetId} {...stylex.props(styles.figure)}>
            {attachment.kind === "image" ? (
              <img
                src={url}
                alt={attachment.description}
                {...stylex.props(styles.media, styles.image)}
              />
            ) : (
              <PlayableAttachment
                kind={attachment.kind}
                description={attachment.description}
                url={url}
              />
            )}
            <figcaption>
              <Text variant="caption">{attachment.description}</Text>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function PlayableAttachment({
  kind,
  description,
  url,
}: {
  kind: "audio" | "video";
  description: string;
  url: string;
}) {
  const releaseFocus = useRef<(() => void) | null>(null);
  const stopDucking = useCallback(() => {
    releaseFocus.current?.();
    releaseFocus.current = null;
  }, []);
  const syncDucking = useCallback(
    (event: SyntheticEvent<HTMLMediaElement>) => {
      const media = event.currentTarget;
      const audible = !media.paused && !media.ended && !media.muted && media.volume > 0;
      if (audible) releaseFocus.current ??= holdAudioFocus();
      else stopDucking();
    },
    [stopDucking],
  );

  useEffect(() => stopDucking, [stopDucking]);

  const mediaProps = {
    src: url,
    controls: true,
    preload: "metadata" as const,
    "aria-label": description,
    onPlay: syncDucking,
    onPlaying: syncDucking,
    onPause: syncDucking,
    onEnded: stopDucking,
    onAbort: stopDucking,
    onEmptied: stopDucking,
    onError: stopDucking,
    onVolumeChange: syncDucking,
  };

  return kind === "audio" ? (
    <audio {...mediaProps} {...stylex.props(styles.media)} />
  ) : (
    <video {...mediaProps} playsInline {...stylex.props(styles.media)} />
  );
}
