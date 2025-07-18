import { useEffect, useState, useRef, useCallback } from 'react';
import type { IntersectionObserverOptions } from '../lib/types';

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook for intersection observer functionality
 * Tracks when an element enters or leaves the viewport
 */
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [currentEntry] = entries;
    if (currentEntry) {
      setIsIntersecting(currentEntry.isIntersecting);
      setEntry(currentEntry);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback: assume element is always visible
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin, root]);

  return {
    ref,
    isIntersecting,
    entry
  };
}

/**
 * Hook variant that triggers only once when element first becomes visible
 */
export function useIntersectionObserverOnce(
  options: IntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    ref,
    isIntersecting,
    entry
  } = useIntersectionObserver(options);

  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isIntersecting && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isIntersecting, hasTriggered]);

  return {
    ref,
    isIntersecting: hasTriggered,
    entry
  };
}