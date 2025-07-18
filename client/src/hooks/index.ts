/**
 * Custom React hooks for animations and scroll effects
 */

export { useParallax } from './useParallax';
export type { UseParallaxOptions, UseParallaxReturn } from './useParallax';

export { 
  useIntersectionObserver, 
  useIntersectionObserverOnce 
} from './useIntersectionObserver';
export type { UseIntersectionObserverReturn } from './useIntersectionObserver';

export { 
  useScrollProgress, 
  useElementScrollProgress, 
  useScrollProgressRange 
} from './useScrollProgress';
export type { 
  UseScrollProgressOptions, 
  UseScrollProgressReturn 
} from './useScrollProgress';