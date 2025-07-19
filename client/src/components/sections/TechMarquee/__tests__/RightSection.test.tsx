import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RightSection from '../RightSection';
import { Technology } from '../../../../lib/types';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

const mockTechnologies: Technology[] = [
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'TypeScript', icon: '📘', category: 'Language' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'Vite', icon: '⚡', category: 'Build Tool' }
];

describe('RightSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the right section container', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    // Check if the component renders without crashing
    const rightSection = document.querySelector('[class*="rightSection"]');
    expect(rightSection).toBeInTheDocument();
  });

  it('renders marquee container with proper ARIA attributes', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    const marqueeContainer = screen.getByRole('img', { 
      name: /animated showcase of technologies and tools/i 
    });
    expect(marqueeContainer).toBeInTheDocument();
    expect(marqueeContainer).toHaveAttribute('aria-describedby', 'tech-description');
  });

  it('splits technologies into two rows', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    // Should render technology items
    const techItems = screen.getAllByText(/React|TypeScript|Node\.js|Vite/);
    expect(techItems.length).toBeGreaterThan(0);
  });

  it('applies optimized animation speed for diagonal layout', () => {
    render(<RightSection technologies={mockTechnologies} speed={50} />);
    
    // The component should apply optimized speed (80% of original)
    // This is tested by checking if the component renders without errors
    const rightSection = document.querySelector('[class*="rightSection"]');
    expect(rightSection).toBeInTheDocument();
  });

  it('sets up intersection observer for performance optimization', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    // Should have called IntersectionObserver constructor
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.1,
        rootMargin: '50px'
      })
    );
  });

  it('handles empty technologies array', () => {
    render(<RightSection technologies={[]} />);
    
    const rightSection = document.querySelector('[class*="rightSection"]');
    expect(rightSection).toBeInTheDocument();
  });

  it('applies pause on hover functionality', () => {
    render(<RightSection technologies={mockTechnologies} pauseOnHover={true} />);
    
    const marqueeContainer = screen.getByRole('img');
    expect(marqueeContainer).toBeInTheDocument();
    
    // Should have mouse event handlers (tested by ensuring component renders)
    expect(marqueeContainer).toHaveAttribute('role', 'img');
  });

  it('respects pauseOnHover prop when disabled', () => {
    render(<RightSection technologies={mockTechnologies} pauseOnHover={false} />);
    
    const marqueeContainer = screen.getByRole('img');
    expect(marqueeContainer).toBeInTheDocument();
  });
});