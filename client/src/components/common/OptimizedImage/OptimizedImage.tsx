import React, { useState, useEffect, useRef } from 'react';
import { ImageLoader } from '../../../lib/performance';
import styles from './OptimizedImage.module.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
}

/**
 * Optimized image component with lazy loading, placeholder, and performance monitoring
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  loading = 'lazy',
  onLoad,
  onError,
  sizes,
  srcSet
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const imageLoader = ImageLoader.getInstance();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      observer.observe(imgRef.current);

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [loading]);

  // Handle image loading
  useEffect(() => {
    if (isInView && imgRef.current && !isLoaded) {
      const img = imgRef.current;
      
      const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
      };

      const handleError = () => {
        setHasError(true);
        onError?.();
      };

      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      // Set the src to trigger loading
      if (srcSet) {
        img.srcset = srcSet;
      }
      img.src = src;

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }
  }, [isInView, src, srcSet, isLoaded, onLoad, onError]);

  // Preload critical images
  useEffect(() => {
    if (loading === 'eager') {
      imageLoader.preloadImage(src);
    }
  }, [src, loading, imageLoader]);

  const imageClasses = `
    ${styles.image}
    ${isLoaded ? styles.loaded : styles.loading}
    ${hasError ? styles.error : ''}
    ${className}
  `.trim();

  return (
    <div 
      className={styles.container}
      style={{ 
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined 
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className={styles.placeholder}>
          {placeholder ? (
            <img 
              src={placeholder} 
              alt="" 
              className={styles.placeholderImage}
              aria-hidden="true"
            />
          ) : (
            <div className={styles.placeholderDefault} aria-hidden="true">
              <svg 
                className={styles.placeholderIcon}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className={styles.errorState}>
          <svg 
            className={styles.errorIcon}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <span className={styles.errorText}>Failed to load image</span>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        alt={alt}
        className={imageClasses}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding="async"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default OptimizedImage;