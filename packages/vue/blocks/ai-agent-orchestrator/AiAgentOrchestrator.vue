<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

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

const isPaused = ref(false)
const elapsedSeconds = ref(134)
const selectedAgentId = ref<AgentId>('engineer')
const activeStepIndex = ref(2)
const copied = ref(false)
const expandedThoughts = ref<Record<string, boolean>>({
  t1: false,
  t2: false,
  t3: false,
  t4: true,
})

const codeSnippet = `import { defineComponent, ref, computed } from 'vue'

export interface AgentWorkflowConfig {
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

const nodes = ref<AgentNode[]>([
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
        title: 'Stream production TypeScript & SFC definitions',
        duration: '1m 17s',
        status: 'running',
        detail:
          'Writing template layout with responsive CSS grid, glowing node state markers, tool invocation badge metrics, and dark-mode safe styling.',
      },
    ],
    artifactFileName: 'AiAgentOrchestrator.vue',
    artifactSize: '2.4 kB',
    artifactCode: codeSnippet,
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
])

const selectedAgent = computed(() => {
  return nodes.value.find((n) => n.id === selectedAgentId.value) ?? nodes.value[2]
})

const formattedTime = computed(() => {
  const mins = Math.floor(elapsedSeconds.value / 60)
  const secs = elapsedSeconds.value % 60
  return `${mins.toString().padStart(2, '0')}m:${secs.toString().padStart(2, '0')}s`
})

const overallProgress = computed(() => {
  const completedCount = nodes.value.filter((n) => n.status === 'completed').length
  const running = nodes.value.find((n) => n.status === 'running')
  const runningBonus = running ? running.progress / 100 : 0
  return Math.round(((completedCount + runningBonus) / nodes.value.length) * 100)
})

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    if (!isPaused.value && activeStepIndex.value < 4) {
      elapsedSeconds.value++
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function togglePause() {
  isPaused.value = !isPaused.value
}

function selectAgent(id: AgentId) {
  selectedAgentId.value = id
}

function toggleThought(id: string) {
  expandedThoughts.value[id] = !expandedThoughts.value[id]
}

function toggleAllThoughts() {
  const anyClosed = selectedAgent.value.thoughts.some((t) => !expandedThoughts.value[t.id])
  selectedAgent.value.thoughts.forEach((t) => {
    expandedThoughts.value[t.id] = anyClosed
  })
}

function stepForward() {
  if (activeStepIndex.value < nodes.value.length - 1) {
    nodes.value[activeStepIndex.value].status = 'completed'
    nodes.value[activeStepIndex.value].progress = 100
    activeStepIndex.value++
    nodes.value[activeStepIndex.value].status = 'running'
    nodes.value[activeStepIndex.value].progress = 45
    selectedAgentId.value = nodes.value[activeStepIndex.value].id
  } else if (activeStepIndex.value === nodes.value.length - 1) {
    nodes.value[activeStepIndex.value].status = 'completed'
    nodes.value[activeStepIndex.value].progress = 100
    activeStepIndex.value = 4
  }
}

function retryStep() {
  if (activeStepIndex.value < nodes.value.length) {
    nodes.value[activeStepIndex.value].status = 'running'
    nodes.value[activeStepIndex.value].progress = 10
    selectedAgentId.value = nodes.value[activeStepIndex.value].id
  }
}

function rerunPipeline() {
  elapsedSeconds.value = 0
  isPaused.value = false
  activeStepIndex.value = 0
  nodes.value.forEach((node, idx) => {
    if (idx === 0) {
      node.status = 'running'
      node.progress = 25
    } else {
      node.status = 'queued'
      node.progress = 0
    }
  })
  selectedAgentId.value = 'planner'
}

function cancelWorkflow() {
  isPaused.value = true
}

async function copyArtifact() {
  try {
    await navigator.clipboard.writeText(selectedAgent.value.artifactCode)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard fallback
  }
}
</script>

<template>
  <div data-slot="ai-agent-orchestrator" :class="cn('w-full space-y-6', props.class)">
    <!-- Top Header Bar -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-3.5 sm:items-center">
          <div
            class="bg-primary/10 text-primary border-primary/20 flex size-11 shrink-0 items-center justify-center rounded-xl border"
          >
            <Bot class="size-5" />
          </div>
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                Autonomous Research & Code Generation Squad
              </h2>
            </div>
            <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <span class="font-mono">Pipeline ID: pipe-892f4c</span>
              <span>•</span>
              <span>4 Agents Orchestrated</span>
              <span>•</span>
              <span>Target: UIPKGE Registry Block</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Status Badge -->
          <Badge
            v-if="!isPaused && activeStepIndex < 4"
            variant="outline"
            class="border-primary/40 bg-primary/10 text-primary shadow-xs"
          >
            <span class="relative mr-1.5 flex size-2">
              <span class="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
              <span class="bg-primary relative inline-flex size-2 rounded-full" />
            </span>
            Running • Step {{ Math.min(activeStepIndex + 1, 4) }} of 4
          </Badge>
          <Badge v-else-if="isPaused" variant="warning" class="shadow-xs">
            <Pause class="mr-1 size-3" />
            Paused • Step {{ Math.min(activeStepIndex + 1, 4) }} of 4
          </Badge>
          <Badge v-else variant="success" class="shadow-xs">
            <CheckCircle2 class="mr-1 size-3" />
            Completed • 4 of 4 Steps
          </Badge>

          <!-- Timer -->
          <div
            class="border-border bg-muted/40 text-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium"
          >
            <Clock class="text-muted-foreground size-3.5" />
            <span>{{ formattedTime }}</span>
          </div>

          <!-- Controls -->
          <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs" @click="togglePause">
            <component :is="isPaused ? Play : Pause" class="size-3.5" />
            <span>{{ isPaused ? 'Resume Workflow' : 'Pause Workflow' }}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground h-8 gap-1 text-xs"
            @click="cancelWorkflow"
          >
            <X class="size-3.5" />
            <span>Cancel</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Agent Flow Pipeline Nodes (Horizontal Connected Flow) -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Agent Execution Graph</CardTitle>
            <CardDescription class="text-xs">
              Real-time multi-agent execution pipeline. Select any node to inspect telemetry.
            </CardDescription>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-muted-foreground text-xs font-medium">Pipeline Progress</span>
            <div class="bg-muted h-2 w-28 overflow-hidden rounded-full">
              <div
                class="bg-primary h-full transition-all duration-500 ease-out"
                :style="{ width: `${overallProgress}%` }"
              />
            </div>
            <span class="font-mono text-xs font-semibold">{{ overallProgress }}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-6 pt-2">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Node 1: Planner Agent -->
          <button
            type="button"
            class="group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
            :class="[
              selectedAgentId === 'planner'
                ? 'border-primary ring-primary/30 shadow-xs ring-2'
                : 'border-border hover:border-muted-foreground/40',
              nodes[0].status === 'completed'
                ? 'bg-card'
                : nodes[0].status === 'running'
                  ? 'bg-primary/[0.03] border-primary/60'
                  : 'bg-muted/20 opacity-75',
            ]"
            :aria-pressed="selectedAgentId === 'planner'"
            @click="selectAgent('planner')"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2.5">
                  <div
                    class="flex size-9 items-center justify-center rounded-lg border text-xs"
                    :class="
                      nodes[0].status === 'completed'
                        ? 'border-success/30 bg-success/10 text-success'
                        : nodes[0].status === 'running'
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-border bg-muted text-muted-foreground'
                    "
                  >
                    <Compass class="size-4" />
                  </div>
                  <div>
                    <p class="text-foreground text-xs leading-none font-semibold">Planner Agent</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">Stage 01</p>
                  </div>
                </div>

                <Badge v-if="nodes[0].status === 'completed'" variant="success" class="gap-1 text-xs">
                  <Check class="size-3" />
                  12s
                </Badge>
                <Badge
                  v-else-if="nodes[0].status === 'running'"
                  variant="outline"
                  class="border-primary/40 bg-primary/10 text-primary text-xs"
                >
                  Running
                </Badge>
                <Badge v-else variant="outline" class="text-muted-foreground text-xs"> Queued </Badge>
              </div>

              <div class="space-y-1">
                <p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  Deconstruct task into 4 sub-goals
                </p>
              </div>
            </div>

            <div class="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
              <span class="text-muted-foreground font-mono">Claude 3.5</span>
              <span class="text-foreground font-medium">100% done</span>
            </div>
          </button>

          <!-- Node 2: Research Agent -->
          <button
            type="button"
            class="group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
            :class="[
              selectedAgentId === 'researcher'
                ? 'border-primary ring-primary/30 shadow-xs ring-2'
                : 'border-border hover:border-muted-foreground/40',
              nodes[1].status === 'completed'
                ? 'bg-card'
                : nodes[1].status === 'running'
                  ? 'bg-primary/[0.03] border-primary/60'
                  : 'bg-muted/20 opacity-75',
            ]"
            :aria-pressed="selectedAgentId === 'researcher'"
            @click="selectAgent('researcher')"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2.5">
                  <div
                    class="flex size-9 items-center justify-center rounded-lg border text-xs"
                    :class="
                      nodes[1].status === 'completed'
                        ? 'border-success/30 bg-success/10 text-success'
                        : nodes[1].status === 'running'
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-border bg-muted text-muted-foreground'
                    "
                  >
                    <Search class="size-4" />
                  </div>
                  <div>
                    <p class="text-foreground text-xs leading-none font-semibold">Research Agent</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">Stage 02</p>
                  </div>
                </div>

                <Badge v-if="nodes[1].status === 'completed'" variant="success" class="gap-1 text-xs">
                  <Check class="size-3" />
                  45s
                </Badge>
                <Badge
                  v-else-if="nodes[1].status === 'running'"
                  variant="outline"
                  class="border-primary/40 bg-primary/10 text-primary text-xs"
                >
                  Running
                </Badge>
                <Badge v-else variant="outline" class="text-muted-foreground text-xs"> Queued </Badge>
              </div>

              <div class="space-y-1">
                <p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  Query documentation and verify API contracts
                </p>
              </div>
            </div>

            <div class="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
              <span class="text-muted-foreground font-mono">GPT-4o</span>
              <span class="text-foreground font-medium">100% done</span>
            </div>
          </button>

          <!-- Node 3: Code Engineer Agent (Active Node) -->
          <button
            type="button"
            class="group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
            :class="[
              selectedAgentId === 'engineer'
                ? 'border-primary ring-primary/40 shadow-xs ring-2'
                : 'border-border hover:border-muted-foreground/40',
              nodes[2].status === 'completed'
                ? 'bg-card'
                : nodes[2].status === 'running'
                  ? 'border-primary/60 bg-primary/[0.04]'
                  : 'bg-muted/20 opacity-75',
            ]"
            :aria-pressed="selectedAgentId === 'engineer'"
            @click="selectAgent('engineer')"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2.5">
                  <div
                    class="flex size-9 items-center justify-center rounded-lg border text-xs"
                    :class="
                      nodes[2].status === 'completed'
                        ? 'border-success/30 bg-success/10 text-success'
                        : nodes[2].status === 'running'
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-border bg-muted text-muted-foreground'
                    "
                  >
                    <Code2 class="size-4" />
                  </div>
                  <div>
                    <p class="text-foreground text-xs leading-none font-semibold">Code Engineer</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">Stage 03</p>
                  </div>
                </div>

                <Badge v-if="nodes[2].status === 'completed'" variant="success" class="gap-1 text-xs">
                  <Check class="size-3" />
                  1m 17s
                </Badge>
                <Badge
                  v-else-if="nodes[2].status === 'running'"
                  variant="outline"
                  class="border-primary/50 bg-primary/15 text-primary text-xs font-medium"
                >
                  <span class="relative mr-1 flex size-1.5">
                    <span class="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                    <span class="bg-primary relative inline-flex size-1.5 rounded-full" />
                  </span>
                  Streaming
                </Badge>
                <Badge v-else variant="outline" class="text-muted-foreground text-xs"> Queued </Badge>
              </div>

              <div class="space-y-1">
                <p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  Generate component architecture & unit tests
                </p>
              </div>
            </div>

            <div class="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
              <span class="text-muted-foreground font-mono">Claude 3.5</span>
              <span class="text-primary font-medium">{{ nodes[2].progress }}% active</span>
            </div>
          </button>

          <!-- Node 4: Reviewer & QA Agent -->
          <button
            type="button"
            class="group focus-visible:ring-ring relative flex w-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
            :class="[
              selectedAgentId === 'reviewer'
                ? 'border-primary ring-primary/30 shadow-xs ring-2'
                : 'border-border/80 hover:border-muted-foreground/40',
              nodes[3].status === 'completed'
                ? 'bg-card'
                : nodes[3].status === 'running'
                  ? 'bg-primary/[0.03] border-primary/60'
                  : 'bg-muted/15 border-dashed',
            ]"
            :aria-pressed="selectedAgentId === 'reviewer'"
            @click="selectAgent('reviewer')"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2.5">
                  <div
                    class="flex size-9 items-center justify-center rounded-lg border text-xs"
                    :class="
                      nodes[3].status === 'completed'
                        ? 'border-success/30 bg-success/10 text-success'
                        : nodes[3].status === 'running'
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-border bg-muted/60 text-muted-foreground'
                    "
                  >
                    <ShieldCheck class="size-4" />
                  </div>
                  <div>
                    <p class="text-foreground text-xs leading-none font-semibold">Reviewer & QA</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">Stage 04</p>
                  </div>
                </div>

                <Badge v-if="nodes[3].status === 'completed'" variant="success" class="gap-1 text-xs">
                  <Check class="size-3" />
                  Passed
                </Badge>
                <Badge
                  v-else-if="nodes[3].status === 'running'"
                  variant="outline"
                  class="border-primary/40 bg-primary/10 text-primary text-xs"
                >
                  Running
                </Badge>
                <Badge v-else variant="outline" class="text-muted-foreground border-border/80 text-xs"> Queued </Badge>
              </div>

              <div class="space-y-1">
                <p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  Validate TypeScript types and token standards
                </p>
              </div>
            </div>

            <div class="border-border/60 mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
              <span class="text-muted-foreground font-mono">Claude 3.5</span>
              <span class="text-muted-foreground font-medium">Pending</span>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>

    <!-- Active Execution Detail Panel (2-Column Bento) -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Agent Overview, Thought Stream & Tool Invocations -->
      <div class="space-y-6 lg:col-span-7">
        <!-- Active Agent Header & Progress -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="bg-primary/10 text-primary border-primary/20 flex size-10 items-center justify-center rounded-lg border"
                >
                  <component
                    :is="
                      selectedAgent.id === 'planner'
                        ? Compass
                        : selectedAgent.id === 'researcher'
                          ? Search
                          : selectedAgent.id === 'engineer'
                            ? Code2
                            : ShieldCheck
                    "
                    class="size-5"
                  />
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <CardTitle class="text-base font-semibold">{{ selectedAgent.name }}</CardTitle>
                    <Badge variant="outline" class="font-mono text-xs">
                      {{ selectedAgent.model }}
                    </Badge>
                  </div>
                  <CardDescription class="text-xs">
                    {{ selectedAgent.task }}
                  </CardDescription>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <Badge v-if="selectedAgent.status === 'completed'" variant="success" class="text-xs">
                  Completed in {{ selectedAgent.duration }}
                </Badge>
                <Badge
                  v-else-if="selectedAgent.status === 'running'"
                  variant="outline"
                  class="border-primary/40 bg-primary/10 text-primary text-xs"
                >
                  <Activity class="mr-1 size-3 animate-pulse" />
                  Streaming • {{ selectedAgent.duration }}
                </Badge>
                <Badge v-else variant="outline" class="text-muted-foreground text-xs"> Queued </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <div class="space-y-1.5">
              <div class="text-muted-foreground flex justify-between text-xs font-medium">
                <span>Task Execution State</span>
                <span class="font-mono">{{ selectedAgent.progress }}%</span>
              </div>
              <Progress :model-value="selectedAgent.progress" class="h-2" />
            </div>

            <div class="bg-muted/30 border-border grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-4">
              <div>
                <p class="text-muted-foreground text-xs">Duration</p>
                <p class="text-foreground font-mono text-xs font-semibold">{{ selectedAgent.duration }}</p>
              </div>
              <div>
                <p class="text-muted-foreground text-xs">Tokens Output</p>
                <p class="text-foreground font-mono text-xs font-semibold">{{ selectedAgent.tokens }}</p>
              </div>
              <div>
                <p class="text-muted-foreground text-xs">Throughput</p>
                <p class="text-foreground font-mono text-xs font-semibold">{{ selectedAgent.speed }}</p>
              </div>
              <div>
                <p class="text-muted-foreground text-xs">Agent Role</p>
                <p class="text-foreground truncate text-xs font-semibold">{{ selectedAgent.role }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Agent Thought Stream Card (Expandable reasoning steps) -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="flex flex-row items-center justify-between pb-3">
            <div class="flex flex-wrap items-center gap-2">
              <Sparkles class="text-primary size-4" />
              <CardTitle class="text-sm font-semibold">Agent Thought Stream & Reasoning</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="xs"
              class="text-muted-foreground hover:text-foreground h-7 text-xs"
              @click="toggleAllThoughts"
            >
              Toggle Details
            </Button>
          </CardHeader>

          <CardContent class="space-y-3 pt-0">
            <div
              v-for="thought in selectedAgent.thoughts"
              :key="thought.id"
              class="border-border bg-muted/20 hover:bg-muted/30 rounded-lg border transition-colors"
            >
              <button
                type="button"
                class="focus-visible:ring-ring flex w-full cursor-pointer items-center justify-between rounded-lg p-3 text-left focus-visible:ring-2 focus-visible:outline-none"
                :aria-expanded="expandedThoughts[thought.id]"
                @click="toggleThought(thought.id)"
              >
                <div class="flex flex-wrap items-center gap-2.5">
                  <div
                    class="flex size-5 shrink-0 items-center justify-center rounded-full"
                    :class="
                      thought.status === 'completed'
                        ? 'text-success'
                        : thought.status === 'running'
                          ? 'text-primary animate-spin'
                          : 'text-muted-foreground'
                    "
                  >
                    <CheckCircle2 v-if="thought.status === 'completed'" class="size-4" />
                    <Activity v-else-if="thought.status === 'running'" class="size-4" />
                    <div v-else class="border-muted-foreground size-3 rounded-full border border-dashed" />
                  </div>
                  <p class="text-foreground text-xs font-medium">{{ thought.title }}</p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" class="font-mono text-xs">
                    {{ thought.duration }}
                  </Badge>
                  <component
                    :is="expandedThoughts[thought.id] ? ChevronDown : ChevronRight"
                    class="text-muted-foreground size-3.5"
                  />
                </div>
              </button>

              <div
                v-if="expandedThoughts[thought.id]"
                class="border-border/60 bg-muted/40 text-muted-foreground border-t px-3 py-2.5 text-xs leading-relaxed"
              >
                {{ thought.detail }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Tool Invocations Badge Row & Logs -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center gap-2">
              <Terminal class="text-primary size-4" />
              <CardTitle class="text-sm font-semibold">Active Tool Invocations</CardTitle>
            </div>
          </CardHeader>

          <CardContent class="space-y-3 pt-0">
            <!-- Badge Row -->
            <div class="flex flex-wrap items-center gap-2">
              <Badge
                v-for="tool in selectedAgent.tools"
                :key="tool.name"
                variant="outline"
                class="border-border bg-muted/40 hover:bg-muted text-foreground gap-1.5 px-2.5 py-1 text-xs font-medium"
              >
                <component
                  :is="
                    tool.icon === 'Globe'
                      ? Globe
                      : tool.icon === 'FileText'
                        ? FileText
                        : tool.icon === 'Terminal'
                          ? Terminal
                          : ShieldCheck
                  "
                  class="text-muted-foreground size-3.5"
                />
                <span class="font-mono">{{ tool.name }}</span>
                <span class="bg-primary/10 text-primary py-0.2 rounded-full px-1.5 text-xs font-bold">
                  {{ tool.count }}
                </span>
              </Badge>
            </div>

            <!-- Execution Log Terminal Row -->
            <div class="border-border bg-muted/50 overflow-x-auto rounded-lg border p-3 font-mono text-xs">
              <div class="text-muted-foreground space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-success font-semibold">[02:14:02]</span>
                  <span>GET https://uipkge.dev/r/button.json -> 200 OK (38ms)</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-success font-semibold">[02:14:05]</span>
                  <span>READ packages/registry-vue/components/card/Card.vue (12ms)</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-primary font-semibold">[02:14:09]</span>
                  <span>AST parse: 4 exports identified, 0 cycle violations</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-success font-semibold">[02:14:14]</span>
                  <span>Typecheck: 0 errors across 6 test suites</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Live Artifact Output & Pipeline Actions -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Live Artifact Output Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="flex flex-row items-center justify-between pb-3">
            <div class="flex flex-wrap items-center gap-2 overflow-hidden">
              <FileCode2 class="text-primary size-4 shrink-0" />
              <CardTitle class="truncate font-mono text-xs font-medium">
                {{ selectedAgent.artifactFileName }}
              </CardTitle>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" class="font-mono text-xs">
                {{ selectedAgent.artifactSize }}
              </Badge>
              <Button variant="outline" size="xs" class="h-7 gap-1 text-xs" @click="copyArtifact">
                <component :is="copied ? Check : Copy" class="size-3" />
                <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent class="pt-0">
            <div class="border-border bg-muted/40 relative overflow-hidden rounded-lg border font-mono text-xs">
              <!-- Window top bar -->
              <div class="border-border/60 bg-muted/60 flex items-center justify-between border-b px-3 py-1.5">
                <div class="flex items-center gap-1.5">
                  <div class="bg-destructive/60 size-2.5 rounded-full" />
                  <div class="bg-warning/60 size-2.5 rounded-full" />
                  <div class="bg-success/60 size-2.5 rounded-full" />
                </div>
                <span class="text-muted-foreground text-xs">Live Generated Output</span>
              </div>

              <!-- Code area with syntax styling -->
              <div class="max-h-[380px] overflow-auto p-3 text-xs leading-relaxed">
                <pre
                  class="text-foreground font-mono whitespace-pre-wrap"
                ><code>{{ selectedAgent.artifactCode }}</code></pre>
                <span
                  v-if="selectedAgent.status === 'running'"
                  class="bg-primary ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Pipeline Action Controls -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center gap-2">
              <Layers class="text-primary size-4" />
              <CardTitle class="text-sm font-semibold">Pipeline Orchestrator Controls</CardTitle>
            </div>
          </CardHeader>

          <CardContent class="space-y-3 pt-0">
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                variant="default"
                size="sm"
                class="gap-1.5 text-xs font-medium"
                :disabled="activeStepIndex >= 4"
                @click="stepForward"
              >
                <FastForward class="size-3.5" />
                <span>Step Forward</span>
              </Button>

              <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="retryStep">
                <RotateCcw class="size-3.5" />
                <span>Retry Step</span>
              </Button>

              <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="rerunPipeline">
                <RefreshCw class="size-3.5" />
                <span>Re-run Pipeline</span>
              </Button>

              <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="togglePause">
                <component :is="isPaused ? Play : Pause" class="size-3.5" />
                <span>{{ isPaused ? 'Resume' : 'Pause' }}</span>
              </Button>
            </div>

            <p class="text-muted-foreground pt-1 text-center text-xs">
              Actions dispatch commands across connected autonomous agent nodes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
