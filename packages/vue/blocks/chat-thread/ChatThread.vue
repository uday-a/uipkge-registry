<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ArrowRight, AtSign, Paperclip, Phone, Smile, Video, MoreVertical, Check, CheckCheck } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type MessageStatus = 'sent' | 'delivered' | 'read'

interface Message {
  id: string
  author: 'me' | 'them'
  body: string
  sentAt: Date
  status?: MessageStatus
}

const now = new Date()
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

const peer = {
  name: 'Marcus Rivera',
  handle: '@marcus',
  avatarUrl: '',
  initials: 'MR',
  online: true,
  lastSeen: 'Active now',
}

const messages = ref<Message[]>([
  {
    id: 'm1',
    author: 'them',
    body: 'Hey — did you get a chance to look at the onboarding doc?',
    sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 14 * 60 * 1000),
  },
  {
    id: 'm2',
    author: 'me',
    body: 'Yeah, just finished. Two small notes on the time-off flow but otherwise looks solid.',
    sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 21 * 60 * 1000),
    status: 'read',
  },
  {
    id: 'm3',
    author: 'them',
    body: 'Perfect. Drop them in the doc and I will action this afternoon.',
    sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 23 * 60 * 1000),
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
])

const draft = ref('')
const scrollRoot = ref<HTMLElement | null>(null)
const peerTyping = ref(false)

const groupedMessages = computed(() => {
  const groups: Array<{ label: string; items: Message[] }> = []
  for (const m of messages.value) {
    const label = dayLabel(m.sentAt)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(m)
    else groups.push({ label, items: [m] })
  }
  return groups
})

function dayLabel(d: Date): string {
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return 'Today'
  const sameYesterday = d.toDateString() === yesterday.toDateString()
  if (sameYesterday) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

async function send() {
  const body = draft.value.trim()
  if (!body) return
  messages.value.push({
    id: `m${Date.now()}`,
    author: 'me',
    body,
    sentAt: new Date(),
    status: 'sent',
  })
  draft.value = ''
  await nextTick()
  scrollToBottom()
  peerTyping.value = true
  window.setTimeout(() => {
    peerTyping.value = false
  }, 1800)
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

watch(messages, () => nextTick(scrollToBottom), { deep: true })

onMounted(() => nextTick(scrollToBottom))
</script>

<template>
  <div
    data-slot="chat-thread"
    class="bg-card text-card-foreground flex h-[42.5rem] w-full flex-col overflow-hidden rounded-xl border shadow-sm"
  >
    <header class="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
      <div class="flex min-w-0 items-center gap-3">
        <div class="relative">
          <Avatar class="size-9">
            <AvatarImage v-if="peer.avatarUrl" :src="peer.avatarUrl" :alt="peer.name" />
            <AvatarFallback class="text-xs font-medium">{{ peer.initials }}</AvatarFallback>
          </Avatar>
          <span
            v-if="peer.online"
            class="bg-success ring-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2"
          />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold tracking-tight">{{ peer.name }}</p>
          <p class="text-muted-foreground truncate text-xs">{{ peer.lastSeen }}</p>
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
            <AvatarFallback class="text-xs">{{ peer.initials }}</AvatarFallback>
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
              <CheckCheck v-else-if="m.author === 'me' && m.status === 'delivered'" class="size-3" />
              <Check v-else-if="m.author === 'me' && m.status === 'sent'" class="size-3" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="peerTyping" class="flex items-end gap-2">
        <Avatar class="size-7">
          <AvatarFallback class="text-xs">{{ peer.initials }}</AvatarFallback>
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
          :placeholder="`Message ${peer.name.split(' ')[0]}`"
          rows="1"
          variant="plain"
          class="placeholder:text-muted-foreground/70 max-h-40 min-h-[44px] resize-none border-0 bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed shadow-none focus-visible:ring-0"
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
      <p class="text-muted-foreground/70 mt-2 text-center text-xs">
        <kbd class="bg-muted/60 rounded px-1 py-0.5 font-mono text-xs">Enter</kbd>
        to send
        <span class="mx-1.5 opacity-50">·</span>
        <kbd class="bg-muted/60 rounded px-1 py-0.5 font-mono text-xs">Shift</kbd>
        +
        <kbd class="bg-muted/60 rounded px-1 py-0.5 font-mono text-xs">↵</kbd>
        for newline
      </p>
    </div>
  </div>
</template>

<style scoped>
.chat-scroll::-webkit-scrollbar {
  width: 6px;
}
.chat-scroll::-webkit-scrollbar-thumb {
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
