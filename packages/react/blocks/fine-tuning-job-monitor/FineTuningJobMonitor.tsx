'use client'

import * as React from 'react'
import {
  Activity,
  AlertCircle,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Database,
  Download,
  Gauge,
  Loader2,
  Rocket,
  Save,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingDown,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface CheckpointRecord {
  id: string
  epoch: number
  step: number
  totalSteps: number
  trainLoss: number
  valLoss: number
  size: string
  filename: string
  createdAgo: string
  isBest?: boolean
  status: 'saved' | 'best' | 'evaluating'
}

export interface LossReading {
  step: number
  trainLoss: number
  valLoss?: number
  isProjected?: boolean
  label?: string
}

export interface FineTuningJobMonitorProps extends React.HTMLAttributes<HTMLDivElement> {
  jobId?: string
  baseModel?: string
  fineTunedModelName?: string
  status?: string
  currentEpoch?: number
  totalEpochs?: number
  progressPercent?: number
  currentStep?: number
  totalSteps?: number
  trainingLoss?: number
  initialLoss?: number
  validationLoss?: number
  learningRate?: string
  gpuCluster?: string
  gpuUtilization?: number
  vramUsage?: string
  tokensPerSec?: number
  elapsedTime?: string
  etaRemaining?: string
  trainingDataset?: string
  trainingExamples?: number
  validationExamples?: number
  totalTokens?: string
  batchSize?: number
  microBatchSize?: number
  gradAccumSteps?: number
  contextLength?: number
  optimizer?: string
  loraRank?: number
  loraAlpha?: number
  loraDropout?: number
  checkpoints?: CheckpointRecord[]
  lossData?: LossReading[]
}

const defaultLossData: LossReading[] = [
  { step: 0, trainLoss: 1.84, valLoss: 1.92, label: 'Init' },
  { step: 25, trainLoss: 1.32, valLoss: undefined },
  { step: 50, trainLoss: 0.95, valLoss: 1.02, label: 'Warmup Done' },
  { step: 75, trainLoss: 0.915, valLoss: undefined },
  { step: 100, trainLoss: 0.892, valLoss: 0.945, label: 'Epoch 1 (Ckpt #1)' },
  { step: 125, trainLoss: 0.79, valLoss: undefined },
  { step: 150, trainLoss: 0.71, valLoss: 0.748, label: 'Step 150' },
  { step: 175, trainLoss: 0.64, valLoss: undefined },
  { step: 200, trainLoss: 0.584, valLoss: 0.612, label: 'Epoch 2 (Ckpt #2)' },
  { step: 225, trainLoss: 0.535, valLoss: undefined },
  { step: 250, trainLoss: 0.495, valLoss: 0.52, label: 'Step 250' },
  { step: 275, trainLoss: 0.46, valLoss: undefined },
  { step: 300, trainLoss: 0.435, valLoss: 0.468, label: 'Epoch 3 (Ckpt #3)' },
  { step: 320, trainLoss: 0.412, valLoss: 0.458, label: 'Step 320 (Live)' },
  // Projected points
  { step: 360, trainLoss: 0.395, valLoss: undefined, isProjected: true },
  { step: 400, trainLoss: 0.38, valLoss: 0.415, isProjected: true, label: 'Epoch 4 (Proj)' },
  { step: 450, trainLoss: 0.365, valLoss: undefined, isProjected: true },
  { step: 500, trainLoss: 0.355, valLoss: 0.39, isProjected: true, label: 'Epoch 5 (Target)' },
]

const defaultCheckpoints: CheckpointRecord[] = [
  {
    id: 'ckpt-3',
    epoch: 3,
    step: 300,
    totalSteps: 500,
    trainLoss: 0.435,
    valLoss: 0.468,
    size: '1.2 GB LoRA',
    filename: 'adapter_model_step300.safetensors',
    createdAgo: '24m ago',
    isBest: true,
    status: 'best',
  },
  {
    id: 'ckpt-2',
    epoch: 2,
    step: 200,
    totalSteps: 500,
    trainLoss: 0.584,
    valLoss: 0.612,
    size: '1.2 GB LoRA',
    filename: 'adapter_model_step200.safetensors',
    createdAgo: '1h 44m ago',
    isBest: false,
    status: 'saved',
  },
  {
    id: 'ckpt-1',
    epoch: 1,
    step: 100,
    totalSteps: 500,
    trainLoss: 0.892,
    valLoss: 0.945,
    size: '1.2 GB LoRA',
    filename: 'adapter_model_step100.safetensors',
    createdAgo: '3h 02m ago',
    isBest: false,
    status: 'saved',
  },
]

export function FineTuningJobMonitor({
  jobId = '#ft-job-2026-0842',
  baseModel = 'Meta Llama 3.3 70B Instruct',
  fineTunedModelName = 'llama-3.3-70b-uipkge-expert-v2',
  status = 'Training in Progress · Epoch 3 of 5 · 64% Complete',
  currentEpoch = 3,
  totalEpochs = 5,
  progressPercent = 64,
  currentStep = 320,
  totalSteps = 500,
  trainingLoss = 0.412,
  initialLoss = 1.84,
  validationLoss = 0.458,
  learningRate = '1.5e-5',
  gpuCluster = '8× NVIDIA H100 80GB SXM5',
  gpuUtilization = 100,
  vramUsage = '76.4 GB / 80 GB',
  tokensPerSec = 3480,
  elapsedTime = '4h 18m 22s',
  etaRemaining = '2h 25m',
  trainingDataset = 'uipkge_synthetic_sfc_pairs.jsonl',
  trainingExamples = 42500,
  validationExamples = 4250,
  totalTokens = '153.8M tokens',
  batchSize = 32,
  microBatchSize = 4,
  gradAccumSteps = 8,
  contextLength = 4096,
  optimizer = 'AdamW (beta1=0.9, beta2=0.95)',
  loraRank = 64,
  loraAlpha = 128,
  loraDropout = 0.05,
  checkpoints = defaultCheckpoints,
  lossData = defaultLossData,
  className,
  ...props
}: FineTuningJobMonitorProps) {
  const [copiedJobId, setCopiedJobId] = React.useState(false)
  const [copiedDataset, setCopiedDataset] = React.useState(false)
  const [isDownloadingWeights, setIsDownloadingWeights] = React.useState(false)
  const [isCancelling, setIsCancelling] = React.useState(false)
  const [isJobCancelled, setIsJobCancelled] = React.useState(false)
  const [deployingCkptId, setDeployingCkptId] = React.useState<string | null>(null)
  const [activeNotification, setActiveNotification] = React.useState<{
    title: string
    message: string
    type: 'success' | 'info' | 'destructive'
  } | null>(null)
  const [selectedStepIndex, setSelectedStepIndex] = React.useState<number | null>(13) // Default to step 320

  const showNotification = React.useCallback(
    (title: string, message: string, type: 'success' | 'info' | 'destructive' = 'success') => {
      setActiveNotification({ title, message, type })
      setTimeout(() => {
        setActiveNotification((prev) => (prev?.title === title ? null : prev))
      }, 4000)
    },
    [],
  )

  const copyJobId = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(jobId)
      setCopiedJobId(true)
      setTimeout(() => {
        setCopiedJobId(false)
      }, 2000)
    }
  }, [jobId])

  const copyDatasetName = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(trainingDataset)
      setCopiedDataset(true)
      setTimeout(() => {
        setCopiedDataset(false)
      }, 2000)
    }
  }, [trainingDataset])

  const handleDownloadWeights = React.useCallback(() => {
    if (isDownloadingWeights) return
    setIsDownloadingWeights(true)
    setTimeout(() => {
      setIsDownloadingWeights(false)
      showNotification(
        'Weights Download Triggered',
        'LoRA adapter weights (adapter_model.safetensors, 1.2 GB) download initialized with SHA-256 verification.',
      )
    }, 900)
  }, [isDownloadingWeights, showNotification])

  const handleCancelJob = React.useCallback(() => {
    if (isCancelling || isJobCancelled) return
    setIsCancelling(true)
    setTimeout(() => {
      setIsCancelling(false)
      setIsJobCancelled(true)
      showNotification(
        'Job Cancellation Dispatched',
        'SIGTERM gracefully sent to GPU cluster. Last checkpoint #3 preserved.',
        'destructive',
      )
    }, 700)
  }, [isCancelling, isJobCancelled, showNotification])

  const handleDeployToPlayground = React.useCallback(
    (ckpt: CheckpointRecord) => {
      setDeployingCkptId(ckpt.id)
      setTimeout(() => {
        setDeployingCkptId(null)
        showNotification(
          'Checkpoint Deployed to Playground',
          `Checkpoint Epoch ${ckpt.epoch} (Step ${ckpt.step}) has been loaded into the interactive testing playground with zero cold-start latency.`,
        )
      }, 1000)
    },
    [showNotification],
  )

  // SVG Telemetry Loss Curves Math
  const svgWidth = 740
  const padLeft = 45
  const padRight = 695
  const usableW = padRight - padLeft
  const padTop = 25
  const padBottom = 190
  const usableH = padBottom - padTop

  const mapX = React.useCallback(
    (step: number): number => {
      return padLeft + (step / totalSteps) * usableW
    },
    [totalSteps, usableW],
  )

  const mapY = React.useCallback(
    (loss: number): number => {
      const clamped = Math.max(0, Math.min(2.0, loss))
      return padBottom - (clamped / 2.0) * usableH
    },
    [usableH],
  )

  const targetLossY = React.useMemo(() => mapY(0.4), [mapY])
  const currentStepX = React.useMemo(() => mapX(currentStep), [mapX, currentStep])

  const historicalPoints = React.useMemo(() => lossData.filter((d) => !d.isProjected), [lossData])

  const projectedPoints = React.useMemo(() => {
    const proj = lossData.filter((d) => d.isProjected)
    const lastHist = historicalPoints[historicalPoints.length - 1]
    return lastHist ? [lastHist, ...proj] : proj
  }, [lossData, historicalPoints])

  const trainPathHistoric = React.useMemo(() => {
    const pts = historicalPoints
    if (!pts.length) return ''
    let path = `M ${mapX(pts[0].step)},${mapY(pts[0].trainLoss)}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const x0 = mapX(prev.step)
      const y0 = mapY(prev.trainLoss)
      const x1 = mapX(curr.step)
      const y1 = mapY(curr.trainLoss)
      const cx = (x0 + x1) / 2
      path += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`
    }
    return path
  }, [historicalPoints, mapX, mapY])

  const trainAreaHistoric = React.useMemo(() => {
    const pts = historicalPoints
    if (!pts.length) return ''
    const firstX = mapX(pts[0].step)
    const lastX = mapX(pts[pts.length - 1].step)
    return `${trainPathHistoric} L ${lastX},${padBottom} L ${firstX},${padBottom} Z`
  }, [historicalPoints, mapX, trainPathHistoric])

  const trainPathProjected = React.useMemo(() => {
    const pts = projectedPoints
    if (!pts.length) return ''
    let path = `M ${mapX(pts[0].step)},${mapY(pts[0].trainLoss)}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const x0 = mapX(prev.step)
      const y0 = mapY(prev.trainLoss)
      const x1 = mapX(curr.step)
      const y1 = mapY(curr.trainLoss)
      const cx = (x0 + x1) / 2
      path += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`
    }
    return path
  }, [projectedPoints, mapX, mapY])

  const valPointsHistoric = React.useMemo(
    () => lossData.filter((d) => !d.isProjected && d.valLoss !== undefined),
    [lossData],
  )

  const valPathHistoric = React.useMemo(() => {
    const pts = valPointsHistoric
    if (!pts.length) return ''
    let path = `M ${mapX(pts[0].step)},${mapY(pts[0].valLoss!)}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const x0 = mapX(prev.step)
      const y0 = mapY(prev.valLoss!)
      const x1 = mapX(curr.step)
      const y1 = mapY(curr.valLoss!)
      const cx = (x0 + x1) / 2
      path += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`
    }
    return path
  }, [valPointsHistoric, mapX, mapY])

  const valPointsProjected = React.useMemo(() => {
    const list = lossData.filter((d) => d.valLoss !== undefined && d.isProjected)
    const lastValHist = valPointsHistoric[valPointsHistoric.length - 1]
    return lastValHist ? [lastValHist, ...list] : list
  }, [lossData, valPointsHistoric])

  const valPathProjected = React.useMemo(() => {
    const pts = valPointsProjected
    if (!pts.length) return ''
    let path = `M ${mapX(pts[0].step)},${mapY(pts[0].valLoss!)}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const x0 = mapX(prev.step)
      const y0 = mapY(prev.valLoss!)
      const x1 = mapX(curr.step)
      const y1 = mapY(curr.valLoss!)
      const cx = (x0 + x1) / 2
      path += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`
    }
    return path
  }, [valPointsProjected, mapX, mapY])

  return (
    <div data-slot="fine-tuning-job-monitor" className={cn('mx-auto w-full max-w-6xl space-y-6', className)} {...props}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-600 shadow-xs dark:text-sky-400">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-foreground font-mono text-xl font-bold tracking-tight break-all sm:text-2xl">
                    {fineTunedModelName}
                  </h1>
                  <button
                    type="button"
                    className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border/80 inline-flex min-h-6 items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs transition-colors"
                    title={`Copy Job ID: ${jobId}`}
                    onClick={copyJobId}
                  >
                    <span className="text-foreground font-medium">{jobId}</span>
                    {copiedJobId ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3 opacity-70" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Base Model:</span>
              <span className="text-foreground font-medium">{baseModel}</span>
            </div>
            <span>·</span>
            {/* Live Status Badge */}
            <div className="flex items-center gap-1.5">
              {!isJobCancelled ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
                </span>
              ) : (
                <span className="size-2 rounded-full bg-rose-500" />
              )}
              <span className={cn('font-medium', isJobCancelled ? 'text-rose-500' : 'text-sky-600 dark:text-sky-400')}>
                {isJobCancelled ? 'Job Cancelled by Operator' : status}
              </span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="size-3.5" />
              <span className="tabular-nums">Elapsed: {elapsedTime}</span>
              <span className="text-muted-foreground">· ETA {etaRemaining}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={isCancelling || isJobCancelled}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8.5 gap-1.5 text-xs font-medium"
            onClick={handleCancelJob}
          >
            <XCircle className={cn('size-3.5', isCancelling && 'animate-spin')} />
            <span>{isJobCancelled ? 'Cancelled' : isCancelling ? 'Cancelling...' : 'Cancel Job'}</span>
          </Button>

          <Button
            aria-label="Download attachment"
            variant="default"
            size="sm"
            disabled={isDownloadingWeights}
            className="h-8.5 gap-2 text-xs font-medium shadow-xs"
            onClick={handleDownloadWeights}
          >
            <Download className={cn('size-3.5', isDownloadingWeights && 'animate-bounce')} />
            <span>{isDownloadingWeights ? 'Preparing Archive...' : 'Download Weights / LoRA Adapter'}</span>
          </Button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {activeNotification && (
        <div
          className={cn(
            'flex items-center justify-between rounded-lg border p-3 text-xs shadow-xs transition-all',
            activeNotification.type === 'destructive'
              ? 'border-destructive/30 bg-destructive/10 text-destructive dark:text-rose-400'
              : 'border-border bg-card text-card-foreground',
          )}
          role="status"
        >
          <div className="flex items-center gap-2.5">
            {activeNotification.type === 'success' ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="size-4 shrink-0 text-rose-500" />
            )}
            <div>
              <span className="text-foreground font-semibold">{activeNotification.title}: </span>
              <span className="text-muted-foreground">{activeNotification.message}</span>
            </div>
          </div>
          <Button
            aria-label="Dismiss notification"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground size-6"
            onClick={() => setActiveNotification(null)}
          >
            <span className="text-xs">✕</span>
          </Button>
        </div>
      )}

      {/* 4 Training Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Current Training Loss */}
        <Card className="border-border bg-card text-card-foreground shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Activity className="size-4" />
                </div>
                <CardTitle className="truncate text-sm font-medium">Training Loss</CardTitle>
              </div>
              <Badge wrap variant="outline" className="font-mono text-xs tabular-nums">
                Step {currentStep}/{totalSteps}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-3xl font-bold tracking-tight tabular-nums">
                  {trainingLoss.toFixed(3)}
                </span>
                <span className="text-muted-foreground text-xs font-normal">cross-entropy</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingDown className="size-3.5" />
                <span className="tabular-nums">-77.6%</span>
              </div>
            </div>

            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                <span>Initial Loss:</span>
                <span className="text-foreground font-mono font-medium tabular-nums">{initialLoss.toFixed(3)}</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Target convergence corridor: &lt; 0.450</p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Validation Loss */}
        <Card className="border-border bg-card text-card-foreground shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-4" />
                </div>
                <CardTitle className="truncate text-sm font-medium">Validation Loss</CardTitle>
              </div>
              <Badge wrap variant="success" className="shrink-0 text-xs">
                Generalizing
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-3xl font-bold tracking-tight tabular-nums">
                  {validationLoss.toFixed(3)}
                </span>
                <span className="text-muted-foreground text-xs font-normal">eval set</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                +0.046 gap
              </span>
            </div>

            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="text-muted-foreground flex items-center justify-between gap-x-2">
                <span>Overfitting Status:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">No Overfitting</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Evaluated every 50 steps on 4,250 rows</p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Learning Rate */}
        <Card className="border-border bg-card text-card-foreground shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Gauge className="size-4" />
                </div>
                <CardTitle className="truncate text-sm font-medium">Learning Rate</CardTitle>
              </div>
              <Badge wrap variant="outline" className="shrink-0 font-mono text-xs">
                Cosine
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-3xl font-bold tracking-tight tabular-nums">
                  {learningRate}
                </span>
                <span className="text-muted-foreground text-xs font-normal">AdamW</span>
              </div>
              <span className="text-muted-foreground text-xs font-medium tabular-nums">Decay active</span>
            </div>

            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="text-muted-foreground flex items-center justify-between gap-x-2">
                <span>Schedule:</span>
                <span className="text-foreground font-medium">Cosine Decay (10% warmup)</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Peak: 1.5e-4 · Min: 1.0e-6</p>
            </div>
          </CardContent>
        </Card>

        {/* 4. GPU Compute Cluster */}
        <Card className="border-border bg-card text-card-foreground shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Cpu className="size-4" />
                </div>
                <CardTitle className="truncate text-sm font-medium">GPU Compute Cluster</CardTitle>
              </div>
              <Badge wrap variant="success" className="shrink-0 text-xs tabular-nums">
                {gpuUtilization}% Utilized
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div>
                <span className="text-foreground text-lg font-bold tracking-tight sm:text-xl">{gpuCluster}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Progress value={gpuUtilization} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-emerald-500" />
              <div className="text-muted-foreground flex items-center justify-between gap-x-2 text-xs">
                <span>
                  VRAM: <span className="text-foreground font-mono font-medium tabular-nums">{vramUsage}</span>
                </span>
                <span className="font-mono tabular-nums">{tokensPerSec.toLocaleString()} tok/s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training & Validation Loss SVG Trend Curve */}
      <Card className="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="text-primary size-4" />
                <CardTitle className="text-base font-semibold">Training & Validation Loss Convergence</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Dual-series loss trajectory across {totalSteps} gradient steps. Solid lines represent observed loss;
                dashed lines denote projected cosine decay trajectory.
              </CardDescription>
            </div>

            {/* Legend & Metrics */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-sky-500" />
                  <span className="text-foreground font-medium">Training Loss ({trainingLoss.toFixed(3)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  <span className="text-foreground font-medium">Validation Loss ({validationLoss.toFixed(3)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-3 border-b border-dashed border-rose-500 bg-rose-500" />
                  <span className="text-muted-foreground">Target (&lt; 0.400)</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SVG Chart Canvas Area */}
          <div className="bg-muted/20 border-border/60 relative w-full overflow-x-auto rounded-lg border p-2 sm:p-4">
            <svg
              className="h-64 w-full max-w-[600px] min-w-full"
              viewBox={`0 0 ${svgWidth} 220`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="grad-train-loss-react" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-sky-500, #0ea5e9)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--color-sky-500, #0ea5e9)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Target Convergence Zone (Loss 0.00 to 0.40 -> Y: 190 to 157) */}
              <rect
                x={padLeft}
                y={targetLossY}
                width={usableW}
                height={padBottom - targetLossY}
                fill="var(--color-emerald-500, #10b981)"
                fillOpacity="0.05"
                rx="4"
              />

              {/* Horizontal Grid Lines */}
              <line
                x1={padLeft}
                y1="25"
                x2={padRight}
                y2="25"
                stroke="currentColor"
                className="text-border/40"
                strokeWidth="1"
              />
              <line
                x1={padLeft}
                y1="66"
                x2={padRight}
                y2="66"
                stroke="currentColor"
                className="text-border/40"
                strokeWidth="1"
              />
              <line
                x1={padLeft}
                y1="107"
                x2={padRight}
                y2="107"
                stroke="currentColor"
                className="text-border/40"
                strokeWidth="1"
              />
              <line
                x1={padLeft}
                y1="148"
                x2={padRight}
                y2="148"
                stroke="currentColor"
                className="text-border/40"
                strokeWidth="1"
              />
              <line
                x1={padLeft}
                y1={targetLossY}
                x2={padRight}
                y2={targetLossY}
                stroke="var(--color-rose-500, #f43f5e)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <line
                x1={padLeft}
                y1={padBottom}
                x2={padRight}
                y2={padBottom}
                stroke="currentColor"
                className="text-border/40"
                strokeWidth="1"
              />

              {/* Y-Axis Scale Labels */}
              <text x={padLeft - 8} y="29" textAnchor="end" className="fill-muted-foreground font-mono text-xs">
                2.00
              </text>
              <text x={padLeft - 8} y="70" textAnchor="end" className="fill-muted-foreground font-mono text-xs">
                1.50
              </text>
              <text x={padLeft - 8} y="111" textAnchor="end" className="fill-muted-foreground font-mono text-xs">
                1.00
              </text>
              <text x={padLeft - 8} y="152" textAnchor="end" className="fill-muted-foreground font-mono text-xs">
                0.50
              </text>
              <text
                x={padLeft - 8}
                y={targetLossY + 4}
                textAnchor="end"
                className="fill-rose-500 font-mono text-xs font-semibold"
              >
                0.40
              </text>
              <text
                x={padLeft - 8}
                y={padBottom + 4}
                textAnchor="end"
                className="fill-muted-foreground font-mono text-xs"
              >
                0.00
              </text>

              {/* Current Step 320 Vertical Indicator Line */}
              <line
                x1={currentStepX}
                y1="20"
                x2={currentStepX}
                y2={padBottom}
                stroke="var(--color-sky-500, #0ea5e9)"
                strokeWidth="1.5"
                strokeDasharray="2 3"
              />

              {/* Training Loss Area & Solid Line (Observed) */}
              <path d={trainAreaHistoric} fill="url(#grad-train-loss-react)" />
              <path
                d={trainPathHistoric}
                fill="none"
                stroke="var(--color-sky-500, #0ea5e9)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Training Loss Projected Line (Dashed) */}
              <path
                d={trainPathProjected}
                fill="none"
                stroke="var(--color-sky-500, #0ea5e9)"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />

              {/* Validation Loss Curve (Observed Solid Emerald) */}
              <path
                d={valPathHistoric}
                fill="none"
                stroke="var(--color-emerald-500, #10b981)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Validation Loss Projected Line (Dashed Emerald) */}
              <path
                d={valPathProjected}
                fill="none"
                stroke="var(--color-emerald-500, #10b981)"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />

              {/* Validation Loss Checkpoint Nodes (Observed) */}
              {valPointsHistoric.map((pt) => (
                <circle
                  key={`val-${pt.step}`}
                  cx={mapX(pt.step)}
                  cy={mapY(pt.valLoss!)}
                  r={4}
                  className="stroke-background cursor-pointer fill-emerald-500 stroke-2 transition-transform hover:scale-125"
                  onMouseEnter={() => setSelectedStepIndex(lossData.findIndex((d) => d.step === pt.step))}
                />
              ))}

              {/* Training Loss Interactive Point Markers */}
              {historicalPoints.map((pt, idx) => (
                <circle
                  key={`train-${pt.step}`}
                  cx={mapX(pt.step)}
                  cy={mapY(pt.trainLoss)}
                  r={pt.step === currentStep ? 5 : 3}
                  className={cn(
                    'stroke-background cursor-pointer stroke-2 transition-transform hover:scale-150',
                    pt.step === currentStep ? 'fill-sky-400 ring-2 ring-sky-500' : 'fill-sky-500',
                  )}
                  onMouseEnter={() => setSelectedStepIndex(idx)}
                />
              ))}

              {/* Current Step Marker Pin Top Flag */}
              <g transform={`translate(${currentStepX - 44}, 10)`}>
                <rect width="88" height="18" rx="4" className="fill-sky-600 dark:fill-sky-500" />
                <text x="44" y="13" textAnchor="middle" className="fill-white font-mono text-xs font-semibold">
                  Step 320 / 500
                </text>
              </g>
            </svg>

            {/* X-Axis Step Milestones */}
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 lg:grid-cols-7">
              {lossData
                .filter((d) => d.label)
                .map((pt, idx) => {
                  const isSelected = selectedStepIndex === lossData.indexOf(pt)
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'rounded p-1.5 text-center transition-colors',
                        isSelected
                          ? 'border-border/80 bg-muted border shadow-2xs'
                          : 'bg-muted/30 border border-transparent',
                      )}
                    >
                      <p className="text-foreground font-mono text-xs font-semibold tabular-nums">Step {pt.step}</p>
                      <p className="text-muted-foreground truncate text-xs">{pt.label}</p>
                      <div className="mt-0.5 flex items-center justify-center gap-1 font-mono text-xs tabular-nums">
                        <span className="text-sky-600 dark:text-sky-400">{pt.trainLoss.toFixed(3)}</span>
                        {pt.valLoss && (
                          <span className="text-emerald-600 dark:text-emerald-400">/ {pt.valLoss.toFixed(3)}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Metric Summary Strip */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 lg:grid-cols-5">
            <div className="border-border bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground">Step Progress</span>
              <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                {currentStep} / {totalSteps} ({progressPercent}%)
              </p>
              <div className="mt-1">
                <Progress value={progressPercent} className="h-1 [&_[data-slot=progress-indicator]]:bg-sky-500" />
              </div>
            </div>

            <div className="border-border bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground">Tokens Processed</span>
              <p className="text-foreground font-mono text-sm font-semibold tabular-nums">98.4M / 153.8M</p>
              <span className="text-muted-foreground text-xs">64.0% of corpus</span>
            </div>

            <div className="border-border bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground">Cluster Throughput</span>
              <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                {tokensPerSec.toLocaleString()} tok/s
              </p>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Zero pipeline bubbles</span>
            </div>

            <div className="border-border bg-muted/30 rounded-lg border p-2.5">
              <span className="text-muted-foreground">Current Epoch</span>
              <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                Epoch {currentEpoch} of {totalEpochs}
              </p>
              <span className="text-muted-foreground text-xs">100 steps / epoch</span>
            </div>

            <div className="border-border bg-muted/30 col-span-2 rounded-lg border p-2.5 sm:col-span-3 lg:col-span-1">
              <span className="text-muted-foreground">Convergence Projection</span>
              <p className="font-mono text-sm font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                0.355 at Step 500
              </p>
              <span className="text-muted-foreground text-xs">Expected final loss</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lower Section: Checkpoint History & Hyperparameters Configuration */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols on lg): Checkpoint History Table */}
        <Card className="border-border bg-card text-card-foreground shadow-xs lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Save className="text-primary size-4" />
                  <CardTitle className="text-base font-semibold">Checkpoint History & Weight Exporter</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Saved LoRA adapter snapshots. Deploy directly to test playground or download safe tensors.
                </CardDescription>
              </div>
              <Badge wrap variant="outline" className="w-fit font-mono text-xs font-normal tabular-nums">
                {checkpoints.length} Saved Snapshots
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px] text-xs">Checkpoint</TableHead>
                    <TableHead className="min-w-[80px] text-xs">Step</TableHead>
                    <TableHead className="min-w-[90px] text-xs">Train Loss</TableHead>
                    <TableHead className="min-w-[90px] text-xs">Val Loss</TableHead>
                    <TableHead className="min-w-[110px] text-xs">Size & Type</TableHead>
                    <TableHead className="min-w-[100px] text-xs">Created</TableHead>
                    <TableHead className="min-w-[150px] text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkpoints.map((ckpt) => (
                    <TableRow key={ckpt.id} className={ckpt.isBest ? 'bg-emerald-500/[0.04]' : ''}>
                      <TableCell className="text-xs whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground font-mono font-medium">Epoch {ckpt.epoch}.0</span>
                            {ckpt.isBest && (
                              <Badge wrap variant="success" className="h-4 px-1.5 text-xs font-medium">
                                Best Val Loss
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground font-mono text-xs">{ckpt.filename}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap tabular-nums">
                        {ckpt.step} / {ckpt.totalSteps}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        <span className="font-mono font-semibold text-sky-600 tabular-nums dark:text-sky-400">
                          {ckpt.trainLoss.toFixed(3)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        <span className="font-mono font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                          {ckpt.valLoss.toFixed(3)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap tabular-nums">
                        {ckpt.size}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {ckpt.createdAgo}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="xs"
                            disabled={deployingCkptId === ckpt.id}
                            className="gap-1 text-xs"
                            onClick={() => handleDeployToPlayground(ckpt)}
                          >
                            {deployingCkptId === ckpt.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <Rocket className="size-3 text-sky-500" />
                            )}
                            <span>{deployingCkptId === ckpt.id ? 'Deploying...' : 'Deploy to Playground'}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-muted-foreground hover:text-foreground size-7"
                            title="Download LoRA .safetensors"
                            onClick={handleDownloadWeights}
                          >
                            <Download className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column (1 col on lg): Hyperparameters & Dataset Configuration Card */}
        <Card className="border-border bg-card text-card-foreground shadow-xs lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-x-2">
              <div className="flex items-center gap-2">
                <Sliders className="text-primary size-4" />
                <CardTitle className="text-base font-semibold">Hyperparameters & Dataset</CardTitle>
              </div>
              <Badge wrap variant="outline" className="font-mono text-xs">
                LoRA PEFT
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Fine-tuning recipe manifest and dataset partition metadata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Training Dataset Box */}
            <div className="border-border/80 bg-muted/40 space-y-2 rounded-lg border p-3 text-xs">
              <div className="flex items-center justify-between gap-x-2">
                <div className="flex items-center gap-1.5">
                  <Database className="text-primary size-3.5" />
                  <span className="text-foreground font-semibold">Training Dataset</span>
                </div>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy dataset filename"
                  onClick={copyDatasetName}
                >
                  {copiedDataset ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                </button>
              </div>
              <p className="text-foreground font-mono text-xs font-medium break-all">{trainingDataset}</p>
              <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-1 text-xs">
                <span>
                  {trainingExamples.toLocaleString()} train · {validationExamples.toLocaleString()} val
                </span>
                <span className="font-mono tabular-nums">{totalTokens}</span>
              </div>
            </div>

            {/* Key Parameters Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="border-border/50 flex items-center justify-between gap-x-2 border-b pb-1.5">
                <span className="text-muted-foreground">Effective Batch Size:</span>
                <span className="text-foreground font-mono font-semibold tabular-nums">
                  {batchSize}{' '}
                  <span className="text-muted-foreground font-normal">
                    ({microBatchSize} × {gradAccumSteps} accum)
                  </span>
                </span>
              </div>

              <div className="border-border/50 flex items-center justify-between gap-x-2 border-b pb-1.5">
                <span className="text-muted-foreground">Context Length:</span>
                <span className="text-foreground font-mono font-semibold tabular-nums">
                  {contextLength.toLocaleString()} tokens
                </span>
              </div>

              <div className="border-border/50 flex items-center justify-between gap-x-2 border-b pb-1.5">
                <span className="text-muted-foreground">Optimizer:</span>
                <span className="text-foreground font-mono font-medium">{optimizer}</span>
              </div>

              <div className="border-border/50 flex items-center justify-between gap-x-2 border-b pb-1.5">
                <span className="text-muted-foreground">LoRA Rank & Alpha:</span>
                <span className="text-foreground font-mono font-semibold tabular-nums">
                  r={loraRank}, α={loraAlpha} (dropout={loraDropout})
                </span>
              </div>

              <div className="border-border/50 flex items-center justify-between gap-x-2 border-b pb-1.5">
                <span className="text-muted-foreground">Target Modules:</span>
                <span className="text-foreground font-mono text-xs">All Linear (q, k, v, o, gate, up, down)</span>
              </div>

              <div className="border-border/50 flex items-center justify-between gap-x-2 border-b pb-1.5">
                <span className="text-muted-foreground">Precision & Kernel:</span>
                <span className="text-foreground font-mono">bfloat16 · FlashAttention-2</span>
              </div>

              <div className="flex items-center justify-between gap-x-2">
                <span className="text-muted-foreground">Parallelism Strategy:</span>
                <span className="text-foreground font-medium">PyTorch FSDP-2 (Hybrid Sharded)</span>
              </div>
            </div>

            <Separator />

            {/* Export & Integration Note */}
            <div className="border-border bg-muted/20 space-y-1.5 rounded-lg border p-2.5 text-xs">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <Sparkles className="size-3.5 text-sky-500" />
                <span>HuggingFace Hub & vLLM Ready</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Checkpoints are stored in standard SafeTensors format with tokenizer configs ready for instant
                serverless vLLM / TensorRT-LLM deployment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
