
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import sharp from 'sharp';

export async function optimizeImages(imagesPath: string, apply: boolean): Promise<{
  success: boolean;
  imagesProcessed: number;
  totalOriginalSize: number;
  totalOptimizedSize: number;
  reductionPercentage: string;
  details: Record<string, any>;
}> {
  console.log(`Starting image optimization in ${imagesPath} (Execute: ${apply})`);

  if (!fs.existsSync(imagesPath)) {
    // Return empty results instead of crashing if folder doesn't exist
    return {
        success: false,
        imagesProcessed: 0,
        totalOriginalSize: 0,
        totalOptimizedSize: 0,
        reductionPercentage: '0%',
        details: { error: 'Directory not found' }
    };
  }

  const files = await glob('**/*.{jpg,jpeg,png,gif}', { cwd: imagesPath, absolute: true });
  
  let originalSize = 0;
  let optimizedSize = 0;
  let processed = 0;
  const details: Record<string, any> = {};

  for (const file of files) {
    try {
        const stats = await fs.stat(file);
        originalSize += stats.size;
        
        // Convert to WebP by default for optimization check
        const buffer = await sharp(file)
            .webp({ quality: 80 })
            .toBuffer();
            
        const newSize = buffer.length;
        optimizedSize += newSize;
        processed++;
        
        details[path.basename(file)] = {
            original: stats.size,
            optimized: newSize,
            format: 'webp',
            reduction: ((stats.size - newSize) / stats.size * 100).toFixed(2) + '%'
        };

        if (apply) {
            const parsed = path.parse(file);
            const newPath = path.join(parsed.dir, `${parsed.name}.webp`);
            await fs.writeFile(newPath, buffer);
            // Optionally delete original? detailed plan didn't specify, let's keep it safe.
        }

    } catch (e: any) {
        console.warn(`Failed to process image ${file}:`, e.message);
        details[path.basename(file)] = { error: e.message };
    }
  }

  const reduction = originalSize > 0 
    ? ((originalSize - optimizedSize) / originalSize * 100)
    : 0;

  return {
    success: true,
    imagesProcessed: processed,
    totalOriginalSize: originalSize,
    totalOptimizedSize: optimizedSize,
    reductionPercentage: reduction.toFixed(2) + '%',
    details
  };
}
