import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TechIcon from '../TechIcon';
import { Technology, ImageIcon } from '../../../../lib/types';

describe('TechIcon', () => {
  it('renders emoji icons correctly', () => {
    const technology: Technology = {
      name: 'React',
      icon: '⚛️',
      category: 'frontend'
    };

    render(<TechIcon technology={technology} />);
    expect(screen.getByText('⚛️')).toBeInTheDocument();
  });

  it('renders image icons with proper alt text', () => {
    const imageIcon: ImageIcon = {
      type: 'image',
      src: '/react.png',
      alt: 'React logo',
      fallback: '⚛️'
    };

    const technology: Technology = {
      name: 'React',
      icon: imageIcon,
      category: 'frontend'
    };

    render(<TechIcon technology={technology} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/react.png');
    expect(img).toHaveAttribute('alt', 'React logo');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('handles image loading errors with fallback', () => {
    const imageIcon: ImageIcon = {
      type: 'image',
      src: '/invalid-image.png',
      alt: 'Invalid image',
      fallback: '💻'
    };

    const technology: Technology = {
      name: 'Test Tech',
      icon: imageIcon,
      category: 'frontend'
    };

    render(<TechIcon technology={technology} />);
    const img = screen.getByRole('img');
    
    // Simulate image error
    fireEvent.error(img);
    
    // Should show fallback
    expect(screen.getByText('💻')).toBeInTheDocument();
  });

  it('renders React component icons', () => {
    const IconComponent = () => <span data-testid="custom-icon">Custom</span>;
    
    const technology: Technology = {
      name: 'Custom Tech',
      icon: IconComponent,
      category: 'tools'
    };

    render(<TechIcon technology={technology} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const technology: Technology = {
      name: 'React',
      icon: '⚛️',
      category: 'frontend'
    };

    const { container } = render(<TechIcon technology={technology} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});