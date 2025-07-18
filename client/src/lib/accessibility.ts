/**
 * Accessibility utilities and helpers
 */

// Focus management utilities
export const focusManagement = {
  // Trap focus within a container (useful for modals)
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  // Restore focus to previously focused element
  restoreFocus: (previousElement: HTMLElement | null) => {
    if (previousElement) {
      previousElement.focus();
    }
  }
};

// Screen reader utilities
export const screenReader = {
  // Announce content to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
};

// Keyboard navigation utilities
export const keyboard = {
  // Handle escape key
  onEscape: (callback: () => void) => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  },

  // Handle enter and space keys for custom buttons
  onActivate: (callback: () => void) => {
    return (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
      }
    };
  }
};

// Touch and gesture utilities
export const touch = {
  // Enhanced touch target size check
  isTouchTarget: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // WCAG recommended minimum touch target size
    return rect.width >= minSize && rect.height >= minSize;
  },

  // Add touch feedback
  addTouchFeedback: (element: HTMLElement) => {
    let touchStartTime: number;
    
    const handleTouchStart = () => {
      touchStartTime = Date.now();
      element.style.transform = 'scale(0.95)';
      element.style.transition = 'transform 0.1s ease-out';
    };
    
    const handleTouchEnd = () => {
      const touchDuration = Date.now() - touchStartTime;
      const delay = touchDuration < 100 ? 100 - touchDuration : 0;
      
      setTimeout(() => {
        element.style.transform = '';
        element.style.transition = 'transform 0.2s ease-out';
      }, delay);
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }
};

// Motion preferences
export const motion = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Create a media query listener for reduced motion
  onReducedMotionChange: (callback: (prefersReduced: boolean) => void) => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    callback(mediaQuery.matches); // Initial call
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }
};

// Color contrast and theme utilities
export const theme = {
  // Check if user prefers dark mode
  prefersDarkMode: (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  // Listen for theme changes
  onThemeChange: (callback: (isDark: boolean) => void) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    callback(mediaQuery.matches); // Initial call
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }
};