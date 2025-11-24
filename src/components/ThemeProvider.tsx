import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

const themeKeyToCssVar: Record<string, string> = {
  background: 'background',
  text: 'foreground',
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  success: 'success',
  danger: 'destructive',
  border: 'border',
  card: 'card',
};

export function ThemeProvider({ children }: { children: React.Node }) {
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    if (themeContext && themeContext.theme) {
      const { theme } = themeContext;
      const root = document.documentElement;

      Object.entries(theme.colors).forEach(([name, value]) => {
        const cssVarName = themeKeyToCssVar[name];
        if (cssVarName) {
          root.style.setProperty(`--${cssVarName}`, value);
        }
      });

      Object.entries(theme.styles).forEach(([name, value]) => {
        root.style.setProperty(`--style-${name}`, value);
      });
    }
  }, [themeContext]);

  useEffect(() => {
    // This part handles the base dark/light mode switching.
    // The game-specific theme colors will override the base colors.
    const initializeTheme = () => {
      const stored = localStorage.getItem('theme');
      const isDark =
        stored === 'dark' ||
        (stored !== 'light' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    initializeTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme');
      if (stored === 'system' || !stored) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
}
