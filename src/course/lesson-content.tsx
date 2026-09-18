import type { StyleXStyles } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { defaultUrlTransform, type UrlTransform } from "react-markdown";
import { assetUrl, useApiClient } from "../api/index.ts";
import { MarkdownContent } from "../ui/primitives/markdown-content.tsx";
import { radius } from "../ui/tokens/radius.stylex.ts";

const styles = stylex.create({
  image: {
    display: "block",
    maxInlineSize: "100%",
    blockSize: "auto",
    borderRadius: radius.lg,
  },
});

const lessonUrlTransform: UrlTransform = (url, _key, node) =>
  node.tagName === "img" && /^asset:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(url)
    ? url
    : defaultUrlTransform(url);

function LessonImage({ src, alt }: ComponentProps<"img">) {
  const client = useApiClient();
  const assetId = src?.match(/^asset:([a-z0-9]+(?:-[a-z0-9]+)*)$/)?.[1];
  return assetId ? (
    <img src={assetUrl(client, assetId)} alt={alt ?? ""} {...stylex.props(styles.image)} />
  ) : null;
}
export interface LessonContentProps {
  markdown: string;
  style?: StyleXStyles;
}
/** Lesson images resolve private uploaded assets; raw HTML remains disabled. */
export function LessonContent({ markdown, style }: LessonContentProps) {
  return (
    <MarkdownContent
      markdown={markdown}
      image={LessonImage}
      urlTransform={lessonUrlTransform}
      style={style}
    />
  );
}
