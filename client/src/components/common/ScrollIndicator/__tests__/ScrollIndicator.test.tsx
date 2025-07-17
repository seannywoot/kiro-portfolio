import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScrollIndicator, CircularScrollIndicator } from '../ScrollIndicator';

// Mock the useScrollProgress hook
vi.mock('../../../../hooks/useScrollProgress', () => ({
  useScrollProgress: vi.fn(() => ({
    progress: 0.5, // 50% scrolled
    scrollY: 500,
    scrollDirection: 'down' as const
  }))
}));

// Mock the utils
vi.mock('../../../../lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' '))
}));

describe('ScrollIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    const { container } = render(<ScrollIndicator />);
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
    
    const progressBar = indicator.firstChild as HTMLElement;
    expect(progressBar).toHaveStyle({
      width: '50%',
      height: '4px'
    });
  });

  it('shows percentage when enabled', () => {
    render(<ScrollIndicator showPercentage={true} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('applies custom position classes', () => {
    const { container } = render(<ScrollIndicator position="bottom" />);
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0', 'z-50');
  });

  it('handles vertical positioning', () => {
    const { container } = render(<ScrollIndicator position="left" thickness={6} />);
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('fixed', 'top-0', 'left-0', 'bottom-0', 'z-50');
    
    const progressBar = indicator.firstChild as HTMLElement;
    expect(progressBar).toHaveStyle({
      height: '50%',
      width: '6px'
    });
  });

  it('applies custom color and thickness', () => {
    const { container } = render(
      <ScrollIndicator color="bg-red-500" thickness={8} />
    );
    
    const progressBar = container.firstChild?.firstChild as HTMLElement;
    expect(progressBar).toHaveClass('bg-red-500');
    expect(progressBar).toHaveStyle({
      height: '8px'
    });
  });

  it('applies custom className', () => {
    const { container } = render(<ScrollIndicator className="custom-class" />);
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('custom-class');
  });
});

describe('CircularScrollIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    const { container } = render(<CircularScrollIndicator />);
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-50');
    
    const svg = indicator.querySelector('svg');
    expect(svg).toHaveAttribute('width', '60');
    expect(svg).toHaveAttribute('height', '60');
  });

  it('shows percentage when enabled', () => {
    render(<CircularScrollIndicator showPercentage={true} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    const { container } = render(<CircularScrollIndicator size={80} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '80');
    expect(svg).toHaveAttribute('height', '80');
  });

  it('calculates stroke properties correctly', () => {
    const { container } = render(
      <CircularScrollIndicator size={60} strokeWidth={4} />
    );
    
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2); // Background and progress circles
    
    const progressCircle = circles[1];
    expect(progressCircle).toHaveAttribute('stroke-width', '4');
    
    // Check that stroke-dasharray and stroke-dashoffset are calculated
    const strokeDasharray = progressCircle.getAttribute('stroke-dasharray');
    const strokeDashoffset = progressCircle.getAttribute('stroke-dashoffset');
    expect(strokeDasharray).toBeTruthy();
    expect(strokeDashoffset).toBeTruthy();
  });

  it('applies custom colors', () => {
    const { container } = render(
      <CircularScrollIndicator 
        color="#FF0000" 
        backgroundColor="#00FF00" 
      />
    );
    
    const circles = container.querySelectorAll('circle');
    const backgroundCircle = circles[0];
    const progressCircle = circles[1];
    
    expect(backgroundCircle).toHaveAttribute('stroke', '#00FF00');
    expect(progressCircle).toHaveAttribute('stroke', '#FF0000');
  });

  it('handles visibility based on scroll progress', async () => {
    const { useScrollProgress } = vi.mocked(await import('../../../../hooks/useScrollProgress'));
    
    // Test with very low progress (should be hidden)
    useScrollProgress.mockReturnValue({ 
      progress: 0.01, 
      scrollY: 10, 
      scrollDirection: 'down' 
    });
    const { container, rerender } = render(<CircularScrollIndicator />);
    
    let indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('opacity-0');
    
    // Test with higher progress (should be visible)
    useScrollProgress.mockReturnValue({ 
      progress: 0.1, 
      scrollY: 100, 
      scrollDirection: 'down' 
    });
    rerender(<CircularScrollIndicator />);
    
    indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('opacity-100');
  });

  it('applies custom className', () => {
    const { container } = render(<CircularScrollIndicator className="custom-class" />);
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('custom-class');
  });
});