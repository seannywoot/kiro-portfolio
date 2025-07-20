import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TechMarquee from '../TechMarquee';
import type { Technology } from '../../../../lib/types';

// Mock performance APIs
const mockPerformanceObserver = vi.fn();
const mockPerformanceNow = vi.fn(() => Date.now());

Object.defineProperty(global, 'PerformanceObserver', {
  writable: true,
  value: mockPerformanceObserver
});

Object.defineProperty(global.performance, 'now', {
  writable: true,
  value: mockPerformanceNow
});

// Mock performance optimizer
const mockOptimizer = {
  createIntersectionObserver: vi.fn((callback) => {
    setTimeout(() => callback(true, 1), 0);
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
  startMonitoring: vi.fn(),
  stopMonitoring: vi.fn(),
  getOptimalSettings: vi.fn(() => ({
    animationQuality: 'high',
    hardwareAcceleration: 'enabled',
    visibilityLevel: 'full'
  })),
  applyPerformanceSettings: vi.fn()
};

vi.mock('../../../../lib/performance-optimizer', () => ({
  createDiagonalMarqueeOptimizer: vi.fn(() => mockOptimizer)
}));

const mockTechnologies: Technology[] = Array.from({ length: 20 }, (_, i) => ({
  name: `Technology ${i}`,
  icon: '🔧',
  category: 'tools'
}));

describe('TechMarquee Enhanced Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformanceNow.mockReturnValue(Date.now());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('60fps Animation Optimization', () => {
    it('should optimize animation performance for 60fps target', async () => {
      // Mock high-precision timing
      const mockRAF = vi.fn();
      const originalRAF = global.requestAnimationFrame;
      global.requestAnimationFrame = mockRAF;
      
      render(<TechMarquee technologies={mockTechnologies} speed={50} />);
      
      await waitFor(() => {
        expect(mockOptimizer.getOptimalSettings).toHaveBeenCalled();
      });
      
      // Check that animation frame optimizations are applied
      const sectionsWithRegion = screen.getAllByRole('region');
      const mainSection = sectionsWithRegion[0];
      expect(mainSection).toBeDefined();
      expect(mainSection?.style.getPropertyValue('--animation-quality')).toBe('high');
      
      global.requestAnimationFrame = originalRAF;
    });

    it('should apply diagonal layout optimizations', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const sectionsWithRegion = screen.getAllByRole('region');
      const mainSection = sectionsWithRegion[0];
      
      // Check for diagonal-specific performance properties
      expect(mainSection).toHaveAttribute('data-performance-mode');
      expect(mainSection).toBeDefined();
    });

    it('should maintain consistent frame rates across viewports', async () => {
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];

      for (const viewport of viewports) {
        // Mock viewport dimensions
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });

        const { unmount } = render(<TechMarquee technologies={mockTechnologies} />);
        
        await waitFor(() => {
          expect(mockOptimizer.getOptimalSettings).toHaveBeenCalled();
        });

        // Performance should be optimized for each viewport
        const sectionsWithRegion = screen.getAllByRole('region');
        const mainSection = sectionsWithRegion[0];
        expect(mainSection?.style.getPropertyValue('--performance-mode')).toBe('high');
        
        unmount();
        vi.clearAllMocks();
      }
    });
  });

  describe('Large Dataset Performance', () => {
    it('should handle large technology datasets efficiently', async () => {
      const largeTechDataset: Technology[] = Array.from({ length: 100 }, (_, i) => ({
        name: `Technology ${i}`,
        icon: '🔧',
        category: 'tools'
      }));

      const startTime = performance.now();
      render(<TechMarquee technologies={largeTechDataset} />);
      const renderTime = performance.now() - startTime;
      
      // Render time should be reasonable even with large datasets
      expect(renderTime).toBeLessThan(100); // 100ms threshold
      
      // Component should still initialize performance monitoring
      await waitFor(() => {
        expect(mockOptimizer.createIntersectionObserver).toHaveBeenCalled();
      });
    });

    it('should optimize memory usage with large arrays', () => {
      const largeTechArray: Technology[] = Array.from({ length: 100 }, (_, i) => ({
        name: `Technology ${i}`,
        icon: '🔧',
        category: 'tools'
      }));

      const { unmount } = render(<TechMarquee technologies={largeTechArray} />);
      
      // Should render without memory issues
      const sectionsWithRegion = screen.getAllByRole('region');
      const mainSection = sectionsWithRegion[0];
      expect(mainSection).toBeInTheDocument();
      
      // Should clean up properly
      unmount();
      expect(mockOptimizer.stopMonitoring).toHaveBeenCalled();
    });
  });

  describe('Intersection Observer Optimization', () => {
    it('should handle intersection ratio changes efficiently', async () => {
      // Mock intersection observer with varying ratios
      let intersectionCallback: (isVisible: boolean, ratio: number) => void;
      
      mockOptimizer.createIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return { observe: vi.fn(), disconnect: vi.fn() };
      });

      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Simulate different intersection ratios
      const ratios = [0, 0.25, 0.5, 0.75, 1.0];
      
      for (const ratio of ratios) {
        intersectionCallback!(ratio > 0, ratio);
        
        await waitFor(() => {
          expect(mockOptimizer.getOptimalSettings).toHaveBeenCalledWith(
            expect.objectContaining({
              intersectionRatio: ratio
            })
          );
        });
      }
    });

    it('should optimize based on visibility state', async () => {
      // Mock not visible state
      mockOptimizer.createIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => callback(false, 0), 0);
        return { observe: vi.fn(), disconnect: vi.fn() };
      });

      render(<TechMarquee technologies={mockTechnologies} />);
      
      const sectionsWithRegion = screen.getAllByRole('region');
      const mainSection = sectionsWithRegion[0];
      
      await waitFor(() => {
        expect(mainSection).toHaveClass('notVisible');
        expect(mainSection?.style.getPropertyValue('--performance-mode')).toBe('low');
      });
    });
  });

  describe('Hardware Acceleration', () => {
    it('should apply hardware acceleration optimizations', async () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const sectionsWithRegion = screen.getAllByRole('region');
      const mainSection = sectionsWithRegion[0];
      
      await waitFor(() => {
        expect(mainSection?.style.getPropertyValue('--hardware-acceleration')).toBe('enabled');
      });
    });

    it('should use CSS containment for rendering optimization', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const sectionsWithRegion = screen.getAllByRole('region');
      const mainSection = sectionsWithRegion[0];
      
      // Should apply containment classes for optimization
      expect(mainSection).toHaveClass('techMarqueeSection');
    });
  });

  describe('Memory Management', () => {
    it('should prevent memory leaks on component unmount', () => {
      const { unmount } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Verify performance monitoring is active
      expect(mockOptimizer.startMonitoring).toHaveBeenCalled();
      
      // Unmount component
      unmount();
      
      // Verify cleanup was called
      expect(mockOptimizer.stopMonitoring).toHaveBeenCalled();
    });

    it('should handle rapid prop changes efficiently', async () => {
      const { rerender } = render(<TechMarquee technologies={mockTechnologies.slice(0, 5)} speed={50} />);
      
      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(<TechMarquee technologies={mockTechnologies.slice(0, 5 + i)} speed={50 - i} />);
      }
      
      // Should handle changes without performance degradation
      const sectionsWithRegion = screen.getAllByRole('region');
      const mainSection = sectionsWithRegion[0];
      expect(mainSection).toBeInTheDocument();
      
      await waitFor(() => {
        expect(mockOptimizer.applyPerformanceSettings).toHaveBeenCalled();
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should monitor animation performance in real-time', async () => {
      mockOptimizer.startMonitoring.mockImplementation((callback) => {
        // Immediately call the callback to simulate monitoring start
        setTimeout(() => callback({
          fps: 60,
          frameTime: 16.67,
          isVisible: true,
          intersectionRatio: 1
        }), 0);
      });

      render(<TechMarquee technologies={mockTechnologies} />);
      
      // In test environment, startMonitoring is called when component becomes visible
      await waitFor(() => {
        expect(mockOptimizer.getOptimalSettings).toHaveBeenCalled();
      });
      
      // Performance settings should be applied
      expect(mockOptimizer.applyPerformanceSettings).toHaveBeenCalled();
    });

    it('should handle performance optimization in test environment', () => {
      // Test environment should skip complex performance monitoring
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = screen.getByRole('region');
      
      // Should set basic performance properties for tests
      expect(section.style.getPropertyValue('--performance-mode')).toBe('high');
      expect(section.style.getPropertyValue('--animation-quality')).toBe('high');
      expect(section.style.getPropertyValue('--hardware-acceleration')).toBe('enabled');
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});
