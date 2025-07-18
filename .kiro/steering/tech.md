# Technology Stack & Build System

## Runtime & Package Manager
- **Bun**: Primary JavaScript runtime and package manager
- **Node.js**: Fallback compatibility for tooling

## Frontend Stack
- **React 19**: UI framework with latest features
- **TypeScript**: Strict type checking enabled
- **Vite**: Build tool and dev server with HMR
- **Tailwind CSS 4**: Utility-first styling with Vite plugin
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

## Backend Stack
- **Hono**: Lightweight web framework
- **TypeScript**: Server-side type safety

## Development Tools
- **ESLint**: Code linting with React hooks plugin
- **Vitest**: Testing framework for unit and performance tests
- **Lighthouse**: Performance auditing
- **Bundle analyzer**: Code splitting analysis

## Build Configuration
- **Code Splitting**: Manual chunks for vendor, UI, and utilities
- **Path Aliases**: `@client`, `@server`, `@shared`, `@` for clean imports
- **Source Maps**: Enabled in development
- **Minification**: Disabled to avoid terser issues
- **Chunk Size Warning**: 1000kb limit

## Common Commands

### Development
```bash
# Start all services (shared types watch + server + client)
bun run dev

# Individual services
bun run dev:client    # Vite dev server on port 5173
bun run dev:server    # Hono server with --watch
bun run dev:shared    # TypeScript watch mode for shared types
```

### Building
```bash
# Build everything
bun run build

# Individual builds
bun run build:shared  # Compile shared types first
bun run build:server  # TypeScript compilation
bun run build:client  # Vite production build
```

### Testing & Quality
```bash
# Unit tests
bun run test          # Watch mode
bun run test:run      # Single run

# Performance tests
bun run test:performance

# Audits
bun run audit:performance    # Custom performance audit
bun run audit:accessibility  # Accessibility audit
bun run audit:final         # Comprehensive audit
bun run audit:simple        # Quick audit
bun run lighthouse          # Full Lighthouse report
```

### Code Quality
```bash
bun run lint          # ESLint
bun run type-check    # TypeScript type checking
bun run build:analyze # Bundle size analysis
```

## Performance Targets
- **Bundle Size**: JS < 500kb gzipped, CSS < 50kb gzipped
- **Load Time**: < 2 seconds on standard connections
- **Frame Rate**: 60fps for animations and scrolling
- **Lighthouse Score**: 90+ across all metrics