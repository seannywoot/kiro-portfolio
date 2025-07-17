import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnimatedText } from '../AnimatedText';

// Mock the hooks
vi.mock('../../../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: vi.fn(() => ({
    ref: { current: null },
    isIntersecting: true
  }))
}));

// Mock the utils and animations
vi.mock('../../../../lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' '))
}));

vi.mock('../../../../lib/animations', () => ({
  prefersReducedMotion: vi.fn(() => false)
}));

describe('AnimatedText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders text correctly', () => {
    render(<AnimatedText text="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies fadeIn animation by default', async () => {
    const { container } = render(<AnimatedText text="Hello World" />);
    
    // Initially should have opacity-0
    const textDiv = container.firstChild as HTMLElement;
    expect(textDiv).toHaveClass('opacity-0');
    
    // After animation trigger, should have opacity-100
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      expect(textDiv).toHaveClass('opacity-100');
    });
  });

  it('applies slideUp animation correctly', async () => {
    const { container } = render(<AnimatedText text="Hello World" animation="slideUp" />);
    
    const textDiv = container.firstChild as HTMLElement;
    expect(textDiv).toHaveClass('opacity-0', 'translate-y-8');
    
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      expect(textDiv).toHaveClass('opacity-100', 'translate-y-0');
    });
  });

  it('handles typewriter animation', async () => {
    render(<AnimatedText text="Hello" animation="typewriter" />);
    
    // Initially should show empty text
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    
    // Advance timers to trigger typewriter effect
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      // Should start showing characters
      expect(screen.getByText(/H/)).toBeInTheDocument();
    });
  });

  it('respects delay prop', async () => {
    const { container } = render(<AnimatedText text="Hello World" delay={500} />);
    
    const textDiv = container.firstChild as HTMLElement;
    expect(textDiv).toHaveClass('opacity-0');
    
    // Should not animate immediately
    vi.advanceTimersByTime(100);
    expect(textDiv).toHaveClass('opacity-0');
    
    // Should animate after delay
    vi.advanceTimersByTime(500);
    await waitFor(() => {
      expect(textDiv).toHaveClass('opacity-100');
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedText text="Hello World" className="custom-class" />
    );
    
    const textDiv = container.firstChild as HTMLElement;
    expect(textDiv).toHaveClass('custom-class');
  });

  it('respects prefers-reduced-motion', async () => {
    const { prefersReducedMotion } = vi.mocked(await import('../../../../lib/animations'));
    prefersReducedMotion.mockReturnValue(true);
    
    const { container } = render(<AnimatedText text="Hello World" />);
    
    const textDiv = container.firstChild as HTMLElement;
    // Should not have animation classes when reduced motion is preferred
    expect(textDiv).not.toHaveClass('opacity-0');
  });

  it('passes through additional props', () => {
    render(
      <AnimatedText 
        text="Hello World" 
        data-testid="animated-text" 
        aria-label="Animated Text"
      />
    );
    
    const textDiv = screen.getByTestId('animated-text');
    expect(textDiv).toHaveAttribute('aria-label', 'Animated Text');
  });
});