
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import path from 'path';
import { detectLanguageAndFramework } from '../core/detector.js';
import { analyzeBundle } from '../core/bundle-analyzer.js';
import { applyCompression, minifyAssets } from '../core/optimizer.js';
import { optimizeImages } from '../core/images.js';
import { runLighthouseAudit } from '../core/lighthouse.js';
import { generateReport } from '../reporting/generator.js';

const server = new McpServer({
  name: 'performance-audit-agent',
  version: '1.0.0'
});

server.registerTool(
  'detect_project',
  {
    description: 'Detect project language, framework, and build tool',
    inputSchema: z.object({
      path: z.string().optional()
    })
  },
  async (args: { path?: string | undefined }) => {
    try {
      const p = args.path ?? process.cwd();
      const detection = await detectLanguageAndFramework(p);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, project: detection })
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: 'Error: ' + String(error) }],
        isError: true
      };
    }
  }
);

server.registerTool(
  'analyze_bundle',
  {
    description: 'Analyze bundle size and composition',
    inputSchema: z.object({
      path: z.string().optional()
    })
  },
  async (args: { path?: string | undefined }) => {
    try {
      const p = args.path ?? process.cwd();
      const a = await analyzeBundle(p);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, data: a })
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: 'Error: ' + String(error) }],
        isError: true
      };
    }
  }
);

server.registerTool(
  'compress_assets',
  {
    description: 'Apply Gzip and Brotli compression',
    inputSchema: z.object({
      path: z.string().optional(),
      apply: z.boolean().optional()
    })
  },
  async (args: { path?: string | undefined; apply?: boolean | undefined }) => {
    try {
      const p = args.path ?? path.join(process.cwd(), 'dist');
      const c = await applyCompression(p, args.apply ?? false);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, data: c })
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: 'Error: ' + String(error) }],
        isError: true
      };
    }
  }
);

server.registerTool(
  'minify_code',
  {
    description: 'Minify JavaScript, CSS, and HTML files',
    inputSchema: z.object({
      path: z.string().optional(),
      apply: z.boolean().optional()
    })
  },
  async (args: { path?: string | undefined; apply?: boolean | undefined }) => {
    try {
      const p = args.path ?? path.join(process.cwd(), 'dist');
      const m = await minifyAssets(p, args.apply ?? false);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, data: m })
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: 'Error: ' + String(error) }],
        isError: true
      };
    }
  }
);

server.registerTool(
  'optimize_images',
  {
    description: 'Optimize images with WebP format',
    inputSchema: z.object({
      path: z.string().optional(),
      apply: z.boolean().optional()
    })
  },
  async (args: { path?: string | undefined; apply?: boolean | undefined }) => {
    try {
      const p = args.path ?? path.join(process.cwd(), 'public'); // Usually where images are
      const i = await optimizeImages(p, args.apply ?? false);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(i)
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: 'Error: ' + String(error) }],
        isError: true
      };
    }
  }
);

server.registerTool(
    'audit_repository',
    {
        description: 'Run complete performance audit',
        inputSchema: z.object({
            path: z.string().optional(),
            url: z.string().optional(),
            outputPath: z.string().optional()
        })
    },
    async (args: { path?: string | undefined; url?: string | undefined; outputPath?: string | undefined }) => {
        try {
           const p = args.path ?? process.cwd();
           const project = await detectLanguageAndFramework(p);
           const bundle = await analyzeBundle(p);
           
           let lighthouseResult = null;
           if (args.url) {
               lighthouseResult = await runLighthouseAudit(args.url);
           }

           const result = {
               project,
               bundle,
               lighthouse: lighthouseResult ? { score: lighthouseResult.categories.performance.score } : 'Skipped'
           };
           
           if (args.outputPath) {
               await generateReport(result, args.outputPath);
           }
           
           return {
               content: [{ type: 'text', text: JSON.stringify(result) }]
           };
        } catch (error) {
             return {
                content: [{ type: 'text', text: 'Error: ' + String(error) }],
                isError: true
            };
        }
    }
);

server.registerTool(
    'generate_report',
    {
        description: 'Generate a report from JSON data',
        inputSchema: z.object({
            data: z.string(),
            outputPath: z.string()
        })
    },
    async (args: { data: string; outputPath: string }) => {
        try {
            const parsedData = JSON.parse(args.data);
            const reportPath = await generateReport(parsedData, args.outputPath);
             return {
                content: [{ type: 'text', text: `Report generated at ${reportPath}` }]
            };
        } catch (error) {
             return {
                content: [{ type: 'text', text: 'Error: ' + String(error) }],
                isError: true
            };
        }
    }
);


const transport = new StdioServerTransport();
server.connect(transport).then(() => console.error('Performance Audit MCP Server started'));