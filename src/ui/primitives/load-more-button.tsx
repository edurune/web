import { useEffect, useRef } from "react";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Button } from "./button.tsx";

export interface LoadMoreButtonProps {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  /** Stop automatic retries after a failed page; the button remains usable. */
  autoLoad?: boolean;
  onLoadMore: () => void;
  style?: StyleXStyles;
}

/** Loads when the end control enters its scroll area's visible bounds. */
export function LoadMoreButton({
  children,
  loading = false,
  disabled = false,
  autoLoad = true,
  onLoadMore,
  style,
}: LoadMoreButtonProps) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (
      !autoLoad ||
      loading ||
      disabled ||
      !button.current ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      onLoadMore();
    });
    observer.observe(button.current);
    return () => observer.disconnect();
  }, [autoLoad, loading, disabled, onLoadMore]);
  return (
    <Button
      ref={button}
      variant="secondary"
      fullWidth
      cue="queued"
      loading={loading}
      disabled={disabled}
      onClick={onLoadMore}
      style={style}
    >
      {children}
    </Button>
  );
}
