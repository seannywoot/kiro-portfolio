import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TechMarqueeProps, Technology } from '../../../lib/types';
import ScreenReaderOnly from '../../common/ScreenReaderOnly/ScreenReaderOnly';
// import { motion } from '../../../lib/accessibility';
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
    // Duplicate the technologies array twice to create seamless infinite scroll
    // This ensures smooth looping without gaps
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
    <section className={styles.techMarqueeSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 id="technologies-heading" className={styles.title}>Technologies & Tools</h2>
          <p className={styles.subtitle}>
            Crafting modern experiences with cutting-edge technologies
          </p>
        </div>
        
        {/* Screen reader accessible list of technologies */}
        <ScreenReaderOnly>
          <h3>Complete list of technologies:</h3>
          <ul>
            {technologies.map((tech, index) => (
              <li key={`sr-${tech.name}-${index}`}>
                {tech.name} - {tech.category}
              </li>
            ))}
          </ul>
        </ScreenReaderOnly>
        
        <div 
          className={`${styles.marqueeContainer} ${isPaused ? styles.paused : ''}`}
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
        
        <ScreenReaderOnly id="tech-description">
          This section displays an animated showcase of {technologies.length} technologies and tools used in development, 
          including {technologies.map(tech => tech.name).join(', ')}.
        </ScreenReaderOnly>
      </div>
    </section>
  );
};

export default TechMarquee;