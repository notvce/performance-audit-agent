# Performance Audit Agent

> Universal performance audit agent with enterprise-grade analysis, compatible with MCP for Claude, OpenCode, Gemini, and other AI platforms.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 🚀 Features

- **Comprehensive Performance Auditing**: Lighthouse, Core Web Vitals, Bundle Analysis
- **Automatic Code Optimization**: Minification, Tree Shaking, Code Splitting
- **Advanced Compression**: Gzip (level 9), Brotli (quality 11), Zopfli
- **Image Optimization**: WebP, AVIF, Lazy Loading, Responsive Images
- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby, Swift, Kotlin, C#
- **Professional Reports**: HTML, JSON, Markdown formats with visualizations
- **MCP Compatible**: Works with Claude Desktop, OpenCode, Gemini, Cursor, and more
- **Enterprise-Grade**: Production-ready, thoroughly tested, optimized for scale

## 📦 Installation

### Global Installation

```bash
npm install -g @universal/performance-audit-agent
```

### Local Installation

```bash
npm install @universal/performance-audit-agent
```

## 🔧 Usage

### Command Line

```bash
# Run complete audit on current directory
performance-audit audit

# Audit specific URL
performance-audit audit --url https://example.com

# Generate HTML report
performance-audit audit --format html

# Analyze bundle only
performance-audit analyze-bundle

# Apply compression
performance-audit compress --apply
```

### MCP Integration

The agent exposes the following MCP tools:

1. **`detect_project`** - Detect project language, framework, and build tool
2. **`audit_repository`** - Run complete performance audit
3. **`analyze_bundle`** - Analyze bundle size and composition
4. **`compress_assets`** - Apply Gzip and Brotli compression
5. **`minify_code`** - Minify JavaScript, CSS, and HTML
6. **`optimize_images`** - Optimize images with modern formats
7. **`generate_report`** - Generate professional report
8. **`suggest_optimizations`** - Get optimization recommendations

### Claude Desktop

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "performance-audit": {
      "command": "npx",
      "args": ["-y", "@universal/performance-audit-agent"]
    }
  }
}
```

### OpenCode

```javascript
// opencode.config.js
export default {
  mcpServers: {
    'performance-audit': {
      command: 'node',
      args: ['node_modules/performance-audit-agent/dist/mcp-server.js']
    }
  }
}
```

### AGENTS.md

Add to your project's `AGENTS.md`:

```markdown
# Performance Audit Agent

## Available MCP Tools
- `detect_project()`: Detect project type and technology stack
- `audit_repository()`: Run complete performance audit
- `analyze_bundle()`: Analyze bundle composition and size
- `compress_assets()`: Apply compression (Gzip/Brotli)
- `minify_code()`: Minify JS, CSS, HTML
- `optimize_images()`: Optimize images (WebP/AVIF)
- `generate_report()`: Generate professional report
- `suggest_optimizations()`: Get prioritized recommendations

## Usage
Run a performance audit with:
"Run a complete performance audit of this repository and generate an HTML report"
```

## 📊 Supported Audits

### Web Performance
- Lighthouse CI (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals (LCP, FID, CLS, FCP, TTI, TTFB)
- Bundle Analysis (Webpack, Vite, Rollup, Next.js)
- Resource Optimization (Images, Fonts, CSS)

### Code Optimization
- JavaScript: Terser minification, Tree shaking, Code splitting
- CSS: CSSNano optimization, PurgeCSS
- HTML: HTMLMinifier-Terser
- Multi-language: AST-based optimizations per language

### Compression
- Gzip (level 9)
- Brotli (quality 11)
- Zopfli (optimized)
- Automatic format selection based on best ratio

### Image Optimization
- Format conversion (WebP, AVIF)
- Lossless and lossy compression
- Responsive image generation
- Lazy loading hints
- Placeholder generation

## 🎯 Performance Targets

| Metric | Target | Rating |
|--------|---------|---------|
| Performance Score | > 90 | Excellent |
| LCP | < 2.5s | Good |
| FID | < 100ms | Good |
| CLS | < 0.1 | Good |
| Bundle Size | < 500KB | Gzipped |
| Compression Ratio | > 70% | Excellent |

## 📈 Report Formats

### HTML Report
- Interactive visualizations
- Before/after comparisons
- Actionable recommendations
- Export to PDF

### JSON Report
- Programmatic access
- CI/CD integration
- Automated analysis
- Data visualization ready

### Markdown Report
- Version control friendly
- Documentation integration
- GitHub/GitLab rendering
- Easy to share

## 🔧 Configuration

Create `performance-audit.config.json`:

```json
{
  "lighthouse": {
    "thresholds": {
      "performance": 90,
      "accessibility": 90,
      "best-practices": 90,
      "seo": 90
    }
  },
  "bundle": {
    "maxSize": 500000,
    "maxInitialChunks": 3
  },
  "compression": {
    "preferBrotli": true,
    "gzipLevel": 9,
    "brotliQuality": 11
  },
  "images": {
    "formats": ["webp", "avif"],
    "quality": 85,
    "lazyLoading": true
  }
}
```

## 🌐 Supported Languages & Frameworks

| Language | Frameworks | Detection |
|----------|-------------|------------|
| JavaScript/TypeScript | React, Vue, Angular, Next.js, Nuxt, Svelte | ✅ package.json |
| Python | Django, Flask, FastAPI, Tornado | ✅ requirements.txt |
| Java | Spring Boot, Jakarta EE | ✅ pom.xml, build.gradle |
| Go | - | ✅ go.mod |
| Rust | - | ✅ Cargo.toml |
| PHP | Laravel, Symfony, WordPress, Drupal | ✅ composer.json |
| Ruby | Rails, Sinatra | ✅ Gemfile |
| C# | ASP.NET Core, WPF, WinForms | ✅ .csproj |
| Swift | iOS, macOS | ✅ package.swift |
| Kotlin | Android | ✅ build.gradle.kts |
| C/C++ | - | ✅ CMakeLists.txt |

## 🔀 CI/CD Integration

### GitHub Actions

```yaml
name: Performance Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Performance Audit
        run: |
          npx @universal/performance-audit-agent audit --format json
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: audit-reports/
```

### GitLab CI

```yaml
performance-audit:
  stage: test
  script:
    - npx @universal/performance-audit-agent audit
  artifacts:
    paths:
      - audit-reports/
    expire_in: 1 week
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Lighthouse by Google Chrome team
- Webpack Bundle Analyzer
- Sharp for image processing
- Model Context Protocol (MCP) by Anthropic

## 📞 Support

- GitHub Issues: [github.com/your-org/performance-audit-agent/issues](https://github.com/your-org/performance-audit-agent/issues)
- Documentation: [docs.performance-audit.com](https://docs.performance-audit.com)
- Discord: [discord.gg/performance-audit](https://discord.gg/performance-audit)

## ⭐ Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

Made with ❤️ by the Performance Audit Team