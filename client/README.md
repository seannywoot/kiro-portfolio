# Client - React + TypeScript + Vite

A modern React frontend with comprehensive testing, performance monitoring, and development tools.

## Features

- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Vitest** for unit and performance testing
- **Performance Monitoring** with Core Web Vitals tracking
- **Accessibility Auditing** with automated testing
- **Bundle Analysis** and optimization tools
- **ESLint** with React-specific rules

## Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run build:analyze   # Build with bundle analysis
npm run preview         # Preview production build

# Testing
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:performance # Run performance tests
npm run type-check      # TypeScript type checking

# Code Quality
npm run lint            # Run ESLint

# Performance & Auditing
npm run audit:performance    # Performance audit
npm run audit:accessibility  # Accessibility audit
npm run audit:bundle        # Bundle size analysis
npm run audit:final         # Complete audit suite
npm run lighthouse          # Generate Lighthouse report
```

## Testing Setup

The project uses **Vitest** with comprehensive test utilities and mocking:

### Test Configuration

- **Unit Tests**: `vitest.config.ts` - Standard component and utility testing
- **Performance Tests**: `vitest.performance.config.ts` - Core Web Vitals and performance benchmarks
- **Test Setup**: `src/__tests__/setup.ts` - Global mocks and test environment configuration

### Available Mocks

The test setup includes mocks for:
- `IntersectionObserver` - For lazy loading and scroll-based animations
- `ResizeObserver` - For responsive component behavior
- `matchMedia` - For responsive design testing
- `performance` API - For performance monitoring tests
- `requestAnimationFrame` - For animation testing

### Performance Testing

Performance tests validate:
- **Core Web Vitals** (LCP, FID, CLS, FCP, TTFB)
- **Bundle size limits** (500KB JS, 50KB CSS gzipped)
- **Render performance** (< 16ms for 60fps)
- **Memory usage monitoring**
- **Frame rate tracking**

## Performance Monitoring

Built-in performance monitoring with `src/lib/performance.ts`:

### Core Web Vitals Tracking
- **LCP** (Largest Contentful Paint) - Target: ≤2.5s
- **FID** (First Input Delay) - Target: ≤100ms  
- **CLS** (Cumulative Layout Shift) - Target: ≤0.1
- **FCP** (First Contentful Paint) - Target: ≤1.8s
- **TTFB** (Time to First Byte) - Target: ≤800ms

### Performance Utilities
- `PerformanceMonitor` - Automatic Core Web Vitals tracking
- `ImageLoader` - Lazy loading with intersection observer
- `ResourceHints` - Preload, prefetch, and preconnect utilities
- `BundleAnalyzer` - Component load time measurement
- `MemoryMonitor` - Memory usage tracking
- `FrameRateMonitor` - FPS monitoring

## Bundle Size Limits

Configured in `package.json`:
- JavaScript bundles: 500KB (gzipped)
- CSS bundles: 50KB (gzipped)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Project Architecture

### Component Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Navigation/   # Site navigation
│   │   ├── ScrollProgress/ # Scroll indicator
│   │   ├── ErrorBoundary/ # Error handling
│   │   └── SkeletonLoader/ # Loading states
│   └── sections/         # Page sections
│       ├── Hero/         # Landing section
│       ├── About/        # About & skills
│       ├── Projects/     # Portfolio projects
│       ├── Contact/      # Contact form
│       └── ModernMarquee/ # Technology showcase
├── lib/                  # Utilities and data
│   ├── performance.ts    # Performance monitoring
│   ├── accessibility.ts  # A11y utilities
│   └── portfolio-data.ts # Content data
└── __tests__/           # Test files
    ├── setup.ts         # Test configuration
    └── performance.test.ts # Performance tests
```

### Key Features

- **Accessibility First**: ARIA labels, semantic HTML, keyboard navigation
- **Performance Optimized**: Lazy loading, Core Web Vitals monitoring
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Boundaries**: Graceful error handling for component failures
- **Loading States**: Skeleton loaders and smooth transitions
- **SEO Ready**: Semantic markup and meta tag support

### Dependencies

#### Core Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

#### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **GSAP** - High-performance animations

#### 3D Graphics (Optional)
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F

#### Development Tools
- **Vitest** - Fast unit testing framework
- **Testing Library** - React testing utilities
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## Environment Variables

Create a `.env.local` file in the client directory:

```env
# API Configuration
VITE_SERVER_URL=http://localhost:3000

# Performance Monitoring (optional)
VITE_ANALYTICS_ID=your-analytics-id

# Feature Flags (optional)
VITE_ENABLE_3D=true
VITE_ENABLE_ANIMATIONS=true
```

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

## Accessibility Features

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Visible focus indicators and logical tab order

## Performance Targets

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Green scores for LCP, FID, CLS
- **Bundle Size**: < 500KB JavaScript, < 50KB CSS (gzipped)
- **Time to Interactive**: < 3 seconds on 3G
- **First Contentful Paint**: < 1.8 seconds