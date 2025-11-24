# 🎨 Design System Documentation

Complete guide to the Provably Fair Casino Design System with colors, typography, spacing, and component patterns.

---

## Quick Start

### 1. Color Usage

#### Light Theme (Default)
```tsx
// Primary color - Indigo (trust & technology)
<div className="bg-primary text-primary-foreground">Primary</div>

// Secondary color - Violet (luxury)
<div className="bg-secondary text-secondary-foreground">Secondary</div>

// State colors
<div className="bg-success text-white">Win</div>
<div className="bg-danger text-white">Loss</div>
<div className="bg-warning text-white">Pending</div>
```

#### Dark Theme
Automatically applied when user enables dark mode or system prefers dark.

```tsx
// Automatically adapts to dark theme
<div className="bg-card text-card-foreground">
  Content adapts to theme
</div>
```

### 2. Typography

```tsx
import type { TypographyTokens } from '@/lib/design-tokens';

// Headings
<h1>48px - Main heading</h1>
<h2>36px - Section heading</h2>
<h3>30px - Subsection</h3>
<h4>24px - Card title</h4>

// Body text
<p>16px - Regular paragraph</p>
<small>14px - Secondary text</small>

// Code
<code>Monospace code</code>
```

### 3. Spacing

```tsx
// Uses 8px scale (4px, 8px, 12px, 16px, 20px, 24px, etc.)
<div className="p-4">     {/* 16px padding */}
<div className="gap-6">    {/* 24px gap */}
<div className="m-2">      {/* 8px margin */}
```

### 4. Dark Mode Toggle

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1>Provably Fair Casino</h1>
      <ThemeToggle />  {/* Sun/Moon icon button */}
    </header>
  );
}
```

---

## Color System

### Primary Palette

```
PRIMARY (Indigo) - Trust & Technology
- Used for: Buttons, links, active states, brand elements
- Light: #6366f1 (500)
- Dark: #818cf8 (400)

SECONDARY (Violet) - Luxury & Premium
- Used for: Accents, highlights, premium features
- Light: #a855f7 (500)
- Dark: #d8b4fe (300)
```

### Semantic Colors

```
SUCCESS (Emerald) - Wins & Positive outcomes
- Light: #22c55e
- Dark: #86efac

DANGER (Red) - Losses & Critical states
- Light: #ef4444
- Dark: #f87171

WARNING (Amber) - Caution & Limits
- Light: #f59e0b
- Dark: #fcd34d

INFO (Blue) - Information
- Light: #3b82f6
- Dark: #dbeafe
```

### Gambling-Specific Colors

```
--color-win: #22c55e (Green - winning bets)
--color-loss: #ef4444 (Red - losing bets)
--color-pending: #f59e0b (Amber - pending results)
--color-neutral: #71717a (Gray - neutral state)
```

### Neutral Palette

```
Used for: Text, backgrounds, borders, disabled states
Zinc 50-900 scale for flexibility
```

---

## Typography Scale

### Font Sizes

```
xs:  12px / 16px (labels, hints)
sm:  14px / 20px (secondary text)
base: 16px / 24px (body text) - DEFAULT
lg:  18px / 28px (large text)
xl:  20px / 28px (prominent text)
2xl: 24px / 32px (subheadings)
3xl: 30px / 36px (section headings)
4xl: 36px / 40px (page headings)
5xl: 48px / 48px (hero headings)
```

### Font Weights

```
light: 300 (optional/disabled text)
normal: 400 (body text)
medium: 500 (button labels)
semibold: 600 (subheadings)
bold: 700 (headings)
```

### Line Heights

```
tight: 1.2 (headings)
normal: 1.5 (body text) - DEFAULT
relaxed: 1.75 (comfortable reading)
loose: 2 (accessible reading)
```

---

## Spacing Scale

### Consistent 8px Grid

```
0   = 0
1   = 4px
2   = 8px
3   = 12px
4   = 16px (use for padding, margin)
5   = 20px
6   = 24px (use for component gaps)
8   = 32px (section spacing)
10  = 40px
12  = 48px
16  = 64px
20  = 80px
24  = 96px
```

### Padding Examples

```tsx
// Page/section padding
<div className="p-6 sm:p-8 lg:p-12">
  Content with responsive padding
</div>

// Card padding
<div className="p-4 sm:p-6">
  Card content
</div>

// Compact spacing
<div className="p-2 sm:p-3">
  Dense layout
</div>
```

### Gap Examples

```tsx
// Normal component spacing
<div className="flex gap-4">
  Items with 16px gap
</div>

// Tight spacing
<div className="flex gap-2">
  Items with 8px gap
</div>

// Loose spacing
<div className="space-y-8">
  Vertical spacing 32px apart
</div>
```

---

## Border Radius

```
none:   0
sm:     4px (subtle rounding)
md:     8px (default)
lg:     12px (cards, buttons)
xl:     16px (large elements)
2xl:    20px (hero sections)
3xl:    24px (prominent elements)
full:   9999px (pills, circles)
```

---

## Shadows

### Elevation Levels

```
none:           No shadow
sm:             1px shadow (very subtle)
md:             4px shadow (default) - cards, buttons
lg:             10px shadow (elevated)
xl:             20px shadow (floating)
2xl:            25px shadow (modal)
elevated:       20px shadow
hover-elevation: 25px shadow (on hover)
```

### Usage Examples

```tsx
// Default card
<div className="shadow-md rounded-lg">
  Card with subtle shadow
</div>

// Floating element
<div className="shadow-xl rounded-lg">
  Floating card
</div>

// Hover elevation
<div className="shadow-md hover:shadow-xl transition-shadow">
  Hoverable card
</div>
```

---

## Component Utilities

### Semantic Components

```tsx
import { cn } from '@/lib/utils';

// Card component
<div className="card-elevated">
  Elevated card with border, rounded, shadow
</div>

<div className="card-interactive">
  Interactive card (hover effect)
</div>

// Buttons
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>
<button className="btn-ghost">Ghost Button</button>

// Badges
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>

// Status indicators
<span className="status-indicator status-online">Online</span>
<span className="status-indicator status-offline">Offline</span>
<span className="status-indicator status-away">Away</span>
<span className="status-indicator status-busy">Busy</span>

// Text utilities
<p className="text-muted">Muted text</p>
<p className="text-success">Success message</p>
<p className="text-danger">Error message</p>
<p className="text-truncate">Truncated text...</p>

// Flex utilities
<div className="flex-center">
  Centered both axes
</div>

<div className="flex-between">
  Space between items
</div>

<div className="flex-col-center">
  Centered column
</div>
```

---

## Dark Mode Usage

### Automatic Dark Mode

```tsx
// Theme is automatically applied based on user preference
// No need to add conditions!

<div className="bg-background text-foreground">
  {/* Light: white background, dark text */}
  {/* Dark: dark background, light text */}
</div>
```

### Manual Theme Toggle

```tsx
import { useDarkMode } from '@/hooks/useDarkMode';

export function MyComponent() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <>
      <p>Current mode: {isDark ? 'Dark' : 'Light'}</p>
      <button onClick={toggleDarkMode}>
        Toggle Theme
      </button>
    </>
  );
}
```

### Theme-Specific Styles

```tsx
// Using Tailwind dark: modifier
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content
</div>

// Using CSS variables
<div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
  Content using CSS variables
</div>
```

---

## Responsive Design

### Breakpoints

```
xs: 320px   (mobile)
sm: 640px   (tablet)
md: 768px   (small desktop)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (wide desktop)
```

### Responsive Examples

```tsx
// Mobile first
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  Responsive padding
</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Hide/show on breakpoints
<div className="hidden md:block">
  Only visible on desktop
</div>

<div className="md:hidden">
  Only visible on mobile/tablet
</div>
```

---

## Animations & Transitions

### Built-in Animations

```tsx
// Fade animations
<div className="fade-in">Fades in smoothly</div>
<div className="fade-out">Fades out smoothly</div>

// Slide animations
<div className="slide-in-from-left">Slides from left</div>
<div className="slide-in-from-right">Slides from right</div>
<div className="slide-in-from-top">Slides from top</div>
<div className="slide-in-from-bottom">Slides from bottom</div>

// Scale animation
<div className="scale-in">Scales up while fading in</div>

// Bounce animation
<div className="bounce-subtle">Subtle bounce effect</div>

// Pulse animation
<div className="pulse-subtle">Subtle pulsing opacity</div>
```

### Custom Transitions

```tsx
// Using Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Animated content
</motion.div>

// Using Tailwind transition utility
<button className="transition-all duration-200 hover:scale-105">
  Hover me
</button>
```

---

## Accessibility Features

### Focus Styles

```tsx
// All interactive elements have focus rings
<button className="focus-visible:outline-2 focus-visible:outline-ring">
  Accessible button
</button>
```

### Reduced Motion Support

```tsx
// Automatically respected
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

```
WCAG AA Compliant:
- Primary on white: 4.8:1
- Primary on light bg: 5.0:1
- Text colors meet minimum 4.5:1 contrast ratio
```

---

## Using Design Tokens in TypeScript

```tsx
import { 
  DESIGN_TOKENS,
  getColorValue,
  getSpacing,
  getShadow,
  getTransitionTiming 
} from '@/lib/design-tokens';

// Get color value
const primaryColor = getColorValue('primary', 500); // #6366f1

// Get spacing value
const padding = getSpacing(4); // 16px

// Get shadow
const elevation = getShadow('lg'); // 0 10px 15px...

// Get transition timing
const timing = getTransitionTiming('normal', 'ease-in-out');
// Returns: "200ms cubic-bezier(0.4, 0, 0.2, 1)"
```

---

## Color Utilities

```tsx
import {
  getCSSVariable,
  GAMBLING_COLORS,
  SEMANTIC_COLORS,
  getColorLuminance,
  isLightColor,
  getContrastingTextColor,
  darkenColor,
  lightenColor,
} from '@/lib/color-utils';

// Get CSS variable
const primaryColor = getCSSVariable('--primary');

// Use gambling colors
const winColor = GAMBLING_COLORS.win;
const lossColor = GAMBLING_COLORS.loss;

// Get semantic colors
const successColor = SEMANTIC_COLORS.success;

// Color operations
const isLight = isLightColor('#6366f1'); // false
const textColor = getContrastingTextColor('#6366f1'); // #ffffff
const darker = darkenColor('#6366f1', 20);
const lighter = lightenColor('#6366f1', 20);
```

---

## Component Examples

### Game Result Card

```tsx
export function GameResultCard({ won, amount, multiplier }) {
  return (
    <div className="card-elevated p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Game Result</h3>
        <span className={`badge ${won ? 'badge-success' : 'badge-danger'}`}>
          {won ? 'Win' : 'Loss'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted">Amount</span>
          <span className="font-semibold">${amount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted">Multiplier</span>
          <span className={won ? 'text-success' : 'text-danger'}>
            {multiplier}x
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Settings Panel

```tsx
export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div className="card-elevated p-6">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <span>Enable sound effects</span>
          </label>
          
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <span>Enable haptic feedback</span>
          </label>
        </div>
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Color Usage
- Always use semantic color names (success, danger, warning) over direct colors
- Use CSS variables for consistency across theme changes
- Test color combinations for WCAG AA contrast compliance

### 2. Typography
- Use heading hierarchy (h1 → h6) for semantic HTML
- Match font size to visual hierarchy
- Use appropriate line heights for readability

### 3. Spacing
- Maintain the 8px grid system consistently
- Use responsive spacing (p-4 sm:p-6 lg:p-8)
- Add breathing room around content

### 4. Dark Mode
- Always test components in both light and dark modes
- Use theme-aware colors (bg-card, text-foreground)
- Avoid hardcoded colors when possible

### 5. Accessibility
- Always include focus styles
- Ensure sufficient color contrast (4.5:1 minimum)
- Test with screen readers
- Respect prefers-reduced-motion

---

## Migration Checklist

If updating existing components:

- [ ] Replace hardcoded colors with CSS variables
- [ ] Update typography to use defined scale
- [ ] Adjust spacing to 8px grid
- [ ] Add dark mode support
- [ ] Test focus/hover states
- [ ] Verify color contrast (WCAG AA)
- [ ] Add responsive breakpoints
- [ ] Update component documentation

---

## Further Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Design Systems](https://web.dev/design-systems/)
- [Design Tokens Format](https://design-tokens.github.io/community-group/format/)

---

**Last Updated**: 2025-11-23  
**Version**: 1.0  
**Status**: Production Ready ✅
