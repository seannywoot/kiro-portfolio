import React, { useState } from 'react';
import { Technology, ImageIcon } from '../../../lib/types';
import { isImageIcon, getFallbackIcon } from '../../../lib/portfolio-data';
import styles from './TechIcon.module.css';

interface TechIconProps {
  technology: Technology;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ technology, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const { icon, name } = technology;

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle string icons (emojis)
  if (typeof icon === 'string') {
    return (
      <span className={`${styles.techIcon} ${styles.emojiIcon} ${className}`}>
        {icon}
      </span>
    );
  }

  // Handle ImageIcon objects
  if (isImageIcon(icon) && !imageError) {
    return (
      <img
        src={icon.src}
        alt={icon.alt}
        className={`${styles.techIcon} ${styles.imageIcon} ${className}`}
        onError={handleImageError}
        loading="lazy"
      />
    );
  }

  // Handle React components
  if (typeof icon === 'function') {
    const IconComponent = icon;
    return (
      <span className={`${styles.techIcon} ${styles.componentIcon} ${className}`}>
        <IconComponent />
      </span>
    );
  }

  // Fallback to emoji or first letter
  const fallbackIcon = isImageIcon(icon) && icon.fallback 
    ? icon.fallback 
    : getFallbackIcon(technology);

  return (
    <span className={`${styles.techIcon} ${styles.fallbackIcon} ${className}`}>
      {fallbackIcon}
    </span>
  );
};

export default TechIcon;