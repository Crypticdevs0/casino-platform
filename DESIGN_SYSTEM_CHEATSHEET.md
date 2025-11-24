# 🎨 Design System Cheat Sheet

Quick reference guide for the Casino Design System.

---

## Colors

### Quick Color Reference

```tsx
// Semantic colors
bg-primary          // Primary action (indigo)
bg-secondary        // Secondary action (violet)
bg-success          // Win/positive (green)
bg-danger           // Loss/error (red)
bg-warning          // Caution (amber)
bg-info             // Information (blue)
bg-muted            // Neutral/disabled (gray)

// Foreground text colors
text-primary-foreground     // White on primary
text-secondary-foreground   // White on secondary
text-success                // Green text
text-danger                 // Red text
text-warning                // Amber text
text-muted-foreground       // Gray text
```

### Dark Mode Automatic

✅ **No extra work needed!** Colors automatically adapt to dark theme.

```tsx
// This works in both light and dark modes
<div className="bg-card text-foreground">
  Automatically adapts to theme
</div>
```

---

## Typography

### Heading Sizes

```tsx
<h1>Main heading (48px)</h1>
<h2>Section heading (36px)</h2>
<h3>Subsection (30px)</h3>
<h4>Card title (24px)</h4>
<h5>Subtitle (20px)</h5>
<h6>Small heading (18px)</h6>
```

### Font Weight Classes

```tsx
font-light      // 300 - subtle
font-normal     // 400 - body text
font-medium     // 500 - emphasis
font-semibold   // 600 - subheadings
font-bold       // 700 - headings
```

### Line Height

```tsx
leading-tight    // 1.2 - headings
leading-normal   // 1.5 - body (default)
leading-relaxed  // 1.75
leading-loose    // 2 - accessible
```

---

## Spacing (8px Grid)

### Quick Reference

```
p-1   = 4px     p-6   = 24px    p-20  = 80px
p-2   = 8px     p-8   = 32px    p-24  = 96px
p-3   = 12px    p-10  = 40px
p-4   = 16px    p-12  = 48px
p-5   = 20px    p-16  = 64px
```

### Responsive Spacing

```tsx
// Mobile/Tablet/Desktop
<div className="p-4 sm:p-6 lg:p-8">
  Responsive padding
</div>

// Mobile optimized
<div className="px-3 py-2 sm:px-4 sm:py-3">
  Padding that scales
</div>
```

### Gap Spacing

```tsx
<div className="flex gap-2">    {/* 8px gap */}
<div className="flex gap-4">    {/* 16px gap */}
<div className="flex gap-6">    {/* 24px gap */}
<div className="space-y-4">     {/* 16px vertical gap */}
```

---

## Shadows

### Elevation Levels

```tsx
shadow-none      // No shadow
shadow-sm        // 1px (buttons)
shadow-md        // 4px (cards, default)
shadow-lg        // 10px (elevated)
shadow-xl        // 20px (floating)
shadow-2xl       // 25px (modal)
```

### Hover Elevation

```tsx
<div className="shadow-md hover:shadow-lg transition-shadow">
  Elevates on hover
</div>
```

---

## Rounded Corners

```tsx
rounded-none     // 0
rounded-sm       // 4px
rounded-md       // 8px
rounded          // 8px (default)
rounded-lg       // 12px
rounded-xl       // 16px
rounded-2xl      // 20px
rounded-full     // 9999px (circles)
```

---

## Buttons & States

### Button Classes

```tsx
btn-primary      // Primary button
btn-secondary    // Secondary button
btn-outline      // Outline button
btn-ghost        // Ghost button

// Or use shadcn components
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button disabled>Disabled</Button>
```

### Interactive States

```tsx
// Hover
hover:bg-primary/90

// Active/Pressed
active:bg-primary/75

// Focus
focus-visible:outline-2 focus-visible:outline-ring

// Disabled
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## Badges

```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
```

---

## Cards

### Basic Card

```tsx
<div className="card-elevated p-4">
  Card content
</div>

// or with shadcn component
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Interactive Card

```tsx
<div className="card-interactive p-4 cursor-pointer">
  Clickable card with hover effect
</div>
```

---

## Dark Mode

### Toggle Theme

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

<ThemeToggle />  // Sun/Moon icon button
```

### Use Theme State

```tsx
import { useDarkMode } from '@/hooks/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();
```

### CSS Variables in Components

```tsx
// These automatically adapt to theme
--background         // Page background
--foreground         // Text color
--card              // Card background
--primary           // Primary color
--success           // Win/positive
--danger            // Loss/error
```

---

## Flex & Grid

### Flex Utilities

```tsx
flex-center        // Center both axes
flex-between       // Space between
flex-col-center    // Centered column

// Manual
<div className="flex items-center justify-center">
  Centered
</div>

<div className="flex items-center justify-between">
  Space between
</div>
```

### Grid Layouts

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  Two columns on desktop
</div>
```

---

## Responsive Breakpoints

```tsx
sm:  // 640px  (tablet)
md:  // 768px  (small desktop)
lg:  // 1024px (desktop)
xl:  // 1280px (large desktop)
2xl: // 1536px (ultra-wide)

// Example: Mobile-first
<div className="text-sm sm:text-base md:text-lg">
  Responsive text size
</div>

// Hide/Show
<div className="hidden md:block">Only on desktop</div>
<div className="md:hidden">Only on mobile</div>
```

---

## Text Utilities

```tsx
text-truncate           // Ellipsis overflow
text-muted              // Muted gray
text-success            // Green
text-danger             // Red
text-warning            // Amber
text-info               // Blue

line-through            // Strikethrough
underline               // Underline
uppercase               // All caps
lowercase               // All lowercase
capitalize              // Capitalize words
```

---

## Animations

### Pre-built Animations

```tsx
fade-in                 // Fade in
fade-out                // Fade out
slide-in-from-left      // Slide from left
slide-in-from-right     // Slide from right
slide-in-from-top       // Slide from top
slide-in-from-bottom    // Slide from bottom
scale-in                // Scale up + fade
bounce-subtle           // Subtle bounce
pulse-subtle            // Subtle pulse
```

### Custom Transitions

```tsx
transition              // Default transition
transition-all          // All properties
duration-200            // 200ms duration
ease-in                 // Ease in easing
ease-out                // Ease out easing
ease-in-out             // Ease in-out easing

// Example
<button className="transition-all duration-200 hover:scale-105">
  Hover me
</button>
```

---

## Form Elements

### Input Fields

```tsx
<input className="input-base" />

// With label
<label>
  <span className="text-sm font-medium">Label</span>
  <input className="input-base mt-1" />
</label>

// With error
<input className="input-base border-danger" />
<span className="text-danger text-sm">Error message</span>
```

### Checkboxes & Radios

```tsx
<label className="flex items-center gap-2">
  <input type="checkbox" className="rounded" />
  <span>Checkbox label</span>
</label>

<label className="flex items-center gap-2">
  <input type="radio" name="group" className="rounded-full" />
  <span>Radio label</span>
</label>
```

---

## Component Structure

### Typical Card Component

```tsx
<div className="card-elevated p-6 space-y-4">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Title</h3>
    <span className="badge badge-primary">Badge</span>
  </div>

  {/* Content */}
  <p className="text-muted">Description text</p>

  {/* Actions */}
  <div className="flex gap-2 pt-4 border-t border-border">
    <button className="btn-primary flex-1">Action</button>
    <button className="btn-outline flex-1">Cancel</button>
  </div>
</div>
```

---

## Color Quick Reference

### Light Theme
```
Background: white (#ffffff)
Text: near-black (#18181b)
Cards: light gray (#f9fafb)
Primary: indigo (#6366f1)
Success: green (#22c55e)
Danger: red (#ef4444)
```

### Dark Theme
```
Background: dark blue (#0f172a)
Text: light gray (#f1f5f9)
Cards: darker blue (#1e293b)
Primary: light indigo (#818cf8)
Success: light green (#86efac)
Danger: light red (#f87171)
```

---

## Common Patterns

### Alert Messages

```tsx
{/* Success */}
<div className="bg-success/10 border border-success text-success p-4 rounded-lg">
  ✓ Operation successful
</div>

{/* Error */}
<div className="bg-danger/10 border border-danger text-danger p-4 rounded-lg">
  ✗ Something went wrong
</div>

{/* Warning */}
<div className="bg-warning/10 border border-warning text-warning p-4 rounded-lg">
  ⚠ Please review
</div>
```

### Loading State

```tsx
<div className="flex items-center gap-2 text-muted">
  <span className="animate-spin">⟳</span>
  Loading...
</div>
```

### Disabled State

```tsx
<button disabled className="opacity-50 cursor-not-allowed">
  Disabled
</button>
```

---

## Imports You'll Need

```tsx
// Colors and tokens
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { GAMBLING_COLORS, SEMANTIC_COLORS } from '@/lib/color-utils';

// Hooks
import { useDarkMode } from '@/hooks/useDarkMode';

// Components
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

// Utilities
import { cn } from '@/lib/utils';
```

---

## Pro Tips

1. **Use CSS Variables**: They automatically adapt to theme changes
2. **Mobile First**: Design for mobile, then add responsive classes
3. **Consistent Spacing**: Stick to the 8px grid
4. **Test Both Themes**: Always check light and dark modes
5. **Semantic Colors**: Use success/danger/warning instead of hardcoded colors
6. **Accessibility**: Always include focus states and hover effects
7. **Shadows for Depth**: Use shadow-md for cards, shadow-lg for floating
8. **Typography Hierarchy**: Use proper h1-h6 tags and weight combinations

---

## Common Mistakes to Avoid

❌ Using hardcoded colors instead of CSS variables  
✅ Use `bg-primary` instead of `bg-[#6366f1]`

❌ Breaking the 8px spacing grid  
✅ Use `p-4`, `p-6`, `p-8` instead of `p-5`, `p-7`

❌ Not testing dark mode  
✅ Always check both light and dark themes

❌ Forgetting focus states  
✅ Always add `focus-visible` states to interactive elements

❌ Text color without contrast  
✅ Verify WCAG AA contrast (4.5:1 minimum)

---

**Last Updated**: 2025-11-23  
**Version**: 1.0  
**For questions**: See DESIGN_SYSTEM.md for detailed documentation
