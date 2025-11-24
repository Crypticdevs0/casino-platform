import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * ThemeToggle - Button to switch between light and dark modes
 */
export function ThemeToggle({
  className,
  variant = 'ghost',
  size = 'icon',
}: ThemeToggleProps) {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <Button
      onClick={toggleDarkMode}
      variant={variant}
      size={size}
      className={className}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform" />
      ) : (
        <Moon className="h-5 w-5 transition-transform" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
