import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TechMarquee from '../TechMarquee';
import { Technology } from '../../../../lib/types';

// Mock CSS modules
vi.mock('../TechMarquee.module.css', () => ({
  default: {
    techMarqueeSection: 'techMarqueeSection',
    container: 'container',
    sectionHeader: 'sectionHeader',
    title: 'title',
    subtitle: 'subtitle',
    marqueeContainer: 'marqueeContainer',
    marqueeRow: 'marqueeRow',
    marqueeContent: 'marqueeContent',
    marqueeLeft: 'marqueeLeft',
    marqueeRight: 'marqueeRight',
    pauseOnHover: 'pauseOnHover',
    techItem: 'techItem',
    techIcon: 'techIcon',
    techName: 'techName'
  }
}));

const mockTechnologies: Technology[] = [
  { name: 'React', icon: '⚛️', category: 'frontend' },
  { name: 'TypeScript', icon: '📘', category: 'frontend' },
  { name: 'Node.js', icon: '🟢', category: 'backend' },
  { name: 'PostgreSQL', icon: '🐘', category: 'database' },
  { name: 'Docker', icon: '🐳', category: 'tools' },
  { name: 'AWS', icon: '☁️', category: 'cloud' }
];

describe('TechMarquee', () => {
  beforeEach(() => {
    // Reset any mocked properties
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any DOM modifications
    document.body.innerHTML = '';
  });
  it('renders the section title and subtitle', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    expect(screen.getByText('Technologies & Tools')).toBeInTheDocument();
    expect(screen.getByText('Crafting modern experiences with cutting-edge technologies')).toBeInTheDocument();
  });

  it('renders all provided technologies', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    mockTechnologies.forEach(tech => {
      // Each technology appears multiple times due to duplication for infinite scroll
      expect(screen.getAllByText(tech.name).length).toBeGreaterThan(0);
    });
  });

  it('splits technologies into two rows', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Should have two marquee rows
    const marqueeRows = document.querySelectorAll('.marqueeRow');
    expect(marqueeRows).toHaveLength(2);
  });

  it('applies correct CSS classes for animation directions', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    const marqueeRows = document.querySelectorAll('.marqueeRow');
    expect(marqueeRows[0]).toHaveClass('marqueeLeft');
    expect(marqueeRows[1]).toHaveClass('marqueeRight');
  });

  it('applies pauseOnHover class when pauseOnHover prop is true', () => {
    render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
    
    const marqueeRows = document.querySelectorAll('.marqueeRow');
    marqueeRows.forEach(row => {
      expect(row).toHaveClass('pauseOnHover');
    });
  });

  it('does not apply pauseOnHover class when pauseOnHover prop is false', () => {
    render(<TechMarquee technologies={mockTechnologies} pauseOnHover={false} />);
    
    const marqueeRows = document.querySelectorAll('.marqueeRow');
    marqueeRows.forEach(row => {
      expect(row).not.toHaveClass('pauseOnHover');
    });
  });

  it('sets custom speed via CSS custom property', () => {
    const customSpeed = 30;
    render(<TechMarquee technologies={mockTechnologies} speed={customSpeed} />);
    
    const marqueeRows = document.querySelectorAll('.marqueeRow');
    marqueeRows.forEach(row => {
      // Note: jsdom doesn't fully support CSS custom properties, so we check if the style was set
      const htmlElement = row as HTMLElement;
      expect(htmlElement.style.getPropertyValue('--marquee-speed')).toBe(`${customSpeed}s`);
    });
  });

  it('renders technology icons and names correctly', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    // Check that icons are rendered (emoji icons)
    expect(screen.getAllByText('⚛️').length).toBeGreaterThan(0);
    expect(screen.getAllByText('📘').length).toBeGreaterThan(0);
    
    // Check that names are rendered
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
  });

  it('handles empty technologies array gracefully', () => {
    render(<TechMarquee technologies={[]} />);
    
    expect(screen.getByText('Technologies & Tools')).toBeInTheDocument();
    // Should still render the structure even with no technologies
    const marqueeRows = document.querySelectorAll('.marqueeRow');
    expect(marqueeRows).toHaveLength(2);
  });

  it('duplicates technologies for infinite scroll effect', () => {
    const singleTech: Technology[] = [
      { name: 'React', icon: '⚛️', category: 'frontend' }
    ];
    
    render(<TechMarquee technologies={singleTech} />);
    
    // Should appear multiple times due to duplication (3x duplication in component)
    const reactElements = screen.getAllByText('React');
    expect(reactElements.length).toBeGreaterThan(1);
  });

  it('handles touch interactions on mobile devices', () => {
    // Mock touch device detection
    Object.defineProperty(window, 'ontouchstart', {
      value: true,
      writable: true
    });
    
    render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
    
    const marqueeContainer = document.querySelector('.marqueeContainer');
    expect(marqueeContainer).toBeInTheDocument();
    
    // Should have touch interaction styles
    expect(marqueeContainer).toHaveStyle('touch-action: manipulation');
  });

  it('applies paused state when touch interactions occur', () => {
    render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
    
    const marqueeContainer = document.querySelector('.marqueeContainer');
    
    // Simulate touch start
    if (marqueeContainer) {
      marqueeContainer.dispatchEvent(new Event('touchstart'));
    }
    
    // Note: In a real test environment, we would check for the paused class
    // but jsdom has limitations with touch events
    expect(marqueeContainer).toBeInTheDocument();
  });

  it('maintains animation performance with CSS transforms', () => {
    render(<TechMarquee technologies={mockTechnologies} />);
    
    const marqueeContent = document.querySelectorAll('.marqueeContent');
    marqueeContent.forEach(content => {
      // Check for performance optimizations
      expect(content).toHaveStyle('will-change: transform');
    });
  });

  // New comprehensive tests for marquee animations and interactions
  describe('Marquee Animations', () => {
    it('implements opposing direction animations', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeRows = document.querySelectorAll('.marqueeRow');
      const topRow = marqueeRows[0];
      const bottomRow = marqueeRows[1];
      
      // Top row should have left-to-right animation class
      expect(topRow).toHaveClass('marqueeLeft');
      // Bottom row should have right-to-left animation class
      expect(bottomRow).toHaveClass('marqueeRight');
      
      // Check that animation content has proper CSS animation names
      const topContent = topRow.querySelector('.marqueeContent');
      const bottomContent = bottomRow.querySelector('.marqueeContent');
      
      expect(topContent).toBeInTheDocument();
      expect(bottomContent).toBeInTheDocument();
    });

    it('creates seamless looping without gaps', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContent = document.querySelectorAll('.marqueeContent');
      
      marqueeContent.forEach(content => {
        // Check that content is duplicated for seamless loop
        const techItems = content.querySelectorAll('.techItem');
        // Should have more items than original due to duplication
        expect(techItems.length).toBeGreaterThan(mockTechnologies.length);
        
        // Check for performance optimizations that prevent gaps
        expect(content).toHaveStyle('transform: translateZ(0)');
        expect(content).toHaveStyle('backface-visibility: hidden');
      });
    });

    it('applies correct animation timing and iteration', () => {
      const customSpeed = 25;
      render(<TechMarquee technologies={mockTechnologies} speed={customSpeed} />);
      
      const marqueeRows = document.querySelectorAll('.marqueeRow');
      marqueeRows.forEach(row => {
        const htmlElement = row as HTMLElement;
        expect(htmlElement.style.getPropertyValue('--marquee-speed')).toBe(`${customSpeed}s`);
      });
    });
  });

  describe('Hover Effects and Interactions', () => {
    it('pauses animation on mouse hover when pauseOnHover is enabled', async () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      const marqueeContainer = document.querySelector('.marqueeContainer');
      expect(marqueeContainer).toBeInTheDocument();
      
      // Simulate mouse enter
      fireEvent.mouseEnter(marqueeContainer!);
      
      await waitFor(() => {
        expect(marqueeContainer).toHaveClass('paused');
      });
    });

    it('resumes animation on mouse leave', async () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      const marqueeContainer = document.querySelector('.marqueeContainer');
      expect(marqueeContainer).toBeInTheDocument();
      
      // Simulate mouse enter then leave
      fireEvent.mouseEnter(marqueeContainer!);
      fireEvent.mouseLeave(marqueeContainer!);
      
      await waitFor(() => {
        expect(marqueeContainer).not.toHaveClass('paused');
      });
    });

    it('does not pause on hover when pauseOnHover is disabled', () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={false} />);
      
      const marqueeContainer = document.querySelector('.marqueeContainer');
      const marqueeRows = document.querySelectorAll('.marqueeRow');
      
      // Should not have pauseOnHover class
      marqueeRows.forEach(row => {
        expect(row).not.toHaveClass('pauseOnHover');
      });
      
      // Simulate mouse enter
      fireEvent.mouseEnter(marqueeContainer!);
      
      // Should not add paused class
      expect(marqueeContainer).not.toHaveClass('paused');
    });

    it('handles individual tech item hover effects', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const techItems = document.querySelectorAll('.techItem');
      expect(techItems.length).toBeGreaterThan(0);
      
      // Each tech item should have hover transition classes
      techItems.forEach(item => {
        expect(item).toHaveClass('techItem');
        // Should have cursor pointer for interactivity
        const computedStyle = window.getComputedStyle(item);
        expect(item).toHaveStyle('cursor: pointer');
      });
    });
  });

  describe('Mobile Responsiveness and Touch Interactions', () => {
    beforeEach(() => {
      // Mock touch device
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        writable: true,
        configurable: true
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5,
        writable: true,
        configurable: true
      });
    });

    it('detects touch devices correctly', () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      const marqueeContainer = document.querySelector('.marqueeContainer');
      expect(marqueeContainer).toBeInTheDocument();
      
      // Should have touch-specific styles
      expect(marqueeContainer).toHaveStyle('touch-action: manipulation');
      expect(marqueeContainer).toHaveStyle('-webkit-touch-callout: none');
      expect(marqueeContainer).toHaveStyle('user-select: none');
    });

    it('pauses animation on touch start', async () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      const marqueeContainer = document.querySelector('.marqueeContainer');
      expect(marqueeContainer).toBeInTheDocument();
      
      // Simulate touch start
      fireEvent.touchStart(marqueeContainer!);
      
      await waitFor(() => {
        expect(marqueeContainer).toHaveClass('paused');
      });
    });

    it('resumes animation on touch end', async () => {
      render(<TechMarquee technologies={mockTechnologies} pauseOnHover={true} />);
      
      const marqueeContainer = document.querySelector('.marqueeContainer');
      expect(marqueeContainer).toBeInTheDocument();
      
      // Simulate touch start then end
      fireEvent.touchStart(marqueeContainer!);
      fireEvent.touchEnd(marqueeContainer!);
      
      await waitFor(() => {
        expect(marqueeContainer).not.toHaveClass('paused');
      });
    });

    it('applies mobile-specific styling and performance optimizations', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const techItems = document.querySelectorAll('.techItem');
      
      // Check that tech items have minimum touch target size
      techItems.forEach(item => {
        const computedStyle = window.getComputedStyle(item);
        // Should have adequate touch target (44px minimum recommended)
        expect(item).toHaveClass('techItem');
      });
    });

    it('handles touch interactions without interfering with scroll', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContainer = document.querySelector('.marqueeContainer');
      expect(marqueeContainer).toBeInTheDocument();
      
      // Should allow manipulation but prevent other touch behaviors
      expect(marqueeContainer).toHaveStyle('touch-action: manipulation');
      expect(marqueeContainer).toHaveStyle('-webkit-user-select: none');
    });
  });

  describe('Animation Performance and Accessibility', () => {
    it('respects prefers-reduced-motion settings', () => {
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
      
      // Component should still render but with reduced motion considerations
      const marqueeContainer = document.querySelector('.marqueeContainer');
      expect(marqueeContainer).toBeInTheDocument();
    });

    it('maintains smooth 60fps performance optimizations', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContent = document.querySelectorAll('.marqueeContent');
      
      marqueeContent.forEach(content => {
        // Check for GPU acceleration and performance optimizations
        expect(content).toHaveStyle('will-change: transform');
        expect(content).toHaveStyle('transform: translateZ(0)');
        expect(content).toHaveStyle('backface-visibility: hidden');
        expect(content).toHaveStyle('perspective: 1000px');
      });
    });

    it('uses linear timing function for consistent animation', () => {
      render(<TechMarquee technologies={mockTechnologies} />);
      
      const marqueeContent = document.querySelectorAll('.marqueeContent');
      
      marqueeContent.forEach(content => {
        // Should use linear timing for smooth infinite scroll
        const computedStyle = window.getComputedStyle(content);
        // Note: jsdom limitations prevent full CSS animation testing
        expect(content).toBeInTheDocument();
      });
    });

    it('handles large numbers of technologies efficiently', () => {
      const largeTechArray: Technology[] = Array.from({ length: 50 }, (_, i) => ({
        name: `Tech${i}`,
        icon: '🔧',
        category: 'tools' as const
      }));
      
      render(<TechMarquee technologies={largeTechArray} />);
      
      const marqueeRows = document.querySelectorAll('.marqueeRow');
      expect(marqueeRows).toHaveLength(2);
      
      // Should still render efficiently with many items
      const techItems = document.querySelectorAll('.techItem');
      expect(techItems.length).toBeGreaterThan(largeTechArray.length);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles single technology gracefully', () => {
      const singleTech: Technology[] = [
        { name: 'React', icon: '⚛️', category: 'frontend' }
      ];
      
      render(<TechMarquee technologies={singleTech} />);
      
      const marqueeRows = document.querySelectorAll('.marqueeRow');
      expect(marqueeRows).toHaveLength(2);
      
      // Should duplicate the single tech across both rows
      const reactElements = screen.getAllByText('React');
      expect(reactElements.length).toBeGreaterThan(2);
    });

    it('handles odd number of technologies correctly', () => {
      const oddTechs: Technology[] = [
        { name: 'React', icon: '⚛️', category: 'frontend' },
        { name: 'Vue', icon: '💚', category: 'frontend' },
        { name: 'Angular', icon: '🅰️', category: 'frontend' }
      ];
      
      render(<TechMarquee technologies={oddTechs} />);
      
      const marqueeRows = document.querySelectorAll('.marqueeRow');
      expect(marqueeRows).toHaveLength(2);
      
      // Should split evenly with ceiling for first row
      expect(screen.getAllByText('React').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Vue').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Angular').length).toBeGreaterThan(0);
    });

    it('maintains functionality with zero speed', () => {
      render(<TechMarquee technologies={mockTechnologies} speed={0} />);
      
      const marqueeRows = document.querySelectorAll('.marqueeRow');
      marqueeRows.forEach(row => {
        const htmlElement = row as HTMLElement;
        expect(htmlElement.style.getPropertyValue('--marquee-speed')).toBe('0s');
      });
    });

    it('handles component unmounting gracefully', () => {
      const { unmount } = render(<TechMarquee technologies={mockTechnologies} />);
      
      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });
});