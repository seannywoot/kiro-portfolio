import React from 'react';
import styles from './LeftSection.module.css';

interface LeftSectionProps {
  title: string;
  subtitle: string;
  className?: string;
}

const LeftSection: React.FC<LeftSectionProps> = ({
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div 
      className={`${styles.leftSection} ${className}`}
      role="banner"
      aria-label="Technology section introduction"
    >
      <div className={styles.content}>
        <h2 
          id="technologies-heading" 
          className={styles.title}
          aria-level={2}
        >
          {title}
        </h2>
        <p 
          className={styles.subtitle}
          aria-describedby="technologies-heading"
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default LeftSection;