<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  Award,
  Calendar,
  CheckCircle2,
  FileDown,
  MessageSquareQuote,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

interface MetricTile {
  title: string
  value: string
  subtitle: string
  progress: number
  icon: typeof Target
}

interface AssessmentPillar {
  title: string
  selfScore: number
  managerScore: number
  delta: string
  status: 'consensus' | 'above'
}

interface CompetencyCategory {
  id: string
  title: string
  score: string
  ratingLabel: string
  badgeVariant: 'success' | 'default' | 'secondary'
  progress: number
  criteria: string
  managerRemarks: string
  strengths: string[]
}

interface OKRItem {
  id: string
  title: string
  description: string
  target: string
  progress: number
  status: 'Completed' | 'Exceeded' | 'On Track'
  statusVariant: 'success' | 'default' | 'secondary'
}

interface PeerFeedback {
  id: string
  quote: string
  author: string
  role: string
  category: string
}

const metricTiles: MetricTile[] = [
  {
    title: 'Core Goals Achieved',
    value: '94%',
    subtitle: '+4% vs H1 target',
    progress: 94,
    icon: Target,
  },
  {
    title: 'Technical Leadership',
    value: '4.8 / 5.0',
    subtitle: 'Top 5% org percentile',
    progress: 96,
    icon: Award,
  },
  {
    title: 'Culture & Mentorship',
    value: '4.7 / 5.0',
    subtitle: '3 mentees promoted',
    progress: 94,
    icon: Users,
  },
  {
    title: 'Execution Velocity',
    value: '4.5 / 5.0',
    subtitle: '18 epics delivered',
    progress: 90,
    icon: Zap,
  },
]

const assessmentPillars: AssessmentPillar[] = [
  {
    title: 'Technical Excellence & Architecture',
    selfScore: 4.8,
    managerScore: 5.0,
    delta: '+0.2 Manager higher',
    status: 'above',
  },
  {
    title: 'Collaboration & Mentorship',
    selfScore: 4.5,
    managerScore: 4.5,
    delta: '0.0 Full consensus',
    status: 'consensus',
  },
  {
    title: 'Strategic Impact & Roadmapping',
    selfScore: 4.2,
    managerScore: 4.5,
    delta: '+0.3 Manager higher',
    status: 'above',
  },
  {
    title: 'Execution Velocity & Delivery',
    selfScore: 4.5,
    managerScore: 4.5,
    delta: '0.0 Full consensus',
    status: 'consensus',
  },
]

const competencyCategories: CompetencyCategory[] = [
  {
    id: 'tech-excellence',
    title: 'Technical Excellence & Architecture',
    score: '5.0 / 5.0',
    ratingLabel: 'Outstanding (5.0 / 5.0)',
    badgeVariant: 'success',
    progress: 100,
    criteria:
      'Architects resilient, distributed frontend systems. Sets technical standard across multiple squads and prevents architectural debt.',
    managerRemarks:
      'Led the migration to micro-frontends with 0 downtime. Spearheaded the core component architecture and established strict bundle size budgets across the team, lowering bundle footprint by 38%.',
    strengths: [
      'Zero-downtime micro-frontend rollout',
      'Distributed caching architecture',
      'Framework token standardization',
    ],
  },
  {
    id: 'collab-mentorship',
    title: 'Collaboration & Mentorship',
    score: '4.5 / 5.0',
    ratingLabel: 'Exceeds (4.5 / 5.0)',
    badgeVariant: 'default',
    progress: 90,
    criteria:
      'Actively grows engineering talent, fosters inclusive code review practices, and unblocks cross-discipline initiatives.',
    managerRemarks:
      'Mentored 3 junior engineers to promotion. Fostered an open engineering culture, instituted weekly architecture reviews, and unblocked cross-functional teams across APAC and EMEA.',
    strengths: ['Promotion sponsorship (3 engineers)', 'Weekly architecture reviews', 'Cross-squad pairing cohorts'],
  },
  {
    id: 'strategic-impact',
    title: 'Strategic Impact & Roadmapping',
    score: '4.5 / 5.0',
    ratingLabel: 'Exceeds (4.5 / 5.0)',
    badgeVariant: 'default',
    progress: 90,
    criteria:
      'Aligns engineering strategy with quarterly business goals. Identifies high-ROI technical initiatives and champions developer productivity.',
    managerRemarks:
      'Key driver of developer experience KPIs. Aligned product roadmaps with technical debt reduction, reducing build times by 42% across CI and accelerating shipping velocity.',
    strengths: ['Developer experience KPIs', 'CI turnaround optimization (-42%)', 'Quarterly tech debt roadmap'],
  },
]

const okrItems: OKRItem[] = [
  {
    id: 'okr-1',
    title: 'Micro-Frontend Migration Phase II',
    description: 'Decompose legacy monolithic checkout and account dashboards into standalone remote modules',
    target: '100% modules · 0 downtime',
    progress: 100,
    status: 'Completed',
    statusVariant: 'success',
  },
  {
    id: 'okr-2',
    title: 'CI Pipeline & Build Acceleration',
    description: 'Optimize build caching, monorepo graph execution, and parallelize end-to-end test suites',
    target: '< 4.0m build time (Achieved 3.2m)',
    progress: 100,
    status: 'Exceeded',
    statusVariant: 'success',
  },
  {
    id: 'okr-3',
    title: 'Design System Token Federation',
    description: 'Automate Tailwind OKLCH token sync between Figma variables and registry codebases',
    target: 'Full Vue & React parity',
    progress: 85,
    status: 'On Track',
    statusVariant: 'default',
  },
  {
    id: 'okr-4',
    title: 'Staff Mentorship & Tech Talks',
    description: 'Host bi-weekly deep dives on web performance, distributed state, and accessibility standards',
    target: '12 sessions · 3 mentees',
    progress: 100,
    status: 'Completed',
    statusVariant: 'secondary',
  },
]

const peerFeedbacks: PeerFeedback[] = [
  {
    id: 'peer-1',
    quote:
      'Elena’s architectural guidance transformed our release velocity. Her deep dive sessions on performance optimization helped the frontend team cut latency in half.',
    author: 'Anonymous Peer',
    role: 'Staff Frontend Engineer · Checkout Core',
    category: 'Peer Review · Systems',
  },
  {
    id: 'peer-2',
    quote:
      'Mentoring from Elena was the highlight of my year. Her patient code reviews and architecture walkthroughs gave me the confidence to lead our squad’s largest migration.',
    author: 'Direct Mentee',
    role: 'Software Engineer II · Design Systems',
    category: 'Mentee Review · Growth',
  },
  {
    id: 'peer-3',
    quote:
      'Elena bridges technical complexity with product goals effortlessly. She spots risks weeks in advance and consistently delivers robust, high-impact platform features ahead of schedule.',
    author: 'Cross-Functional Partner',
    role: 'Principal Product Manager · Core Platform',
    category: 'Partner Review · Strategy',
  },
]
</script>

<template>
  <div data-slot="performance-review-matrix" :class="cn('w-full space-y-6', props.class)">
    <!-- Employee & Review Header -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar class="border-border size-16 shrink-0 border sm:size-20">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Elena Rostova"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h2>
                <Badge variant="secondary" class="font-medium">Senior Staff Engineer</Badge>
              </div>
              <p class="text-muted-foreground text-sm">Core Platform & Architecture · Engineering</p>
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <Badge variant="outline" class="gap-1.5 text-xs font-normal">
                  <Calendar class="size-3.5" />
                  H2 2026 Review Cycle
                </Badge>
                <Separator orientation="vertical" class="hidden h-3.5 sm:block" />
                <span class="text-muted-foreground text-xs">
                  Reviewer: <strong class="text-foreground font-medium">Manager: Marcus Vance</strong>
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 sm:self-start lg:self-center">
            <Badge variant="success" class="gap-1.5 px-3.5 py-1.5 text-sm font-semibold shadow-xs">
              <Sparkles class="size-4 shrink-0" />
              Exceeds Expectations · 4.6 / 5.0
            </Badge>
            <Button variant="outline" size="sm" class="gap-2 shadow-xs">
              <FileDown class="size-4" />
              Export PDF Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Executive Summary Scorecard -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="tile in metricTiles" :key="tile.title" class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">{{ tile.title }}</CardTitle>
          <component :is="tile.icon" class="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
            {{ tile.value }}
          </div>
          <div class="space-y-1.5">
            <Progress :model-value="tile.progress" class="h-1.5 w-full" />
            <div class="flex items-center gap-1">
              <TrendingUp class="text-success size-3" />
              <p class="text-muted-foreground text-xs">{{ tile.subtitle }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Self-Assessment vs Manager Assessment Comparison Strip -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle class="text-base font-semibold">Self-Assessment vs Manager Assessment</CardTitle>
          <CardDescription class="text-xs">
            Consensus and score calibration across core performance pillars.
          </CardDescription>
        </div>
        <Badge variant="outline" class="gap-1.5 text-xs font-normal">
          <CheckCircle2 class="text-success size-3.5" />
          96% Consensus Index
        </Badge>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="pillar in assessmentPillars"
            :key="pillar.title"
            class="bg-muted/40 border-border space-y-2.5 rounded-lg border p-3.5"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-foreground line-clamp-1 text-xs font-medium">{{ pillar.title }}</span>
              <Badge
                :variant="pillar.status === 'consensus' ? 'secondary' : 'success'"
                class="px-1.5 py-0 text-xs font-normal"
              >
                {{ pillar.delta }}
              </Badge>
            </div>
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Self:</span>
                <span class="text-foreground font-semibold tabular-nums">{{ pillar.selfScore }} / 5.0</span>
              </div>
              <Progress :model-value="(pillar.selfScore / 5) * 100" class="h-1.5 w-full" />
            </div>
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Manager:</span>
                <span class="text-foreground font-semibold tabular-nums">{{ pillar.managerScore }} / 5.0</span>
              </div>
              <Progress :model-value="(pillar.managerScore / 5) * 100" class="h-1.5 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Competency Breakdown Accordion -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">Competency Breakdown</CardTitle>
        <CardDescription class="text-xs">
          Detailed behavioral criteria, manager qualitative remarks, and observable strengths.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          :default-value="['tech-excellence', 'collab-mentorship', 'strategic-impact']"
          class="space-y-3"
        >
          <AccordionItem
            v-for="category in competencyCategories"
            :key="category.id"
            :value="category.id"
            class="border-border bg-card overflow-hidden rounded-lg border"
          >
            <AccordionTrigger class="px-5 py-4 hover:no-underline">
              <div class="flex w-full flex-wrap items-center justify-between gap-3 pr-2 text-left">
                <div class="space-y-0.5">
                  <span class="text-foreground text-sm font-semibold">{{ category.title }}</span>
                  <p class="text-muted-foreground line-clamp-1 text-xs">{{ category.criteria }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-foreground shrink-0 text-xs font-semibold tabular-nums">{{ category.score }}</span>
                  <Badge :variant="category.badgeVariant" class="text-xs">
                    {{ category.ratingLabel }}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent class="px-5 pt-0 pb-5">
              <div class="border-border/60 space-y-4 border-t pt-4">
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground font-medium">Competency Mastery</span>
                    <span class="text-foreground font-semibold tabular-nums">{{ category.progress }}%</span>
                  </div>
                  <Progress :model-value="category.progress" class="h-2 w-full" />
                </div>

                <div class="bg-muted/40 border-border/80 space-y-1.5 rounded-md border p-3.5">
                  <div class="flex items-center gap-1.5">
                    <MessageSquareQuote class="text-primary size-4 shrink-0" />
                    <span class="text-foreground text-xs font-medium">Manager Remarks</span>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">{{ category.managerRemarks }}</p>
                </div>

                <div class="space-y-2">
                  <span class="text-muted-foreground text-xs font-medium">Key Demonstrated Strengths</span>
                  <div class="flex flex-wrap gap-1.5">
                    <Badge
                      v-for="strength in category.strengths"
                      :key="strength"
                      variant="outline"
                      class="text-xs font-normal"
                    >
                      {{ strength }}
                    </Badge>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>

    <!-- Goals & Objectives Progress Table -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">Goals & Objectives Progress</CardTitle>
        <CardDescription class="text-xs">
          Evaluation of quarterly OKRs, measurable deliverables, and milestone completion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="border-border overflow-hidden rounded-lg border">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader class="bg-muted/50">
                <TableRow>
                  <TableHead class="text-xs">Objective & Key Result</TableHead>
                  <TableHead class="text-xs">Target Metric</TableHead>
                  <TableHead class="w-44 text-xs">Progress</TableHead>
                  <TableHead class="text-right text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="okr in okrItems" :key="okr.id">
                  <TableCell class="py-3">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-medium">{{ okr.title }}</p>
                      <p class="text-muted-foreground text-xs">{{ okr.description }}</p>
                    </div>
                  </TableCell>
                  <TableCell class="text-muted-foreground py-3 text-xs tabular-nums">{{ okr.target }}</TableCell>
                  <TableCell class="py-3">
                    <div class="flex items-center gap-2">
                      <Progress :model-value="okr.progress" class="h-2 w-24" />
                      <span class="text-muted-foreground text-xs font-medium tabular-nums">{{ okr.progress }}%</span>
                    </div>
                  </TableCell>
                  <TableCell class="py-3 text-right">
                    <Badge :variant="okr.statusVariant" class="text-xs">
                      {{ okr.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 360 Peer Feedback Quotes Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">360° Peer Feedback</CardTitle>
        <CardDescription class="text-xs">
          Synthesized qualitative reviews from cross-functional peers, mentees, and collaborators.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            v-for="peer in peerFeedbacks"
            :key="peer.id"
            class="bg-muted/30 border-border flex flex-col justify-between space-y-3 rounded-lg border p-4.5"
          >
            <div class="space-y-2">
              <Badge variant="outline" class="text-xs font-normal">
                {{ peer.category }}
              </Badge>
              <p class="text-foreground text-xs leading-relaxed italic">“{{ peer.quote }}”</p>
            </div>
            <div class="border-border/60 border-t pt-3">
              <p class="text-foreground text-xs font-semibold">{{ peer.author }}</p>
              <p class="text-muted-foreground text-xs">{{ peer.role }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
