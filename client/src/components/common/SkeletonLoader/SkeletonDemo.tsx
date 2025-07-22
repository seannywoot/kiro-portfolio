import React, { useState } from 'react';
import SkeletonLoader from './SkeletonLoader';
import styles from './SkeletonDemo.module.css';

const SkeletonDemo: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'card' | 'profile' | 'list' | 'hero' | 'project'>('default');
  const [count, setCount] = useState(1);

  const variants = [
    { value: 'default', label: 'Default' },
    { value: 'card', label: 'Card' },
    { value: 'profile', label: 'Profile' },
    { value: 'list', label: 'List' },
    { value: 'hero', label: 'Hero' },
    { value: 'project', label: 'Project' }
  ] as const;

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="variant-select">Variant:</label>
          <select
            id="variant-select"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value as any)}
            className={styles.select}
          >
            {variants.map(variant => (
              <option key={variant.value} value={variant.value}>
                {variant.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.controlGroup}>
          <label htmlFor="count-input">Count:</label>
          <input
            id="count-input"
            type="number"
            min="1"
            max="5"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.preview}>
        <SkeletonLoader variant={selectedVariant} count={count} />
      </div>
    </div>
  );
};

export default SkeletonDemo;