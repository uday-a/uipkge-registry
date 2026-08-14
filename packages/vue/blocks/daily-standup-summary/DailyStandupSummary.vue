<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Globe,
  Handshake,
  Heart,
  HelpCircle,
  MessageSquare,
  MessageSquarePlus,
  Plus,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Sparkles,
  Target,
  ThumbsUp,
  Users,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export type StandupStatus = 'on-track' | 'blocked' | 'needs-review'

export interface StandupReaction {
  emoji: string
  count: number
  active?: boolean
}

export interface StandupMember {
  id: string
  name: string
  role: string
  avatar: string
  fallback: string
  submittedAt: string
  timezone: string
  status: StandupStatus
  statusLabel: string
  yesterday: string[]
  today: string[]
  blockers?: string | null
  blockerSeverity?: 'critical' | 'moderate' | 'low'
  reactions: StandupReaction[]
  threadCount?: number
}

export interface BlockerAlert {
  id: string
  title: string
  description: string
  authorName: string
  authorRole: string
  reportedAt: string
  ticketId?: string
  scope: string
  assignedSquad: string
}

export interface StandupPulseMetrics {
  submissionsCount: number
  totalMembers: number
  pendingMemberName?: string
  activeBlockersCount: number
  blockersHighlight?: string
  goalsOnTrackCount: number
  totalGoals: number
  sprintName?: string
  deploymentsPlannedCount: number
  deploymentsHighlight?: string
}

export interface DailyStandupSummaryProps {
  teamName?: string
  date?: string
  pulseMetrics?: StandupPulseMetrics
  blockerAlert?: BlockerAlert | null
  members?: StandupMember[]
  initialFilter?: 'all' | StandupStatus
  class?: HTMLAttributes['class']
}

const defaultPulseMetrics: StandupPulseMetrics = {
  submissionsCount: 5,
  totalMembers: 6,
  pendingMemberName: 'Alex Rivera (PTO / Vacation)',
  activeBlockersCount: 1,
  blockersHighlight: 'AWS IAM KMS staging rotation',
  goalsOnTrackCount: 8,
  totalGoals: 10,
  sprintName: 'Sprint 42 · 3 days left',
  deploymentsPlannedCount: 3,
  deploymentsHighlight: '2 staging · 1 production (v2.4.0)',
}

const defaultBlockerAlert: BlockerAlert = {
  id: 'blk-aws-kms-01',
  title: 'Blocked on AWS IAM permission grant for KMS rotation in staging',
  description:
    'Unable to complete cryptographic secret rotation automated test suite for the v2.4 staging cluster. Ticket SEC-9104 is currently pending approval from the Security Operations squad.',
  authorName: 'Marcus Vance',
  authorRole: 'DevOps & Cloud Architect',
  reportedAt: '42m ago',
  ticketId: 'SEC-9104',
  scope: 'Staging Pipeline',
  assignedSquad: '#sec-ops-triage',
}

const defaultMembers: StandupMember[] = [
  {
    id: 'mem-1',
    name: 'Elena Rostova',
    role: 'Principal Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fallback: 'ER',
    submittedAt: '09:15 AM',
    timezone: 'UTC+2 · Berlin',
    status: 'on-track',
    statusLabel: 'On Track',
    yesterday: [
      'Merged RFC #142 for headless multi-token theme engine architecture',
      'Reviewed and approved 6 PRs across core UI primitive components',
      'Mentored frontend team on Reka UI polymorphic asChild slot bindings',
    ],
    today: [
      'Finalizing async tree-shaking benchmarking suite for monorepo components (#PERF-892)',
      'Kicking off Design Tokens v4 migration RFC discussion thread with design systems team',
      'Pairing with Sarah on virtualized combobox keyboard focus trap resolution',
    ],
    blockers: null,
    reactions: [
      { emoji: '👍', count: 4, active: true },
      { emoji: '🚀', count: 2, active: false },
      { emoji: '👀', count: 3, active: false },
      { emoji: '🧠', count: 1, active: false },
    ],
    threadCount: 3,
  },
  {
    id: 'mem-2',
    name: 'Marcus Vance',
    role: 'DevOps & Cloud Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    fallback: 'MV',
    submittedAt: '09:28 AM',
    timezone: 'UTC-5 · New York',
    status: 'blocked',
    statusLabel: 'Blocked',
    blockerSeverity: 'critical',
    yesterday: [
      'Provisioned ephemeral preview environments for automated PR test runners',
      'Automated Cloudflare Pages edge cache invalidation hooks in GitHub Actions',
    ],
    today: [
      'Rolling out canary release v2.4.0 to EU cluster once KMS permissions clear (#OPS-419)',
      'Setting up Prometheus edge exporter for SSR latency and cache hit ratios',
    ],
    blockers:
      'Blocked on AWS IAM permission grant for KMS rotation in staging. Escalated to Security Ops in #sec-ops-triage (Ticket SEC-9104).',
    reactions: [
      { emoji: '🚨', count: 3, active: true },
      { emoji: '💬', count: 4, active: false },
      { emoji: '🤝', count: 2, active: false },
      { emoji: '🙏', count: 1, active: false },
    ],
    threadCount: 4,
  },
  {
    id: 'mem-3',
    name: 'David Chen',
    role: 'Full-Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    fallback: 'DC',
    submittedAt: '09:42 AM',
    timezone: 'UTC-7 · San Francisco',
    status: 'on-track',
    statusLabel: 'On Track',
    yesterday: [
      'Implemented Nitro rate-limiting telemetry parser and token bucket middleware',
      'Wrote 34 unit tests for zero-allocation token stringifier algorithm',
    ],
    today: [
      'Implementing HMAC-SHA256 webhook signature validation generator (#CORE-331)',
      'Writing OpenAPI 3.1 documentation with interactive curl playground snippets',
    ],
    blockers: null,
    reactions: [
      { emoji: '🔥', count: 5, active: false },
      { emoji: '👍', count: 3, active: true },
      { emoji: '⚡', count: 2, active: false },
    ],
    threadCount: 1,
  },
  {
    id: 'mem-4',
    name: 'Sarah Jenkins',
    role: 'Frontend Specialist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    fallback: 'SJ',
    submittedAt: '09:55 AM',
    timezone: 'UTC+1 · London',
    status: 'needs-review',
    statusLabel: 'Needs Review',
    yesterday: [
      'Completed accessible combobox keyboard navigation and roving tabindex support',
      'Audited dark mode OKLCH contrast ratios on table headers and badges',
    ],
    today: [
      'Benchmarking spring physics motion transition framerates on mobile viewports (#UI-204)',
      'Crafting comprehensive story demos for Daily Standup Summary block',
    ],
    blockers: 'Awaiting PR review on PR #884 (Reka roving focus patch) from Elena or David to merge.',
    reactions: [
      { emoji: '✨', count: 6, active: true },
      { emoji: '👍', count: 4, active: false },
      { emoji: '🚀', count: 1, active: false },
    ],
    threadCount: 2,
  },
]

const props = withDefaults(defineProps<DailyStandupSummaryProps>(), {
  teamName: 'Core Registry Squad',
  date: 'Today · Friday, Aug 21, 2026',
  initialFilter: 'all',
})

const activeMetrics = computed(() => props.pulseMetrics ?? defaultPulseMetrics)
const activeBlockerAlert = computed(() => (props.blockerAlert !== undefined ? props.blockerAlert : defaultBlockerAlert))
const activeFilter = ref<'all' | StandupStatus>(props.initialFilter ?? 'all')
const standupSubmitted = ref(false)
const copiedSummary = ref(false)
const escalatedBlocker = ref(false)
const localMembers = ref<StandupMember[]>(JSON.parse(JSON.stringify(props.members ?? defaultMembers)))

const filteredMembers = computed(() => {
  if (activeFilter.value === 'all') return localMembers.value
  return localMembers.value.filter((m) => m.status === activeFilter.value)
})

const countAll = computed(() => localMembers.value.length)
const countBlocked = computed(() => localMembers.value.filter((m) => m.status === 'blocked').length)
const countNeedsReview = computed(() => localMembers.value.filter((m) => m.status === 'needs-review').length)
const countOnTrack = computed(() => localMembers.value.filter((m) => m.status === 'on-track').length)

const toggleReaction = (memberIndex: number, reactionIndex: number) => {
  const member = localMembers.value[memberIndex]
  if (!member) return
  const r = member.reactions[reactionIndex]
  if (!r) return
  if (r.active) {
    r.count -= 1
    r.active = false
  } else {
    r.count += 1
    r.active = true
  }
}

const copySummary = async () => {
  try {
    const text = `${props.teamName} Standup Summary — ${props.date}\n\nSubmissions: ${activeMetrics.value.submissionsCount}/${activeMetrics.value.totalMembers} (${Math.round((activeMetrics.value.submissionsCount / activeMetrics.value.totalMembers) * 100)}%)\nActive Blockers: ${activeMetrics.value.activeBlockersCount}\nGoals on Track: ${activeMetrics.value.goalsOnTrackCount}/${activeMetrics.value.totalGoals}\nPlanned Releases: ${activeMetrics.value.deploymentsPlannedCount}`
    await navigator.clipboard.writeText(text)
    copiedSummary.value = true
    setTimeout(() => {
      copiedSummary.value = false
    }, 2000)
  } catch {}
}
</script>

<template>
  <div data-slot="daily-standup-summary" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Header Section -->
    <header
      class="bg-card border-border flex flex-col gap-4 rounded-xl border p-5 shadow-xs sm:p-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Bot class="size-4.5" aria-hidden="true" />
          </div>
          <h1 class="text-xl font-bold tracking-tight sm:text-2xl">Daily Engineering Standup</h1>
          <Badge
            variant="secondary"
            class="border-sky-500/20 bg-sky-500/10 text-xs font-medium text-sky-600 dark:text-sky-400"
          >
            <span class="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-sky-500" />
            Synced with #eng-standups
          </Badge>
        </div>
        <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span class="text-foreground flex items-center gap-1 font-medium">
            <Calendar class="text-muted-foreground size-3.5" aria-hidden="true" />
            {{ props.date }}
          </span>
          <span class="flex items-center gap-1">
            <Users class="size-3.5" aria-hidden="true" />
            {{ props.teamName }} · {{ activeMetrics.totalMembers }} Members
          </span>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="flex flex-wrap items-center gap-2.5">
        <Button variant="outline" size="sm" class="h-9 gap-1.5 text-xs font-medium" @click="copySummary">
          <Check v-if="copiedSummary" class="size-3.5 text-emerald-500" aria-hidden="true" />
          <Copy v-else class="text-muted-foreground size-3.5" aria-hidden="true" />
          {{ copiedSummary ? 'Summary Copied' : 'Copy Summary' }}
        </Button>
        <Button
          :variant="standupSubmitted ? 'outline' : 'default'"
          size="sm"
          class="h-9 gap-1.5 text-xs font-semibold transition"
          @click="standupSubmitted = !standupSubmitted"
        >
          <CheckCircle2 v-if="standupSubmitted" class="size-4 text-emerald-500" aria-hidden="true" />
          <Send v-else class="size-4" aria-hidden="true" />
          {{ standupSubmitted ? 'Standup Submitted' : 'Submit My Standup' }}
        </Button>
      </div>
    </header>

    <!-- 4 Squad Pulse Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Total Submissions -->
      <Card class="border-border shadow-xs">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardDescription class="text-xs font-medium">Total Submissions</CardDescription>
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <CheckCircle2 class="size-3.5" aria-hidden="true" />
            </div>
          </div>
          <CardTitle class="mt-1 flex items-baseline gap-2 text-xl font-bold tabular-nums">
            {{ activeMetrics.submissionsCount }} / {{ activeMetrics.totalMembers }}
            <Badge
              variant="secondary"
              class="border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
            >
              {{ Math.round((activeMetrics.submissionsCount / activeMetrics.totalMembers) * 100) }}% In
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="bg-muted mb-2 h-1.5 w-full overflow-hidden rounded-full">
            <div
              class="h-full bg-emerald-500 transition-all duration-500"
              :style="{ width: `${(activeMetrics.submissionsCount / activeMetrics.totalMembers) * 100}%` }"
            />
          </div>
          <p v-if="activeMetrics.pendingMemberName" class="text-muted-foreground truncate text-xs">
            Pending: {{ activeMetrics.pendingMemberName }}
          </p>
        </CardContent>
      </Card>

      <!-- 2. Active Blockers -->
      <Card
        class="border-border shadow-xs"
        :class="{ 'border-destructive/40 bg-destructive/5': activeMetrics.activeBlockersCount > 0 }"
      >
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardDescription class="text-xs font-medium">Active Blockers</CardDescription>
            <div
              class="flex size-7 items-center justify-center rounded-md"
              :class="
                activeMetrics.activeBlockersCount > 0
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-emerald-500/10 text-emerald-500'
              "
            >
              <AlertTriangle class="size-3.5" aria-hidden="true" />
            </div>
          </div>
          <CardTitle class="mt-1 flex items-baseline gap-2 text-xl font-bold tabular-nums">
            {{ activeMetrics.activeBlockersCount }}
            {{ activeMetrics.activeBlockersCount === 1 ? 'Critical' : 'Active' }}
            <Badge v-if="activeMetrics.activeBlockersCount > 0" variant="destructive" class="text-xs font-semibold">
              <span class="mr-1 inline-block size-1.5 rounded-full bg-white" />
              Action Req.
            </Badge>
            <Badge
              v-else
              variant="secondary"
              class="border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              Clear
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <p class="text-muted-foreground truncate text-xs">
            {{ activeMetrics.blockersHighlight || 'All squad paths currently unblocked' }}
          </p>
        </CardContent>
      </Card>

      <!-- 3. Sprint Goals On Track -->
      <Card class="border-border shadow-xs">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardDescription class="text-xs font-medium">Sprint Goals On Track</CardDescription>
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Target class="size-3.5" aria-hidden="true" />
            </div>
          </div>
          <CardTitle class="mt-1 flex items-baseline gap-2 text-xl font-bold tabular-nums">
            {{ activeMetrics.goalsOnTrackCount }} / {{ activeMetrics.totalGoals }}
            <Badge
              variant="secondary"
              class="bg-primary/10 text-primary border-primary/20 text-xs font-semibold tabular-nums"
            >
              {{ Math.round((activeMetrics.goalsOnTrackCount / activeMetrics.totalGoals) * 100) }}% Velocity
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <p class="text-muted-foreground truncate text-xs">
            {{ activeMetrics.sprintName || 'Sprint on schedule' }}
          </p>
        </CardContent>
      </Card>

      <!-- 4. Today's Deployments -->
      <Card class="border-border shadow-xs">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardDescription class="text-xs font-medium">Planned Deployments</CardDescription>
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Rocket class="size-3.5" aria-hidden="true" />
            </div>
          </div>
          <CardTitle class="mt-1 flex items-baseline gap-2 text-xl font-bold tabular-nums">
            {{ activeMetrics.deploymentsPlannedCount }} Releases
            <Badge variant="outline" class="text-xs font-semibold"> Today </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <p class="text-muted-foreground truncate text-xs">
            {{ activeMetrics.deploymentsHighlight || 'Targeting staging & edge production' }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Active Blockers Alert Card (Highlighted Banner) -->
    <div
      v-if="activeBlockerAlert"
      class="border-destructive/30 bg-destructive/5 dark:bg-destructive/10 relative overflow-hidden rounded-xl border p-5 shadow-xs"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div class="flex items-start gap-3.5">
          <div
            class="bg-destructive/15 text-destructive mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
          >
            <ShieldAlert class="size-5" aria-hidden="true" />
          </div>
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="destructive" class="text-xs font-semibold">
                <span class="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-white" />
                Critical Blocker
              </Badge>
              <Badge variant="outline" class="font-mono text-xs">
                {{ activeBlockerAlert.ticketId }}
              </Badge>
              <span class="text-muted-foreground text-xs">
                Reported by <strong class="text-foreground font-medium">{{ activeBlockerAlert.authorName }}</strong> ({{
                  activeBlockerAlert.authorRole
                }}) · {{ activeBlockerAlert.reportedAt }}
              </span>
            </div>
            <h2 class="text-foreground text-base leading-snug font-semibold">
              {{ activeBlockerAlert.title }}
            </h2>
            <p class="text-muted-foreground text-xs sm:text-sm">
              {{ activeBlockerAlert.description }}
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span class="text-muted-foreground"
                >Scope: <span class="text-foreground font-medium">{{ activeBlockerAlert.scope }}</span></span
              >
              <span class="text-muted-foreground"
                >Assigned: <span class="text-primary font-medium">{{ activeBlockerAlert.assignedSquad }}</span></span
              >
            </div>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2 md:flex-col md:items-end">
          <Button
            size="sm"
            :variant="escalatedBlocker ? 'outline' : 'destructive'"
            class="h-8 text-xs font-semibold"
            @click="escalatedBlocker = !escalatedBlocker"
          >
            <Check v-if="escalatedBlocker" class="mr-1 size-3.5 text-emerald-500" />
            <Flame v-else class="mr-1 size-3.5" />
            {{ escalatedBlocker ? 'Escalated to SecOps' : 'Escalate Blocker' }}
          </Button>
          <Button variant="outline" size="sm" class="h-8 text-xs font-medium">
            <MessageSquare class="text-muted-foreground mr-1 size-3.5" />
            Open Thread (4)
          </Button>
        </div>
      </div>
    </div>

    <!-- Standup Submissions Section -->
    <div class="space-y-4">
      <!-- Section Header & Filter Controls -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-semibold tracking-tight">Standup Submissions</h2>
          <Badge variant="secondary" class="font-mono text-xs tabular-nums">
            {{ filteredMembers.length }}
          </Badge>
        </div>

        <!-- Filter Segmented Pills -->
        <div class="bg-muted border-border flex items-center gap-1 rounded-lg border p-1 text-xs">
          <button
            type="button"
            class="focus-visible:ring-ring min-h-6 rounded-md px-2.5 py-1 font-medium transition focus-visible:ring-2 focus-visible:outline-none"
            :class="
              activeFilter === 'all'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'all'"
          >
            All ({{ countAll }})
          </button>
          <button
            type="button"
            class="focus-visible:ring-ring min-h-6 rounded-md px-2.5 py-1 font-medium transition focus-visible:ring-2 focus-visible:outline-none"
            :class="
              activeFilter === 'blocked'
                ? 'bg-background text-destructive font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-destructive'
            "
            @click="activeFilter = 'blocked'"
          >
            Blocked ({{ countBlocked }})
          </button>
          <button
            type="button"
            class="focus-visible:ring-ring min-h-6 rounded-md px-2.5 py-1 font-medium transition focus-visible:ring-2 focus-visible:outline-none"
            :class="
              activeFilter === 'needs-review'
                ? 'bg-background font-semibold text-amber-600 shadow-xs dark:text-amber-400'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'needs-review'"
          >
            Needs Review ({{ countNeedsReview }})
          </button>
          <button
            type="button"
            class="focus-visible:ring-ring min-h-6 rounded-md px-2.5 py-1 font-medium transition focus-visible:ring-2 focus-visible:outline-none"
            :class="
              activeFilter === 'on-track'
                ? 'bg-background font-semibold text-emerald-600 shadow-xs dark:text-emerald-400'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'on-track'"
          >
            On Track ({{ countOnTrack }})
          </button>
        </div>
      </div>

      <!-- Member Standup Cards List -->
      <div class="space-y-4">
        <Card
          v-for="(member, mIdx) in filteredMembers"
          :key="member.id"
          class="border-border hover:border-border/80 shadow-xs transition"
          :class="{
            'border-destructive/30': member.status === 'blocked',
            'border-amber-500/30': member.status === 'needs-review',
          }"
        >
          <!-- Member Card Header -->
          <CardHeader class="pb-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3.5">
                <Avatar class="size-10 border">
                  <AvatarImage :src="member.avatar" :alt="member.name" />
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">{{
                    member.fallback
                  }}</AvatarFallback>
                </Avatar>
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-sm font-semibold tracking-tight">{{ member.name }}</h3>
                    <Badge
                      :variant="member.status === 'blocked' ? 'destructive' : 'secondary'"
                      class="text-xs font-medium"
                      :class="{
                        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400':
                          member.status === 'on-track',
                        'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400':
                          member.status === 'needs-review',
                      }"
                    >
                      {{ member.statusLabel }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    {{ member.role }} · <span class="text-muted-foreground/80">{{ member.timezone }}</span>
                  </p>
                </div>
              </div>

              <!-- Timestamp & Quick Member Actions -->
              <div class="flex items-center gap-2 self-start text-xs sm:self-auto">
                <span class="text-muted-foreground flex items-center gap-1 tabular-nums">
                  <Clock class="text-muted-foreground size-3" aria-hidden="true" />
                  {{ member.submittedAt }}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <Separator />

            <!-- Three-Part Standup Structure -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <!-- 1. Accomplished Yesterday -->
              <div class="bg-muted/30 border-border/60 space-y-2 rounded-lg border p-3.5">
                <h4
                  class="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                >
                  <CheckCircle2 class="size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                  Yesterday's Output
                </h4>
                <ul class="space-y-1.5 text-xs leading-relaxed">
                  <li v-for="(item, idx) in member.yesterday" :key="idx" class="flex items-start gap-1.5">
                    <span class="mt-0.5 font-bold text-emerald-500">✓</span>
                    <span class="text-foreground/90">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- 2. Focusing on Today -->
              <div class="bg-muted/30 border-border/60 space-y-2 rounded-lg border p-3.5">
                <h4
                  class="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                >
                  <ArrowRight class="text-primary size-3.5 shrink-0" aria-hidden="true" />
                  Today's Focus
                </h4>
                <ul class="space-y-1.5 text-xs leading-relaxed">
                  <li v-for="(item, idx) in member.today" :key="idx" class="flex items-start gap-1.5">
                    <span class="text-primary mt-0.5 font-bold">→</span>
                    <span class="text-foreground/90">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- 3. Blockers or Risks -->
              <div
                class="space-y-2 rounded-lg border p-3.5"
                :class="
                  member.blockers
                    ? member.status === 'blocked'
                      ? 'border-destructive/30 bg-destructive/5 dark:bg-destructive/10'
                      : 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10'
                    : 'border-border/60 bg-muted/30'
                "
              >
                <h4
                  class="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                >
                  <AlertTriangle
                    v-if="member.blockers"
                    class="size-3.5 shrink-0"
                    :class="member.status === 'blocked' ? 'text-destructive' : 'text-amber-500'"
                    aria-hidden="true"
                  />
                  <ShieldCheck v-else class="size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                  Blockers & Risks
                </h4>

                <div v-if="member.blockers" class="text-xs leading-relaxed">
                  <p
                    :class="
                      member.status === 'blocked'
                        ? 'text-destructive font-medium'
                        : 'font-medium text-amber-600 dark:text-amber-400'
                    "
                  >
                    {{ member.blockers }}
                  </p>
                </div>
                <div v-else class="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span class="font-medium text-emerald-500">No blockers</span>
                  <span>— Clear path to sprint goals</span>
                </div>
              </div>
            </div>

            <!-- Footer: Slack-style Reactions & Quick Actions -->
            <div class="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
              <!-- Reactions Pills -->
              <div class="flex flex-wrap items-center gap-1.5">
                <button
                  v-for="(reaction, rIdx) in member.reactions"
                  :key="rIdx"
                  type="button"
                  class="focus-visible:ring-ring flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none"
                  :class="
                    reaction.active
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  "
                  @click="toggleReaction(mIdx, rIdx)"
                >
                  <span>{{ reaction.emoji }}</span>
                  <span class="font-semibold tabular-nums">{{ reaction.count }}</span>
                </button>
                <button
                  type="button"
                  class="focus-visible:ring-ring text-muted-foreground hover:text-foreground hover:bg-muted flex size-7 items-center justify-center rounded-full border border-dashed transition focus-visible:ring-2 focus-visible:outline-none"
                  title="Add reaction"
                  aria-label="Add reaction"
                  @click="toggleReaction(mIdx, 0)"
                >
                  <Smile class="size-3.5" aria-hidden="true" />
                </button>
              </div>

              <!-- Quick Action Buttons -->
              <div class="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-8 gap-1.5 text-xs"
                >
                  <Handshake class="size-3.5" aria-hidden="true" />
                  Offer Help
                </Button>
                <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs font-medium">
                  <MessageSquare class="text-muted-foreground size-3.5" aria-hidden="true" />
                  <span>Reply in Thread</span>
                  <span
                    v-if="member.threadCount"
                    class="bg-muted text-foreground py-0.2 ml-0.5 rounded px-1.5 font-mono text-xs font-bold tabular-nums"
                  >
                    {{ member.threadCount }}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
