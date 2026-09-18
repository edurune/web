import * as stylex from "@stylexjs/stylex";
import { type ErrorInfo, type ReactNode, useCallback, useEffect, useState } from "react";
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from "react-error-boundary";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { control } from "../ui/tokens/size.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../ui/tokens/text.stylex.ts";

interface Props {
  children: ReactNode;
  onReload: () => void;
}

const styles = stylex.create({
  page: {
    alignItems: "center",
    backgroundColor: color.surfacePage,
    color: color.textPrimary,
    display: "flex",
    fontFamily: font.body,
    justifyContent: "center",
    minHeight: layout.viewport,
    padding: space.xl,
  },
  panel: {
    maxWidth: layout.portrait,
    textAlign: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    margin: 0,
  },
  message: {
    color: color.textSecondary,
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
    marginBlock: space.sm,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
    justifyContent: "center",
    marginTop: space.lg,
  },
  action: {
    borderColor: color.borderStrong,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    color: color.textOnFill,
    cursor: "pointer",
    font: "inherit",
    fontWeight: fontWeight.bold,
    minHeight: control.md,
    paddingBlock: space.sm,
    paddingInline: space.xl,
  },
  primaryAction: {
    backgroundColor: color.accentFill,
  },
  secondaryAction: {
    backgroundColor: color.surfaceRaised,
  },
});

function RecoveryComplete({
  children,
  onComplete,
}: {
  children: ReactNode;
  onComplete: () => void;
}) {
  useEffect(onComplete, [onComplete]);
  return children;
}

function logError(error: unknown, info: ErrorInfo) {
  console.error("Application failed", error, info.componentStack);
}

export function ErrorBoundary({ children, onReload }: Props) {
  const [reloadAvailable, setReloadAvailable] = useState(false);
  const clearReload = useCallback(() => setReloadAvailable(false), []);
  const renderFallback = useCallback(
    (props: FallbackProps) => (
      <ErrorFallback
        {...props}
        onReload={onReload}
        reloadAvailable={reloadAvailable}
        onRetry={() => {
          setReloadAvailable(true);
          props.resetErrorBoundary();
        }}
      />
    ),
    [onReload, reloadAvailable],
  );

  return (
    <ReactErrorBoundary onError={logError} fallbackRender={renderFallback}>
      <RecoveryComplete onComplete={clearReload}>{children}</RecoveryComplete>
    </ReactErrorBoundary>
  );
}

function ErrorFallback({
  onReload,
  onRetry,
  reloadAvailable,
}: FallbackProps & { onReload: () => void; onRetry: () => void; reloadAvailable: boolean }) {
  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.panel)} role="alert">
        <h1 {...stylex.props(styles.title)}>Something went wrong</h1>
        <p {...stylex.props(styles.message)}>
          Try again. If the problem continues, reload the app.
        </p>
        <div {...stylex.props(styles.actions)}>
          <button
            {...stylex.props(styles.action, styles.primaryAction)}
            type="button"
            onClick={onRetry}
          >
            Try again
          </button>
          {reloadAvailable && (
            <button
              {...stylex.props(styles.action, styles.secondaryAction)}
              type="button"
              onClick={onReload}
            >
              Reload app
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
