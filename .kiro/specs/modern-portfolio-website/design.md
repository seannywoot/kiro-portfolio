# Design Document

## Overview

The modern portfolio website will be built as a single-page application using React 19, Vite, Tailwind CSS 4, and shadcn/ui components. The design emphasizes visual impact through smooth animations, parallax effects, and a dual marquee technology showcase, while maintaining excellent performance and accessibility.

The site will feature a vertical scroll experience with distinct sections: Hero, Technology Marquee, About/Skills, Projects, and Contact. Each section will be modularly designed with separate components and styling for maintainability.

## Architecture

### Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 with CSS variables
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Animations**: CSS transforms, Intersection Observer API, and custom React hooks
- **Deployment**: Static build optimized for modern browsers

### Project Structure

```
client/src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── sections/              # Main page sections
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.module.css
│   │   ├── TechMarquee/
│   │   │   ├── TechMarquee.tsx
│   │   │   └── TechMarquee.module.css
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── About.module.css
│   │   ├── Projects/
│   │   │   ├── Projects.tsx
│   │   │   └── Projects.module.css
│   │   └── Contact/
│   │       ├── Contact.tsx
│   │       └── Contact.module.css
│   └── common/               # Shared components
│       ├── ParallaxContainer/
│       ├── AnimatedText/
│       └── ScrollIndicator/
├── hooks/                    # Custom React hooks
│   ├── useParallax.ts
│   ├── useIntersectionObserver.ts
│   └── useScrollProgress.ts
├── lib/                     # Utilities
│   ├── utils.ts
│   └── animations.ts
└── styles/                  # Global styles
    ├── globals.css
    └── animations.css
```

## Components and Interfaces

### Core Section Components

#### 1. Hero Section

**Purpose**: First impression with animated introduction and call-to-action
**Features**:

- Animated text reveal on load
- Subtle background parallax effect
- Professional headshot or avatar
- Smooth scroll indicator

```typescript
interface HeroProps {
  name: string;
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
}
```

#### 2. Technology Marquee Section

**Purpose**: Showcase technical skills through dual opposing marquees
**Features**:

- Two horizontal rows with infinite scroll
- Top row: left-to-right animation
- Bottom row: right-to-left animation
- Technology icons/logos with names
- Hover effects for individual items

```typescript
interface TechMarqueeProps {
  technologies: Technology[];
  speed?: number;
  pauseOnHover?: boolean;
}

interface Technology {
  name: string;
  icon: string | React.ComponentType;
  category: "frontend" | "backend" | "database" | "tools" | "cloud";
}
```

#### 3. About/Skills Section

**Purpose**: Personal introduction and skill categorization
**Features**:

- Parallax background elements
- Skill categories with progress indicators
- Personal story/bio
- Professional highlights

#### 4. Projects Section

**Purpose**: Portfolio showcase with project details
**Features**:

- Grid layout with project cards
- Hover effects revealing project details
- Technology tags for each project
- Links to live demos and repositories
- Modal or expanded view for detailed project information

#### 5. Contact Section

**Purpose**: Professional contact information and form
**Features**:

- Contact form with validation
- Social media links
- Professional contact details
- Subtle animations on form interaction

### Shared Components

#### ParallaxContainer

**Purpose**: Wrapper component for parallax effects

```typescript
interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down";
  className?: string;
}
```

#### AnimatedText

**Purpose**: Text animations for section reveals

```typescript
interface AnimatedTextProps {
  text: string;
  animation?: "fadeIn" | "slideUp" | "typewriter";
  delay?: number;
  className?: string;
}
```

## Data Models

### Portfolio Data Structure

```typescript
interface PortfolioData {
  personal: PersonalInfo;
  technologies: Technology[];
  projects: Project[];
  skills: SkillCategory[];
  contact: ContactInfo;
}

interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  resume?: string;
}

interface Project {
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

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface Skill {
  name: string;
  level: number; // 1-5 or percentage
  icon?: string;
}
```

## Error Handling

### Animation Performance

- Implement `prefers-reduced-motion` media query support
- Fallback to static layouts for low-performance devices
- Use `will-change` CSS property judiciously to optimize animations
- Monitor frame rates and provide performance warnings

### Responsive Design

- Mobile-first approach with progressive enhancement
- Breakpoint-specific marquee speeds and parallax effects
- Touch-friendly interactions for mobile devices
- Graceful degradation for older browsers

### Content Loading

- Lazy loading for images and non-critical sections
- Loading states for dynamic content
- Error boundaries for component failures
- Offline-friendly design with service worker caching

## Testing Strategy

### Unit Testing

- Component rendering and prop handling
- Custom hooks functionality (useParallax, useIntersectionObserver)
- Utility functions for animations and calculations
- Form validation logic

### Integration Testing

- Section-to-section navigation and scrolling
- Marquee animation continuity and performance
- Parallax effects across different viewport sizes
- Accessibility features (keyboard navigation, screen readers)

### Performance Testing

- Animation frame rates under various conditions
- Bundle size optimization and code splitting
- Core Web Vitals monitoring (LCP, FID, CLS)
- Cross-browser compatibility testing

### Visual Testing

- Screenshot comparisons across breakpoints
- Animation timing and smoothness verification
- Color contrast and accessibility compliance
- Typography rendering across different devices

## Design System

### Color Palette

- Primary: Modern blue/purple gradient (#3B82F6 to #8B5CF6)
- Secondary: Complementary accent colors
- Neutral: Gray scale with proper contrast ratios
- Success/Error: Standard semantic colors
- Background: Dark mode support with CSS variables

### Typography

- Primary: Modern sans-serif (Inter or similar)
- Headings: Bold weights with proper hierarchy
- Body: Readable line heights and spacing
- Code: Monospace font for technical content

### Spacing and Layout

- Consistent spacing scale using Tailwind's system
- Grid-based layouts with proper alignment
- Generous whitespace for visual breathing room
- Responsive spacing that scales appropriately

### Animation Principles

- Smooth easing functions (cubic-bezier curves)
- Consistent timing (300ms for micro-interactions, 600ms for section transitions)
- Purposeful motion that enhances user experience
- Performance-optimized transforms and opacity changes
