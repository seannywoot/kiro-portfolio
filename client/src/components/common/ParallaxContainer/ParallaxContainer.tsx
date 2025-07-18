import React from 'react';
import { useParallax } from '../../../hooks/useParallax';
import { cn } from '../../../lib/utils';
import type { ParallaxContainerProps } from '../../../lib/types';

/**
 * ParallaxContainer - Wrapper component for parallax scroll effects
 * Applies transform based on scroll position for visual depth
 */
export function ParallaxContainer({
  children,
  speed = 0.5,
  direction = 'up',
  className,
  ...props
}: ParallaxContainerProps & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, offset, isVisible } = useParallax({
    speed,
    direction,
    disabled: false
  });

  const transform = isVisible ? `translateY(${offset}px)` : 'translateY(0px)';

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('will-change-transform', className)}
      style={{
        transform,
        transition: 'transform 0.1s ease-out'
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default ParallaxContainer;