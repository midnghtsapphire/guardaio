import { useEffect, useCallback } from "react";

type AnalysisMode = "file" | "batch" | "url" | "reverse" | "audio" | "compare";

interface KeyboardShortcutsOptions {
  onModeChange: (mode: AnalysisMode) => void;
  onToggleHeatmap: () => void;
  onExport: () => void;
  onToggleSensitivity?: () => void;
  disabled?: boolean;
}

const modeMap: Record<string, AnalysisMode> = {
  "1": "file",
  "2": "batch",
  "3": "url",
  "4": "reverse",
  "5": "audio",
  "6": "compare",
};

export const useKeyboardShortcuts = ({
  onModeChange,
  onToggleHeatmap,
  onExport,
  onToggleSensitivity,
  disabled = false,
}: KeyboardShortcutsOptions) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Mode switching (1-6)
      if (modeMap[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onModeChange(modeMap[e.key]);
        return;
      }

      // Toggle heatmap (H)
      if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onToggleHeatmap();
        return;
      }

      // Export PDF (Ctrl+E or Cmd+E)
      if (e.key === "e" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onExport();
        return;
      }

      // Toggle sensitivity panel (S)
      if ((e.key === "s" || e.key === "S") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onToggleSensitivity?.();
        return;
      }
    },
    [disabled, onModeChange, onToggleHeatmap, onExport, onToggleSensitivity]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

export const keyboardShortcutsList = [
  { key: "1", description: "Single File mode" },
  { key: "2", description: "Batch Analysis mode" },
  { key: "3", description: "URL Analysis mode" },
  { key: "4", description: "Reverse Search mode" },
  { key: "5", description: "Voice Detection mode" },
  { key: "6", description: "Compare mode" },
  { key: "H", description: "Toggle heatmap overlay" },
  { key: "S", description: "Toggle sensitivity panel" },
  { key: "Ctrl+E", description: "Export PDF report" },
];
