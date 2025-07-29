/**
 * Performance Optimizer for Diagonal Marquee Layout
 * Provides utilities for monitoring and optimizing performance in real-time
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  isVisible: boolean;
  intersectionRatio: number;
}

export interface PerformanceSettings {
  animationQuality: 'minimal' | 'low' | 'medium' | 'high';
  hardwareAcceleration: 'disabled' | 'minimal' | 'moderate' | 'enabled';
  visibilityLevel: 'none' | 'partial' | 'full';
}

export class DiagonalMarqueePerformanceOptimizer {
  private frameCount = 0;
  private lastTime = performance.now();
  private animationId: number | null = null;
  private performanceCallback?: (metrics: PerformanceMetrics) => void;
  private targetFPS = 60;
  private performanceHistory: number[] = [];
  private maxHistoryLength = 10;

  constructor(
    private element: HTMLElement,
    private options: {
      targetFPS?: number;
      onPerformanceChange?: (settings: PerformanceSettings) => void;
    } = {}
  ) {
    this.targetFPS = options.targetFPS || 60;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(callback?: (metrics: PerformanceMetrics) => void): void {
    this.performanceCallback = callback;
    this.measurePerformance();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.performanceCallback = undefined;
  }

  /**
   * Apply performance settings to element
   */
  applyPerformanceSettings(settings: PerformanceSettings): void {
    const { animationQuality, hardwareAcceleration, visibilityLevel } = settings;

    // Apply CSS custom properties for performance optimization
    this.element.style.setProperty('--animation-quality', animationQuality);
    this.element.style.setProperty('--hardware-acceleration', hardwareAcceleration);
    this.element.style.setProperty('--visibility-level', visibilityLevel);

    // Apply performance-specific optimizations
    this.applyHardwareAcceleration(hardwareAcceleration);
    this.applyAnimationQuality(animationQuality);
  }

  /**
   * Get optimal performance settings based on current metrics
   */
  getOptimalSettings(metrics: PerformanceMetrics): PerformanceSettings {
    const { fps, isVisible, intersectionRatio } = metrics;

    // Determine visibility level
    let visibilityLevel: PerformanceSettings['visibilityLevel'] = 'none';
    if (intersectionRatio > 0.5) {
      visibilityLevel = 'full';
    } else if (intersectionRatio > 0.1) {
      visibilityLevel = 'partial';
    }

    // Determine animation quality based on FPS
    let animationQuality: PerformanceSettings['animationQuality'] = 'high';
    let hardwareAcceleration: PerformanceSettings['hardwareAcceleration'] = 'enabled';

    if (!isVisible) {
      animationQuality = 'low';
      hardwareAcceleration = 'minimal';
    } else if (fps < 30) {
      animationQuality = 'minimal';
      hardwareAcceleration = 'disabled';
    } else if (fps < 45) {
      animationQuality = 'low';
      hardwareAcceleration = 'minimal';
    } else if (fps < 55) {
      animationQuality = 'medium';
      hardwareAcceleration = 'moderate';
    }

    return {
      animationQuality,
      hardwareAcceleration,
      visibilityLevel
    };
  }

  /**
   * Create intersection observer for visibility tracking
   */
  createIntersectionObserver(
    callback: (isVisible: boolean, intersectionRatio: number) => void
  ): IntersectionObserver {
    return new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;
        callback(isVisible, intersectionRatio);
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '150px 0px' // Generous margin for performance preparation
      }
    );
  }

  /**
   * Optimize clip-path performance
   */
  optimizeClipPath(element: HTMLElement, quality: PerformanceSettings['animationQuality']): void {
    if (quality === 'minimal' || quality === 'low') {
      // Disable clip-path on low performance
      element.style.clipPath = 'none';
      (element.style as any).webkitClipPath = 'none';
    } else {
      // Re-enable clip-path for better quality
      const clipPath = element.dataset.originalClipPath;
      if (clipPath) {
        element.style.clipPath = clipPath;
        (element.style as any).webkitClipPath = clipPath;
      }
    }
  }

  /**
   * Get memory usage if available
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Measure performance metrics
   */
  private measurePerformance = (currentTime: number = performance.now()): void => {
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      const frameTime = (currentTime - this.lastTime) / this.frameCount;
      
      // Update performance history
      this.performanceHistory.push(fps);
      if (this.performanceHistory.length > this.maxHistoryLength) {
        this.performanceHistory.shift();
      }

      const metrics: PerformanceMetrics = {
        fps,
        frameTime,
        memoryUsage: this.getMemoryUsage(),
        isVisible: this.isElementVisible(),
        intersectionRatio: this.getIntersectionRatio()
      };

      // Call performance callback
      if (this.performanceCallback) {
        this.performanceCallback(metrics);
      }

      // Auto-optimize if performance callback is not handling it
      if (!this.performanceCallback && this.options.onPerformanceChange) {
        const optimalSettings = this.getOptimalSettings(metrics);
        this.options.onPerformanceChange(optimalSettings);
        this.applyPerformanceSettings(optimalSettings);
      }

      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development' && fps < this.targetFPS * 0.9) {
        console.warn(`Performance warning: ${fps}fps (target: ${this.targetFPS}fps)`);
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.animationId = requestAnimationFrame(this.measurePerformance);
  };

  /**
   * Check if element is visible
   */
  private isElementVisible(): boolean {
    const rect = this.element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  /**
   * Get intersection ratio (approximation)
   */
  private getIntersectionRatio(): number {
    const rect = this.element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.bottom < 0 || rect.top > windowHeight) {
      return 0;
    }
    
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(windowHeight, rect.bottom);
    const visibleHeight = visibleBottom - visibleTop;
    const totalHeight = rect.height;
    
    return totalHeight > 0 ? visibleHeight / totalHeight : 0;
  }

  /**
   * Apply hardware acceleration settings
   */
  private applyHardwareAcceleration(level: PerformanceSettings['hardwareAcceleration']): void {
    switch (level) {
      case 'enabled':
        this.element.style.transform = 'translate3d(0, 0, 0)';
        this.element.style.backfaceVisibility = 'hidden';
        this.element.style.perspective = '1000px';
        this.element.style.willChange = 'transform, opacity';
        break;
      case 'moderate':
        this.element.style.transform = 'translate3d(0, 0, 0)';
        this.element.style.backfaceVisibility = 'hidden';
        this.element.style.willChange = 'transform';
        break;
      case 'minimal':
        this.element.style.transform = 'translateZ(0)';
        this.element.style.willChange = 'auto';
        break;
      case 'disabled':
        this.element.style.transform = 'none';
        this.element.style.willChange = 'auto';
        break;
    }
  }

  /**
   * Apply animation quality settings
   */
  private applyAnimationQuality(quality: PerformanceSettings['animationQuality']): void {
    const animatedElements = this.element.querySelectorAll('[class*="marquee"]');
    
    animatedElements.forEach((el) => {
      const element = el as HTMLElement;
      switch (quality) {
        case 'high':
          element.style.animationTimingFunction = 'linear';
          element.style.transformStyle = 'preserve-3d';
          break;
        case 'medium':
          element.style.animationTimingFunction = 'linear';
          element.style.transformStyle = 'flat';
          break;
        case 'low':
          element.style.animationTimingFunction = 'linear';
          element.style.transform = 'translate3d(0, 0, 0) scale(0.99)';
          break;
        case 'minimal':
          element.style.animationTimingFunction = 'ease-out';
          element.style.transform = 'translateX(0) scale(0.98)';
          break;
      }
    });
  }

  /**
   * Get average FPS from performance history
   */
  getAverageFPS(): number {
    if (this.performanceHistory.length === 0) return 60;
    return this.performanceHistory.reduce((sum, fps) => sum + fps, 0) / this.performanceHistory.length;
  }

  /**
   * Check if performance is stable
   */
  isPerformanceStable(): boolean {
    if (this.performanceHistory.length < 3) return true;
    
    const recent = this.performanceHistory.slice(-3);
    const variance = recent.reduce((sum, fps) => {
      const avg = recent.reduce((s, f) => s + f, 0) / recent.length;
      return sum + Math.pow(fps - avg, 2);
    }, 0) / recent.length;
    
    return variance < 25; // Low variance indicates stable performance
  }
}

/**
 * Utility function to create and configure performance optimizer
 */
export function createDiagonalMarqueeOptimizer(
  element: HTMLElement,
  options?: {
    targetFPS?: number;
    autoOptimize?: boolean;
  }
): DiagonalMarqueePerformanceOptimizer {
  const optimizer = new DiagonalMarqueePerformanceOptimizer(element, {
    targetFPS: options?.targetFPS || 60,
    onPerformanceChange: options?.autoOptimize ? (settings) => {
      // Auto-apply optimal settings
      optimizer.applyPerformanceSettings(settings);
    } : undefined
  });

  return optimizer;
}