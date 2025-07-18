/**
 * Responsive design utilities and breakpoints
 */

// Standard breakpoints following mobile-first approach
export const breakpoints = {
  xs: '320px',   // Extra small devices
  sm: '640px',   // Small devices (phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (laptops)
  xl: '1280px',  // Extra large devices (desktops)
  '2xl': '1536px' // 2X large devices (large desktops)
} as const;

// Viewport utilities
export const viewport = {
  // Get current viewport size
  getSize: () => ({
    width: window.innerWidth,
    height: window.innerHeight
  }),

  // Check if viewport matches breakpoint
  isAbove: (breakpoint: keyof typeof breakpoints): boolean => {
    return window.innerWidth >= parseInt(breakpoints[breakpoint]);
  },

  isBelow: (breakpoint: keyof typeof breakpoints): boolean => {
    return window.innerWidth < parseInt(breakpoints[breakpoint]);
  },

  // Listen for viewport changes
  onChange: (callback: (size: { width: number; height: number }) => void) => {
    const handleResize = () => {
      callback(viewport.getSize());
    };

    window.addEventListener('resize', handleResize, { passive: true });
    callback(viewport.getSize()); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }
};

// Container utilities for consistent max-widths
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
  full: '100%'
} as const;

// Spacing scale for consistent responsive spacing
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
  '3xl': '6rem',  // 96px
  '4xl': '8rem'   // 128px
} as const;

// Typography scale for responsive text
export const typography = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem',  // 72px
  '8xl': '6rem',    // 96px
  '9xl': '8rem'     // 128px
} as const;

// Grid utilities
export const grid = {
  // Generate responsive grid columns
  columns: (mobile: number, tablet?: number, desktop?: number) => ({
    gridTemplateColumns: `repeat(${mobile}, 1fr)`,
    [`@media (min-width: ${breakpoints.md})`]: {
      gridTemplateColumns: `repeat(${tablet || mobile}, 1fr)`
    },
    [`@media (min-width: ${breakpoints.lg})`]: {
      gridTemplateColumns: `repeat(${desktop || tablet || mobile}, 1fr)`
    }
  }),

  // Generate responsive gaps
  gap: (mobile: keyof typeof spacing, tablet?: keyof typeof spacing, desktop?: keyof typeof spacing) => ({
    gap: spacing[mobile],
    [`@media (min-width: ${breakpoints.md})`]: {
      gap: spacing[tablet || mobile]
    },
    [`@media (min-width: ${breakpoints.lg})`]: {
      gap: spacing[desktop || tablet || mobile]
    }
  })
};

// Responsive image utilities
export const images = {
  // Generate responsive image sizes
  sizes: {
    hero: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
    card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
    thumbnail: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px',
    full: '100vw'
  },

  // Aspect ratios
  aspectRatios: {
    square: '1/1',
    video: '16/9',
    photo: '4/3',
    portrait: '3/4',
    wide: '21/9'
  }
};

// Touch target utilities
export const touch = {
  // Minimum touch target size (WCAG AA)
  minSize: '44px',
  
  // Recommended touch target size
  recommendedSize: '48px',
  
  // Generate touch-friendly button styles
  button: {
    minHeight: '44px',
    minWidth: '44px',
    padding: '12px 16px',
    fontSize: typography.base,
    lineHeight: '1.5'
  }
};

// Animation utilities for responsive motion
export const animation = {
  // Reduced motion variants
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // Generate motion-safe animations
  safe: (animation: string) => ({
    animation,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none'
    }
  })
};