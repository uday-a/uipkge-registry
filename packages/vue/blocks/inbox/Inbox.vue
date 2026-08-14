<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  AtSign,
  Forward,
  Inbox as InboxIcon,
  MoreVertical,
  Paperclip,
  Pencil,
  Reply,
  ReplyAll,
  Search,
  Send,
  Smile,
  Star,
  Tag,
  Trash2,
  AlertOctagon,
  FileText,
  Bookmark,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type ReplyMode = 'reply' | 'reply-all' | 'forward'

type FolderId = 'inbox' | 'starred' | 'sent' | 'drafts' | 'spam' | 'trash'

interface Folder {
  id: FolderId
  label: string
  icon: any
}

interface LabelTag {
  id: string
  label: string
  color: string
}

interface Mail {
  id: string
  folder: FolderId
  from: { name: string; email: string; initials: string }
  to: string
  subject: string
  preview: string
  body: string
  receivedAt: Date
  read: boolean
  starred: boolean
  hasAttachment: boolean
  labels: string[]
}

const folders: Folder[] = [
  { id: 'inbox', label: 'Inbox', icon: InboxIcon },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'spam', label: 'Spam', icon: AlertOctagon },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

const labels: LabelTag[] = [
  { id: 'work', label: 'Work', color: 'bg-primary' },
  { id: 'personal', label: 'Personal', color: 'bg-success' },
  { id: 'finance', label: 'Finance', color: 'bg-info' },
  { id: 'travel', label: 'Travel', color: 'bg-warning' },
]

const now = new Date()
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

const mails = ref<Mail[]>([
  {
    id: 'e1',
    folder: 'inbox',
    from: { name: 'Sarah Connor', email: 'sarah@acme.com', initials: 'SC' },
    to: 'you@acme.com',
    subject: 'Q2 OKR draft — your sign-off needed',
    preview:
      'Pulled together the Q2 OKR draft from the leadership offsite. I have flagged the two areas where we need…',
    body: `Hi,\n\nPulled together the Q2 OKR draft from the leadership offsite. I have flagged the two areas where we need your call before we lock it:\n\n• Hiring plan: 4 vs 6 ENG roles (page 3)\n• EU rollout timing: April vs June (page 7)\n\nGoing to share with the rest of the leadership team Wednesday EOD, so anything from you by Tuesday is great.\n\nThanks,\nSarah`,
    receivedAt: new Date(now.getTime() - 18 * 60 * 1000),
    read: false,
    starred: true,
    hasAttachment: true,
    labels: ['work'],
  },
  {
    id: 'e2',
    folder: 'inbox',
    from: { name: 'Marcus Rivera', email: 'marcus@acme.com', initials: 'MR' },
    to: 'you@acme.com',
    subject: 'Re: Dashboard review tomorrow',
    preview:
      'Yes! Pushing to 10:30 so we can join from the standup. I will own the slides and pull the latest kanban metrics.',
    body: `Yes! Pushing to 10:30 so we can join from the standup. I will own the slides and pull the latest kanban metrics.\n\nFew things I want to cover:\n  - Throughput delta vs last sprint\n  - The two stories we de-scoped\n  - Q2 capacity ask\n\nSee you tomorrow,\nMarcus`,
    receivedAt: new Date(now.getTime() - 95 * 60 * 1000),
    read: false,
    starred: false,
    hasAttachment: false,
    labels: ['work'],
  },
  {
    id: 'e3',
    folder: 'inbox',
    from: { name: 'Stripe', email: 'receipts@stripe.com', initials: 'St' },
    to: 'you@acme.com',
    subject: 'Your invoice from Acme Inc. — $1,290.00',
    preview: 'Thanks for using Stripe. Your invoice for the period Mar 1 – Mar 31 is attached. Total due: $1,290.00…',
    body: 'Thanks for using Stripe. Your invoice for the period Mar 1 – Mar 31 is attached. Total due: $1,290.00.',
    receivedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: true,
    labels: ['finance'],
  },
  {
    id: 'e4',
    folder: 'inbox',
    from: { name: 'Linear', email: 'no-reply@linear.app', initials: 'Li' },
    to: 'you@acme.com',
    subject: 'Weekly summary: 14 issues closed, 22 opened',
    preview:
      'Good news — the team closed 14 issues this week, up 3 from last week. Top contributors: Marcus, Priya, Devon.',
    body: 'Good news — the team closed 14 issues this week, up 3 from last week. Top contributors: Marcus, Priya, Devon.',
    receivedAt: new Date(now.getTime() - 9 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: false,
    labels: ['work'],
  },
  {
    id: 'e5',
    folder: 'inbox',
    from: { name: 'Priya Shah', email: 'priya@acme.com', initials: 'PS' },
    to: 'you@acme.com',
    subject: 'Color tokens are live in staging',
    preview:
      'Pushed the new OKLCH token set to staging. All chart colors, success/warning/info, sidebar variants. Take a look…',
    body: 'Pushed the new OKLCH token set to staging. All chart colors, success/warning/info, sidebar variants. Take a look when you have a sec.',
    receivedAt: yesterday,
    read: true,
    starred: true,
    hasAttachment: false,
    labels: ['work'],
  },
  {
    id: 'e6',
    folder: 'inbox',
    from: { name: 'United Airlines', email: 'reservations@united.com', initials: 'UA' },
    to: 'you@acme.com',
    subject: 'Your itinerary: SFO → LHR, departing Apr 12',
    preview: 'Your reservation is confirmed. Check-in opens 24h before departure. Booking reference: 7HQ4P2.',
    body: 'Your reservation is confirmed. Check-in opens 24h before departure. Booking reference: 7HQ4P2.',
    receivedAt: new Date(now.getTime() - 38 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: true,
    labels: ['travel'],
  },
  {
    id: 'e7',
    folder: 'inbox',
    from: { name: 'Mom', email: 'mom@family.net', initials: 'M' },
    to: 'you@acme.com',
    subject: 'Sunday lunch?',
    preview: 'Are you free for lunch this Sunday? Dad is making his lasagne. Let me know!',
    body: 'Are you free for lunch this Sunday? Dad is making his lasagne. Let me know!',
    receivedAt: new Date(now.getTime() - 55 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: false,
    labels: ['personal'],
  },
])

const activeFolder = ref<FolderId>('inbox')
const activeLabel = ref<string | null>(null)
const activeId = ref<string>('e1')
const search = ref('')
const replyMode = ref<ReplyMode>('reply')
const replyDraft = ref('')
const justSent = ref(false)

function folderCount(id: FolderId): number {
  if (id === 'starred') return mails.value.filter((m) => m.starred && m.folder !== 'trash').length
  return mails.value.filter((m) => m.folder === id).length
}

function unreadCount(id: FolderId): number {
  if (id === 'starred') return mails.value.filter((m) => m.starred && !m.read && m.folder !== 'trash').length
  return mails.value.filter((m) => m.folder === id && !m.read).length
}

const labelCounts = computed(() =>
  labels.reduce<Record<string, number>>((acc, l) => {
    acc[l.id] = mails.value.filter((m) => m.labels.includes(l.id)).length
    return acc
  }, {}),
)

const visibleMails = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = mails.value.filter((m) => {
    if (activeLabel.value) return m.labels.includes(activeLabel.value)
    if (activeFolder.value === 'starred') return m.starred && m.folder !== 'trash'
    return m.folder === activeFolder.value
  })
  if (q) {
    list = list.filter(
      (m) =>
        m.subject.toLowerCase().includes(q) ||
        m.from.name.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q),
    )
  }
  return [...list].sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())
})

const activeMail = computed(() => mails.value.find((m) => m.id === activeId.value) ?? null)

function selectMail(id: string) {
  activeId.value = id
  const m = mails.value.find((m) => m.id === id)
  if (m) m.read = true
}

function selectFolder(id: FolderId) {
  activeFolder.value = id
  activeLabel.value = null
  const first = visibleMails.value[0]
  if (first) activeId.value = first.id
}

function selectLabel(id: string) {
  activeLabel.value = id
  const first = visibleMails.value[0]
  if (first) activeId.value = first.id
}

function toggleStar(id: string, e?: Event) {
  e?.stopPropagation()
  const m = mails.value.find((m) => m.id === id)
  if (m) m.starred = !m.starred
}

function archive(id: string) {
  mails.value = mails.value.filter((m) => m.id !== id)
  const next = visibleMails.value[0]
  if (next) activeId.value = next.id
}

function formatMailTime(d: Date): string {
  if (d >= todayStart) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays < 7) return d.toLocaleDateString(undefined, { weekday: 'short' })
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatFullTime(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function labelMeta(id: string): LabelTag | undefined {
  return labels.find((l) => l.id === id)
}

const replyRecipient = computed(() => {
  const m = activeMail.value
  if (!m) return ''
  if (replyMode.value === 'forward') return ''
  return m.from.name + ' <' + m.from.email + '>'
})

const replyPlaceholder = computed(() =>
  replyMode.value === 'forward' ? 'Add a note before forwarding' : 'Write a reply',
)

const sendDisabled = computed(() => !replyDraft.value.trim() || (replyMode.value === 'forward' && false))

function setReplyMode(mode: ReplyMode) {
  replyMode.value = mode
  justSent.value = false
}

function sendReply() {
  const body = replyDraft.value.trim()
  if (!body) return
  replyDraft.value = ''
  justSent.value = true
  window.setTimeout(() => {
    justSent.value = false
  }, 1800)
}

function onReplyKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    sendReply()
  }
}

watch(activeId, () => {
  replyDraft.value = ''
  replyMode.value = 'reply'
  justSent.value = false
  nextTick()
})
</script>

<template>
  <div
    data-slot="inbox"
    class="bg-card text-card-foreground grid h-[42.5rem] w-full grid-cols-[220px_340px_1fr] overflow-hidden rounded-xl border shadow-sm"
  >
    <aside class="bg-muted/30 flex min-w-0 flex-col border-r">
      <div class="flex h-14 shrink-0 items-center border-b px-3">
        <Button class="h-9 w-full justify-start gap-2 rounded-lg" size="sm">
          <Pencil class="size-4" />
          Compose
        </Button>
      </div>
      <nav class="flex-1 space-y-1 overflow-y-auto px-3 pt-3 pb-3">
        <p class="text-muted-foreground px-2 pb-1 text-xs font-semibold tracking-widest uppercase">Folders</p>
        <button
          v-for="f in folders"
          :key="f.id"
          :class="[
            'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
            activeFolder === f.id && !activeLabel
              ? 'bg-primary/10 text-primary font-medium'
              : 'hover:bg-muted/60 text-foreground/80',
          ]"
          @click="selectFolder(f.id)"
        >
          <span class="flex min-w-0 items-center gap-2">
            <component :is="f.icon" class="size-4 shrink-0" />
            <span class="truncate">{{ f.label }}</span>
          </span>
          <span v-if="unreadCount(f.id) > 0" class="text-muted-foreground shrink-0 text-xs tabular-nums">
            {{ unreadCount(f.id) }}
          </span>
        </button>

        <p class="text-muted-foreground mt-4 px-2 pb-1 text-xs font-semibold tracking-widest uppercase">Labels</p>
        <button
          v-for="l in labels"
          :key="l.id"
          :class="[
            'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
            activeLabel === l.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/60 text-foreground/80',
          ]"
          @click="selectLabel(l.id)"
        >
          <span class="flex min-w-0 items-center gap-2">
            <span :class="['size-2.5 shrink-0 rounded-full', l.color]" />
            <span class="truncate">{{ l.label }}</span>
          </span>
          <span class="text-muted-foreground shrink-0 text-xs tabular-nums">
            {{ labelCounts[l.id] ?? 0 }}
          </span>
        </button>
      </nav>
    </aside>

    <section class="bg-background flex min-w-0 flex-col border-r">
      <div class="flex h-14 shrink-0 items-center gap-2 border-b px-3">
        <div class="relative flex-1">
          <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input v-model="search" placeholder="Search mail" class="h-8 rounded-lg pl-8 text-xs" />
        </div>
        <Button variant="ghost" size="icon" class="size-8" aria-label="Filter">
          <Tag class="size-4" />
        </Button>
      </div>
      <div class="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 class="text-sm font-semibold tracking-tight capitalize">
          {{ activeLabel ? labelMeta(activeLabel)?.label : activeFolder }}
        </h2>
        <span class="text-muted-foreground text-xs tabular-nums">
          {{ visibleMails.length }} message{{ visibleMails.length === 1 ? '' : 's' }}
        </span>
      </div>
      <div class="list-scroll flex-1 overflow-y-auto pb-3">
        <button
          aria-label="Attach file"
          v-for="m in visibleMails"
          :key="m.id"
          :class="[
            'group relative w-full px-4 py-3 text-left transition-colors',
            m.id === activeId ? 'bg-primary/5' : 'hover:bg-muted/60',
          ]"
          @click="selectMail(m.id)"
        >
          <span v-if="m.id === activeId" class="bg-primary absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full" />
          <div class="flex items-start gap-3">
            <Avatar class="mt-0.5 size-8 shrink-0">
              <AvatarFallback class="text-xs">{{ m.from.initials }}</AvatarFallback>
            </Avatar>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <p :class="['truncate text-sm', m.read ? 'font-medium' : 'font-semibold']">
                  {{ m.from.name }}
                </p>
                <span class="text-muted-foreground shrink-0 text-xs tabular-nums">
                  {{ formatMailTime(m.receivedAt) }}
                </span>
              </div>
              <p :class="['mt-0.5 truncate text-xs', m.read ? 'text-foreground/80' : 'font-semibold']">
                {{ m.subject }}
              </p>
              <p class="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">
                {{ m.preview }}
              </p>
              <div class="mt-1.5 flex items-center gap-1.5">
                <span
                  v-for="lid in m.labels"
                  :key="lid"
                  class="text-muted-foreground bg-muted inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs"
                >
                  <span :class="['size-1.5 rounded-full', labelMeta(lid)?.color]" />
                  {{ labelMeta(lid)?.label }}
                </span>
                <Paperclip v-if="m.hasAttachment" class="text-muted-foreground size-3" />
                <span v-if="!m.read" class="bg-primary ml-auto size-1.5 shrink-0 rounded-full" />
              </div>
            </div>
            <span
              role="button"
              tabindex="0"
              class="text-muted-foreground hover:text-warning inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors"
              :title="m.starred ? 'Unstar' : 'Star'"
              @click="toggleStar(m.id, $event)"
              @keydown.enter.prevent="toggleStar(m.id, $event)"
              @keydown.space.prevent="toggleStar(m.id, $event)"
            >
              <Star :class="['size-3.5', m.starred ? 'fill-warning text-warning' : '']" />
            </span>
          </div>
        </button>

        <div v-if="visibleMails.length === 0" class="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div class="bg-muted mb-3 rounded-full p-3">
            <InboxIcon class="text-muted-foreground size-5" />
          </div>
          <p class="text-sm font-medium">Nothing here</p>
          <p class="text-muted-foreground mt-0.5 text-xs">No messages match the current filter.</p>
        </div>
      </div>
    </section>

    <section class="bg-background flex min-w-0 flex-col">
      <template v-if="activeMail">
        <div class="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="icon" class="size-8" aria-label="Back">
              <ArrowLeft class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="Archive" @click="archive(activeMail.id)">
              <Archive class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="Delete">
              <Trash2 class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="Save">
              <Bookmark class="size-4" />
            </Button>
          </div>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="icon" class="size-8" aria-label="Reply">
              <Reply class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="Reply all">
              <ReplyAll class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="Forward">
              <Forward class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="More options">
              <MoreVertical class="size-4" />
            </Button>
          </div>
        </div>

        <div class="reader-scroll flex-1 overflow-y-auto">
          <div class="px-6 pt-5 pb-3">
            <h1 class="text-foreground text-xl leading-tight font-semibold tracking-tight">
              {{ activeMail.subject }}
            </h1>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <span
                v-for="lid in activeMail.labels"
                :key="lid"
                class="text-foreground/70 bg-muted inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
              >
                <span :class="['size-1.5 rounded-full', labelMeta(lid)?.color]" />
                {{ labelMeta(lid)?.label }}
              </span>
            </div>
          </div>

          <div class="flex items-start gap-3 px-6 pb-4">
            <Avatar class="size-10">
              <AvatarFallback>{{ activeMail.from.initials }}</AvatarFallback>
            </Avatar>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline gap-x-2">
                <p class="text-sm font-semibold">{{ activeMail.from.name }}</p>
                <p class="text-muted-foreground text-xs">&lt;{{ activeMail.from.email }}&gt;</p>
              </div>
              <p class="text-muted-foreground text-xs">to {{ activeMail.to }}</p>
            </div>
            <div class="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
              <span>{{ formatFullTime(activeMail.receivedAt) }}</span>
              <button
                class="hover:text-warning transition-colors"
                :title="activeMail.starred ? 'Unstar' : 'Star'"
                @click="toggleStar(activeMail.id)"
              >
                <Star :class="['size-4', activeMail.starred ? 'fill-warning text-warning' : '']" />
              </button>
            </div>
          </div>

          <article class="text-foreground/90 px-6 pb-6 text-sm leading-relaxed whitespace-pre-wrap">
            {{ activeMail.body }}
          </article>

          <div v-if="activeMail.hasAttachment" class="px-6 pb-6">
            <div class="bg-muted/40 flex items-center gap-3 rounded-lg border px-3 py-2.5">
              <div class="bg-info/10 text-info flex size-8 items-center justify-center rounded-md">
                <FileText class="size-4" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-medium">attachment.pdf</p>
                <p class="text-muted-foreground text-xs">142 KB · PDF</p>
              </div>
              <Button aria-label="Download attachment" variant="ghost" size="sm" class="h-7 text-xs">Download</Button>
            </div>
          </div>
        </div>

        <div class="bg-muted/20 border-t px-4 pt-3 pb-3">
          <div class="mb-2 flex items-center gap-1">
            <button
              :class="[
                'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                replyMode === 'reply'
                  ? 'bg-background text-foreground border-input/60 border shadow-sm'
                  : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
              ]"
              @click="setReplyMode('reply')"
            >
              <Reply class="size-3.5" />
              Reply
            </button>
            <button
              :class="[
                'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                replyMode === 'reply-all'
                  ? 'bg-background text-foreground border-input/60 border shadow-sm'
                  : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
              ]"
              @click="setReplyMode('reply-all')"
            >
              <ReplyAll class="size-3.5" />
              Reply all
            </button>
            <button
              :class="[
                'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                replyMode === 'forward'
                  ? 'bg-background text-foreground border-input/60 border shadow-sm'
                  : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
              ]"
              @click="setReplyMode('forward')"
            >
              <Forward class="size-3.5" />
              Forward
            </button>
          </div>
          <div
            class="bg-background border-input/60 focus-within:border-primary/40 focus-within:ring-primary/10 group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-150 focus-within:shadow-md focus-within:ring-4"
          >
            <p v-if="replyRecipient" class="border-input/40 text-muted-foreground border-b px-4 pt-2.5 pb-2 text-xs">
              <span class="text-foreground/70 font-medium">To:</span> {{ replyRecipient }}
            </p>
            <Textarea
              v-model="replyDraft"
              :placeholder="replyPlaceholder"
              rows="1"
              class="placeholder:text-muted-foreground/70 max-h-40 min-h-[2.75rem] resize-none border-0 bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed shadow-none focus-visible:ring-0"
              @keydown="onReplyKey"
            />
            <div class="flex items-center justify-between gap-2 px-2 pb-2">
              <div class="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-foreground size-8"
                  aria-label="Attach file"
                >
                  <Paperclip class="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-foreground size-8"
                  aria-label="Emoji"
                >
                  <Smile class="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-foreground size-8"
                  aria-label="Mention"
                >
                  <AtSign class="size-4" />
                </Button>
              </div>
              <div class="flex items-center gap-2">
                <kbd
                  class="bg-muted text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-xs sm:inline-flex"
                >
                  <span>⌘</span><span>↵</span>
                </kbd>
                <Button
                  class="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                  :disabled="sendDisabled"
                  aria-label="Send"
                  @click="sendReply"
                >
                  Send
                  <ArrowRight class="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <p v-if="justSent" class="text-success mt-2 text-center text-xs font-medium">Reply sent</p>
        </div>
      </template>

      <div v-else class="flex flex-1 items-center justify-center">
        <div class="text-center">
          <div class="bg-muted mx-auto mb-3 size-12 rounded-full p-3">
            <InboxIcon class="text-muted-foreground size-6" />
          </div>
          <p class="text-sm font-medium">No message selected</p>
          <p class="text-muted-foreground mt-1 text-xs">Pick a message from the list to read it here.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.list-scroll::-webkit-scrollbar,
.reader-scroll::-webkit-scrollbar {
  width: 6px;
}
.list-scroll::-webkit-scrollbar-thumb,
.reader-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
</style>
