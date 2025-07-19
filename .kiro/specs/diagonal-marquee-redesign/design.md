# Design Document

## Overview

The diagonal marquee redesign transforms the existing horizontal technology showcase into a modern, visually striking section with a diagonal split layout. The design maintains the dual-direction marquee functionality while introducing a bold geometric division that separates descriptive content from animated technology icons.

## Architecture

### Component Structure
The redesigned TechMarquee component will maintain its existing React structure while introducing new layout divisions:

```
TechMarquee
├── DiagonalContainer
│   ├── LeftSection (Text Content)
│   │   ├── Title: "Technologies & Tools"
│   │   └── Subtitle: "Crafting modern experiences..."
│   ├── DiagonalDivider (Visual Separator)
│   └── RightSection (Animated Marquees)
│       ├── TopMarqueeRow (Left to Right)
│       └── BottomMarqueeRow (Right to Left)
```

### Layout System
The diagonal split will be implemented using CSS Grid and custom clip-path properties:
- **Left Section**: 40% width, contains text content with modern typography
- **Diagonal Divider**: Visual separator using CSS clip-path or SVG
- **Right Section**: 60% width, contains the dual marquee rows

## Components and Interfaces

### Core Components

#### DiagonalContainer
```typescript
interface DiagonalContainerProps {
  children: React.ReactNode;
  className?: string;
}
```
- Manages the overall diagonal layout using CSS Grid
- Handles responsive breakpoints for mobile adaptation
- Provides consistent spacing and alignment

#### LeftSection
```typescript
interface LeftSectionProps {
  title: string;
  subtitle: string;
  className?: string;
}
```
- Renders the "Technologies & Tools" heading and subtitle
- Implements responsive typography scaling
- Maintains accessibility with proper heading hierarchy

#### DiagonalDivider
```typescript
interface DiagonalDividerProps {
  angle?: number; // Default: 15 degrees
  color?: string;
  className?: string;
}
```
- Creates the diagonal visual separator
- Configurable angle and styling
- Responsive behavior for different screen sizes

#### RightSection
```typescript
interface RightSectionProps {
  technologies: Technology[];
  speed?: number;
  pauseOnHover?: boolean;
}
```
- Contains the dual marquee rows
- Maintains existing marquee functionality
- Handles technology icon rendering with images

### Technology Icon Enhancement
The component will be enhanced to support both emoji icons and image files:

```typescript
interface Technology {
  name: string;
  icon: string | React.ComponentType | ImageIcon;
  category: string;
}

interface ImageIcon {
  type: 'image';
  src: string;
  alt: string;
}
```

## Data Models

### Enhanced Technology Model
```typescript
interface Technology {
  name: string;
  icon: string | React.ComponentType | ImageIcon;
  category: string;
  priority?: number; // For ordering in marquee
}

interface TechMarqueeProps {
  technologies: Technology[];
  speed?: number;
  pauseOnHover?: boolean;
  diagonalAngle?: number;
  showCategories?: boolean;
}
```

### Layout Configuration
```typescript
interface DiagonalLayout {
  leftWidth: string; // CSS width value
  rightWidth: string; // CSS width value
  diagonalAngle: number; // Degrees
  breakpoints: {
    mobile: DiagonalLayoutConfig;
    tablet: DiagonalLayoutConfig;
    desktop: DiagonalLayoutConfig;
  };
}

interface DiagonalLayoutConfig {
  leftWidth: string;
  rightWidth: string;
  diagonalAngle: number;
  stackVertically?: boolean;
}
```

## Visual Design Specifications

### Diagonal Split Implementation
The diagonal divider will be implemented using CSS clip-path for optimal performance:

```css
.diagonalContainer {
  display: grid;
  grid-template-columns: 40% 60%;
  position: relative;
  min-height: 400px;
}

.leftSection {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.rightSection {
  background: linear-gradient(135deg, #ffffff, #f1f5f9);
  position: relative;
  overflow: hidden;
}
```

### Typography System
- **Main Title**: 3.5rem font-size, bold weight, gradient text effect
- **Subtitle**: 1.25rem font-size, medium weight, muted color
- **Technology Labels**: 0.875rem font-size, medium weight

### Color Palette
- **Primary Background**: Linear gradient from light gray to slate
- **Text Primary**: Dark slate (#0f172a)
- **Text Secondary**: Medium slate (#475569)
- **Accent**: Blue to purple gradient (#3B82F6 to #8B5CF6)
- **Technology Cards**: White background with subtle shadows

### Animation Specifications
- **Marquee Speed**: 50s duration (configurable)
- **Direction**: Top row left-to-right, bottom row right-to-left
- **Easing**: Linear for continuous motion
- **Hover State**: Pause animation with smooth transition
- **Performance**: Hardware-accelerated transforms using translate3d

## Responsive Design Strategy

### Mobile (< 768px)
- Stack layout vertically
- Remove diagonal clip-path
- Reduce font sizes proportionally
- Maintain marquee functionality with slower speed
- Ensure touch targets meet 44px minimum

### Tablet (768px - 1024px)
- Maintain diagonal layout with adjusted proportions
- Scale typography appropriately
- Optimize marquee spacing for medium screens

### Desktop (> 1024px)
- Full diagonal layout implementation
- Maximum typography sizes
- Optimal marquee spacing and speed
- Enhanced hover effects

## Error Handling

### Image Loading Fallbacks
```typescript
const TechIcon: React.FC<{ tech: Technology }> = ({ tech }) => {
  const [imageError, setImageError] = useState(false);
  
  if (tech.icon.type === 'image' && !imageError) {
    return (
      <img 
        src={tech.icon.src} 
        alt={tech.icon.alt}
        onError={() => setImageError(true)}
        className="tech-icon-image"
      />
    );
  }
  
  // Fallback to emoji or component icon
  return <span className="tech-icon-fallback">{tech.name[0]}</span>;
};
```

### Animation Performance
- Implement intersection observer to pause animations when not visible
- Use `will-change` property judiciously
- Provide reduced motion fallback for accessibility

### Layout Fallbacks
- Graceful degradation for browsers without clip-path support
- Alternative diagonal implementation using transforms
- Fallback to horizontal layout if diagonal fails

## Testing Strategy

### Visual Regression Testing
- Screenshot comparisons across different screen sizes
- Cross-browser compatibility testing
- Dark mode appearance verification

### Performance Testing
- Animation frame rate monitoring (target: 60fps)
- Memory usage during continuous animation
- Bundle size impact measurement

### Accessibility Testing
- Screen reader navigation testing
- Keyboard interaction verification
- Reduced motion preference compliance
- Color contrast validation

### Responsive Testing
- Layout integrity across breakpoints
- Touch interaction on mobile devices
- Orientation change handling

## Integration Points

### Existing Codebase Integration
- Maintain existing `TechMarquee` component interface
- Preserve current technology data structure
- Keep existing CSS module architecture
- Maintain lazy loading and intersection observer functionality

### Performance Considerations
- Reuse existing animation optimization techniques
- Maintain hardware acceleration patterns
- Preserve existing bundle splitting strategy
- Keep CSS-in-JS minimal for performance

### Accessibility Preservation
- Maintain existing ARIA labels and descriptions
- Preserve screen reader content
- Keep keyboard navigation support
- Maintain reduced motion support

## Implementation Phases

### Phase 1: Layout Structure
- Implement diagonal container with CSS Grid
- Create left and right section components
- Add basic diagonal divider

### Phase 2: Enhanced Technology Icons
- Add support for image-based technology icons
- Implement fallback mechanisms
- Update technology data with image references

### Phase 3: Responsive Optimization
- Implement mobile-first responsive design
- Add tablet-specific optimizations
- Fine-tune desktop layout

### Phase 4: Animation Enhancement
- Optimize marquee animations for new layout
- Add enhanced hover effects
- Implement performance monitoring

### Phase 5: Testing and Polish
- Comprehensive cross-browser testing
- Performance optimization
- Accessibility audit and fixes