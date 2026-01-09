import type { AuditResult, Recommendation } from '../types.js';

export async function generateRecommendations(
  auditResult: AuditResult
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  if (auditResult.coreWebVitals) {
    const vitals = auditResult.coreWebVitals;

    if (vitals.lcp.rating === 'poor' || vitals.lcp.rating === 'needs-improvement') {
      recommendations.push({
        id: 'lcp-improvement',
        priority: vitals.lcp.rating === 'poor' ? 'critical' : 'high',
        category: 'Core Web Vitals',
        title: 'Optimize Largest Contentful Paint (LCP)',
        description: `Current LCP is ${vitals.lcp.value}${vitals.lcp.unit}, target is <${vitals.lcp.threshold}s. LCP measures when the main content has finished loading.`,
        impact: 'Improving LCP directly affects user perception of page speed and can improve conversion rates by 15-20%.',
        effort: 'moderate',
        estimatedImpact: 15,
        codeExample: `// Preload critical resources
<link rel="preload" href="critical-image.jpg" as="image">
<link rel="preload" href="critical-font.woff2" as="font" crossorigin>

// Optimize images
<img src="image.webp" loading="eager" fetchpriority="high">`,
      });
    }

    if (vitals.fid.rating === 'poor' || vitals.fid.rating === 'needs-improvement') {
      recommendations.push({
        id: 'fid-improvement',
        priority: vitals.fid.rating === 'poor' ? 'critical' : 'high',
        category: 'Core Web Vitals',
        title: 'Improve First Input Delay (FID)',
        description: `Current FID is ${vitals.fid.value}${vitals.fid.unit}, target is <${vitals.fid.threshold}ms. FID measures the time from user interaction to browser response.`,
        impact: 'Better interactivity leads to higher engagement and improved user satisfaction scores.',
        effort: 'moderate',
        estimatedImpact: 12,
        codeExample: `// Code splitting for smaller initial bundles
import lazyComponent from './LazyComponent'

// Reduce main thread work
const heavyComputation = () => {
  setTimeout(() => {
    // Offload to idle callback
  }, 0)
}

requestIdleCallback(() => {
  heavyComputation()
})`,
      });
    }

    if (vitals.cls.rating === 'poor' || vitals.cls.rating === 'needs-improvement') {
      recommendations.push({
        id: 'cls-improvement',
        priority: vitals.cls.rating === 'poor' ? 'high' : 'medium',
        category: 'Core Web Vitals',
        title: 'Reduce Cumulative Layout Shift (CLS)',
        description: `Current CLS is ${vitals.cls.value}, target is <${vitals.cls.threshold}. CLS measures visual stability during page load.`,
        impact: 'Preventing layout shifts improves user experience and reduces accidental clicks.',
        effort: 'quick-win',
        estimatedImpact: 10,
        codeExample: `// Reserve space for dynamic content
<div style="min-height: 300px;">
  <img src="image.jpg" style="width: 100%; height: auto;">
</div>

// Use CSS containment
.card {
  contain: layout;
}

// Font-display optimization
@font-face {
  font-family: 'CustomFont';
  font-display: swap;
}`,
      });
    }
  }

  if (auditResult.bundleAnalysis) {
    const analysis = auditResult.bundleAnalysis;

    if (analysis.totalAssets.original > 1024 * 1024) {
      recommendations.push({
        id: 'bundle-size',
        priority: 'critical',
        category: 'Bundle Optimization',
        title: 'Reduce Initial Bundle Size',
        description: `Total bundle size is ${formatBytes(analysis.totalAssets.original)}, which exceeds 1MB threshold.`,
        impact: 'Smaller bundles load faster, especially on mobile networks with slower connections.',
        effort: 'significant',
        estimatedImpact: 20,
        codeExample: `// Code splitting with React.lazy
const Dashboard = React.lazy(() => import('./Dashboard'))
const Settings = React.lazy(() => import('./Settings'))

// Tree shaking in webpack
optimization: {
  usedExports: true,
  sideEffects: false
}

// External libraries from bundle
externals: {
  react: 'React',
  'react-dom': 'ReactDOM'
}`,
      });
    }

    for (const opportunity of analysis.codeSplittingOpportunities) {
      recommendations.push({
        id: `code-splitting-${opportunity.slice(0, 20)}`,
        priority: 'high',
        category: 'Bundle Optimization',
        title: opportunity,
        description: 'Implement code splitting to reduce initial load time.',
        impact: 'Smaller initial bundles improve Time to Interactive (TTI).',
        effort: 'moderate',
        estimatedImpact: 15,
      });
    }

    for (const dep of analysis.duplicateDependencies) {
      if (dep.instances > 2) {
        recommendations.push({
          id: `duplicate-${dep.name}`,
          priority: 'medium',
          category: 'Bundle Optimization',
          title: `Deduplicate ${dep.name}`,
          description: `${dep.name} appears ${dep.instances} times in your dependencies, adding ${formatBytes(dep.totalSize)}.`,
          impact: 'Removing duplicate dependencies reduces bundle size and improves build time.',
          effort: 'quick-win',
          estimatedImpact: 5,
        });
      }
    }

    if (analysis.treeShakingPotential > 0.1) {
      recommendations.push({
        id: 'tree-shaking',
        priority: 'medium',
        category: 'Bundle Optimization',
        title: 'Improve Tree Shaking',
        description: `${(analysis.treeShakingPotential * 100).toFixed(0)}% of code appears to be unused and can be eliminated.`,
        impact: 'Removing dead code reduces bundle size and improves maintainability.',
        effort: 'moderate',
        estimatedImpact: 10,
        codeExample: `// Use ES modules for tree shaking
export const helper = () => {}

// Mark side effects in package.json
{
  "sideEffects": false
}

// Use proper imports
import { helper } from './utils'  // Good
import * as utils from './utils'  // Bad`,
      });
    }
  }

  if (auditResult.compressionResults) {
    const compression = auditResult.compressionResults;

    if (compression.recommendedFormat === 'brotli' && compression.averageCompressionRatio < 70) {
      recommendations.push({
        id: 'brotli-compression',
        priority: 'high',
        category: 'Compression',
        title: 'Enable Brotli Compression',
        description: 'Brotli provides 15-25% better compression than Gzip.',
        impact: 'Faster download speeds, especially on mobile connections.',
        effort: 'quick-win',
        estimatedImpact: 10,
        codeExample: `// Enable Brotli in nginx
brotli on;
brotli_comp_level 11;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

// CDN configuration
Cache-Control: public, max-age=31536000, immutable
Content-Encoding: br`,
      });
    }

    if (compression.gzipResults.length > 0 && compression.brotliResults.length > 0) {
      recommendations.push({
        id: 'compression-comparison',
        priority: 'medium',
        category: 'Compression',
        title: 'Compare Gzip vs Brotli Performance',
        description: 'Analyze which compression format works best for your specific content.',
        impact: 'Optimal compression choice can improve delivery times.',
        effort: 'quick-win',
        estimatedImpact: 5,
      });
    }
  }

  if (auditResult.minificationResults) {
    const minification = auditResult.minificationResults;

    if (minification.totalReduction < 20) {
      recommendations.push({
        id: 'improve-minification',
        priority: 'medium',
        category: 'Minification',
        title: 'Improve Code Minification',
        description: `Current minification achieves ${minification.totalReduction.toFixed(1)}% reduction. Can be improved to 30%+ with proper configuration.`,
        impact: 'Smaller file sizes reduce download time.',
        effort: 'quick-win',
        estimatedImpact: 8,
        codeExample: `// Enable aggressive minification in webpack
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            pure_funcs: ['console.log']
          },
          mangle: true,
          format: {
            comments: false
          }
        }
      })
    ]
  }
}`,
      });
    }
  }

  if (auditResult.imageOptimizationResults) {
    const images = auditResult.imageOptimizationResults;

    if (images.reductionPercentage < 30) {
      recommendations.push({
        id: 'image-optimization',
        priority: 'high',
        category: 'Image Optimization',
        title: 'Optimize Images',
        description: `Images can be optimized further. Current reduction: ${images.reductionPercentage.toFixed(1)}%, target: 50%+.`,
        impact: 'Images often account for 50-90% of page weight. Optimization has major impact.',
        effort: 'quick-win',
        estimatedImpact: 18,
        codeExample: `// Convert to modern formats
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>

// Responsive images
<img
  src="small.jpg"
  srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 1500w"
  sizes="(max-width: 600px) 500px, 1000px"
  loading="lazy"
  alt="Description"
>

// Use placeholder or blur technique
<img src="data:image/svg+xml;base64,..." loading="lazy">`,
      });
    }

    if (images.lazyLoadingAdded === 0) {
      recommendations.push({
        id: 'lazy-loading',
        priority: 'high',
        category: 'Image Optimization',
        title: 'Implement Lazy Loading for Images',
        description: 'Add loading="lazy" attribute to images below the fold.',
        impact: 'Reduces initial page load time by deferring offscreen images.',
        effort: 'quick-win',
        estimatedImpact: 12,
      });
    }
  }

  recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return recommendations;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}