import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TechMarqueeProps, Technology } from '../../../lib/types';
import styles from './TechMarquee.module.css';

const TechMarquee: React.FC<TechMarqueeProps> = ({
  technologies,
  speed = 50,
  pauseOnHover = true
}) => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Split technologies into two rows for dual marquee effect
  const midpoint = Math.ceil(technologies.length / 2);
  const topRowTechs = technologies.slice(0, midpoint);
  const bottomRowTechs = technologies.slice(midpoint);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    // Set CSS custom properties for animation speed
    if (topRowRef.current) {
      topRowRef.current.style.setProperty('--marquee-speed', `${speed}s`);
    }
    if (bottomRowRef.current) {
      bottomRowRef.current.style.setProperty('--marquee-speed', `${speed}s`);
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
      <span className={styles.techIcon}>
        {typeof tech.icon === 'string' ? tech.icon : <tech.icon />}
      </span>
      <span className={styles.techName}>{tech.name}</span>
    </div>
  );

  const renderMarqueeRow = (
    techs: Technology[],
    direction: 'left' | 'right',
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    // Duplicate the technologies array to create seamless infinite scroll
    const duplicatedTechs = [...techs, ...techs, ...techs];

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
    <section className={styles.techMarqueeSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Technologies & Tools</h2>
          <p className={styles.subtitle}>
            Crafting modern experiences with cutting-edge technologies
          </p>
        </div>
        
        <div 
          className={`${styles.marqueeContainer} ${isPaused ? styles.paused : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top row - left to right */}
          {renderMarqueeRow(topRowTechs, 'left', topRowRef)}
          
          {/* Bottom row - right to left */}
          {renderMarqueeRow(bottomRowTechs, 'right', bottomRowRef)}
        </div>
      </div>
    </section>
  );
};

export default TechMarquee;