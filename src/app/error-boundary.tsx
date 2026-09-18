import * as stylex from "@stylexjs/stylex";
import { Component, type ErrorInfo, type ReactNode } from "react";
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

interface State {
  failed: boolean;
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
  action: {
    backgroundColor: color.accentFill,
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
});

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application failed", error, info.componentStack);
  }

  override render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main {...stylex.props(styles.page)}>
        <div {...stylex.props(styles.panel)}>
          <h1 {...stylex.props(styles.title)}>Something went wrong</h1>
          <p {...stylex.props(styles.message)}>Reload the app and try again.</p>
          <button {...stylex.props(styles.action)} type="button" onClick={this.props.onReload}>
            Reload app
          </button>
        </div>
      </main>
    );
  }
}
