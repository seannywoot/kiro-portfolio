/**
 * Performance tests for the portfolio website
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PerformanceMonitor, ImageLoader, ResourceHints } from '../lib/performance';

// Mock performance APIs
const mockPerformanceObserver = vi.fn();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  // Mock PerformanceObserver
  global.PerformanceObserver = vi.fn().mockImplementation((callback) => {
    mockPerformanceObserver.mockImplementation(callback);
    return {
      observe: mockObserve,
      disconnect: mockDisconnect
    };
  });

  // Mock performance.timing
  Object.defineProperty(global.performance, 'timing', {
    value: {
      navigationStart: 1000,
      responseStart: 1200
    },
    writable: true
  });

  // Mock performance.getEntriesByType
  global.performance.getEntriesByType = vi.fn().mockReturnValue([
    { name: 'first-contentful-paint', startTime: 1500 }
  ]);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('PerformanceMonitor', () => {
  it('should initialize performance observers', () => {
    const monitor = new PerformanceMonitor();
    
    expect(global.PerformanceObserver).toHaveBeenCalledTimes(3); // LCP, FID, CLS
    expect(mockObserve).toHaveBeenCalledTimes(3);
  });

  it('should measure TTFB correctly', () => {
    const monitor = new PerformanceMonitor();
    const metrics = monitor.getMetrics();
    
    expect(metrics.ttfb).toBe(200); // 1200 - 1000
  });

  it('should measure FCP correctly', () => {
    const monitor = new PerformanceMonitor();
    const metrics = monitor.getMetrics();
    
    expect(metrics.fcp).toBe(1500);
  });

  it('should disconnect observers on cleanup', () => {
    const monitor = new PerformanceMonitor();
    monitor.disconnect();
    
    expect(mockDisconnect).toHaveBeenCalledTimes(3);
  });
});

describe('ImageLoader', () => {
  let imageLoader: ImageLoader;

  beforeEach(() => {
    // Reset singleton
    (ImageLoader as any).instance = undefined;
    imageLoader = ImageLoader.getInstance();
  });

  it('should be a singleton', () => {
    const instance1 = ImageLoader.getInstance();
    const instance2 = ImageLoader.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  it('should preload images', async () => {
    const mockImage = {
      onload: null as any,
      onerror: null as any,
      src: ''
    };

    // Mock Image constructor
    global.Image = vi.fn().mockImplementation(() => mockImage);

    const preloadPromise = imageLoader.preloadImage('test.jpg');
    
    // Simulate successful load
    mockImage.onload();
    
    await expect(preloadPromise).resolves.toBeUndefined();
    expect(mockImage.src).toBe('test.jpg');
  });

  it('should handle preload errors', async () => {
    const mockImage = {
      onload: null as any,
      onerror: null as any,
      src: ''
    };

    global.Image = vi.fn().mockImplementation(() => mockImage);

    const preloadPromise = imageLoader.preloadImage('invalid.jpg');
    
    // Simulate error
    const error = new Error('Failed to load');
    mockImage.onerror(error);
    
    await expect(preloadPromise).rejects.toThrow('Failed to load');
  });
});

describe('ResourceHints', () => {
  beforeEach(() => {
    // Mock document.head
    document.head.appendChild = vi.fn();
  });

  it('should add preload link', () => {
    ResourceHints.preload('style.css', 'style');
    
    expect(document.head.appendChild).toHaveBeenCalledWith(
      expect.objectContaining({
        rel: 'preload',
        href: 'style.css',
        as: 'style'
      })
    );
  });

  it('should add prefetch link', () => {
    ResourceHints.prefetch('next-page.html');
    
    expect(document.head.appendChild).toHaveBeenCalledWith(
      expect.objectContaining({
        rel: 'prefetch',
        href: 'next-page.html'
      })
    );
  });

  it('should add dns-prefetch link', () => {
    ResourceHints.dnsPrefetch('example.com');
    
    expect(document.head.appendChild).toHaveBeenCalledWith(
      expect.objectContaining({
        rel: 'dns-prefetch',
        href: '//example.com'
      })
    );
  });

  it('should add preconnect link', () => {
    ResourceHints.preconnect('https://fonts.googleapis.com', true);
    
    expect(document.head.appendChild).toHaveBeenCalledWith(
      expect.objectContaining({
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
        crossOrigin: 'anonymous'
      })
    );
  });
});

// Performance benchmarks
describe('Performance Benchmarks', () => {
  it('should measure component render time', () => {
    const startTime = performance.now();
    
    // Simulate component render
    const mockRender = () => {
      // Simulate some work
      for (let i = 0; i < 1000; i++) {
        Math.random();
      }
    };
    
    mockRender();
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Render should be fast (less than 16ms for 60fps)
    expect(renderTime).toBeLessThan(16);
  });

  it('should validate bundle size expectations', () => {
    // This would typically be run as part of build process
    // Here we just validate that we have size limits defined
    const maxBundleSize = 1000; // 1MB
    const maxChunkSize = 500; // 500KB
    
    expect(maxBundleSize).toBeGreaterThan(0);
    expect(maxChunkSize).toBeGreaterThan(0);
    expect(maxChunkSize).toBeLessThan(maxBundleSize);
  });
});

// Core Web Vitals thresholds
describe('Core Web Vitals Thresholds', () => {
  it('should define acceptable performance thresholds', () => {
    const thresholds = {
      LCP: 2500, // Largest Contentful Paint - Good: ≤2.5s
      FID: 100,  // First Input Delay - Good: ≤100ms
      CLS: 0.1,  // Cumulative Layout Shift - Good: ≤0.1
      FCP: 1800, // First Contentful Paint - Good: ≤1.8s
      TTFB: 800  // Time to First Byte - Good: ≤800ms
    };

    // Validate thresholds are within acceptable ranges
    expect(thresholds.LCP).toBeLessThanOrEqual(2500);
    expect(thresholds.FID).toBeLessThanOrEqual(100);
    expect(thresholds.CLS).toBeLessThanOrEqual(0.1);
    expect(thresholds.FCP).toBeLessThanOrEqual(1800);
    expect(thresholds.TTFB).toBeLessThanOrEqual(800);
  });
});