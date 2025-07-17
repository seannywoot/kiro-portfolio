import { renderHook } from '@testing-library/react';
import { useIntersectionObserver, useIntersectionObserverOnce } from '../useIntersectionObserver';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';

describe('useIntersectionObserver', () => {
  it('should return initial values', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);
  });

  it('should accept options parameter', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      root: null,
    };

    const { result } = renderHook(() => useIntersectionObserver(options));

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);
  });

  it('should handle different threshold values', () => {
    const { result } = renderHook(() => useIntersectionObserver({ threshold: [0, 0.5, 1] }));

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);
  });

  it('should return ref object', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    expect(result.current.ref).toHaveProperty('current');
    expect(result.current.ref.current).toBe(null);
  });
});

describe('useIntersectionObserverOnce', () => {
  it('should return initial values', () => {
    const { result } = renderHook(() => useIntersectionObserverOnce());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);
  });

  it('should accept options parameter', () => {
    const options = {
      threshold: 0.8,
      rootMargin: '20px',
    };

    const { result } = renderHook(() => useIntersectionObserverOnce(options));

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);
  });
});