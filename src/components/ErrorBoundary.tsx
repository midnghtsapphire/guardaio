import React from "react";
import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  title?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Prevents full white-screen crashes by rendering a friendly fallback UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep this as console logging so we can diagnose without breaking UX.
    console.error("ErrorBoundary caught an error:", error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 shadow-card">
            <h1 className="font-display text-xl font-bold">
              {this.props.title ?? "Something went wrong"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The app hit an unexpected error. Reload to continue.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="default" onClick={this.handleReload} className="flex-1">
                Reload
              </Button>
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
                className="flex-1"
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
