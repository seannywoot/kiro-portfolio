import React, { useState, useEffect } from 'react';
import ScreenReaderOnly from '../ScreenReaderOnly/ScreenReaderOnly';
import styles from './ScrollProgress.module.css';

const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const progressPercentage = Math.round(scrollProgress);

  return (
    <div 
      className={styles.scrollProgress}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={progressPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${progressPercentage}% scrolled`}
    >
      <div 
        className={styles.progressBar}
        style={{ width: `${scrollProgress}%` }}
      />
      <ScreenReaderOnly>
        Page scroll progress: {progressPercentage}% complete
      </ScreenReaderOnly>
    </div>
  );
};

export default ScrollProgress;