#!/usr/bin/env node

/**
 * Performance audit script for the portfolio website
 * Runs various performance checks and generates reports
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Performance thresholds
const THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 800, // Time to First Byte (ms)
  bundleSize: 1000 * 1024, // 1MB in bytes
  chunkSize: 500 * 1024    // 500KB in bytes
};

class PerformanceAuditor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      bundleAnalysis: {},
      buildMetrics: {},
      recommendations: []
    };
  }

  async runAudit() {
    console.log('🚀 Starting Performance Audit...\n');

    try {
      await this.analyzeBundleSize();
      await this.runBuildAnalysis();
      await this.generateRecommendations();
      await this.generateReport();
      
      console.log('✅ Performance audit completed successfully!');
      console.log(`📊 Report saved to: ${join(__dirname, '../performance-report.json')}`);
      
    } catch (error) {
      console.error('❌ Performance audit failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeBundleSize() {
    console.log('📦 Analyzing bundle size...');

    try {
      // Build the project
      execSync('npm run build', { stdio: 'pipe', cwd: join(__dirname, '..') });

      // Analyze dist folder
      const distPath = join(__dirname, '../dist');
      if (!existsSync(distPath)) {
        throw new Error('Build output not found. Make sure build completed successfully.');
      }

      // Get file sizes
      const assets = this.getAssetSizes(distPath);
      
      this.results.bundleAnalysis = {
        totalSize: assets.reduce((sum, asset) => sum + asset.size, 0),
        assets: assets,
        largestAssets: assets
          .sort((a, b) => b.size - a.size)
          .slice(0, 10),
        oversizedAssets: assets.filter(asset => 
          asset.name.endsWith('.js') && asset.size > THRESHOLDS.chunkSize
        )
      };

      // Check thresholds
      const totalJSSize = assets
        .filter(asset => asset.name.endsWith('.js'))
        .reduce((sum, asset) => sum + asset.size, 0);

      if (totalJSSize > THRESHOLDS.bundleSize) {
        this.results.recommendations.push({
          type: 'warning',
          category: 'Bundle Size',
          message: `Total JavaScript bundle size (${this.formatBytes(totalJSSize)}) exceeds recommended limit (${this.formatBytes(THRESHOLDS.bundleSize)})`
        });
      }

      console.log(`   Total bundle size: ${this.formatBytes(this.results.bundleAnalysis.totalSize)}`);
      console.log(`   JavaScript size: ${this.formatBytes(totalJSSize)}`);
      console.log(`   Number of assets: ${assets.length}`);

    } catch (error) {
      console.error('   Failed to analyze bundle size:', error.message);
      throw error;
    }
  }

  getAssetSizes(distPath) {
    const assets = [];
    
    try {
      const files = execSync(`find "${distPath}" -type f`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(file => file);

      for (const file of files) {
        try {
          const stats = execSync(`stat -c%s "${file}"`, { encoding: 'utf8' });
          const size = parseInt(stats.trim());
          const name = file.replace(distPath + '/', '');
          
          assets.push({ name, size, path: file });
        } catch (e) {
          // Skip files that can't be stat'd
        }
      }
    } catch (error) {
      console.warn('   Could not analyze all assets:', error.message);
    }

    return assets;
  }

  async runBuildAnalysis() {
    console.log('🔧 Running build analysis...');

    try {
      const startTime = Date.now();
      
      // Clean build
      execSync('rm -rf dist', { cwd: join(__dirname, '..') });
      
      // Timed build
      execSync('npm run build', { stdio: 'pipe', cwd: join(__dirname, '..') });
      
      const buildTime = Date.now() - startTime;

      this.results.buildMetrics = {
        buildTime,
        buildTimeFormatted: `${(buildTime / 1000).toFixed(2)}s`
      };

      console.log(`   Build time: ${this.results.buildMetrics.buildTimeFormatted}`);

      if (buildTime > 30000) { // 30 seconds
        this.results.recommendations.push({
          type: 'warning',
          category: 'Build Performance',
          message: `Build time (${this.results.buildMetrics.buildTimeFormatted}) is longer than recommended (30s)`
        });
      }

    } catch (error) {
      console.error('   Build analysis failed:', error.message);
      throw error;
    }
  }

  async generateRecommendations() {
    console.log('💡 Generating recommendations...');

    const { bundleAnalysis } = this.results;

    // Check for large assets
    if (bundleAnalysis.oversizedAssets?.length > 0) {
      this.results.recommendations.push({
        type: 'error',
        category: 'Bundle Optimization',
        message: `Found ${bundleAnalysis.oversizedAssets.length} oversized JavaScript chunks`,
        details: bundleAnalysis.oversizedAssets.map(asset => 
          `${asset.name}: ${this.formatBytes(asset.size)}`
        )
      });
    }

    // Check for too many assets
    if (bundleAnalysis.assets?.length > 50) {
      this.results.recommendations.push({
        type: 'warning',
        category: 'Asset Management',
        message: `High number of assets (${bundleAnalysis.assets.length}) may impact loading performance`
      });
    }

    // General recommendations
    this.results.recommendations.push(
      {
        type: 'info',
        category: 'Performance',
        message: 'Consider implementing service worker for caching'
      },
      {
        type: 'info',
        category: 'Performance',
        message: 'Monitor Core Web Vitals in production'
      },
      {
        type: 'info',
        category: 'Optimization',
        message: 'Consider using WebP images for better compression'
      }
    );

    console.log(`   Generated ${this.results.recommendations.length} recommendations`);
  }

  async generateReport() {
    const reportPath = join(__dirname, '../performance-report.json');
    
    // Add summary
    this.results.summary = {
      status: this.results.recommendations.some(r => r.type === 'error') ? 'FAILED' : 
              this.results.recommendations.some(r => r.type === 'warning') ? 'WARNING' : 'PASSED',
      totalRecommendations: this.results.recommendations.length,
      errors: this.results.recommendations.filter(r => r.type === 'error').length,
      warnings: this.results.recommendations.filter(r => r.type === 'warning').length
    };

    writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Console summary
    console.log('\n📊 Performance Audit Summary:');
    console.log(`   Status: ${this.results.summary.status}`);
    console.log(`   Errors: ${this.results.summary.errors}`);
    console.log(`   Warnings: ${this.results.summary.warnings}`);
    console.log(`   Total bundle size: ${this.formatBytes(this.results.bundleAnalysis.totalSize)}`);
    console.log(`   Build time: ${this.results.buildMetrics.buildTimeFormatted}`);

    if (this.results.recommendations.length > 0) {
      console.log('\n🔍 Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        const icon = rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`   ${icon} [${rec.category}] ${rec.message}`);
        if (rec.details) {
          rec.details.forEach(detail => console.log(`      - ${detail}`));
        }
      });
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the audit
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new PerformanceAuditor();
  auditor.runAudit().catch(console.error);
}

export default PerformanceAuditor;