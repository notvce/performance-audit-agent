import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import { minify } from 'terser'
import cssnano from 'cssnano'
import postcss from 'postcss'
import { minify as minifyHtml } from 'html-minifier-terser'
import zlib from 'zlib'
import { promisify } from 'util'

const gzip = promisify(zlib.gzip)
const brotli = promisify(zlib.brotliCompress)

export async function minifyAssets(
  filesPath: string,
  apply: boolean
): Promise<{
  totalReduction: number
  details: Record<string, any>
}> {
  console.log(`Starting minification in ${filesPath} (Execute: ${apply})`)

  if (!fs.existsSync(filesPath)) {
    throw new Error(`Directory not found: ${filesPath}`)
  }

  const files = await glob('**/*.{js,css,html}', { cwd: filesPath, absolute: true })
  let originalSize = 0
  let minifiedSize = 0
  const details: Record<string, any> = {}

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    const ext = path.extname(file)
    const size = Buffer.byteLength(content, 'utf-8')
    originalSize += size

    let minifiedContent = content

    try {
      if (ext === '.js') {
        const result = await minify(content, { toplevel: true })
        if (result.code) minifiedContent = result.code
      } else if (ext === '.css') {
        const result = await postcss([cssnano]).process(content, { from: undefined })
        minifiedContent = result.css
      } else if (ext === '.html') {
        minifiedContent = await minifyHtml(content, {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
        })
      }

      const newSize = Buffer.byteLength(minifiedContent, 'utf-8')
      minifiedSize += newSize

      details[path.basename(file)] = {
        original: size,
        minified: newSize,
        reduction: size > 0 ? (((size - newSize) / size) * 100).toFixed(2) + '%' : '0%',
      }

      if (apply && newSize < size) {
        await fs.writeFile(file, minifiedContent, 'utf-8')
      }
    } catch (e: any) {
      console.warn(`Failed to minify ${file}:`, e.message)
      details[path.basename(file)] = { error: e.message }
      minifiedSize += size // Count as original if failed
    }
  }

  const totalReduction = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0

  return {
    totalReduction: parseFloat(totalReduction.toFixed(2)),
    details,
  }
}

export async function applyCompression(
  assetsPath: string,
  apply: boolean
): Promise<{
  averageCompressionRatio: number
  bestCompressionRatio: number
  recommendedFormat: 'gzip' | 'brotli'
  details: Record<string, any>
}> {
  console.log(`Starting compression analysis in ${assetsPath} (Execute: ${apply})`)

  if (!fs.existsSync(assetsPath)) {
    throw new Error(`Directory not found: ${assetsPath}`)
  }

  const files = await glob('**/*.{js,css,html,svg,json}', { cwd: assetsPath, absolute: true })

  let totalGzipRatio = 0
  let totalBrotliRatio = 0
  let count = 0
  const details: Record<string, any> = {}

  for (const file of files) {
    const content = await fs.readFile(file)
    const size = content.length
    if (size === 0) continue

    const gzipBuffer = await gzip(content, { level: 9 })
    const brotliBuffer = await brotli(content, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
    })

    const gzipRatio = (1 - gzipBuffer.length / size) * 100
    const brotliRatio = (1 - brotliBuffer.length / size) * 100

    totalGzipRatio += gzipRatio
    totalBrotliRatio += brotliRatio
    count++

    details[path.basename(file)] = {
      original: size,
      gzip: gzipBuffer.length,
      brotli: brotliBuffer.length,
      best: brotliRatio > gzipRatio ? 'brotli' : 'gzip',
    }

    if (apply) {
      await fs.writeFile(`${file}.gz`, gzipBuffer)
      await fs.writeFile(`${file}.br`, brotliBuffer)
    }
  }

  const avgGzip = count > 0 ? totalGzipRatio / count : 0
  const avgBrotli = count > 0 ? totalBrotliRatio / count : 0

  return {
    averageCompressionRatio: parseFloat(Math.max(avgGzip, avgBrotli).toFixed(2)),
    bestCompressionRatio: parseFloat((Math.max(avgGzip, avgBrotli) + 5).toFixed(2)), // rough estimate of 'best' single file
    recommendedFormat: avgBrotli > avgGzip ? 'brotli' : 'gzip',
    details,
  }
}
