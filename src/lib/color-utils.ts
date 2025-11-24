/**
 * Color Utility Functions
 * Helpers for working with CSS variables and color values
 */

/**
 * Get a CSS variable value from root
 */
export function getCSSVariable(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Get gambling-specific colors
 */
export const GAMBLING_COLORS = {
  win: 'var(--color-win)',
  loss: 'var(--color-loss)',
  pending: 'var(--color-pending)',
  neutral: 'var(--color-neutral)',
} as const;

/**
 * Get semantic colors
 */
export const SEMANTIC_COLORS = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--destructive)',
  info: 'var(--info)',
  muted: 'var(--muted)',
} as const;

/**
 * Convert RGB string to hex color
 */
export function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get RGB values from a color
 * Supports CSS variables, hex, and rgb formats
 */
export function getColorRGB(color: string): { r: number; g: number; b: number } | null {
  // If it's a CSS variable, get the actual value
  if (color.startsWith('var(')) {
    const varName = color.slice(4, -1);
    color = getCSSVariable(varName);
  }

  // Try to parse as hex
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }

  // Try to parse as rgb/rgba
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }

  return null;
}

/**
 * Calculate luminance of a color (for text contrast)
 * Uses relative luminance formula from WCAG
 */
export function getColorLuminance(color: string): number {
  const rgb = getColorRGB(color);
  if (!rgb) return 0.5;

  const { r, g, b } = rgb;

  // Convert to 0-1 range
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Apply gamma correction
  const rLinear = rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gLinear = gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bLinear = bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determine if a color is light or dark
 * Returns true if the color is light, false if dark
 */
export function isLightColor(color: string): boolean {
  const luminance = getColorLuminance(color);
  return luminance > 0.5;
}

/**
 * Get a contrasting text color (black or white) for a background
 */
export function getContrastingTextColor(backgroundColor: string): string {
  const isLight = isLightColor(backgroundColor);
  return isLight ? '#000000' : '#ffffff';
}

/**
 * Darken a color by a percentage
 */
export function darkenColor(color: string, percent: number): string {
  const rgb = getColorRGB(color);
  if (!rgb) return color;

  const factor = 1 - percent / 100;
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Lighten a color by a percentage
 */
export function lightenColor(color: string, percent: number): string {
  const rgb = getColorRGB(color);
  if (!rgb) return color;

  const factor = 1 + percent / 100;
  const r = Math.min(255, Math.round(rgb.r * factor));
  const g = Math.min(255, Math.round(rgb.g * factor));
  const b = Math.min(255, Math.round(rgb.b * factor));

  return `rgb(${r}, ${g}, ${b})`;
}
