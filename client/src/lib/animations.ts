/**
 * Animation utility functions for the portfolio website
 */

// Easing functions for smooth animations
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Animation duration constants
export const durations = {
  micro: 150,
  fast: 300,
  normal: 600,
  slow: 1000,
} as const;

/**
 * Calculates parallax offset based on scroll position
 * @param scrollY Current scroll position
 * @param speed Parallax speed multiplier (0-1, where 0.5 is half speed)
 * @param direction Direction of parallax effect
 */
export function calculateParallaxOffset(
  scrollY: number,
  speed: number = 0.5,
  direction: 'up' | 'down' = 'up'
): number {
  const offset = scrollY * speed;
  return direction === 'up' ? -offset : offset;
}

/**
 * Smoothly interpolates between two values
 * @param start Starting value
 * @param end Ending value
 * @param progress Progress value between 0 and 1
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculates scroll progress as a percentage (0-1)
 * @param element Target element or null for document
 */
export function getScrollProgress(element?: HTMLElement | null): number {
  if (element) {
    const elementHeight = element.scrollHeight - element.clientHeight;
    return elementHeight > 0 ? clamp(element.scrollTop / elementHeight, 0, 1) : 0;
  }
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  return scrollHeight > 0 ? clamp(scrollTop / scrollHeight, 0, 1) : 0;
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Creates a throttled function that only executes at most once per frame
 */
export function throttleFrame<T extends (...args: any[]) => void>(fn: T): T {
  let ticking = false;
  
  return ((...args: any[]) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  }) as T;
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}