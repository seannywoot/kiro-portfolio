# Project Structure

This document provides a detailed overview of the portfolio project structure, explaining the purpose and organization of each directory and key files.

## Root Level

```
portfolio/
├── .git/                     # Git version control
├── .gitignore               # Git ignore rules
├── .kiro/                   # Kiro IDE configuration
├── .vscode/                 # VS Code workspace settings
├── bun.lock                 # Bun lockfile for dependencies
├── LICENSE                  # MIT license file
├── package.json             # Root package.json with workspace configuration
├── README.md                # Main project documentation
├── PROJECT_STRUCTURE.md     # This file - detailed project structure
├── tsconfig.json            # Root TypeScript configuration
├── node_modules/            # Root dependencies
├── client/                  # Frontend React application
├── server/                  # Backend Hono API
└── shared/                  # Shared TypeScript types and utilities
```

## Client Directory (`/client`)

The frontend React application built with Vite and TypeScript.

```
client/
├── .gitignore               # Client-specific git ignore rules
├── audit-results/           # Performance and accessibility audit results
├── components.json          # shadcn/ui components configuration
├── design_system_profile.json # Design system configuration
├── dist/                    # Built application output
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML template
├── LanyardUsage.txt         # Lanyard integration documentation
├── node_modules/            # Client dependencies
├── package.json             # Client package configuration
├── PERFORMANCE.md           # Performance optimization documentation
├── public/                  # Static assets and images
├── README.md                # Client-specific documentation
├── scripts/                 # Build and audit scripts
├── src/                     # Source code
├── tsconfig.app.json        # TypeScript config for app
├── tsconfig.app.tsbuildinfo # TypeScript build info
├── tsconfig.json            # Main TypeScript configuration
├── tsconfig.node.json       # TypeScript config for Node.js
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest testing configuration
└── vitest.performance.config.ts # Performance testing configuration
```

### Client Public Assets (`/client/public`)

Static assets including images, icons, and documents.

```
public/
├── 2X2.jpg                  # Profile photo
├── HeroSection.png          # Main hero section image
├── Tamondong_Resume.pdf     # Resume document
├── Flow/                    # Flow project screenshots
│   ├── Screenshot 2025-07-29 091613.png
│   ├── Screenshot 2025-07-29 091837.png
│   └── Screenshot 2025-07-29 092220.png
├── GC-Medmars/             # Medical records system images
│   └── GC-Medmars.png
├── OCPL/                   # OCPL project screenshots
│   ├── Screenshot 2025-07-29 092854.png
│   ├── Screenshot 2025-07-29 092906.png
│   ├── Screenshot 2025-07-29 092917.png
│   ├── Screenshot 2025-07-29 092922.png
│   ├── Screenshot 2025-07-29 092927.png
│   ├── Screenshot 2025-07-29 092933.png
│   ├── Screenshot 2025-07-29 092952.png
│   └── Screenshot 2025-07-29 093005.png
├── Graphics/               # Design portfolio images
│   ├── 1.jpg through 9.jpg # Various design work samples
└── Technology Icons/       # Technology and tool icons
    ├── Bun.png
    ├── CSS.png
    ├── davinci.png
    ├── facebook.png
    ├── figma.png
    ├── github-sign.png
    ├── HONO.png
    ├── HTML.png
    ├── java.png
    ├── JAVASCRIPT.png
    ├── linkedin.png
    ├── photoshop.png
    ├── pinterest.png
    ├── PYTHON.png
    ├── react.png
    ├── typescript.png
    ├── vite.svg
    ├── VS CODE.png
    └── vue.png
```

### Client Source Code (`/client/src`)

The main application source code organized by functionality.

```
src/
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
├── index.css                # Global styles
├── global.d.ts              # Global type declarations
├── vite-env.d.ts           # Vite environment types
├── assets/                  # Application assets
│   ├── beaver.svg           # Logo asset
│   ├── card.glb            # 3D model file
│   └── lanyard.png         # Lanyard integration image
├── components/              # React components
│   ├── common/             # Reusable common components
│   │   └── ScrollProgress/ # Scroll progress indicator
│   ├── sections/           # Page section components
│   │   ├── Contact/        # Contact section
│   │   └── ModernMarquee/  # Technology marquee section
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── comp-588.tsx        # Generated component
│   ├── logo.tsx            # Logo component
│   └── user-menu.tsx       # User menu component
├── hooks/                  # Custom React hooks
│   ├── __tests__/          # Hook tests
│   ├── index.ts            # Hook exports
│   ├── useIntersectionObserver.ts # Intersection observer hook
│   ├── useParallax.ts      # Parallax effect hook
│   └── useScrollProgress.ts # Scroll progress hook
├── lib/                    # Utilities and data
│   ├── __tests__/          # Library tests
│   ├── accessibility.ts    # Accessibility utilities
│   ├── animations.ts       # Animation utilities
│   ├── performance-optimizer.ts # Performance optimization
│   ├── performance.ts      # Performance utilities
│   ├── portfolio-data.ts   # Main portfolio data and content
│   ├── responsive.ts       # Responsive design utilities
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # General utility functions
├── pages/                  # Page components
│   └── ModernMarqueeDemo.tsx # Marquee demo page
├── styles/                 # Styling files
│   └── animations.css      # CSS animations
├── test/                   # Test configuration
│   └── setup.ts           # Test setup file
├── utils/                  # Utility functions
│   └── imageUtils.ts      # Image handling utilities
└── __tests__/             # Application tests
    ├── components.performance.test.tsx # Component performance tests
    ├── performance.test.ts # Performance tests
    └── setup.ts           # Test setup
```

### Client Scripts (`/client/scripts`)

Build and audit automation scripts.

```
scripts/
├── performance-audit.js     # Performance auditing script
├── accessibility-audit.js  # Accessibility auditing script
├── final-audit.js          # Complete audit suite
└── simple-audit.js         # Simple audit script
```

## Server Directory (`/server`)

The backend API built with Hono framework.

```
server/
├── .gitignore              # Server-specific git ignore
├── bun.lock               # Server dependencies lockfile
├── dist/                  # Built server output
├── package.json           # Server package configuration
├── README.md              # Server documentation
├── src/                   # Server source code
│   └── index.ts          # Main server entry point
└── tsconfig.json          # Server TypeScript configuration
```

## Shared Directory (`/shared`)

Shared TypeScript types and utilities used by both client and server.

```
shared/
├── dist/                  # Built shared package output
├── package.json           # Shared package configuration
├── src/                   # Shared source code
│   ├── index.ts          # Main exports
│   └── types/            # Type definitions
│       └── index.ts      # Type exports
└── tsconfig.json          # Shared TypeScript configuration
```

## Key Configuration Files

### Root Configuration
- `package.json` - Workspace configuration and scripts
- `tsconfig.json` - Root TypeScript configuration
- `bun.lock` - Dependency lockfile

### Client Configuration
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Testing configuration
- `eslint.config.js` - Code linting rules
- `components.json` - shadcn/ui component configuration
- `design_system_profile.json` - Design system settings

### Development Tools
- `.vscode/` - VS Code workspace settings
- `.kiro/` - Kiro IDE configuration
- `scripts/` - Automation and audit scripts

## Data Structure

The portfolio content is centralized in `client/src/lib/portfolio-data.ts`, which includes:

- **Personal Information** - Name, title, bio, contact details
- **Technologies** - Skills and tools with icons and categories
- **Projects** - Development projects and design work with images
- **Skills** - Organized skill categories with proficiency levels
- **Work Experience** - Professional experience and achievements
- **Contact Information** - Social media links and contact methods

## Asset Organization

Assets are organized by type and project:
- **Profile/Personal** - Profile photos and resume
- **Project Screenshots** - Organized by project name
- **Design Portfolio** - Creative work samples
- **Technology Icons** - Tool and framework logos
- **3D Assets** - Three.js models and textures

This structure supports a scalable, maintainable portfolio application with clear separation of concerns and organized asset management.