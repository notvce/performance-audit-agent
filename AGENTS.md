# Performance Audit Agent

This document provides instructions for AI coding agents to perform performance audits on this repository.

## Available MCP Tools

The Performance Audit Agent exposes the following MCP tools:

### `detect_project()`
Detect project language, framework, and build tool.

**Returns:** Project metadata (language, framework, build tool, files)

### `audit_repository(options)`
Run complete performance audit of the repository.

**Parameters:**
- `url` (string, optional): URL to audit (optional for bundle-only analysis)
- `outputPath` (string, optional): Path where reports will be saved (default: ./audit-reports)
- `format` (string, optional): Report format - 'html', 'json', 'markdown' (default: html)
- `includeLighthouse` (boolean, optional): Include Lighthouse audit (default: true)
- `includeBundleAnalysis` (boolean, optional): Include bundle analysis (default: true)
- `includeCompression` (boolean, optional): Include compression analysis (default: true)
- `includeMinification` (boolean, optional): Include minification analysis (default: true)
- `includeImageOptimization` (boolean, optional): Include image optimization (default: true)

**Returns:** Complete audit results with summary, metrics, and recommendations

### `analyze_bundle(options)`
Analyze bundle size, composition, and identify code splitting opportunities.

**Parameters:**
- `path` (string, optional): Path to project directory (defaults to current directory)
- `outputPath` (string, optional): Path where bundle analysis report will be saved

**Returns:** Bundle analysis with size metrics, opportunities, and duplicate dependencies

### `compress_assets(options)`
Apply Gzip and Brotli compression to assets.

**Parameters:**
- `path` (string, optional): Path to assets directory (defaults to build/dist)
- `apply` (boolean, optional): Apply compression to files (default: false - analyze only)
- `outputPath` (string, optional): Path where compressed files will be saved

**Returns:** Compression results with ratios for each format

### `minify_code(options)`
Minify JavaScript, CSS, and HTML files.

**Parameters:**
- `path` (string, optional): Path to files to minify (defaults to dist/build)
- `apply` (boolean, optional): Apply minification to files (default: false - analyze only)
- `outputPath` (string, optional): Path where minified files will be saved

**Returns:** Minification statistics and size reductions

### `optimize_images(options)`
Optimize images by converting to WebP/AVIF and applying compression.

**Parameters:**
- `path` (string, optional): Path to images directory
- `apply` (boolean, optional): Apply optimizations (default: false - analyze only)
- `outputPath` (string, optional): Path where optimized images will be saved
- `formats` (array, optional): Target formats (default: ["webp"])

**Returns:** Image optimization results with format conversions and size reductions

### `generate_report(options)`
Generate a professional performance audit report.

**Parameters:**
- `auditResults` (string, required): JSON string of audit results
- `format` (string, optional): Report format - 'html', 'json', 'markdown' (default: html)
- `outputPath` (string, optional): Path where report will be saved (default: ./audit-reports)
- `includeVisualizations` (boolean, optional): Include charts and visualizations (default: true)

**Returns:** Generated report with file path and metadata

### `suggest_optimizations(options)`
Generate performance optimization recommendations based on audit results.

**Parameters:**
- `auditResults` (string, required): JSON string of audit results to base recommendations on
- `priority` (string, optional): Filter recommendations by priority - 'all', 'critical', 'high', 'medium', 'low' (default: all)
- `category` (string, optional): Filter recommendations by category

**Returns:** Prioritized optimization recommendations with impact estimates

## Project Information

This repository is configured for performance audits with the following settings:

- **Supported Languages:** JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby, Swift, Kotlin, C#
- **Build Tools:** npm, yarn, pnpm, webpack, vite, rollup, esbuild, next.js, nuxt, gradle, maven, cargo, etc.
- **Frameworks:** React, Vue, Angular, Next.js, Nuxt, Svelte, Django, Flask, FastAPI, Spring Boot, Laravel, etc.

## Example Usage

### Complete Audit

```
Run a complete performance audit of this repository including Lighthouse, bundle analysis, compression, minification, and image optimization. Generate an HTML report with visualizations.
```

### Bundle Analysis

```
Analyze the bundle size, composition, and identify code splitting opportunities. Show the largest chunks, duplicate dependencies, and tree-shaking potential.
```

### Optimization Recommendations

```
Generate prioritized optimization recommendations based on current audit results. Focus on critical and high priority items with the highest estimated impact.
```

## Performance Targets

The following performance targets should be met:

- **Lighthouse Performance Score:** > 90
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Initial Bundle Size (gzipped):** < 500KB
- **Compression Ratio:** > 70%

## Configuration

Performance audit configuration is stored in `performance-audit.config.json` (if present).

Default settings:
- Lighthouse thresholds: Performance 90, Accessibility 90, Best Practices 90, SEO 90
- Bundle size limit: 500KB (gzipped)
- Compression: Prefer Brotli, Gzip level 9, Brotli quality 11
- Image formats: WebP (85 quality), AVIF (optional)
- Minification: Aggressive mode enabled

## Audit Workflow

When performing a performance audit, follow this workflow:

1. **Detection**: Use `detect_project()` to understand the project structure
2. **Analysis**: Run `audit_repository()` for comprehensive analysis
3. **Review**: Examine bundle analysis results for optimization opportunities
4. **Optimize**: Apply recommended optimizations using `compress_assets()`, `minify_code()`, `optimize_images()`
5. **Report**: Generate professional report with `generate_report()`
6. **Iterate**: Review recommendations and implement improvements

## Notes for AI Agents

- Always run `detect_project()` first to understand the project type
- Check for existing `performance-audit.config.json` for custom settings
- Use audit results to generate context-aware recommendations
- Consider the project's tech stack when suggesting optimizations
- Provide code examples in the project's primary language
- Prioritize recommendations by business impact and implementation effort
- Include performance estimates (e.g., "+15% conversion rate")

## Troubleshooting

**No build directory found**: Run the project's build command first.
**Missing package.json**: Ensure dependencies are installed.
**Chrome fails to launch**: Ensure Chrome is installed or use Puppeteer's bundled Chromium.
**Low compression ratios**: Check if files are already compressed or minified.

## Integration

This agent is compatible with:
- Claude Desktop via MCP
- OpenCode via MCP
- Gemini Code Assist via MCP
- Cursor via MCP
- VS Code via MCP extension
- Any MCP-compatible AI platform