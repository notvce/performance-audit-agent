import { detectLanguageAndFramework } from './core/detector.js';
import { analyzeBundle } from './core/bundle-analyzer.js';
import { applyCompression, minifyAssets } from './core/optimizer.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'detect': {
      console.log('🔍 Detecting project...');
      const d = await detectLanguageAndFramework(process.cwd());
      console.log(`✅ Language: ${d.language}, Framework: ${d.framework}`);
      break;
    }
    case 'analyze-bundle': {
      console.log('📦 Analyzing bundles...');
      const a = await analyzeBundle(process.cwd());
      console.log(`✅ Reduction: ${a.totalAssets.reductionPercentage.toFixed(1)}%`);
      break;
    }
    case 'compress': {
      console.log('🗜️  Analyzing compression...');
      const c = await applyCompression('./dist', false);
      console.log(`✅ ${c.recommendedFormat.toUpperCase()} recommended`);
      break;
    }
    case 'minify': {
      console.log('🗜️  Analyzing minification...');
      const m = await minifyAssets('./dist', false);
      console.log(`✅ Reduction: ${m.totalReduction.toFixed(1)}%`);
      break;
    }
    case 'mcp': {
      console.log('🔌 Starting MCP Server...');
      await import('./mcp/server.js');
      console.log('✅ MCP Server ready');
      break;
    }
    default: {
      console.log('Performance Audit Agent v1.0.0');
      console.log('Commands: detect, analyze-bundle, compress, minify, mcp');
    }
  }
}

main().catch(console.error);