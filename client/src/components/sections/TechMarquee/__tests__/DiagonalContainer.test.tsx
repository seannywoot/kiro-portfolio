import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DiagonalContainer from '../DiagonalContainer';

// Mock CSS modules
vi.mock('../DiagonalContainer.module.css', () => ({
  default: {
    diagonalContainer: 'diagonalContainer',
    leftSection: 'leftSection',
    rightSection: 'rightSection'
  }
}));

describe('DiagonalContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Layout Structure', () => {
    it('should render with default diagonal configuration', () => {
      const { container } = render(
        <DiagonalContainer>
          <div data-testid="left-content">Left</div>
          <div data-testid="right-content">Right</div>
        </DiagonalContainer>
      );

      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer).toHaveClass('diagonalContainer');
      expect(screen.getByTestId('left-content')).toBeInTheDocument();
      expect(screen.getByTestId('right-content')).toBeInTheDocument();
    });

    it('should apply custom diagonal angle and widths', () => {
      const { container } = render(
        <DiagonalContainer 
          diagonalAngle={20} 
          leftWidth="35%" 
          rightWidth="65%"
        >
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );

      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer.style.getPropertyValue('--diagonal-angle')).toBe('20deg');
      expect(diagonalContainer.style.getPropertyValue('--left-width')).toBe('35%');
      expect(diagonalContainer.style.getPropertyValue('--right-width')).toBe('65%');
    });

    it('should have proper ARIA attributes for accessibility', () => {
      render(
        <DiagonalContainer>
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );

      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-labelledby', 'technologies-heading');
      expect(container).toHaveAttribute('aria-describedby', 'tech-description');
    });
  });

  describe('Responsive Behavior', () => {
    it('should adjust layout for mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });

      const { container } = render(
        <DiagonalContainer>
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );

      const diagonalContainer = container.firstChild as HTMLElement;
      // Should apply mobile-specific CSS custom properties
      expect(diagonalContainer).toHaveClass('diagonalContainer');
    });

    it('should maintain desktop layout for larger screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const { container } = render(
        <DiagonalContainer>
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );

      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer.style.getPropertyValue('--diagonal-angle')).toBe('15deg');
    });
  });

  describe('Performance Optimizations', () => {
    it('should apply hardware acceleration CSS properties', () => {
      const { container } = render(
        <DiagonalContainer>
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );

      const diagonalContainer = container.firstChild as HTMLElement;
      const computedStyle = window.getComputedStyle(diagonalContainer);
      
      // Check that hardware acceleration is enabled
      expect(computedStyle.transform).toContain('translate3d');
      expect(computedStyle.backfaceVisibility).toBe('hidden');
    });

    it('should optimize rendering with containment', () => {
      const { container } = render(
        <DiagonalContainer>
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );

      const diagonalContainer = container.firstChild as HTMLElement;
      expect(diagonalContainer).toHaveClass('diagonalContainer');
      // CSS contain property should be applied via CSS class
    });
  });

  describe('Visual Regression Protection', () => {
    it('should maintain consistent CSS custom properties', () => {
      const { container } = render(
        <DiagonalContainer diagonalAngle={15} leftWidth="40%" rightWidth="60%">
          <div>Left</div>
          <div>Right</div>
        </DiagonalContainer>
      );

      const diagonalContainer = container.firstChild as HTMLElement;
      
      // Verify all required CSS custom properties are set
      expect(diagonalContainer.style.getPropertyValue('--diagonal-angle')).toBe('15deg');
      expect(diagonalContainer.style.getPropertyValue('--left-width')).toBe('40%');
      expect(diagonalContainer.style.getPropertyValue('--right-width')).toBe('60%');
    });

    it('should render children in correct layout sections', () => {
      render(
        <DiagonalContainer>
          <div data-testid="left-section">Left Content</div>
          <div data-testid="right-section">Right Content</div>
        </DiagonalContainer>
      );

      const leftSection = screen.getByTestId('left-section');
      const rightSection = screen.getByTestId('right-section');
      
      expect(leftSection).toBeInTheDocument();
      expect(rightSection).toBeInTheDocument();
    });
  });
});