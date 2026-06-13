---
name: Obey Premium Finance
colors:
  surface: '#fcf8fd'
  surface-dim: '#dcd9de'
  surface-bright: '#fcf8fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf2'
  surface-container-high: '#eae7ec'
  surface-container-highest: '#e5e1e6'
  on-surface: '#1c1b1f'
  on-surface-variant: '#46464f'
  inverse-surface: '#313034'
  inverse-on-surface: '#f3eff4'
  outline: '#777680'
  outline-variant: '#c8c5d0'
  surface-tint: '#585a8d'
  primary: '#020135'
  on-primary: '#ffffff'
  primary-container: '#1a1b4b'
  on-primary-container: '#8384ba'
  inverse-primary: '#c1c1fc'
  secondary: '#0040df'
  on-secondary: '#ffffff'
  secondary-container: '#2d5bff'
  on-secondary-container: '#efefff'
  tertiary: '#150600'
  on-tertiary: '#ffffff'
  tertiary-container: '#381800'
  on-tertiary-container: '#b07d59'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c1c1fc'
  on-primary-fixed: '#141545'
  on-primary-fixed-variant: '#404273'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001355'
  on-secondary-fixed-variant: '#0035bd'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#f6ba92'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#663d1e'
  background: '#fcf8fd'
  on-background: '#1c1b1f'
  surface-variant: '#e5e1e6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  gutter-mobile: 12px
  gutter-desktop: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built for a high-stakes digital payment environment where clarity, speed, and trust are paramount. The visual direction merges **Apple-inspired minimalism** with the functional logic of **Material Design 3**, resulting in a "Professional-Plus" aesthetic.

The brand personality is authoritative yet frictionless. It utilizes generous whitespace, precise alignment, and a layered surface architecture to reduce cognitive load during complex financial transactions. The emotional response should be one of "effortless control"—where the UI feels invisible until needed, and powerful when engaged. 

Key stylistic pillars include:
- **Optical Precision:** Every element sits on a strict 4px baseline grid.
- **Layered Hierarchy:** Depth is communicated through subtle tonal shifts rather than heavy shadows.
- **Micro-Interactions:** State changes (hover, active, focused) are handled with high-fidelity, eased transitions to provide tactile feedback for digital actions.

## Colors

The palette is anchored by **Deep Indigo**, providing a foundation of institutional stability and "Enterprise Blue" trust. **Electric Blue** serves as the primary action color, used sparingly for CTAs, focus states, and active indicators to draw the eye without creating visual fatigue.

Functional colors (Success, Warning, Error) follow standard semantic patterns but are slightly desaturated to maintain the premium feel. 

**Surface Strategy:**
- **Level 0 (Background):** Pure White or Graphite Black.
- **Level 1 (Cards/Containers):** Subtle off-white/grey (#F8FAFC) to differentiate content blocks from the canvas.
- **Borders:** Ultra-thin 1px borders using a neutral slate to define boundaries without the bulk of shadows.

## Typography

The typography system relies on **Inter** for all UI and editorial content due to its exceptional legibility and neutral, modern character. For financial data, transaction IDs, and balances, **JetBrains Mono** is utilized to ensure every digit is distinct and easy to scan.

- **Scale:** A tight typographic scale ensures that data density remains high without sacrificing readability.
- **Contrast:** Headings use semi-bold weights and tighter letter-spacing for a "Display" feel, while body text uses standard weights with generous line-height for long-form data logs.
- **Case:** Use `label-caps` for table headers and section overlines to create clear structural breaks.

## Layout & Spacing

The layout philosophy follows a **4px soft-grid system**. All margins, paddings, and heights are multiples of 4, ensuring a mathematically consistent rhythm.

**Grid Structure:**
- **Mobile:** 4-column fluid grid with 16px side margins and 12px gutters.
- **Tablet:** 8-column grid with 24px margins.
- **Desktop:** 12-column fixed grid (max-width 1440px) centered in the viewport.

**The 3-Click Rule:** Information architecture is flattened. Use side-drawers (modals) and contextual menus to keep the user on their primary dashboard rather than navigating to deep sub-pages. This "Single-Page" feel increases the perceived speed of the platform.

## Elevation & Depth

This design system avoids heavy drop shadows. Instead, it uses **Tonal Layers** and **Keyline Borders**.

- **Surfaces:** Use `#F8FAFC` for secondary containers against a white background to create depth.
- **Shadows:** When an element must float (e.g., a dropdown or modal), use an "Ambient Shadow": a very soft, multi-layered shadow with 4% opacity indigo tint to keep the shadow feeling "clean" rather than "dirty" (grey).
- **Glassmorphism:** Use a subtle backdrop-blur (10px - 15px) for sticky headers and side navigation to maintain context of the content scrolling beneath it.
- **Active States:** Elements being "pressed" should physically scale down slightly (98%) rather than gaining a shadow, mimicking a physical button depress.

## Shapes

The shape language is **Rounded**, striking a balance between the friendliness of consumer apps and the structure of enterprise tools.

- **Primary Components:** Buttons and Input fields use a 0.5rem (8px) radius.
- **Large Components:** Cards and Modals use a 1rem (16px) radius.
- **Micro Components:** Tooltips and badges use a 0.25rem (4px) radius.

All shapes must be "Continuous" (Squircle-like) where possible to align with the Apple-inspired aesthetic.

## Components

### Buttons
- **Primary:** Solid Deep Indigo or Electric Blue. No gradients. On-hover, the background color shifts 10% darker. On-press, the component scales to 0.98.
- **Ghost:** 1px border matching the text color. Ideal for secondary actions.

### Cards
- **Financial Cards:** Use Level 1 surfaces with a 1px border (#E2E8F0). Headlines should be `title-md`. Include a subtle "Indicator Strip" (2px wide) on the left edge for semantic status (Success/Warning).

### Input Fields
- **Default State:** White background, 1px slate border.
- **Focus State:** 2px Electric Blue border with a 4px soft blue outer glow (30% opacity).
- **Labels:** Use `body-sm` bold, positioned strictly above the input.

### Financial Indicators
- **Positive Trends:** Emerald Green text with a "plus" prefix and a soft green tint background chip.
- **Negative Trends:** Soft Red text with a "minus" prefix.
- Use `data-mono` for all numerical values within these indicators.

### Progress & Loading
- Use a slim, 2px determinate bar at the very top of the viewport for page transitions. 
- Avoid full-screen spinners; use skeleton loaders within cards to maintain the layout structure during data fetching.