<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  ArrowRight,
  AtSign,
  Paperclip,
  Phone,
  Smile,
  Video,
  MoreVertical,
  Search,
  Pin,
  CheckCheck,
  SquarePen,
  Filter,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Conversation {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  lastMessage: string
  lastAt: Date
  unread: number
  online: boolean
  pinned?: boolean
  muted?: boolean
}

interface Message {
  id: string
  author: 'me' | 'them'
  body: string
  sentAt: Date
  status?: 'sent' | 'delivered' | 'read'
}

const now = new Date()
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

const conversations = ref<Conversation[]>([
  {
    id: 'c1',
    name: 'Marcus Rivera',
    initials: 'MR',
    lastMessage: 'Yes! I will bring the kanban deck. Want to push it to 10:30?',
    lastAt: new Date(now.getTime() - 8 * 60 * 1000),
    unread: 2,
    online: true,
    pinned: true,
  },
  {
    id: 'c2',
    name: 'Sarah Connor',
    initials: 'SC',
    lastMessage: 'Approved — feel free to take Mar 15-18 off.',
    lastAt: new Date(now.getTime() - 52 * 60 * 1000),
    unread: 0,
    online: true,
  },
  {
    id: 'c3',
    name: 'Design Team',
    initials: 'DT',
    lastMessage: 'Priya: pushed the new color tokens to staging.',
    lastAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    unread: 5,
    online: false,
    pinned: true,
  },
  {
    id: 'c4',
    name: 'Alice Johnson',
    initials: 'AJ',
    lastMessage: 'Thanks! Will follow up after lunch.',
    lastAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    unread: 0,
    online: false,
  },
  {
    id: 'c5',
    name: 'Engineering',
    initials: 'EN',
    lastMessage: 'Devon: deploy is green, going home.',
    lastAt: yesterday,
    unread: 0,
    online: false,
    muted: true,
  },
  {
    id: 'c6',
    name: 'Priya Shah',
    initials: 'PS',
    lastMessage: 'Sent the spec — let me know what you think.',
    lastAt: new Date(now.getTime() - 28 * 60 * 60 * 1000),
    unread: 0,
    online: false,
  },
  {
    id: 'c7',
    name: 'Devon Patel',
    initials: 'DP',
    lastMessage: 'You: pushed the fix, should be live in 10.',
    lastAt: new Date(now.getTime() - 50 * 60 * 60 * 1000),
    unread: 0,
    online: true,
  },
])

const messagesByConvo: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      author: 'them',
      body: 'Hey — did you get a chance to look at the onboarding doc?',
      sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000),
    },
    {
      id: 'm2',
      author: 'me',
      body: 'Yeah, just finished. Two small notes on the time-off flow but otherwise looks solid.',
      sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 7 * 60 * 1000),
      status: 'read',
    },
    {
      id: 'm3',
      author: 'them',
      body: 'Perfect. Drop them in the doc and I will action this afternoon.',
      sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 9 * 60 * 1000),
    },
    {
      id: 'm4',
      author: 'me',
      body: 'Done. Also — are we still on for the dashboard review tomorrow at 10?',
      sentAt: new Date(now.getTime() - 42 * 60 * 1000),
      status: 'read',
    },
    {
      id: 'm5',
      author: 'them',
      body: 'Yes! I will bring the kanban deck. Want to push it to 10:30 so we can join from the standup?',
      sentAt: new Date(now.getTime() - 8 * 60 * 1000),
    },
  ],
  c2: [
    {
      id: 'm1',
      author: 'me',
      body: 'Hey Sarah — submitting time-off for Mar 15-18.',
      sentAt: new Date(now.getTime() - 95 * 60 * 1000),
      status: 'read',
    },
    {
      id: 'm2',
      author: 'them',
      body: 'Approved — feel free to take Mar 15-18 off.',
      sentAt: new Date(now.getTime() - 52 * 60 * 1000),
    },
  ],
  c3: [
    {
      id: 'm1',
      author: 'them',
      body: 'Priya: pushed the new color tokens to staging. Reviews welcome.',
      sentAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    },
  ],
  c4: [
    {
      id: 'm1',
      author: 'them',
      body: 'Thanks! Will follow up after lunch.',
      sentAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
  ],
  c5: [{ id: 'm1', author: 'them', body: 'Devon: deploy is green, going home.', sentAt: yesterday }],
  c6: [
    {
      id: 'm1',
      author: 'them',
      body: 'Sent the spec — let me know what you think.',
      sentAt: new Date(now.getTime() - 28 * 60 * 60 * 1000),
    },
  ],
  c7: [
    {
      id: 'm1',
      author: 'me',
      body: 'pushed the fix, should be live in 10.',
      sentAt: new Date(now.getTime() - 50 * 60 * 60 * 1000),
      status: 'read',
    },
  ],
}

const search = ref('')
const activeId = ref<string>('c1')
const draft = ref('')
const scrollRoot = ref<HTMLElement | null>(null)
const peerTyping = ref(false)

const activeConvo = computed(() => conversations.value.find((c) => c.id === activeId.value)!)
const activeMessages = computed<Message[]>(() => messagesByConvo[activeId.value] ?? [])

const filteredConvos = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = q
    ? conversations.value.filter((c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q))
    : conversations.value
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.lastAt.getTime() - a.lastAt.getTime()
  })
})

const groupedMessages = computed(() => {
  const groups: Array<{ label: string; items: Message[] }> = []
  for (const m of activeMessages.value) {
    const label = dayLabel(m.sentAt)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(m)
    else groups.push({ label, items: [m] })
  }
  return groups
})

function dayLabel(d: Date): string {
  if (d.toDateString() === now.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatConvoTime(d: Date): string {
  if (d >= todayStart) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays < 7) return d.toLocaleDateString(undefined, { weekday: 'short' })
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function selectConvo(id: string) {
  activeId.value = id
  const c = conversations.value.find((c) => c.id === id)
  if (c) c.unread = 0
  nextTick(scrollToBottom)
}

async function send() {
  const body = draft.value.trim()
  if (!body) return
  const list = messagesByConvo[activeId.value] ?? []
  list.push({ id: `m${Date.now()}`, author: 'me', body, sentAt: new Date(), status: 'sent' })
  messagesByConvo[activeId.value] = list
  draft.value = ''
  activeConvo.value.lastMessage = `You: ${body}`
  activeConvo.value.lastAt = new Date()
  await nextTick()
  scrollToBottom()
  peerTyping.value = true
  window.setTimeout(() => (peerTyping.value = false), 1600)
}

function onComposerKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function scrollToBottom() {
  if (!scrollRoot.value) return
  scrollRoot.value.scrollTop = scrollRoot.value.scrollHeight
}

watch(activeId, () => nextTick(scrollToBottom))
</script>

<template>
  <div
    data-slot="chat-two-pane"
    class="bg-card text-card-foreground grid h-[42.5rem] w-full grid-cols-[280px_1fr] overflow-hidden rounded-xl border shadow-sm"
  >
    <aside class="bg-muted/30 flex min-w-0 flex-col border-r">
      <div class="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
        <h2 class="text-sm font-semibold tracking-tight">Messages</h2>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" class="size-8" aria-label="Filter">
            <Filter class="size-4" />
          </Button>
          <Button variant="ghost" size="icon" class="size-8" aria-label="New conversation">
            <SquarePen class="size-4" />
          </Button>
        </div>
      </div>
      <div class="px-3 pt-3 pb-2">
        <div class="relative">
          <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input v-model="search" placeholder="Search" class="h-8 rounded-lg pl-8 text-xs" />
        </div>
      </div>
      <div class="convo-scroll flex-1 overflow-y-auto pb-3">
        <button
          v-for="c in filteredConvos"
          :key="c.id"
          :class="[
            'flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors',
            c.id === activeId ? 'bg-primary/10' : 'hover:bg-muted/60',
          ]"
          @click="selectConvo(c.id)"
        >
          <div class="relative shrink-0">
            <Avatar class="size-9">
              <AvatarImage v-if="c.avatarUrl" :src="c.avatarUrl" :alt="c.name" />
              <AvatarFallback class="text-xs">{{ c.initials }}</AvatarFallback>
            </Avatar>
            <span
              v-if="c.online"
              class="bg-success ring-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-1.5">
              <p :class="['truncate text-sm', c.unread > 0 ? 'font-semibold' : 'font-medium']">
                {{ c.name }}
              </p>
              <span class="text-muted-foreground shrink-0 text-xs tabular-nums">
                {{ formatConvoTime(c.lastAt) }}
              </span>
            </div>
            <div class="mt-0.5 flex items-center justify-between gap-1.5">
              <p :class="['truncate text-xs', c.unread > 0 ? 'text-foreground/80' : 'text-muted-foreground']">
                {{ c.lastMessage }}
              </p>
              <div class="flex shrink-0 items-center gap-1">
                <Pin v-if="c.pinned" class="text-muted-foreground size-3" />
                <span
                  v-if="c.unread > 0"
                  class="bg-primary text-primary-foreground inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs font-bold tabular-nums"
                >
                  {{ c.unread }}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <section class="flex min-w-0 flex-col">
      <header class="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
        <div class="flex min-w-0 items-center gap-3">
          <div class="relative">
            <Avatar class="size-9">
              <AvatarFallback class="text-xs font-medium">{{ activeConvo.initials }}</AvatarFallback>
            </Avatar>
            <span
              v-if="activeConvo.online"
              class="bg-success ring-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2"
            />
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold tracking-tight">{{ activeConvo.name }}</p>
            <p class="text-muted-foreground truncate text-xs">
              {{ activeConvo.online ? 'Active now' : 'Active 2h ago' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" class="size-8" aria-label="Voice call">
            <Phone class="size-4" />
          </Button>
          <Button variant="ghost" size="icon" class="size-8" aria-label="Video call">
            <Video class="size-4" />
          </Button>
          <Button variant="ghost" size="icon" class="size-8" aria-label="More options">
            <MoreVertical class="size-4" />
          </Button>
        </div>
      </header>

      <div ref="scrollRoot" class="chat-scroll flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <div v-for="group in groupedMessages" :key="group.label" class="space-y-3">
          <div class="flex items-center justify-center">
            <span
              class="text-muted-foreground bg-muted/60 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase"
            >
              {{ group.label }}
            </span>
          </div>
          <div
            v-for="m in group.items"
            :key="m.id"
            :class="['flex items-end gap-2', m.author === 'me' ? 'justify-end' : 'justify-start']"
          >
            <Avatar v-if="m.author === 'them'" class="size-7">
              <AvatarFallback class="text-xs">{{ activeConvo.initials }}</AvatarFallback>
            </Avatar>
            <div :class="['flex max-w-[80%] flex-col gap-1', m.author === 'me' ? 'items-end' : 'items-start']">
              <div
                :class="[
                  'rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm',
                  m.author === 'me'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md',
                ]"
              >
                {{ m.body }}
              </div>
              <div class="text-muted-foreground flex items-center gap-1 px-1 text-xs tabular-nums">
                <span>{{ formatTime(m.sentAt) }}</span>
                <CheckCheck v-if="m.author === 'me' && m.status === 'read'" class="text-info size-3" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="peerTyping" class="flex items-end gap-2">
          <Avatar class="size-7">
            <AvatarFallback class="text-xs">{{ activeConvo.initials }}</AvatarFallback>
          </Avatar>
          <div class="bg-muted text-muted-foreground flex items-center gap-1 rounded-2xl rounded-bl-md px-3 py-2.5">
            <span class="typing-dot" />
            <span class="typing-dot" style="animation-delay: 0.15s" />
            <span class="typing-dot" style="animation-delay: 0.3s" />
          </div>
        </div>
      </div>

      <div class="bg-muted/20 border-t px-4 py-3">
        <div
          class="bg-background border-input/60 focus-within:border-primary/40 focus-within:ring-primary/10 group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-150 focus-within:shadow-md focus-within:ring-4"
        >
          <Textarea
            v-model="draft"
            :placeholder="`Message ${activeConvo.name.split(' ')[0]}`"
            rows="1"
            class="placeholder:text-muted-foreground/70 max-h-40 min-h-[2.75rem] resize-none border-0 bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed shadow-none focus-visible:ring-0"
            @keydown="onComposerKey"
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
                <span>↵</span>
              </kbd>
              <Button
                class="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                :disabled="!draft.trim()"
                aria-label="Send"
                @click="send"
              >
                Send
                <ArrowRight class="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.chat-scroll::-webkit-scrollbar,
.convo-scroll::-webkit-scrollbar {
  width: 6px;
}
.chat-scroll::-webkit-scrollbar-thumb,
.convo-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
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
</style>
