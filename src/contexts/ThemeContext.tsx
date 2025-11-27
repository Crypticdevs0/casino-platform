import { createContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { diceTheme } from '@/themes/dice';
import { plinkoTheme } from '@/themes/plinko';
import { rouletteTheme } from '@/themes/roulette';
import { zenTheme } from '@/themes/zen';
import { slotsTheme } from '@/themes/slots';

const themes = {
  dice: diceTheme,
  plinko: plinkoTheme,
  roulette: rouletteTheme,
  slots: slotsTheme,
  zen: zenTheme,
  default: diceTheme,
};

type ThemeName = keyof typeof themes;

interface ThemeContextType {
  theme: typeof diceTheme;
  setTheme: (name: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('default');

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  const theme = useMemo(() => themes[themeName] || themes.default, [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
