
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export async function analyzeBundle(projectPath: string): Promise<{
  totalSize: number;
  fileCount: number;
  largeFiles: Array<{ name: string; size: number }>;
  breakdown: Record<string, number>;
  totalAssets: { reductionPercentage: number, original: number }; // Keeping compatibility with server.ts expectation
}> {
  const distPath = path.join(projectPath, 'dist'); // Default assumption, can be made configurable
  // Fallback to current dir if dist doesn't exist, but usually we look for build artifacts
  const searchPath = fs.existsSync(distPath) ? distPath : projectPath;

  console.log(`Analyzing bundle in ${searchPath}`);

  const files = await glob('**/*.{js,css,html,json,map}', { 
    cwd: searchPath, 
    absolute: true,
    ignore: ['**/node_modules/**']
  });

  let total = 0;
  const breakdown: Record<string, number> = { js: 0, css: 0, html: 0, other: 0 };
  const largeFiles: Array<{ name: string; size: number }> = [];

  for (const file of files) {
    const stats = await fs.stat(file);
    const size = stats.size;
    total += size;

    const ext = path.extname(file).substring(1);
    if (breakdown[ext] !== undefined) {
      breakdown[ext] += size;
    } else {
      if (breakdown['other'] === undefined) breakdown['other'] = 0;
      breakdown['other'] += size;
    }

    if (size > 50 * 1024) { // 50KB threshold
      largeFiles.push({ name: path.basename(file), size });
    }
  }

  // Sorting large files
  largeFiles.sort((a, b) => b.size - a.size);

  // Return structure compatible with what server.ts expected, plus more real data
  // The 'reductionPercentage' is actually a prediction in the original mock. 
  // We'll calculate a theoretical reduction based on simply being unminified or uncompressed?
  // For now, let's just return 0 for reductionPercentage if we can't calculate it relative to something else.
  // Or we could check if files are minified (simple heuristic).
  
  return {
    totalSize: total,
    fileCount: files.length,
    largeFiles: largeFiles.slice(0, 10),
    breakdown,
    totalAssets: {
        original: total,
        reductionPercentage: 0 // Placeholder as this is just analysis of current state
    }
  };
}
