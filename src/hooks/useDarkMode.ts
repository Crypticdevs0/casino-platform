import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface UseDarkModeReturn {
  isDark: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
}

/**
 * Hook for managing dark mode / light mode theme
 * Persists preference to localStorage and respects system preference
 */
export function useDarkMode(): UseDarkModeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored;
    }

    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'system';
    }

    return 'light';
  });

  const [isDark, setIsDark] = useState(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // system theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update DOM when theme changes
  useEffect(() => {
    const applyTheme = (darkMode: boolean) => {
      const html = document.documentElement;

      if (darkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }

      // Store preference
      localStorage.setItem('theme', theme);

      setIsDark(darkMode);
    };

    if (theme === 'system') {
      // Listen to system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);

      // Apply current system preference
      applyTheme(mediaQuery.matches);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      // Apply explicit light/dark theme
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleDarkMode = () => {
    setThemeState((prev) => {
      if (prev === 'system') {
        return isDark ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  return {
    isDark,
    theme,
    setTheme,
    toggleDarkMode,
  };
}
