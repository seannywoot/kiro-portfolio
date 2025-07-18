import { useEffect, useState, useCallback, useRef } from 'react';
import { getScrollProgress, throttleFrame, clamp } from '../lib/animations';

export interface UseScrollProgressOptions {
  element?: HTMLElement | null;
  throttle?: boolean;
}

export interface UseScrollProgressReturn {
  progress: number;
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
}

/**
 * Custom hook for tracking scroll progress and direction
 * Returns scroll progress as a value between 0 and 1
 */
export function useScrollProgress(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  const { element = null, throttle = true } = options;
  
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  const updateScrollProgress = useCallback(() => {
    const currentScrollY = element 
      ? element.scrollTop 
      : window.pageYOffset || document.documentElement.scrollTop;
    
    const currentProgress = getScrollProgress(element);
    
    // Determine scroll direction
    const direction = currentScrollY > lastScrollY.current ? 'down' : 
                     currentScrollY < lastScrollY.current ? 'up' : null;
    
    setScrollY(currentScrollY);
    setProgress(clamp(currentProgress, 0, 1));
    setScrollDirection(direction);
    
    lastScrollY.current = currentScrollY;
  }, [element]);

  const throttledUpdate = useCallback(
    throttle ? throttleFrame(updateScrollProgress) : updateScrollProgress,
    [updateScrollProgress, throttle]
  );

  useEffect(() => {
    // Initial calculation
    updateScrollProgress();

    const targetElement = element || window;
    const eventName = element ? 'scroll' : 'scroll';

    targetElement.addEventListener(eventName, throttledUpdate, { passive: true });

    return () => {
      targetElement.removeEventListener(eventName, throttledUpdate);
    };
  }, [throttledUpdate, element]);

  return {
    progress,
    scrollY,
    scrollDirection
  };
}

/**
 * Hook for tracking scroll progress within a specific element
 */
export function useElementScrollProgress(
  elementRef: React.RefObject<HTMLElement>,
  options: Omit<UseScrollProgressOptions, 'element'> = {}
): UseScrollProgressReturn {
  return useScrollProgress({
    ...options,
    element: elementRef.current
  });
}

/**
 * Hook for tracking scroll progress with custom range
 */
export function useScrollProgressRange(
  startOffset: number = 0,
  endOffset: number = 1,
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  const { progress, scrollY, scrollDirection } = useScrollProgress(options);
  
  // Map progress to custom range
  const rangeProgress = clamp(
    (progress - startOffset) / (endOffset - startOffset),
    0,
    1
  );

  return {
    progress: rangeProgress,
    scrollY,
    scrollDirection
  };
}