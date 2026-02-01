import { useEffect, useRef, createContext, useContext, ReactNode } from "react";
import { useTheme } from "next-themes";

interface ThemeTransitionContextType {
  triggerTransition: (x: number, y: number) => void;
}

const ThemeTransitionContext = createContext<ThemeTransitionContextType | null>(null);

export function useThemeTransitionTrigger() {
  return useContext(ThemeTransitionContext);
}

export function ThemeTransitionProvider({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lastTheme = useRef(resolvedTheme);

  useEffect(() => {
    // Create overlay element if it doesn't exist
    if (!overlayRef.current) {
      const overlay = document.createElement("div");
      overlay.id = "theme-transition-overlay";
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(overlay);
      overlayRef.current = overlay;
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.remove();
        overlayRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Add transitioning class when theme changes
    if (lastTheme.current !== resolvedTheme) {
      const html = document.documentElement;
      html.classList.add("theme-transitioning");

      const timeout = setTimeout(() => {
        html.classList.remove("theme-transitioning");
      }, 500);

      lastTheme.current = resolvedTheme;
      return () => clearTimeout(timeout);
    }
  }, [theme, resolvedTheme]);

  const triggerTransition = (x: number, y: number) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Calculate the maximum distance to cover the entire screen
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const maxRadius = Math.sqrt(maxX * maxX + maxY * maxY);

    // Set overlay color based on current theme (opposite of what we're transitioning TO)
    const isDark = document.documentElement.classList.contains("dark");
    overlay.style.background = isDark 
      ? "radial-gradient(circle at var(--tx) var(--ty), transparent var(--r), hsl(210 40% 98%) var(--r))"
      : "radial-gradient(circle at var(--tx) var(--ty), transparent var(--r), hsl(222 47% 6%) var(--r))";
    
    overlay.style.setProperty("--tx", `${x}px`);
    overlay.style.setProperty("--ty", `${y}px`);
    overlay.style.setProperty("--r", "0px");
    overlay.style.opacity = "1";

    // Animate the reveal
    requestAnimationFrame(() => {
      overlay.style.transition = "none";
      overlay.style.setProperty("--r", "0px");
      
      requestAnimationFrame(() => {
        overlay.style.transition = "--r 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        overlay.style.setProperty("--r", `${maxRadius}px`);
        
        setTimeout(() => {
          overlay.style.opacity = "0";
        }, 450);
      });
    });
  };

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
    </ThemeTransitionContext.Provider>
  );
}
