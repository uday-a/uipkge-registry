<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  MessageSquarePlus,
  MoreHorizontal,
  Paperclip,
  PanelLeft,
  PanelLeftClose,
  Pencil,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
  Code,
  Lightbulb,
  PenLine,
  BookOpen,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Role = 'user' | 'assistant'
type Feedback = 'up' | 'down'

interface Turn {
  id: string
  role: Role
  body: string
  code?: { lang: string; content: string }
  createdAt: Date
}

interface Thread {
  id: string
  title: string
  updatedAt: Date
  turns: Turn[]
}

const props = defineProps<{
  onSend?: (body: string) => void
  onRegenerate?: (id: string) => void
  onStop?: () => void
}>()

const now = new Date()
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
const sevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

const PLACEHOLDER_REPLY =
  'Here is a placeholder response. Wire `onSend` to your streaming endpoint and push assistant tokens onto the last turn as they arrive.'

const suggestions = [
  { icon: Code, label: 'Explain this code', body: 'Walk me through what `useRegistry()` does line by line.' },
  {
    icon: PenLine,
    label: 'Draft a release note',
    body: 'Write a release note for shipping the new inbox + chat blocks.',
  },
  {
    icon: Lightbulb,
    label: 'Brainstorm',
    body: 'Give me five ideas for verticals to build on top of the uipkge registry.',
  },
  {
    icon: BookOpen,
    label: 'Summarise',
    body: 'Summarise the CLAUDE.md "Primitive vs Block" boundary in three bullets.',
  },
]

const models = [
  { id: 'opus-4-7', label: 'Opus 4.7', hint: 'Most capable' },
  { id: 'sonnet-4-6', label: 'Sonnet 4.6', hint: 'Balanced' },
  { id: 'haiku-4-5', label: 'Haiku 4.5', hint: 'Fastest' },
]

const threads = ref<Thread[]>([
  {
    id: 't1',
    title: 'Designing the registry block boundary',
    updatedAt: new Date(now.getTime() - 12 * 60 * 1000),
    turns: [
      {
        id: 'u1',
        role: 'user',
        body: 'When should I extract a repeating tile pattern across blocks into a primitive?',
        createdAt: new Date(now.getTime() - 22 * 60 * 1000),
      },
      {
        id: 'a1',
        role: 'assistant',
        body: 'Short answer: almost never until you have 5+ distinct blocks calling for the *exact same* shape, and the extraction is slot-only with no layout opinion.\n\nThe trap is that StatCard-style primitives — ones that bake an "icon top-right, value below title, trend pill bottom-right" layout — look reusable but lock every block that consumes them. The user installing the block can\'t swap one tile into a chart-led tile without un-abstracting the primitive first.\n\nThe heuristic the CLAUDE.md spells out:',
        createdAt: new Date(now.getTime() - 21 * 60 * 1000),
      },
      {
        id: 'a1b',
        role: 'assistant',
        body: 'Here is the minimal check you can run on any candidate primitive:',
        code: {
          lang: 'ts',
          content:
            '// If the prop changes BEHAVIOR -> primitive (variant, disabled, multiple)\n// If the prop changes LAYOUT or WHICH FIELDS RENDER -> block territory\n//\n// Red flag: a primitive that accepts an `items` array of structured records\n// and renders them with a fixed shape. That is layout opinion in a prop.\ninterface KpiItem { title: string; value: string; icon: any; trend: number }\n//                ^ if you see this on a `registry:ui` item, stop.',
        },
        createdAt: new Date(now.getTime() - 20 * 60 * 1000),
      },
      {
        id: 'u2',
        role: 'user',
        body: 'And if the same 3 tiles repeat inside one block file?',
        createdAt: new Date(now.getTime() - 14 * 60 * 1000),
      },
      {
        id: 'a2',
        role: 'assistant',
        body: 'Leave them inline. The registry rule is "three similar lines is better than a premature abstraction." Blocks are supposed to read top-to-bottom at the call site — that is the whole reason a user installs a block instead of a primitive. The cost of writing the tile out three times is small; the cost of pre-abstracting and getting the shape slightly wrong is high (every consumer downstream pays for it).',
        createdAt: new Date(now.getTime() - 13 * 60 * 1000),
      },
    ],
  },
  {
    id: 't2',
    title: 'Tailwind v4 OKLCH dark mode tokens',
    updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    turns: [],
  },
  {
    id: 't3',
    title: 'Zero-downtime migration plan',
    updatedAt: yesterday,
    turns: [],
  },
  {
    id: 't4',
    title: 'Composing kanban + calendar in one view',
    updatedAt: new Date(now.getTime() - 30 * 60 * 60 * 1000),
    turns: [],
  },
  {
    id: 't5',
    title: 'shadcn-vue resolver circular warning',
    updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    turns: [],
  },
  {
    id: 't6',
    title: 'Cloudflare Pages preview env wiring',
    updatedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    turns: [],
  },
])

const activeId = ref('t1')
const draft = ref('')
const sidebarOpen = ref(true)
const sidebarSearch = ref('')
const activeModel = ref(models[0])
const isStreaming = ref(false)
const copiedId = ref<string | null>(null)
const feedback = ref<Record<string, Feedback>>({})
const attachment = ref<{ name: string } | null>(null)
const renamingId = ref<string | null>(null)
const renameDraft = ref('')
const scrollRoot = ref<HTMLElement | null>(null)
const composer = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
let streamTimer: ReturnType<typeof setTimeout> | null = null
let copyTimer: ReturnType<typeof setTimeout> | null = null

const activeThread = computed(() => threads.value.find((t) => t.id === activeId.value) ?? threads.value[0])
const turns = computed(() => activeThread.value?.turns ?? [])
const isEmpty = computed(() => turns.value.length === 0)

const filteredThreads = computed(() => {
  const q = sidebarSearch.value.trim().toLowerCase()
  return q ? threads.value.filter((t) => t.title.toLowerCase().includes(q)) : threads.value
})

const groupedThreads = computed(() => {
  const today: Thread[] = []
  const ydy: Thread[] = []
  const week: Thread[] = []
  const earlier: Thread[] = []
  for (const t of [...filteredThreads.value].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())) {
    if (t.updatedAt >= todayStart) today.push(t)
    else if (t.updatedAt.toDateString() === yesterday.toDateString()) ydy.push(t)
    else if (t.updatedAt >= sevenDays) week.push(t)
    else earlier.push(t)
  }
  return [
    { key: 'Today', items: today },
    { key: 'Yesterday', items: ydy },
    { key: 'Previous 7 days', items: week },
    { key: 'Earlier', items: earlier },
  ].filter((g) => g.items.length > 0)
})

function scrollToBottom() {
  const el = scrollRoot.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function autosizeComposer() {
  const el = composer.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 192)}px`
}

function selectThread(id: string) {
  activeId.value = id
  renamingId.value = null
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    sidebarOpen.value = false
  }
  nextTick(scrollToBottom)
}

function newChat() {
  const t: Thread = {
    id: `t${Date.now()}`,
    title: 'New chat',
    updatedAt: new Date(),
    turns: [],
  }
  threads.value.unshift(t)
  activeId.value = t.id
  draft.value = ''
  attachment.value = null
  nextTick(() => {
    autosizeComposer()
    composer.value?.focus()
  })
}

function titleFromBody(body: string) {
  return body.slice(0, 48) + (body.length > 48 ? '…' : '')
}

function startStream(threadId: string) {
  isStreaming.value = true
  if (streamTimer) clearTimeout(streamTimer)
  streamTimer = setTimeout(() => {
    const thread = threads.value.find((t) => t.id === threadId)
    thread?.turns.push({
      id: `a${Date.now()}`,
      role: 'assistant',
      body: PLACEHOLDER_REPLY,
      createdAt: new Date(),
    })
    isStreaming.value = false
    streamTimer = null
    if (activeId.value === threadId) nextTick(scrollToBottom)
  }, 1400)
}

function send(prefill?: string) {
  const body = (prefill ?? draft.value).trim()
  if ((!body && !attachment.value) || isStreaming.value || !activeThread.value) return
  const content = attachment.value ? `${body}${body ? '\n\n' : ''}Attached: ${attachment.value.name}` : body
  activeThread.value.turns.push({
    id: `u${Date.now()}`,
    role: 'user',
    body: content,
    createdAt: new Date(),
  })
  activeThread.value.updatedAt = new Date()
  if (activeThread.value.title === 'New chat') {
    activeThread.value.title = titleFromBody(content)
  }
  draft.value = ''
  attachment.value = null
  const threadId = activeThread.value.id
  props.onSend?.(content)
  nextTick(() => {
    autosizeComposer()
    scrollToBottom()
  })
  startStream(threadId)
}

function stop() {
  if (streamTimer) {
    clearTimeout(streamTimer)
    streamTimer = null
  }
  isStreaming.value = false
  props.onStop?.()
}

function regenerate(id: string) {
  if (isStreaming.value || !activeThread.value) return
  const idx = activeThread.value.turns.findIndex((t) => t.id === id)
  if (idx < 0) return
  const threadId = activeThread.value.id
  activeThread.value.turns = activeThread.value.turns.slice(0, idx)
  props.onRegenerate?.(id)
  nextTick(scrollToBottom)
  startStream(threadId)
}

function copyTurn(id: string, body: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(body).catch(() => {})
  }
  copiedId.value = id
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    if (copiedId.value === id) copiedId.value = null
  }, 1500)
}

function copyConversation() {
  const text = turns.value.map((t) => `${t.role === 'user' ? 'You' : 'Assistant'}: ${t.body}`).join('\n\n')
  copyTurn('conversation', text)
}

function clearThread() {
  if (!activeThread.value) return
  stop()
  activeThread.value.turns = []
  activeThread.value.title = 'New chat'
}

function deleteThread(id: string) {
  const remaining = threads.value.filter((t) => t.id !== id)
  if (remaining.length === 0) {
    const t: Thread = {
      id: `t${Date.now()}`,
      title: 'New chat',
      updatedAt: new Date(),
      turns: [],
    }
    threads.value = [t]
    activeId.value = t.id
    return
  }
  threads.value = remaining
  if (activeId.value === id) {
    activeId.value = remaining[0].id
  }
}

function startRename(t: Thread) {
  renamingId.value = t.id
  renameDraft.value = t.title
  nextTick(() => {
    const el = document.querySelector<HTMLInputElement>('[data-thread-rename]')
    el?.focus()
    el?.select()
  })
}

function commitRename() {
  const id = renamingId.value
  if (!id) return
  const t = threads.value.find((thread) => thread.id === id)
  const next = renameDraft.value.trim()
  if (t && next) t.title = next
  renamingId.value = null
}

function toggleFeedback(id: string, value: Feedback) {
  const next = { ...feedback.value }
  if (next[id] === value) delete next[id]
  else next[id] = value
  feedback.value = next
}

function onComposerKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function onAttach(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) attachment.value = { name: file.name }
  if (fileInput.value) fileInput.value.value = ''
}

function formatTime(d: Date): string {
  if (d >= todayStart) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

watch(activeId, () => nextTick(scrollToBottom))
watch(draft, () => nextTick(autosizeComposer))

onMounted(() => {
  if (window.innerWidth < 768) sidebarOpen.value = false
  nextTick(scrollToBottom)
})

onBeforeUnmount(() => {
  if (streamTimer) clearTimeout(streamTimer)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div
    data-slot="ai-llm-chat"
    class="bg-background text-foreground grid h-[680px] w-full overflow-hidden rounded-xl border shadow-sm"
    :style="{ gridTemplateColumns: sidebarOpen ? '16.25rem 1fr' : '0fr 1fr' }"
  >
    <aside class="bg-muted/30 flex min-h-0 min-w-0 flex-col overflow-hidden border-r">
      <div class="flex h-14 shrink-0 items-center gap-2 border-b px-3">
        <Button class="h-9 flex-1 justify-start gap-2 rounded-lg" variant="outline" @click="newChat">
          <MessageSquarePlus class="size-4" />
          New chat
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="size-8 shrink-0"
          aria-label="Collapse sidebar"
          @click="sidebarOpen = false"
        >
          <PanelLeftClose class="size-4" />
        </Button>
      </div>
      <div class="px-3 pt-3 pb-2">
        <Input
          v-model="sidebarSearch"
          placeholder="Search chats"
          size="small"
          :prefix-icon="Search"
          class="rounded-lg"
        />
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto pb-3">
        <p v-if="filteredThreads.length === 0" class="text-muted-foreground px-3 py-6 text-center text-xs">
          No chats match “{{ sidebarSearch.trim() }}”
        </p>
        <template v-for="group in groupedThreads" :key="group.key">
          <p class="text-muted-foreground px-3 pt-3 pb-1 text-xs font-medium tracking-wide uppercase">
            {{ group.key }}
          </p>
          <div
            v-for="t in group.items"
            :key="t.id"
            :class="[
              'group flex w-full items-center gap-0.5 px-1.5 py-0.5',
              t.id === activeId ? 'bg-primary/10' : 'hover:bg-muted/60',
            ]"
          >
            <input
              v-if="renamingId === t.id"
              data-thread-rename
              v-model="renameDraft"
              class="border-input bg-background focus-visible:ring-ring h-7 min-w-0 flex-1 rounded-md border px-2 text-sm outline-none focus-visible:ring-2"
              @keydown.enter.prevent="commitRename"
              @keydown.esc.prevent="renamingId = null"
              @blur="commitRename"
            />
            <button
              v-else
              type="button"
              :class="[
                'min-w-0 flex-1 truncate px-1.5 py-1.5 text-left text-sm',
                t.id === activeId ? 'text-foreground font-medium' : 'text-foreground/80',
              ]"
              @click="selectThread(t.id)"
            >
              {{ t.title }}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground size-7 shrink-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                  aria-label="Thread actions"
                  @click.stop
                >
                  <MoreHorizontal class="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-40">
                <DropdownMenuItem @click="startRename(t)">
                  <Pencil class="size-3.5" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" @click="deleteThread(t.id)">
                  <Trash2 class="size-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
      </div>
      <div class="border-t px-3 py-3">
        <div class="flex items-center gap-2">
          <Avatar class="size-8">
            <AvatarFallback class="text-xs font-medium">U</AvatarFallback>
          </Avatar>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-medium">You</p>
            <p class="text-muted-foreground truncate text-xs">Free plan</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="size-8" aria-label="Account menu">
                <MoreHorizontal class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-44">
              <DropdownMenuItem>
                <Settings class="size-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Upgrade plan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>

    <section class="flex min-h-0 min-w-0 flex-col">
      <header class="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
        <div class="flex min-w-0 items-center gap-2">
          <Button
            v-if="!sidebarOpen"
            variant="ghost"
            size="icon"
            class="size-8"
            aria-label="Open sidebar"
            @click="sidebarOpen = true"
          >
            <PanelLeft class="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                type="button"
                class="hover:bg-muted/60 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
              >
                <Sparkles class="text-primary size-3.5" />
                {{ activeModel.label }}
                <ChevronDown class="text-muted-foreground size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" class="w-56">
              <DropdownMenuItem v-for="m in models" :key="m.id" @click="activeModel = m">
                <div class="min-w-0 flex-1">
                  <p class="font-medium">{{ m.label }}</p>
                  <p class="text-muted-foreground text-xs">{{ m.hint }}</p>
                </div>
                <Check v-if="m.id === activeModel.id" class="text-primary size-3.5 shrink-0" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="size-8" aria-label="More options">
              <MoreHorizontal class="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuItem :disabled="isEmpty" @click="copyConversation">
              <Copy class="size-3.5" />
              {{ copiedId === 'conversation' ? 'Copied' : 'Copy conversation' }}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" :disabled="isEmpty" @click="clearThread">
              <Trash2 class="size-3.5" />
              Clear thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div
        ref="scrollRoot"
        class="min-h-0 flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        :aria-busy="isStreaming"
      >
        <div v-if="isEmpty" class="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6 px-6">
          <div class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <Sparkles class="size-6" />
          </div>
          <div class="text-center">
            <h2 class="text-xl font-semibold tracking-tight">How can I help today?</h2>
            <p class="text-muted-foreground mt-1 text-sm">Ask anything, or try one of these to get started.</p>
          </div>
          <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              v-for="s in suggestions"
              :key="s.label"
              type="button"
              class="bg-card hover:bg-muted/60 group flex items-start gap-3 rounded-lg border p-3 text-left transition-colors"
              @click="send(s.body)"
            >
              <div
                class="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary flex size-8 shrink-0 items-center justify-center rounded-md transition-colors"
              >
                <component :is="s.icon" class="size-4" />
              </div>
              <div class="min-w-0">
                <p class="text-foreground text-xs font-medium">{{ s.label }}</p>
                <p class="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">{{ s.body }}</p>
              </div>
            </button>
          </div>
        </div>

        <div v-else class="mx-auto max-w-3xl space-y-6 px-6 py-6">
          <div v-for="t in turns" :key="t.id" class="group">
            <template v-if="t.role === 'user'">
              <div class="flex justify-end">
                <div
                  class="bg-primary/10 text-foreground max-w-[80%] rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {{ t.body }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-start gap-3">
                <div
                  class="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
                >
                  <Sparkles class="size-3.5" />
                </div>
                <div class="min-w-0 flex-1 space-y-3">
                  <p class="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{{ t.body }}</p>
                  <div v-if="t.code" class="bg-muted/60 overflow-hidden rounded-lg border">
                    <div
                      class="bg-muted/80 text-muted-foreground flex items-center justify-between px-3 py-1.5 font-mono text-xs"
                    >
                      <span>{{ t.code.lang }}</span>
                      <button
                        type="button"
                        class="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                        @click="copyTurn(t.id + '-code', t.code.content)"
                      >
                        <Check v-if="copiedId === t.id + '-code'" class="text-success size-3" />
                        <Copy v-else class="size-3" />
                        {{ copiedId === t.id + '-code' ? 'Copied' : 'Copy' }}
                      </button>
                    </div>
                    <pre
                      class="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed"
                    ><code>{{ t.code.content }}</code></pre>
                  </div>
                  <div
                    class="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
                  >
                    <button
                      type="button"
                      class="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors"
                      @click="copyTurn(t.id, t.body)"
                    >
                      <Check v-if="copiedId === t.id" class="text-success size-3" />
                      <Copy v-else class="size-3" />
                      {{ copiedId === t.id ? 'Copied' : 'Copy' }}
                    </button>
                    <button
                      type="button"
                      class="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors"
                      aria-label="Regenerate"
                      @click="regenerate(t.id)"
                    >
                      <RefreshCw class="size-3" />
                    </button>
                    <button
                      type="button"
                      :class="[
                        'hover:bg-muted inline-flex size-7 items-center justify-center rounded-md transition-colors',
                        feedback[t.id] === 'up' ? 'text-success' : 'text-muted-foreground hover:text-success',
                      ]"
                      aria-label="Good response"
                      :aria-pressed="feedback[t.id] === 'up'"
                      @click="toggleFeedback(t.id, 'up')"
                    >
                      <ThumbsUp class="size-3" />
                    </button>
                    <button
                      type="button"
                      :class="[
                        'hover:bg-muted inline-flex size-7 items-center justify-center rounded-md transition-colors',
                        feedback[t.id] === 'down' ? 'text-destructive' : 'text-muted-foreground hover:text-destructive',
                      ]"
                      aria-label="Bad response"
                      :aria-pressed="feedback[t.id] === 'down'"
                      @click="toggleFeedback(t.id, 'down')"
                    >
                      <ThumbsDown class="size-3" />
                    </button>
                    <span class="text-muted-foreground ml-auto text-xs tabular-nums">{{
                      formatTime(t.createdAt)
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div v-if="isStreaming" class="flex items-start gap-3">
            <div
              class="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
            >
              <Sparkles class="size-3.5" />
            </div>
            <div class="text-muted-foreground flex items-center gap-1.5 pt-1.5" aria-label="Generating">
              <span class="typing-dot" />
              <span class="typing-dot" style="animation-delay: 0.15s" />
              <span class="typing-dot" style="animation-delay: 0.3s" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-muted/20 shrink-0 border-t px-4 py-3">
        <div class="mx-auto max-w-3xl">
          <div
            class="bg-background border-input/60 focus-within:border-primary/40 focus-within:ring-primary/10 flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-150 focus-within:shadow-md focus-within:ring-4"
          >
            <div v-if="attachment" class="flex items-center gap-2 px-3 pt-3">
              <span
                class="bg-muted text-foreground inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs"
              >
                <Paperclip class="size-3 shrink-0" />
                <span class="truncate">{{ attachment.name }}</span>
                <button
                  type="button"
                  class="hover:text-destructive"
                  aria-label="Remove attachment"
                  @click="attachment = null"
                >
                  <X class="size-3" />
                </button>
              </span>
            </div>
            <textarea
              ref="composer"
              v-model="draft"
              :placeholder="`Message ${activeModel.label}`"
              rows="1"
              class="placeholder:text-muted-foreground/70 max-h-48 min-h-12 w-full resize-none border-0 bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed outline-none"
              @keydown="onComposerKey"
            />
            <div class="flex items-center justify-between gap-2 px-2 pb-2">
              <div class="flex items-center gap-0.5">
                <input ref="fileInput" type="file" class="sr-only" @change="onAttach" />
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-foreground size-8"
                  aria-label="Attach file"
                  @click="fileInput?.click()"
                >
                  <Paperclip class="size-4" />
                </Button>
                <span
                  class="text-muted-foreground bg-muted ml-1 inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium"
                >
                  <Sparkles class="text-primary size-3" />
                  {{ activeModel.label }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <kbd
                  class="bg-muted text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-xs sm:inline-flex"
                >
                  ↵
                </kbd>
                <Button
                  v-if="isStreaming"
                  variant="outline"
                  class="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                  aria-label="Stop generating"
                  @click="stop"
                >
                  <Square class="size-3 fill-current" />
                  Stop
                </Button>
                <Button
                  v-else
                  class="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                  :disabled="!draft.trim() && !attachment"
                  aria-label="Send"
                  @click="send()"
                >
                  Send
                  <ArrowUp class="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <p class="text-muted-foreground/70 mt-2 text-center text-xs">AI can make mistakes. Verify important info.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.typing-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.5;
  animation: typing-bounce 1s infinite ease-in-out;
}
@keyframes typing-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }
  40% {
    transform: translateY(-3px);
    opacity: 0.9;
  }
}
@media (prefers-reduced-motion: reduce) {
  .typing-dot {
    animation: none;
    opacity: 0.7;
  }
}
</style>
