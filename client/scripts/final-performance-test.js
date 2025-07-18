#!/usr/bin/env node

/**
 * Final Performance Testing Script
 * Comprehensive performance analysis for the portfolio website
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUDIT_RESULTS_DIR = 'audit-results';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

// Ensure audit results directory exists
if (!fs.existsSync(AUDIT_RESULTS_DIR)) {
  fs.mkdirSync(AUDIT_RESULTS_DIR, { recursive: true });
}

console.log('⚡ Starting Final Performance Audit...\n');

const performanceChecks = [
  {
    name: 'Bundle Size Analysis',
    description: 'Analyze JavaScript bundle sizes and optimization',
    check: () => {
      try {
        console.log('   Building production bundle...');
        execSync('npm run build', { cwd: 'client', stdio: 'pipe' });
        
        const distPath = 'client/dist';
        if (!fs.existsSync(distPath)) {
          return { passed: false, issues: ['Build failed - dist directory not found'] };
        }
        
        // Analyze bundle sizes
        const jsFiles = execSync(`find ${distPath} -name "*.js" -type f`, { encoding: 'utf8' })
          .split('\n')
          .filter(Boolean);
        
        const cssFiles = execSync(`find ${distPath} -name "*.css" -type f`, { encoding: 'utf8' })
          .split('\n')
          .filter(Boolean);
        
        let totalJSSize = 0;
        let totalCSSSize = 0;
        let issues = [];
        
        const jsAnalysis = jsFiles.map(file => {
          const stats = fs.statSync(file);
          const sizeKB = Math.round(stats.size / 1024);
          totalJSSize += sizeKB;
          
          if (sizeKB > 500) {
            issues.push(`Large JS bundle: ${path.basename(file)} (${sizeKB}KB)`);
          }
          
          return { file: path.basename(file), size: sizeKB };
        });
        
        const cssAnalysis = cssFiles.map(file => {
          const stats = fs.statSync(file);
          const sizeKB = Math.round(stats.size / 1024);
          totalCSSSize += sizeKB;
          
          if (sizeKB > 100) {
            issues.push(`Large CSS bundle: ${path.basename(file)} (${sizeKB}KB)`);
          }
          
          return { file: path.basename(file), size: sizeKB };
        });
        
        // Check for code splitting
        const hasCodeSplitting = jsFiles.length > 2; // Main bundle + at least one chunk
        if (!hasCodeSplitting) {
          issues.push('No code splitting detected - consider implementing lazy loading');
        }
        
        return {
          passed: totalJSSize < 1000 && totalCSSSize < 200 && issues.length === 0,
          issues: issues,
          stats: {
            totalJSSize: `${totalJSSize}KB`,
            totalCSSSize: `${totalCSSSize}KB`,
            jsFiles: jsAnalysis,
            cssFiles: cssAnalysis,
            hasCodeSplitting
          }
        };
        
      } catch (error) {
        return { passed: false, issues: [`Build error: ${error.message}`] };
      }
    }
  },
  {
    name: 'Image Optimization',
    description: 'Check for optimized images and lazy loading',
    check: () => {
      const srcFiles = execSync('find client/src -name "*.tsx"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      
      let issues = [];
      let imagesFound = 0;
      let lazyImages = 0;
      let optimizedImages = 0;
      
      srcFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Find img tags and Image components
          const imgTags = content.match(/<img[^>]*>|<Image[^>]*>/g) || [];
          imagesFound += imgTags.length;
          
          imgTags.forEach(img => {
            // Check for lazy loading
            if (img.includes('loading="lazy"') || img.includes('lazy')) {
              lazyImages++;
            }
            
            // Check for modern formats or optimization
            if (img.includes('.webp') || img.includes('.avif') || img.includes('OptimizedImage')) {
              optimizedImages++;
            }
            
            // Check for large images without optimization
            if (img.includes('.jpg') || img.includes('.png')) {
              if (!img.includes('loading="lazy"') && !img.includes('OptimizedImage')) {
                issues.push(`${file}: Image without lazy loading or optimization`);
              }
            }
          });
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      const lazyLoadingRatio = imagesFound > 0 ? (lazyImages / imagesFound) : 1;
      const optimizationRatio = imagesFound > 0 ? (optimizedImages / imagesFound) : 1;
      
      if (lazyLoadingRatio < 0.8) {
        issues.push(`Low lazy loading adoption: ${Math.round(lazyLoadingRatio * 100)}% of images`);
      }
      
      return {
        passed: issues.length === 0 && lazyLoadingRatio >= 0.8,
        issues: issues,
        stats: {
          imagesFound,
          lazyImages,
          optimizedImages,
          lazyLoadingRatio: `${Math.round(lazyLoadingRatio * 100)}%`,
          optimizationRatio: `${Math.round(optimizationRatio * 100)}%`
        }
      };
    }
  },
  {
    name: 'Animation Performance',
    description: 'Check for performance-optimized animations',
    check: () => {
      const cssFiles = execSync('find client/src -name "*.css"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      
      let issues = [];
      let animationsFound = 0;
      let optimizedAnimations = 0;
      let reducedMotionSupport = false;
      
      cssFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Count animations
          const animations = (content.match(/@keyframes|animation:|transition:/g) || []).length;
          animationsFound += animations;
          
          // Check for GPU-accelerated properties
          const gpuProps = (content.match(/transform:|opacity:|filter:/g) || []).length;
          optimizedAnimations += gpuProps;
          
          // Check for reduced motion support
          if (content.includes('prefers-reduced-motion')) {
            reducedMotionSupport = true;
          }
          
          // Check for performance-heavy properties
          const heavyProps = content.match(/(width|height|top|left|margin|padding):\s*[^;]*transition/g) || [];
          heavyProps.forEach(prop => {
            issues.push(`${file}: Animation on layout property detected: ${prop.split(':')[0]}`);
          });
          
          // Check for will-change usage
          const willChangeUsage = (content.match(/will-change:/g) || []).length;
          if (willChangeUsage > animationsFound * 0.5) {
            issues.push(`${file}: Excessive will-change usage detected`);
          }
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      if (!reducedMotionSupport && animationsFound > 0) {
        issues.push('No prefers-reduced-motion support found');
      }
      
      return {
        passed: issues.length === 0,
        issues: issues,
        stats: {
          animationsFound,
          optimizedAnimations,
          reducedMotionSupport,
          optimizationRatio: animationsFound > 0 ? `${Math.round((optimizedAnimations / animationsFound) * 100)}%` : '100%'
        }
      };
    }
  },
  {
    name: 'Core Web Vitals Preparation',
    description: 'Check for Core Web Vitals optimization features',
    check: () => {
      const srcFiles = execSync('find client/src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      
      let issues = [];
      let features = {
        lazyLoading: false,
        errorBoundaries: false,
        loadingStates: false,
        performanceMonitoring: false,
        resourceHints: false
      };
      
      srcFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for lazy loading
          if (content.includes('LazySection') || content.includes('lazy') || content.includes('Suspense')) {
            features.lazyLoading = true;
          }
          
          // Check for error boundaries
          if (content.includes('ErrorBoundary') || content.includes('componentDidCatch')) {
            features.errorBoundaries = true;
          }
          
          // Check for loading states
          if (content.includes('Loading') || content.includes('isLoading') || content.includes('Spinner')) {
            features.loadingStates = true;
          }
          
          // Check for performance monitoring
          if (content.includes('performance') || content.includes('PerformanceObserver')) {
            features.performanceMonitoring = true;
          }
          
          // Check for resource hints
          if (content.includes('preload') || content.includes('prefetch') || content.includes('dns-prefetch')) {
            features.resourceHints = true;
          }
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      // Check which features are missing
      Object.entries(features).forEach(([feature, implemented]) => {
        if (!implemented) {
          issues.push(`Missing ${feature.replace(/([A-Z])/g, ' $1').toLowerCase()} implementation`);
        }
      });
      
      return {
        passed: Object.values(features).every(Boolean),
        issues: issues,
        stats: features
      };
    }
  },
  {
    name: 'Dependency Analysis',
    description: 'Analyze dependencies for security and performance',
    check: () => {
      try {
        const packageJson = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        let issues = [];
        let stats = {
          totalDependencies: Object.keys(dependencies).length,
          productionDependencies: Object.keys(packageJson.dependencies || {}).length,
          devDependencies: Object.keys(packageJson.devDependencies || {}).length
        };
        
        // Check for common performance-heavy dependencies
        const heavyDeps = ['moment', 'lodash', 'jquery'];
        heavyDeps.forEach(dep => {
          if (dependencies[dep]) {
            issues.push(`Heavy dependency detected: ${dep} - consider lighter alternatives`);
          }
        });
        
        // Check for outdated React version
        if (dependencies.react && !dependencies.react.includes('19')) {
          issues.push('React version is not the latest - consider upgrading');
        }
        
        // Check for TypeScript
        if (!dependencies.typescript && !packageJson.devDependencies?.typescript) {
          issues.push('TypeScript not found - consider adding for better development experience');
        }
        
        return {
          passed: issues.length === 0,
          issues: issues,
          stats: stats
        };
        
      } catch (error) {
        return { passed: false, issues: [`Error reading package.json: ${error.message}`] };
      }
    }
  }
];

// Run all performance checks
console.log('Running performance checks...\n');

const results = {
  timestamp: new Date().toISOString(),
  checks: [],
  summary: {
    total: performanceChecks.length,
    passed: 0,
    failed: 0,
    issues: []
  }
};

for (let i = 0; i < performanceChecks.length; i++) {
  const check = performanceChecks[i];
  console.log(`${i + 1}. ${check.name}`);
  console.log(`   ${check.description}`);
  
  try {
    const result = check.check();
    
    if (result.passed) {
      console.log('   ✅ PASSED');
      results.summary.passed++;
    } else {
      console.log('   ❌ FAILED');
      results.summary.failed++;
      result.issues.forEach(issue => {
        console.log(`      - ${issue}`);
        results.summary.issues.push(issue);
      });
    }
    
    if (result.stats) {
      console.log(`   📊 Stats:`, result.stats);
    }
    
    results.checks.push({
      name: check.name,
      description: check.description,
      passed: result.passed,
      issues: result.issues || [],
      stats: result.stats || {}
    });
    
  } catch (error) {
    console.log(`   ⚠️  ERROR: ${error.message}`);
    results.summary.failed++;
    results.checks.push({
      name: check.name,
      description: check.description,
      passed: false,
      issues: [`Error running check: ${error.message}`],
      stats: {}
    });
  }
  
  console.log('');
}

// Generate summary
console.log('⚡ PERFORMANCE AUDIT SUMMARY');
console.log('============================');
console.log(`Total Checks: ${results.summary.total}`);
console.log(`Passed: ${results.summary.passed}`);
console.log(`Failed: ${results.summary.failed}`);
console.log(`Success Rate: ${Math.round((results.summary.passed / results.summary.total) * 100)}%`);

if (results.summary.issues.length > 0) {
  console.log('\n🚨 Issues Found:');
  results.summary.issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
}

// Save results to file
const resultsFile = path.join(AUDIT_RESULTS_DIR, `performance-audit-${TIMESTAMP}.json`);
fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
console.log(`\n📄 Detailed results saved to: ${resultsFile}`);

// Exit with appropriate code
process.exit(results.summary.failed > 0 ? 1 : 0);