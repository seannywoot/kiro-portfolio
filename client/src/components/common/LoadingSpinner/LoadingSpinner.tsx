import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  className = ''
}) => {
  return (
    <div className={`${styles.container} ${className}`} role="status" aria-live="polite">
      <div 
        className={`${styles.spinner} ${styles[size]} ${styles[color]}`}
        aria-hidden="true"
      />
      {text && (
        <span className={styles.text}>
          {text}
        </span>
      )}
      <span className="sr-only">
        {text || 'Loading...'}
      </span>
    </div>
  );
};

export default LoadingSpinner;