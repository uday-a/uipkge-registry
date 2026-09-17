'use client'

import * as React from 'react'
import {
  BookOpen,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  Database,
  FileCode,
  Filter,
  Layers,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Workflow,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export interface RagPipelineVisualizerProps {
  className?: string
}

interface PipelineStage {
  id: number
  name: string
  subtitle: string
  latency: string
  durationMs: number
  status: 'completed' | 'active' | 'queued' | 'bypassed'
  icon: React.ElementType
  tag: string
  details: {
    description: string
    metrics: { label: string; value: string }[]
    codeOrData?: { title: string; content: string }
  }
}

interface RetrievedChunk {
  id: string
  citationIndex: number
  relevanceScore: number
  rerankBoost: number
  cosineScore: number
  bm25Score: number
  documentPath: string
  namespace: string
  chunkOffset: string
  tokenCount: number
  updatedAgo: string
  title: string
  snippetPrefix: string
  highlightedText: string
  snippetSuffix: string
  fullSnippet: string
}

const presetQueries = [
  'How do I configure OKLCH color palettes in Tailwind v4 with UIPKGE?',
  'Cross-Encoder vs Bi-Encoder reranker score calibration',
  'HyDE prompt expansion for zero-shot semantic retrieval',
  'Pinecone HNSW index tuning: efSearch & M parameter tradeoffs',
]

const allChunks: RetrievedChunk[] = [
  {
    id: 'chunk-1',
    citationIndex: 1,
    relevanceScore: 0.942,
    rerankBoost: 0.142,
    cosineScore: 0.8,
    bm25Score: 0.785,
    documentPath: 'docs/styling/tailwind-v4-oklch.md',
    namespace: 'docs',
    chunkOffset: 'Chunk #3 · Lines 42–78',
    tokenCount: 384,
    updatedAgo: '2 hours ago',
    title: 'Tailwind v4 OKLCH Architecture & @theme Configuration',
    snippetPrefix: 'Tailwind CSS v4 introduces native CSS-first token configuration with ',
    highlightedText:
      '@theme inline and OKLCH color spaces. In contrast to RGB/HSL, OKLCH ensures perceptually uniform lightness across hues',
    snippetSuffix:
      ', preventing contrast degradation in dark mode variants while preserving single-source token truth.',
    fullSnippet:
      'Tailwind CSS v4 introduces native CSS-first token configuration with `@theme inline` and OKLCH color spaces. In contrast to RGB/HSL, OKLCH ensures perceptually uniform lightness across hues, preventing contrast degradation in dark mode variants while preserving single-source token truth.',
  },
  {
    id: 'chunk-2',
    citationIndex: 2,
    relevanceScore: 0.887,
    rerankBoost: 0.095,
    cosineScore: 0.792,
    bm25Score: 0.71,
    documentPath: 'docs/tokens/color-derivation.md',
    namespace: 'docs',
    chunkOffset: 'Chunk #1 · Lines 1–36',
    tokenCount: 412,
    updatedAgo: '1 day ago',
    title: 'Color Tokens Derivation & Contrast Calibration',
    snippetPrefix: 'Deriving consistent dark-mode contrasts requires ',
    highlightedText:
      'anchoring chroma and shifting lightness along the OKLCH L-axis. Use --color-primary: oklch(0.65 0.22 260) for vibrant interactive states',
    snippetSuffix:
      ' and calibrate border contrast with `--color-border: oklch(0.28 0.01 260)` for WCAG AA compliance across both frameworks.',
    fullSnippet:
      'Deriving consistent dark-mode contrasts requires anchoring chroma and shifting lightness along the OKLCH L-axis. Use `--color-primary: oklch(0.65 0.22 260)` for vibrant interactive states and calibrate border contrast with `--color-border: oklch(0.28 0.01 260)` for WCAG AA compliance across both frameworks.',
  },
  {
    id: 'chunk-3',
    citationIndex: 3,
    relevanceScore: 0.824,
    rerankBoost: 0.048,
    cosineScore: 0.776,
    bm25Score: 0.65,
    documentPath: 'blog/2026/design-systems-monorepo.md',
    namespace: 'blog',
    chunkOffset: 'Chunk #5 · Lines 112–164',
    tokenCount: 526,
    updatedAgo: '3 days ago',
    title: 'Dual-Framework Component Registry Architecture',
    snippetPrefix: 'When architecting a dual-framework registry (Vue + React), ',
    highlightedText:
      'shared design tokens must compile cleanly without runtime overhead. We leverage CSS custom properties to mirror CVA component variants',
    snippetSuffix: ' across both frameworks with zero extra runtime.',
    fullSnippet:
      'When architecting a dual-framework registry (Vue + React), shared design tokens must compile cleanly without runtime overhead. We leverage modern CSS custom properties and PostCSS pipelines to mirror CVA component variants across both frameworks with zero extra runtime.',
  },
]

export function RagPipelineVisualizer({ className }: RagPipelineVisualizerProps) {
  const [currentQuery, setCurrentQuery] = React.useState(
    'How do I configure OKLCH color palettes in Tailwind v4 with UIPKGE?',
  )
  const [topK, setTopK] = React.useState(3)
  const [rerankerEnabled, setRerankerEnabled] = React.useState(true)
  const [selectedStageId, setSelectedStageId] = React.useState<number>(3)
  const [isExecuting, setIsExecuting] = React.useState(false)
  const [copiedChunkId, setCopiedChunkId] = React.useState<string | null>(null)
  const [copiedResponse, setCopiedResponse] = React.useState(false)
  const [copiedTrace, setCopiedTrace] = React.useState(false)
  const [activeCitationHover, setActiveCitationHover] = React.useState<number | null>(null)
  const [showTraceJson, setShowTraceJson] = React.useState(false)
  const [userFeedback, setUserFeedback] = React.useState<'up' | 'down' | null>(null)

  const stages = React.useMemo<PipelineStage[]>(
    () => [
      {
        id: 1,
        name: '1. User Query & HyDE Expansion',
        subtitle: 'Query rewritten with hypothetical document embedding · 42ms',
        latency: '42ms',
        durationMs: 42,
        status: 'completed',
        icon: Sparkles,
        tag: 'Prompt Rewriting',
        details: {
          description:
            'Generates a synthetic hypothetical answer using Claude 3.5 Haiku to bridge vocabulary mismatch between conversational queries and technical documentation.',
          metrics: [
            { label: 'Expansion Model', value: 'Claude 3.5 Haiku' },
            { label: 'Latency', value: '42ms' },
            { label: 'Prompt Tokens', value: '48 tokens' },
            { label: 'Hypothesis Length', value: '112 tokens' },
          ],
          codeOrData: {
            title: 'Generated Hypothetical Document (HyDE)',
            content:
              'Tailwind CSS v4 defines color tokens using CSS variables inside `@theme inline` with `oklch(L C H)` functions. In dual-framework component registries like UIPKGE, OKLCH ensures uniform perceptual lightness across hue shifts in light and dark variants without breaking WCAG AA contrast.',
          },
        },
      },
      {
        id: 2,
        name: '2. Hybrid Dense + Sparse Search',
        subtitle: 'Dense Cosine + BM25 Lexical search across 480k chunks · 64ms',
        latency: '64ms',
        durationMs: 64,
        status: 'completed',
        icon: Database,
        tag: 'Reciprocal Rank Fusion',
        details: {
          description:
            'Performs vector similarity search on 1536-dim embeddings combined with sparse BM25 keyword matching across 482,910 document chunks.',
          metrics: [
            { label: 'Vector Index', value: 'Pinecone Serverless (HNSW)' },
            { label: 'Dimension', value: '1536-dim (text-embedding-3-small)' },
            { label: 'Fusion Weight', value: 'α = 0.70 Dense + 0.30 Sparse' },
            { label: 'Candidate Pool', value: '20 Candidate Chunks' },
          ],
          codeOrData: {
            title: 'Dense Vector Projection (32-float slice)',
            content:
              '[-0.048, 0.135, 0.092, -0.018, 0.245, -0.110, 0.049, 0.174, -0.082, 0.001, 0.325, -0.059, 0.097, 0.191, -0.149, 0.068, -0.024, 0.212, 0.082, -0.094, 0.121, -0.037, 0.156, 0.031, -0.172, 0.099, 0.056, -0.078, 0.195, -0.013, 0.072, 0.141]',
          },
        },
      },
      {
        id: 3,
        name: '3. Cross-Encoder Reranker',
        subtitle: rerankerEnabled
          ? 'Cohere Rerank v3: re-scores Top 20 -> Top 3 · 28ms'
          : 'Bypassed (Using raw hybrid search ranking) · 0ms',
        latency: rerankerEnabled ? '28ms' : '0ms',
        durationMs: rerankerEnabled ? 28 : 0,
        status: rerankerEnabled ? 'completed' : 'bypassed',
        icon: Filter,
        tag: rerankerEnabled ? 'Cross-Attention Re-Scoring' : 'Bypassed',
        details: {
          description: rerankerEnabled
            ? 'Applies deep transformer cross-attention to score query-document pairs simultaneously, eliminating false-positive semantic matches.'
            : 'Reranker is currently bypassed. Chunks are ordered purely by initial hybrid reciprocal rank scores.',
          metrics: [
            { label: 'Model', value: 'cohere-rerank-v3.0-multilingual' },
            { label: 'Top-K Retained', value: `Top ${topK} of 20` },
            { label: 'Relevance Cutoff', value: '≥ 0.800 score' },
            { label: 'Max Rank Shift', value: '+3 positions (Chunk #3)' },
          ],
          codeOrData: {
            title: 'Reranker Score Calibration Delta',
            content:
              'Chunk #1: 0.800 (Cosine) -> 0.942 (Rerank)  [+0.142 boost]\nChunk #2: 0.792 (Cosine) -> 0.887 (Rerank)  [+0.095 boost]\nChunk #3: 0.776 (Cosine) -> 0.824 (Rerank)  [+0.048 boost]\n17 candidates pruned below 0.800 relevance threshold',
          },
        },
      },
      {
        id: 4,
        name: '4. Context Window Assembly',
        subtitle: '1,248 tokens packed, 98% prompt density · 8ms',
        latency: '8ms',
        durationMs: 8,
        status: 'completed',
        icon: Layers,
        tag: 'Token Packaging',
        details: {
          description:
            'Deduplicates overlapping chunk boundaries, injects citation boundary anchors `[1]`, `[2]`, `[3]`, and formats system directives for zero-hallucination grounding.',
          metrics: [
            { label: 'Window Budget', value: '1,248 / 8,192 tokens (15.2%)' },
            { label: 'Prompt Density', value: '98.4% relevance tokens' },
            { label: 'Chunks Packaged', value: `${Math.min(topK, 3)} chunks` },
            { label: 'Delimiter Format', value: '<context_document_id>' },
          ],
          codeOrData: {
            title: 'Assembled Prompt Context Envelope',
            content:
              '<system>\nYou are a Lead Design Systems Architect. Synthesize answers strictly from provided context chunks.\nAlways ground every technical claim with an inline citation key [1], [2], or [3].\n</system>\n\n<context>\n[1] doc: docs/styling/tailwind-v4-oklch.md (score: 0.942)\n[2] doc: docs/tokens/color-derivation.md (score: 0.887)\n[3] doc: blog/2026/design-systems-monorepo.md (score: 0.824)\n</context>',
          },
        },
      },
      {
        id: 5,
        name: '5. LLM Synthesis & Grounding',
        subtitle: 'Claude 3.5 Sonnet streaming generation · 820ms',
        latency: '820ms',
        durationMs: 820,
        status: 'completed',
        icon: Bot,
        tag: 'Streaming Synthesis',
        details: {
          description:
            'Generates final structured markdown answer with streaming tokens, verifies every claim against citation sources, and produces grounded output.',
          metrics: [
            { label: 'Model', value: 'claude-3-5-sonnet-20241022' },
            { label: 'Time to First Token', value: '180ms' },
            { label: 'Generation Speed', value: '68.2 tokens/sec' },
            { label: 'Grounding Verification', value: '100% (3/3 facts grounded)' },
          ],
          codeOrData: {
            title: 'Telemetry & Cost Summary',
            content:
              'Prompt Tokens: 1,248 ($0.00374)\nCompletion Tokens: 214 ($0.00064)\nTotal Cost: $0.00438\nHallucination Detection: 0 violations detected',
          },
        },
      },
    ],
    [rerankerEnabled, topK],
  )

  const displayedChunks = React.useMemo(() => {
    const count = Math.min(Math.max(1, topK), allChunks.length)
    return allChunks.slice(0, count)
  }, [topK])

  const currentStage = stages.find((s) => s.id === selectedStageId) ?? stages[0]

  const totalPipelineLatency = React.useMemo(() => {
    const sum = stages.reduce((acc, s) => acc + s.durationMs, 0)
    return `${sum}ms`
  }, [stages])

  const traceJson = React.useMemo(() => {
    return JSON.stringify(
      {
        traceId: 'trc_rag_948201a4',
        pipeline: 'enterprise_knowledge_rag_v3',
        timestamp: new Date().toISOString(),
        query: currentQuery,
        config: {
          embeddingModel: 'text-embedding-3-small',
          dimensions: 1536,
          vectorDb: 'Pinecone Serverless',
          topK: topK,
          reranker: rerankerEnabled ? 'cohere-rerank-v3' : 'none',
          alphaFusion: 0.7,
        },
        stages: stages.map((s) => ({
          id: s.id,
          name: s.name,
          durationMs: s.durationMs,
          status: s.status,
        })),
        retrievedChunks: displayedChunks.map((c) => ({
          citation: c.citationIndex,
          docPath: c.documentPath,
          relevance: rerankerEnabled ? c.relevanceScore : c.cosineScore,
          rerankBoost: rerankerEnabled ? c.rerankBoost : 0,
          tokenCount: c.tokenCount,
        })),
        synthesis: {
          model: 'claude-3-5-sonnet-20241022',
          promptTokens: 1248,
          completionTokens: 214,
          groundedFactRatio: 1.0,
          latencyMs: 820,
        },
      },
      null,
      2,
    )
  }, [currentQuery, topK, rerankerEnabled, stages, displayedChunks])

  const handleRunPipeline = () => {
    if (isExecuting) return
    setIsExecuting(true)
    setSelectedStageId(1)

    setTimeout(() => {
      setSelectedStageId(2)
    }, 200)

    setTimeout(() => {
      setSelectedStageId(3)
    }, 450)

    setTimeout(() => {
      setSelectedStageId(4)
    }, 700)

    setTimeout(() => {
      setSelectedStageId(5)
      setIsExecuting(false)
    }, 950)
  }

  const handleSelectPreset = (preset: string) => {
    setCurrentQuery(preset)
    handleRunPipeline()
  }

  const handleCopyChunk = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedChunkId(id)
    setTimeout(() => {
      setCopiedChunkId(null)
    }, 2000)
  }

  const handleCopyResponse = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedResponse(true)
    setTimeout(() => {
      setCopiedResponse(false)
    }, 2000)
  }

  const handleCopyTrace = () => {
    navigator.clipboard.writeText(traceJson)
    setCopiedTrace(true)
    setTimeout(() => {
      setCopiedTrace(false)
    }, 2000)
  }

  return (
    <div className={cn('w-full space-y-6 font-sans', className)}>
      {/* 1. Pipeline Header */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                  <Workflow className="size-4.5" />
                </div>
                <h2 className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                  enterprise_knowledge_rag_v3
                </h2>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
                  Pipeline Active
                </Badge>
                <Badge variant="secondary" className="font-mono text-xs">
                  p99 {totalPipelineLatency}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Production Retrieval-Augmented Generation pipeline with HyDE query rewriting, hybrid reciprocal rank
                fusion, and cross-encoder validation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shadow-xs"
                onClick={() => setShowTraceJson(!showTraceJson)}
              >
                <FileCode className="size-4" />
                <span>{showTraceJson ? 'Hide Trace' : 'Export Trace JSON'}</span>
              </Button>
              <Button size="sm" className="gap-1.5 shadow-xs" disabled={isExecuting} onClick={handleRunPipeline}>
                {isExecuting ? (
                  <RefreshCw className="size-4 motion-safe:animate-spin" />
                ) : (
                  <Play className="size-4 fill-current" />
                )}
                <span>{isExecuting ? 'Executing Pipeline...' : 'Test Query Pipeline'}</span>
              </Button>
            </div>
          </div>

          {/* Pipeline Metadata Specs Bar */}
          <div className="border-border mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-xs sm:grid-cols-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <Cpu className="text-primary size-3.5 shrink-0" />
              <span className="truncate">
                <strong className="text-foreground font-medium">Embedding:</strong> OpenAI text-embedding-3-small ·
                1536-dim
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Database className="text-primary size-3.5 shrink-0" />
              <span className="truncate">
                <strong className="text-foreground font-medium">Vector DB:</strong> Pinecone Serverless · HNSW
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Layers className="text-primary size-3.5 shrink-0" />
              <span className="truncate">
                <strong className="text-foreground font-medium">Index Space:</strong> 482,910 chunks · 4 namespaces
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
              <span className="truncate">
                <strong className="text-foreground font-medium">Grounding:</strong> 100% strict context citation
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Optional Trace JSON Drawer */}
      {showTraceJson && (
        <Card className="border-border bg-card/95 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="text-primary size-4" />
                <CardTitle className="text-sm font-medium">OpenTelemetry Pipeline Execution Trace</CardTitle>
              </div>
              <Button variant="ghost" size="xs" className="gap-1" onClick={handleCopyTrace}>
                {copiedTrace ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{copiedTrace ? 'Copied JSON' : 'Copy Trace'}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/70 text-foreground max-h-64 overflow-x-auto rounded-md p-3 font-mono text-xs">
              {traceJson}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* 2. Query Input & Runtime Controls Bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="rag-query-input-react"
                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
              >
                Interactive Test Query
              </label>
              <span className="text-muted-foreground text-xs">Press Enter or click Test Query to simulate</span>
            </div>

            <div className="relative flex items-center">
              <Input
                id="rag-query-input-react"
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunPipeline()
                }}
                className="pr-20 text-sm font-medium shadow-xs"
                placeholder="Enter search prompt or technical query..."
                prefixIcon={<Search className="text-muted-foreground size-4" />}
              />
              <Button size="xs" className="absolute right-1.5 gap-1" disabled={isExecuting} onClick={handleRunPipeline}>
                <Zap className="size-3" />
                <span>Run</span>
              </Button>
            </div>
          </div>

          {/* Query Presets Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">Presets:</span>
            {presetQueries.map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(
                  'focus-visible:ring-ring min-h-6 cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-hidden',
                  currentQuery === preset
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => handleSelectPreset(preset)}
              >
                {preset}
              </button>
            ))}
          </div>

          <Separator />

          {/* Controls Toolbar: Top-K Slider + Reranker Switch + Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Top-K Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="text-primary size-3.5" />
                  <span className="text-foreground text-xs font-medium">Top-K Chunks</span>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  Top {topK} Chunks
                </Badge>
              </div>
              <Slider
                value={[topK]}
                min={1}
                max={3}
                step={1}
                tooltip={false}
                className="w-full"
                onValueChange={(val) => setTopK(val[0])}
              />
              <div className="text-muted-foreground flex justify-between font-mono text-xs">
                <span>k=1</span>
                <span>k=2</span>
                <span>k=3</span>
              </div>
            </div>

            {/* Reranker Toggle */}
            <div className="border-border/80 bg-muted/20 flex flex-col justify-between space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Filter className="text-primary size-3.5" />
                    <span className="text-foreground text-xs font-semibold">Cohere Rerank v3</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Cross-encoder contextual re-scoring</p>
                </div>
                <Switch checked={rerankerEnabled} onCheckedChange={setRerankerEnabled} />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={rerankerEnabled ? 'outline' : 'secondary'}
                  className={cn(
                    'font-mono text-xs',
                    rerankerEnabled
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground',
                  )}
                >
                  {rerankerEnabled ? 'Active (+0.142 boost)' : 'Bypassed (Cosine only)'}
                </Badge>
              </div>
            </div>

            {/* Pipeline Telemetry Overview */}
            <div className="border-border/80 bg-muted/20 flex flex-col justify-between space-y-1.5 rounded-lg border p-3 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-xs font-semibold">Execution Latency</span>
                <span className="text-primary font-mono text-xs font-medium">{totalPipelineLatency} total</span>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>Dense + BM25</span>
                  <span className="font-mono">106ms</span>
                </div>
                <Progress value={15} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>LLM Synthesis</span>
                  <span className="font-mono">820ms (85%)</span>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Interactive RAG 5-Stage Architecture Flow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              RAG Pipeline Execution Graph
            </h3>
            <p className="text-muted-foreground text-xs">
              Click any stage node to inspect low-level telemetry, prompt variables, and intermediate embeddings.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            5 Connected Stages
          </Badge>
        </div>

        {/* 5-Stage Connected Cards */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage) => {
            const Icon = stage.icon
            const isSelected = selectedStageId === stage.id
            return (
              <div
                key={stage.id}
                className={cn(
                  'group focus-visible:ring-ring relative flex cursor-pointer flex-col justify-between rounded-lg border p-3.5 transition-all focus-visible:ring-2 focus-visible:outline-hidden',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-primary/40 shadow-xs ring-1'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30',
                )}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedStageId(stage.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedStageId(stage.id)
                  }
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'flex size-7 items-center justify-center rounded-md text-xs font-semibold',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground group-hover:bg-primary/20 group-hover:text-primary',
                      )}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'font-mono text-xs',
                        stage.status === 'bypassed' && 'text-muted-foreground line-through opacity-70',
                      )}
                    >
                      {stage.latency}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-foreground text-xs leading-tight font-semibold">{stage.name}</p>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">{stage.subtitle}</p>
                  </div>
                </div>

                <div className="border-border/60 text-muted-foreground mt-3 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="truncate font-medium">{stage.tag}</span>
                  <ChevronRight
                    className={cn(
                      'size-3.5 transition-transform',
                      isSelected ? 'text-primary translate-x-0.5' : 'text-muted-foreground',
                    )}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Stage Detail Drill-down Panel */}
        <Card className="border-border bg-card/60 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  {React.createElement(currentStage.icon, { className: 'size-4' })}
                </div>
                <div>
                  <CardTitle className="text-foreground text-sm font-semibold">
                    {currentStage.name} — Inspector
                  </CardTitle>
                  <CardDescription className="text-xs">{currentStage.details.description}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="w-fit font-mono text-xs">
                Stage {currentStage.id} of 5 · {currentStage.latency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Metrics Grid for Stage */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {currentStage.details.metrics.map((metric) => (
                <div key={metric.label} className="border-border/80 bg-muted/40 rounded-md border p-2.5">
                  <p className="text-muted-foreground text-xs">{metric.label}</p>
                  <p className="text-foreground mt-0.5 truncate font-mono text-xs font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Code or Data Artifact Preview */}
            {currentStage.details.codeOrData && (
              <div className="space-y-1.5">
                <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="text-primary size-3.5" />
                    {currentStage.details.codeOrData.title}
                  </span>
                  <span className="font-mono text-xs">read-only buffer</span>
                </div>
                <pre className="bg-muted/80 text-foreground max-h-40 overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {currentStage.details.codeOrData.content}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Retrieved Context Chunks Inspector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Retrieved Context Chunks ({displayedChunks.length} Active Chunks)
            </h3>
            <p className="text-muted-foreground text-xs">
              Ranked by cross-encoder relevance score. Keyword spans matching user intent are highlighted.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              Fusion: Dense (70%) + Sparse (30%)
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {displayedChunks.map((chunk) => (
            <Card
              key={chunk.id}
              className={cn(
                'border-border bg-card shadow-xs transition-all',
                activeCitationHover === chunk.citationIndex && 'border-primary/80 ring-primary/20 bg-primary/5 ring-2',
              )}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Citation Badge Pill */}
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-md font-mono text-xs font-bold transition-colors',
                        activeCitationHover === chunk.citationIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground',
                      )}
                    >
                      [{chunk.citationIndex}]
                    </span>

                    {/* Relevancy Score Badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        'font-mono text-xs font-semibold',
                        chunk.relevanceScore >= 0.9
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : chunk.relevanceScore >= 0.85
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
                      )}
                    >
                      Score: {rerankerEnabled ? chunk.relevanceScore.toFixed(3) : chunk.cosineScore.toFixed(3)}
                    </Badge>

                    {/* Rerank Delta Badge */}
                    {rerankerEnabled && (
                      <Badge variant="secondary" className="text-muted-foreground font-mono text-xs">
                        +{chunk.rerankBoost.toFixed(3)} boost (Rank #{chunk.citationIndex})
                      </Badge>
                    )}

                    {/* Document Path */}
                    <span className="text-foreground font-mono text-xs font-medium">{chunk.documentPath}</span>
                  </div>

                  {/* Metadata & Copy Action */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
                      {chunk.chunkOffset} · {chunk.tokenCount} tok
                    </span>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-muted-foreground hover:text-foreground gap-1"
                      onClick={() => handleCopyChunk(chunk.id, chunk.fullSnippet)}
                    >
                      {copiedChunkId === chunk.id ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span className="text-xs">{copiedChunkId === chunk.id ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                {/* Chunk Text with Highlighted Spans */}
                <div className="border-border/70 bg-muted/40 text-foreground rounded-md border p-3 font-mono text-xs leading-relaxed">
                  <span>{chunk.snippetPrefix}</span>
                  <mark className="bg-primary/20 text-primary dark:bg-primary/30 rounded px-1 py-0.5 font-semibold">
                    {chunk.highlightedText}
                  </mark>
                  <span>{chunk.snippetSuffix}</span>
                </div>

                {/* Scoring Breakdown Sub-bar */}
                <div className="text-muted-foreground mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-3 font-mono">
                    <span>
                      Dense Cosine:{' '}
                      <strong className="text-foreground font-semibold">{chunk.cosineScore.toFixed(3)}</strong>
                    </span>
                    <span>
                      Sparse BM25:{' '}
                      <strong className="text-foreground font-semibold">{chunk.bm25Score.toFixed(3)}</strong>
                    </span>
                    {rerankerEnabled && (
                      <span>
                        Cross-Encoder:{' '}
                        <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {chunk.relevanceScore.toFixed(3)}
                        </strong>
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">Updated {chunk.updatedAgo}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Final Synthesized Output Card with Citations */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                <Sparkles className="size-4" />
              </div>
              <div>
                <CardTitle className="text-foreground text-base font-semibold">Synthesized Grounded Response</CardTitle>
                <CardDescription className="text-xs">
                  Generated via Claude 3.5 Sonnet streaming with verified inline citations.
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                <ShieldCheck className="mr-1 size-3" />
                100% Grounded · 0 Hallucinations
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                820ms (TTFT 180ms)
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Markdown Formatted Synthesized Body */}
          <div className="border-border/80 bg-muted/20 text-foreground space-y-3 rounded-lg border p-4 text-sm leading-relaxed sm:p-5">
            <p className="text-foreground font-medium">
              To configure OKLCH color palettes in Tailwind CSS v4 with UIPKGE:
            </p>

            <ol className="text-foreground/90 list-decimal space-y-2.5 pl-5 text-sm">
              <li className="leading-relaxed">
                <strong>Define Theme Tokens in CSS:</strong> Use{' '}
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">@theme inline</code>{' '}
                in your root stylesheet to declare single-source-of-truth OKLCH variables
                <button
                  type="button"
                  className="bg-primary/10 py-0.2 text-primary hover:bg-primary hover:text-primary-foreground mx-1 inline-flex min-h-6 cursor-pointer items-center rounded px-1 font-mono text-xs font-bold transition-colors"
                  onMouseEnter={() => setActiveCitationHover(1)}
                  onMouseLeave={() => setActiveCitationHover(null)}
                >
                  [1]
                </button>
                . Unlike legacy RGB/HSL, OKLCH ensures perceptually uniform lightness across hue shifts
                <button
                  type="button"
                  className="bg-primary/10 py-0.2 text-primary hover:bg-primary hover:text-primary-foreground mx-1 inline-flex min-h-6 cursor-pointer items-center rounded px-1 font-mono text-xs font-bold transition-colors"
                  onMouseEnter={() => setActiveCitationHover(1)}
                  onMouseLeave={() => setActiveCitationHover(null)}
                >
                  [1]
                </button>
                .
              </li>

              <li className="leading-relaxed">
                <strong>Calibrate Dark Mode Contrasts:</strong> Anchor chroma and shift lightness along the OKLCH L-axis
                (e.g.,{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  --color-primary: oklch(0.65 0.22 260)
                </code>{' '}
                and{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  --color-border: oklch(0.28 0.01 260)
                </code>
                ) to maintain WCAG AA compliance across both light and dark modes
                <button
                  type="button"
                  className="bg-primary/10 py-0.2 text-primary hover:bg-primary hover:text-primary-foreground mx-1 inline-flex min-h-6 cursor-pointer items-center rounded px-1 font-mono text-xs font-bold transition-colors"
                  onMouseEnter={() => setActiveCitationHover(2)}
                  onMouseLeave={() => setActiveCitationHover(null)}
                >
                  [2]
                </button>
                .
              </li>

              <li className="leading-relaxed">
                <strong>Maintain Dual-Framework CVA Parity:</strong> Wire CSS tokens directly through Class Variance
                Authority (<code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">cva()</code>) variants so
                that both Vue and React registry components share identical token namespaces with zero runtime bundle
                overhead
                <button
                  type="button"
                  className="bg-primary/10 py-0.2 text-primary hover:bg-primary hover:text-primary-foreground mx-1 inline-flex min-h-6 cursor-pointer items-center rounded px-1 font-mono text-xs font-bold transition-colors"
                  onMouseEnter={() => setActiveCitationHover(3)}
                  onMouseLeave={() => setActiveCitationHover(null)}
                >
                  [3]
                </button>
                .
              </li>
            </ol>

            {/* Streaming cursor pulse */}
            <div className="text-muted-foreground flex items-center gap-1.5 pt-1 font-mono text-xs">
              <span className="size-2 rounded-full bg-emerald-500 motion-safe:animate-ping" />
              <span>Generation Complete · 214 tokens streamed</span>
            </div>
          </div>

          {/* Citation Footnotes Bar */}
          <div className="border-border/70 bg-muted/40 space-y-1.5 rounded-md border p-3 text-xs">
            <span className="text-foreground flex items-center gap-1.5 font-semibold">
              <BookOpen className="text-primary size-3.5" />
              Referenced Citations (Hover citation to locate chunk):
            </span>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
              {displayedChunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded border p-1.5 font-mono text-xs transition-colors',
                    activeCitationHover === chunk.citationIndex
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/60 bg-card text-muted-foreground hover:bg-muted',
                  )}
                  onMouseEnter={() => setActiveCitationHover(chunk.citationIndex)}
                  onMouseLeave={() => setActiveCitationHover(null)}
                >
                  <span className="truncate">
                    [{chunk.citationIndex}] {chunk.documentPath.split('/').pop()}
                  </span>
                  <span className="font-semibold">{chunk.relevanceScore.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Footer & Action Buttons */}
          <div className="border-border text-muted-foreground flex flex-col gap-3 border-t pt-2 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 font-mono">
              <span>
                Input: <strong className="text-foreground">1,248 tok</strong>
              </span>
              <span>
                Output: <strong className="text-foreground">214 tok</strong>
              </span>
              <span>
                Cost: <strong className="text-foreground">$0.00438</strong>
              </span>
              <span>
                Grounding: <strong className="text-emerald-600 dark:text-emerald-400">99.4%</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="border-border bg-card flex items-center rounded-md border p-0.5">
                <Button
                  aria-label="Thumbs up"
                  variant="ghost"
                  size="xs"
                  className={cn('px-2', userFeedback === 'up' && 'text-emerald-500')}
                  onClick={() => setUserFeedback(userFeedback === 'up' ? null : 'up')}
                >
                  <ThumbsUp className="size-3.5" />
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button
                  aria-label="Thumbs down"
                  variant="ghost"
                  size="xs"
                  className={cn('px-2', userFeedback === 'down' && 'text-destructive')}
                  onClick={() => setUserFeedback(userFeedback === 'down' ? null : 'down')}
                >
                  <ThumbsDown className="size-3.5" />
                </Button>
              </div>

              <Button variant="outline" size="xs" className="gap-1" onClick={handleRunPipeline}>
                <RefreshCw className="size-3" />
                <span>Regenerate</span>
              </Button>

              <Button
                size="xs"
                className="gap-1"
                onClick={() =>
                  handleCopyResponse(
                    'To configure OKLCH color palettes in Tailwind CSS v4 with UIPKGE: 1. Define Theme Tokens in CSS (@theme inline)... 2. Calibrate Dark Mode Contrasts... 3. Maintain Dual-Framework CVA Parity...',
                  )
                }
              >
                {copiedResponse ? <Check className="size-3" /> : <Copy className="size-3" />}
                <span>{copiedResponse ? 'Copied' : 'Copy Answer'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RagPipelineVisualizer
