# Project Structure & Organization

## Monorepo Layout
```
portfolio/
├── client/           # React frontend application
├── server/           # Hono backend API
├── shared/           # Shared TypeScript types
├── .kiro/           # Kiro IDE configuration and specs
└── package.json     # Root workspace configuration
```

## Client Structure (`client/`)
```
client/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Navigation/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── LoadingSpinner/
│   │   │   ├── LazySection/
│   │   │   ├── OptimizedImage/
│   │   │   ├── ScreenReaderOnly/
│   │   │   └── ScrollProgress/
│   │   └── sections/        # Page sections
│   │       ├── Hero/
│   │       ├── TechMarquee/
│   │       ├── About/
│   │       ├── Projects/
│   │       ├── Contact/
│   │       └── LazyComponents.tsx
│   ├── lib/                 # Utility libraries
│   │   ├── portfolio-data.ts
│   │   ├── performance.ts
│   │   ├── accessibility.ts
│   │   └── responsive.ts
│   ├── __tests__/          # Test files
│   └── App.tsx             # Main application component
├── scripts/                # Build and audit scripts
├── public/                 # Static assets
└── dist/                   # Build output
```

## Component Organization Patterns

### Section Components
- Each major page section has its own folder under `components/sections/`
- Include component file, CSS module, and any sub-components
- Example: `Hero/Hero.tsx`, `Hero/Hero.module.css`

### Common Components
- Reusable components in `components/common/`
- Follow same folder pattern with component + CSS module
- Include TypeScript interfaces for props

### CSS Modules
- Use `.module.css` suffix for component-specific styles
- Combine with Tailwind classes for utility-first approach
- Keep complex animations and custom styles in modules

## File Naming Conventions
- **Components**: PascalCase (e.g., `ErrorBoundary.tsx`)
- **CSS Modules**: PascalCase with `.module.css` (e.g., `ErrorBoundary.module.css`)
- **Utilities**: camelCase (e.g., `portfolio-data.ts`)
- **Tests**: Match component name with `.test.tsx` suffix

## Import Patterns
```typescript
// Path aliases for clean imports
import { Component } from '@/components/common/Component'
import { utility } from '@/lib/utility'
import type { SharedType } from '@shared/types'
```

## Server Structure (`server/`)
```
server/
├── src/
│   └── index.ts        # Hono application entry
├── dist/               # Compiled output
└── package.json
```

## Shared Structure (`shared/`)
```
shared/
├── src/
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Export barrel
├── dist/               # Compiled types
└── package.json
```

## Configuration Files
- **TypeScript**: Extends from root `tsconfig.json` with workspace-specific overrides
- **Vite**: Configured with path aliases, code splitting, and performance optimizations
- **ESLint**: React-specific rules with TypeScript support
- **Package.json**: Workspace dependencies with specific script commands

## Development Workflow
1. **Shared types** must be built first (auto-built on install)
2. **Server** can run independently for API development
3. **Client** depends on shared types for type safety
4. **Concurrent development** using `bun run dev` for all services

## Testing Organization
- **Unit tests**: Co-located with components in `__tests__/`
- **Performance tests**: Separate config and dedicated test files
- **Audit scripts**: Custom Node.js scripts in `scripts/` folder

## Build Artifacts
- **Client**: Static files in `dist/` for deployment
- **Server**: Compiled JavaScript in `dist/` 
- **Shared**: Compiled types in `dist/` for consumption by other packages