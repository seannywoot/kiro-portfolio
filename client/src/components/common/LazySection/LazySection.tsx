import React, { Suspense, lazy, ComponentType } from 'react';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

/**
 * LazySection component that only renders its children when they come into view
 * Helps with performance by deferring rendering of non-critical sections
 */
const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <LoadingSpinner />,
  rootMargin = '100px',
  threshold = 0.1,
  className = ''
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin
  });

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        <div style={{ minHeight: '200px' }} aria-hidden="true" />
      )}
    </div>
  );
};

export default LazySection;

/**
 * Higher-order component for lazy loading React components
 */
export function withLazyLoading<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: T) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Hook for creating lazy-loaded components with intersection observer
 */
export function useLazyComponent<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: {
    rootMargin?: string;
    threshold?: number;
    fallback?: React.ReactNode;
  } = {}
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '100px'
  });

  const LazyComponent = lazy(importFunc);

  const renderComponent = (props: T) => {
    if (!isIntersecting) {
      return <div ref={ref} style={{ minHeight: '200px' }} aria-hidden="true" />;
    }

    return (
      <div ref={ref}>
        <Suspense fallback={options.fallback || <LoadingSpinner />}>
          <LazyComponent {...props} />
        </Suspense>
      </div>
    );
  };

  return { renderComponent, isIntersecting };
}