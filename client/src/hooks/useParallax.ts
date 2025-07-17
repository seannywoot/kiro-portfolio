import { useEffect, useState, useCallback, useRef } from 'react';
import { calculateParallaxOffset, throttleFrame, prefersReducedMotion } from '../lib/animations';

export interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  disabled?: boolean;
}

export interface UseParallaxReturn {
  ref: React.RefObject<HTMLElement>;
  offset: number;
  isVisible: boolean;
}

/**
 * Custom hook for parallax scroll effects
 * Calculates parallax offset based on element position and scroll
 */
export function useParallax(options: UseParallaxOptions = {}): UseParallaxReturn {
  const {
    speed = 0.5,
    direction = 'up',
    disabled = false
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const updateParallax = useCallback(
    throttleFrame(() => {
      if (!ref.current || disabled || prefersReducedMotion()) {
        setOffset(0);
        return;
      }

      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if element is in viewport
      const elementIsVisible = rect.bottom >= 0 && rect.top <= windowHeight;
      setIsVisible(elementIsVisible);

      if (!elementIsVisible) {
        return;
      }

      // Calculate scroll position relative to element
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const scrollDistance = viewportCenter - elementCenter;
      
      // Calculate parallax offset
      const parallaxOffset = calculateParallaxOffset(scrollDistance, speed, direction);
      setOffset(parallaxOffset);
    }),
    [speed, direction, disabled]
  );

  useEffect(() => {
    // Initial calculation
    updateParallax();

    // Add scroll listener
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, [updateParallax]);

  return {
    ref,
    offset,
    isVisible
  };
}