<script setup lang="ts">
import { computed, ref } from 'vue'
import { BookOpen, Maximize2, Pause, Play, Sparkles, Star, Volume2, VolumeX, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface VideoChapter {
  id: string
  title: string
  timestamp: string
  description: string
}

const chapters: VideoChapter[] = [
  {
    id: 'intro',
    title: '1. Architecture & Registry Engine',
    timestamp: '0:45',
    description: 'Learn how unbundled components provide 100% source ownership without npm dependencies.',
  },
  {
    id: 'tokens',
    title: '2. OKLCH Theme & Token System',
    timestamp: '1:30',
    description: 'Explore the fluid color space engine and dynamic contrast balancing in Tailwind v4.',
  },
  {
    id: 'parity',
    title: '3. Dual-Framework Parity Model',
    timestamp: '2:15',
    description: 'Deep dive into mirror synchronization between Vue 3.5 SFC and React 19 TSX.',
  },
]

const isModalOpen = ref(false)
const isPlaying = ref(true)
const isMuted = ref(false)
const playbackSpeed = ref<1 | 1.5 | 2>(1)
const activeChapterIndex = ref(0)
const progressPercent = ref(38)

const currentChapter = computed(() => chapters[activeChapterIndex.value])

function openModal(index = 0) {
  activeChapterIndex.value = index
  isModalOpen.value = true
  isPlaying.value = true
}

function closeModal() {
  isModalOpen.value = false
  isPlaying.value = false
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}
</script>

<template>
  <section
    data-slot="hero-video-modal-walkthrough"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Ambient Glow Background -->
    <div
      class="bg-primary/10 pointer-events-none absolute top-12 left-1/2 -z-10 h-72 w-full max-w-5xl -translate-x-1/2 rounded-full blur-xl"
    />

    <div class="mx-auto max-w-6xl space-y-12 text-center">
      <!-- Headline & Subtitle -->
      <div class="mx-auto max-w-3xl space-y-5">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Sparkles class="text-primary size-3.5" />
          Interactive 3-Minute Architecture Walkthrough
        </Badge>

        <h1 class="text-foreground text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
          See how top engineering teams build with UIPKGE.
        </h1>

        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Watch a full walkthrough of our design engineering principles, OKLCH token engine, and dual-framework
          component architecture.
        </p>

        <!-- CTA Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button size="lg" class="gap-2 font-semibold shadow-xs" @click="openModal(0)">
            <Play class="size-4 fill-current" />
            <span>Watch Product Tour (3:30)</span>
          </Button>

          <Button as="a" href="#docs" variant="outline" size="lg" class="gap-2 font-medium">
            <BookOpen class="text-muted-foreground size-4" />
            <span>Read Architecture RFC</span>
          </Button>
        </div>

        <!-- Social Proof Avatars & Stars -->
        <div class="text-muted-foreground flex flex-wrap items-center justify-center gap-6 pt-3 text-xs">
          <div class="flex -space-x-2 overflow-hidden">
            <div
              class="ring-background bg-primary/20 text-primary flex inline-block size-7 items-center justify-center rounded-full text-xs font-bold ring-2"
            >
              RF
            </div>
            <div
              class="ring-background flex inline-block size-7 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-600 ring-2"
            >
              PC
            </div>
            <div
              class="ring-background flex inline-block size-7 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-600 ring-2"
            >
              EK
            </div>
            <div
              class="ring-background flex inline-block size-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-600 ring-2"
            >
              SH
            </div>
          </div>
          <div class="flex items-center gap-1 text-amber-500">
            <Star v-for="i in 5" :key="i" class="size-3.5 fill-current" />
            <span class="text-foreground ml-1 font-mono text-xs font-medium">4.9/5 by 1,400+ Design Engineers</span>
          </div>
        </div>
      </div>

      <!-- Video Preview Card & Chapter Trigger Grid -->
      <div class="mx-auto max-w-4xl">
        <Card
          class="border-border bg-card/95 group cursor-pointer overflow-hidden rounded-2xl p-2 shadow-sm backdrop-blur-md"
          @click="openModal(0)"
        >
          <!-- Video Thumbnail Frame -->
          <div
            class="bg-muted/60 border-border/80 relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl border p-6 text-left"
          >
            <!-- Overlay Backdrop Texture -->
            <div class="from-background/95 via-background/40 absolute inset-0 z-0 bg-gradient-to-t to-transparent" />

            <!-- Top Row: Badge & Length -->
            <div class="relative z-10 flex items-center justify-between">
              <span
                class="bg-background/80 border-border text-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium backdrop-blur-md"
              >
                <span class="size-2 animate-pulse rounded-full bg-emerald-500" />
                <span>Full HD &bull; 60 FPS</span>
              </span>
              <span
                class="bg-background/80 border-border text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-xs backdrop-blur-md"
              >
                Total runtime: 3m 30s
              </span>
            </div>

            <!-- Center: Play Button Beacon -->
            <div class="relative z-10 flex flex-col items-center justify-center py-8">
              <div
                class="bg-primary text-primary-foreground shadow-primary/25 flex size-16 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 sm:size-20"
              >
                <Play class="ml-1 size-7 fill-current sm:size-8" />
              </div>
              <p class="text-foreground mt-4 text-sm font-semibold tracking-tight">
                Click to Launch Interactive Player
              </p>
            </div>

            <!-- Bottom: Chapter Navigation Strip -->
            <div class="border-border/60 relative z-10 grid grid-cols-1 gap-2 border-t pt-2 sm:grid-cols-3">
              <div
                v-for="(chapter, idx) in chapters"
                :key="chapter.id"
                class="bg-background/60 border-border/50 hover:bg-background/90 rounded-lg border p-2 text-left backdrop-blur-sm transition-colors"
                @click.stop="openModal(idx)"
              >
                <div class="text-muted-foreground flex items-center justify-between font-mono text-xs">
                  <span class="truncate">{{ chapter.title.split('.')[1] }}</span>
                  <span class="text-primary font-bold">{{ chapter.timestamp }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Interactive Video Dialog Modal -->
    <div
      v-if="isModalOpen"
      class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md sm:p-6"
    >
      <div
        class="bg-card border-border animate-in fade-in-0 zoom-in-95 relative w-full max-w-4xl overflow-hidden rounded-2xl border text-left shadow-sm duration-200"
      >
        <!-- Modal Top Bar -->
        <div class="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-3">
          <div class="flex items-center gap-2">
            <span class="bg-primary size-2.5 rounded-full" />
            <span class="text-foreground font-mono text-xs font-semibold">{{ currentChapter.title }}</span>
          </div>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
            @click="closeModal"
          >
            <X class="size-4" />
          </button>
        </div>

        <!-- Simulated Video Playback Viewport -->
        <div class="relative flex aspect-video flex-col justify-between bg-neutral-950 p-6 text-white select-none">
          <div class="flex items-center justify-between font-mono text-xs opacity-80">
            <span>UIPKGE Architecture Masterclass</span>
            <span>OKLCH Engine v2.4</span>
          </div>

          <!-- Video Mock Graphic -->
          <div class="flex flex-col items-center justify-center space-y-3">
            <div
              class="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
            >
              <Play v-if="!isPlaying" class="ml-1 size-7 fill-current" />
              <Pause v-else class="size-7" />
            </div>
            <p class="max-w-md text-center font-mono text-xs text-neutral-400">
              {{ currentChapter.description }}
            </p>
          </div>

          <!-- Timeline Scrubber & Controls -->
          <div class="space-y-2">
            <!-- Progress Bar -->
            <div class="h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/20">
              <div class="bg-primary h-full transition-all duration-200" :style="{ width: `${progressPercent}%` }" />
            </div>

            <!-- Controls Row -->
            <div class="flex items-center justify-between font-mono text-xs">
              <div class="flex items-center gap-3">
                <button type="button" class="hover:text-primary transition-colors" @click="togglePlay">
                  <Pause v-if="isPlaying" class="size-4" />
                  <Play v-else class="size-4 fill-current" />
                </button>
                <button type="button" class="hover:text-primary transition-colors" @click="isMuted = !isMuted">
                  <VolumeX v-if="isMuted" class="size-4" />
                  <Volume2 v-else class="size-4" />
                </button>
                <span class="text-neutral-400">{{ currentChapter.timestamp }} / 3:30</span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded bg-white/10 px-2 py-0.5 transition-colors hover:bg-white/20"
                  @click="playbackSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1"
                >
                  {{ playbackSpeed }}x
                </button>
                <button type="button" class="hover:text-primary p-1 transition-colors">
                  <Maximize2 class="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Chapter Selector Footer -->
        <div class="border-border bg-muted/20 grid grid-cols-3 border-t">
          <button
            v-for="(ch, idx) in chapters"
            :key="ch.id"
            type="button"
            class="border-border border-r p-3 text-left font-mono text-xs transition-colors last:border-r-0"
            :class="
              activeChapterIndex === idx
                ? 'bg-background text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeChapterIndex = idx"
          >
            <div class="truncate">{{ ch.title }}</div>
            <div class="text-muted-foreground mt-0.5 text-xs">{{ ch.timestamp }}</div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
