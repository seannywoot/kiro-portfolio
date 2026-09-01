import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders hero component placeholder without errors', () => {
    const { container } = render(<Hero />);
    expect(container).toBeInTheDocument();
  });
});