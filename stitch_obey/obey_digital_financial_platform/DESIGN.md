---
name: OBEY Digital Financial Platform
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434656'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004ee7'
  primary: '#0043c8'
  on-primary: '#ffffff'
  primary-container: '#0057ff'
  on-primary-container: '#e5e8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006685'
  on-secondary: '#ffffff'
  secondary-container: '#00c4fd'
  on-secondary-container: '#004d66'
  tertiary: '#005e33'
  on-tertiary: '#ffffff'
  tertiary-container: '#007943'
  on-tertiary-container: '#98ffba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab2'
  secondary-fixed: '#bfe9ff'
  secondary-fixed-dim: '#6dd2ff'
  on-secondary-fixed: '#001f2a'
  on-secondary-fixed-variant: '#004d65'
  tertiary-fixed: '#70fda7'
  tertiary-fixed-dim: '#51df8e'
  on-tertiary-fixed: '#00210e'
  on-tertiary-fixed-variant: '#00522c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
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
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-margin-mobile: 16px
  container-margin-desktop: 40px
  gutter: 24px
---

## Brand & Style

The brand identity focuses on absolute precision, speed, and institutional-grade trust. The design system targets a sophisticated user base—tech-forward investors and corporate treasury managers—who demand clarity and performance. 

The aesthetic is a refined blend of **Modern Corporate** and **Glassmorphism**. It utilizes a clean, card-based interface that leverages white space to reduce cognitive load during complex financial tasks. Visual interest is generated through subtle translucent layers and high-fidelity blurs, creating a sense of depth and modernism without compromising legibility or the "no-nonsense" professional tone required for financial SaaS.

## Colors

The palette is anchored by a high-energy Primary Blue, symbolizing stability and digital innovation. The Secondary Blue provides a lighter, more agile accent for data visualization and secondary actions. 

- **Primary (#0057FF):** Used for main CTAs, active states, and brand-critical elements.
- **Secondary (#00C6FF):** Used for interactive hover states and gradient accents.
- **Semantic Colors:** Strict adherence to Success (Green), Warning (Orange), and Error (Red) is required for all transactional feedback and status indicators.
- **Neutral/Surface:** The system uses a specific slate-tinted white (#F8FAFC) for light mode to reduce eye strain, while dark mode utilizes a deep obsidian (#0B1220) to maintain high contrast with blue accents.

## Typography

This design system utilizes **Inter** exclusively to ensure a systematic, utilitarian, and highly readable interface. The type scale is optimized for data-dense environments.

- **Headlines:** Use Semi-Bold (600) and Bold (700) weights with slightly negative letter spacing to create a compact, "premium" feel in large titles.
- **Body:** Standard body text uses the Regular (400) weight for maximum legibility in long-form reports and transaction lists.
- **Labels:** Small labels and captions use Medium (500) or Semi-Bold (600) to ensure they stand out even at 12px. Uppercase is reserved strictly for `label-sm` to denote secondary metadata or table headers.

## Layout & Spacing

The design system employs a **Fluid Grid** model based on an 8px base unit. This ensures a consistent rhythm across all components and page layouts.

- **Desktop:** 12-column grid with 24px gutters and 40px outer margins. Content is organized into "Financial Cards" that typically span 3, 4, 6, or 12 columns.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px margins.
- **Spacing Logic:** Use `lg` (24px) for internal padding of cards and `2xl` (48px) for vertical section spacing. This generous padding contributes to the "minimal" and "uncluttered" brand promise.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

1. **Base Surface:** #F8FAFC (Light) or #0B1220 (Dark).
2. **Elevated Cards:** Pure White (Light) or #161E2E (Dark) with a soft shadow. The shadow should be highly diffused: `0px 12px 32px -4px rgba(0, 0, 0, 0.08)`.
3. **Glassmorphism Overlays:** Modals, dropdowns, and navigation bars should use a backdrop filter blur (20px) with a semi-transparent surface (e.g., `rgba(255, 255, 255, 0.7)`).
4. **Interactive States:** On hover, cards should subtly lift by increasing shadow spread and shifting -2px on the Y-axis.

## Shapes

The shape language is welcoming yet disciplined. We use a **Rounded** approach to soften the technical nature of financial data.

- **Primary Cards & Containers:** Use `rounded-xl` (1.5rem / 24px) to create a distinct, modern silhouette.
- **Buttons & Inputs:** Use `rounded-lg` (1rem / 16px) for a comfortable touch target and cohesive look.
- **Chips & Tags:** Use pill-shaped (full radius) to distinguish them clearly from interactive buttons.
- **Visual Consistency:** Ensure that nested elements have a slightly smaller radius than their parents to maintain geometric harmony.

## Components

- **Buttons:** Primary buttons use a solid #0057FF fill with white text. Secondary buttons use a subtle ghost style with a 1px border. All buttons have a height of 48px or 56px for a premium, accessible feel.
- **Input Fields:** Use a light grey background (#F1F5F9) with a 1px transparent border that turns Primary Blue on focus. Labels sit outside the field in `label-md`.
- **Cards:** The core of the UI. Must have a 24px internal padding. In dark mode, cards should have a 1px subtle stroke (`rgba(255,255,255,0.05)`) to define edges against the deep background.
- **Chips:** Used for transaction categories or status (e.g., "Pending"). Use low-opacity versions of the semantic colors (e.g., Success green at 10% opacity) with high-contrast text.
- **Data Tables:** Row-based with no vertical borders. Use 16px padding on rows and a subtle hover effect to highlight specific entries. Headers must be `label-sm` uppercase.
- **Progress Indicators:** Use the Secondary Blue (#00C6FF) for "in-progress" states to suggest motion and Primary Blue (#0057FF) for completion.