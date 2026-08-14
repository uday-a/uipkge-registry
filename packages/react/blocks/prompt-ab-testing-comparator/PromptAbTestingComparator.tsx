'use client'

import * as React from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Coins,
  Copy,
  Cpu,
  Play,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface PromptAbTestingComparatorProps {
  experimentTitle?: string
  testSampleCount?: string
  className?: string
}

const testCases = [
  {
    id: 'test-18',
    number: '#18',
    title: 'Button Component with CVA Variants',
    prompt: 'Generate a polymorphic Button component with cva variants in Vue 3.5 <script setup lang="ts">',
    componentTarget: 'Button.vue',
    category: 'Control / Primitive',
  },
  {
    id: 'test-24',
    number: '#24',
    title: 'Card Container with Header and Action',
    prompt: 'Generate a compound Card component with CardHeader, CardTitle, and CardAction in Vue 3.5',
    componentTarget: 'Card.vue',
    category: 'Layout / Primitive',
  },
  {
    id: 'test-31',
    number: '#31',
    title: 'Tabs Navigation with Animated Indicator',
    prompt: 'Create a headless accessible Tabs component with horizontal/vertical orientation support in Vue 3.5',
    componentTarget: 'Tabs.vue',
    category: 'Navigation',
  },
  {
    id: 'test-42',
    number: '#42',
    title: 'Semantic Status Badge Component',
    prompt: 'Build a Badge component with success, warning, destructive, and outline variants in Tailwind v4',
    componentTarget: 'Badge.vue',
    category: 'Feedback / Tag',
  },
]

const promptAData = {
  id: 'prompt-a',
  label: 'Prompt A',
  variantName: 'Baseline Control',
  model: 'Claude 3.5 Sonnet',
  temperature: '0.7',
  maxTokens: 2048,
  latency: '1.42s',
  outputTokens: 340,
  cost: '$0.0018',
  judgeScore: 82,
  judgeStatus: 'Baseline Control',
  critique: 'Generated inline cva variants in index.ts causing potential SSR circular imports.',
  systemPrompt: `You are a Vue 3 component generator. Generate standard Vue SFC components with Tailwind CSS and class-variance-authority for variants.`,
  outputCode: `<script setup lang="ts">
import { buttonVariants } from './index'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
})
</script>

<template>
  <button
    :class="buttonVariants({ variant: props.variant, size: props.size, class: props.class })"
  >
    <slot />
  </button>
</template>`,
  subScores: [
    { label: 'SSR Safety', score: 68, status: 'Warning' },
    { label: 'Type Safety', score: 84, status: 'Good' },
    { label: 'Token Economy', score: 88, status: 'Good' },
    { label: 'Style Conformance', score: 88, status: 'Good' },
  ],
}

const promptBData = {
  id: 'prompt-b',
  label: 'Prompt B',
  variantName: 'Challenger (With Rules)',
  model: 'Claude 3.5 Sonnet',
  temperature: '0.7',
  maxTokens: 2048,
  latency: '1.28s',
  latencyDelta: '-0.14s (-9.8%)',
  outputTokens: 320,
  tokensDelta: '-20 tok (-5.9%)',
  cost: '$0.0016',
  costDelta: '-$0.0002 (-11.1%)',
  judgeScore: 96,
  judgeDelta: '+14 pts',
  judgeStatus: 'Winner · +14 pts',
  critique: 'Clean architectural separation with .variants.ts sidecar and strict 120-col Prettier formatting.',
  systemPrompt: `You are a specialized Vue 3.5 SFC generator for UIPKGE. Adhere strictly to the sidecar variant architecture: 1) ALWAYS isolate CVA variant definitions into a standalone [name].variants.ts file to eliminate Vue SSR circular-import deadlocks, 2) Use <script setup lang="ts"> with Primitive from reka-ui for polymorphic as/asChild rendering, 3) Follow 120-column Prettier formatting without semicolons.`,
  outputCode: `<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './button.variants'

interface Props {
  as?: string
  asChild?: boolean
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>`,
  subScores: [
    { label: 'SSR Safety', score: 98, status: 'Optimal' },
    { label: 'Type Safety', score: 96, status: 'Optimal' },
    { label: 'Token Economy', score: 94, status: 'Optimal' },
    { label: 'Style Conformance', score: 96, status: 'Optimal' },
  ],
}

const rubricDimensions = [
  {
    id: 'ssr-safety',
    name: 'SSR Safety & Circular Import Guard',
    promptAScore: '68 / 100',
    promptBScore: '98 / 100',
    delta: '+30 pts',
    isWinner: true,
    insight: 'Prompt B isolates variants into button.variants.ts, preventing component <-> index.ts SSR deadlocks.',
  },
  {
    id: 'polymorphism',
    name: 'Polymorphism & Reka UI Primitive',
    promptAScore: '84 / 100',
    promptBScore: '96 / 100',
    delta: '+12 pts',
    isWinner: true,
    insight: 'Prompt B wraps Reka UI Primitive with asChild and data-slot attributes for full slot delegation.',
  },
  {
    id: 'typescript-typing',
    name: 'TypeScript HTMLAttributes & Variants',
    promptAScore: '82 / 100',
    promptBScore: '95 / 100',
    delta: '+13 pts',
    isWinner: true,
    insight: "Uses HTMLAttributes['class'] and ButtonVariants['variant'] instead of generic string props.",
  },
  {
    id: 'token-efficiency',
    name: 'Token Generation Efficiency',
    promptAScore: '88 / 100 (340 tok)',
    promptBScore: '94 / 100 (320 tok)',
    delta: '+6 pts (-5.9% tok)',
    isWinner: true,
    insight: 'Direct script setup syntax eliminates 20 tokens of redundant wrapper code per generation.',
  },
  {
    id: 'style-conformance',
    name: 'Prettier & 120-Col Print Width',
    promptAScore: '88 / 100',
    promptBScore: '97 / 100',
    delta: '+9 pts',
    isWinner: true,
    insight: 'Strict adherence to single quotes, no semicolons, 2-space indentation, and sorted utility classes.',
  },
]

const summaryMetrics = [
  {
    id: 'win-rate',
    label: 'Overall Win Rate',
    value: '84.0%',
    subvalue: '42 of 50 Tests Won',
    badge: 'Dominant Win',
    badgeVariant: 'success' as const,
    description: 'Prompt B outperformed or matched Prompt A in 47 / 50 benchmark cases.',
    highlight: true,
  },
  {
    id: 'quality-lift',
    label: 'Quality Score Lift',
    value: '+18.4%',
    subvalue: '96.1 vs 81.2 Avg Score',
    badge: '+14.9 pts avg',
    badgeVariant: 'success' as const,
    description: 'Statistically significant improvement in architectural correctness.',
    highlight: true,
  },
  {
    id: 'latency-delta',
    label: 'Avg Response Latency',
    value: '1.28s',
    subvalue: '-9.8% vs Baseline (1.42s)',
    badge: '-140ms faster',
    badgeVariant: 'secondary' as const,
    description: 'Lower token payload reduces end-to-end LLM response streaming latency.',
    highlight: false,
  },
  {
    id: 'token-savings',
    label: 'Avg Token Economy',
    value: '320 tok',
    subvalue: '-5.9% Token Reduction',
    badge: '20 tok / call saved',
    badgeVariant: 'secondary' as const,
    description: 'Est. $20.00 / month cost savings per 100,000 component generation calls.',
    highlight: false,
  },
]

const goldenTests = [
  {
    id: 'gt-1',
    name: '#01 Button with CVA Variants',
    category: 'Control',
    promptAScore: '82',
    promptBScore: '96',
    delta: '+14',
    winner: 'Prompt B',
    latencyA: '1.42s',
    latencyB: '1.28s',
  },
  {
    id: 'gt-2',
    name: '#02 Card Container with Action',
    category: 'Layout',
    promptAScore: '79',
    promptBScore: '98',
    delta: '+19',
    winner: 'Prompt B',
    latencyA: '1.51s',
    latencyB: '1.34s',
  },
  {
    id: 'gt-3',
    name: '#03 Tabs with Indicator Slider',
    category: 'Navigation',
    promptAScore: '80',
    promptBScore: '95',
    delta: '+15',
    winner: 'Prompt B',
    latencyA: '1.64s',
    latencyB: '1.41s',
  },
  {
    id: 'gt-4',
    name: '#04 Semantic Status Badge',
    category: 'Feedback',
    promptAScore: '86',
    promptBScore: '97',
    delta: '+11',
    winner: 'Prompt B',
    latencyA: '1.15s',
    latencyB: '1.08s',
  },
  {
    id: 'gt-5',
    name: '#05 Dropdown Menu Compound',
    category: 'Overlay',
    promptAScore: '81',
    promptBScore: '94',
    delta: '+13',
    winner: 'Prompt B',
    latencyA: '1.58s',
    latencyB: '1.39s',
  },
]

export function PromptAbTestingComparator({
  experimentTitle = 'Prompt Optimization: Vue SFC AST Component Generator',
  testSampleCount = '50 Evaluation Prompts',
  className,
}: PromptAbTestingComparatorProps) {
  const [isRunning, setIsRunning] = React.useState(false)
  const [isPromoted, setIsPromoted] = React.useState(false)
  const [copiedState, setCopiedState] = React.useState<Record<string, boolean>>({})
  const [selectedTestCase] = React.useState('test-18')

  const currentTestCase = React.useMemo(() => {
    return testCases.find((tc) => tc.id === selectedTestCase) ?? testCases[0]
  }, [selectedTestCase])

  const runComparison = React.useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 1200)
  }, [isRunning])

  const promotePromptB = React.useCallback(() => {
    setIsPromoted(true)
  }, [])

  const copyToClipboard = React.useCallback((key: string, text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedState((prev) => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [key]: false }))
    }, 2000)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runComparison()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [runComparison])

  return (
    <div data-uipkge="" data-slot="prompt-ab-testing-comparator" className={cn('w-full space-y-6', className)}>
      {/* Production Promotion Success Banner (if promoted) */}
      {isPromoted && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 shadow-xs sm:flex-row sm:items-center dark:text-emerald-100">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white shadow-xs">
              <Rocket className="size-4" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <p className="text-foreground text-sm font-semibold">
                Prompt B (Challenger with Sidecar Isolation) Promoted to Production
              </p>
              <p className="text-muted-foreground text-xs">
                100% of live component generation traffic is now routed through Prompt B. Expected quality lift: +18.4%.
              </p>
            </div>
          </div>
          <Badge variant="success" className="font-semibold">
            Active in Production
          </Badge>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{experimentTitle}</h2>
            <Badge variant="outline" className="font-mono text-xs">
              {testSampleCount}
            </Badge>
            <Badge
              variant="success"
              className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              <span>Prompt B Winner · +18.4% Quality Lift</span>
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
            Automated LLM Judge Shootout · Evaluator:{' '}
            <span className="text-foreground font-medium">Claude 3.5 Sonnet (Temp 0.0)</span> ·{' '}
            <span className="text-foreground font-medium">50 Test Cases</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 shadow-xs"
            disabled={isRunning}
            onClick={runComparison}
          >
            {isRunning ? (
              <span className="border-primary size-3.5 animate-spin rounded-full border-2 border-t-transparent" />
            ) : (
              <Play className="size-3.5 fill-current" aria-hidden="true" />
            )}
            <span>{isRunning ? 'Evaluating 50 Prompts...' : 'Run A/B Comparison'}</span>
            <kbd className="bg-muted text-muted-foreground hidden items-center rounded px-1.5 py-0.5 font-mono text-xs sm:inline-flex">
              ⌘↵
            </kbd>
          </Button>

          <Button
            size="sm"
            variant="default"
            disabled={isPromoted}
            className="gap-1.5 shadow-xs"
            onClick={promotePromptB}
          >
            <Rocket className="size-3.5" aria-hidden="true" />
            <span>{isPromoted ? 'Prompt B Active in Prod' : 'Promote Prompt B to Production'}</span>
          </Button>
        </div>
      </div>

      {/* Common Input Test Prompt Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                <Code2 className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Common Input Test Prompt (Evaluation Benchmark)</CardTitle>
                <CardDescription className="text-xs">
                  Standardized input payload dispatched to both prompt candidate configurations
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {currentTestCase.number} of 50
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {currentTestCase.category}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Test Prompt Text */}
          <div className="border-border bg-muted/40 text-foreground flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Terminal className="text-primary size-4 shrink-0" />
              <code className="font-mono text-xs leading-relaxed font-semibold">"{currentTestCase.prompt}"</code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
              onClick={() => copyToClipboard('test-prompt', currentTestCase.prompt)}
            >
              {copiedState['test-prompt'] ? (
                <Check className="text-success mr-1 size-3.5" />
              ) : (
                <Copy className="mr-1 size-3.5" />
              )}
              <span>{copiedState['test-prompt'] ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>

          {/* Meta chips / specifications */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-muted-foreground text-xs font-medium">Benchmark Spec:</span>
            <span className="border-border bg-muted/30 text-foreground rounded-md border px-2 py-0.5 font-mono text-xs">
              target: {currentTestCase.componentTarget}
            </span>
            <span className="border-border bg-muted/30 text-foreground rounded-md border px-2 py-0.5 font-mono text-xs">
              framework: Vue 3.5 SFC
            </span>
            <span className="border-border bg-muted/30 text-foreground rounded-md border px-2 py-0.5 font-mono text-xs">
              engine: class-variance-authority + reka-ui
            </span>
            <span className="border-border bg-muted/30 text-foreground rounded-md border px-2 py-0.5 font-mono text-xs">
              isolation: zero-ssr-circular-imports
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Side-by-Side Prompt Arena */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Prompt A (Baseline - Control) */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs font-semibold">
                    {promptAData.label} · {promptAData.variantName}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Model: <span className="text-foreground font-medium">{promptAData.model}</span> · Temp:{' '}
                  <span className="font-mono font-medium tabular-nums">{promptAData.temperature}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="border-border/80 font-mono text-xs">
                  Score: <span className="text-foreground ml-1 font-bold tabular-nums">82/100</span>
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Tabs for Prompt A */}
            <Tabs defaultValue="output" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-64 grid-cols-2">
                  <TabsTrigger value="output">Generated Output</TabsTrigger>
                  <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                </TabsList>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                  onClick={() => copyToClipboard('prompt-a-code', promptAData.outputCode)}
                >
                  {copiedState['prompt-a-code'] ? (
                    <Check className="text-success mr-1 size-3.5" />
                  ) : (
                    <Copy className="mr-1 size-3.5" />
                  )}
                  <span>{copiedState['prompt-a-code'] ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>

              {/* Output Code Tab */}
              <TabsContent value="output" className="mt-3">
                <div className="relative">
                  <pre className="border-border bg-muted/40 text-foreground max-h-[300px] overflow-x-auto overflow-y-auto rounded-md border p-3 font-mono text-xs leading-relaxed">
                    <code>{promptAData.outputCode}</code>
                  </pre>
                </div>
              </TabsContent>

              {/* System Prompt Tab */}
              <TabsContent value="prompt" className="mt-3">
                <div className="border-border bg-muted/20 text-foreground max-h-[300px] min-h-[160px] overflow-y-auto rounded-md border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {promptAData.systemPrompt}
                </div>
              </TabsContent>
            </Tabs>

            {/* Performance Metrics Bar */}
            <div className="border-border bg-muted/20 grid grid-cols-3 gap-2 rounded-lg border p-3 text-center">
              <div className="space-y-0.5">
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
                  <Clock className="size-3" />
                  <span>Latency</span>
                </span>
                <p className="text-foreground font-mono text-sm font-semibold tabular-nums">{promptAData.latency}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
                  <Cpu className="size-3" />
                  <span>Output Tokens</span>
                </span>
                <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                  {promptAData.outputTokens}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
                  <Coins className="size-3" />
                  <span>Cost / Call</span>
                </span>
                <p className="text-foreground font-mono text-sm font-semibold tabular-nums">{promptAData.cost}</p>
              </div>
            </div>

            {/* Judge Score & Critique Box */}
            <div className="border-border bg-card/60 space-y-2 rounded-lg border p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="text-muted-foreground size-4" />
                  <span className="text-foreground text-xs font-semibold">Judge Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-mono text-base font-bold tabular-nums">
                    {promptAData.judgeScore} / 100
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {promptAData.judgeStatus}
                  </Badge>
                </div>
              </div>
              <div className="border-border/60 bg-muted/40 text-muted-foreground flex items-start gap-2 rounded-md border p-2.5 text-xs leading-relaxed">
                <AlertCircle className="text-warning mt-0.5 size-3.5 shrink-0" />
                <span>
                  <strong>Critique:</strong> {promptAData.critique}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Prompt B (Challenger with Rules - WINNER) */}
        <Card className="border-emerald-500/40 bg-emerald-500/[0.015] shadow-xs dark:border-emerald-500/30 dark:bg-emerald-950/[0.06]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="success"
                    className="border-emerald-500/30 bg-emerald-500/15 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                  >
                    {promptBData.label} · {promptBData.variantName}
                  </Badge>
                  <Badge variant="success" className="gap-1 font-semibold">
                    <Trophy className="size-3" />
                    <span>{promptBData.judgeStatus}</span>
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Model: <span className="text-foreground font-medium">{promptBData.model}</span> · Temp:{' '}
                  <span className="font-mono font-medium tabular-nums">{promptBData.temperature}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="success"
                  className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400"
                >
                  Score: <span className="ml-1 tabular-nums">96/100</span>
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Tabs for Prompt B */}
            <Tabs defaultValue="output" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-64 grid-cols-2">
                  <TabsTrigger value="output">Generated Output</TabsTrigger>
                  <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                </TabsList>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                  onClick={() => copyToClipboard('prompt-b-code', promptBData.outputCode)}
                >
                  {copiedState['prompt-b-code'] ? (
                    <Check className="text-success mr-1 size-3.5" />
                  ) : (
                    <Copy className="mr-1 size-3.5" />
                  )}
                  <span>{copiedState['prompt-b-code'] ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>

              {/* Output Code Tab */}
              <TabsContent value="output" className="mt-3">
                <div className="relative">
                  <pre className="border-border bg-muted/40 text-foreground max-h-[300px] overflow-x-auto overflow-y-auto rounded-md border p-3 font-mono text-xs leading-relaxed">
                    <code>{promptBData.outputCode}</code>
                  </pre>
                </div>
              </TabsContent>

              {/* System Prompt Tab */}
              <TabsContent value="prompt" className="mt-3">
                <div className="border-border bg-muted/20 text-foreground max-h-[300px] min-h-[160px] overflow-y-auto rounded-md border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {promptBData.systemPrompt}
                </div>
              </TabsContent>
            </Tabs>

            {/* Performance Metrics Bar with Deltas */}
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-center">
              <div className="space-y-0.5">
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
                  <Clock className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Latency</span>
                </span>
                <p className="text-foreground font-mono text-sm font-semibold tabular-nums">{promptBData.latency}</p>
                <p className="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {promptBData.latencyDelta}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
                  <Cpu className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Output Tokens</span>
                </span>
                <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                  {promptBData.outputTokens}
                </p>
                <p className="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {promptBData.tokensDelta}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
                  <Coins className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Cost / Call</span>
                </span>
                <p className="text-foreground font-mono text-sm font-semibold tabular-nums">{promptBData.cost}</p>
                <p className="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {promptBData.costDelta}
                </p>
              </div>
            </div>

            {/* Judge Score & Critique Box */}
            <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-foreground text-xs font-semibold">Judge Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {promptBData.judgeScore} / 100
                  </span>
                  <Badge variant="success" className="text-xs font-semibold">
                    {promptBData.judgeDelta}
                  </Badge>
                </div>
              </div>
              <div className="text-muted-foreground flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] p-2.5 text-xs leading-relaxed">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>Critique:</strong> {promptBData.critique}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automated Judge Verdict Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-foreground text-base font-semibold">
                  Automated LLM Judge Benchmark Verdict
                </CardTitle>
                <Badge
                  variant="success"
                  className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  Prompt B Won 42 of 50 Tests · 84% Win Rate
                </Badge>
              </div>
              <CardDescription className="mt-1 text-xs">
                Direct comparison of code quality, SSR compatibility, type correctness, and token economics across 50
                golden evaluation prompts.
              </CardDescription>
            </div>

            <div className="border-border/80 bg-muted/30 flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 text-xs sm:self-auto">
              <span className="text-muted-foreground">Judge Model:</span>
              <span className="text-foreground font-mono font-semibold">Claude 3.5 Sonnet (Temp 0.0)</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 4 Primary Aggregate Metric Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryMetrics.map((metric) => (
              <Card
                key={metric.id}
                className={cn(
                  'border-border bg-card/70 hover:border-border/80 shadow-xs transition-colors',
                  metric.highlight && 'border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.1]',
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      {metric.label}
                    </CardTitle>
                    <Badge variant={metric.badgeVariant} className="text-xs font-medium tabular-nums">
                      {metric.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 pb-4">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        'text-2xl font-bold tracking-tight tabular-nums sm:text-3xl',
                        metric.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                      )}
                    >
                      {metric.value}
                    </span>
                    {metric.subvalue && (
                      <span className="text-muted-foreground text-xs font-normal tabular-nums">
                        ({metric.subvalue})
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Rubric Matrix Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-foreground text-sm font-semibold">Evaluation Rubric &amp; Dimension Delta Matrix</h4>
              <span className="text-muted-foreground text-xs">Evaluated on AST parse &amp; runtime verification</span>
            </div>

            <div className="border-border overflow-hidden rounded-lg border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-foreground text-xs font-semibold">Evaluation Dimension</TableHead>
                      <TableHead className="text-foreground text-xs font-semibold">Prompt A (Baseline)</TableHead>
                      <TableHead className="text-foreground text-xs font-semibold">Prompt B (Challenger)</TableHead>
                      <TableHead className="text-foreground text-right text-xs font-semibold">Score Delta</TableHead>
                      <TableHead className="text-foreground text-xs font-semibold">Automated Judge Finding</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rubricDimensions.map((rubric) => (
                      <TableRow
                        key={rubric.id}
                        className="border-border bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] dark:bg-emerald-500/[0.03]"
                      >
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-foreground text-xs font-semibold">{rubric.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 font-mono text-xs tabular-nums">
                          {rubric.promptAScore}
                        </TableCell>
                        <TableCell className="py-3.5 font-mono text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                          {rubric.promptBScore}
                        </TableCell>
                        <TableCell className="py-3.5 text-right">
                          <Badge variant="success" className="text-xs font-semibold tabular-nums">
                            {rubric.delta}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 text-xs leading-relaxed">
                          {rubric.insight}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Sample Golden Dataset Top Runs Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-foreground text-sm font-semibold">Golden Evaluation Suite (Top Sample Runs)</h4>
              <Badge variant="outline" className="font-mono text-xs">
                5 of 50 Samples Shown
              </Badge>
            </div>

            <div className="border-border overflow-hidden rounded-lg border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-foreground text-xs font-semibold">Test Case</TableHead>
                      <TableHead className="text-foreground text-xs font-semibold">Category</TableHead>
                      <TableHead className="text-foreground text-right text-xs font-semibold">Prompt A Score</TableHead>
                      <TableHead className="text-foreground text-right text-xs font-semibold">Prompt B Score</TableHead>
                      <TableHead className="text-foreground text-right text-xs font-semibold">Score Delta</TableHead>
                      <TableHead className="text-foreground text-right text-xs font-semibold">Winner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goldenTests.map((gt) => (
                      <TableRow key={gt.id} className="border-border hover:bg-muted/30 transition-colors">
                        <TableCell className="text-foreground py-3 font-mono text-xs font-medium">{gt.name}</TableCell>
                        <TableCell className="py-3 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {gt.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3 text-right font-mono text-xs tabular-nums">
                          {gt.promptAScore} / 100
                        </TableCell>
                        <TableCell className="py-3 text-right font-mono text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                          {gt.promptBScore} / 100
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className="font-mono text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                            {gt.delta} pts
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Badge variant="success" className="text-xs font-semibold">
                            {gt.winner}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PromptAbTestingComparator
