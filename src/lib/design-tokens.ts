/**
 * Design Tokens
 * Centralized definitions for colors, typography, spacing, and other design values
 */

export const DESIGN_TOKENS = {
  // ===== COLORS =====
  // Brand colors - Casino specific
  colors: {
    // Primary: Trust & Technology (Indigo)
    primary: {
      50: '#f0f4ff',
      100: '#e0e9ff',
      200: '#c7d5ff',
      300: '#a8b5ff',
      400: '#8b9eff',
      500: '#6366f1', // Primary
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },

    // Secondary: Luxury & Premium (Violet)
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Secondary
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },

    // Success: Wins & Positive (Emerald)
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Success
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#145231',
    },

    // Danger: Losses & Critical (Red)
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Danger
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Warning: Caution & Limits (Amber)
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    // Info: Information (Blue)
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Info
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Neutrals (Zinc)
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1a6',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
  },

  // ===== SEMANTIC COLORS =====
  semantic: {
    // Gambling outcomes
    gambling: {
      win: 'rgb(34 197 94)', // green-500
      loss: 'rgb(239 68 68)', // red-500
      pending: 'rgb(249 115 22)', // orange-500
      neutral: 'rgb(113 113 122)', // zinc-500
    },

    // UI states
    states: {
      success: 'rgb(34 197 94)', // green-500
      error: 'rgb(239 68 68)', // red-500
      warning: 'rgb(245 158 11)', // amber-500
      info: 'rgb(59 130 246)', // blue-500
    },

    // Interactive
    interactive: {
      default: 'rgb(99 102 241)', // indigo-500
      hover: 'rgb(79 70 229)', // indigo-600
      active: 'rgb(67 56 202)', // indigo-700
      disabled: 'rgb(209 213 219)', // gray-300
    },
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Roboto"',
        '"Oxygen"',
        '"Ubuntu"',
        '"Cantarell"',
        '"Fira Sans"',
        '"Droid Sans"',
        '"Helvetica Neue"',
        'sans-serif',
      ],
      mono: [
        'source-code-pro',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Courier New"',
        'monospace',
      ],
      display: [
        '"Inter Display"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ],
    },

    // Font sizes (in px and rem)
    fontSize: {
      xs: ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
      sm: ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
      base: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
      lg: ['18px', { lineHeight: '28px', letterSpacing: '0' }],
      xl: ['20px', { lineHeight: '28px', letterSpacing: '-0.5px' }],
      '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.5px' }],
      '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-1px' }],
      '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-1px' }],
      '5xl': ['48px', { lineHeight: '48px', letterSpacing: '-2px' }],
    },

    // Font weights
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    // Letter spacing
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ===== SPACING =====
  spacing: {
    // 8px scale (base unit)
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // ===== SHADOWS =====
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

    // Elevated/floating effects
    elevated: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
    'hover-elevation': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

    // Inner shadows
    'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'inner-md': 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },

  // ===== Z-INDEX LAYERS =====
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    'modal-backdrop': 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },

  // ===== TRANSITIONS =====
  transitions: {
    // Durations
    duration: {
      fastest: 100,
      fast: 150,
      normal: 200,
      slow: 300,
      slower: 500,
      slowest: 700,
    },

    // Easing functions
    easing: {
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      'ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      'ease-spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ===== LAYER SYSTEM =====
  layers: {
    reset: 'reset',
    base: 'base',
    theme: 'theme',
    components: 'components',
    utilities: 'utilities',
  },
} as const;

// ===== TYPE EXPORTS =====
export type ColorTokens = typeof DESIGN_TOKENS.colors;
export type SemanticTokens = typeof DESIGN_TOKENS.semantic;
export type TypographyTokens = typeof DESIGN_TOKENS.typography;
export type SpacingTokens = typeof DESIGN_TOKENS.spacing;

/**
 * Color utility: Convert RGBA to CSS variable
 */
export function getColorValue(
  palette: keyof typeof DESIGN_TOKENS.colors,
  shade: string | number = 500
): string {
  const color = DESIGN_TOKENS.colors[palette as never] as Record<
    string | number,
    string
  > | undefined;
  if (!color) return '';
  return color[shade] || '';
}

/**
 * Get spacing value
 */
export function getSpacing(value: keyof typeof DESIGN_TOKENS.spacing): string {
  return DESIGN_TOKENS.spacing[value];
}

/**
 * Get shadow value
 */
export function getShadow(
  key: keyof typeof DESIGN_TOKENS.shadows
): string {
  return DESIGN_TOKENS.shadows[key];
}

/**
 * Get transition timing
 */
export function getTransitionTiming(
  duration: keyof typeof DESIGN_TOKENS.transitions.duration,
  easing: keyof typeof DESIGN_TOKENS.transitions.easing = 'ease-in-out'
): string {
  return `${DESIGN_TOKENS.transitions.duration[duration]}ms ${DESIGN_TOKENS.transitions.easing[easing]}`;
}
