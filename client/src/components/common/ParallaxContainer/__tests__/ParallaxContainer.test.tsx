import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParallaxContainer } from '../ParallaxContainer';

// Mock the useParallax hook
vi.mock('../../../../hooks/useParallax', () => ({
  useParallax: vi.fn(() => ({
    ref: { current: null },
    offset: 0,
    isVisible: true
  }))
}));

// Mock the utils
vi.mock('../../../../lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' '))
}));

describe('ParallaxContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <ParallaxContainer>
        <div data-testid="child">Test Content</div>
      </ParallaxContainer>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default props correctly', () => {
    const { container } = render(
      <ParallaxContainer>
        <div>Test Content</div>
      </ParallaxContainer>
    );

    const parallaxDiv = container.firstChild as HTMLElement;
    expect(parallaxDiv).toHaveClass('will-change-transform');
    expect(parallaxDiv).toHaveStyle({
      transform: 'translateY(0px)',
      transition: 'transform 0.1s ease-out'
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <ParallaxContainer className="custom-class">
        <div>Test Content</div>
      </ParallaxContainer>
    );

    const parallaxDiv = container.firstChild as HTMLElement;
    expect(parallaxDiv).toHaveClass('will-change-transform', 'custom-class');
  });

  it('passes through additional props', () => {
    render(
      <ParallaxContainer data-testid="parallax-container" aria-label="Parallax Section">
        <div>Test Content</div>
      </ParallaxContainer>
    );

    const parallaxDiv = screen.getByTestId('parallax-container');
    expect(parallaxDiv).toHaveAttribute('aria-label', 'Parallax Section');
  });

  it('handles different speed and direction props', async () => {
    const { useParallax } = vi.mocked(await import('../../../../hooks/useParallax'));
    
    render(
      <ParallaxContainer speed={1.5} direction="down">
        <div>Test Content</div>
      </ParallaxContainer>
    );

    expect(useParallax).toHaveBeenCalledWith({
      speed: 1.5,
      direction: 'down',
      disabled: false
    });
  });
});