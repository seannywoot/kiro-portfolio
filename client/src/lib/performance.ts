/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics interface
export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('FID', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.reportMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // First Contentful Paint (FCP)
    this.measureFCP();
    
    // Time to First Byte (TTFB)
    this.measureTTFB();
  }

  private measureFCP() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
        this.reportMetric('FCP', fcpEntry.startTime);
      }
    }
  }

  private measureTTFB() {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;
      const ttfb = timing.responseStart - timing.navigationStart;
      this.metrics.ttfb = ttfb;
      this.reportMetric('TTFB', ttfb);
    }
  }

  private reportMetric(name: string, value: number) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${Math.round(value)}ms`);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: gtag('event', 'web_vital', { name, value: Math.round(value) });
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image lazy loading utility
export class ImageLoader {
  private static instance: ImageLoader;
  private loadedImages = new Set<string>();
  private observer?: IntersectionObserver;

  private constructor() {
    this.initializeObserver();
  }

  public static getInstance(): ImageLoader {
    if (!ImageLoader.instance) {
      ImageLoader.instance = new ImageLoader();
    }
    return ImageLoader.instance;
  }

  private initializeObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
              this.observer?.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );
    }
  }

  public observeImage(img: HTMLImageElement) {
    if (this.observer && !this.loadedImages.has(img.src)) {
      this.observer.observe(img);
    }
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (src && !this.loadedImages.has(src)) {
      img.src = src;
      img.classList.add('loaded');
      this.loadedImages.add(src);
      
      img.onload = () => {
        img.classList.add('fade-in');
      };
    }
  }

  public preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.loadedImages.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  public preloadImages(sources: string[]): Promise<void[]> {
    return Promise.all(sources.map(src => this.preloadImage(src)));
  }
}

// Resource hints utility
export const ResourceHints = {
  // Preload critical resources
  preload(href: string, as: string, crossorigin?: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    document.head.appendChild(link);
  },

  // Prefetch resources for future navigation
  prefetch(href: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  },

  // DNS prefetch for external domains
  dnsPrefetch(hostname: string) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${hostname}`;
    document.head.appendChild(link);
  },

  // Preconnect to external origins
  preconnect(href: string, crossorigin?: boolean) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
};

// Bundle size analyzer (development only)
export const BundleAnalyzer = {
  logComponentSize(componentName: string, startTime: number) {
    if (process.env.NODE_ENV === 'development') {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
  },

  measureRenderTime<T extends any[]>(
    fn: (...args: T) => any,
    componentName: string
  ) {
    return (...args: T) => {
      const startTime = performance.now();
      const result = fn(...args);
      const endTime = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      }
      
      return result;
    };
  }
};

// Memory usage monitoring
export const MemoryMonitor = {
  getCurrentUsage(): number | null {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return null;
  },

  logMemoryUsage(label: string) {
    const usage = this.getCurrentUsage();
    if (usage && process.env.NODE_ENV === 'development') {
      console.log(`Memory usage (${label}): ${(usage / 1024 / 1024).toFixed(2)} MB`);
    }
  },

  startMonitoring(interval: number = 30000) {
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        this.logMemoryUsage('Periodic check');
      }, interval);
    }
  }
};

// Frame rate monitoring
export const FrameRateMonitor = {
  frameCount: 0,
  lastTime: 0,
  fps: 0,

  start() {
    const measureFPS = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        
        if (process.env.NODE_ENV === 'development' && this.fps < 30) {
          console.warn(`Low FPS detected: ${this.fps} fps`);
        }
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  },

  getCurrentFPS(): number {
    return this.fps;
  }
};

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  const monitor = new PerformanceMonitor();
  
  // Start memory monitoring in development
  if (process.env.NODE_ENV === 'development') {
    MemoryMonitor.startMonitoring();
    FrameRateMonitor.start();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    monitor.disconnect();
  });

  return monitor;
}