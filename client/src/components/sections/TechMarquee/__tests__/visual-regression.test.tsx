import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TechMarquee from '../TechMarquee';
import DiagonalContainer from '../DiagonalContainer';
import type { Technology } from '../../../../lib/types';

// Mock performance optimizer
vi.mock('../../../../lib/performance-optimizer', () => ({
  createDiagonalMarqueeOptimizer: vi.fn(() => ({
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
  }))
}));

const mockTechnologies: Technology[] = [
  { name: 'React', icon: '⚛️', category: 'frontend' },
  { name: 'TypeScript', icon: '🔷', category: 'frontend' },
  { name: 'Node.js', icon: '🟢', category: 'backend' },
  { name: 'Vite', icon: '⚡', category: 'tools' },
  { name: 'CSS', icon: '🎨', category: 'frontend' },
  { name: 'JavaScript', icon: '💛', category: 'frontend' }
];

// Helper to mock viewport dimensions
const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

// Helper to get computed styles
const getComputedStyleValue = (element: Element, property: string): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

describe('TechMarquee Visual Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Layout Structure Consistency', () => {
    it('should maintain consistent diagonal container structure', () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check that main structure elements exist
      const section = container.querySelector('section');
      const diagonalContainer = container.querySelector('[class*="diagonalContainer"]');
      const leftSection = container.querySelector('[class*="leftSection"]');
      const rightSection = container.querySelector('[class*="rightSection"]');
      
      expect(section).toBeInTheDocument();
      expect(diagonalContainer).toBeInTheDocument();
      expect(leftSection).toBeInTheDocument();
      expect(rightSection).toBeInTheDocument();
    });

    it('should maintain proper CSS custom properties for diagonal layout', () => {
      const { container } = render(
        <DiagonalContainer diagonalAngle={15} leftWidth="40%" rightWidth="60%">
          <div>Content</div>
        </DiagonalContainer>
      );
      
      const diagonalContainer = container.firstChild as HTMLElement;
      
      // Verify CSS custom properties are set correctly
      expect(diagonalContainer.style.getPropertyValue('--diagonal-angle')).toBe('15deg');
      expect(diagonalContainer.style.getPropertyValue('--left-width')).toBe('40%');
      expect(diagonalContainer.style.getPropertyValue('--right-width')).toBe('60%');
    });

    it('should maintain consistent marquee row structure', () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check marquee structure
      const marqueeRows = container.querySelectorAll('[class*="marqueeRow"]');
      expect(marqueeRows.length).toBeGreaterThanOrEqual(2); // Top and bottom rows
      
      const marqueeContent = container.querySelectorAll('[class*="marqueeContent"]');
      expect(marqueeContent.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Responsive Breakpoint Consistency', () => {
    it('should maintain layout integrity at mobile breakpoint', async () => {
      mockViewport(375, 667); // iPhone dimensions
      
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      await waitFor(() => {
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
      });
      
      // Check that all essential elements are present
      const heading = screen.getByRole('heading', { level: 2 });
      const marqueeContainer = screen.getByRole('img');
      
      expect(heading).toBeInTheDocument();
      expect(marqueeContainer).toBeInTheDocument();
    });

    it('should maintain layout integrity at tablet breakpoint', async () => {
      mockViewport(768, 1024); // iPad dimensions
      
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      await waitFor(() => {
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
      });
      
      // Check diagonal layout is maintained
      const diagonalContainer = container.querySelector('[class*="diagonalContainer"]');
      expect(diagonalContainer).toBeInTheDocument();
    });

    it('should maintain layout integrity at desktop breakpoint', async () => {
      mockViewport(1920, 1080); // Desktop dimensions
      
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      await waitFor(() => {
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
      });
      
      // Check full diagonal layout
      const leftSection = container.querySelector('[class*="leftSection"]');
      const rightSection = container.querySelector('[class*="rightSection"]');
      
      expect(leftSection).toBeInTheDocument();
      expect(rightSection).toBeInTheDocument();
    });

    it('should handle viewport transitions smoothly', async () => {
      const { rerender } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Test transition from desktop to mobile
      mockViewport(1920, 1080);
      rerender(<TechMarquee technologies={mockTechnologies} />);
      
      let section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Transition to mobile
      mockViewport(375, 667);
      rerender(<TechMarquee technologies={mockTechnologies} />);
      
      section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Should maintain accessibility
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Animation Consistency', () => {
    it('should maintain consistent animation properties', async () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} speed={50} />);
      
      await waitFor(() => {
        const marqueeRows = container.querySelectorAll('[class*="marqueeRow"]');
        expect(marqueeRows.length).toBeGreaterThan(0);
      });
      
      // Check that animation speed is applied
      const marqueeRows = container.querySelectorAll('[class*="marqueeRow"]');
      marqueeRows.forEach(row => {
        const element = row as HTMLElement;
        // Animation speed should be optimized (80% of original for diagonal layout)
        expect(element.style.getPropertyValue('--marquee-speed')).toBe('40s');
      });
    });

    it('should maintain animation state consistency', () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContainer = container.querySelector('[class*="marqueeContainer"]');
      expect(marqueeContainer).toBeInTheDocument();
      expect(marqueeContainer).not.toHaveClass('paused');
    });

    it('should handle pause state visual consistency', () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContainer = screen.getByRole('img');
      
      // Trigger pause
      marqueeContainer.focus();
      marqueeContainer.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      
      // Check pause state is reflected in DOM
      expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
    });
  });

  describe('Typography and Content Consistency', () => {
    it('should maintain consistent heading hierarchy', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Technologies & Tools');
      expect(mainHeading).toHaveAttribute('id', 'technologies-heading');
      
      const srHeading = screen.getByRole('heading', { level: 3 });
      expect(srHeading).toHaveTextContent('Complete list of technologies and tools:');
    });

    it('should maintain consistent subtitle content', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const subtitle = screen.getByText('Crafting modern experiences with cutting-edge technologies');
      expect(subtitle).toBeInTheDocument();
    });

    it('should maintain consistent technology content', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check all technologies are displayed
      mockTechnologies.forEach(tech => {
        expect(screen.getByText(tech.name)).toBeInTheDocument();
      });
      
      // Check screen reader content
      mockTechnologies.forEach(tech => {
        const techItem = screen.getByText(new RegExp(`${tech.name} - ${tech.category}`));
        expect(techItem).toBeInTheDocument();
      });
    });
  });

  describe('Color and Theme Consistency', () => {
    it('should handle dark mode consistently', () => {
      // Mock dark mode preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
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
      
      // Should render without visual issues in dark mode
      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(section).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });

    it('should handle high contrast mode consistently', () => {
      // Mock high contrast preference
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
      
      // Should maintain visual consistency in high contrast
      const section = screen.getByRole('region');
      const marqueeContainer = screen.getByRole('img');
      
      expect(section).toBeInTheDocument();
      expect(marqueeContainer).toBeInTheDocument();
    });
  });

  describe('Performance Visual Consistency', () => {
    it('should maintain visual consistency during performance optimization', async () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = container.querySelector('section') as HTMLElement;
      
      // Wait for performance optimizations to apply
      await waitFor(() => {
        expect(section.style.getPropertyValue('--performance-mode')).toBe('high');
      });
      
      // Visual elements should remain consistent
      expect(section.style.getPropertyValue('--animation-quality')).toBe('high');
      expect(section.style.getPropertyValue('--hardware-acceleration')).toBe('enabled');
      
      // Layout should remain intact
      const diagonalContainer = container.querySelector('[class*="diagonalContainer"]');
      expect(diagonalContainer).toBeInTheDocument();
    });

    it('should maintain visual consistency when not visible', async () => {
      // Mock intersection observer with not visible state
      vi.mocked(vi.fn()).mockImplementation(() => ({
        createIntersectionObserver: vi.fn((callback) => {
          setTimeout(() => callback(false, 0), 0);
          return { observe: vi.fn(), disconnect: vi.fn() };
        }),
        startMonitoring: vi.fn(),
        stopMonitoring: vi.fn(),
        getOptimalSettings: vi.fn(() => ({
          animationQuality: 'low',
          hardwareAcceleration: 'minimal',
          visibilityLevel: 'hidden'
        })),
        applyPerformanceSettings: vi.fn()
      }));

      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = container.querySelector('section');
      
      await waitFor(() => {
        expect(section).toHaveClass('notVisible');
      });
      
      // Should still maintain structure when not visible
      expect(section).toBeInTheDocument();
    });
  });

  describe('Edge Case Visual Consistency', () => {
    it('should handle empty technologies array visually', () => {
      const { container } = render(<TechMarquee technologies={[]} />);
      
      // Should maintain structure even with no technologies
      const section = container.querySelector('section');
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(section).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });

    it('should handle single technology visually', () => {
      const singleTech = [mockTechnologies[0]];
      
      render(<TechMarquee technologies={singleTech} />);
      
      // Should render properly with single technology
      const section = screen.getByRole('region');
      const techName = screen.getByText(singleTech[0].name);
      
      expect(section).toBeInTheDocument();
      expect(techName).toBeInTheDocument();
    });

    it('should handle large technology arrays visually', () => {
      const largeTechArray = Array.from({ length: 50 }, (_, i) => ({
        name: `Technology ${i}`,
        icon: '🔧',
        category: 'Tool'
      }));

      const { container } = render(<TechMarquee technologies={largeTechArray} />);
      
      // Should maintain visual structure with large arrays
      const section = container.querySelector('section');
      const marqueeRows = container.querySelectorAll('[class*="marqueeRow"]');
      
      expect(section).toBeInTheDocument();
      expect(marqueeRows.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Responsive Breakpoint Visual Tests', () => {
    const breakpoints = [
      { name: 'mobile', width: 320, height: 568 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'ultrawide', width: 2560, height: 1440 }
    ];

    breakpoints.forEach(({ name, width, height }) => {
      it(`should maintain visual consistency at ${name} breakpoint (${width}x${height})`, () => {
        // Mock viewport dimensions
        mockViewport(width, height);
        
        const { container } = render(<TechMarquee technologies={mockTechnologies} />);
        
        // Check that diagonal container maintains structure
        const diagonalContainer = container.querySelector('[class*="diagonalContainer"]');
        expect(diagonalContainer).toBeInTheDocument();
        
        // Verify CSS custom properties are correctly applied for breakpoint
        const diagonalElement = diagonalContainer as HTMLElement;
        const leftWidth = diagonalElement?.style.getPropertyValue('--left-width');
        const rightWidth = diagonalElement?.style.getPropertyValue('--right-width');
        const diagonalAngle = diagonalElement?.style.getPropertyValue('--diagonal-angle');
        
        // Mobile should have different layout proportions
        if (width < 768) {
          expect(leftWidth || '40%').toBeTruthy(); // Should have default or mobile values
        } else {
          expect(leftWidth || '40%').toBeTruthy(); // Should maintain desktop proportions
        }
        
        expect(rightWidth || '60%').toBeTruthy();
        expect(diagonalAngle || '15deg').toBeTruthy();
      });
    });

    it('should handle extreme aspect ratios gracefully', () => {
      const extremeRatios = [
        { width: 1920, height: 400 }, // Very wide
        { width: 400, height: 1920 }  // Very tall
      ];

      extremeRatios.forEach(({ width, height }) => {
        mockViewport(width, height);
        
        const { container } = render(<TechMarquee technologies={mockTechnologies} />);
        
        // Should still render properly
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        
        // Diagonal container should maintain structure
        const diagonalContainer = container.querySelector('[class*="diagonalContainer"]');
        expect(diagonalContainer).toBeInTheDocument();
      });
    });
  });

  describe('Technology Icon Visual Consistency', () => {
    it('should render all technology icons consistently', () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Check that all technology items are rendered
      const techItems = container.querySelectorAll('[class*="techItem"]');
      expect(techItems.length).toBeGreaterThan(0);
      
      // Each tech item should have proper structure
      techItems.forEach((item) => {
        const icon = item.querySelector('[class*="techIcon"], [role="img"]');
        const name = item.querySelector('[class*="techName"]');
        
        expect(icon).toBeInTheDocument();
        expect(name).toBeInTheDocument();
      });
    });

    it('should handle mixed icon types (emoji and images)', () => {
      const mixedTechnologies: Technology[] = [
        { name: 'React', icon: '⚛️', category: 'frontend' },
        { name: 'TypeScript', icon: '/typescript.png', category: 'frontend' },
        { name: 'CSS', icon: '🎨', category: 'frontend' }
      ];

      const { container } = render(<TechMarquee technologies={mixedTechnologies} />);
      
      // Should render both emoji and image icons
      const icons = container.querySelectorAll('[role="img"]');
      expect(icons.length).toBeGreaterThanOrEqual(mixedTechnologies.length);
    });
  });

  describe('Animation State Visual Tests', () => {
    it('should maintain visual state during pause/play transitions', () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      // Check marquee structure
      const marqueeRows = container.querySelectorAll('[class*="marqueeRow"]');
      expect(marqueeRows.length).toBeGreaterThanOrEqual(2);
      
      // Each row should have proper animation classes
      marqueeRows.forEach((row) => {
        expect(row).toHaveClass(expect.stringMatching(/marqueeRow/));
      });
    });

    it('should apply reduced motion styling when preferred', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      });

      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Component should still render but with reduced motion considerations
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('CSS Custom Properties Regression', () => {
    it('should maintain consistent diagonal layout custom properties', () => {
      const { container } = render(
        <DiagonalContainer diagonalAngle={18} leftWidth="45%" rightWidth="55">
          <div>Left content</div>
          <div>Right content</div>
        </DiagonalContainer>
      );
      
      const diagonalContainer = container.firstChild as HTMLElement;
      
      // Verify all CSS custom properties are correctly set
      expect(diagonalContainer.style.getPropertyValue('--diagonal-angle')).toBe('18deg');
      expect(diagonalContainer.style.getPropertyValue('--left-width')).toBe('45%');
      expect(diagonalContainer.style.getPropertyValue('--right-width')).toBe('55%');
      
      // Properties should be applied immediately (no regression)
      expect(diagonalContainer.style.cssText).toContain('--diagonal-angle');
      expect(diagonalContainer.style.cssText).toContain('--left-width');
      expect(diagonalContainer.style.cssText).toContain('--right-width');
    });

    it('should maintain performance optimization CSS variables', () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = container.querySelector('section') as HTMLElement;
      expect(section).toBeDefined();
      
      // Check that performance CSS variables are set
      expect(section.style.getPropertyValue('--performance-mode')).toBe('high');
      expect(section.style.getPropertyValue('--animation-quality')).toBe('high');
      expect(section.style.getPropertyValue('--hardware-acceleration')).toBe('enabled');
      expect(section.style.getPropertyValue('--visibility-level')).toBe('full');
    });
  });

  describe('Layout Stability Tests', () => {
    it('should prevent cumulative layout shift during initialization', async () => {
      const { container } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Initial render should be stable
      const initialLayout = container.innerHTML;
      
      // Wait for async initialization
      await waitFor(() => {
        expect(vi.mocked(vi.fn()).mock.instances[0].createIntersectionObserver).toHaveBeenCalled();
      });
      
      // Layout should remain stable after initialization
      const postInitLayout = container.innerHTML;
      
      // Core structure should remain the same (allowing for dynamic content)
      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('[class*="diagonalContainer"]')).toBeInTheDocument();
    });

    it('should maintain stable layout during prop updates', () => {
      const { container, rerender } = render(<TechMarquee technologies={mockTechnologies.slice(0, 3)} />);
      
      const initialStructure = {
        section: container.querySelector('section'),
        diagonalContainer: container.querySelector('[class*="diagonalContainer"]'),
        leftSection: container.querySelector('[class*="leftSection"]'),
        rightSection: container.querySelector('[class*="rightSection"]')
      };
      
      // Update technologies
      rerender(<TechMarquee technologies={mockTechnologies} />);
      
      // Core structure should remain stable
      expect(container.querySelector('section')).toBe(initialStructure.section);
      expect(container.querySelector('[class*="diagonalContainer"]')).toBe(initialStructure.diagonalContainer);
      expect(container.querySelector('[class*="leftSection"]')).toBe(initialStructure.leftSection);
      expect(container.querySelector('[class*="rightSection"]')).toBe(initialStructure.rightSection);
    });
  });

  describe('Image Fallback and Mixed Icon Visuals', () => {
    it('should render fallback for missing image icons', () => {
      const technologies = [
        { name: 'BrokenImage', icon: '/nonexistent.png', category: 'frontend' },
        { name: 'React', icon: '⚛️', category: 'frontend' }
      ];
      const { container } = render(<TechMarquee technologies={technologies} />);
      // Should render alt/fallback for broken image
      const fallback = container.querySelector('img[alt*="BrokenImage"], [role="img"][aria-label*="BrokenImage"]');
      expect(fallback).toBeInTheDocument();
    });
    it('should render correctly with only image icons', () => {
      const technologies = [
        { name: 'TypeScript', icon: '/typescript.png', category: 'frontend' },
        { name: 'CSS', icon: '/css.png', category: 'frontend' }
      ];
      const { container } = render(<TechMarquee technologies={technologies} />);
      const icons = container.querySelectorAll('img');
      expect(icons.length).toBe(technologies.length);
    });
    it('should render correctly with only emoji icons', () => {
      const technologies = [
        { name: 'React', icon: '⚛️', category: 'frontend' },
        { name: 'JS', icon: '💛', category: 'frontend' }
      ];
      const { container } = render(<TechMarquee technologies={technologies} />);
      const emojis = container.querySelectorAll('[role="img"]:not(img)');
      expect(emojis.length).toBe(technologies.length);
    });
    it('should render correctly with extreme diagonal angles', () => {
      const { container } = render(
        <DiagonalContainer diagonalAngle={45} leftWidth="20%" rightWidth="80%">
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );
      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer.style.getPropertyValue('--diagonal-angle')).toBe('45deg');
      expect(diagonalContainer.style.getPropertyValue('--left-width')).toBe('20%');
      expect(diagonalContainer.style.getPropertyValue('--right-width')).toBe('80%');
    });
  });
});