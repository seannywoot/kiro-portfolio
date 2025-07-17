import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { cn } from '../../../lib/utils';
import { prefersReducedMotion } from '../../../lib/animations';
import type { AnimatedTextProps } from '../../../lib/types';

/**
 * AnimatedText - Text component with various animation effects
 * Supports fadeIn, slideUp, and typewriter animations
 */
export function AnimatedText({
  text,
  animation = 'fadeIn',
  delay = 0,
  className,
  ...props
}: AnimatedTextProps & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });

  const [isAnimated, setIsAnimated] = useState(false);
  const [displayText, setDisplayText] = useState(animation === 'typewriter' ? '' : text);

  // Handle animation trigger
  useEffect(() => {
    if (isIntersecting && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isIntersecting, isAnimated, delay]);

  // Handle typewriter effect
  useEffect(() => {
    if (animation === 'typewriter' && isAnimated && !prefersReducedMotion()) {
      let currentIndex = 0;
      const typewriterTimer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typewriterTimer);
        }
      }, 50); // Typing speed

      return () => clearInterval(typewriterTimer);
    } else if (animation === 'typewriter' && (isAnimated || prefersReducedMotion())) {
      setDisplayText(text);
    }
  }, [animation, isAnimated, text]);

  // Animation classes
  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    if (prefersReducedMotion()) {
      return baseClasses;
    }

    switch (animation) {
      case 'fadeIn':
        return cn(
          baseClasses,
          isAnimated ? 'opacity-100' : 'opacity-0'
        );
      case 'slideUp':
        return cn(
          baseClasses,
          isAnimated 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        );
      case 'typewriter':
        return cn(
          baseClasses,
          'opacity-100',
          // Add cursor effect for typewriter
          isAnimated && displayText.length < text.length 
            ? 'after:content-["|"] after:animate-pulse after:ml-1' 
            : ''
        );
      default:
        return baseClasses;
    }
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(getAnimationClasses(), className)}
      {...props}
    >
      {displayText}
    </div>
  );
}

export default AnimatedText;