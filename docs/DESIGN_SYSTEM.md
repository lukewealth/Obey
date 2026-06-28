# OBEY Design System

## Overview

The OBEY design system is built on Apple-style principles: clean, simple, and focused on user experience. This document outlines the design tokens, components, patterns, and guidelines used throughout the platform.

## Design Principles

### 1. Clarity First
- Text should be legible at all sizes
- Icons should be instantly recognizable
- Actions should be obvious and intuitive

### 2. Simplicity
- Remove unnecessary elements
- Use whitespace generously
- Focus on essential functionality

### 3. Consistency
- Same patterns across all screens
- Predictable interactions
- Unified visual language

### 4. Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly

## Design Tokens

### Colors

#### Primary Palette

```css
/* Dark Theme (Default) */
--color-bg-primary: #0b0e14;
--color-bg-secondary: #1a1f2e;
--color-bg-tertiary: #242838;

--color-text-primary: #ffffff;
--color-text-secondary: #9ca3af;
--color-text-tertiary: #6b7280;

--color-accent-primary: #7c3aed;
--color-accent-secondary: #3b82f6;
--color-accent-success: #10b981;
--color-accent-warning: #f59e0b;
--color-accent-error: #ef4444;

/* Light Theme */
--color-bg-primary: #ffffff;
--color-bg-secondary: #f9fafb;
--color-bg-tertiary: #f3f4f6;

--color-text-primary: #111827;
--color-text-secondary: #6b7280;
--color-text-tertiary: #9ca3af;
```

#### Semantic Colors

```css
/* Status Colors */
--color-success: #10b981;
--color-success-bg: rgba(16, 185, 129, 0.1);
--color-success-border: rgba(16, 185, 129, 0.2);

--color-warning: #f59e0b;
--color-warning-bg: rgba(245, 158, 11, 0.1);
--color-warning-border: rgba(245, 158, 11, 0.2);

--color-error: #ef4444;
--color-error-bg: rgba(239, 68, 68, 0.1);
--color-error-border: rgba(239, 68, 68, 0.2);

--color-info: #3b82f6;
--color-info-bg: rgba(59, 130, 246, 0.1);
--color-info-border: rgba(59, 130, 246, 0.2);
```

#### Crypto Asset Colors

```css
/* Bitcoin */
--color-btc: #f7931a;
--color-btc-gradient: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);

/* Ethereum */
--color-eth: #627eea;
--color-eth-gradient: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);

/* Solana */
--color-sol: #9945ff;
--color-sol-gradient: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);

/* Sui */
--color-sui: #06f8f8;
--color-sui-gradient: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
```

### Typography

#### Font Families

```css
/* Primary Font */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace Font */
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Display Font */
--font-family-display: 'Space Grotesk', 'Inter', sans-serif;
```

#### Font Sizes

```css
/* Text Sizes */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */

/* Line Heights */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-black: 900;
```

#### Typography Scale

```css
/* Headings */
h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
}

h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}

h4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}

/* Body Text */
.body-lg {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}

.body-base {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.body-sm {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.body-xs {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
}

/* Numbers (Monospace) */
.number-lg {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}

.number-base {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.number-sm {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
```

### Spacing

```css
/* Spacing Scale (4px base) */
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */

/* Component Spacing */
--spacing-component-sm: var(--spacing-3);
--spacing-component-md: var(--spacing-4);
--spacing-component-lg: var(--spacing-6);
--spacing-component-xl: var(--spacing-8);

/* Section Spacing */
--spacing-section-sm: var(--spacing-12);
--spacing-section-md: var(--spacing-16);
--spacing-section-lg: var(--spacing-20);
--spacing-section-xl: var(--spacing-24);
```

### Border Radius

```css
/* Border Radius Scale */
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-3xl: 2rem;      /* 32px */
--radius-full: 9999px;

/* Component Radius */
--radius-button: var(--radius-xl);
--radius-card: var(--radius-2xl);
--radius-modal: var(--radius-3xl);
--radius-input: var(--radius-xl);
--radius-badge: var(--radius-full);
```

### Shadows

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Component Shadows */
--shadow-button: var(--shadow-md);
--shadow-card: var(--shadow-lg);
--shadow-modal: var(--shadow-2xl);
--shadow-input: var(--shadow-sm);

/* Glow Effects */
--shadow-glow-primary: 0 0 20px rgba(124, 58, 237, 0.3);
--shadow-glow-success: 0 0 20px rgba(16, 185, 129, 0.3);
--shadow-glow-error: 0 0 20px rgba(239, 68, 68, 0.3);
```

### Transitions

```css
/* Transition Durations */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* Transition Easings */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Component Transitions */
--transition-button: all var(--duration-normal) var(--ease-in-out);
--transition-card: all var(--duration-slow) var(--ease-in-out);
--transition-input: all var(--duration-fast) var(--ease-in-out);
--transition-modal: all var(--duration-slow) var(--ease-bounce);
```

## Components

### Buttons

#### Primary Button

```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
  <Icon size={18} />
  <span>Button Text</span>
</button>
```

#### Secondary Button

```tsx
<button className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-white/10">
  <Icon size={18} />
  <span>Button Text</span>
</button>
```

#### Ghost Button

```tsx
<button className="hover:bg-white/5 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
  <Icon size={18} />
  <span>Button Text</span>
</button>
```

### Cards

#### Balance Card (Dark)

```tsx
<div className="relative overflow-hidden rounded-3xl p-6 md:p-8"
  style={{
    background: 'linear-gradient(135deg, #0b0e14 0%, #1a1f2e 100%)',
    boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.3)',
  }}
>
  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
  <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
  
  <div className="relative z-10">
    {/* Card content */}
  </div>
</div>
```

#### Glass Card

```tsx
<div className="rounded-2xl p-5"
  style={{
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  }}
>
  {/* Card content */}
</div>
```

#### Asset Card

```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="relative p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-200 cursor-pointer group overflow-hidden"
>
  <div className="flex items-center justify-between mb-3">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
      <Icon size={18} className="text-white" />
    </div>
    <div className="text-xs font-bold flex items-center gap-0.5 text-emerald-400">
      <ArrowUpRight size={10} />
      +2.4%
    </div>
  </div>
  <div>
    <p className="text-sm font-semibold text-white">Bitcoin</p>
    <p className="text-xs text-gray-500">BTC</p>
  </div>
  <div className="mt-2">
    <p className="font-mono font-bold text-lg text-white">₦95,000,000</p>
  </div>
</motion.div>
```

### Inputs

#### Text Input

```tsx
<div className="relative">
  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
  <input
    type="text"
    placeholder="Placeholder text"
    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
  />
</div>
```

#### Number Input (Currency)

```tsx
<div className="relative">
  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold text-2xl">₦</span>
  <input
    type="number"
    placeholder="0.00"
    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl text-2xl font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
  />
</div>
```

### Badges

#### Status Badge

```tsx
<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
  Active
</div>
```

#### Tier Badge

```tsx
<div className="px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm bg-emerald-50 border border-emerald-200 text-emerald-700">
  <ShieldCheck size={12} />
  <span className="text-[10px] font-bold">Tier 2 Verified</span>
</div>
```

### Modals

#### Verification Modal (Compact)

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-2xl" />
  
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative"
  >
    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1.5 hover:bg-gray-100 rounded-full">
      <X size={18} />
    </button>
    
    <div className="text-center space-y-4">
      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
        <ShieldAlert size={28} />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-gray-900">Verify Your Identity</h3>
        <p className="text-sm text-gray-500">Complete verification to access all features.</p>
      </div>
      
      {/* Checklist */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        {/* Items */}
      </div>
      
      <button className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm">
        Verify Now
      </button>
    </div>
  </motion.div>
</div>
```

## Layout Patterns

### Dashboard Layout

```tsx
<div className="space-y-6 pb-24">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        Online
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
        Good morning, John
      </h1>
    </div>
    
    <div className="flex items-center gap-3">
      {/* Search and actions */}
    </div>
  </div>
  
  {/* Balance Card */}
  <div className="relative overflow-hidden rounded-3xl p-6 md:p-8">
    {/* Balance content */}
  </div>
  
  {/* Quick Actions */}
  <div className="grid grid-cols-4 gap-3">
    {/* Action buttons */}
  </div>
  
  {/* Main Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {/* Transactions (8 cols) */}
    <div className="lg:col-span-8">
      {/* Transaction list */}
    </div>
    
    {/* Markets (4 cols) */}
    <div className="lg:col-span-4">
      {/* Market list */}
    </div>
  </div>
  
  {/* Asset Performance */}
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    {/* Asset cards */}
  </div>
  
  {/* AI Insights */}
  <div className="rounded-2xl p-5"
    style={{
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(124, 58, 237, 0.2)',
    }}
  >
    {/* AI insights content */}
  </div>
</div>
```

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px;   /* Small tablets */
md: 768px;   /* Tablets */
lg: 1024px;  /* Small laptops */
xl: 1280px;  /* Desktops */
2xl: 1536px; /* Large desktops */
```

## Animation Patterns

### Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
>
  {/* Page content */}
</motion.div>
```

### Card Hover Effects

```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
  {/* Card content */}
</motion.div>
```

### Loading States

```tsx
<motion.div
  animate={{ opacity: [1, 0.4, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
  className="flex items-center gap-1.5"
>
  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
  <span className="text-xs text-emerald-400 font-medium">Live</span>
</motion.div>
```

## Accessibility Guidelines

### Color Contrast

- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

### Focus States

```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Provide visible focus indicators
- Support Tab, Enter, Space, and Escape keys

### Screen Readers

- Use ARIA labels for icon-only buttons
- Provide alt text for images
- Use semantic heading hierarchy (h1-h6)
- Announce dynamic content changes

## Best Practices

### Do's

✅ Use consistent spacing throughout
✅ Keep text concise and clear
✅ Provide visual feedback for interactions
✅ Use semantic HTML elements
✅ Test on multiple devices and screen sizes
✅ Follow the color system strictly
✅ Use proper heading hierarchy
✅ Provide loading states for async operations

### Don'ts

❌ Don't use more than 2 font families
❌ Don't skip heading levels
❌ Don't use color alone to convey information
❌ Don't remove focus indicators
❌ Don't use tiny text (< 12px)
❌ Don't create walls of text
❌ Don't use too many colors in one view
❌ Don't animate without purpose

## Component Library

### Icons

Using Lucide React for consistency:

```tsx
import { 
  Wallet, Send, Smartphone, Gift, 
  TrendingUp, Activity, Star, Zap 
} from 'lucide-react';
```

### Animation Library

Using Framer Motion for smooth animations:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
```

### Chart Library

Using Recharts for data visualization:

```tsx
import { 
  LineChart, Line, 
  AreaChart, Area,
  BarChart, Bar 
} from 'recharts';
```

## Version History

### v2.0 (Current)
- Multi-source crypto fetcher
- Apple-style dark theme
- AI insights integration
- Real-time price updates
- Compact verification modal

### v1.0
- Initial design system
- Basic component library
- Light theme only
- Single data source

## Resources

- [Figma Design File](https://figma.com/file/...)
- [Storybook Components](https://storybook.obey.finance)
- [Design Tokens JSON](./design-tokens.json)
- [Component Examples](./examples/)

## Support

For design system questions or contributions:
- Slack: #design-system
- Email: design@obey.finance
- GitHub: [Create an issue](https://github.com/yourusername/obey/issues)

---

© 2024 OBEY. All rights reserved.
