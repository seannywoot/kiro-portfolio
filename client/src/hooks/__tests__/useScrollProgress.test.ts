import { renderHook, act } from '@testing-library/react';
import { useScrollProgress, useElementScrollProgress, useScrollProgressRange } from '../useScrollProgress';

// Mock the animations module
vi.mock('../../lib/animations', () => ({
  getScrollProgress: vi.fn((element?: HTMLElement | null) => {
    if (element) {
      return element.scrollTop / (element.scrollHeight - element.clientHeight);
    }
    return window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
  }),
  throttleFrame: vi.fn((fn) => fn),
  clamp: vi.fn((value: number, min: number, max: number) => Math.min(Math.max(value, min), max)),
}));

describe('useScrollProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window properties
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2000,
    });

    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial values', () => {
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current.progress).toBe(0);
    expect(result.current.scrollY).toBe(0);
    expect(result.current.scrollDirection).toBe(null);
  });

  it('should update progress on scroll', () => {
    const { result } = renderHook(() => useScrollProgress());

    // Simulate scroll
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        value: 400,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollY).toBe(400);
    expect(typeof result.current.progress).toBe('number');
  });

  it('should detect scroll direction', () => {
    const { result } = renderHook(() => useScrollProgress());

    // Scroll down
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        value: 100,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollDirection).toBe('down');

    // Scroll up
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        value: 50,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollDirection).toBe('up');
  });

  it('should handle element scroll', () => {
    const mockElement = document.createElement('div');
    Object.defineProperty(mockElement, 'scrollTop', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(mockElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(mockElement, 'clientHeight', {
      value: 400,
      writable: true,
    });

    const { result } = renderHook(() => useScrollProgress({ element: mockElement }));

    // Simulate element scroll
    act(() => {
      mockElement.scrollTop = 200;
      mockElement.dispatchEvent(new Event('scroll'));
    });

    expect(typeof result.current.progress).toBe('number');
  });

  it('should respect throttle option', () => {
    const { result } = renderHook(() => useScrollProgress({ throttle: false }));

    expect(result.current.progress).toBe(0);
    expect(result.current.scrollY).toBe(0);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollProgress());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});

describe('useElementScrollProgress', () => {
  it('should track element scroll progress', () => {
    const mockElement = document.createElement('div');
    Object.defineProperty(mockElement, 'scrollTop', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(mockElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(mockElement, 'clientHeight', {
      value: 400,
      writable: true,
    });
    
    const elementRef = { current: mockElement };

    const { result } = renderHook(() => useElementScrollProgress(elementRef));

    expect(typeof result.current.progress).toBe('number');
    expect(result.current.scrollY).toBe(0);
    expect(result.current.scrollDirection).toBe(null);
  });
});

describe('useScrollProgressRange', () => {
  it('should map progress to custom range', () => {
    const { result } = renderHook(() => useScrollProgressRange(0.2, 0.8));

    expect(result.current.progress).toBe(0);
    expect(typeof result.current.scrollY).toBe('number');
    expect(result.current.scrollDirection).toBe(null);
  });

  it('should handle different start and end offsets', () => {
    const { result } = renderHook(() => useScrollProgressRange(0.1, 0.9));

    expect(result.current.progress).toBe(0);
  });
});