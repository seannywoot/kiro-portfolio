/**
 * Tests for enhanced technology data structure with image support
 */

import { describe, it, expect } from 'vitest';
import { 
  portfolioData, 
  isImageIcon, 
  getFallbackIcon, 
  getTechnologiesByPriority,
  renderTechnologyIcon
} from '../portfolio-data';
import { Technology, ImageIcon } from '../types';

describe('Enhanced Technology Data Structure', () => {
  describe('isImageIcon utility', () => {
    it('should correctly identify ImageIcon objects', () => {
      const imageIcon: ImageIcon = {
        type: 'image',
        src: '/test.png',
        alt: 'Test icon',
        fallback: '🧪'
      };
      
      expect(isImageIcon(imageIcon)).toBe(true);
      expect(isImageIcon('🧪')).toBe(false);
      expect(isImageIcon(() => null)).toBe(false);
    });
  });

  describe('getFallbackIcon utility', () => {
    it('should return fallback from ImageIcon when available', () => {
      const techWithImageIcon: Technology = {
        name: 'Test Tech',
        icon: {
          type: 'image',
          src: '/test.png',
          alt: 'Test icon',
          fallback: '🧪'
        },
        category: 'tools'
      };
      
      expect(getFallbackIcon(techWithImageIcon)).toBe('🧪');
    });

    it('should return category-based fallback when no specific fallback', () => {
      const techWithoutFallback: Technology = {
        name: 'Test Tech',
        icon: 'original-icon',
        category: 'frontend'
      };
      
      expect(getFallbackIcon(techWithoutFallback)).toBe('🌐');
    });
  });

  describe('getTechnologiesByPriority utility', () => {
    it('should sort technologies by priority', () => {
      const testTechs: Technology[] = [
        { name: 'Tech C', icon: '🔧', category: 'tools', priority: 3 },
        { name: 'Tech A', icon: '🔧', category: 'tools', priority: 1 },
        { name: 'Tech B', icon: '🔧', category: 'tools', priority: 2 },
        { name: 'Tech D', icon: '🔧', category: 'tools' } // No priority
      ];
      
      const sorted = getTechnologiesByPriority(testTechs);
      
      expect(sorted[0].name).toBe('Tech A');
      expect(sorted[1].name).toBe('Tech B');
      expect(sorted[2].name).toBe('Tech C');
      expect(sorted[3].name).toBe('Tech D'); // Should be last (priority 999)
    });
  });

  describe('Portfolio data structure', () => {
    it('should have technologies with proper structure', () => {
      expect(portfolioData.technologies).toBeDefined();
      expect(Array.isArray(portfolioData.technologies)).toBe(true);
      expect(portfolioData.technologies.length).toBeGreaterThan(0);
    });

    it('should have technologies with image icons for available images', () => {
      const reactTech = portfolioData.technologies.find(tech => tech.name === 'React');
      expect(reactTech).toBeDefined();
      expect(isImageIcon(reactTech!.icon)).toBe(true);
      
      if (isImageIcon(reactTech!.icon)) {
        expect(reactTech!.icon.src).toBe('/react.png');
        expect(reactTech!.icon.alt).toBe('React logo');
        expect(reactTech!.icon.fallback).toBe('⚛️');
      }
    });

    it('should have fallback emojis for technologies without images', () => {
      const nextTech = portfolioData.technologies.find(tech => tech.name === 'Next.js');
      expect(nextTech).toBeDefined();
      expect(typeof nextTech!.icon).toBe('string');
      expect(nextTech!.icon).toBe('▲');
    });

    it('should have priority values for ordering', () => {
      const techsWithPriority = portfolioData.technologies.filter(tech => tech.priority !== undefined);
      expect(techsWithPriority.length).toBeGreaterThan(0);
      
      // React should have priority 1
      const reactTech = portfolioData.technologies.find(tech => tech.name === 'React');
      expect(reactTech?.priority).toBe(1);
    });
  });
});