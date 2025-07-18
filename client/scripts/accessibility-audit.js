#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * Performs comprehensive accessibility checks on the portfolio website
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

console.log('🔍 Starting Accessibility Audit...\n');

// Accessibility checklist
const accessibilityChecks = [
  {
    name: 'Semantic HTML Structure',
    description: 'Check for proper use of semantic HTML elements',
    check: () => {
      function findFiles(dir, extensions) {
        const files = [];
        function walkDir(currentPath) {
          try {
            const items = fs.readdirSync(currentPath);
            for (const item of items) {
              const fullPath = path.join(currentPath, item);
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory()) {
                walkDir(fullPath);
              } else if (extensions.some(ext => item.endsWith(ext))) {
                files.push(fullPath);
              }
            }
          } catch (error) {
            // Ignore directory read errors
          }
        }
        walkDir(dir);
        return files;
      }
      
      const srcFiles = findFiles('src', ['.tsx', '.ts']);
      
      let issues = [];
      
      srcFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for semantic elements
          const hasMain = content.includes('<main') || content.includes('role="main"');
          const hasHeader = content.includes('<header') || content.includes('role="banner"');
          const hasNav = content.includes('<nav') || content.includes('role="navigation"');
          const hasFooter = content.includes('<footer') || content.includes('role="contentinfo"');
          
          if (file.includes('App.tsx')) {
            if (!hasMain) issues.push(`${file}: Missing <main> element`);
            if (!hasHeader) issues.push(`${file}: Missing <header> element`);
            if (!hasFooter) issues.push(`${file}: Missing <footer> element`);
          }
          
          // Check for heading hierarchy
          const headings = content.match(/<h[1-6]/g) || [];
          if (headings.length === 0 && content.includes('section')) {
            issues.push(`${file}: Section without heading`);
          }
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      return {
        passed: issues.length === 0,
        issues: issues
      };
    }
  },
  {
    name: 'ARIA Labels and Roles',
    description: 'Check for proper ARIA implementation',
    check: () => {
      const srcFiles = execSync('find client/src -name "*.tsx"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      
      let issues = [];
      let ariaCount = 0;
      
      srcFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Count ARIA attributes
          const ariaLabels = (content.match(/aria-label/g) || []).length;
          const ariaDescribedBy = (content.match(/aria-describedby/g) || []).length;
          const ariaLabelledBy = (content.match(/aria-labelledby/g) || []).length;
          const roles = (content.match(/role="/g) || []).length;
          
          ariaCount += ariaLabels + ariaDescribedBy + ariaLabelledBy + roles;
          
          // Check for interactive elements without labels
          const buttons = (content.match(/<button[^>]*>/g) || []);
          buttons.forEach(button => {
            if (!button.includes('aria-label') && !button.includes('aria-labelledby')) {
              // Check if button has text content (simplified check)
              if (!button.includes('>') || button.includes('/>')) {
                issues.push(`${file}: Button without accessible label`);
              }
            }
          });
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      return {
        passed: issues.length === 0 && ariaCount > 0,
        issues: issues,
        stats: { ariaAttributesFound: ariaCount }
      };
    }
  },
  {
    name: 'Keyboard Navigation',
    description: 'Check for keyboard accessibility features',
    check: () => {
      const srcFiles = execSync('find client/src -name "*.tsx" -o -name "*.css"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      
      let issues = [];
      let focusStyles = 0;
      let skipLinks = 0;
      
      srcFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for focus styles
          if (content.includes(':focus') || content.includes('focus:')) {
            focusStyles++;
          }
          
          // Check for skip links
          if (content.includes('skip-link') || content.includes('Skip to')) {
            skipLinks++;
          }
          
          // Check for tabindex usage
          const tabindexMatches = content.match(/tabindex="(-?\d+)"/g) || [];
          tabindexMatches.forEach(match => {
            const value = match.match(/-?\d+/)[0];
            if (parseInt(value) > 0) {
              issues.push(`${file}: Positive tabindex found (${match}) - avoid positive tabindex values`);
            }
          });
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      if (focusStyles === 0) {
        issues.push('No focus styles found - ensure interactive elements have visible focus indicators');
      }
      
      if (skipLinks === 0) {
        issues.push('No skip links found - consider adding skip navigation for keyboard users');
      }
      
      return {
        passed: issues.length === 0,
        issues: issues,
        stats: { focusStyles, skipLinks }
      };
    }
  },
  {
    name: 'Color Contrast and Visual Accessibility',
    description: 'Check for visual accessibility features',
    check: () => {
      const cssFiles = execSync('find client/src -name "*.css"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      
      let issues = [];
      let reducedMotionSupport = false;
      let highContrastSupport = false;
      
      cssFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for reduced motion support
          if (content.includes('prefers-reduced-motion')) {
            reducedMotionSupport = true;
          }
          
          // Check for high contrast support
          if (content.includes('prefers-contrast')) {
            highContrastSupport = true;
          }
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      if (!reducedMotionSupport) {
        issues.push('No prefers-reduced-motion support found - add support for users who prefer reduced motion');
      }
      
      return {
        passed: issues.length === 0,
        issues: issues,
        stats: { reducedMotionSupport, highContrastSupport }
      };
    }
  },
  {
    name: 'Image Accessibility',
    description: 'Check for proper image alt text and accessibility',
    check: () => {
      const srcFiles = execSync('find client/src -name "*.tsx"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      
      let issues = [];
      let imagesFound = 0;
      let imagesWithAlt = 0;
      
      srcFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Find img tags
          const imgTags = content.match(/<img[^>]*>/g) || [];
          imagesFound += imgTags.length;
          
          imgTags.forEach(img => {
            if (img.includes('alt=')) {
              imagesWithAlt++;
              // Check for empty alt (decorative images)
              if (img.includes('alt=""')) {
                // This is acceptable for decorative images
              } else {
                // Check for meaningful alt text (basic check)
                const altMatch = img.match(/alt="([^"]*)"/);
                if (altMatch && altMatch[1].length < 3) {
                  issues.push(`${file}: Image with very short alt text: ${altMatch[1]}`);
                }
              }
            } else {
              issues.push(`${file}: Image without alt attribute`);
            }
          });
          
        } catch (error) {
          issues.push(`${file}: Error reading file - ${error.message}`);
        }
      });
      
      return {
        passed: issues.length === 0,
        issues: issues,
        stats: { imagesFound, imagesWithAlt }
      };
    }
  }
];

// Run all accessibility checks
console.log('Running accessibility checks...\n');

const results = {
  timestamp: new Date().toISOString(),
  checks: [],
  summary: {
    total: accessibilityChecks.length,
    passed: 0,
    failed: 0,
    issues: []
  }
};

accessibilityChecks.forEach((check, index) => {
  console.log(`${index + 1}. ${check.name}`);
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
});

// Generate summary
console.log('📋 ACCESSIBILITY AUDIT SUMMARY');
console.log('================================');
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
const resultsFile = path.join(AUDIT_RESULTS_DIR, `accessibility-audit-${TIMESTAMP}.json`);
fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
console.log(`\n📄 Detailed results saved to: ${resultsFile}`);

// Exit with appropriate code
process.exit(results.summary.failed > 0 ? 1 : 0);