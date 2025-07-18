import React from 'react';
import styles from './ScreenReaderOnly.module.css';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  id?: string;
}

/**
 * Component that renders content only visible to screen readers
 * Useful for providing additional context or instructions for assistive technologies
 */
const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  as: Component = 'span',
  className = '',
  id,
  ...props
}) => {
  return (
    <Component className={`${styles.srOnly} ${className}`} id={id} {...props}>
      {children}
    </Component>
  );
};

export default ScreenReaderOnly;