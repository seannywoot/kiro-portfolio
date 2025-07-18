#!/usr/bin/env node

/**
 * Final Portfolio Audit Script
 * Runs comprehensive accessibility and performance audits
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

console.log('🎯 FINAL PORTFOLIO AUDIT');
console.log('========================\n');

const auditResults = {
  timestamp: new Date().toISOString(),
  accessibility: null,
  performance: null,
  summary: {
    overallScore: 0,
    recommendations: []
  }
};

// Run accessibility audit
console.log('1️⃣ Running Accessibility Audit...\n');
try {
  execSync('node scripts/accessibility-audit.js', { stdio: 'inherit' });
  console.log('✅ Accessibility audit completed\n');
} catch (error) {
  console.log('❌ Accessibility audit failed\n');
  auditResults.accessibility = { error: error.message };
}

// Run performance audit
console.log('2️⃣ Running Performance Audit...\n');
try {
  execSync('node scripts/final-performance-test.js', { stdio: 'inherit' });
  console.log('✅ Performance audit completed\n');
} catch (error) {
  console.log('❌ Performance audit failed\n');
  auditResults.performance = { error: error.message };
}

// Run additional checks
console.log('3️⃣ Running Additional Quality Checks...\n');

// Check for TypeScript errors
console.log('Checking TypeScript compilation...');
try {
  execSync('npm run type-check', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  auditResults.summary.recommendations.push('Fix TypeScript compilation errors');
}

// Check for linting issues
console.log('Checking code quality with ESLint...');
try {
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('✅ ESLint checks passed');
} catch (error) {
  console.log('⚠️  ESLint issues found');
  auditResults.summary.recommendations.push('Address ESLint warnings and errors');
}

// Run tests
console.log('Running test suite...');
try {
  execSync('npm run test:run', { stdio: 'pipe' });
  console.log('✅ All tests passed');
} catch (error) {
  console.log('❌ Some tests failed');
  auditResults.summary.recommendations.push('Fix failing tests');
}

// Check build process
console.log('Testing production build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Production build successful');
  
  // Check build output
  const distPath = 'dist';
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`📦 Build output: ${files.length} files generated`);
  }
} catch (error) {
  console.log('❌ Production build failed');
  auditResults.summary.recommendations.push('Fix production build issues');
}

console.log('\n4️⃣ Cross-browser Compatibility Check...\n');

// Check for modern JavaScript features that might need polyfills
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

let modernFeatures = [];
srcFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for modern features
    if (content.includes('?.')) modernFeatures.push('Optional chaining');
    if (content.includes('??')) modernFeatures.push('Nullish coalescing');
    if (content.includes('async/await')) modernFeatures.push('Async/await');
    if (content.includes('const ') || content.includes('let ')) modernFeatures.push('ES6+ syntax');
    
  } catch (error) {
    // Ignore file read errors
  }
});

modernFeatures = [...new Set(modernFeatures)];
if (modernFeatures.length > 0) {
  console.log('📱 Modern JavaScript features detected:');
  modernFeatures.forEach(feature => console.log(`   - ${feature}`));
  console.log('   Ensure your build process includes appropriate polyfills for older browsers');
}

console.log('\n5️⃣ SEO and Meta Tags Check...\n');

// Check index.html for SEO elements
try {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  
  const seoChecks = [
    { name: 'Title tag', check: indexHtml.includes('<title>') },
    { name: 'Meta description', check: indexHtml.includes('name="description"') },
    { name: 'Meta viewport', check: indexHtml.includes('name="viewport"') },
    { name: 'Meta charset', check: indexHtml.includes('charset=') },
    { name: 'Open Graph tags', check: indexHtml.includes('property="og:') },
    { name: 'Favicon', check: indexHtml.includes('rel="icon"') }
  ];
  
  seoChecks.forEach(check => {
    if (check.check) {
      console.log(`✅ ${check.name} found`);
    } else {
      console.log(`❌ ${check.name} missing`);
      auditResults.summary.recommendations.push(`Add ${check.name.toLowerCase()} to index.html`);
    }
  });
  
} catch (error) {
  console.log('❌ Could not read index.html');
}

// Generate final recommendations
console.log('\n🎯 FINAL AUDIT SUMMARY');
console.log('======================\n');

const finalRecommendations = [
  '🚀 Performance Optimizations:',
  '   - Ensure all images are optimized and use lazy loading',
  '   - Implement code splitting for better bundle sizes',
  '   - Use resource hints (preload, prefetch) for critical resources',
  '',
  '♿ Accessibility Improvements:',
  '   - Verify all interactive elements have proper ARIA labels',
  '   - Test keyboard navigation thoroughly',
  '   - Ensure color contrast meets WCAG guidelines',
  '',
  '🔧 Technical Excellence:',
  '   - Keep dependencies up to date',
  '   - Monitor bundle sizes regularly',
  '   - Implement comprehensive error handling',
  '',
  '📱 User Experience:',
  '   - Test on various devices and screen sizes',
  '   - Ensure smooth animations and transitions',
  '   - Provide clear loading states and feedback',
  '',
  '🔍 SEO & Discoverability:',
  '   - Add comprehensive meta tags',
  '   - Implement structured data markup',
  '   - Ensure fast loading times',
  ''
];

finalRecommendations.forEach(rec => console.log(rec));

if (auditResults.summary.recommendations.length > 0) {
  console.log('🚨 Immediate Action Items:');
  auditResults.summary.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
} else {
  console.log('🎉 No immediate issues found! Your portfolio is ready for production.');
}

// Save final audit results
const finalResultsFile = path.join(AUDIT_RESULTS_DIR, `final-audit-${TIMESTAMP}.json`);
fs.writeFileSync(finalResultsFile, JSON.stringify(auditResults, null, 2));
console.log(`\n📄 Final audit results saved to: ${finalResultsFile}`);

console.log('\n✨ Portfolio audit complete! Review the recommendations above to ensure optimal performance and accessibility.');