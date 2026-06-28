export const designTokens = {
  colors: {
    primary: {
      DEFAULT: '#0F172A',
      light: '#1E293B',
      dark: '#020617',
    },
    accent: {
      DEFAULT: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
    },
    surface: {
      DEFAULT: '#1A1E2F',
      elevated: '#242838',
      glass: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
    },
    border: {
      DEFAULT: '#334155',
      light: 'rgba(255, 255, 255, 0.1)',
    },
    status: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(34, 197, 94, 0.3)',
  },
  animations: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    spring: {
      gentle: { type: 'spring', stiffness: 100, damping: 20 },
      bouncy: { type: 'spring', stiffness: 200, damping: 15 },
      smooth: { type: 'spring', stiffness: 150, damping: 25 },
    },
  },
  typography: {
    fontFamily: {
      sans: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'IBM Plex Mono, monospace',
    },
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
} as const;

export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  shimmer: {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  pulse: {
    animate: {
      opacity: [1, 0.5, 1],
      transition: { duration: 2, repeat: Infinity },
    },
  },
  countUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
} as const;
