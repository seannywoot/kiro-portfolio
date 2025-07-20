import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LeftSection from '../LeftSection';

describe('LeftSection', () => {
  const defaultProps = {
    title: 'Technologies & Tools',
    subtitle: 'Crafting modern experiences with cutting-edge technologies'
  };

  it('renders title and subtitle correctly', () => {
    render(<LeftSection {...defaultProps} />);
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Technologies & Tools');
    expect(screen.getByText('Crafting modern experiences with cutting-edge technologies')).toBeInTheDocument();
  });

  it('has proper heading hierarchy and accessibility attributes', () => {
    render(<LeftSection {...defaultProps} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'technologies-heading');
    expect(heading).toHaveAttribute('aria-level', '2');
    
    const subtitle = screen.getByText(defaultProps.subtitle);
    expect(subtitle).toHaveAttribute('aria-describedby', 'technologies-heading');
  });

  it('has proper ARIA role and label', () => {
    render(<LeftSection {...defaultProps} />);
    
    const section = screen.getByRole('banner');
    expect(section).toHaveAttribute('aria-label', 'Technology section introduction');
  });

  it('applies custom className', () => {
    const { container } = render(
      <LeftSection {...defaultProps} className="custom-left-section" />
    );
    
    expect(container.firstChild).toHaveClass('custom-left-section');
  });

  it('handles empty title gracefully', () => {
    render(<LeftSection title="" subtitle={defaultProps.subtitle} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
  });

  it('handles empty subtitle gracefully', () => {
    const { container } = render(<LeftSection title={defaultProps.title} subtitle="" />);
    
    const subtitle = container.querySelector('p');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('');
  });

  it('handles long title text', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines in the diagonal layout';
    render(<LeftSection title={longTitle} subtitle={defaultProps.subtitle} />);
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(longTitle);
  });

  it('handles long subtitle text', () => {
    const longSubtitle = 'This is a very long subtitle that describes the technologies and tools section in great detail and might wrap to multiple lines depending on the screen size and layout configuration';
    render(<LeftSection title={defaultProps.title} subtitle={longSubtitle} />);
    
    expect(screen.getByText(longSubtitle)).toBeInTheDocument();
  });

  it('maintains semantic HTML structure', () => {
    const { container } = render(<LeftSection {...defaultProps} />);
    
    // Check that the structure contains proper semantic elements
    const section = container.querySelector('[role="banner"]');
    const content = section?.querySelector('div');
    const heading = content?.querySelector('h2');
    const paragraph = content?.querySelector('p');
    
    expect(section).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });

  it('supports special characters in title and subtitle', () => {
    const specialTitle = 'Technologies & Tools™';
    const specialSubtitle = 'Crafting modern experiences with cutting-edge technologies 🚀';
    
    render(<LeftSection title={specialTitle} subtitle={specialSubtitle} />);
    
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
    expect(screen.getByText(specialSubtitle)).toBeInTheDocument();
  });
});