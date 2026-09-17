'use client'

import * as React from 'react'
import {
  Activity,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Compass,
  Copy,
  FastForward,
  FileCode2,
  FileText,
  Globe,
  Layers,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Props {
  className?: string
}

type AgentId = 'planner' | 'researcher' | 'engineer' | 'reviewer'
type NodeStatus = 'completed' | 'running' | 'queued'

interface ThoughtStep {
  id: string
  title: string
  duration: string
  status: 'completed' | 'running' | 'queued'
  detail: string
}

interface ToolInvocation {
  name: string
  count: number
  icon: string
}

interface AgentNode {
  id: AgentId
  stepNumber: number
  name: string
  role: string
  iconName: string
  model: string
  status: NodeStatus
  duration: string
  task: string
  tokens: string
  speed: string
  progress: number
  tools: ToolInvocation[]
  thoughts: ThoughtStep[]
  artifactFileName: string
  artifactSize: string
  artifactCode: string
}

const initialCodeSnippet = `import * as React from 'react'
import { useAgentGraph } from '@/hooks/useAgentGraph'

export interface AgentWorkflowConfig {
  pipelineId: string
  name: string
  autonomousMode: boolean
  maxRetries: number
  timeoutMs: number
}

export interface ExecutionArtifact {
  fileName: string
  language: string
  content: string
  checksum: string
}

export async function dispatchAgentWorkflow(
  config: AgentWorkflowConfig
): Promise<ExecutionArtifact[]> {
  const orchestrator = new MultiAgentEngine({
    model: 'claude-3-5-sonnet',
    telemetry: true,
  })

  // Stream reasoning thoughts and token outputs
  const stream = await orchestrator.executePipeline(config.pipelineId)
  return stream.collectArtifacts()
}`

const initialNodes: AgentNode[] = [
  {
    id: 'planner',
    stepNumber: 1,
    name: 'Planner Agent',
    role: 'Task Decomposition & Schema',
    iconName: 'Compass',
    model: 'Claude 3.5',
    status: 'completed',
    duration: '12s',
    task: 'Deconstruct task into 4 sub-goals',
    tokens: '842 tokens',
    speed: '52 tok/s',
    progress: 100,
    tools: [
      { name: 'spec_parse', count: 1, icon: 'Terminal' },
      { name: 'context_index', count: 4, icon: 'FileText' },
    ],
    thoughts: [
      {
        id: 'p1',
        title: 'Analyze project manifest and user constraints',
        duration: '3.2s',
        status: 'completed',
        detail:
          'Identified dual-framework registry requirement (Vue SFC + React TSX) with Tailwind v4 OKLCH token mapping.',
      },
      {
        id: 'p2',
        title: 'Partition workflow into 4 autonomous agent stages',
        duration: '8.8s',
        status: 'completed',
        detail: 'Created topological execution graph: Planner -> Researcher -> Code Engineer -> Reviewer & QA.',
      },
    ],
    artifactFileName: 'pipeline-manifest.json',
    artifactSize: '1.1 kB',
    artifactCode: `{\n  "pipeline": "autonomous-research-codegen",\n  "stages": 4,\n  "target": "UIPKGE Block Registry",\n  "strictMode": true\n}`,
  },
  {
    id: 'researcher',
    stepNumber: 2,
    name: 'Research Agent',
    role: 'Documentation & API Contracts',
    iconName: 'Search',
    model: 'GPT-4o',
    status: 'completed',
    duration: '45s',
    task: 'Query documentation and verify API contracts',
    tokens: '1,420 tokens',
    speed: '64 tok/s',
    progress: 100,
    tools: [
      { name: 'web_search', count: 2, icon: 'Globe' },
      { name: 'doc_scrape', count: 6, icon: 'FileText' },
    ],
    thoughts: [
      {
        id: 'r1',
        title: 'Verify Reka UI and Radix UI primitive specifications',
        duration: '18s',
        status: 'completed',
        detail: 'Confirmed Radix Progress and Reka Progress Root/Indicator element bindings for zero-drift parity.',
      },
      {
        id: 'r2',
        title: 'Check Lucide icon availability in Vue and React packages',
        duration: '27s',
        status: 'completed',
        detail:
          'Validated Compass, Search, Code2, ShieldCheck, FastForward, RotateCcw, RefreshCw icons across registries.',
      },
    ],
    artifactFileName: 'api-contracts.d.ts',
    artifactSize: '1.8 kB',
    artifactCode: `export interface NodeContract {\n  id: string\n  status: 'completed' | 'running' | 'queued'\n  duration: string\n}`,
  },
  {
    id: 'engineer',
    stepNumber: 3,
    name: 'Code Engineer Agent',
    role: 'Component Synthesis & Tests',
    iconName: 'Code2',
    model: 'Claude 3.5',
    status: 'running',
    duration: '1m 17s',
    task: 'Generate component architecture & unit tests',
    tokens: '2,840 tokens',
    speed: '48 tok/s',
    progress: 68,
    tools: [
      { name: 'web_search', count: 2, icon: 'Globe' },
      { name: 'file_read', count: 8, icon: 'FileText' },
      { name: 'ast_parse', count: 1, icon: 'Terminal' },
      { name: 'typecheck', count: 1, icon: 'ShieldCheck' },
    ],
    thoughts: [
      {
        id: 't1',
        title: 'Parse upstream specifications from Planner & Research Agent',
        duration: '14ms',
        status: 'completed',
        detail:
          'Loaded 4 sub-goal definitions. Validated schema definitions for Reka UI and Radix UI primitive bindings.',
      },
      {
        id: 't2',
        title: 'Synthesize component state machine & reactive bindings',
        duration: '420ms',
        status: 'completed',
        detail:
          'Constructed state flow machine for pipeline progression. Hooked up active execution timers and streaming buffers.',
      },
      {
        id: 't3',
        title: 'Construct test matrix with boundary coverage',
        duration: '850ms',
        status: 'completed',
        detail:
          'Generated unit test cases covering step navigation, retry triggers, state pausing, and copy payload verification.',
      },
      {
        id: 't4',
        title: 'Stream production TypeScript & TSX definitions',
        duration: '1m 17s',
        status: 'running',
        detail:
          'Writing template layout with responsive CSS grid, glowing node state markers, tool invocation badge metrics, and dark-mode safe styling.',
      },
    ],
    artifactFileName: 'AiAgentOrchestrator.tsx',
    artifactSize: '2.4 kB',
    artifactCode: initialCodeSnippet,
  },
  {
    id: 'reviewer',
    stepNumber: 4,
    name: 'Reviewer & QA Agent',
    role: 'Typecheck & Token Audit',
    iconName: 'ShieldCheck',
    model: 'Claude 3.5',
    status: 'queued',
    duration: '0s',
    task: 'Validate TypeScript types and token standards',
    tokens: '0 tokens',
    speed: '0 tok/s',
    progress: 0,
    tools: [
      { name: 'typecheck', count: 1, icon: 'ShieldCheck' },
      { name: 'token_audit', count: 1, icon: 'Terminal' },
    ],
    thoughts: [
      {
        id: 'q1',
        title: 'Perform static type-safety and interface contract validation',
        duration: '0s',
        status: 'queued',
        detail:
          'Awaiting Code Engineer stream completion to run full TypeScript compiler validation without any types.',
      },
      {
        id: 'q2',
        title: 'Verify minimum 12px font scale and OKLCH color token conformance',
        duration: '0s',
        status: 'queued',
        detail: 'Scanning AST for forbidden sub-12px micro-classes and hardcoded hex color values.',
      },
    ],
    artifactFileName: 'qa-audit-report.md',
    artifactSize: '0.9 kB',
    artifactCode: `# QA Verification Gate\n- [ ] TypeScript parity check\n- [ ] Design token conformance\n- [ ] Accessibility keyboard focus`,
  },
]

export function AiAgentOrchestrator({ className }: Props) {
  const [isPaused, setIsPaused] = React.useState(false)
  const [elapsedSeconds, setElapsedSeconds] = React.useState(134)
  const [selectedAgentId, setSelectedAgentId] = React.useState<AgentId>('engineer')
  const [activeStepIndex, setActiveStepIndex] = React.useState(2)
  const [copied, setCopied] = React.useState(false)
  const [nodes, setNodes] = React.useState<AgentNode[]>(initialNodes)
  const [expandedThoughts, setExpandedThoughts] = React.useState<Record<string, boolean>>({
    t1: false,
    t2: false,
    t3: false,
    t4: true,
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused && activeStepIndex < 4) {
        setElapsedSeconds((prev) => prev + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [isPaused, activeStepIndex])

  const selectedAgent = React.useMemo(() => {
    return nodes.find((n) => n.id === selectedAgentId) ?? nodes[2]
  }, [nodes, selectedAgentId])

  const formattedTime = React.useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60)
    const secs = elapsedSeconds % 60
    return `${mins.toString().padStart(2, '0')}m:${secs.toString().padStart(2, '0')}s`
  }, [elapsedSeconds])

  const overallProgress = React.useMemo(() => {
    const completedCount = nodes.filter((n) => n.status === 'completed').length
    const running = nodes.find((n) => n.status === 'running')
    const runningBonus = running ? running.progress / 100 : 0
    return Math.round(((completedCount + runningBonus) / nodes.length) * 100)
  }, [nodes])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const selectAgent = (id: AgentId) => {
    setSelectedAgentId(id)
  }

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAllThoughts = () => {
    const anyClosed = selectedAgent.thoughts.some((t) => !expandedThoughts[t.id])
    const next: Record<string, boolean> = { ...expandedThoughts }
    selectedAgent.thoughts.forEach((t) => {
      next[t.id] = anyClosed
    })
    setExpandedThoughts(next)
  }

  const stepForward = () => {
    if (activeStepIndex < nodes.length - 1) {
      setNodes((prev) => {
        const next = [...prev]
        next[activeStepIndex] = { ...next[activeStepIndex], status: 'completed', progress: 100 }
        const nextIdx = activeStepIndex + 1
        next[nextIdx] = { ...next[nextIdx], status: 'running', progress: 45 }
        return next
      })
      const nextIdx = activeStepIndex + 1
      setActiveStepIndex(nextIdx)
      setSelectedAgentId(nodes[nextIdx].id)
    } else if (activeStepIndex === nodes.length - 1) {
      setNodes((prev) => {
        const next = [...prev]
        next[activeStepIndex] = { ...next[activeStepIndex], status: 'completed', progress: 100 }
        return next
      })
      setActiveStepIndex(4)
    }
  }

  const retryStep = () => {
    if (activeStepIndex < nodes.length) {
      setNodes((prev) => {
        const next = [...prev]
        next[activeStepIndex] = { ...next[activeStepIndex], status: 'running', progress: 10 }
        return next
      })
      setSelectedAgentId(nodes[activeStepIndex].id)
    }
  }

  const rerunPipeline = () => {
    setElapsedSeconds(0)
    setIsPaused(false)
    setActiveStepIndex(0)
    setNodes((prev) =>
      prev.map((node, idx) => ({
        ...node,
        status: idx === 0 ? 'running' : 'queued',
        progress: idx === 0 ? 25 : 0,
      })),
    )
    setSelectedAgentId('planner')
  }

  const cancelWorkflow = () => {
    setIsPaused(true)
  }

  const copyArtifact = async () => {
    try {
      await navigator.clipboard.writeText(selectedAgent.artifactCode)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      // Clipboard fallback
    }
  }

  const renderAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'planner':
        return <Compass className="size-5" />
      case 'researcher':
        return <Search className="size-5" />
      case 'engineer':
        return <Code2 className="size-5" />
      case 'reviewer':
        return <ShieldCheck className="size-5" />
    }
  }

  const renderToolIcon = (icon: string) => {
    switch (icon) {
      case 'Globe':
        return <Globe className="text-muted-foreground size-3.5" />
      case 'FileText':
        return <FileText className="text-muted-foreground size-3.5" />
      case 'Terminal':
        return <Terminal className="text-muted-foreground size-3.5" />
      default:
        return <ShieldCheck className="text-muted-foreground size-3.5" />
    }
  }

  return (
    <div data-slot="ai-agent-orchestrator" className={cn('w-full space-y-6', className)}>
      {/* Top Header Bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5 sm:items-center">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-11 shrink-0 items-center justify-center rounded-xl border">
              <Bot className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                  Autonomous Research & Code Generation Squad
                </h2>
              </div>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono">Pipeline ID: pipe-892f4c</span>
                <span>•</span>
                <span>4 Agents Orchestrated</span>
                <span>•</span>
                <span>Target: UIPKGE Registry Block</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Badge */}
            {!isPaused && activeStepIndex < 4 ? (
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary shadow-xs">
                <span className="relative mr-1.5 flex size-2">
                  <span className="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                  <span className="bg-primary relative inline-flex size-2 rounded-full" />
                </span>
                Running • Step {Math.min(activeStepIndex + 1, 4)} of 4
              </Badge>
            ) : isPaused ? (
              <Badge variant="warning" className="shadow-xs">
                <Pause className="mr-1 size-3" />
                Paused • Step {Math.min(activeStepIndex + 1, 4)} of 4
              </Badge>
            ) : (
              <Badge variant="success" className="shadow-xs">
                <CheckCircle2 className="mr-1 size-3" />
                Completed • 4 of 4 Steps
              </Badge>
            )}

            {/* Timer */}
            <div className="border-border bg-muted/40 text-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium">
              <Clock className="text-muted-foreground size-3.5" />
              <span>{formattedTime}</span>
            </div>

            {/* Controls */}
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={togglePause}>
              {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              <span>{isPaused ? 'Resume Workflow' : 'Pause Workflow'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 gap-1 text-xs"
              onClick={cancelWorkflow}
            >
              <X className="size-3.5" />
              <span>Cancel</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent Flow Pipeline Nodes (Horizontal Connected Flow) */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Agent Execution Graph</CardTitle>
              <CardDescription className="text-xs">
                Real-time multi-agent execution pipeline. Select any node to inspect telemetry.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">Pipeline Progress</span>
              <div className="bg-muted h-2 w-28 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold">{overallProgress}%</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Node 1: Planner Agent */}
            <button
              type="button"
              className={cn(
                'group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                selectedAgentId === 'planner'
                  ? 'border-primary ring-primary/30 shadow-xs ring-2'
                  : 'border-border hover:border-muted-foreground/40',
                nodes[0].status === 'completed'
                  ? 'bg-card'
                  : nodes[0].status === 'running'
                    ? 'border-primary/60 bg-primary/[0.03]'
                    : 'bg-muted/20 opacity-75',
              )}
              aria-pressed={selectedAgentId === 'planner'}
              onClick={() => selectAgent('planner')}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-lg border text-xs',
                        nodes[0].status === 'completed'
                          ? 'border-success/30 bg-success/10 text-success'
                          : nodes[0].status === 'running'
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      <Compass className="size-4" />
                    </div>
                    <div>
                      <p className="text-foreground text-xs leading-none font-semibold">Planner Agent</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">Stage 01</p>
                    </div>
                  </div>

                  {nodes[0].status === 'completed' ? (
                    <Badge variant="success" className="gap-1 text-xs">
                      <Check className="size-3" />
                      12s
                    </Badge>
                  ) : nodes[0].status === 'running' ? (
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs">
                      Running
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      Queued
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    Deconstruct task into 4 sub-goals
                  </p>
                </div>
              </div>

              <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
                <span className="text-muted-foreground font-mono">Claude 3.5</span>
                <span className="text-foreground font-medium">100% done</span>
              </div>
            </button>

            {/* Node 2: Research Agent */}
            <button
              type="button"
              className={cn(
                'group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                selectedAgentId === 'researcher'
                  ? 'border-primary ring-primary/30 shadow-xs ring-2'
                  : 'border-border hover:border-muted-foreground/40',
                nodes[1].status === 'completed'
                  ? 'bg-card'
                  : nodes[1].status === 'running'
                    ? 'border-primary/60 bg-primary/[0.03]'
                    : 'bg-muted/20 opacity-75',
              )}
              aria-pressed={selectedAgentId === 'researcher'}
              onClick={() => selectAgent('researcher')}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-lg border text-xs',
                        nodes[1].status === 'completed'
                          ? 'border-success/30 bg-success/10 text-success'
                          : nodes[1].status === 'running'
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      <Search className="size-4" />
                    </div>
                    <div>
                      <p className="text-foreground text-xs leading-none font-semibold">Research Agent</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">Stage 02</p>
                    </div>
                  </div>

                  {nodes[1].status === 'completed' ? (
                    <Badge variant="success" className="gap-1 text-xs">
                      <Check className="size-3" />
                      45s
                    </Badge>
                  ) : nodes[1].status === 'running' ? (
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs">
                      Running
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      Queued
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    Query documentation and verify API contracts
                  </p>
                </div>
              </div>

              <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
                <span className="text-muted-foreground font-mono">GPT-4o</span>
                <span className="text-foreground font-medium">100% done</span>
              </div>
            </button>

            {/* Node 3: Code Engineer Agent */}
            <button
              type="button"
              className={cn(
                'group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                selectedAgentId === 'engineer'
                  ? 'border-primary ring-primary/40 shadow-xs ring-2'
                  : 'border-border hover:border-muted-foreground/40',
                nodes[2].status === 'completed'
                  ? 'bg-card'
                  : nodes[2].status === 'running'
                    ? 'border-primary/60 bg-primary/[0.04]'
                    : 'bg-muted/20 opacity-75',
              )}
              aria-pressed={selectedAgentId === 'engineer'}
              onClick={() => selectAgent('engineer')}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-lg border text-xs',
                        nodes[2].status === 'completed'
                          ? 'border-success/30 bg-success/10 text-success'
                          : nodes[2].status === 'running'
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      <Code2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-foreground text-xs leading-none font-semibold">Code Engineer</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">Stage 03</p>
                    </div>
                  </div>

                  {nodes[2].status === 'completed' ? (
                    <Badge variant="success" className="gap-1 text-xs">
                      <Check className="size-3" />
                      1m 17s
                    </Badge>
                  ) : nodes[2].status === 'running' ? (
                    <Badge
                      variant="outline"
                      className="border-primary/50 bg-primary/15 text-primary text-xs font-medium"
                    >
                      <span className="relative mr-1 flex size-1.5">
                        <span className="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                        <span className="bg-primary relative inline-flex size-1.5 rounded-full" />
                      </span>
                      Streaming
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      Queued
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    Generate component architecture & unit tests
                  </p>
                </div>
              </div>

              <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
                <span className="text-muted-foreground font-mono">Claude 3.5</span>
                <span className="text-primary font-medium">{nodes[2].progress}% active</span>
              </div>
            </button>

            {/* Node 4: Reviewer & QA Agent */}
            <button
              type="button"
              className={cn(
                'group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                selectedAgentId === 'reviewer'
                  ? 'border-primary ring-primary/30 shadow-xs ring-2'
                  : 'border-border/80 hover:border-muted-foreground/40',
                nodes[3].status === 'completed'
                  ? 'bg-card'
                  : nodes[3].status === 'running'
                    ? 'border-primary/60 bg-primary/[0.03]'
                    : 'bg-muted/15 border-dashed',
              )}
              aria-pressed={selectedAgentId === 'reviewer'}
              onClick={() => selectAgent('reviewer')}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-lg border text-xs',
                        nodes[3].status === 'completed'
                          ? 'border-success/30 bg-success/10 text-success'
                          : nodes[3].status === 'running'
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-border bg-muted/60 text-muted-foreground',
                      )}
                    >
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-foreground text-xs leading-none font-semibold">Reviewer & QA</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">Stage 04</p>
                    </div>
                  </div>

                  {nodes[3].status === 'completed' ? (
                    <Badge variant="success" className="gap-1 text-xs">
                      <Check className="size-3" />
                      Passed
                    </Badge>
                  ) : nodes[3].status === 'running' ? (
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs">
                      Running
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground border-border/80 text-xs">
                      Queued
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    Validate TypeScript types and token standards
                  </p>
                </div>
              </div>

              <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
                <span className="text-muted-foreground font-mono">Claude 3.5</span>
                <span className="text-muted-foreground font-medium">Pending</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Active Execution Detail Panel (2-Column Bento) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Agent Overview, Thought Stream & Tool Invocations */}
        <div className="space-y-6 lg:col-span-7">
          {/* Active Agent Header & Progress */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 flex size-10 items-center justify-center rounded-lg border">
                    {renderAgentIcon(selectedAgent.id)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base font-semibold">{selectedAgent.name}</CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        {selectedAgent.model}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{selectedAgent.task}</CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedAgent.status === 'completed' ? (
                    <Badge variant="success" className="text-xs">
                      Completed in {selectedAgent.duration}
                    </Badge>
                  ) : selectedAgent.status === 'running' ? (
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs">
                      <Activity className="mr-1 size-3 animate-pulse" />
                      Streaming • {selectedAgent.duration}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      Queued
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="space-y-1.5">
                <div className="text-muted-foreground flex justify-between text-xs font-medium">
                  <span>Task Execution State</span>
                  <span className="font-mono">{selectedAgent.progress}%</span>
                </div>
                <Progress value={selectedAgent.progress} className="h-2" />
              </div>

              <div className="bg-muted/30 border-border grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-xs">Duration</p>
                  <p className="text-foreground font-mono text-xs font-semibold">{selectedAgent.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Tokens Output</p>
                  <p className="text-foreground font-mono text-xs font-semibold">{selectedAgent.tokens}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Throughput</p>
                  <p className="text-foreground font-mono text-xs font-semibold">{selectedAgent.speed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Agent Role</p>
                  <p className="text-foreground truncate text-xs font-semibold">{selectedAgent.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Thought Stream Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles className="text-primary size-4" />
                <CardTitle className="text-sm font-semibold">Agent Thought Stream & Reasoning</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground hover:text-foreground h-7 text-xs"
                onClick={toggleAllThoughts}
              >
                Toggle Details
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              {selectedAgent.thoughts.map((thought) => (
                <div
                  key={thought.id}
                  className="border-border bg-muted/20 hover:bg-muted/30 rounded-lg border transition-colors"
                >
                  <button
                    type="button"
                    className="focus-visible:ring-ring flex w-full cursor-pointer items-center justify-between rounded-lg p-3 text-left focus-visible:ring-2 focus-visible:outline-none"
                    aria-expanded={expandedThoughts[thought.id]}
                    onClick={() => toggleThought(thought.id)}
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full',
                          thought.status === 'completed'
                            ? 'text-success'
                            : thought.status === 'running'
                              ? 'text-primary animate-spin'
                              : 'text-muted-foreground',
                        )}
                      >
                        {thought.status === 'completed' ? (
                          <CheckCircle2 className="size-4" />
                        ) : thought.status === 'running' ? (
                          <Activity className="size-4" />
                        ) : (
                          <div className="border-muted-foreground size-3 rounded-full border border-dashed" />
                        )}
                      </div>
                      <p className="text-foreground text-xs font-medium">{thought.title}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {thought.duration}
                      </Badge>
                      {expandedThoughts[thought.id] ? (
                        <ChevronDown className="text-muted-foreground size-3.5" />
                      ) : (
                        <ChevronRight className="text-muted-foreground size-3.5" />
                      )}
                    </div>
                  </button>

                  {expandedThoughts[thought.id] && (
                    <div className="border-border/60 bg-muted/40 text-muted-foreground border-t px-3 py-2.5 text-xs leading-relaxed">
                      {thought.detail}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tool Invocations Badge Row & Logs */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Terminal className="text-primary size-4" />
                <CardTitle className="text-sm font-semibold">Active Tool Invocations</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              {/* Badge Row */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedAgent.tools.map((tool) => (
                  <Badge
                    key={tool.name}
                    variant="outline"
                    className="border-border bg-muted/40 hover:bg-muted text-foreground gap-1.5 px-2.5 py-1 text-xs font-medium"
                  >
                    {renderToolIcon(tool.icon)}
                    <span className="font-mono">{tool.name}</span>
                    <span className="bg-primary/10 text-primary py-0.2 rounded-full px-1.5 text-xs font-bold">
                      {tool.count}
                    </span>
                  </Badge>
                ))}
              </div>

              {/* Execution Log Terminal Row */}
              <div className="border-border bg-muted/50 overflow-x-auto rounded-lg border p-3 font-mono text-xs">
                <div className="text-muted-foreground space-y-1">
                  <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                    <span className="text-success font-semibold">[02:14:02]</span>
                    <span>GET https://uipkge.dev/r/button.json → 200 OK (38ms)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                    <span className="text-success font-semibold">[02:14:05]</span>
                    <span>READ packages/registry-react/components/card/card.tsx (12ms)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-primary font-semibold">[02:14:09]</span>
                    <span>AST parse: 4 exports identified, 0 cycle violations</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                    <span className="text-success font-semibold">[02:14:14]</span>
                    <span>Typecheck: 0 errors across 6 test suites</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Artifact Output & Pipeline Actions */}
        <div className="space-y-6 lg:col-span-5">
          {/* Live Artifact Output Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex flex-wrap items-center gap-2 overflow-hidden">
                <FileCode2 className="text-primary size-4 shrink-0" />
                <CardTitle className="truncate font-mono text-xs font-medium">
                  {selectedAgent.artifactFileName}
                </CardTitle>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {selectedAgent.artifactSize}
                </Badge>
                <Button variant="outline" size="xs" className="h-7 gap-1 text-xs" onClick={copyArtifact}>
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="border-border bg-muted/40 relative overflow-hidden rounded-lg border font-mono text-xs">
                {/* Window top bar */}
                <div className="border-border/60 bg-muted/60 flex items-center justify-between border-b px-3 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-destructive/60 size-2.5 rounded-full" />
                    <div className="bg-warning/60 size-2.5 rounded-full" />
                    <div className="bg-success/60 size-2.5 rounded-full" />
                  </div>
                  <span className="text-muted-foreground text-xs">Live Generated Output</span>
                </div>

                {/* Code area with syntax styling */}
                <div className="max-h-[380px] overflow-auto p-3 text-xs leading-relaxed">
                  <pre className="text-foreground font-mono whitespace-pre-wrap">
                    <code>{selectedAgent.artifactCode}</code>
                  </pre>
                  {selectedAgent.status === 'running' && (
                    <span className="bg-primary ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Action Controls */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Layers className="text-primary size-4" />
                <CardTitle className="text-sm font-semibold">Pipeline Orchestrator Controls</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs font-medium"
                  disabled={activeStepIndex >= 4}
                  onClick={stepForward}
                >
                  <FastForward className="size-3.5" />
                  <span>Step Forward</span>
                </Button>

                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={retryStep}>
                  <RotateCcw className="size-3.5" />
                  <span>Retry Step</span>
                </Button>

                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={rerunPipeline}>
                  <RefreshCw className="size-3.5" />
                  <span>Re-run Pipeline</span>
                </Button>

                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={togglePause}>
                  {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </Button>
              </div>

              <p className="text-muted-foreground pt-1 text-center text-xs">
                Actions dispatch commands across connected autonomous agent nodes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
