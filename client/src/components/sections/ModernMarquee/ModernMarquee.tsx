import React, { useRef } from 'react';
import { Technology } from '../../../lib/types';
import styles from './ModernMarquee.module.css';

interface ModernMarqueeProps {
  technologies: Technology[];
  speed?: number;
}

const ModernMarquee: React.FC<ModernMarqueeProps> = ({
  technologies,
  speed = 25
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // No 3D rotations needed for flat design

  // Create multiple columns of icons for the vertical diagonal effect
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

      {/* Right section with marquee */}
      <div className={styles.rightSection}>
        <div className={styles.marqueeContainer}>
          {createIconColumns()}
        </div>
      </div>
      

    </div>
  );
};

export default ModernMarquee;