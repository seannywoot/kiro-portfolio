import { renderHook, act } from '@testing-library/react';
import { useParallax } from '../useParallax';

// Mock the animations module
vi.mock('../../lib/animations', () => ({
  calculateParallaxOffset: vi.fn((scrollDistance: number, speed: number, direction: string) => {
    const offset = scrollDistance * speed;
    return direction === 'up' ? -offset : offset;
  }),
  throttleFrame: vi.fn((fn) => fn),
  prefersReducedMotion: vi.fn(() => false),
}));

describe('useParallax', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 100,
      toJSON: () => {},
    }));

    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial values', () => {
    const { result } = renderHook(() => useParallax());

    expect(result.current.ref).toBeDefined();
    expect(result.current.offset).toBe(0);
    expect(result.current.isVisible).toBe(false);
  });

  it('should calculate parallax offset when element is visible', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.5 }));

    // Mock the ref to have a current element
    const mockElement = document.createElement('div');
    Object.defineProperty(result.current.ref, 'current', {
      value: mockElement,
      writable: true,
    });

    // Trigger scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('should respect disabled option', () => {
    const { result } = renderHook(() => useParallax({ disabled: true }));

    const mockElement = document.createElement('div');
    Object.defineProperty(result.current.ref, 'current', {
      value: mockElement,
      writable: true,
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.offset).toBe(0);
  });

  it('should handle different speed values', () => {
    const { result } = renderHook(() => useParallax({ speed: 1.0 }));

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.offset).toBe('number');
  });

  it('should handle different directions', () => {
    const { result: upResult } = renderHook(() => useParallax({ direction: 'up' }));
    const { result: downResult } = renderHook(() => useParallax({ direction: 'down' }));

    expect(upResult.current.ref).toBeDefined();
    expect(downResult.current.ref).toBeDefined();
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useParallax());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});