import * as stylex from "@stylexjs/stylex";
import { assetUrl, useApiClient } from "../api/index.ts";
import type { MediaReference } from "../api/generated/types.gen.ts";
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
            ) : attachment.kind === "audio" ? (
              <audio
                src={url}
                controls
                preload="metadata"
                aria-label={attachment.description}
                {...stylex.props(styles.media)}
              />
            ) : (
              <video
                src={url}
                controls
                playsInline
                preload="metadata"
                aria-label={attachment.description}
                {...stylex.props(styles.media)}
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
