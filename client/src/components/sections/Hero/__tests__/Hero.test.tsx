import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hero } from '../Hero';

// Mock the shared components
vi.mock('../../../common/AnimatedText/AnimatedText', () => ({
  AnimatedText: ({ children, text, className }: any) => (
    <div className={className} data-testid="animated-text">
      {text || children}
    </div>
  )
}));

vi.mock('../../../common/ParallaxContainer/ParallaxContainer', () => ({
  ParallaxContainer: ({ children, className }: any) => (
    <div className={className} data-testid="parallax-container">
      {children}
    </div>
  )
}));

// Mock the UI components
vi.mock('../../../ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ChevronDown: (props: any) => <div data-testid="chevron-down" {...props} />
}));

// Mock utils
vi.mock('../../../../lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' '))
}));

describe('Hero', () => {
  const defaultProps = {
    name: 'John Doe',
    title: 'Full Stack Developer',
    description: 'Building amazing web experiences with modern technologies',
    ctaText: 'View My Work',
    onCtaClick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required content', () => {
    render(<Hero {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    expect(screen.getByText('Building amazing web experiences with modern technologies')).toBeInTheDocument();
    expect(screen.getByText('View My Work')).toBeInTheDocument();
  });

  it('renders avatar when provided', () => {
    render(<Hero {...defaultProps} avatar="/path/to/avatar.jpg" />);

    const avatar = screen.getByAltText('John Doe - Portfolio');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/path/to/avatar.jpg');
  });

  it('does not render avatar when not provided', () => {
    render(<Hero {...defaultProps} />);

    const avatar = screen.queryByAltText('John Doe - Portfolio');
    expect(avatar).not.toBeInTheDocument();
  });

  it('calls onCtaClick when CTA button is clicked', () => {
    render(<Hero {...defaultProps} />);

    const ctaButton = screen.getByText('View My Work');
    fireEvent.click(ctaButton);

    expect(defaultProps.onCtaClick).toHaveBeenCalledTimes(1);
  });

  it('renders scroll indicator with proper accessibility', () => {
    render(<Hero {...defaultProps} />);

    const scrollButton = screen.getByLabelText('Scroll to next section');
    expect(scrollButton).toBeInTheDocument();
    expect(screen.getByText('Scroll Down')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('handles scroll to next section', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);

    render(<Hero {...defaultProps} />);

    const scrollButton = screen.getByLabelText('Scroll to next section');
    fireEvent.click(scrollButton);

    expect(document.querySelector).toHaveBeenCalledWith('[data-section="tech-marquee"]');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('applies custom className', () => {
    const { container } = render(<Hero {...defaultProps} className="custom-hero" />);

    const heroSection = container.firstChild as HTMLElement;
    expect(heroSection).toHaveClass('custom-hero');
  });

  it('passes through additional props', () => {
    render(<Hero {...defaultProps} data-testid="hero-section" />);

    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toBeInTheDocument();
  });

  it('has proper section data attribute', () => {
    const { container } = render(<Hero {...defaultProps} />);

    const heroSection = container.firstChild as HTMLElement;
    expect(heroSection).toHaveAttribute('data-section', 'hero');
  });

  it('renders parallax containers for background effects', () => {
    render(<Hero {...defaultProps} />);

    const parallaxContainers = screen.getAllByTestId('parallax-container');
    expect(parallaxContainers).toHaveLength(2); // Background pattern and gradient orb
  });

  it('renders animated text components with proper delays', () => {
    render(<Hero {...defaultProps} />);

    const animatedTexts = screen.getAllByTestId('animated-text');
    expect(animatedTexts.length).toBeGreaterThanOrEqual(4); // Name, title, description, and CTA wrapper
  });

  it('applies proper semantic HTML structure', () => {
    const { container } = render(<Hero {...defaultProps} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-section', 'hero');
  });
});