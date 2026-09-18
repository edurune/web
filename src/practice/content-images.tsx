import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { assetUrl, useApiClient } from "../api/index.ts";
import type { Question } from "./session.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";

type ImageReference = Question["images"][number];

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    maxInlineSize: "100%",
  },
  image: {
    display: "block",
    maxInlineSize: "100%",
    blockSize: "auto",
    borderRadius: radius.md,
  },
});

export interface ContentImagesProps {
  images: ImageReference[];
  style?: StyleXStyles;
}

export function ContentImages({ images, style }: ContentImagesProps) {
  const client = useApiClient();
  if (images.length === 0) return null;
  return (
    <span {...stylex.props(styles.root, style)}>
      {images.map((image) => (
        <img
          key={image.assetId}
          src={assetUrl(client, image.assetId)}
          alt={image.alternativeText}
          {...stylex.props(styles.image)}
        />
      ))}
    </span>
  );
}
