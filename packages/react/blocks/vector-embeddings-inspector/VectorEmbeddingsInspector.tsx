'use client'

import * as React from 'react'
import {
  Binary,
  Check,
  Compass,
  Copy,
  Cpu,
  Database,
  Eye,
  FileCode,
  FileText,
  HardDrive,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface VectorEmbeddingsInspectorProps {
  className?: string
}

interface SearchResultItem {
  id: string
  vectorId: string
  score: number
  cosineDistance: number
  title: string
  namespace: 'docs' | 'blog' | 'api' | 'helpdesk'
  filePath: string
  chunkIndex: number
  totalChunks: number
  tokenCount: number
  updatedAt: string
  snippet: string
  vectorSample: number[]
}

interface DimensionSample {
  index: number
  dimIndex: number
  value: number
  rawDimName: string
}

// Index specifications
const indexMetadata = {
  name: 'kb-docs-embeddings-v3',
  status: 'Index Ready · Sub-10ms p99',
  metric: 'Cosine Similarity',
  dimensionModel: '1536-dim · OpenAI text-embedding-3-small',
  totalVectors: '482,910 Vectors',
  shards: 4,
  replicas: 2,
  engine: 'HNSW Graph (M=16, efConstruction=200)',
  memoryTotal: '3.8 GB RAM',
  hnswMemory: '2.9 GB',
  vectorMemory: '0.9 GB',
  cacheHitRate: 99.4,
  p99Latency: '8.4ms',
  p50Latency: '2.1ms',
  p95Latency: '5.6ms',
  qpsPeak: '1,420 QPS',
  namespacesCount: 4,
}

// Telemetry overview
const telemetryCards = [
  {
    title: 'Total Indexed Vectors',
    value: '482,910',
    subtitle: '+14,280 indexed today',
    badge: '4 Shards Active',
    badgeVariant: 'secondary' as const,
    metricDetails: '100% synchronized · 0 unindexed docs',
    icon: Database,
  },
  {
    title: 'Index Memory Footprint',
    value: '3.8 GB RAM',
    subtitle: 'HNSW: 2.9 GB · Raw Vectors: 0.9 GB',
    badge: '99.4% Cache Hit',
    badgeVariant: 'outline' as const,
    metricDetails: 'Compressed FP16 · Inverted index',
    icon: Cpu,
  },
  {
    title: 'Query Latency (p99)',
    value: '8.4ms',
    subtitle: 'p50: 2.1ms · p95: 5.6ms',
    badge: '1,420 QPS Peak',
    badgeVariant: 'secondary' as const,
    metricDetails: 'Sub-10ms SLA guaranteed',
    icon: Zap,
  },
  {
    title: 'Index Namespaces',
    value: '4 Namespaces',
    subtitle: 'docs, helpdesk, blog, api',
    badge: 'Multi-Tenant',
    badgeVariant: 'outline' as const,
    metricDetails: 'docs: 240k · helpdesk: 118k',
    icon: Layers,
  },
]

// Query presets
const queryPresets = [
  'How do I configure OKLCH color palettes in Tailwind v4?',
  'Vector quantization & memory footprint reduction',
  'Dual-framework Vue and React component sync',
  'Handling cosine distance thresholds for hybrid search',
]

// Query vector 32 float samples (simulated 1536-dim projection)
const queryVectorSample = [
  -0.048, 0.135, 0.092, -0.018, 0.245, -0.11, 0.049, 0.174, -0.082, 0.001, 0.325, -0.059, 0.097, 0.191, -0.149, 0.068,
  -0.024, 0.212, 0.082, -0.094, 0.121, -0.037, 0.156, 0.031, -0.172, 0.099, 0.056, -0.078, 0.195, -0.013, 0.072, 0.141,
]

// Hardcoded search results with full vector dimensions
const allSearchResults: SearchResultItem[] = [
  {
    id: 'res-1',
    vectorId: '#vec_849201',
    score: 0.942,
    cosineDistance: 0.058,
    title: 'Tailwind v4 OKLCH Architecture',
    namespace: 'docs',
    filePath: 'docs/styling/tailwind-v4-oklch.md',
    chunkIndex: 3,
    totalChunks: 8,
    tokenCount: 384,
    updatedAt: '2 hours ago',
    snippet:
      'Tailwind CSS v4 introduces native CSS-first token configuration with `@theme inline` and OKLCH color spaces. In contrast to RGB/HSL, OKLCH ensures perceptually uniform lightness across hues, preventing contrast degradation in dark mode variants while preserving single-source token truth.',
    vectorSample: [
      -0.042, 0.128, 0.089, -0.015, 0.231, -0.104, 0.045, 0.167, -0.078, 0.002, 0.312, -0.054, 0.091, 0.183, -0.142,
      0.063, -0.021, 0.204, 0.077, -0.089, 0.115, -0.034, 0.149, 0.028, -0.165, 0.094, 0.052, -0.073, 0.188, -0.011,
      0.067, 0.134,
    ],
  },
  {
    id: 'res-2',
    vectorId: '#vec_739104',
    score: 0.887,
    cosineDistance: 0.113,
    title: 'Color Tokens Derivation Guide',
    namespace: 'docs',
    filePath: 'docs/tokens/color-derivation.md',
    chunkIndex: 1,
    totalChunks: 5,
    tokenCount: 412,
    updatedAt: '1 day ago',
    snippet:
      'Deriving consistent dark-mode contrasts requires anchoring chroma and shifting lightness along the OKLCH L-axis. Use `--color-primary: oklch(0.65 0.22 260)` for vibrant interactive states and calibrate border contrast with `--color-border: oklch(0.28 0.01 260)` for WCAG AA compliance.',
    vectorSample: [
      -0.038, 0.119, 0.074, -0.029, 0.198, -0.088, 0.032, 0.145, -0.065, 0.018, 0.284, -0.041, 0.082, 0.161, -0.125,
      0.051, -0.015, 0.189, 0.062, -0.075, 0.098, -0.026, 0.131, 0.019, -0.148, 0.081, 0.044, -0.061, 0.162, -0.008,
      0.055, 0.118,
    ],
  },
  {
    id: 'res-3',
    vectorId: '#vec_610482',
    score: 0.824,
    cosineDistance: 0.176,
    title: 'Design Systems Monorepo Guide',
    namespace: 'blog',
    filePath: 'blog/2026/design-systems-monorepo.md',
    chunkIndex: 5,
    totalChunks: 12,
    tokenCount: 526,
    updatedAt: '3 days ago',
    snippet:
      'When architecting a dual-framework registry (Vue + React), shared design tokens must compile cleanly without runtime overhead. We leverage modern CSS custom properties and PostCSS pipelines to mirror CVA component variants across both frameworks with zero extra runtime.',
    vectorSample: [
      -0.015, 0.082, 0.061, -0.045, 0.154, -0.062, 0.021, 0.112, -0.049, 0.034, 0.215, -0.028, 0.064, 0.128, -0.098,
      0.039, -0.008, 0.142, 0.048, -0.058, 0.074, -0.018, 0.099, 0.012, -0.112, 0.062, 0.031, -0.045, 0.124, -0.004,
      0.041, 0.089,
    ],
  },
  {
    id: 'res-4',
    vectorId: '#vec_552109',
    score: 0.768,
    cosineDistance: 0.232,
    title: 'API Embedding Ingestion Pipeline',
    namespace: 'api',
    filePath: 'api/v1/embeddings/ingest-worker.ts',
    chunkIndex: 2,
    totalChunks: 6,
    tokenCount: 340,
    updatedAt: '5 days ago',
    snippet:
      'Batch ingestion pipelines chunk markdown documents at 512-token boundaries with 64-token sliding window overlap before sending to the embedding model endpoint. Vector metadata records store namespace tags, checksum hashes, and parent chunk UUIDs for deterministic cache validation.',
    vectorSample: [
      0.024, 0.051, 0.038, -0.062, 0.112, -0.041, 0.008, 0.078, -0.032, 0.051, 0.162, -0.015, 0.042, 0.094, -0.071,
      0.022, 0.004, 0.105, 0.031, -0.041, 0.052, -0.009, 0.071, 0.005, -0.084, 0.045, 0.019, -0.031, 0.088, 0.002,
      0.028, 0.062,
    ],
  },
  {
    id: 'res-5',
    vectorId: '#vec_419820',
    score: 0.715,
    cosineDistance: 0.285,
    title: 'Troubleshooting Semantic Search Discrepancies',
    namespace: 'helpdesk',
    filePath: 'helpdesk/kb/search-accuracy-faq.md',
    chunkIndex: 4,
    totalChunks: 7,
    tokenCount: 295,
    updatedAt: '1 week ago',
    snippet:
      'When semantic ranking diverges from keyword relevance, verify tokenizer parity between query embedding model and index model. Cosine thresholds below 0.75 should trigger hybrid search fallback using sparse BM25 reranking to recover exact keyword lexical matches.',
    vectorSample: [
      0.042, 0.031, 0.019, -0.078, 0.084, -0.025, -0.005, 0.052, -0.019, 0.068, 0.118, -0.008, 0.028, 0.067, -0.052,
      0.011, 0.015, 0.074, 0.018, -0.029, 0.036, -0.002, 0.048, -0.004, -0.061, 0.029, 0.008, -0.019, 0.061, 0.008,
      0.015, 0.041,
    ],
  },
]

function getNamespaceBadgeClass(namespace: string) {
  switch (namespace) {
    case 'docs':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    case 'blog':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    case 'api':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'helpdesk':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}

function getScoreColorClass(score: number) {
  if (score >= 0.9) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 0.8) return 'text-sky-600 dark:text-sky-400'
  return 'text-amber-600 dark:text-amber-400'
}

function getHeatmapCellClass(val: number, isSelected: boolean) {
  let baseColor = ''
  if (val >= 0.2) {
    baseColor = 'bg-emerald-500/25 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/35'
  } else if (val >= 0.08) {
    baseColor = 'bg-emerald-500/15 border-emerald-500/25 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/25'
  } else if (val >= 0.0) {
    baseColor = 'bg-primary/10 border-primary/20 text-foreground hover:bg-primary/20'
  } else if (val >= -0.08) {
    baseColor = 'bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20'
  } else {
    baseColor = 'bg-rose-500/20 border-rose-500/35 text-rose-900 dark:text-rose-200 hover:bg-rose-500/30'
  }

  const selectedRing = isSelected ? 'ring-2 ring-primary ring-offset-1 ring-offset-background z-10 font-bold' : ''
  return cn(baseColor, selectedRing)
}

export function VectorEmbeddingsInspector({ className }: VectorEmbeddingsInspectorProps) {
  const [searchQuery, setSearchQuery] = React.useState('How do I configure OKLCH color palettes in Tailwind v4?')
  const [topK, setTopK] = React.useState('3')
  const [selectedNamespace, setSelectedNamespace] = React.useState('all')
  const [isSearching, setIsSearching] = React.useState(false)
  const [searchExecutionLatency, setSearchExecutionLatency] = React.useState('3.4ms')
  const [embeddingLatency, setEmbeddingLatency] = React.useState('18.2ms')
  const [copiedVectorId, setCopiedVectorId] = React.useState<string | null>(null)
  const [copiedFloats, setCopiedFloats] = React.useState(false)
  const [rawJsonExpanded, setRawJsonExpanded] = React.useState(false)

  const [activeVisualizerTarget, setActiveVisualizerTarget] = React.useState<'query' | string>('query')
  const [selectedDimensionIndex, setSelectedDimensionIndex] = React.useState<number>(10)

  const visibleResults = React.useMemo(() => {
    let list = allSearchResults
    if (selectedNamespace !== 'all') {
      list = list.filter((r) => r.namespace === selectedNamespace)
    }
    const k = parseInt(topK, 10) || 3
    return list.slice(0, k)
  }, [topK, selectedNamespace])

  const activeVectorData = React.useMemo(() => {
    if (activeVisualizerTarget === 'query') {
      return {
        label: 'Query Embedding Vector (Prompt Projection)',
        vectorId: '#vec_query_input',
        sample: queryVectorSample,
        source: 'OpenAI text-embedding-3-small · Live query tensor',
      }
    }
    const found = allSearchResults.find((r) => r.id === activeVisualizerTarget)
    if (found) {
      return {
        label: `Doc Vector: ${found.title}`,
        vectorId: found.vectorId,
        sample: found.vectorSample,
        source: `${found.namespace} namespace · ${found.filePath}`,
      }
    }
    return {
      label: 'Query Embedding Vector',
      vectorId: '#vec_query_input',
      sample: queryVectorSample,
      source: 'Live query tensor',
    }
  }, [activeVisualizerTarget])

  const dimensionSamples = React.useMemo<DimensionSample[]>(() => {
    const values = activeVectorData.sample
    return values.map((val, idx) => ({
      index: idx,
      dimIndex: idx * 48,
      value: val,
      rawDimName: `dim_${String(idx * 48).padStart(4, '0')}`,
    }))
  }, [activeVectorData])

  const currentDimension = React.useMemo(() => {
    const target = dimensionSamples[selectedDimensionIndex] || dimensionSamples[0]
    const val = target.value
    const absVal = Math.abs(val)
    const maxVal = 0.325
    const magnitudePercent = Math.min(100, Math.round((absVal / maxVal) * 100))
    return {
      ...target,
      magnitudePercent,
      sign: val >= 0 ? 'Positive (+)' : 'Negative (-)',
      activation: absVal > 0.2 ? 'Strong Activation' : absVal > 0.08 ? 'Moderate Activation' : 'Near Zero / Baseline',
    }
  }, [dimensionSamples, selectedDimensionIndex])

  const runSearch = React.useCallback(() => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setSearchExecutionLatency((2.8 + Math.random() * 1.8).toFixed(1) + 'ms')
      setEmbeddingLatency((16.5 + Math.random() * 3.5).toFixed(1) + 'ms')
    }, 320)
  }, [])

  const selectPreset = (preset: string) => {
    setSearchQuery(preset)
    runSearch()
  }

  const copyVectorId = (id: string) => {
    navigator.clipboard?.writeText(id)
    setCopiedVectorId(id)
    setTimeout(() => setCopiedVectorId(null), 2000)
  }

  const copyFloatsArray = () => {
    const jsonStr = JSON.stringify(activeVectorData.sample, null, 2)
    navigator.clipboard?.writeText(jsonStr)
    setCopiedFloats(true)
    setTimeout(() => setCopiedFloats(false), 2000)
  }

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <Card className="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Database className="text-primary size-5" />
                  <h1 className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                    {indexMetadata.name}
                  </h1>
                </div>
                <Badge
                  wrap
                  variant="outline"
                  className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {indexMetadata.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Vector index telemetry, approximate nearest neighbor (ANN) similarity tester, and 1536-dimensional
                tensor inspector.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="gap-1.5 shadow-xs"
                disabled={isSearching}
                onClick={runSearch}
              >
                <RefreshCw className={cn('size-3.5', isSearching && 'animate-spin')} />
                <span>Test Similarity Search</span>
              </Button>
            </div>
          </div>

          {/* Metric Badges Row */}
          <div className="border-border/60 mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
            <Badge wrap variant="outline" className="gap-1 text-xs">
              <Compass className="text-muted-foreground size-3" />
              <span className="text-muted-foreground">Metric:</span>
              <span className="text-foreground font-medium">{indexMetadata.metric}</span>
            </Badge>

            <Badge wrap variant="outline" className="gap-1 text-xs">
              <Cpu className="text-muted-foreground size-3" />
              <span className="text-muted-foreground">Embedding:</span>
              <span className="text-foreground font-medium">{indexMetadata.dimensionModel}</span>
            </Badge>

            <Badge wrap variant="secondary" className="gap-1 text-xs">
              <Binary className="text-muted-foreground size-3" />
              <span className="text-foreground font-semibold tabular-nums">{indexMetadata.totalVectors}</span>
            </Badge>

            <Badge wrap variant="outline" className="gap-1 text-xs">
              <HardDrive className="text-muted-foreground size-3" />
              <span className="text-muted-foreground">Engine:</span>
              <span className="text-foreground font-mono text-xs">{indexMetadata.engine}</span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* 4 Vector Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {telemetryCards.map((card) => {
          const IconComp = card.icon
          return (
            <Card key={card.title} className="border-border bg-card text-card-foreground shadow-xs transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {card.title}
                </CardTitle>
                <IconComp className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{card.value}</span>
                  <Badge wrap variant={card.badgeVariant} className="text-xs">
                    {card.badge}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">{card.subtitle}</p>
                <div className="border-border/60 text-muted-foreground border-t pt-2 text-xs">{card.metricDetails}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Interactive Vector Similarity Search Playground */}
      <Card className="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Search className="text-primary size-4" />
                <CardTitle className="text-base font-semibold">Interactive Similarity Search Playground</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Execute live vector similarity lookups against the HNSW index and inspect cosine distance scores.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Index Latency:</span>
              <span className="text-foreground font-mono font-medium tabular-nums">{searchExecutionLatency}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Search Input & Quick Controls */}
          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter query to vectorize and search..."
                  className="pr-8 pl-9 text-xs sm:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runSearch()
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-0.5 flex size-6 -translate-y-1/2 items-center justify-center text-xs"
                    title="Clear query"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Top-K Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={topK}
                  onValueChange={(val) => {
                    setTopK(val)
                    runSearch()
                  }}
                >
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <SelectValue placeholder="Top K Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Top 3 Results</SelectItem>
                    <SelectItem value="5">Top 5 Results</SelectItem>
                    <SelectItem value="10">Top 10 Results</SelectItem>
                  </SelectContent>
                </Select>

                {/* Namespace Filter */}
                <Select
                  value={selectedNamespace}
                  onValueChange={(val) => {
                    setSelectedNamespace(val)
                    runSearch()
                  }}
                >
                  <SelectTrigger className="h-9 w-40 text-xs">
                    <SelectValue placeholder="Namespace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Namespaces (4)</SelectItem>
                    <SelectItem value="docs">docs (240k)</SelectItem>
                    <SelectItem value="blog">blog (84k)</SelectItem>
                    <SelectItem value="api">api (40k)</SelectItem>
                    <SelectItem value="helpdesk">helpdesk (118k)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="default"
                  size="sm"
                  className="h-9 gap-1.5 shadow-xs"
                  disabled={isSearching || !searchQuery}
                  onClick={runSearch}
                >
                  {!isSearching ? <Sparkles className="size-3.5" /> : <RefreshCw className="size-3.5 animate-spin" />}
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>

            {/* Query Preset Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground text-xs font-medium">Try Query:</span>
              {queryPresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  className="h-auto min-h-6 max-w-full rounded-full px-2.5 py-1 text-left text-xs whitespace-normal"
                  onClick={() => selectPreset(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>

          {/* Query Vectorization Banner */}
          <div className="border-border/60 bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Binary className="text-primary size-4 shrink-0" />
              <div>
                <span className="text-foreground font-medium">Query Vector Generated:</span>
                <span className="text-muted-foreground ml-1">
                  Vectorized in{' '}
                  <span className="text-foreground font-mono font-medium tabular-nums">{embeddingLatency}</span> via{' '}
                  <code className="text-foreground font-mono">text-embedding-3-small</code> (1536 float32 values)
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setActiveVisualizerTarget('query')}
            >
              <Eye className="size-3" />
              <span>Inspect Query Vector</span>
            </Button>
          </div>

          <Separator />

          {/* Search Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                Similarity Search Results ({visibleResults.length} matches)
              </h3>
              <span className="text-muted-foreground text-xs">
                Metric: <span className="text-foreground font-medium">Cosine Similarity</span> · Threshold &ge; 0.70
              </span>
            </div>

            <div className="space-y-3">
              {visibleResults.map((result, index) => (
                <div
                  key={result.id}
                  className="border-border bg-card/60 hover:bg-accent/10 relative rounded-lg border p-4 shadow-xs transition-colors"
                >
                  <div className="flex flex-col gap-3">
                    {/* Top metadata row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge wrap variant="secondary" className="font-mono text-xs font-semibold">
                          #{index + 1}
                        </Badge>
                        <h4 className="text-foreground text-sm font-semibold tracking-tight">{result.title}</h4>
                        <Badge
                          variant="outline"
                          className={cn('text-xs font-medium capitalize', getNamespaceBadgeClass(result.namespace))}
                        >
                          {result.namespace}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Badge wrap variant="outline" className="text-muted-foreground font-mono text-xs">
                            {result.vectorId}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground size-6 p-0"
                            title="Copy Vector ID"
                            onClick={() => copyVectorId(result.vectorId)}
                          >
                            {copiedVectorId === result.vectorId ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Cosine Similarity:</span>
                          <span
                            className={cn('font-mono text-sm font-bold tabular-nums', getScoreColorClass(result.score))}
                          >
                            {result.score.toFixed(3)}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 border-l pl-3">
                          <span>Distance:</span>
                          <span className="text-foreground font-mono font-medium tabular-nums">
                            {result.cosineDistance.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match score bar */}
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex justify-between text-xs">
                        <span>Similarity Match</span>
                        <span className="font-mono font-medium tabular-nums">{(result.score * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={result.score * 100} className="h-1.5" />
                    </div>

                    {/* Chunk text snippet */}
                    <div className="bg-muted/30 border-border/60 text-foreground rounded-md border p-2.5 text-xs leading-relaxed">
                      <p className="text-muted-foreground mb-1 font-mono text-xs italic">
                        Chunk #{result.chunkIndex} of {result.totalChunks} · {result.filePath}
                      </p>
                      <p>{result.snippet}</p>
                    </div>

                    {/* Bottom action row */}
                    <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FileText className="size-3" />
                          {result.tokenCount} tokens
                        </span>
                        <span>•</span>
                        <span>Updated {result.updatedAt}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => setActiveVisualizerTarget(result.id)}
                      >
                        <Eye className="size-3" />
                        <span>Inspect 1536-Dim Heatmap</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vector Dimension Array Visualizer */}
      <Card className="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Binary className="text-primary size-4" />
                <CardTitle className="text-base font-semibold">Vector Dimension Array Visualizer</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Visual color-coded 32-sample heatmap of the 1536 float values. Select dimensions to inspect activation
                magnitude.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={copyFloatsArray}>
                {copiedFloats ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{copiedFloats ? 'Copied Array' : 'Copy Sample Floats'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setRawJsonExpanded((prev) => !prev)}
              >
                <FileCode className="size-3.5" />
                <span>{rawJsonExpanded ? 'Hide Raw JSON' : 'View Raw Floats'}</span>
              </Button>
            </div>
          </div>

          {/* Target Vector Selector Tabs */}
          <div className="border-border/60 mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3">
            <span className="text-muted-foreground mr-1 text-xs font-medium">Inspecting:</span>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-7 rounded-md text-xs',
                activeVisualizerTarget === 'query' &&
                  'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
              )}
              onClick={() => setActiveVisualizerTarget('query')}
            >
              Query Vector
            </Button>
            {visibleResults.map((res, idx) => (
              <Button
                key={res.id}
                variant="outline"
                size="sm"
                className={cn(
                  'h-7 rounded-md font-mono text-xs',
                  activeVisualizerTarget === res.id &&
                    'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                )}
                onClick={() => setActiveVisualizerTarget(res.id)}
              >
                #{idx + 1} {res.vectorId}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Target Vector Metadata Banner */}
          <div className="border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-xs">
            <div>
              <div className="text-foreground font-semibold">{activeVectorData.label}</div>
              <div className="text-muted-foreground font-mono text-xs">{activeVectorData.source}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <div>
                <span className="text-muted-foreground">L2 Norm:</span>{' '}
                <span className="text-foreground font-semibold">1.0000 (Unit)</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dimensions:</span>{' '}
                <span className="text-foreground font-semibold">1,536 floats</span>
              </div>
              <div>
                <span className="text-muted-foreground">Format:</span>{' '}
                <span className="text-foreground font-semibold">FP32 Dense</span>
              </div>
            </div>
          </div>

          {/* 32-Sample Heatmap Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Sampled 32 Float Dimensions (1 of every 48 tensor indices):
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-xs bg-rose-500/80" />
                  <span className="text-muted-foreground">&lt; -0.10</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-xs bg-amber-500/80" />
                  <span className="text-muted-foreground">-0.05</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-primary/40 inline-block size-2 rounded-xs" />
                  <span className="text-muted-foreground">~0.00</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-xs bg-emerald-500/80" />
                  <span className="text-muted-foreground">&gt; +0.10</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 md:grid-cols-16">
              {dimensionSamples.map((sample) => (
                <button
                  key={sample.index}
                  type="button"
                  className={cn(
                    'group flex cursor-pointer flex-col items-center justify-center rounded-md border p-1.5 text-center transition-all select-none',
                    getHeatmapCellClass(sample.value, selectedDimensionIndex === sample.index),
                  )}
                  onClick={() => setSelectedDimensionIndex(sample.index)}
                >
                  <span className="text-muted-foreground font-mono text-xs leading-tight">
                    d{String(sample.dimIndex).padStart(4, '0')}
                  </span>
                  <span className="font-mono text-xs leading-tight font-semibold tabular-nums">
                    {sample.value >= 0 ? '+' : ''}
                    {sample.value.toFixed(3)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Dimension Deep Dive Inspector */}
          <div className="border-border/80 bg-card rounded-lg border p-4 shadow-xs">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge wrap variant="outline" className="font-mono text-xs font-semibold">
                    {currentDimension.rawDimName}
                  </Badge>
                  <span className="text-foreground text-sm font-semibold">
                    Dimension #{currentDimension.dimIndex} / 1536
                  </span>
                  <Badge wrap variant="secondary" className="text-xs">
                    {currentDimension.activation}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Tensor index <code className="font-mono">{currentDimension.rawDimName}</code> mapped from
                  1536-dimensional OpenAI text-embedding-3-small vector space.
                </p>
              </div>

              {/* Metric stats of the selected dimension */}
              <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
                <div className="bg-muted/40 rounded-md border px-3 py-1.5">
                  <div className="text-muted-foreground text-xs">Float Value</div>
                  <div className="text-foreground text-sm font-bold tabular-nums">
                    {currentDimension.value >= 0 ? '+' : ''}
                    {currentDimension.value.toFixed(6)}
                  </div>
                </div>
                <div className="bg-muted/40 rounded-md border px-3 py-1.5">
                  <div className="text-muted-foreground text-xs">Relative Magnitude</div>
                  <div className="text-foreground text-sm font-bold tabular-nums">
                    {currentDimension.magnitudePercent}%
                  </div>
                </div>
                <div className="bg-muted/40 rounded-md border px-3 py-1.5">
                  <div className="text-muted-foreground text-xs">Sign / Polarity</div>
                  <div className="text-foreground text-sm font-bold">{currentDimension.sign}</div>
                </div>
              </div>
            </div>

            {/* Magnitude bar */}
            <div className="mt-3 space-y-1">
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Dimension Activation Magnitude vs Max Dimension (+0.325)</span>
                <span className="font-mono font-medium">{currentDimension.magnitudePercent}%</span>
              </div>
              <Progress value={currentDimension.magnitudePercent} className="h-2" />
            </div>
          </div>

          {/* Raw JSON Array Drawer (Collapsible) */}
          {rawJsonExpanded && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium">Raw FP32 Float Array (32 Sample Tensor):</div>
              <pre className="bg-muted/60 border-border/80 text-foreground overflow-x-auto rounded-lg border p-3 font-mono text-xs leading-relaxed">
                <code>{JSON.stringify(activeVectorData.sample, null, 2)}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VectorEmbeddingsInspector
