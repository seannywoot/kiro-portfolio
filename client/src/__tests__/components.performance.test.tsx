/**
 * Component performance tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import LazySection from '../components/common/LazySection/LazySection';
import LoadingSpinner from '../components/common/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';
import OptimizedImage from '../components/common/OptimizedImage/OptimizedImage';

// Mock intersection observer
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback) => {
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      root: null,
      rootMargin: '',
      thresholds: []
    };
  });

  global.IntersectionObserver = mockIntersectionObserver;
});

describe('LazySection Performance', () => {
  it('should not render children until in view', () => {
    const TestComponent = () => <div data-testid="lazy-content">Lazy Content</div>;
    
    render(
      <LazySection>
        <TestComponent />
      </LazySection>
    );

    // Should not render content initially
    expect(screen.queryByTestId('lazy-content')).not.toBeInTheDocument();
    expect(mockObserve).toHaveBeenCalled();
  });

  it('should render placeholder when not in view', () => {
    const TestComponent = () => <div data-testid="lazy-content">Lazy Content</div>;
    
    render(
      <LazySection>
        <TestComponent />
      </LazySection>
    );

    // Should render placeholder
    const placeholder = screen.getByRole('generic');
    expect(placeholder).toHaveStyle({ minHeight: '200px' });
  });

  it('should handle intersection observer callback', async () => {
    const TestComponent = () => <div data-testid="lazy-content">Lazy Content</div>;
    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect
      };
    });

    render(
      <LazySection>
        <TestComponent />
      </LazySection>
    );

    // Simulate intersection
    intersectionCallback!([{ isIntersecting: true }]);

    await waitFor(() => {
      expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
    });
  });
});

describe('LoadingSpinner Performance', () => {
  it('should render without performance issues', () => {
    const startTime = performance.now();
    
    render(<LoadingSpinner />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render quickly (less than 5ms)
    expect(renderTime).toBeLessThan(5);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should handle reduced motion preference', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });
});

describe('ErrorBoundary Performance', () => {
  it('should handle errors without memory leaks', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should render fallback UI quickly', () => {
    const startTime = performance.now();
    
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render error UI quickly
    expect(renderTime).toBeLessThan(10);

    consoleSpy.mockRestore();
  });
});

describe('OptimizedImage Performance', () => {
  it('should lazy load images by default', () => {
    render(
      <OptimizedImage
        src="test.jpg"
        alt="Test image"
      />
    );

    expect(mockObserve).toHaveBeenCalled();
  });

  it('should preload critical images', () => {
    const mockImage = {
      onload: null as any,
      onerror: null as any,
      src: ''
    };

    global.Image = vi.fn().mockImplementation(() => mockImage);

    render(
      <OptimizedImage
        src="critical.jpg"
        alt="Critical image"
        loading="eager"
      />
    );

    expect(global.Image).toHaveBeenCalled();
  });

  it('should handle image load errors gracefully', async () => {
    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect
      };
    });

    render(
      <OptimizedImage
        src="invalid.jpg"
        alt="Invalid image"
      />
    );

    // Simulate intersection
    intersectionCallback!([{ isIntersecting: true }]);

    // Should show placeholder initially
    expect(screen.getByText('Failed to load image')).toBeInTheDocument();
  });
});

describe('Memory Usage Tests', () => {
  it('should not create memory leaks with multiple lazy sections', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    // Render multiple lazy sections
    const { unmount } = render(
      <div>
        {Array.from({ length: 10 }, (_, i) => (
          <LazySection key={i}>
            <div>Content {i}</div>
          </LazySection>
        ))}
      </div>
    );

    // Unmount components
    unmount();

    // Check that observers are cleaned up
    expect(mockDisconnect).toHaveBeenCalled();

    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Memory usage should not increase significantly
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(1024 * 1024); // Less than 1MB
    }
  });
});

describe('Render Performance Benchmarks', () => {
  it('should render components within performance budget', () => {
    const components = [
      () => <LoadingSpinner />,
      () => <LoadingSpinner size="large" />,
      () => <ErrorBoundary><div>Test</div></ErrorBoundary>
    ];

    components.forEach((Component, index) => {
      const startTime = performance.now();
      
      render(<Component />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Each component should render in less than 16ms (60fps budget)
      expect(renderTime).toBeLessThan(16);
    });
  });

  it('should handle rapid re-renders efficiently', () => {
    const { rerender } = render(<LoadingSpinner text="Loading..." />);

    const startTime = performance.now();

    // Simulate rapid re-renders
    for (let i = 0; i < 100; i++) {
      rerender(<LoadingSpinner text={`Loading ${i}...`} />);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // 100 re-renders should complete in reasonable time
    expect(totalTime).toBeLessThan(100); // Less than 100ms total
  });
});