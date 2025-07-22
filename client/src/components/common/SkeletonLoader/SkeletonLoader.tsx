import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  variant?: 'default' | 'card' | 'profile' | 'list' | 'hero' | 'project';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'default',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={styles.card}>
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className={styles.profile}>
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={styles.listItem}>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        );

      case 'hero':
        return (
          <div className={styles.hero}>
            <div className="space-y-4 text-center">
              <Skeleton className="h-12 w-96 mx-auto" />
              <Skeleton className="h-8 w-80 mx-auto" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>
            <Skeleton className="h-12 w-32 mx-auto mt-8 rounded-full" />
          </div>
        );

      case 'project':
        return (
          <div className={styles.project}>
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-3 mt-4">
              <Skeleton className="h-7 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-18 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.default}>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        );
    }
  };

  return (
    <div className={`${styles.container} ${className}`} role="status" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.item}>
          {renderSkeleton()}
        </div>
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

export default SkeletonLoader;