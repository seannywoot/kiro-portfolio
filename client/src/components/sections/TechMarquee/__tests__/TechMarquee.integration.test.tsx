import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TechMarquee from '../TechMarquee';
import { Technology } from '../../../../lib/types';

// Mock performance optimizer
vi.mock('../../../../lib/performance-optimizer', () => ({
  createDiagonalMarqueeOptimizer: vi.fn(() => ({
    createIntersectionObserver: vi.fn((callback) => {
      // Simulate intersection observer behavior
      setTimeout(() => callback(true, 1), 0);
      return {
        observe: vi.fn(),
        disconnect: vi.fn()
      };
    }),
    startMonitoring: vi.fn(),
    stopMonitoring: vi.fn(),
    getOptimalSettings: vi.fn(() => ({
      animationQuality: 'high',
      hardwareAcceleration: 'enabled',
      visibilityLevel: 'full'
    })),
    applyPerformanceSettings: vi.fn()
  }))
}));

const mockTechnologies: Technology[] = [
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'TypeScript', icon: '🔷', category: 'Language' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'Vite', icon: '⚡', category: 'Build Tool' },
  { name: 'CSS', icon: '🎨', category: 'Styling' },
  { name: 'JavaScript', icon: '💛', category: 'Language' }
];

describe('TechMarquee Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders complete diagonal marquee structure', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check main section
    const regions = screen.getAllByRole('region');
    const mainSection = regions[0];
    expect(mainSection).toHaveAttribute('aria-labelledby', 'technologies-heading');
    
    // Check diagonal container
    const diagonalRegion = regions.find(region => 
      region.getAttribute('aria-describedby') === 'tech-description'
    );
    expect(diagonalRegion).toBeInTheDocument();
    
    // Check left section
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Technologies & Tools');
    
    // Check right section with marquee
    const marqueeContainer = screen.getByRole('img', { 
      name: /animated showcase of technologies and tools/i 
    });
    expect(marqueeContainer).toBeInTheDocument();
  });

  it('integrates all components with proper data flow', () => {
    render(<TechMarquee technologies={mockTechnologies} speed={30} pauseOnHover={true} />);
    
    // Verify technologies are passed to right section (using getAllByText since marquee duplicates)
    mockTechnologies.forEach(tech => {
      const techElements = screen.getAllByText(tech.name);
      expect(techElements.length).toBeGreaterThan(0);
    });
    
    // Verify screen reader content includes all technologies
    const srList = screen.getByText('Complete list of technologies and tools:');
    expect(srList).toBeInTheDocument();
    
    mockTechnologies.forEach(tech => {
      const techItem = screen.getByText(new RegExp(`${tech.name} - ${tech.category}`));
      expect(techItem).toBeInTheDocument();
    });
  });

  it('handles performance optimization integration', async () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    const regions = screen.getAllByRole('region');
    const mainSection = regions[0];
    
    // Wait for performance optimizer to be applied
    await waitFor(() => {
      expect(mainSection).toHaveAttribute('data-performance-mode', 'high');
    });
    
    // Check that CSS custom properties are set
    expect(mainSection.style.getPropertyValue('--performance-mode')).toBe('high');
    expect(mainSection.style.getPropertyValue('--animation-quality')).toBe('high');
    expect(mainSection.style.getPropertyValue('--hardware-acceleration')).toBe('enabled');
  });

  it('maintains accessibility across all integrated components', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveAttribute('id', 'technologies-heading');
    
    const srHeading = screen.getByRole('heading', { level: 3 });
    expect(srHeading).toHaveTextContent('Complete list of technologies and tools:');
    
    // Check ARIA relationships
    const marqueeContainer = screen.getByRole('img');
    expect(marqueeContainer).toHaveAttribute('aria-describedby', 'tech-description');
    expect(marqueeContainer).toHaveAttribute('aria-live', 'polite');
    
    // Check keyboard interaction
    expect(marqueeContainer).toHaveAttribute('tabIndex', '0');
  });

  it('handles responsive behavior integration', () => {
    // Mock different screen sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Component should render without errors on different screen sizes
    const regions = screen.getAllByRole('region');
    const mainSection = regions[0];
    expect(mainSection).toBeInTheDocument();
    
    // Change to mobile size
    Object.defineProperty(window, 'innerWidth', {
      value: 375,
    });
    
    fireEvent(window, new Event('resize'));
    
    // Should still render properly
    expect(mainSection).toBeInTheDocument();
  });

  it('integrates keyboard controls across components', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    const marqueeContainer = screen.getByRole('img');
    
    // Test space key to pause/resume
    fireEvent.keyDown(marqueeContainer, { key: ' ' });
    expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
    
    fireEvent.keyDown(marqueeContainer, { key: ' ' });
    expect(screen.getByText('Technology showcase playing')).toBeInTheDocument();
    
    // Test enter key
    fireEvent.keyDown(marqueeContainer, { key: 'Enter' });
    expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
  });

  it('handles error states gracefully across components', () => {
    // Test with empty technologies array
    render(<TechMarquee technologies={[]} />);
    
    const regions = screen.getAllByRole('region');
    const mainSection = regions[0];
    expect(mainSection).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    
    // Should still show screen reader content
    const srHeading = screen.getByText('Complete list of technologies and tools:');
    expect(srHeading).toBeInTheDocument();
  });

  it('maintains performance under stress conditions', async () => {
    // Test with large number of technologies
    const largeTechArray = Array.from({ length: 50 }, (_, i) => ({
      name: `Technology ${i}`,
      icon: '🔧',
      category: 'Tool'
    }));

    render(<TechMarquee technologies={largeTechArray} speed={10} />);
    
    const regions = screen.getAllByRole('region');
    const mainSection = regions[0];
    expect(mainSection).toBeInTheDocument();
    
    // Should handle large datasets without crashing
    await waitFor(() => {
      expect(mainSection).toHaveAttribute('data-performance-mode', 'high');
    });
  });

  it('integrates reduced motion preferences', () => {
    // Mock prefers-reduced-motion
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

    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Should render without errors with reduced motion
    const regions = screen.getAllByRole('region');
    const mainSection = regions[0];
    expect(mainSection).toBeInTheDocument();
    
    // Should still provide screen reader information
    const reducedMotionInfo = screen.getByText(/if you prefer reduced motion/i);
    expect(reducedMotionInfo).toBeInTheDocument();
  });

  it('handles prop changes dynamically', async () => {
    const { rerender } = render(
      <TechMarquee technologies={mockTechnologies.slice(0, 3)} speed={50} />
    );
    
    // Initial render - check that initial technologies are present (using getAllByText since marquee duplicates)
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Node.js').length).toBeGreaterThan(0);
    
    // Update with more technologies
    rerender(
      <TechMarquee technologies={mockTechnologies} speed={30} />
    );
    
    // Should show all technologies
    await waitFor(() => {
      mockTechnologies.forEach(tech => {
        const techElements = screen.getAllByText(tech.name);
        expect(techElements.length).toBeGreaterThan(0);
      });
    });
  });
});