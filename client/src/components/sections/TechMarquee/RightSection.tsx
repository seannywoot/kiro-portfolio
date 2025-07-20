import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Technology } from '../../../lib/types';
import TechIcon from './TechIcon';
import styles from './RightSection.module.css';

interface RightSectionProps {
  technologies: Technology[];
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  isVisible?: boolean;
}

const RightSection: React.FC<RightSectionProps> = ({
  technologies,
  speed = 50,
  pauseOnHover = true,
  className = '',
  isVisible: parentIsVisible = true
}) => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLocalVisible, setIsLocalVisible] = useState(true);
  
  // Combined visibility state from parent and local intersection observer
  const isVisible = parentIsVisible && isLocalVisible;

  // Split technologies into two rows for dual marquee effect
  const midpoint = Math.ceil(technologies.length / 2);
  const topRowTechs = technologies.slice(0, midpoint);
  const bottomRowTechs = technologies.slice(midpoint);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Enhanced intersection observer for performance optimization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // In test environment, assume component is always visible
    const isTestEnvironment = process.env.NODE_ENV === 'test' || typeof window === 'undefined' || !window.IntersectionObserver;
    
    if (isTestEnvironment) {
      setIsLocalVisible(true);
      container.style.setProperty('--animation-quality', 'high');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLocalVisible(entry.isIntersecting);
        
        // Performance optimization: adjust animation quality based on visibility
        if (entry.isIntersecting) {
          // High performance mode when visible
          container.style.setProperty('--animation-quality', 'high');
        } else {
          // Reduce animation quality when not visible
          container.style.setProperty('--animation-quality', 'low');
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5],
        rootMargin: '100px 0px' // More generous margin for smoother transitions
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Set CSS custom properties for animation speed - optimized for diagonal layout
    const optimizedSpeed = speed * 0.8; // Slightly faster for diagonal layout
    if (topRowRef.current) {
      topRowRef.current.style.setProperty('--marquee-speed', `${optimizedSpeed}s`);
    }
    if (bottomRowRef.current) {
      bottomRowRef.current.style.setProperty('--marquee-speed', `${optimizedSpeed}s`);
    }
  }, [speed]);

  // Enhanced performance monitoring for 60fps optimization
  useEffect(() => {
    if (!isVisible || typeof window === 'undefined') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;
    let performanceCheckInterval: NodeJS.Timeout;

    const measurePerformance = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Log performance in development mode
        if (process.env.NODE_ENV === 'development') {
          if (fps < 55) {
            console.warn(`TechMarquee performance warning: ${fps}fps (target: 60fps)`);
          }
        }
        
        // Dynamic performance adjustment based on actual FPS
        const container = containerRef.current;
        if (container) {
          if (fps < 30) {
            // Critical performance - disable expensive effects
            container.style.setProperty('--animation-quality', 'minimal');
            container.style.setProperty('--hardware-acceleration', 'disabled');
          } else if (fps < 45) {
            // Low performance - reduce quality
            container.style.setProperty('--animation-quality', 'low');
            container.style.setProperty('--hardware-acceleration', 'minimal');
          } else if (fps >= 55) {
            // Good performance - enable all optimizations
            container.style.setProperty('--animation-quality', 'high');
            container.style.setProperty('--hardware-acceleration', 'enabled');
          } else {
            // Moderate performance - balanced settings
            container.style.setProperty('--animation-quality', 'medium');
            container.style.setProperty('--hardware-acceleration', 'moderate');
          }
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    // Start performance monitoring
    animationId = requestAnimationFrame(measurePerformance);

    // Additional performance check every 5 seconds for long-term monitoring
    performanceCheckInterval = setInterval(() => {
      const container = containerRef.current;
      if (container && isVisible) {
        // Check if animations are still running smoothly
        const computedStyle = window.getComputedStyle(container);
        const animationPlayState = computedStyle.animationPlayState;
        
        if (animationPlayState === 'paused' && isVisible) {
          // Animation unexpectedly paused - restart with lower quality
          container.style.setProperty('--animation-quality', 'low');
          container.style.animationPlayState = 'running';
        }
      }
    }, 5000);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (performanceCheckInterval) {
        clearInterval(performanceCheckInterval);
      }
    };
  }, [isVisible]);

  // Handle touch interactions for mobile
  const handleTouchStart = useCallback(() => {
    if (isTouchDevice && pauseOnHover) {
      setIsPaused(true);
    }
  }, [isTouchDevice, pauseOnHover]);

  const handleTouchEnd = useCallback(() => {
    if (isTouchDevice && pauseOnHover) {
      setIsPaused(false);
    }
  }, [isTouchDevice, pauseOnHover]);

  // Handle mouse interactions for desktop
  const handleMouseEnter = useCallback(() => {
    if (!isTouchDevice && pauseOnHover) {
      setIsPaused(true);
    }
  }, [isTouchDevice, pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouchDevice && pauseOnHover) {
      setIsPaused(false);
    }
  }, [isTouchDevice, pauseOnHover]);

  const renderTechItem = (tech: Technology, index: number) => (
    <div key={`${tech.name}-${index}`} className={styles.techItem}>
      <TechIcon technology={tech} />
      <span className={styles.techName}>{tech.name}</span>
    </div>
  );

  const renderMarqueeRow = (
    techs: Technology[],
    direction: 'left' | 'right',
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    // Duplicate the technologies array twice to create seamless infinite scroll
    const duplicatedTechs = [...techs, ...techs];

    return (
      <div
        ref={ref}
        className={`${styles.marqueeRow} ${
          direction === 'left' ? styles.marqueeLeft : styles.marqueeRight
        } ${pauseOnHover ? styles.pauseOnHover : ''}`}
      >
        <div className={styles.marqueeContent}>
          {duplicatedTechs.map((tech, index) => renderTechItem(tech, index))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`${styles.rightSection} ${className}`} 
      ref={containerRef}
      role="complementary"
      aria-label="Technology showcase animations"
    >
      <div 
        className={`${styles.marqueeContainer} ${isPaused ? styles.paused : ''} ${!isVisible ? styles.hidden : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="img"
        aria-label="Animated showcase of technologies and tools"
        aria-describedby="tech-description"
        tabIndex={0}
        onKeyDown={(e) => {
          // Allow keyboard users to pause/resume animations
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setIsPaused(!isPaused);
          }
        }}
        aria-live="polite"
        aria-atomic="false"
      >
        {/* Top row - left to right */}
        <div 
          className={styles.marqueeRowWrapper} 
          aria-hidden="true"
          role="presentation"
        >
          {renderMarqueeRow(topRowTechs, 'left', topRowRef)}
        </div>
        
        {/* Bottom row - right to left */}
        <div 
          className={`${styles.marqueeRowWrapper} ${styles.marqueeRowDelayed}`} 
          aria-hidden="true"
          role="presentation"
        >
          {renderMarqueeRow(bottomRowTechs, 'right', bottomRowRef)}
        </div>
        
        {/* Screen reader announcement for animation state */}
        <div className={styles.srOnly} aria-live="polite">
          {isPaused ? 'Technology showcase paused' : 'Technology showcase playing'}
        </div>
      </div>
    </div>
  );
};

export default RightSection;