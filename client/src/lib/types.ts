/**
 * TypeScript interfaces for portfolio data structures
 */

// Main portfolio data interface
export interface PortfolioData {
  personal: PersonalInfo;
  technologies: Technology[];
  projects: Project[];
  skills: SkillCategory[];
  workExperience: WorkExperience[];
  contact: ContactInfo;
}

// Personal information interface
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  resume?: string;
}

// Technology interface for marquee display with enhanced image support
export interface Technology {
  name: string;
  icon: string | React.ComponentType | ImageIcon;
  category: TechnologyCategory;
  priority?: number; // For ordering in marquee
}

// Image icon interface for technology icons
export interface ImageIcon {
  type: 'image';
  src: string;
  alt: string;
  fallback?: string; // Emoji fallback if image fails to load
}

export type TechnologyCategory = 
  | "frontend" 
  | "backend" 
  | "database" 
  | "tools" 
  | "cloud";

// Project interface for portfolio showcase
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  images: string[];
  featured: boolean;
}

// Skills and categories
export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number; // 1-5 or percentage
  icon?: string;
}

// Work experience interface
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  achievements?: string[];
}

// Contact information
export interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  socialMedia: SocialMediaLink[];
}

export interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string | React.ComponentType;
}

// Component prop interfaces
export interface HeroProps {
  name: string;
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
}

export interface TechMarqueeProps {
  technologies: Technology[];
  speed?: number;
  pauseOnHover?: boolean;
}

export interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down";
  className?: string;
}

export interface AnimatedTextProps {
  text: string;
  animation?: "fadeIn" | "slideUp" | "typewriter";
  delay?: number;
  className?: string;
}

export interface AboutProps {
  personal: PersonalInfo;
  skills: SkillCategory[];
}

// Animation and scroll related interfaces
export interface ScrollPosition {
  x: number;
  y: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

// Form interfaces
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormValidationError {
  field: string;
  message: string;
}