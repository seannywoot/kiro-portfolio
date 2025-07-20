/**
 * Lazy-loaded section components for better performance
 * These components are loaded only when they come into view
 */

import { lazy } from 'react';
import { withLazyLoading } from '../common/LazySection/LazySection';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';

// Lazy load section components
export const LazyTechMarquee = lazy(() => 
  import('./TechMarquee/TechMarquee').then(module => ({ default: module.default }))
);

export const LazyModernMarquee = lazy(() => 
  import('./ModernMarquee/ModernMarquee').then(module => ({ default: module.default }))
);

export const LazyAbout = lazy(() => 
  import('./About/About').then(module => ({ default: module.default }))
);

export const LazyProjects = lazy(() => 
  import('./Projects/Projects').then(module => ({ default: module.default }))
);

export const LazyContact = lazy(() => 
  import('./Contact/Contact').then(module => ({ default: module.default }))
);

// Create wrapped components with loading fallbacks
export const TechMarqueeWithLoading = withLazyLoading(
  () => import('./TechMarquee/TechMarquee'),
  <LoadingSpinner text="Loading technologies..." />
);

export const ModernMarqueeWithLoading = withLazyLoading(
  () => import('./ModernMarquee/ModernMarquee'),
  <LoadingSpinner text="Loading technologies..." />
);

export const AboutWithLoading = withLazyLoading(
  () => import('./About/About'),
  <LoadingSpinner text="Loading about section..." />
);

export const ProjectsWithLoading = withLazyLoading(
  () => import('./Projects/Projects'),
  <LoadingSpinner text="Loading projects..." />
);

export const ContactWithLoading = withLazyLoading(
  () => import('./Contact/Contact'),
  <LoadingSpinner text="Loading contact form..." />
);