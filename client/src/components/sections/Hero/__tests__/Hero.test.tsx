import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders all key text elements from the reference design', () => {
    render(<Hero />);

    expect(screen.getByText(/Structured/i)).toBeInTheDocument();
    expect(screen.getByText(/by design/i)).toBeInTheDocument();
    expect(screen.getByText(/Interfaces built around clear hierarchy/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Seann$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Tamondong$/i })).toBeInTheDocument();
    expect(screen.getAllByText(/FRONT-END DEVELOPER/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/UI\/UX DESIGNER/i)).toBeInTheDocument();
    expect(screen.getByText(/GRAPHIC DESIGNER/i)).toBeInTheDocument();
  });

  it('handles scroll CTA click', () => {
    const handleCta = vi.fn();
    render(<Hero onCtaClick={handleCta} />);

    const button = screen.getByRole('button', { name: /explore projects section/i });
    fireEvent.click(button);

    expect(handleCta).toHaveBeenCalledTimes(1);
  });
});