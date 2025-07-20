import React from 'react';
import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { cn } from '../../../lib/utils';

export interface ScrollIndicatorProps {
  className?: string;
  showPercentage?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  thickness?: number;
  color?: string;
}

/**
 * ScrollIndicator - Visual indicator showing scroll progress
 * Can be positioned on any side of the viewport
 */
export function ScrollIndicator({
  className,
  showPercentage = false,
  position = 'top',
  thickness = 4,
  color = 'bg-[var(--primary)]',
  ...props
}: ScrollIndicatorProps & React.HTMLAttributes<HTMLDivElement>) {
  const { progress } = useScrollProgress();
  const percentage = Math.round(progress * 100);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50';
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-50';
      case 'left':
        return 'fixed top-0 left-0 bottom-0 z-50';
      case 'right':
        return 'fixed top-0 right-0 bottom-0 z-50';
      default:
        return 'fixed top-0 left-0 right-0 z-50';
    }
  };

  const getProgressBarStyle = () => {
    const isHorizontal = position === 'top' || position === 'bottom';
    
    if (isHorizontal) {
      return {
        width: `${percentage}%`,
        height: `${thickness}px`,
        transition: 'width 0.1s ease-out'
      };
    } else {
      return {
        height: `${percentage}%`,
        width: `${thickness}px`,
        transition: 'height 0.1s ease-out'
      };
    }
  };

  const getContainerStyle = () => {
    const isHorizontal = position === 'top' || position === 'bottom';
    
    return {
      [isHorizontal ? 'height' : 'width']: `${thickness}px`
    };
  };

  return (
    <div
      className={cn(
        getPositionClasses(),
        'bg-gray-200/20 backdrop-blur-sm',
        className
      )}
      style={getContainerStyle()}
      {...props}
    >
      <div
        className={cn(color, 'transition-all duration-100 ease-out')}
        style={getProgressBarStyle()}
      />
      
      {showPercentage && (
        <div
          className={cn(
            'absolute text-xs font-medium text-white bg-black/50 px-2 py-1 rounded',
            position === 'top' ? 'top-full mt-2' : '',
            position === 'bottom' ? 'bottom-full mb-2' : '',
            position === 'left' ? 'left-full ml-2' : '',
            position === 'right' ? 'right-full mr-2' : '',
            'left-1/2 transform -translate-x-1/2'
          )}
        >
          {percentage}%
        </div>
      )}
    </div>
  );
}

/**
 * CircularScrollIndicator - Circular progress indicator for scroll
 */
export function CircularScrollIndicator({
  className,
  size = 60,
  strokeWidth = 4,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  ...props
}: {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { progress } = useScrollProgress();
  const percentage = Math.round(progress * 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-opacity duration-300',
        progress > 0.05 ? 'opacity-100' : 'opacity-0',
        className
      )}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-100 ease-out"
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}

export default ScrollIndicator;