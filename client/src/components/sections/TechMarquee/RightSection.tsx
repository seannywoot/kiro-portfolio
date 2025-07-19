import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Technology } from '../../../lib/types';
import TechIcon from './TechIcon';
import styles from './RightSection.module.css';

interface RightSectionProps {
  technologies: Technology[];
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

const RightSection: React.FC<RightSectionProps> = ({
  technologies,
  speed = 50,
  pauseOnHover = true,
  className = ''
}) => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Split technologies into two rows for dual marquee effect
  const midpoint = Math.ceil(technologies.length / 2);
  const topRowTechs = technologies.slice(0, midpoint);
  const bottomRowTechs = technologies.slice(midpoint);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
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
    <div className={`${styles.rightSection} ${className}`} ref={containerRef}>
      <div 
        className={`${styles.marqueeContainer} ${isPaused ? styles.paused : ''} ${!isVisible ? styles.hidden : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="img"
        aria-label="Animated showcase of technologies and tools"
        aria-describedby="tech-description"
      >
        {/* Top row - left to right */}
        <div className={styles.marqueeRowWrapper} aria-hidden="true">
          {renderMarqueeRow(topRowTechs, 'left', topRowRef)}
        </div>
        
        {/* Bottom row - right to left */}
        <div className={`${styles.marqueeRowWrapper} ${styles.marqueeRowDelayed}`} aria-hidden="true">
          {renderMarqueeRow(bottomRowTechs, 'right', bottomRowRef)}
        </div>
      </div>
    </div>
  );
};

export default RightSection;