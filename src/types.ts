export interface AuditOptions {
  url: string;
  outputPath: string;
  format: 'html' | 'json' | 'markdown';
  includeLighthouse: boolean;
  includeBundleAnalysis: boolean;
  includeCompression: boolean;
  includeMinification: boolean;
  includeImageOptimization: boolean;
  thresholds?: PerformanceThresholds;
}

export interface PerformanceThresholds {
  performanceScore?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  tti?: number;
  ttfb?: number;
  bundleSize?: number;
}

export interface AuditResult {
  summary: AuditSummary;
  coreWebVitals: CoreWebVitals;
  bundleAnalysis: BundleAnalysis | null;
  compressionResults: CompressionResults | null;
  minificationResults: MinificationResults | null;
  imageOptimizationResults: ImageOptimizationResults | null;
  recommendations: Recommendation[];
  timestamp: string;
  metadata: ProjectMetadata;
}

export interface AuditSummary {
  overallScore: number;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  totalSizeOriginal: number;
  totalSizeOptimized: number;
  totalSizeReduction: number;
  loadTimeOriginal: number;
  loadTimeOptimized: number;
  loadTimeImprovement: number;
  estimatedImpact: string;
}

export interface CoreWebVitals {
  lcp: MetricValue;
  fid: MetricValue;
  cls: MetricValue;
  fcp: MetricValue;
  tti: MetricValue;
  ttfb: MetricValue;
}

export interface MetricValue {
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: number;
}

export interface BundleAnalysis {
  initialJs: BundleSize;
  initialCss: BundleSize;
  totalAssets: BundleSize;
  largestChunk: ChunkInfo;
  codeSplittingOpportunities: string[];
  duplicateDependencies: DuplicateDependency[];
  treeShakingPotential: number;
}

export interface BundleSize {
  original: number;
  minified: number;
  gzipped: number;
  brotli: number;
  reductionPercentage: number;
}

export interface ChunkInfo {
  name: string;
  size: number;
  modules: number;
}

export interface DuplicateDependency {
  name: string;
  version: string;
  instances: number;
  totalSize: number;
}

export interface CompressionResults {
  gzipResults: CompressionMetrics[];
  brotliResults: CompressionMetrics[];
  averageCompressionRatio: number;
  bestCompressionRatio: number;
  recommendedFormat: 'gzip' | 'brotli';
}

export interface CompressionMetrics {
  file: string;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  format: string;
}

export interface MinificationResults {
  javascript: MinificationStats;
  css: MinificationStats;
  html: MinificationStats;
  totalReduction: number;
}

export interface MinificationStats {
  filesProcessed: number;
  originalSize: number;
  minifiedSize: number;
  reductionPercentage: number;
}

export interface ImageOptimizationResults {
  totalImages: number;
  totalSizeOriginal: number;
  totalSizeOptimized: number;
  reductionPercentage: number;
  formatsConverted: FormatConversion[];
  lazyLoadingAdded: number;
}

export interface FormatConversion {
  fromFormat: string;
  toFormat: string;
  filesConverted: number;
  sizeReduction: number;
}

export interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: 'quick-win' | 'moderate' | 'significant';
  estimatedImpact: number;
  codeExample?: string;
}

export interface ProjectMetadata {
  projectType: string;
  languages: string[];
  frameworks: string[];
  buildTool: string;
  nodeVersion?: string;
  timestamp: string;
}

export interface LanguageDetectionResult {
  language: string;
  framework: string;
  buildTool: string;
  files: string[];
  confidence: number;
}