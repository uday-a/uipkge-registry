'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

export interface MeetingAgendaNotesProps {
  className?: string
}

interface Attendee {
  id: string
  name: string
  role: string
  initials: string
  isHost?: boolean
  status: 'online' | 'present' | 'away'
  colorClass: string
}

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

interface NoteEntry {
  id: string
  author: string
  authorInitials: string
  authorColor: string
  timestamp: string
  content: string
  tag: string
}

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

interface KeyDecision {
  id: string
  number: number
  title: string
  context: string
  status: 'Adopted' | 'Under Review'
  decidedBy: string
  time: string
}

const INITIAL_ATTENDEES: Attendee[] = [
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
]

const INITIAL_TOPICS: AgendaTopic[] = [
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
]

const INITIAL_NOTES: NoteEntry[] = [
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
]

const INITIAL_TASKS: ActionItem[] = [
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
]

const INITIAL_DECISIONS: KeyDecision[] = [
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
]

export function MeetingAgendaNotes({ className }: MeetingAgendaNotesProps) {
  const [copiedRoomLink, setCopiedRoomLink] = React.useState(false)
  const [copiedNotes, setCopiedNotes] = React.useState(false)
  const [copiedSnippet, setCopiedSnippet] = React.useState(false)

  const [attendees] = React.useState<Attendee[]>(INITIAL_ATTENDEES)
  const [agendaTopics] = React.useState<AgendaTopic[]>(INITIAL_TOPICS)
  const [liveNotes, setLiveNotes] = React.useState<NoteEntry[]>(INITIAL_NOTES)
  const [newNoteDraft, setNewNoteDraft] = React.useState('')
  const [newNoteTag, setNewNoteTag] = React.useState('#architecture')

  const [actionItems, setActionItems] = React.useState<ActionItem[]>(INITIAL_TASKS)
  const [newTaskTitle, setNewTaskTitle] = React.useState('')
  const [newTaskAssignee, setNewTaskAssignee] = React.useState('Alex Rivera')
  const [newTaskPriority, setNewTaskPriority] = React.useState<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium')

  const [keyDecisions] = React.useState<KeyDecision[]>(INITIAL_DECISIONS)

  const completedTasksCount = actionItems.filter((t) => t.completed).length
  const totalTasksCount = actionItems.length
  const completionPercentage = totalTasksCount === 0 ? 0 : Math.round((completedTasksCount / totalTasksCount) * 100)

  const copyRoomLink = () => {
    navigator.clipboard?.writeText('https://zoom.us/j/4829017734')
    setCopiedRoomLink(true)
    setTimeout(() => setCopiedRoomLink(false), 2000)
  }

  const copyCodeSnippet = () => {
    const code = `export default defineRegistryItem({
  name: 'meeting-agenda-notes',
  type: 'registry:block',
  categories: ['productivity', 'collaboration'],
  framework: 'react',
  dependencies: ['lucide-react'],
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
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  const exportNotesMarkdown = () => {
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
${actionItems
  .map(
    (task) =>
      `- [${task.completed ? 'x' : ' '}] **${task.title}** (Assignee: @${task.assignee}, Due: ${task.dueDate}, Priority: ${task.priority})`,
  )
  .join('\n')}
`
    navigator.clipboard?.writeText(md)
    setCopiedNotes(true)
    setTimeout(() => setCopiedNotes(false), 2000)
  }

  const toggleTask = (id: string, checked: boolean) => {
    setActionItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: checked } : item)))
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return
    const attendee = attendees.find((a) => a.name === newTaskAssignee) || attendees[0]
    setActionItems((prev) => [
      ...prev,
      {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        assignee: attendee.name,
        assigneeInitials: attendee.initials,
        assigneeColor: attendee.colorClass,
        dueDate: 'Aug 30, 2026',
        priority: newTaskPriority,
        completed: false,
      },
    ])
    setNewTaskTitle('')
  }

  const addNote = () => {
    if (!newNoteDraft.trim()) return
    setLiveNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        author: 'Elena Rostova',
        authorInitials: 'ER',
        authorColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
        timestamp: 'Just now',
        content: newNoteDraft.trim(),
        tag: newNoteTag,
      },
    ])
    setNewNoteDraft('')
  }

  return (
    <div data-slot="meeting-agenda-notes" className={cn('text-foreground w-full space-y-6', className)}>
      {/* Meeting Header Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="space-y-5 p-4 sm:p-6">
          {/* Top Badges & Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
                <span className="size-2 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono tracking-tight tabular-nums">REC · 45:12</span>
              </Badge>
              <Badge variant="outline" className="text-muted-foreground text-xs">
                Architecture Sync
              </Badge>
              <Badge variant="outline" className="text-muted-foreground text-xs">
                Bi-Weekly Cadence
              </Badge>
            </div>

            {/* Meeting Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs shadow-xs"
                onClick={exportNotesMarkdown}
              >
                {copiedNotes ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <FileDown className="text-muted-foreground size-3.5" />
                )}
                {copiedNotes ? 'Notes Copied!' : 'Export Notes Markdown'}
              </Button>
              <Button size="sm" className="h-8 gap-1.5 text-xs shadow-xs">
                <Video className="size-3.5" />
                Join Call
              </Button>
            </div>
          </div>

          {/* Meeting Title & Meta Info */}
          <div className="space-y-2">
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Q3 Product Architecture & Monorepo Scaling Sync
            </h1>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              {/* Date & Time */}
              <div className="flex items-center gap-1.5">
                <Calendar className="text-foreground/70 size-3.5" />
                <span className="text-foreground/90 font-medium">Friday, Aug 21, 2026</span>
                <span>·</span>
                <span className="font-mono tabular-nums">14:00 - 15:00 PST</span>
              </div>

              {/* Duration Badge */}
              <div className="flex items-center gap-1.5">
                <Clock className="text-foreground/70 size-3.5" />
                <Badge variant="secondary" className="px-2 py-0.5 font-mono text-xs tabular-nums">
                  60 mins · 45 mins elapsed
                </Badge>
              </div>

              {/* Meeting Room Link */}
              <div className="flex items-center gap-1.5">
                <Video className="text-foreground/70 size-3.5" />
                <button
                  type="button"
                  className="text-foreground hover:text-primary inline-flex min-h-6 cursor-pointer items-center gap-1 font-medium transition-colors"
                  onClick={copyRoomLink}
                >
                  <span>Zoom Room #482-901</span>
                  {copiedRoomLink ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="text-muted-foreground size-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Attendee Avatars Row */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Attendees</span>
                <Badge variant="secondary" className="h-4.5 px-1.5 py-0 font-mono text-xs tabular-nums">
                  6 Present
                </Badge>
              </div>

              {/* Avatars with online status dots */}
              <div className="flex flex-wrap items-center gap-2.5">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="group border-border/80 bg-background/80 hover:border-border hover:bg-muted/40 relative flex items-center gap-2 rounded-full border py-1 pr-2.5 pl-1 shadow-xs transition-colors"
                  >
                    <div className="relative flex items-center justify-center">
                      <Avatar size="sm" className="size-6 text-xs">
                        <AvatarFallback className={attendee.colorClass}>{attendee.initials}</AvatarFallback>
                      </Avatar>
                      {/* Presence Status Dot */}
                      <span
                        className="border-background absolute -right-0.5 -bottom-0.5 size-2 rounded-full border-2 bg-emerald-500"
                        title="Present in meeting"
                      />
                    </div>
                    <span className="text-foreground text-xs font-medium">{attendee.name}</span>
                    {attendee.isHost && (
                      <Badge variant="default" className="h-4 px-1 text-xs leading-none font-semibold uppercase">
                        Host
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Code / Status */}
            <div className="border-border/60 bg-muted/30 text-muted-foreground hidden items-center gap-3 rounded-lg border p-2.5 text-xs xl:flex">
              <Radio className="size-4 animate-pulse text-emerald-500" />
              <div>
                <div className="text-foreground font-medium">Live Transcription</div>
                <div className="text-muted-foreground font-mono">Whisper-v3 Active</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Meeting Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel: Timeboxed Agenda & Rich Notes (8 cols) */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Section 1: 4 Timeboxed Agenda Topics */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="px-5 pt-5 pb-3 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <ListOrdered className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Timeboxed Agenda</CardTitle>
                    <CardDescription className="text-xs">
                      4 topics structured with real-time progress indicators
                    </CardDescription>
                  </div>
                </div>

                {/* Time Allocation Summary */}
                <Badge variant="outline" className="text-muted-foreground font-mono text-xs tabular-nums">
                  60m Total · 45m Elapsed (75%)
                </Badge>
              </div>

              {/* Elapsed Visual Bar */}
              <div className="bg-muted mt-3 h-1.5 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full w-3/4 rounded-full transition-all duration-300" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 p-5 pt-2 sm:p-6">
              {agendaTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={cn(
                    'group relative rounded-lg border p-4 transition-all duration-150',
                    topic.status === 'active'
                      ? 'border-primary/50 bg-primary/[0.03] shadow-xs'
                      : topic.status === 'completed'
                        ? 'border-border/80 bg-muted/20'
                        : 'border-border/60 bg-card hover:border-border',
                  )}
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    {/* Topic Details */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-muted text-muted-foreground flex size-5 items-center justify-center rounded-full font-mono text-xs font-semibold">
                          {topic.number}
                        </span>

                        <h3 className="text-foreground text-sm font-semibold">{topic.title}</h3>

                        {/* Status Badges */}
                        {topic.status === 'completed' && (
                          <Badge variant="success" className="gap-1 text-xs">
                            <CheckCircle2 className="size-3 text-emerald-500" />
                            Completed
                          </Badge>
                        )}
                        {topic.status === 'active' && (
                          <Badge variant="default" className="gap-1.5 text-xs font-medium">
                            <span className="bg-primary-foreground size-1.5 rounded-full" />
                            Current Topic
                          </Badge>
                        )}
                        {topic.status === 'upcoming' && (
                          <Badge variant="outline" className="text-muted-foreground gap-1 text-xs">
                            <Clock className="size-3" />
                            Upcoming
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground text-xs leading-relaxed">{topic.summary}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {topic.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-muted-foreground px-1.5 py-0 text-xs font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Presenter & Timebox Metadata */}
                    <div className="border-border/50 flex shrink-0 items-center justify-between gap-1.5 border-t pt-2 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground font-mono text-xs tabular-nums">{topic.duration}</span>
                        <span className="text-muted-foreground font-mono text-xs tabular-nums">{topic.timeRange}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Avatar size="xs" className="size-4.5 text-xs">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                            {topic.leadInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground/80 text-xs font-medium">{topic.lead}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 2: Rich Discussion Notes Area */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="px-5 pt-5 pb-3 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Discussion Notes & Technical Blueprint</CardTitle>
                    <CardDescription className="text-xs">
                      Structured architectural takeaways and runtime benchmarks
                    </CardDescription>
                  </div>
                </div>

                <span className="text-muted-foreground font-mono text-xs tabular-nums">
                  Last edited 2m ago by Elena Rostova
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-5 pt-2 sm:p-6">
              {/* Context Callout Box */}
              <div className="border-border bg-muted/40 space-y-1 rounded-lg border p-3.5">
                <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Sparkles className="text-primary size-3.5" />
                  Core Monorepo Mandate
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Components are the product, not an npm library. Consumers run{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium">
                    npx shadcn add &lt;url&gt;
                  </code>{' '}
                  and own the code directly. All block primitives must compose raw layouts without baking rigid data
                  arrays into primitives.
                </p>
              </div>

              {/* Structured Takeaways Section */}
              <div className="space-y-2.5">
                <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Architectural Takeaways
                </h4>

                <div className="space-y-2">
                  <div className="border-border/60 bg-card flex items-start gap-2.5 rounded-md border p-3 shadow-xs">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <span className="text-foreground font-semibold">Zero Runtime Overhead Delivery Model</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Zero build-time vendor lock-in. Primitives handle focus rings, keyboard navigation, and
                        accessibility semantics while leaving styling tokens fully customizable by end consumers.
                      </p>
                    </div>
                  </div>

                  <div className="border-border/60 bg-card flex items-start gap-2.5 rounded-md border p-3 shadow-xs">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Check className="size-3" />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <span className="text-foreground font-semibold">Perceptually Uniform OKLCH Palette</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Color spaces mapped directly to standard OKLCH coordinates via Tailwind CSS v4{' '}
                        <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">@theme inline</code>{' '}
                        tokens, ensuring high-fidelity rendering across Apple P3 displays.
                      </p>
                    </div>
                  </div>

                  <div className="border-border/60 bg-card flex items-start gap-2.5 rounded-md border p-3 shadow-xs">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Check className="size-3" />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <span className="text-foreground font-semibold">Flat Registry Dependencies Graph</span>
                      <p className="text-muted-foreground leading-relaxed">
                        All{' '}
                        <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">
                          registryDependencies
                        </code>{' '}
                        declare flat URLs (
                        <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">
                          https://uipkge.dev/r/button.json
                        </code>
                        ), eliminating nested resolver locks in downstream CLIs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Architecture Blueprint */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Manifest Blueprint
                  </h4>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground flex min-h-6 cursor-pointer items-center gap-1 text-xs transition-colors"
                    onClick={copyCodeSnippet}
                  >
                    {copiedSnippet ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span className="font-mono text-xs">{copiedSnippet ? 'Copied' : 'Copy Manifest'}</span>
                  </button>
                </div>

                <div className="border-border/80 bg-muted/60 relative overflow-hidden rounded-lg border p-3 font-mono text-xs">
                  <pre className="text-foreground/90 overflow-x-auto leading-relaxed">
                    <code>
                      <span className="text-purple-600 dark:text-purple-400">export default</span>{' '}
                      <span className="text-blue-600 dark:text-blue-400">defineRegistryItem</span>(
                      {`{
  name: `}
                      <span className="text-emerald-600 dark:text-emerald-400">'meeting-agenda-notes'</span>
                      {`,
  type: `}
                      <span className="text-emerald-600 dark:text-emerald-400">'registry:block'</span>
                      {`,
  categories: [`}
                      <span className="text-emerald-600 dark:text-emerald-400">'productivity'</span>
                      {`, `}
                      <span className="text-emerald-600 dark:text-emerald-400">'collaboration'</span>
                      {`],
  dependencies: [`}
                      <span className="text-emerald-600 dark:text-emerald-400">'lucide-react'</span>
                      {`],
  registryDependencies: [
    `}
                      <span className="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/avatar.json'</span>
                      {`,
    `}
                      <span className="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/badge.json'</span>
                      {`,
    `}
                      <span className="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/button.json'</span>
                      {`,
    `}
                      <span className="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/card.json'</span>
                      {`,
    `}
                      <span className="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/checkbox.json'</span>
                      {`,
    `}
                      <span className="text-amber-600 dark:text-amber-400">'https://uipkge.dev/r/separator.json'</span>
                      {`,
  ],
}`}
                      )
                    </code>
                  </pre>
                </div>
              </div>

              {/* Live Meeting Annotations & Comment Thread */}
              <div className="space-y-3 pt-2">
                <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Live Annotations</h4>

                <div className="space-y-2.5">
                  {liveNotes.map((note) => (
                    <div
                      key={note.id}
                      className="border-border/60 bg-muted/20 flex items-start gap-2.5 rounded-lg border p-3"
                    >
                      <Avatar size="sm" className="size-6 shrink-0 text-xs">
                        <AvatarFallback className={note.authorColor}>{note.authorInitials}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground text-xs font-semibold">{note.author}</span>
                            <Badge variant="outline" className="text-muted-foreground px-1 py-0 font-mono text-xs">
                              {note.tag}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground font-mono text-xs tabular-nums">{note.timestamp}</span>
                        </div>
                        <p className="text-foreground/90 text-xs leading-relaxed">{note.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Note Composer */}
                <div className="flex flex-col items-stretch gap-2 pt-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <input
                      value={newNoteDraft}
                      onChange={(e) => setNewNoteDraft(e.target.value)}
                      type="text"
                      placeholder="Append architecture note or observation..."
                      className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 h-8 w-full rounded-md border px-3 py-1 text-xs shadow-xs outline-none focus-visible:ring-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addNote()
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value)}
                      className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/40 h-8 rounded-md border px-2 text-xs shadow-xs outline-none focus-visible:ring-2"
                    >
                      <option value="#architecture">#architecture</option>
                      <option value="#pipeline">#pipeline</option>
                      <option value="#decision">#decision</option>
                      <option value="#action">#action</option>
                    </select>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 gap-1 text-xs shadow-xs"
                      disabled={!newNoteDraft.trim()}
                      onClick={addNote}
                    >
                      <Plus className="size-3.5" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Action Items, Decisions, & Meta (4-5 cols) */}
        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          {/* Action Items Checklist Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <UserCheck className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Action Items</CardTitle>
                    <CardDescription className="text-xs">Assigned deliverables & deadlines</CardDescription>
                  </div>
                </div>

                {/* Completion Counter Badge */}
                <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                  {completedTasksCount}/{totalTasksCount} Done ({completionPercentage}%)
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="bg-muted mt-3 h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-5 pt-2">
              {/* Checklist items */}
              <div className="space-y-2.5">
                {actionItems.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'group flex items-start gap-3 rounded-lg border p-3 transition-colors',
                      task.completed
                        ? 'border-border/40 bg-muted/20 opacity-75'
                        : 'border-border/80 bg-card hover:border-border hover:bg-muted/10',
                    )}
                  >
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={(checked) => toggleTask(task.id, Boolean(checked))}
                      />
                    </div>

                    {/* Task content */}
                    <div className="flex-1 space-y-1.5">
                      <label
                        htmlFor={task.id}
                        className={cn(
                          'block cursor-pointer text-xs leading-relaxed font-medium transition-colors select-none',
                          task.completed ? 'text-muted-foreground line-through' : 'text-foreground',
                        )}
                      >
                        {task.title}
                      </label>

                      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        {/* Assignee */}
                        <div className="flex items-center gap-1.5">
                          <Avatar size="xs" className="size-4 text-xs">
                            <AvatarFallback className={cn('text-xs', task.assigneeColor)}>
                              {task.assigneeInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-foreground/80 text-xs font-medium">{task.assignee}</span>
                        </div>

                        {/* Priority & Date */}
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              task.priority === 'Urgent' || task.priority === 'High'
                                ? 'destructive'
                                : task.priority === 'Medium'
                                  ? 'warning'
                                  : 'secondary'
                            }
                            className="h-4.5 px-1.5 text-xs font-semibold uppercase"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-muted-foreground font-mono text-xs tabular-nums">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add Action Item */}
              <div className="border-border/80 bg-muted/20 space-y-2 rounded-lg border border-dashed p-3">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  type="text"
                  placeholder="New action item description..."
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring h-7 w-full rounded border px-2.5 text-xs shadow-xs outline-none focus-visible:ring-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addTask()
                  }}
                />

                <div className="flex items-center justify-between gap-2">
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="border-input bg-background text-foreground h-7 rounded border px-2 text-xs shadow-xs outline-none"
                  >
                    {attendees.map((att) => (
                      <option key={att.id} value={att.name}>
                        {att.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'Urgent' | 'High' | 'Medium' | 'Low')}
                    className="border-input bg-background text-foreground h-7 rounded border px-2 text-xs shadow-xs outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <Button
                    size="xs"
                    variant="default"
                    className="h-7 gap-1 text-xs"
                    disabled={!newTaskTitle.trim()}
                    onClick={addTask}
                  >
                    <Plus className="size-3" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Decisions Log Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Key Decisions Log</CardTitle>
                    <CardDescription className="text-xs">Recorded architectural consensus</CardDescription>
                  </div>
                </div>

                <Badge variant="outline" className="text-muted-foreground font-mono text-xs tabular-nums">
                  {keyDecisions.length} Recorded
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 p-5 pt-2">
              {keyDecisions.map((decision) => (
                <div key={decision.id} className="border-border/80 bg-card space-y-2 rounded-lg border p-3.5 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground font-mono text-xs font-bold">D-0{decision.number}</span>
                      <Badge
                        variant={decision.status === 'Adopted' ? 'success' : 'warning'}
                        className="h-4.5 px-1.5 text-xs font-semibold uppercase"
                      >
                        {decision.status}
                      </Badge>
                    </div>

                    <span className="text-muted-foreground font-mono text-xs tabular-nums">{decision.time}</span>
                  </div>

                  <h4 className="text-foreground text-xs leading-snug font-semibold">{decision.title}</h4>

                  <p className="text-muted-foreground text-xs leading-relaxed">{decision.context}</p>

                  <div className="text-muted-foreground border-border/40 flex items-center gap-1 border-t pt-1 text-xs">
                    <span>Decided by:</span>
                    <span className="text-foreground font-medium">{decision.decidedBy}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Meeting Metadata & Shared Resources Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="px-5 pt-4 pb-2">
              <CardTitle className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Session Resources & Security
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 p-5 pt-1">
              <div className="space-y-2 text-xs">
                <div className="text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="text-foreground/70 size-3.5" />
                    Access Level
                  </span>
                  <span className="text-foreground font-medium">Internal (SSO Auth)</span>
                </div>

                <div className="text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="text-foreground/70 size-3.5" />
                    Next Sync
                  </span>
                  <span className="text-foreground font-mono font-medium tabular-nums">Aug 28 · 14:00 PST</span>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Linked Resources */}
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-xs font-semibold">Attached Artifacts</span>

                <div className="space-y-1">
                  <a
                    href="#artifacts"
                    className="text-foreground hover:bg-muted group flex items-center justify-between rounded-md p-1.5 text-xs transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="size-3.5 text-emerald-500" />
                      <span>OKLCH Token Audit Matrix.xlsx</span>
                    </span>
                    <ExternalLink className="text-muted-foreground group-hover:text-foreground size-3 transition-colors" />
                  </a>

                  <a
                    href="#artifacts"
                    className="text-foreground hover:bg-muted group flex items-center justify-between rounded-md p-1.5 text-xs transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GitPullRequest className="size-3.5 text-purple-500" />
                      <span>PR #412: Flat Dependency Resolution</span>
                    </span>
                    <ExternalLink className="text-muted-foreground group-hover:text-foreground size-3 transition-colors" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
