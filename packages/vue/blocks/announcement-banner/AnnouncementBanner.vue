<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Terminal, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AnnouncementItem {
  id: string
  category: 'release' | 'security' | 'maintenance' | 'feature'
  badgeText: string
  title: string
  actionLabel: string
  actionUrl?: string
  cliSnippet?: string
}

interface Props {
  variant?: 'floating-pill' | 'top-bar' | 'interactive-ticker'
  autoplay?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'interactive-ticker',
  autoplay: true,
})

const announcements: AnnouncementItem[] = [
  {
    id: 'ann-1',
    category: 'release',
    badgeText: 'v2.4.0 Release',
    title: 'Tailwind CSS v4 OKLCH tokens & 281+ production workbenches are live.',
    actionLabel: 'Read Changelog',
    actionUrl: 'https://uipkge.dev/changelog',
    cliSnippet: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json',
  },
  {
    id: 'ann-2',
    category: 'feature',
    badgeText: 'Dual-Framework',
    title: '100% Vue 3.5 & React 19 component parity achieved with zero runtime CSS.',
    actionLabel: 'Explore Parity Matrix',
    actionUrl: 'https://uipkge.dev/components',
    cliSnippet: 'npx shadcn@latest add https://uipkge.dev/r/react/init.json',
  },
  {
    id: 'ann-3',
    category: 'security',
    badgeText: 'Security Notice',
    title: 'Upstream Reka UI & Radix dependency security patches verified and updated.',
    actionLabel: 'Security Advisory',
    actionUrl: 'https://uipkge.dev/security',
  },
]

const currentIndex = ref(0)
const dismissed = ref(false)
const isPaused = ref(false)
const copiedCli = ref(false)

let timer: ReturnType<typeof setInterval> | undefined

function startAutoplay() {
  if (!props.autoplay) return
  stopAutoplay()
  timer = setInterval(() => {
    if (!isPaused.value) {
      nextAnnouncement()
    }
  }, 6000)
}

function stopAutoplay() {
  if (timer) clearInterval(timer)
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

function nextAnnouncement() {
  currentIndex.value = (currentIndex.value + 1) % announcements.length
}

function prevAnnouncement() {
  currentIndex.value = (currentIndex.value - 1 + announcements.length) % announcements.length
}

function copyCliSnippet(snippet?: string) {
  if (!snippet) return
  navigator.clipboard.writeText(snippet)
  copiedCli.value = true
  setTimeout(() => (copiedCli.value = false), 2000)
}

const current = computed(() => announcements[currentIndex.value])
</script>

<template>
  <div
    v-if="!dismissed"
    data-slot="announcement-banner"
    :data-variant="props.variant"
    role="region"
    aria-label="Announcement"
    :class="cn('relative z-50 transition-all duration-200', props.class)"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- 1. Interactive Ticker Mode (Default) -->
    <div
      v-if="props.variant === 'interactive-ticker'"
      class="bg-muted/70 border-border text-foreground flex items-center justify-between gap-3 overflow-hidden border-b px-4 py-2 text-xs shadow-xs backdrop-blur-md"
    >
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <!-- Left: Status Beacon & Item Indicator -->
        <div class="flex shrink-0 items-center gap-3">
          <div class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
            <span class="bg-primary size-2 animate-pulse rounded-full" />
            <span class="text-foreground font-semibold">Live Dispatch</span>
          </div>

          <Badge
            variant="secondary"
            class="px-2 py-0.5 font-mono text-xs"
            :class="[
              current.category === 'release' && 'bg-primary/10 text-primary border-primary/20',
              current.category === 'security' &&
                'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
              current.category === 'feature' &&
                'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            ]"
          >
            {{ current.badgeText }}
          </Badge>
        </div>

        <!-- Center: Dynamic Headline & Action Link -->
        <div class="flex flex-1 items-center justify-center gap-2 truncate">
          <p class="text-foreground truncate font-medium">
            {{ current.title }}
          </p>
          <a
            v-if="current.actionUrl"
            :href="current.actionUrl"
            class="text-primary hidden shrink-0 items-center gap-1 font-semibold hover:underline sm:inline-flex"
          >
            {{ current.actionLabel }} <ArrowRight class="size-3" />
          </a>
        </div>

        <!-- Right: Ticker Navigation & CLI / Dismiss -->
        <div class="flex shrink-0 items-center gap-2">
          <button
            v-if="current.cliSnippet"
            type="button"
            class="bg-background border-border text-muted-foreground hover:text-foreground hidden items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs transition-colors md:inline-flex"
            @click="copyCliSnippet(current.cliSnippet)"
          >
            <Terminal class="text-primary size-3" />
            <span>{{ copiedCli ? 'Copied CLI!' : 'Copy CLI' }}</span>
          </button>

          <div class="border-border bg-background flex items-center overflow-hidden rounded-md border">
            <button
              type="button"
              class="hover:bg-muted text-muted-foreground hover:text-foreground p-1 transition-colors"
              aria-label="Previous announcement"
              @click="prevAnnouncement"
            >
              <ChevronLeft class="size-3.5" />
            </button>
            <span class="text-muted-foreground px-1.5 font-mono text-xs">
              {{ currentIndex + 1 }}/{{ announcements.length }}
            </span>
            <button
              type="button"
              class="hover:bg-muted text-muted-foreground hover:text-foreground p-1 transition-colors"
              aria-label="Next announcement"
              @click="nextAnnouncement"
            >
              <ChevronRight class="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Dismiss banner"
            class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
            @click="dismissed = true"
          >
            <X class="size-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Floating Pill Mode -->
    <div v-else-if="props.variant === 'floating-pill'" class="mx-auto w-fit max-w-2xl px-4 py-2">
      <div
        class="bg-card/90 border-border text-foreground hover:border-primary/40 flex items-center gap-3 rounded-full border py-1.5 pr-2 pl-3 text-xs shadow-md backdrop-blur-md transition-colors"
      >
        <Badge variant="secondary" class="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 font-mono text-xs">
          {{ current.badgeText }}
        </Badge>
        <p class="text-foreground max-w-sm truncate font-medium">
          {{ current.title }}
        </p>
        <a
          v-if="current.actionUrl"
          :href="current.actionUrl"
          class="text-primary inline-flex shrink-0 items-center gap-1 font-semibold hover:underline"
        >
          {{ current.actionLabel }} <ArrowRight class="size-3" />
        </a>
        <button
          type="button"
          aria-label="Dismiss announcement"
          class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1 transition-colors"
          @click="dismissed = true"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- 3. Top Solid Bar Mode -->
    <div
      v-else
      class="bg-primary text-primary-foreground flex items-center justify-between gap-3 px-4 py-2 text-xs shadow-xs"
    >
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div class="flex items-center gap-2 truncate">
          <Sparkles class="size-4 shrink-0" />
          <span class="font-mono font-bold">[{{ current.badgeText }}]</span>
          <span class="truncate">{{ current.title }}</span>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <a
            v-if="current.actionUrl"
            :href="current.actionUrl"
            class="inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline"
          >
            {{ current.actionLabel }} <ArrowRight class="size-3" />
          </a>
          <button
            type="button"
            aria-label="Dismiss banner"
            class="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15 rounded p-1 transition-colors"
            @click="dismissed = true"
          >
            <X class="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
