import React, { useRef } from 'react';
import { Technology } from '../../../lib/types';
import styles from './ModernMarquee.module.css';

interface ModernMarqueeProps {
  technologies: Technology[];
  speed?: number;
  pauseOnHover?: boolean;
}

const ModernMarquee: React.FC<ModernMarqueeProps> = ({
  technologies,
  speed = 25
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create multiple columns of icons for the vertical diagonal effect (desktop)
  const createIconColumns = () => {
    const columns = [];
    const iconsPerColumn = 6;
    const totalColumns = 3;
    
    for (let col = 0; col < totalColumns; col++) {
      const columnIcons = [];
      for (let i = 0; i < iconsPerColumn; i++) {
        const techIndex = (col * iconsPerColumn + i) % technologies.length;
        const tech = technologies[techIndex];
        columnIcons.push(
          <div key={`${col}-${i}-${tech.name}`} className={styles.iconContainer}>
            <div className={styles.iconWrapper}>
              {typeof tech.icon === 'string' ? (
                <span className={styles.iconEmoji}>{tech.icon}</span>
              ) : tech.icon && typeof tech.icon === 'object' && 'src' in tech.icon ? (
                <img 
                  src={tech.icon.src} 
                  alt={tech.icon.alt || tech.name}
                  className={styles.iconImage}
                />
              ) : (
                <span className={styles.iconEmoji}>💻</span>
              )}
            </div>
          </div>
        );
      }
      
      columns.push(
        <div 
          key={col} 
          className={`${styles.marqueeColumn} ${col === 1 ? styles.columnDown : styles.columnUp}`}
          style={{ 
            '--column-delay': `${col * 0.5}s`,
            '--animation-duration': `${speed}s`
          } as React.CSSProperties}
        >
          <div className={styles.columnContent}>
            {/* Triple for seamless infinite loop with unique keys */}
            {columnIcons}
            {columnIcons.map((icon, idx) => 
              React.cloneElement(icon, { key: `${icon.key}-copy1-${idx}` })
            )}
            {columnIcons.map((icon, idx) => 
              React.cloneElement(icon, { key: `${icon.key}-copy2-${idx}` })
            )}
          </div>
        </div>
      );
    }
    
    return columns;
  };

  // Create horizontal three-row marquee for mobile
  const createMobileMarqueeRows = () => {
    const rows = [];
    const iconsPerRow = Math.ceil(technologies.length / 3);
    
    for (let row = 0; row < 3; row++) {
      const rowIcons = [];
      for (let i = 0; i < iconsPerRow; i++) {
        const techIndex = (row * iconsPerRow + i) % technologies.length;
        const tech = technologies[techIndex];
        rowIcons.push(
          <div key={`mobile-${row}-${i}-${tech.name}`} className={styles.mobileIconContainer}>
            <div className={styles.mobileIconWrapper}>
              {typeof tech.icon === 'string' ? (
                <span className={styles.mobileIconEmoji}>{tech.icon}</span>
              ) : tech.icon && typeof tech.icon === 'object' && 'src' in tech.icon ? (
                <img 
                  src={tech.icon.src} 
                  alt={tech.icon.alt || tech.name}
                  className={styles.mobileIconImage}
                />
              ) : (
                <span className={styles.mobileIconEmoji}>💻</span>
              )}
            </div>
          </div>
        );
      }

      // Create the row with alternating directions
      rows.push(
        <div 
          key={row} 
          className={`${styles.mobileMarqueeRow} ${row === 1 ? styles.mobileRowReverse : styles.mobileRowForward}`}
          style={{ 
            '--row-delay': `${row * 0.3}s`,
            '--mobile-animation-duration': `${speed * 0.8}s`
          } as React.CSSProperties}
        >
          <div className={styles.mobileMarqueeTrack}>
            {/* Triple the content for seamless loop */}
            {rowIcons}
            {rowIcons.map((icon, idx) => 
              React.cloneElement(icon, { key: `${icon.key}-copy1-${idx}` })
            )}
            {rowIcons.map((icon, idx) => 
              React.cloneElement(icon, { key: `${icon.key}-copy2-${idx}` })
            )}
          </div>
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div 
      ref={containerRef}
      className={styles.modernMarquee}
      role="region"
      aria-label="Technology showcase"
    >
      {/* Left section with title */}
      <div className={styles.leftSection}>
        <div className={styles.textContent}>
          <h2 className={styles.sectionTitle}>Technologies I Use</h2>
          <p className={styles.sectionSubtitle}>
            Crafting modern experiences with cutting-edge tools and frameworks
          </p>
        </div>
      </div>

      {/* Right section with marquee - desktop only */}
      <div className={styles.rightSection}>
        <div className={styles.marqueeContainer}>
          {createIconColumns()}
        </div>
      </div>

      {/* Mobile three-row horizontal marquee */}
      <div className={styles.mobileMarqueeSection}>
        <div className={styles.mobileMarqueeContainer}>
          {createMobileMarqueeRows()}
        </div>
      </div>
    </div>
  );
};

export default ModernMarquee;