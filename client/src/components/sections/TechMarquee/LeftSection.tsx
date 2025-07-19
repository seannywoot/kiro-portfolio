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
    <div className={`${styles.leftSection} ${className}`}>
      <div className={styles.content}>
        <h2 id="technologies-heading" className={styles.title}>
          {title}
        </h2>
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default LeftSection;