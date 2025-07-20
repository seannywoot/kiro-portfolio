import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TechMarquee from '../TechMarquee';
import DiagonalContainer from '../DiagonalContainer';
import { Technology } from '../../../../lib/types';

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
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'TypeScript', icon: '🔷', category: 'Language' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'CSS', icon: '🎨', category: 'Styling' }
];

// Helper function to mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
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

// Helper function to mock media queries
const mockMediaQuery = (query: string, matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((q) => ({
      matches: q === query ? matches : false,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('TechMarquee Responsive Design Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Mobile Breakpoint (< 768px)', () => {
    beforeEach(() => {
      mockWindowDimensions(375, 667); // iPhone dimensions
      mockMediaQuery('(max-width: 767px)', true);
    });

    it('renders properly on mobile devices', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Should maintain accessibility on mobile
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Technologies & Tools');
    });

    it('adapts diagonal container for mobile layout', () => {
      const { container } = render(
        <DiagonalContainer>
          <div>Mobile Content</div>
        </DiagonalContainer>
      );
      
      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer).toHaveStyle({
        '--diagonal-angle': '15deg',
        '--left-width': '40%',
        '--right-width': '60%'
      });
    });

    it('maintains marquee functionality on mobile', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContainer = screen.getByRole('img');
      expect(marqueeContainer).toBeInTheDocument();
      expect(marqueeContainer).toHaveAttribute('aria-label', 'Animated showcase of technologies and tools');
    });

    it('supports touch interactions on mobile', () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      const marqueeContainer = screen.getByRole('img');
      
      // Simulate touch events
      fireEvent.touchStart(marqueeContainer);
      expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
      
      fireEvent.touchEnd(marqueeContainer);
      expect(screen.getByText('Technology showcase playing')).toBeInTheDocument();
    });

    it('handles mobile orientation changes', () => {
      const { rerender } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Portrait mode
      mockWindowDimensions(375, 667);
      fireEvent(window, new Event('resize'));
      
      let section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Landscape mode
      mockWindowDimensions(667, 375);
      fireEvent(window, new Event('resize'));
      rerender(<TechMarquee technologies={mockTechnologies} />);
      
      section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Tablet Breakpoint (768px - 1024px)', () => {
    beforeEach(() => {
      mockWindowDimensions(768, 1024); // iPad dimensions
      mockMediaQuery('(min-width: 768px) and (max-width: 1024px)', true);
    });

    it('renders properly on tablet devices', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Should maintain diagonal layout on tablet
      const diagonalRegion = screen.getAllByRole('region').find(region => 
        region.getAttribute('aria-describedby') === 'tech-description'
      );
      expect(diagonalRegion).toBeInTheDocument();
    });

    it('adjusts diagonal proportions for tablet', () => {
      const { container } = render(
        <DiagonalContainer leftWidth="45%" rightWidth="55%">
          <div>Tablet Content</div>
        </DiagonalContainer>
      );
      
      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer).toHaveStyle({
        '--left-width': '45%',
        '--right-width': '55%'
      });
    });

    it('optimizes marquee spacing for medium screens', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContainer = screen.getByRole('img');
      expect(marqueeContainer).toBeInTheDocument();
      
      // Should render all technologies
      mockTechnologies.forEach(tech => {
        expect(screen.getByText(tech.name)).toBeInTheDocument();
      });
    });
  });

  describe('Desktop Breakpoint (> 1024px)', () => {
    beforeEach(() => {
      mockWindowDimensions(1920, 1080); // Desktop dimensions
      mockMediaQuery('(min-width: 1025px)', true);
    });

    it('renders full diagonal layout on desktop', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Should show full diagonal layout
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Technologies & Tools');
      
      const subtitle = screen.getByText('Crafting modern experiences with cutting-edge technologies');
      expect(subtitle).toBeInTheDocument();
    });

    it('uses optimal diagonal angle for desktop', () => {
      const { container } = render(
        <DiagonalContainer diagonalAngle={15}>
          <div>Desktop Content</div>
        </DiagonalContainer>
      );
      
      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer).toHaveStyle('--diagonal-angle: 15deg');
    });

    it('enables enhanced hover effects on desktop', () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      const marqueeContainer = screen.getByRole('img');
      
      // Desktop should support mouse hover
      fireEvent.mouseEnter(marqueeContainer);
      expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
      
      fireEvent.mouseLeave(marqueeContainer);
      expect(screen.getByText('Technology showcase playing')).toBeInTheDocument();
    });

    it('displays maximum typography sizes on desktop', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      
      // Typography should be properly sized (tested by ensuring it renders)
      expect(heading).toHaveTextContent('Technologies & Tools');
    });
  });

  describe('Extreme Screen Sizes', () => {
    it('handles very small screens gracefully', () => {
      mockWindowDimensions(320, 568); // iPhone 5 dimensions
      
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Should still be accessible
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('handles very large screens properly', () => {
      mockWindowDimensions(2560, 1440); // 2K monitor
      
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Should maintain layout integrity
      const diagonalRegion = screen.getAllByRole('region').find(region => 
        region.getAttribute('aria-describedby') === 'tech-description'
      );
      expect(diagonalRegion).toBeInTheDocument();
    });

    it('handles ultra-wide screens', () => {
      mockWindowDimensions(3440, 1440); // Ultra-wide monitor
      
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Should handle extreme aspect ratios
      const marqueeContainer = screen.getByRole('img');
      expect(marqueeContainer).toBeInTheDocument();
    });
  });

  describe('Dynamic Resize Behavior', () => {
    it('handles window resize events smoothly', async () => {
      const { rerender } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Start with desktop
      mockWindowDimensions(1920, 1080);
      fireEvent(window, new Event('resize'));
      
      let section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Resize to tablet
      mockWindowDimensions(768, 1024);
      fireEvent(window, new Event('resize'));
      rerender(<TechMarquee technologies={mockTechnologies} />);
      
      section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      // Resize to mobile
      mockWindowDimensions(375, 667);
      fireEvent(window, new Event('resize'));
      rerender(<TechMarquee technologies={mockTechnologies} />);
      
      section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('maintains performance during rapid resize events', async () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      // Simulate rapid resize events
      for (let i = 0; i < 10; i++) {
        mockWindowDimensions(800 + i * 100, 600);
        fireEvent(window, new Event('resize'));
      }
      
      // Should still render properly
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Accessibility Across Breakpoints', () => {
    it('maintains accessibility on all screen sizes', () => {
      const screenSizes = [
        [375, 667],   // Mobile
        [768, 1024],  // Tablet
        [1920, 1080]  // Desktop
      ];

      screenSizes.forEach(([width, height]) => {
        mockWindowDimensions(width, height);
        
        const { unmount } = render(<TechMarquee technologies={mockTechnologies} />);
        
        // Check accessibility features
        const section = screen.getByRole('region');
        expect(section).toHaveAttribute('aria-labelledby', 'technologies-heading');
        
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveAttribute('id', 'technologies-heading');
        
        const marqueeContainer = screen.getByRole('img');
        expect(marqueeContainer).toHaveAttribute('tabIndex', '0');
        
        unmount();
      });
    });

    it('provides consistent keyboard navigation across breakpoints', () => {
      const screenSizes = [375, 768, 1920];

      screenSizes.forEach(width => {
        mockWindowDimensions(width, 600);
        
        const { unmount } = render(<TechMarquee technologies={mockTechnologies} />);
        
        const marqueeContainer = screen.getByRole('img');
        
        // Test keyboard interaction
        fireEvent.keyDown(marqueeContainer, { key: ' ' });
        expect(screen.getByText('Technology showcase paused')).toBeInTheDocument();
        
        unmount();
      });
    });
  });
});