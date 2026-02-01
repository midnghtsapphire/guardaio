/**
 * Accessibility Context for Neuroinclusive Design
 * Implements POUR principles with specific accommodations for:
 * - ADHD: Reduced motion, focus mode, simplified layouts
 * - Autism: Consistent navigation, visual calm, predictable behavior
 * - Dyslexia: OpenDyslexic font, increased letter spacing, line height
 * 
 * References:
 * - 15-20% of world population is neurodivergent
 * - 94.8% of top sites fail WCAG standards
 * - Inaccessible sites lose $6.9B annually
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface A11yPreferences {
  // Visual
  highContrast: boolean;
  darkMode: boolean;
  softMode: boolean; // Sepia/warm tones for reduced eye strain
  
  // Motion & Cognitive
  reduceMotion: boolean;
  focusMode: boolean; // Reading mask that dims surrounding content
  
  // Typography
  dyslexiaFont: boolean;
  largeText: boolean;
  
  // Audio
  screenReaderOptimized: boolean;
  
  // Persistence
  togglePreference: (key: keyof Omit<A11yPreferences, 'togglePreference' | 'resetAll' | 'getActiveCount'>) => void;
  resetAll: () => void;
  getActiveCount: () => number;
}

const defaultPreferences = {
  highContrast: false,
  darkMode: false,
  softMode: false,
  reduceMotion: false,
  focusMode: false,
  dyslexiaFont: false,
  largeText: false,
  screenReaderOptimized: false,
};

const AccessibilityContext = createContext<A11yPreferences | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState(defaultPreferences);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('a11y-prefs');
      if (saved) {
        setPrefs(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {
      console.warn('Failed to load accessibility preferences:', e);
    }

    // Check system preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    
    if (motionQuery.matches) {
      setPrefs(p => ({ ...p, reduceMotion: true }));
    }
    if (contrastQuery.matches) {
      setPrefs(p => ({ ...p, highContrast: true }));
    }

    // Listen for system preference changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefs(p => ({ ...p, reduceMotion: e.matches }));
    };
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPrefs(p => ({ ...p, highContrast: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Apply classes to document body
  useEffect(() => {
    const body = document.body;
    
    body.classList.toggle('a11y-high-contrast', prefs.highContrast);
    body.classList.toggle('a11y-reduce-motion', prefs.reduceMotion);
    body.classList.toggle('a11y-dyslexia-font', prefs.dyslexiaFont);
    body.classList.toggle('a11y-focus-mode', prefs.focusMode);
    body.classList.toggle('a11y-soft-mode', prefs.softMode);
    body.classList.toggle('a11y-large-text', prefs.largeText);
    body.classList.toggle('a11y-sr-optimized', prefs.screenReaderOptimized);

    // Set CSS custom property for focus mode overlay
    if (prefs.focusMode) {
      document.documentElement.style.setProperty('--focus-mode-opacity', '0.7');
    } else {
      document.documentElement.style.setProperty('--focus-mode-opacity', '0');
    }
  }, [prefs]);

  const togglePreference = useCallback((key: keyof typeof defaultPreferences) => {
    setPrefs(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      localStorage.setItem('a11y-prefs', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const resetAll = useCallback(() => {
    setPrefs(defaultPreferences);
    localStorage.removeItem('a11y-prefs');
  }, []);

  const getActiveCount = useCallback(() => {
    return Object.values(prefs).filter(v => v === true).length;
  }, [prefs]);

  return (
    <AccessibilityContext.Provider value={{ ...prefs, togglePreference, resetAll, getActiveCount }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): A11yPreferences => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
