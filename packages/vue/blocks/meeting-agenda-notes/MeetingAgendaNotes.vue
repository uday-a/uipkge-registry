<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileDown,
  FileSpreadsheet,
  FileText,
  GitPullRequest,
  ListOrdered,
  Lock,
  Plus,
  Radio,
  Sparkles,
  UserCheck,
  Video,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

// Meeting Info State
const copiedRoomLink = ref(false)
const copiedNotes = ref(false)
const copiedSnippet = ref(false)

function copyRoomLink() {
  navigator.clipboard?.writeText('https://zoom.us/j/4829017734')
  copiedRoomLink.value = true
  setTimeout(() => {
    copiedRoomLink.value = false
  }, 2000)
}

function copyCodeSnippet() {
  const code = `export default defineRegistryItem({
  name: 'meeting-agenda-notes',
  type: 'registry:block',
  categories: ['productivity', 'collaboration'],
  framework: 'vue',
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/separator.json',
  ],
})`
  navigator.clipboard?.writeText(code)
  copiedSnippet.value = true
  setTimeout(() => {
    copiedSnippet.value = false
  }, 2000)
}

// Attendees
interface Attendee {
  id: string
  name: string
  role: string
  initials: string
  isHost?: boolean
  status: 'online' | 'present' | 'away'
  colorClass: string
}

const attendees = ref<Attendee[]>([
  {
    id: 'att-1',
    name: 'Elena Rostova',
    role: 'Principal Architect',
    initials: 'ER',
    isHost: true,
    status: 'online',
    colorClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold',
  },
  {
    id: 'att-2',
    name: 'Marcus Vance',
    role: 'Staff Engineer',
    initials: 'MV',
    status: 'online',
    colorClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold',
  },
  {
    id: 'att-3',
    name: 'Sarah Jenkins',
    role: 'Product Lead',
    initials: 'SJ',
    status: 'online',
    colorClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold',
  },
  {
    id: 'att-4',
    name: 'David Chen',
    role: 'Core Infra',
    initials: 'DC',
    status: 'online',
    colorClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold',
  },
  {
    id: 'att-5',
    name: 'Sofia Rossi',
    role: 'Design Systems',
    initials: 'SR',
    status: 'online',
    colorClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold',
  },
  {
    id: 'att-6',
    name: 'Alex Rivera',
    role: 'DevRel',
    initials: 'AR',
    status: 'online',
    colorClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold',
  },
])

// Timeboxed Agenda Topics
interface AgendaTopic {
  id: string
  number: number
  title: string
  duration: string
  timeRange: string
  lead: string
  leadInitials: string
  status: 'completed' | 'active' | 'upcoming'
  summary: string
  tags: string[]
}

const agendaTopics = ref<AgendaTopic[]>([
  {
    id: 'topic-1',
    number: 1,
    title: 'OKLCH Token Migration Status',
    duration: '15m',
    timeRange: '14:00 - 14:15',
    lead: 'Elena Rostova',
    leadInitials: 'ER',
    status: 'completed',
    summary:
      'Audit of 140+ CSS custom properties completed. Confirmed wide-gamut Display P3 color spaces with zero degradation in legacy sRGB browsers.',
    tags: ['Design System', 'Tailwind v4'],
  },
  {
    id: 'topic-2',
    number: 2,
    title: 'Dual-Framework AST Verification Pipeline',
    duration: '20m',
    timeRange: '14:15 - 14:35',
    lead: 'Marcus Vance',
    leadInitials: 'MV',
    status: 'active',
    summary:
      'Live AST comparisons between Vue SFC templates and React TSX JSX trees. Validating component prop parity, variant definitions, and event handlers automatically in CI.',
    tags: ['Compiler', 'CI/CD', 'Parity'],
  },
  {
    id: 'topic-3',
    number: 3,
    title: '100-Block Registry Expansion Strategy',
    duration: '15m',
    timeRange: '14:35 - 14:50',
    lead: 'Sarah Jenkins',
    leadInitials: 'SJ',
    status: 'upcoming',
    summary:
      'Prioritization matrix for upcoming vertical blocks: Healthcare appointment management, HRMS payroll ledger, and DevTools query workbench.',
    tags: ['Roadmap', 'Blocks'],
  },
  {
    id: 'topic-4',
    number: 4,
    title: 'Q&A & Retrospective',
    duration: '10m',
    timeRange: '14:50 - 15:00',
    lead: 'Open Floor',
    leadInitials: 'OF',
    status: 'upcoming',
    summary:
      'Consensus check on flat URL dependency format, open architectural blockers, and sprint task assignment review.',
    tags: ['Open Floor', 'Review'],
  },
])

// Discussion Notes & Live Comments
interface NoteEntry {
  id: string
  author: string
  authorInitials: string
  authorColor: string
  timestamp: string
  content: string
  tag: string
}

const liveNotes = ref<NoteEntry[]>([
  {
    id: 'note-1',
    author: 'Marcus Vance',
    authorInitials: 'MV',
    authorColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    timestamp: '14:22 PST',
    content:
      'The AST parity checker runs under 340ms locally with caching. We will add a strict blocking threshold in GitHub Actions.',
    tag: '#pipeline',
  },
  {
    id: 'note-2',
    author: 'Sofia Rossi',
    authorInitials: 'SR',
    authorColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    timestamp: '14:31 PST',
    content:
      'All color tokens now satisfy WCAG AAA for text-foreground and AA for muted-foreground across dark surfaces.',
    tag: '#design-tokens',
  },
])

const newNoteDraft = ref('')
const newNoteTag = ref('#architecture')

function addNote() {
  if (!newNoteDraft.value.trim()) return
  liveNotes.value.push({
    id: `note-${Date.now()}`,
    author: 'Elena Rostova',
    authorInitials: 'ER',
    authorColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    timestamp: 'Just now',
    content: newNoteDraft.value.trim(),
    tag: newNoteTag.value,
  })
  newNoteDraft.value = ''
}

// Action Items Checklist
interface ActionItem {
  id: string
  title: string
  assignee: string
  assigneeInitials: string
  assigneeColor: string
  dueDate: string
  priority: 'Urgent' | 'High' | 'Medium' | 'Low'
  completed: boolean
}

const actionItems = ref<ActionItem[]>([
  {
    id: 'task-1',
    title: 'Publish OKLCH color token specification to documentation',
    assignee: 'Elena Rostova',
    assigneeInitials: 'ER',
    assigneeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    dueDate: 'Aug 24, 2026',
    priority: 'High',
    completed: true,
  },
  {
    id: 'task-2',
    title: 'Configure AST parity tests in GitHub Actions CI workflow',
    assignee: 'Marcus Vance',
    assigneeInitials: 'MV',
    assigneeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    dueDate: 'Aug 26, 2026',
    priority: 'Urgent',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Draft block wireframes for Healthcare & HRMS verticals',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    assigneeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
    dueDate: 'Aug 28, 2026',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Benchmark bundle size delta across 50+ imported primitives',
    assignee: 'David Chen',
    assigneeInitials: 'DC',
    assigneeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    dueDate: 'Sep 02, 2026',
    priority: 'Low',
    completed: false,
  },
])

const completedTasksCount = computed(() => actionItems.value.filter((t) => t.completed).length)
const totalTasksCount = computed(() => actionItems.value.length)
const completionPercentage = computed(() =>
  totalTasksCount.value === 0 ? 0 : Math.round((completedTasksCount.value / totalTasksCount.value) * 100),
)

function toggleTask(id: string, checked: boolean) {
  const item = actionItems.value.find((t) => t.id === id)
  if (item) {
    item.completed = checked
  }
}

const newTaskTitle = ref('')
const newTaskAssignee = ref('Alex Rivera')
const newTaskPriority = ref<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium')

function addTask() {
  if (!newTaskTitle.value.trim()) return
  const attendee = attendees.value.find((a) => a.name === newTaskAssignee.value) || attendees.value[0]
  actionItems.value.push({
    id: `task-${Date.now()}`,
    title: newTaskTitle.value.trim(),
    assignee: attendee.name,
    assigneeInitials: attendee.initials,
    assigneeColor: attendee.colorClass,
    dueDate: 'Aug 30, 2026',
    priority: newTaskPriority.value,
    completed: false,
  })
  newTaskTitle.value = ''
}

// Key Decisions Log
interface KeyDecision {
  id: string
  number: number
  title: string
  context: string
  status: 'Adopted' | 'Under Review'
  decidedBy: string
  time: string
}

const keyDecisions = ref<KeyDecision[]>([
  {
    id: 'dec-1',
    number: 1,
    title: 'Adopt flat registryDependencies URLs across all 300+ items',
    context:
      'Declaring flat JSON URLs eliminates circular dependency warnings and simplifies downstream registry resolver graphs.',
    status: 'Adopted',
    decidedBy: 'Elena Rostova',
    time: '14:18 PST',
  },
  {
    id: 'dec-2',
    number: 2,
    title: 'Enforce strict 120-char line width & no-semicolons styleguide',
    context:
      'Standardizes AST transpilation outputs so generated Vue SFC and React TSX items maintain identical formatting invariants.',
    status: 'Adopted',
    decidedBy: 'Squad Consensus',
    time: '14:32 PST',
  },
  {
    id: 'dec-3',
    number: 3,
    title: 'Deprecate legacy /r/nuxt/ aliases by end of Q3',
    context:
      'Consumers will be directed to unified /r/vue/ endpoints while maintaining backwards-compatible 301 redirects.',
    status: 'Under Review',
    decidedBy: 'Sarah Jenkins',
    time: '14:45 PST',
  },
])

// Export Notes Markdown Function
function exportNotesMarkdown() {
  const md = `# Q3 Product Architecture & Monorepo Scaling Sync
**Date:** Friday, Aug 21, 2026 · 14:00 - 15:00 PST
**Meeting Room:** Zoom Room #482-901
**Attendees:** Elena Rostova (Host), Marcus Vance, Sarah Jenkins, David Chen, Sofia Rossi, Alex Rivera

---

## 📋 Timeboxed Agenda
- [x] **OKLCH Token Migration Status** (15m · 14:00 - 14:15) - Elena Rostova
- [x] **Dual-Framework AST Verification Pipeline** (20m · 14:15 - 14:35) - Marcus Vance [ACTIVE]
- [ ] **100-Block Registry Expansion Strategy** (15m · 14:35 - 14:50) - Sarah Jenkins
- [ ] **Q&A & Retrospective** (10m · 14:50 - 15:00) - Open Floor

---

## 💡 Key Architectural Decisions
1. **Adopt flat registryDependencies URLs across all 300+ items** [Adopted]
   - *Decided by:* Elena Rostova · 14:18 PST
   - *Context:* Eliminates circular dependency warnings in shadcn resolver.
2. **Enforce strict 120-char line width & no-semicolons styleguide** [Adopted]
   - *Decided by:* Squad Consensus · 14:32 PST
   - *Context:* Standardizes AST transpilation outputs across Vue & React.
3. **Deprecate legacy /r/nuxt/ aliases by end of Q3** [Under Review]
   - *Decided by:* Sarah Jenkins · 14:45 PST
   - *Context:* Directs consumers to unified /r/vue/ endpoints.

---

## ✅ Action Items
${actionItems.value
  .map(
    (task) =>
      `- [${task.completed ? 'x' : ' '}] **${task.title}** (Assignee: @${task.assignee}, Due: ${task.dueDate}, Priority: ${task.priority})`,
  )
  .join('\n')}
`
  navigator.clipboard?.writeText(md)
  copiedNotes.value = true
  setTimeout(() => {
    copiedNotes.value = false
  }, 2000)
}
</script>

<template>
  <div data-slot="meeting-agenda-notes" :class="cn('text-foreground w-full space-y-6', props.class)">
    <!-- Meeting Header Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="space-y-5 p-4 sm:p-6">
        <!-- Top Badges & Status Row -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" class="gap-1.5 px-2.5 py-1 text-xs font-medium">
              <span class="size-2 animate-pulse rounded-full bg-red-500" />
              <span class="font-mono tracking-tight tabular-nums">REC · 45:12</span>
            </Badge>
            <Badge variant="outline" class="text-muted-foreground text-xs"> Architecture Sync </Badge>
            <Badge variant="outline" class="text-muted-foreground text-xs"> Bi-Weekly Cadence </Badge>
          </div>

          <!-- Meeting Actions -->
          <div class="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs shadow-xs" @click="exportNotesMarkdown">
              <Check v-if="copiedNotes" class="size-3.5 text-emerald-500" />
              <FileDown v-else class="text-muted-foreground size-3.5" />
              {{ copiedNotes ? 'Notes Copied!' : 'Export Notes Markdown' }}
            </Button>
            <Button size="sm" class="h-8 gap-1.5 text-xs shadow-xs">
              <Video class="size-3.5" />
              Join Call
            </Button>
          </div>
        </div>

        <!-- Meeting Title & Meta Info -->
        <div class="space-y-2">
          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Q3 Product Architecture & Monorepo Scaling Sync
          </h1>

          <div class="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <!-- Date & Time -->
            <div class="flex items-center gap-1.5">
              <Calendar class="text-foreground/70 size-3.5" />
              <span class="text-foreground/90 font-medium">Friday, Aug 21, 2026</span>
              <span>·</span>
              <span class="font-mono tabular-nums">14:00 - 15:00 PST</span>
            </div>

            <!-- Duration Badge -->
            <div class="flex items-center gap-1.5">
              <Clock class="text-foreground/70 size-3.5" />
              <Badge variant="secondary" class="px-2 py-0.5 font-mono text-xs tabular-nums">
                60 mins · 45 mins elapsed
              </Badge>
            </div>

            <!-- Meeting Room Link -->
            <div class="flex items-center gap-1.5">
              <Video class="text-foreground/70 size-3.5" />
              <button
                type="button"
                class="text-foreground hover:text-primary inline-flex min-h-6 cursor-pointer items-center gap-1 font-medium transition-colors"
                @click="copyRoomLink"
              >
                <span>Zoom Room #482-901</span>
                <Check v-if="copiedRoomLink" class="size-3 text-emerald-500" />
                <Copy v-else class="text-muted-foreground size-3" />
              </button>
            </div>
          </div>
        </div>

        <Separator class="bg-border/60" />

        <!-- Attendee Avatars Row -->
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"> Attendees </span>
              <Badge variant="secondary" class="h-4.5 px-1.5 py-0 font-mono text-xs tabular-nums"> 6 Present </Badge>
            </div>

            <!-- Avatars with online status dots -->
            <div class="flex flex-wrap items-center gap-2.5">
              <div
                v-for="attendee in attendees"
                :key="attendee.id"
                class="group border-border/80 bg-background/80 hover:border-border hover:bg-muted/40 relative flex items-center gap-2 rounded-full border py-1 pr-2.5 pl-1 shadow-xs transition-colors"
              >
                <div class="relative flex items-center justify-center">
                  <Avatar size="sm" class="size-6 text-xs">
                    <AvatarFallback :class="attendee.colorClass">
                      {{ attendee.initials }}
                    </AvatarFallback>
                  </Avatar>
                  <!-- Presence Status Dot -->
                  <span
                    class="border-background absolute -right-0.5 -bottom-0.5 size-2 rounded-full border-2 bg-emerald-500"
                    title="Present in meeting"
                  />
                </div>
                <span class="text-foreground text-xs font-medium">
                  {{ attendee.name }}
                </span>
                <Badge
                  v-if="attendee.isHost"
                  variant="default"
                  class="h-4 px-1 text-xs leading-none font-semibold uppercase"
                >
                  Host
                </Badge>
              </div>
            </div>
          </div>

          <!-- Quick Access Code / Status -->
          <div
            class="border-border/60 bg-muted/30 text-muted-foreground hidden items-center gap-3 rounded-lg border p-2.5 text-xs xl:flex"
          >
            <Radio class="size-4 animate-pulse text-emerald-500" />
            <div>
              <div class="text-foreground font-medium">Live Transcription</div>
              <div class="text-muted-foreground font-mono">Whisper-v3 Active</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 2-Column Meeting Workspace -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Panel: Timeboxed Agenda & Rich Notes (8 cols) -->
      <div class="space-y-6 lg:col-span-7 xl:col-span-8">
        <!-- Section 1: 4 Timeboxed Agenda Topics -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="px-5 pt-5 pb-3 sm:px-6">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <ListOrdered class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base font-semibold">Timeboxed Agenda</CardTitle>
                  <CardDescription class="text-xs">
                    4 topics structured with real-time progress indicators
                  </CardDescription>
                </div>
              </div>

              <!-- Time Allocation Summary -->
              <Badge variant="outline" class="text-muted-foreground font-mono text-xs tabular-nums">
                60m Total · 45m Elapsed (75%)
              </Badge>
            </div>

            <!-- Elapsed Visual Bar -->
            <div class="bg-muted mt-3 h-1.5 w-full overflow-hidden rounded-full">
              <div class="bg-primary h-full w-3/4 rounded-full transition-all duration-300" />
            </div>
          </CardHeader>

          <CardContent class="space-y-3 p-5 pt-2 sm:p-6">
            <div
              v-for="topic in agendaTopics"
              :key="topic.id"
              :class="
                cn(
                  'group relative rounded-lg border p-4 transition-all duration-150',
                  topic.status === 'active'
                    ? 'border-primary/50 bg-primary/[0.03] shadow-xs'
                    : topic.status === 'completed'
                      ? 'border-border/80 bg-muted/20'
                      : 'border-border/60 bg-card hover:border-border',
                )
              "
            >
              <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <!-- Topic Details -->
                <div class="flex-1 space-y-1.5">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="bg-muted text-muted-foreground flex size-5 items-center justify-center rounded-full font-mono text-xs font-semibold"
                    >
                      {{ topic.number }}
                    </span>

                    <h3 class="text-foreground text-sm font-semibold">
                      {{ topic.title }}
                    </h3>

                    <!-- Status Badges -->
                    <Badge v-if="topic.status === 'completed'" variant="success" class="gap-1 text-xs">
                      <CheckCircle2 class="size-3 text-emerald-500" />
                      Completed
                    </Badge>
                    <Badge v-else-if="topic.status === 'active'" variant="default" class="gap-1.5 text-xs font-medium">
                      <span class="bg-primary-foreground size-1.5 rounded-full" />
                      Current Topic
                    </Badge>
                    <Badge v-else variant="outline" class="text-muted-foreground gap-1 text-xs">
                      <Clock class="size-3" />
                      Upcoming
                    </Badge>
                  </div>

                  <p class="text-muted-foreground text-xs leading-relaxed">
                    {{ topic.summary }}
                  </p>

                  <!-- Tags -->
                  <div class="flex flex-wrap items-center gap-1.5 pt-1">
                    <Badge
                      v-for="tag in topic.tags"
                      :key="tag"
                      variant="secondary"
                      class="text-muted-foreground px-1.5 py-0 text-xs font-normal"
                    >
                      {{ tag }}
                    </Badge>
                  </div>
                </div>

                <!-- Presenter & Timebox Metadata -->
                <div
                  class="border-border/50 flex shrink-0 items-center justify-between gap-1.5 border-t pt-2 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0"
                >
                  <div class="flex items-center gap-1.5">
                    <span class="text-muted-foreground font-mono text-xs tabular-nums">
                      {{ topic.duration }}
                    </span>
                    <span class="text-muted-foreground font-mono text-xs tabular-nums">
                      {{ topic.timeRange }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <Avatar size="xs" class="size-4.5 text-xs">
                      <AvatarFallback class="bg-muted text-muted-foreground text-xs font-semibold">
                        {{ topic.leadInitials }}
                      </AvatarFallback>
                    </Avatar>
                    <span class="text-foreground/80 text-xs font-medium">
                      {{ topic.lead }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Section 2: Rich Discussion Notes Area -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="px-5 pt-5 pb-3 sm:px-6">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <FileText class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base font-semibold">Discussion Notes & Technical Blueprint</CardTitle>
                  <CardDescription class="text-xs">
                    Structured architectural takeaways and runtime benchmarks
                  </CardDescription>
                </div>
              </div>

              <span class="text-muted-foreground font-mono text-xs tabular-nums">
                Last edited 2m ago by Elena Rostova
              </span>
            </div>
          </CardHeader>

          <CardContent class="space-y-5 p-5 pt-2 sm:p-6">
            <!-- Context Callout Box -->
            <div class="border-border bg-muted/40 space-y-1 rounded-lg border p-3.5">
              <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Sparkles class="text-primary size-3.5" />
                Core Monorepo Mandate
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Components are the product, not an npm library. Consumers run
                <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium"
                  >npx shadcn-vue add &lt;url&gt;</code
                >
                and own the code directly. All block primitives must compose raw layouts without baking rigid data
                arrays into primitives.
              </p>
            </div>

            <!-- Structured Takeaways Section -->
            <div class="space-y-2.5">
              <h4 class="text-muted-foreground text-xs font-bold tracking-wider uppercase">Architectural Takeaways</h4>

              <div class="space-y-2">
                <div class="border-border/60 bg-card flex items-start gap-2.5 rounded-md border p-3 shadow-xs">
                  <div
                    class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    <Check class="size-3" />
                  </div>
                  <div class="space-y-0.5 text-xs">
                    <span class="text-foreground font-semibold">Zero Runtime Overhead Delivery Model</span>
                    <p class="text-muted-foreground leading-relaxed">
                      Zero build-time vendor lock-in. Primitives handle focus rings, keyboard navigation, and
                      accessibility semantics while leaving styling tokens fully customizable by end consumers.
                    </p>
                  </div>
                </div>

                <div class="border-border/60 bg-card flex items-start gap-2.5 rounded-md border p-3 shadow-xs">
                  <div
                    class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  >
                    <Check class="size-3" />
                  </div>
                  <div class="space-y-0.5 text-xs">
                    <span class="text-foreground font-semibold">Perceptually Uniform OKLCH Palette</span>
                    <p class="text-muted-foreground leading-relaxed">
                      Color spaces mapped directly to standard OKLCH coordinates via Tailwind CSS v4
                      <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono">@theme inline</code> tokens,
                      ensuring high-fidelity rendering across Apple P3 displays.
                    </p>
                  </div>
                </div>

                <div class="border-border/60 bg-card flex items-start gap-2.5 rounded-md border p-3 shadow-xs">
                  <div
                    class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400"
                  >
                    <Check class="size-3" />
                  </div>
                  <div class="space-y-0.5 text-xs">
                    <span class="text-foreground font-semibold">Flat Registry Dependencies Graph</span>
                    <p class="text-muted-foreground leading-relaxed">
                      All
                      <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono">registryDependencies</code>
                      declare flat URLs (<code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono"
                        >https://uipkge.dev/r/button.json</code
                      >), eliminating nested resolver locks in downstream CLIs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code Architecture Blueprint -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="text-muted-foreground text-xs font-bold tracking-wider uppercase">Manifest Blueprint</h4>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground flex min-h-6 cursor-pointer items-center gap-1 text-xs transition-colors"
                  @click="copyCodeSnippet"
                >
                  <Check v-if="copiedSnippet" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span class="font-mono text-xs">{{ copiedSnippet ? 'Copied' : 'Copy Manifest' }}</span>
                </button>
              </div>

              <div
                class="border-border/80 bg-muted/60 relative overflow-hidden rounded-lg border p-3 font-mono text-xs"
              >
                <pre
                  class="text-foreground/90 overflow-x-auto leading-relaxed"
                ><code><span class="text-purple-600 dark:text-purple-400">export default</span> <span class="text-blue-600 dark:text-blue-400">defineRegistryItem</span>({
  name: <span class="text-emerald-600 dark:text-emerald-400">'meeting-agenda-notes'</span>,
  type: <span class="text-emerald-600 dark:text-emerald-400">'registry:block'</span>,
  categories: [<span class="text-emerald-600 dark:text-emerald-400">'productivity'</span>, <span class="text-emerald-600 dark:text-emerald-400">'collaboration'</span>],
  dependencies: [<span class="text-emerald-600 dark:text-emerald-400">'lucide-vue-next'</span>],
  registryDependencies: [
    <span class="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/avatar.json'</span>,
    <span class="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/badge.json'</span>,
    <span class="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/button.json'</span>,
    <span class="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/card.json'</span>,
    <span class="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/checkbox.json'</span>,
    <span class="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/separator.json'</span>,
  ],
})</code></pre>
              </div>
            </div>

            <!-- Live Meeting Annotations & Comment Thread -->
            <div class="space-y-3 pt-2">
              <h4 class="text-muted-foreground text-xs font-bold tracking-wider uppercase">Live Annotations</h4>

              <div class="space-y-2.5">
                <div
                  v-for="note in liveNotes"
                  :key="note.id"
                  class="border-border/60 bg-muted/20 flex items-start gap-2.5 rounded-lg border p-3"
                >
                  <Avatar size="sm" class="size-6 shrink-0 text-xs">
                    <AvatarFallback :class="note.authorColor">
                      {{ note.authorInitials }}
                    </AvatarFallback>
                  </Avatar>

                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-1.5">
                        <span class="text-foreground text-xs font-semibold">{{ note.author }}</span>
                        <Badge variant="outline" class="text-muted-foreground px-1 py-0 font-mono text-xs">
                          {{ note.tag }}
                        </Badge>
                      </div>
                      <span class="text-muted-foreground font-mono text-xs tabular-nums">{{ note.timestamp }}</span>
                    </div>
                    <p class="text-foreground/90 text-xs leading-relaxed">{{ note.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Inline Note Composer -->
              <div class="flex flex-col items-stretch gap-2 pt-2 sm:flex-row sm:items-center">
                <div class="relative flex-1">
                  <input
                    v-model="newNoteDraft"
                    type="text"
                    placeholder="Append architecture note or observation..."
                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 h-8 w-full rounded-md border px-3 py-1 text-xs shadow-xs outline-none focus-visible:ring-2"
                    @keydown.enter="addNote"
                  />
                </div>

                <div class="flex items-center gap-1.5">
                  <select
                    v-model="newNoteTag"
                    class="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/40 h-8 rounded-md border px-2 text-xs shadow-xs outline-none focus-visible:ring-2"
                  >
                    <option value="#architecture">#architecture</option>
                    <option value="#pipeline">#pipeline</option>
                    <option value="#decision">#decision</option>
                    <option value="#action">#action</option>
                  </select>

                  <Button
                    size="sm"
                    variant="secondary"
                    class="h-8 gap-1 text-xs shadow-xs"
                    :disabled="!newNoteDraft.trim()"
                    @click="addNote"
                  >
                    <Plus class="size-3.5" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Sidebar: Action Items, Decisions, & Meta (4-5 cols) -->
      <div class="space-y-6 lg:col-span-5 xl:col-span-4">
        <!-- Action Items Checklist Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="px-5 pt-5 pb-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <UserCheck class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base font-semibold">Action Items</CardTitle>
                  <CardDescription class="text-xs"> Assigned deliverables & deadlines </CardDescription>
                </div>
              </div>

              <!-- Completion Counter Badge -->
              <Badge variant="secondary" class="font-mono text-xs tabular-nums">
                {{ completedTasksCount }}/{{ totalTasksCount }} Done ({{ completionPercentage }}%)
              </Badge>
            </div>

            <!-- Progress bar -->
            <div class="bg-muted mt-3 h-1.5 w-full overflow-hidden rounded-full">
              <div
                class="h-full rounded-full bg-emerald-500 transition-all duration-300"
                :style="{ width: `${completionPercentage}%` }"
              />
            </div>
          </CardHeader>

          <CardContent class="space-y-4 p-5 pt-2">
            <!-- Checklist items -->
            <div class="space-y-2.5">
              <div
                v-for="task in actionItems"
                :key="task.id"
                :class="
                  cn(
                    'group flex items-start gap-3 rounded-lg border p-3 transition-colors',
                    task.completed
                      ? 'border-border/40 bg-muted/20 opacity-75'
                      : 'border-border/80 bg-card hover:border-border hover:bg-muted/10',
                  )
                "
              >
                <!-- Checkbox -->
                <div class="pt-0.5">
                  <Checkbox
                    :id="task.id"
                    :model-value="task.completed"
                    @update:model-value="(val) => toggleTask(task.id, Boolean(val))"
                  />
                </div>

                <!-- Task content -->
                <div class="flex-1 space-y-1.5">
                  <label
                    :for="task.id"
                    :class="
                      cn(
                        'block cursor-pointer text-xs leading-relaxed font-medium transition-colors select-none',
                        task.completed ? 'text-muted-foreground line-through' : 'text-foreground',
                      )
                    "
                  >
                    {{ task.title }}
                  </label>

                  <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-1.5 text-xs">
                    <!-- Assignee -->
                    <div class="flex items-center gap-1.5">
                      <Avatar size="xs" class="size-4 text-xs">
                        <AvatarFallback :class="cn('text-xs', task.assigneeColor)">
                          {{ task.assigneeInitials }}
                        </AvatarFallback>
                      </Avatar>
                      <span class="text-foreground/80 text-xs font-medium">
                        {{ task.assignee }}
                      </span>
                    </div>

                    <!-- Priority & Date -->
                    <div class="flex items-center gap-1.5">
                      <Badge
                        :variant="
                          task.priority === 'Urgent' || task.priority === 'High'
                            ? 'destructive'
                            : task.priority === 'Medium'
                              ? 'warning'
                              : 'secondary'
                        "
                        class="h-4.5 px-1.5 text-xs font-semibold uppercase"
                      >
                        {{ task.priority }}
                      </Badge>
                      <span class="text-muted-foreground font-mono text-xs tabular-nums">
                        {{ task.dueDate }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Add Action Item -->
            <div class="border-border/80 bg-muted/20 space-y-2 rounded-lg border border-dashed p-3">
              <input
                v-model="newTaskTitle"
                type="text"
                placeholder="New action item description..."
                class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring h-7 w-full rounded border px-2.5 text-xs shadow-xs outline-none focus-visible:ring-1"
                @keydown.enter="addTask"
              />

              <div class="flex items-center justify-between gap-2">
                <select
                  v-model="newTaskAssignee"
                  class="border-input bg-background text-foreground h-7 rounded border px-2 text-xs shadow-xs outline-none"
                >
                  <option v-for="att in attendees" :key="att.id" :value="att.name">
                    {{ att.name }}
                  </option>
                </select>

                <select
                  v-model="newTaskPriority"
                  class="border-input bg-background text-foreground h-7 rounded border px-2 text-xs shadow-xs outline-none"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <Button
                  size="xs"
                  variant="default"
                  class="h-7 gap-1 text-xs"
                  :disabled="!newTaskTitle.trim()"
                  @click="addTask"
                >
                  <Plus class="size-3" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Key Decisions Log Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="px-5 pt-5 pb-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400"
                >
                  <Sparkles class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base font-semibold">Key Decisions Log</CardTitle>
                  <CardDescription class="text-xs"> Recorded architectural consensus </CardDescription>
                </div>
              </div>

              <Badge variant="outline" class="text-muted-foreground font-mono text-xs tabular-nums">
                {{ keyDecisions.length }} Recorded
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-3 p-5 pt-2">
            <div
              v-for="decision in keyDecisions"
              :key="decision.id"
              class="border-border/80 bg-card space-y-2 rounded-lg border p-3.5 shadow-xs"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-1.5">
                  <span class="text-muted-foreground font-mono text-xs font-bold"> D-0{{ decision.number }} </span>
                  <Badge
                    :variant="decision.status === 'Adopted' ? 'success' : 'warning'"
                    class="h-4.5 px-1.5 text-xs font-semibold uppercase"
                  >
                    {{ decision.status }}
                  </Badge>
                </div>

                <span class="text-muted-foreground font-mono text-xs tabular-nums">
                  {{ decision.time }}
                </span>
              </div>

              <h4 class="text-foreground text-xs leading-snug font-semibold">
                {{ decision.title }}
              </h4>

              <p class="text-muted-foreground text-xs leading-relaxed">
                {{ decision.context }}
              </p>

              <div class="text-muted-foreground border-border/40 flex items-center gap-1 border-t pt-1 text-xs">
                <span>Decided by:</span>
                <span class="text-foreground font-medium">{{ decision.decidedBy }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Meeting Metadata & Shared Resources Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="px-5 pt-4 pb-2">
            <CardTitle class="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Session Resources & Security
            </CardTitle>
          </CardHeader>

          <CardContent class="space-y-3 p-5 pt-1">
            <div class="space-y-2 text-xs">
              <div class="text-muted-foreground flex items-center justify-between">
                <span class="flex items-center gap-1.5">
                  <Lock class="text-foreground/70 size-3.5" />
                  Access Level
                </span>
                <span class="text-foreground font-medium">Internal (SSO Auth)</span>
              </div>

              <div class="text-muted-foreground flex items-center justify-between">
                <span class="flex items-center gap-1.5">
                  <Calendar class="text-foreground/70 size-3.5" />
                  Next Sync
                </span>
                <span class="text-foreground font-mono font-medium tabular-nums">Aug 28 · 14:00 PST</span>
              </div>
            </div>

            <Separator class="bg-border/60" />

            <!-- Linked Resources -->
            <div class="space-y-1.5">
              <span class="text-muted-foreground text-xs font-semibold">Attached Artifacts</span>

              <div class="space-y-1">
                <a
                  href="#artifacts"
                  class="text-foreground hover:bg-muted group flex items-center justify-between rounded-md p-1.5 text-xs transition-colors"
                >
                  <span class="flex items-center gap-2">
                    <FileSpreadsheet class="size-3.5 text-emerald-500" />
                    <span>OKLCH Token Audit Matrix.xlsx</span>
                  </span>
                  <ExternalLink class="text-muted-foreground group-hover:text-foreground size-3 transition-colors" />
                </a>

                <a
                  href="#artifacts"
                  class="text-foreground hover:bg-muted group flex items-center justify-between rounded-md p-1.5 text-xs transition-colors"
                >
                  <span class="flex items-center gap-2">
                    <GitPullRequest class="size-3.5 text-purple-500" />
                    <span>PR #412: Flat Dependency Resolution</span>
                  </span>
                  <ExternalLink class="text-muted-foreground group-hover:text-foreground size-3 transition-colors" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
