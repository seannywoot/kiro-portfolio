import React from 'react';
import styles from './DiagonalContainer.module.css';

interface DiagonalContainerProps {
  children: React.ReactNode;
  className?: string;
  diagonalAngle?: number;
  leftWidth?: string;
  rightWidth?: string;
}

const DiagonalContainer: React.FC<DiagonalContainerProps> = ({
  children,
  className = '',
  diagonalAngle = 15,
  leftWidth = '40%',
  rightWidth = '60%'
}) => {
  // Create CSS custom properties for dynamic configuration
  const customProperties = {
    '--diagonal-angle': `${diagonalAngle}deg`,
    '--left-width': leftWidth,
    '--right-width': rightWidth
  } as React.CSSProperties;

  return (
    <div 
      className={`${styles.diagonalContainer} ${className}`}
      style={customProperties}
      role="region"
      aria-labelledby="technologies-heading"
      aria-describedby="tech-description"
    >
      {children}
    </div>
  );
};

export default DiagonalContainer;