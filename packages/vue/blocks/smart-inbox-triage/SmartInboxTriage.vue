<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Archive,
  ArrowDown,
  ArrowUp,
  AtSign,
  Check,
  CheckCircle2,
  Clock,
  Command as CommandIcon,
  FileText,
  Forward,
  Mail,
  Paperclip,
  Reply,
  ReplyAll,
  Search,
  Send,
  Smile,
  Star,
  Undo2,
  X,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export type InboxCategory = 'vip' | 'team' | 'newsletters' | 'archived'

export interface EmailMessage {
  id: string
  sender: {
    name: string
    email: string
    initials: string
  }
  recipient: string
  subject: string
  snippet: string
  body: string
  timestamp: string
  fullDate: string
  category: 'vip' | 'team' | 'newsletters'
  categoryLabel: string
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'info' | 'success' | 'warning'
  unread: boolean
  starred: boolean
  archived: boolean
  snoozed?: boolean
  attachment?: {
    name: string
    size: string
    type: string
  }
}

interface Props {
  initialCategory?: InboxCategory
  initialSearch?: string
  initialSelectedId?: string
  messages?: EmailMessage[]
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialCategory: 'vip',
  initialSearch: '',
  initialSelectedId: 'msg-1',
})

const defaultMessages: EmailMessage[] = [
  {
    id: 'msg-1',
    sender: {
      name: 'Marcus Vance',
      email: 'marcus.vance@uipkge.internal',
      initials: 'MV',
    },
    recipient: 'you@uipkge.dev, core-eng@uipkge.dev',
    subject: 'Architecture Review: Real-time Sync & CRDT Conflict Resolution',
    snippet: 'I’ve updated the design doc with event-sourcing and CRDT tradeoffs for the multi-region sync engine...',
    body: `Hey team,

I’ve updated the architecture RFC for the multi-region state synchronization engine. Based on yesterday's benchmark results, we are proceeding with hybrid state-based CRDTs for deterministic document convergence.

Key RFC Highlights:
• P99 sync latency reduced from 140ms to 24ms across edge worker replicas
• Deterministic Last-Write-Wins (LWW) resolver for metadata mutations
• Offline reconciliation buffer with automated exponential retry backoff
• Zero dependency footprint — pure TypeScript state machines

Please review the attached technical specification and drop your comments before Thursday's design council.

Best,
Marcus Vance
Principal Systems Architect`,
    timestamp: '14:28',
    fullDate: 'Today at 14:28 PM',
    category: 'vip',
    categoryLabel: 'VIP Review',
    badgeVariant: 'default',
    unread: true,
    starred: true,
    archived: false,
    attachment: {
      name: 'sync-engine-rfc-v2.4.pdf',
      size: '2.4 MB',
      type: 'PDF',
    },
  },
  {
    id: 'msg-2',
    sender: {
      name: 'Sarah Connor',
      email: 'sarah.connor@uipkge.internal',
      initials: 'SC',
    },
    recipient: 'you@uipkge.dev, exec@uipkge.dev',
    subject: 'Q2 OKR Sign-off & Headcount Allocation',
    snippet: 'Final draft from the leadership offsite. Flagged two key decisions before Wednesday lock...',
    body: `Hi team,

I’ve compiled the finalized Q2 OKR draft following our executive offsite. There are two strategic items requiring your explicit sign-off before we lock the plan Wednesday EOD:

1. Engineering Headcount: 4 vs. 6 senior backend roles
2. Multi-cloud deployment schedule: Target June instead of August

Please review and confirm your alignment so we can present to the board.

Thanks,
Sarah Connor
VP of Engineering`,
    timestamp: '15:40',
    fullDate: 'Today at 15:40 PM',
    category: 'vip',
    categoryLabel: 'VIP Review',
    badgeVariant: 'default',
    unread: true,
    starred: false,
    archived: false,
  },
  {
    id: 'msg-3',
    sender: {
      name: 'Stripe Merchant Services',
      email: 'payouts@stripe.com',
      initials: 'ST',
    },
    recipient: 'billing@uipkge.dev',
    subject: 'Payout Confirmed: $18,420.50 USD',
    snippet:
      'Your daily payout for May 18 has been processed and initiated to your linked corporate checking account...',
    body: `Hello UIPKGE Team,

Your automatic daily payout has been initiated and is on its way to your designated bank account ending in •••• 8842.

Transfer Summary:
• Gross volume (last 24h): $19,250.00
• Stripe processing fees: -$829.50
• Net settled transfer: $18,420.50 USD
• Estimated arrival: Thursday, May 22, 2026

No further action is required. You can download your official tax statement and transaction logs directly in the Stripe Merchant Portal.`,
    timestamp: '12:15',
    fullDate: 'Today at 12:15 PM',
    category: 'vip',
    categoryLabel: 'Finance',
    badgeVariant: 'success',
    unread: true,
    starred: false,
    archived: false,
  },
  {
    id: 'msg-4',
    sender: {
      name: 'GitHub Notifications',
      email: 'notifications@github.com',
      initials: 'GH',
    },
    recipient: 'you@uipkge.dev',
    subject: '[PR #412] Merged: feat(tokens): OKLCH color scale & dynamic theme engine',
    snippet: 'Merged by @uday into main with 4 approvals and all CI checks passing in 42s...',
    body: `Pull Request #412 has been successfully merged into \`main\` by @uday.

Branch: feat/oklch-tokens → main
Approvals: 4 / 4 (Marcus Vance, Elena Rostova, Devon Patel, Sarah Connor)
CI Workflow: Build, Typecheck, and Parity Verification passed in 42s.

Key Deliverables:
• Implemented OKLCH lightness/chroma token scale with WCAG AAA contrast
• Tailwind v4 @theme inline integration with zero CSS variable bloat
• 100% test coverage across both Vue and React registry packages

Automated staging preview is now active at https://staging.uipkge.dev.`,
    timestamp: '10:45',
    fullDate: 'Today at 10:45 AM',
    category: 'team',
    categoryLabel: 'GitHub',
    badgeVariant: 'info',
    unread: false,
    starred: true,
    archived: false,
  },
  {
    id: 'msg-5',
    sender: {
      name: 'Elena Rostova',
      email: 'elena.rostova@uipkge.internal',
      initials: 'ER',
    },
    recipient: 'you@uipkge.dev, design-system@uipkge.dev',
    subject: 'Design Tokens OKLCH Migration Spec & Guidelines',
    snippet: 'Here is the finalized Figma token mapping and color ramp guide for the new high-contrast theme...',
    body: `Hi team,

Following up on PR #412, I’ve published the companion Figma variables library and developer handoff sheet.

What’s included in this release:
1. Semantic tokens: added \`--surface-elevated\` and \`--sidebar-accent\`
2. Focus ring contrast ratios audited across all 14 colorways
3. Mobile breakpoint typography scale verified with 12px min floor
4. Tactile micro-transitions mapped to \`--ease-spring\` (140ms duration)

Please review the design system documentation and let me know if any component needs tailored adjustments.

Warmly,
Elena Rostova
Lead Product Designer`,
    timestamp: '09:12',
    fullDate: 'Today at 09:12 AM',
    category: 'team',
    categoryLabel: 'Design',
    badgeVariant: 'secondary',
    unread: false,
    starred: false,
    archived: false,
  },
  {
    id: 'msg-6',
    sender: {
      name: 'Substack / The Unbundled Engineer',
      email: 'digest@unbundled.dev',
      initials: 'SE',
    },
    recipient: 'you@uipkge.dev',
    subject: 'The Unbundled Engineer: Issue #84 — The Rise of Component Registries',
    snippet:
      'Why copy-paste component architecture is replacing bloated npm packages across modern frontend engineering...',
    body: `Welcome to Issue #84 of The Unbundled Engineer.

This week: Why the component registry model is winning.

"When you install a traditional monolithic npm UI library, you inherit its dependency tree, its CSS opinions, and its release bottlenecks. When you copy registry source code into your own repository, you gain zero-dependency ownership, effortless code customization, and total UI autonomy."

In this edition:
• Benchmarking bundle sizes: Registry components vs. Monolithic packages
• Tactile micro-interactions and keyboard-first inbox triage UX
• The future of dual-framework design systems (Vue 3.5 & React 19)

Read the full deep-dive on our website.`,
    timestamp: 'Yesterday',
    fullDate: 'Yesterday at 17:30 PM',
    category: 'newsletters',
    categoryLabel: 'Newsletter',
    badgeVariant: 'warning',
    unread: false,
    starred: false,
    archived: false,
  },
]

const mails = ref<EmailMessage[]>(props.messages ? JSON.parse(JSON.stringify(props.messages)) : defaultMessages)
const activeCategory = ref<InboxCategory>(props.initialCategory)
const search = ref(props.initialSearch)
const activeId = ref<string>(props.initialSelectedId)
const replyMode = ref<'reply' | 'reply-all' | 'forward'>('reply')
const replyDraft = ref('')
const toastMessage = ref('')
const hasUndo = ref(false)
const lastArchivedId = ref<string | null>(null)
const commandPaletteOpen = ref(false)
const commandFilter = ref('')

const searchInputRef = ref<HTMLInputElement | null>(null)
const replyTextareaRef = ref<HTMLTextAreaElement | null>(null)

let toastTimer: number | undefined

function showToast(msg: string, allowUndo = false) {
  toastMessage.value = msg
  hasUndo.value = allowUndo
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastMessage.value = ''
    hasUndo.value = false
  }, 4000)
}

const vipCount = computed(() => mails.value.filter((m) => !m.archived && m.category === 'vip').length)
const teamCount = computed(() => mails.value.filter((m) => !m.archived && m.category === 'team').length)
const newslettersCount = computed(() => mails.value.filter((m) => !m.archived && m.category === 'newsletters').length)
const archivedCount = computed(() => mails.value.filter((m) => m.archived).length)
const remainingCount = computed(() => mails.value.filter((m) => !m.archived).length)

const categoriesList = computed<Array<{ id: InboxCategory; label: string; count: number }>>(() => [
  { id: 'vip', label: 'Important & VIP', count: vipCount.value },
  { id: 'team', label: 'Team & GitHub', count: teamCount.value },
  { id: 'newsletters', label: 'Newsletters', count: newslettersCount.value },
  { id: 'archived', label: 'Done / Archived', count: archivedCount.value },
])

const visibleMails = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = mails.value.filter((m) => {
    if (activeCategory.value === 'archived') {
      return m.archived
    }
    return !m.archived && m.category === activeCategory.value
  })

  if (q) {
    list = list.filter(
      (m) =>
        m.subject.toLowerCase().includes(q) ||
        m.sender.name.toLowerCase().includes(q) ||
        m.sender.email.toLowerCase().includes(q) ||
        m.snippet.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q),
    )
  }

  return list
})

const activeMail = computed(() => {
  if (!activeId.value) return visibleMails.value[0] ?? null
  return mails.value.find((m) => m.id === activeId.value) ?? visibleMails.value[0] ?? null
})

function selectMail(id: string) {
  activeId.value = id
  const target = mails.value.find((m) => m.id === id)
  if (target) {
    target.unread = false
  }
}

function selectCategory(cat: InboxCategory) {
  activeCategory.value = cat
  nextTick(() => {
    const first = visibleMails.value[0]
    if (first) {
      selectMail(first.id)
    } else {
      activeId.value = ''
    }
  })
}

function archiveMail(id?: string) {
  const targetId = id ?? activeMail.value?.id
  if (!targetId) return
  const item = mails.value.find((m) => m.id === targetId)
  if (!item) return

  item.archived = true
  item.snoozed = false
  lastArchivedId.value = targetId
  showToast(`Archived: "${item.subject}"`, true)

  nextTick(() => {
    const next = visibleMails.value[0]
    activeId.value = next ? next.id : ''
    if (next) next.unread = false
  })
}

function snoozeMail(id?: string) {
  const targetId = id ?? activeMail.value?.id
  if (!targetId) return
  const item = mails.value.find((m) => m.id === targetId)
  if (!item) return

  item.archived = true
  item.snoozed = true
  lastArchivedId.value = targetId
  showToast('Snoozed until tomorrow 08:00 AM', true)

  nextTick(() => {
    const next = visibleMails.value[0]
    activeId.value = next ? next.id : ''
    if (next) next.unread = false
  })
}

function undoLastAction() {
  if (!lastArchivedId.value) return
  const item = mails.value.find((m) => m.id === lastArchivedId.value)
  if (item) {
    item.archived = false
    item.snoozed = false
    activeCategory.value = item.category
    activeId.value = item.id
    showToast(`Restored: "${item.subject}"`)
  }
  lastArchivedId.value = null
  hasUndo.value = false
}

function toggleStar(id?: string, e?: Event) {
  e?.stopPropagation()
  const targetId = id ?? activeMail.value?.id
  if (!targetId) return
  const item = mails.value.find((m) => m.id === targetId)
  if (item) {
    item.starred = !item.starred
  }
}

function navigateNext() {
  if (visibleMails.value.length === 0) return
  const currentIndex = visibleMails.value.findIndex((m) => m.id === activeId.value)
  if (currentIndex === -1 || currentIndex >= visibleMails.value.length - 1) {
    selectMail(visibleMails.value[0].id)
  } else {
    selectMail(visibleMails.value[currentIndex + 1].id)
  }
}

function navigatePrev() {
  if (visibleMails.value.length === 0) return
  const currentIndex = visibleMails.value.findIndex((m) => m.id === activeId.value)
  if (currentIndex <= 0) {
    selectMail(visibleMails.value[visibleMails.value.length - 1].id)
  } else {
    selectMail(visibleMails.value[currentIndex - 1].id)
  }
}

function sendReply() {
  const content = replyDraft.value.trim()
  if (!content || !activeMail.value) return

  const senderName = activeMail.value.sender.name
  replyDraft.value = ''
  showToast(`Reply sent to ${senderName}`)
}

function markAllRead() {
  mails.value.forEach((m) => {
    if (activeCategory.value === 'archived' ? m.archived : !m.archived && m.category === activeCategory.value) {
      m.unread = false
    }
  })
  showToast('Marked all as read')
}

function archiveAllInCategory() {
  if (activeCategory.value === 'archived') return
  mails.value.forEach((m) => {
    if (!m.archived && m.category === activeCategory.value) {
      m.archived = true
    }
  })
  showToast('All messages in category archived')
  nextTick(() => {
    const next = visibleMails.value[0]
    activeId.value = next ? next.id : ''
  })
}

function handleGlobalKeydown(e: KeyboardEvent) {
  const activeEl = document.activeElement
  const isInputActive =
    activeEl instanceof HTMLInputElement ||
    activeEl instanceof HTMLTextAreaElement ||
    activeEl?.getAttribute('contenteditable') === 'true'

  // Cmd+K / Ctrl+K
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    commandPaletteOpen.value = !commandPaletteOpen.value
    return
  }

  // Cmd+Z / Ctrl+Z
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    undoLastAction()
    return
  }

  // Cmd+Enter inside reply
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    if (replyDraft.value.trim()) {
      e.preventDefault()
      sendReply()
      return
    }
  }

  // Escape
  if (e.key === 'Escape') {
    if (commandPaletteOpen.value) {
      e.preventDefault()
      commandPaletteOpen.value = false
      return
    }
    if (isInputActive) {
      ;(activeEl as HTMLElement).blur()
      return
    }
    if (search.value) {
      search.value = ''
      return
    }
  }

  // If focused on an input element, do not trigger single-key navigation
  if (isInputActive) return

  switch (e.key.toLowerCase()) {
    case 'j':
    case 'arrowdown':
      e.preventDefault()
      navigateNext()
      break
    case 'k':
    case 'arrowup':
      e.preventDefault()
      navigatePrev()
      break
    case 'e':
      e.preventDefault()
      archiveMail()
      break
    case 'h':
      e.preventDefault()
      snoozeMail()
      break
    case 'r':
      e.preventDefault()
      nextTick(() => {
        const el = replyTextareaRef.value
        if (el) {
          el.focus()
        }
      })
      break
    case 's':
      e.preventDefault()
      toggleStar()
      break
    case '/':
      e.preventDefault()
      nextTick(() => {
        const el = searchInputRef.value
        if (el) {
          el.focus()
          el.select()
        }
      })
      break
    case '1':
      e.preventDefault()
      selectCategory('vip')
      break
    case '2':
      e.preventDefault()
      selectCategory('team')
      break
    case '3':
      e.preventDefault()
      selectCategory('newsletters')
      break
    case '4':
      e.preventDefault()
      selectCategory('archived')
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  if (toastTimer) clearTimeout(toastTimer)
})

watch(
  () => props.initialCategory,
  (newVal) => {
    if (newVal) activeCategory.value = newVal
  },
)

watch(
  () => props.initialSearch,
  (newVal) => {
    if (typeof newVal === 'string') search.value = newVal
  },
)

watch(
  () => props.messages,
  (newVal) => {
    if (newVal) mails.value = JSON.parse(JSON.stringify(newVal))
  },
  { deep: true },
)

const commandPaletteItems = [
  { key: 'E', label: 'Archive active email', action: () => archiveMail() },
  { key: 'H', label: 'Snooze until tomorrow', action: () => snoozeMail() },
  {
    key: 'R',
    label: 'Reply to sender',
    action: () => {
      replyTextareaRef.value?.focus()
    },
  },
  { key: 'S', label: 'Toggle star / priority', action: () => toggleStar() },
  { key: '1', label: 'Switch to Important & VIP', action: () => selectCategory('vip') },
  { key: '2', label: 'Switch to Team & GitHub', action: () => selectCategory('team') },
  { key: '3', label: 'Switch to Newsletters', action: () => selectCategory('newsletters') },
  { key: '4', label: 'Switch to Done / Archived', action: () => selectCategory('archived') },
  { key: 'Shift+A', label: 'Mark all as read in current category', action: () => markAllRead() },
  { key: 'Shift+E', label: 'Archive all in category', action: () => archiveAllInCategory() },
]

const filteredCommandPaletteItems = computed(() => {
  const q = commandFilter.value.trim().toLowerCase()
  if (!q) return commandPaletteItems
  return commandPaletteItems.filter((i) => i.label.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
})

function executeCommand(action: () => void) {
  action()
  commandPaletteOpen.value = false
  commandFilter.value = ''
}
</script>

<template>
  <div
    data-slot="smart-inbox-triage"
    :class="
      cn(
        'bg-card text-card-foreground border-border relative flex flex-col overflow-hidden rounded-xl border shadow-xs',
        props.class,
      )
    "
  >
    <!-- TOP COMMAND BAR -->
    <header class="bg-card/95 border-border/80 border-b px-4 py-3 backdrop-blur-xs">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <!-- Left: Inbox Status & Goal Badge -->
        <div class="flex flex-wrap items-center gap-2.5">
          <div
            class="bg-primary/10 border-primary/20 text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight"
          >
            <span class="bg-primary size-2 animate-pulse rounded-full" />
            <span>Inbox Zero Goal</span>
            <span class="text-primary font-mono tabular-nums">
              {{ remainingCount === 0 ? 'Zero Achieved 🎉' : `${remainingCount} Messages Remaining` }}
            </span>
          </div>

          <div
            class="border-border/70 bg-muted/40 text-muted-foreground hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs xl:inline-flex"
          >
            <span>Shortcuts:</span>
            <kbd class="bg-card border-border/80 text-foreground rounded border px-1.5 py-0.5 font-mono text-xs">E</kbd>
            <span>Archive</span>
            <kbd class="bg-card border-border/80 text-foreground rounded border px-1.5 py-0.5 font-mono text-xs">H</kbd>
            <span>Snooze</span>
            <kbd class="bg-card border-border/80 text-foreground rounded border px-1.5 py-0.5 font-mono text-xs">R</kbd>
            <span>Reply</span>
            <kbd class="bg-card border-border/80 text-foreground rounded border px-1.5 py-0.5 font-mono text-xs"
              >J/K</kbd
            >
            <span>Navigate</span>
          </div>
        </div>

        <!-- Right: Search Bar & Command Key Trigger -->
        <div class="flex items-center gap-2">
          <div class="relative w-full sm:w-72">
            <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              ref="searchInputRef"
              v-model="search"
              type="text"
              placeholder="Search messages..."
              class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border pr-8 pl-8 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            />
            <kbd
              class="bg-muted text-muted-foreground border-border/70 absolute top-1/2 right-2 -translate-y-1/2 rounded border px-1 font-mono text-xs"
            >
              /
            </kbd>
          </div>

          <Button
            aria-label="Close command palette"
            variant="outline"
            size="sm"
            class="h-8 shrink-0 gap-1.5 px-2.5 text-xs font-medium"
            @click="commandPaletteOpen = true"
          >
            <CommandIcon class="size-3.5" />
            <span class="hidden sm:inline">Commands</span>
            <kbd class="bg-muted text-muted-foreground border-border/60 ml-0.5 rounded border px-1 font-mono text-xs">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>

      <!-- Split Category Tabs Bar -->
      <div class="border-border/40 mt-3 flex items-center justify-between border-t pt-2.5">
        <nav class="flex flex-wrap items-center gap-1.5" aria-label="Inbox Categories">
          <button
            v-for="cat in categoriesList"
            :key="cat.id"
            :class="[
              'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
            ]"
            @click="selectCategory(cat.id)"
          >
            <span>{{ cat.label }}</span>
            <span
              :class="[
                'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-xs font-semibold tabular-nums',
                activeCategory === cat.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-foreground',
              ]"
            >
              {{ cat.count }}
            </span>
          </button>
        </nav>

        <div class="hidden items-center gap-1 sm:flex">
          <Button
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
            @click="markAllRead"
          >
            <Check class="mr-1 size-3" />
            Mark read
          </Button>
        </div>
      </div>
    </header>

    <!-- 2-COLUMN SPLIT PANE -->
    <div class="grid h-[620px] grid-cols-1 md:grid-cols-[384px_1fr]">
      <!-- LEFT: EMAIL LIST (w-96) -->
      <aside class="bg-card border-border flex min-w-0 flex-col border-r">
        <!-- List Header -->
        <div class="bg-muted/20 border-border/80 flex h-11 shrink-0 items-center justify-between border-b px-3.5">
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground text-xs font-semibold tracking-tight uppercase">
              {{ categoriesList.find((c) => c.id === activeCategory)?.label }}
            </span>
            <Badge variant="outline" class="h-4 px-1.5 font-mono text-xs tabular-nums">
              {{ visibleMails.length }}
            </Badge>
          </div>
          <span class="text-muted-foreground/80 font-mono text-xs"> [J/K] navigate </span>
        </div>

        <!-- Scrollable Messages Feed -->
        <div class="list-scroll divide-border/40 flex-1 divide-y overflow-y-auto">
          <div
            v-for="mail in visibleMails"
            :key="mail.id"
            :class="[
              'group relative flex cursor-pointer flex-col gap-1 px-4 py-3 text-left transition-colors duration-150',
              mail.id === activeMail?.id ? 'bg-accent/70 text-accent-foreground' : 'hover:bg-muted/40 text-foreground',
            ]"
            @click="selectMail(mail.id)"
          >
            <!-- Active indicator left bar -->
            <span
              v-if="mail.id === activeMail?.id"
              class="bg-primary absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full"
            />

            <!-- Row 1: Sender avatar, name, time, star -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2.5">
                <Avatar class="size-6 shrink-0 text-xs">
                  <AvatarFallback class="bg-muted text-xs font-semibold">
                    {{ mail.sender.initials }}
                  </AvatarFallback>
                </Avatar>
                <p
                  :class="[
                    'truncate text-xs',
                    mail.unread ? 'text-foreground font-semibold' : 'text-foreground/80 font-medium',
                  ]"
                >
                  {{ mail.sender.name }}
                </p>
              </div>

              <div class="flex shrink-0 items-center gap-1.5">
                <span class="text-muted-foreground font-mono text-xs tabular-nums">
                  {{ mail.timestamp }}
                </span>
                <button
                  type="button"
                  :class="[
                    'hover:text-warning inline-flex size-6 items-center justify-center rounded transition-colors',
                    mail.starred ? 'text-warning' : 'text-muted-foreground/40 hover:text-muted-foreground',
                  ]"
                  :title="mail.starred ? 'Unstar message' : 'Star message'"
                  @click="toggleStar(mail.id, $event)"
                >
                  <Star :class="['size-3.5', mail.starred ? 'fill-warning' : '']" />
                </button>
              </div>
            </div>

            <!-- Row 2: Subject line with unread bullet -->
            <div class="mt-0.5 flex items-center gap-1.5">
              <span v-if="mail.unread" class="bg-primary size-1.5 shrink-0 rounded-full" />
              <p
                :class="[
                  'truncate text-xs tracking-tight',
                  mail.unread ? 'text-foreground font-semibold' : 'text-foreground/90 font-medium',
                ]"
              >
                {{ mail.subject }}
              </p>
            </div>

            <!-- Row 3: 1-line snippet -->
            <p class="text-muted-foreground line-clamp-1 text-xs leading-relaxed">
              {{ mail.snippet }}
            </p>

            <!-- Row 4: Category badge and attachment -->
            <div class="mt-1 flex items-center justify-between gap-2">
              <Badge :variant="mail.badgeVariant ?? 'secondary'" class="h-4.5 px-1.5 text-xs font-medium">
                {{ mail.categoryLabel }}
              </Badge>

              <div v-if="mail.attachment" class="text-muted-foreground flex items-center gap-1 text-xs">
                <Paperclip class="size-3" />
                <span>{{ mail.attachment.type }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="visibleMails.length === 0"
            class="flex flex-col items-center justify-center px-6 py-20 text-center"
          >
            <div class="bg-muted/80 text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-full">
              <CheckCircle2 class="text-primary size-6" />
            </div>
            <p class="text-foreground text-sm font-semibold">Inbox Zero Achieved</p>
            <p class="text-muted-foreground mt-1 max-w-[220px] text-xs">
              No emails in {{ categoriesList.find((c) => c.id === activeCategory)?.label }}. You are completely caught
              up!
            </p>
            <Button
              v-if="activeCategory !== 'archived'"
              variant="outline"
              size="sm"
              class="mt-4 h-7 text-xs"
              @click="selectCategory('archived')"
            >
              View Archived
            </Button>
          </div>
        </div>
      </aside>

      <!-- RIGHT: SELECTED EMAIL READER & QUICK ACTION -->
      <main class="bg-background flex min-w-0 flex-col overflow-hidden">
        <template v-if="activeMail">
          <!-- Top Action Bar -->
          <div
            class="bg-card/80 border-border flex h-11 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b px-4 backdrop-blur-xs"
          >
            <div class="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                class="h-7 gap-1 px-2.5 text-xs font-medium shadow-xs"
                @click="archiveMail(activeMail.id)"
              >
                <Archive class="size-3.5" />
                <span>Archive</span>
                <kbd
                  class="bg-muted text-muted-foreground border-border/80 ml-0.5 rounded border px-1 font-mono text-xs"
                  >E</kbd
                >
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="h-7 gap-1 px-2.5 text-xs font-medium shadow-xs"
                @click="snoozeMail(activeMail.id)"
              >
                <Clock class="size-3.5" />
                <span>Snooze</span>
                <kbd
                  class="bg-muted text-muted-foreground border-border/80 ml-0.5 rounded border px-1 font-mono text-xs"
                  >H</kbd
                >
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="h-7 gap-1 px-2.5 text-xs font-medium shadow-xs"
                @click="replyTextareaRef?.focus()"
              >
                <Reply class="size-3.5" />
                <span>Reply</span>
                <kbd
                  class="bg-muted text-muted-foreground border-border/80 ml-0.5 rounded border px-1 font-mono text-xs"
                  >R</kbd
                >
              </Button>

              <Button
                variant="ghost"
                size="icon"
                class="size-7"
                :title="activeMail.starred ? 'Unstar' : 'Star'"
                @click="toggleStar(activeMail.id)"
                aria-label="Action"
              >
                <Star :class="['size-4', activeMail.starred ? 'fill-warning text-warning' : 'text-muted-foreground']" />
              </Button>
            </div>

            <!-- Reader Navigation buttons -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                class="text-muted-foreground size-7"
                title="Previous (K)"
                @click="navigatePrev"
                aria-label="Action"
              >
                <ArrowUp class="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="text-muted-foreground size-7"
                title="Next (J)"
                @click="navigateNext"
                aria-label="Action"
              >
                <ArrowDown class="size-3.5" />
              </Button>
            </div>
          </div>

          <!-- Toast Feedback Notification Banner -->
          <div
            v-if="toastMessage"
            class="bg-primary text-primary-foreground flex items-center justify-between px-4 py-2 text-xs font-medium shadow-xs transition-all"
          >
            <div class="flex items-center gap-2">
              <Check class="size-3.5" />
              <span>{{ toastMessage }}</span>
            </div>
            <button
              v-if="hasUndo"
              class="bg-primary-foreground/20 hover:bg-primary-foreground/30 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold transition-colors"
              @click="undoLastAction"
            >
              <Undo2 class="size-3" />
              <span>Undo (⌘Z)</span>
            </button>
          </div>

          <!-- Reader Scroll Area -->
          <div class="reader-scroll flex-1 overflow-y-auto px-6 py-5">
            <!-- Subject Title -->
            <div class="flex items-start justify-between gap-4">
              <h1 class="text-foreground text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                {{ activeMail.subject }}
              </h1>
              <Badge :variant="activeMail.badgeVariant ?? 'default'" class="shrink-0 text-xs">
                {{ activeMail.categoryLabel }}
              </Badge>
            </div>

            <!-- Sender & Recipient Information Card -->
            <div class="border-border/80 bg-muted/20 mt-4 flex items-start gap-3 rounded-lg border p-3.5">
              <Avatar class="size-9 shrink-0">
                <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">
                  {{ activeMail.sender.initials }}
                </AvatarFallback>
              </Avatar>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-x-2">
                  <p class="text-foreground min-w-0 truncate text-sm font-semibold">
                    {{ activeMail.sender.name }}
                    <span class="text-muted-foreground text-xs font-normal">&lt;{{ activeMail.sender.email }}&gt;</span>
                  </p>
                  <span class="text-muted-foreground font-mono text-xs tabular-nums">
                    {{ activeMail.fullDate }}
                  </span>
                </div>
                <p class="text-muted-foreground mt-0.5 text-xs">
                  to <span class="text-foreground/80 font-medium">{{ activeMail.recipient }}</span>
                </p>
              </div>
            </div>

            <Separator class="my-5" />

            <!-- Email Body Content -->
            <article class="text-foreground/90 space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
              {{ activeMail.body }}
            </article>

            <!-- Attachment Tile -->
            <div v-if="activeMail.attachment" class="mt-6">
              <p class="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Attachment</p>
              <div
                class="border-border/80 bg-card hover:bg-muted/30 flex max-w-sm items-center justify-between gap-3 rounded-lg border p-3 shadow-xs"
              >
                <div class="flex items-center gap-3">
                  <div class="bg-info/10 text-info flex size-9 items-center justify-center rounded-md">
                    <FileText class="size-4" />
                  </div>
                  <div>
                    <p class="text-foreground text-xs font-semibold">{{ activeMail.attachment.name }}</p>
                    <p class="text-muted-foreground font-mono text-xs">
                      {{ activeMail.attachment.size }} · {{ activeMail.attachment.type }}
                    </p>
                  </div>
                </div>
                <Button aria-label="Download attachment" variant="outline" size="sm" class="h-7 px-2 text-xs"
                  >Download</Button
                >
              </div>
            </div>
          </div>

          <!-- Quick Reply Composer -->
          <div class="border-border bg-card border-t p-3.5">
            <div class="mb-2 flex items-center justify-between">
              <!-- Mode pills -->
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  :class="[
                    'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    replyMode === 'reply'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted',
                  ]"
                  @click="replyMode = 'reply'"
                >
                  <Reply class="size-3" />
                  Reply
                </button>
                <button
                  type="button"
                  :class="[
                    'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    replyMode === 'reply-all'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted',
                  ]"
                  @click="replyMode = 'reply-all'"
                >
                  <ReplyAll class="size-3" />
                  Reply all
                </button>
                <button
                  type="button"
                  :class="[
                    'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    replyMode === 'forward'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted',
                  ]"
                  @click="replyMode = 'forward'"
                >
                  <Forward class="size-3" />
                  Forward
                </button>
              </div>

              <span class="text-muted-foreground hidden min-w-0 truncate font-mono text-xs lg:inline">
                To: {{ activeMail.sender.email }}
              </span>
            </div>

            <!-- Composer Input Box -->
            <div
              class="border-input bg-background focus-within:border-ring focus-within:ring-ring/50 relative flex flex-col rounded-lg border shadow-xs focus-within:ring-2"
            >
              <textarea
                ref="replyTextareaRef"
                v-model="replyDraft"
                rows="2"
                :placeholder="`Write a reply to ${activeMail.sender.name}... (⌘↵ to send)`"
                class="placeholder:text-muted-foreground w-full resize-none bg-transparent px-3 py-2 text-xs leading-relaxed outline-none"
              />

              <div class="border-border/40 flex items-center justify-between border-t px-2 py-1.5">
                <div class="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-muted-foreground hover:text-foreground size-7"
                    aria-label="Attach file"
                  >
                    <Paperclip class="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-muted-foreground hover:text-foreground size-7"
                    aria-label="Add emoji"
                  >
                    <Smile class="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-muted-foreground hover:text-foreground size-7"
                    aria-label="Mention someone"
                  >
                    <AtSign class="size-3.5" />
                  </Button>
                </div>

                <div class="flex items-center gap-2">
                  <kbd
                    class="bg-muted text-muted-foreground border-border/70 hidden rounded border px-1.5 py-0.5 font-mono text-xs sm:inline-flex"
                  >
                    ⌘↵
                  </kbd>
                  <Button
                    size="sm"
                    class="h-7 gap-1 px-3 text-xs font-semibold shadow-xs"
                    :disabled="!replyDraft.trim()"
                    @click="sendReply"
                  >
                    <span>Send</span>
                    <Send class="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- No Email Selected Placeholder -->
        <div v-else class="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div class="bg-muted/60 text-muted-foreground mb-3 flex size-14 items-center justify-center rounded-full">
            <Mail class="size-7" />
          </div>
          <p class="text-foreground text-sm font-semibold">No message selected</p>
          <p class="text-muted-foreground mt-1 max-w-sm text-xs">
            Select an email from the list or use J/K to navigate through your triage queue.
          </p>
        </div>
      </main>
    </div>

    <!-- COMMAND PALETTE MODAL (⌘K) -->
    <div
      v-if="commandPaletteOpen"
      class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      @click.self="commandPaletteOpen = false"
    >
      <div
        class="bg-card text-card-foreground border-border animate-in fade-in-0 zoom-in-95 w-full max-w-lg overflow-hidden rounded-xl border shadow-xl"
      >
        <div class="border-border flex items-center border-b px-3 py-2.5">
          <CommandIcon class="text-muted-foreground mr-2 size-4" />
          <input
            v-model="commandFilter"
            type="text"
            placeholder="Type a command or shortcut..."
            class="placeholder:text-muted-foreground w-full bg-transparent text-xs outline-none"
            autofocus
          />
          <button
            aria-label="Close command palette"
            class="text-muted-foreground hover:text-foreground ml-2 rounded p-1"
            @click="commandPaletteOpen = false"
          >
            <X class="size-4" />
          </button>
        </div>

        <div class="max-h-72 overflow-y-auto p-2">
          <p class="text-muted-foreground px-2 py-1 text-xs font-semibold tracking-wider uppercase">
            High Velocity Actions
          </p>
          <button
            v-for="item in filteredCommandPaletteItems"
            :key="item.key"
            class="hover:bg-muted/70 flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors"
            @click="executeCommand(item.action)"
          >
            <span>{{ item.label }}</span>
            <kbd class="bg-muted text-muted-foreground border-border/80 rounded border px-1.5 py-0.5 font-mono text-xs">
              {{ item.key }}
            </kbd>
          </button>
        </div>

        <div
          class="bg-muted/40 border-border text-muted-foreground flex items-center justify-between border-t px-3 py-2 text-xs"
        >
          <span>Use <strong>Esc</strong> to close</span>
          <span>Superhuman Mode Active</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-scroll::-webkit-scrollbar,
.reader-scroll::-webkit-scrollbar {
  width: 5px;
}
.list-scroll::-webkit-scrollbar-thumb,
.reader-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}
</style>
