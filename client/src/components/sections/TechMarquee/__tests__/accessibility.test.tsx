import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TechMarquee from '../TechMarquee';
import DiagonalContainer from '../DiagonalContainer';
import LeftSection from '../LeftSection';
import RightSection from '../RightSection';
import type { Technology } from '../../../../lib/types';

// Mock test data
const mockTechnologies: Technology[] = [
  { name: 'React', icon: '⚛️', category: 'frontend' },
  { name: 'TypeScript', icon: '🔷', category: 'frontend' },
  { name: 'Node.js', icon: '🟢', category: 'backend' },
  { name: 'CSS', icon: '🎨', category: 'frontend' }
];

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

describe('TechMarquee Accessibility Features', () => {
  it('should have proper ARIA labels and structure', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check main section has proper ARIA attributes
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'technologies-heading');
    
    // Check heading exists and is properly labeled
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'technologies-heading');
    expect(heading).toHaveTextContent('Technologies & Tools');
  });

  it('should provide screen reader accessible technology list', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check that screen reader content exists
    const srHeading = screen.getByText('Complete list of technologies and tools:');
    expect(srHeading).toBeInTheDocument();
    
    // Check that all technologies are listed for screen readers
    mockTechnologies.forEach(tech => {
      const techItem = screen.getByText(new RegExp(`${tech.name} - ${tech.category}`));
      expect(techItem).toBeInTheDocument();
    });
  });

  it('should have proper ARIA attributes for diagonal container', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Find all regions and check the diagonal container specifically
    const regions = screen.getAllByRole('region');
    const diagonalContainer = regions.find(region => 
      region.getAttribute('aria-labelledby') === 'technologies-heading' &&
      region.getAttribute('aria-describedby') === 'tech-description'
    );
    expect(diagonalContainer).toBeDefined();
    expect(diagonalContainer).toHaveAttribute('aria-labelledby', 'technologies-heading');
    expect(diagonalContainer).toHaveAttribute('aria-describedby', 'tech-description');
  });

  it('should support keyboard navigation for marquee controls', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Find the marquee container that should be focusable
    const marqueeContainer = screen.getByRole('img', { name: /animated showcase/i });
    expect(marqueeContainer).toHaveAttribute('tabIndex', '0');
    expect(marqueeContainer).toHaveAttribute('aria-live', 'polite');
  });

  it('should provide proper alt text for technology icons', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check that emoji icons have proper aria-label
    const reactIcon = screen.getByLabelText('React technology icon');
    expect(reactIcon).toBeInTheDocument();
    expect(reactIcon).toHaveAttribute('role', 'img');
  });

  it('should have proper description for assistive technologies', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check that description exists and mentions keyboard controls
    const description = screen.getByText(/animations can be paused by pressing the space bar/i);
    expect(description).toBeInTheDocument();
    
    const reducedMotionInfo = screen.getByText(/if you prefer reduced motion/i);
    expect(reducedMotionInfo).toBeInTheDocument();
  });

  it('should respect reduced motion preferences in CSS', () => {
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
    
    // The component should render without errors even with reduced motion
    const sections = screen.getAllByRole('region');
    expect(sections.length).toBeGreaterThan(0);
    expect(sections[0]).toBeInTheDocument();
  });
});
  describe('DiagonalContainer Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper semantic structure for diagonal layout', () => {
    render(
      <DiagonalContainer>
        <LeftSection title="Test Title" subtitle="Test Subtitle" />
        <RightSection technologies={mockTechnologies} />
      </DiagonalContainer>
    );
    
    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-labelledby', 'technologies-heading');
    expect(container).toHaveAttribute('aria-describedby', 'tech-description');
  });

  it('should maintain accessibility with custom diagonal angles', () => {
    render(
      <DiagonalContainer diagonalAngle={30}>
        <div role="banner">Content</div>
      </DiagonalContainer>
    );
    
    const container = screen.getByRole('region');
    const banner = screen.getByRole('banner');
    
    expect(container).toBeInTheDocument();
    expect(banner).toBeInTheDocument();
  });

  it('should support screen reader navigation through diagonal sections', () => {
    render(
      <DiagonalContainer>
        <LeftSection title="Technologies & Tools" subtitle="Modern development stack" />
        <RightSection technologies={mockTechnologies} />
      </DiagonalContainer>
    );
    
    // Check that screen readers can navigate through sections
    const heading = screen.getByRole('heading', { level: 2 });
    const banner = screen.getByRole('banner');
    const complementary = screen.getByRole('complementary');
    
    expect(heading).toBeInTheDocument();
    expect(banner).toBeInTheDocument();
    expect(complementary).toBeInTheDocument();
  });
});

describe('LeftSection Accessibility', () => {
  const defaultProps = {
    title: 'Technologies & Tools',
    subtitle: 'Crafting modern experiences'
  };

  it('should have proper heading hierarchy', () => {
    render(<LeftSection {...defaultProps} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'technologies-heading');
    expect(heading).toHaveAttribute('aria-level', '2');
  });

  it('should establish proper ARIA relationships', () => {
    render(<LeftSection {...defaultProps} />);
    
    const subtitle = screen.getByText(defaultProps.subtitle);
    expect(subtitle).toHaveAttribute('aria-describedby', 'technologies-heading');
  });

  it('should have semantic banner role', () => {
    render(<LeftSection {...defaultProps} />);
    
    const section = screen.getByRole('banner');
    expect(section).toHaveAttribute('aria-label', 'Technology section introduction');
  });

  it('should handle long text content accessibly', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines and should remain accessible';
    const longSubtitle = 'This is a very long subtitle that provides detailed information about the technologies section and should maintain proper accessibility attributes';
    
    render(<LeftSection title={longTitle} subtitle={longSubtitle} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    const subtitle = screen.getByText(longSubtitle);
    
    expect(heading).toHaveTextContent(longTitle);
    expect(subtitle).toHaveAttribute('aria-describedby', 'technologies-heading');
  });
});

describe('RightSection Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper complementary role and labeling', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    const section = screen.getByRole('complementary');
    expect(section).toHaveAttribute('aria-label', 'Technology showcase animations');
  });

  it('should provide accessible marquee container', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    const marqueeContainer = screen.getByRole('img');
    expect(marqueeContainer).toHaveAttribute('aria-label', 'Animated showcase of technologies and tools');
    expect(marqueeContainer).toHaveAttribute('aria-describedby', 'tech-description');
    expect(marqueeContainer).toHaveAttribute('tabIndex', '0');
    expect(marqueeContainer).toHaveAttribute('aria-live', 'polite');
  });

  it('should support keyboard interaction for animation control', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    const marqueeContainer = screen.getByRole('img');
    
    // Test space key
    fireEvent.keyDown(marqueeContainer, { key: ' ' });
    expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
    
    fireEvent.keyDown(marqueeContainer, { key: ' ' });
    expect(screen.getByText('Technology showcase playing')).toBeInTheDocument();
    
    // Test enter key
    fireEvent.keyDown(marqueeContainer, { key: 'Enter' });
    expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
  });

  it('should hide decorative marquee rows from screen readers', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    // Marquee rows should be hidden from screen readers
    const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElements.length).toBeGreaterThan(0);
    
    // But the main container should be accessible
    const marqueeContainer = screen.getByRole('img');
    expect(marqueeContainer).not.toHaveAttribute('aria-hidden');
  });

  it('should announce animation state changes', () => {
    render(<RightSection technologies={mockTechnologies} />);
    
    const marqueeContainer = screen.getByRole('img');
    
    // Initial state
    expect(screen.getByText('Technology showcase playing')).toBeInTheDocument();
    
    // Pause state
    fireEvent.keyDown(marqueeContainer, { key: ' ' });
    expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
  });

  it('should handle touch accessibility for mobile devices', () => {
    render(<RightSection technologies={mockTechnologies} pauseOnHover={true} />);
    
    const marqueeContainer = screen.getByRole('img');
    
    // Touch events should work for accessibility
    fireEvent.touchStart(marqueeContainer);
    expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
    
    fireEvent.touchEnd(marqueeContainer);
    expect(screen.getByText('Technology showcase playing')).toBeInTheDocument();
  });
});

describe('Integrated Accessibility Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should maintain focus management across diagonal sections', async () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    const marqueeContainer = screen.getByRole('img');
    
    // Focus should be manageable
    heading.focus();
    expect(document.activeElement).toBe(heading);
    
    marqueeContainer.focus();
    expect(document.activeElement).toBe(marqueeContainer);
  });

  it('should provide comprehensive screen reader experience', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check all screen reader content is present
    expect(screen.getByText('Complete list of technologies and tools:')).toBeInTheDocument();
    expect(screen.getByText(/This section displays an animated showcase/)).toBeInTheDocument();
    expect(screen.getByText(/Use the tab key to navigate/)).toBeInTheDocument();
    expect(screen.getByText(/If you prefer reduced motion/)).toBeInTheDocument();
    
    // Check technology list
    mockTechnologies.forEach(tech => {
      expect(screen.getByText(new RegExp(`${tech.name} - ${tech.category}`))).toBeInTheDocument();
    });
  });

  it('should handle high contrast mode accessibility', () => {
    // Mock high contrast media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
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
    
    // Should render without accessibility issues in high contrast
    const section = screen.getByRole('region');
    const heading = screen.getByRole('heading', { level: 2 });
    const marqueeContainer = screen.getByRole('img');
    
    expect(section).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(marqueeContainer).toBeInTheDocument();
  });

  it('should support assistive technology announcements', async () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    const marqueeContainer = screen.getByRole('img');
    
    // Live region should announce changes
    expect(marqueeContainer).toHaveAttribute('aria-live', 'polite');
    expect(marqueeContainer).toHaveAttribute('aria-atomic', 'false');
    
    // State changes should be announced
    fireEvent.keyDown(marqueeContainer, { key: ' ' });
    
    await waitFor(() => {
      expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
    });
  });

  it('should maintain accessibility during performance optimizations', async () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    const section = screen.getByRole('region');
    
    // Wait for performance optimizations to apply
    await waitFor(() => {
      expect(section).toHaveAttribute('data-performance-mode', 'high');
    });
    
    // Accessibility should be maintained regardless of performance mode
    const heading = screen.getByRole('heading', { level: 2 });
    const marqueeContainer = screen.getByRole('img');
    
    expect(heading).toHaveAttribute('id', 'technologies-heading');
    expect(marqueeContainer).toHaveAttribute('tabIndex', '0');
    expect(marqueeContainer).toHaveAttribute('aria-live', 'polite');
  });

  it('should handle color vision accessibility', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Should not rely solely on color for information
    const heading = screen.getByRole('heading', { level: 2 });
    const marqueeContainer = screen.getByRole('img');
    
    // Text content should be meaningful without color
    expect(heading).toHaveTextContent('Technologies & Tools');
    expect(marqueeContainer).toHaveAttribute('aria-label', 'Animated showcase of technologies and tools');
    
    // All technologies should be identifiable by text
    mockTechnologies.forEach(tech => {
      expect(screen.getByText(tech.name)).toBeInTheDocument();
    });
  });

  describe('Diagonal Layout Accessibility', () => {
    it('should maintain accessibility with diagonal visual design', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check that diagonal container has proper ARIA structure
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-labelledby', 'technologies-heading');
      expect(region).toHaveAttribute('aria-describedby', 'tech-description');
      
      // Verify heading hierarchy is maintained
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'technologies-heading');
    });

    it('should provide comprehensive screen reader information', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check for complete technology listing
      const techDescription = screen.getByText(/This section displays an animated showcase/);
      expect(techDescription).toBeInTheDocument();
      
      // Verify navigation instructions
      const navigationHelp = screen.getByText(/Use the tab key to navigate/);
      expect(navigationHelp).toBeInTheDocument();
      
      // Check reduced motion support message
      const reducedMotionInfo = screen.getByText(/animations will be automatically disabled/);
      expect(reducedMotionInfo).toBeInTheDocument();
    });

    it('should support assistive technology focus management', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Find focusable marquee container
      const marqueeContainer = screen.getByRole('img', { name: /animated showcase/i });
      expect(marqueeContainer).toHaveAttribute('tabIndex', '0');
      
      // Should have appropriate ARIA live region
      expect(marqueeContainer).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Enhanced Screen Reader Support', () => {
    it('should provide detailed technology information for screen readers', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check that each technology has proper screen reader content
      mockTechnologies.forEach(tech => {
        const techInfo = screen.getByText(new RegExp(`${tech.name} - ${tech.category}`));
        expect(techInfo).toBeInTheDocument();
      });
    });

    it('should announce animation state changes', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Find the marquee container with live region
      const marqueeContainer = screen.getByRole('img', { name: /animated showcase/i });
      
      // Should have polite live region for non-intrusive updates
      expect(marqueeContainer).toHaveAttribute('aria-live', 'polite');
      expect(marqueeContainer).toHaveAttribute('aria-atomic', 'false');
    });

    it('should provide technology count information', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const description = screen.getByText(new RegExp(`${mockTechnologies.length} technologies`));
      expect(description).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Enhancement', () => {
    it('should support enhanced keyboard controls for diagonal layout', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContainer = screen.getByRole('img', { name: /animated showcase/i });
      
      // Should be focusable
      expect(marqueeContainer).toHaveAttribute('tabIndex', '0');
      
      // Test keyboard interactions
      marqueeContainer.focus();
      expect(document.activeElement).toBe(marqueeContainer);
      
      // Space or Enter should pause/resume animations
      fireEvent.keyDown(marqueeContainer, { key: ' ', code: 'Space' });
      fireEvent.keyDown(marqueeContainer, { key: 'Enter', code: 'Enter' });
      
      // Component should handle keyboard events gracefully
      expect(marqueeContainer).toBeInTheDocument();
    });

    it('should provide clear focus indicators for diagonal sections', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContainer = screen.getByRole('img', { name: /animated showcase/i });
      
      // Focus the container
      marqueeContainer.focus();
      
      // Should have visible focus (handled by CSS, but element should be focusable)
      expect(document.activeElement).toBe(marqueeContainer);
    });
  });

  describe('Reduced Motion Accessibility', () => {
    it('should respect prefers-reduced-motion settings', () => {
      // Mock reduced motion preference
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Component should still render with reduced motion considerations
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Verify that reduced motion message is present
      const reducedMotionInfo = screen.getByText(/animations will be automatically disabled/);
      expect(reducedMotionInfo).toBeInTheDocument();
    });

    it('should provide alternative interaction methods for reduced motion', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Should provide alternative ways to view content
      const techList = screen.getByText('Complete list of technologies and tools:');
      expect(techList).toBeInTheDocument();
      
      // Static list should always be available regardless of animation state
      mockTechnologies.forEach(tech => {
        const techItem = screen.getByText(new RegExp(tech.name));
        expect(techItem).toBeInTheDocument();
      });
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should maintain proper semantic structure for high contrast modes', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check heading hierarchy
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Technologies & Tools');
      
      // Verify list structure
      const techList = screen.getAllByRole('listitem');
      expect(techList.length).toBe(mockTechnologies.length);
    });

    it('should provide proper alternative text for all icons', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check that all technology icons have proper labels
      mockTechnologies.forEach(tech => {
        const iconLabel = new RegExp(`${tech.name} technology icon`);
        const icon = screen.getByLabelText(iconLabel);
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('role', 'img');
      });
    });
  });

  describe('Focus Management for Diagonal Layout', () => {
    it('should manage focus properly across diagonal sections', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Get focusable elements in order
      const heading = screen.getByRole('heading', { level: 2 });
      const marqueeContainer = screen.getByRole('img', { name: /animated showcase/i });
      
      // Should be able to focus on heading first
      heading.focus();
      expect(document.activeElement).toBe(heading);
      
      // Then should be able to focus on marquee container
      marqueeContainer.focus();
      expect(document.activeElement).toBe(marqueeContainer);
    });

    it('should provide logical tab order despite visual diagonal layout', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Get all focusable elements
      const focusableElements = screen.getAllByRole('heading').concat(
        screen.getAllByRole('img', { name: /animated showcase/i })
      );
      
      // Should have at least the heading and marquee container
      expect(focusableElements.length).toBeGreaterThanOrEqual(2);
      
      // Focus should flow logically (heading -> content)
      const heading = focusableElements.find(el => el.tagName.toLowerCase().startsWith('h'));
      expect(heading).toBeDefined();
    });
  });
});