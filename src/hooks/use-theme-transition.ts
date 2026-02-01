import { useEffect } from "react";
import { useTheme } from "next-themes";

export function useThemeTransition() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Add transitioning class when theme changes
    const html = document.documentElement;
    html.classList.add("theme-transitioning");

    // Remove the class after transition completes
    const timeout = setTimeout(() => {
      html.classList.remove("theme-transitioning");
    }, 400);

    return () => clearTimeout(timeout);
  }, [theme, resolvedTheme]);
}
