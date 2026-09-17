<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FastForward,
  Headphones,
  Heart,
  ListMusic,
  Mic,
  Pause,
  Play,
  Radio,
  RotateCcw,
  RotateCw,
  Share2,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-vue-next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

// Audio Playback State
const isPlaying = ref(false)
const currentTime = ref(860) // 14:20
const totalDuration = ref(2912) // 48:32
const volume = ref(80)
const isMuted = ref(false)
const playbackSpeed = ref(1.0)
const speedOptions = [1.0, 1.25, 1.5, 2.0]
const isBookmarked = ref(false)
const isLiked = ref(false)
const likeCount = ref(342)
const isCopied = ref(false)
const isDownloaded = ref(false)
const activeAccordionTab = ref('summary')

// 32-bar visual audio waveform normalized heights (15% to 100%)
const waveformBars = [
  32, 48, 65, 88, 60, 42, 75, 96, 85, 62, 50, 78, 92, 100, 84, 60, 38, 70, 88, 95, 80, 54, 42, 68, 85, 92, 76, 60, 46,
  64, 82, 45,
]

// Chapters Data
interface Chapter {
  id: number
  title: string
  subtitle: string
  start: number
  end: number
  durationFormatted: string
}

const chapters: Chapter[] = [
  {
    id: 1,
    title: 'Intro & State of Tooling',
    subtitle: 'Why traditional CSS workflows break at scale',
    start: 0, // 00:00
    end: 495, // 08:15
    durationFormatted: '08:15',
  },
  {
    id: 2,
    title: 'The Monorepo Pivot',
    subtitle: 'Moving away from monolithic npm component packages',
    start: 495, // 08:15
    end: 1360, // 22:40
    durationFormatted: '14:25',
  },
  {
    id: 3,
    title: 'OKLCH Math & Contrast Engines',
    subtitle: 'Perceptual uniformity, APCA contrast & wide-gamut P3',
    start: 1360, // 22:40
    end: 2290, // 38:10
    durationFormatted: '15:30',
  },
  {
    id: 4,
    title: 'Q&A & Future Standards',
    subtitle: 'Audience questions, migration playbooks & CSS Color 5',
    start: 2290, // 38:10
    end: 2912, // 48:32
    durationFormatted: '10:22',
  },
]

// Hosts & Guest Panelists
interface Person {
  name: string
  role: string
  company: string
  avatar: string
  fallback: string
  bio: string
  handle: string
}

const panelists: Person[] = [
  {
    name: 'Elena Rostova',
    role: 'Staff Design Engineer',
    company: 'Linear',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fallback: 'ER',
    bio: 'Pioneered Linear dark mode tokens, high-density keyboard workflows, and micro-interactions.',
    handle: '@erostova',
  },
  {
    name: 'Marcus Vance',
    role: 'Head of UI Architecture',
    company: 'Vercel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    fallback: 'MV',
    bio: 'Core architect on headless design systems, token compilers, and zero-runtime CSS workflows.',
    handle: '@marcusvance',
  },
  {
    name: 'Dr. Aris Thorne',
    role: 'Color Science Lead',
    company: 'W3C CSS Working Group',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    fallback: 'AT',
    bio: 'Author on CSS Color Module 4 & 5, APCA contrast metric integration, and gamut mapping algorithms.',
    handle: '@aristhorne',
  },
]

// External Referenced Links
interface ReferenceLink {
  title: string
  description: string
  url: string
  tag: string
}

const referenceLinks: ReferenceLink[] = [
  {
    title: 'OKLCH Color Space Visualizer',
    description: 'Interactive gamut mapper, lightness ramp generator, and P3 inspector.',
    url: 'https://oklch.com',
    tag: 'Tooling',
  },
  {
    title: 'W3C CSS Color Module Level 4',
    description: 'Official W3C specification defining oklch(), oklab(), and wide-gamut coordinates.',
    url: 'https://www.w3.org/TR/css-color-4/',
    tag: 'Specification',
  },
  {
    title: 'UIPKGE Component Registry Architecture',
    description: 'The unbundled registry distribution model for Vue and React design systems.',
    url: 'https://uipkge.dev',
    tag: 'Architecture',
  },
  {
    title: 'APCA Accessible Perceptual Contrast Algorithm',
    description: 'Next-generation readability standard replacing legacy WCAG 2 ratio formulas.',
    url: 'https://git.apcacontrast.com',
    tag: 'Accessibility',
  },
]

// Playback Timer
let playInterval: ReturnType<typeof setInterval> | null = null

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    playInterval = setInterval(() => {
      if (currentTime.value < totalDuration.value) {
        currentTime.value += 1
      } else {
        isPlaying.value = false
        if (playInterval) clearInterval(playInterval)
      }
    }, 1000 / playbackSpeed.value)
  } else if (playInterval) {
    clearInterval(playInterval)
  }
}

onUnmounted(() => {
  if (playInterval) clearInterval(playInterval)
})

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedTotalTime = computed(() => formatTime(totalDuration.value))
const remainingTime = computed(() => `-${formatTime(totalDuration.value - currentTime.value)}`)
const progressPercent = computed(() => (currentTime.value / totalDuration.value) * 100)

const currentChapter = computed(() => {
  return (
    chapters.find((c) => currentTime.value >= c.start && currentTime.value < c.end) || chapters[chapters.length - 1]
  )
})

const currentChapterProgress = computed(() => {
  const ch = currentChapter.value
  const elapsed = currentTime.value - ch.start
  const total = ch.end - ch.start
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
})

function seekTo(seconds: number) {
  currentTime.value = Math.max(0, Math.min(seconds, totalDuration.value))
}

function handleWaveformClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, clickX / rect.width))
  seekTo(Math.round(ratio * totalDuration.value))
}

function skipSeconds(delta: number) {
  seekTo(currentTime.value + delta)
}

function cycleSpeed() {
  const currentIndex = speedOptions.indexOf(playbackSpeed.value)
  const nextIndex = (currentIndex + 1) % speedOptions.length
  playbackSpeed.value = speedOptions[nextIndex]
  if (isPlaying.value) {
    if (playInterval) clearInterval(playInterval)
    playInterval = setInterval(() => {
      if (currentTime.value < totalDuration.value) {
        currentTime.value += 1
      } else {
        isPlaying.value = false
        if (playInterval) clearInterval(playInterval)
      }
    }, 1000 / playbackSpeed.value)
  }
}

function skipToNextChapter() {
  const currentIndex = chapters.findIndex((c) => c.id === currentChapter.value.id)
  if (currentIndex < chapters.length - 1) {
    seekTo(chapters[currentIndex + 1].start)
  }
}

function skipToPrevChapter() {
  const ch = currentChapter.value
  if (currentTime.value - ch.start > 4) {
    seekTo(ch.start)
  } else {
    const currentIndex = chapters.findIndex((c) => c.id === ch.id)
    if (currentIndex > 0) {
      seekTo(chapters[currentIndex - 1].start)
    } else {
      seekTo(0)
    }
  }
}

function toggleMute() {
  isMuted.value = !isMuted.value
}

function toggleLike() {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

function handleCopyLink() {
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

function handleDownload() {
  isDownloaded.value = true
  setTimeout(() => {
    isDownloaded.value = false
  }, 3000)
}
</script>

<template>
  <div data-slot="podcast-audio-player" class="bg-background text-foreground w-full space-y-6">
    <!-- EPISODE HERO CARD -->
    <Card class="overflow-hidden border shadow-xs">
      <CardContent class="p-5 sm:p-7">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left Column: Cover Art & Episode Details -->
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
            <!-- Podcast Cover Artwork Thumbnail -->
            <div
              class="from-primary/20 via-primary/10 to-background ring-border/80 group relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br shadow-md ring-1 sm:size-32"
            >
              <!-- Animated Soundwave/Vinyl Graphic -->
              <div
                class="border-primary/30 absolute inset-2 rounded-xl border border-dashed opacity-60 transition-transform duration-700 group-hover:rotate-45"
              />
              <div
                class="bg-card/90 relative z-10 flex size-14 items-center justify-center rounded-xl border shadow-xs"
              >
                <Radio class="text-primary size-7" />
              </div>
              <div
                class="bg-background/90 text-foreground absolute right-2 bottom-2 rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
              >
                EP #48
              </div>
            </div>

            <!-- Episode Meta & Titles -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="outline" class="gap-1 text-xs font-semibold">
                  <Mic class="text-primary size-3" />
                  <span>The Design Systems Podcast</span>
                </Badge>
                <Badge variant="secondary" class="font-mono text-xs"> Season 4 · Episode #48 </Badge>
                <Badge
                  variant="outline"
                  class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  Lossless 320kbps
                </Badge>
              </div>

              <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                Deconstructing OKLCH & Zero-Dependency Component Registries
              </h1>

              <div class="text-muted-foreground flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <!-- Hosts Avatars -->
                <div class="flex items-center gap-2">
                  <div class="flex shrink-0 -space-x-2 overflow-hidden">
                    <Avatar class="border-background ring-border size-6 border-2 ring-1">
                      <AvatarImage :src="panelists[0].avatar" :alt="panelists[0].name" />
                      <AvatarFallback>{{ panelists[0].fallback }}</AvatarFallback>
                    </Avatar>
                    <Avatar class="border-background ring-border size-6 border-2 ring-1">
                      <AvatarImage :src="panelists[1].avatar" :alt="panelists[1].name" />
                      <AvatarFallback>{{ panelists[1].fallback }}</AvatarFallback>
                    </Avatar>
                    <Avatar class="border-background ring-border size-6 border-2 ring-1">
                      <AvatarImage :src="panelists[2].avatar" :alt="panelists[2].name" />
                      <AvatarFallback>{{ panelists[2].fallback }}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span class="text-foreground font-medium">Elena Rostova, Marcus Vance & Dr. Aris Thorne</span>
                </div>
                <span>·</span>
                <div class="flex items-center gap-1 font-mono text-xs tabular-nums">
                  <Clock class="size-3.5" />
                  <span>48 mins</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Primary Hero Actions -->
          <div class="flex flex-wrap items-center gap-2 border-t pt-4 lg:border-t-0 lg:pt-0">
            <!-- Like Button -->
            <Button
              :variant="isLiked ? 'default' : 'outline'"
              size="sm"
              class="h-9 gap-1.5 text-xs font-semibold shadow-xs"
              @click="toggleLike"
            >
              <Heart :class="['size-4', isLiked ? 'fill-current' : 'text-muted-foreground']" />
              <span class="font-mono tabular-nums">{{ likeCount }}</span>
            </Button>

            <!-- Bookmark Button -->
            <Button
              variant="outline"
              size="icon"
              class="size-9 shadow-xs"
              :aria-label="isBookmarked ? 'Remove bookmark' : 'Bookmark episode'"
              @click="isBookmarked = !isBookmarked"
            >
              <BookmarkCheck v-if="isBookmarked" class="text-primary size-4" />
              <Bookmark v-else class="text-muted-foreground size-4" />
            </Button>

            <!-- Share / Copy Link -->
            <Button
              variant="outline"
              size="sm"
              class="h-9 gap-1.5 text-xs font-semibold shadow-xs"
              @click="handleCopyLink"
            >
              <Check v-if="isCopied" class="size-4 text-emerald-500" />
              <Share2 v-else class="size-4" />
              <span>{{ isCopied ? 'Link Copied' : 'Share' }}</span>
            </Button>

            <!-- Download Episode -->
            <Button
              variant="outline"
              size="icon"
              class="size-9 shadow-xs"
              :aria-label="isDownloaded ? 'Downloaded' : 'Download episode'"
              @click="handleDownload"
            >
              <Check v-if="isDownloaded" class="size-4 text-emerald-500" />
              <Download v-else class="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- AUDIO PLAYER CONTROLS (CENTERPIECE) -->
    <Card class="border shadow-xs">
      <CardContent class="space-y-6 p-5 sm:p-7">
        <!-- Currently Playing Chapter Header -->
        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="bg-primary size-2 animate-pulse rounded-full" />
              <span class="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                Now Playing · Chapter {{ currentChapter.id }} of {{ chapters.length }}
              </span>
            </div>
            <h2 class="text-foreground text-base font-bold tracking-tight sm:text-lg">
              {{ currentChapter.title }}
            </h2>
            <p class="text-muted-foreground text-xs">
              {{ currentChapter.subtitle }}
            </p>
          </div>

          <div class="flex items-center gap-2 self-start font-mono text-xs font-semibold tabular-nums sm:self-auto">
            <Badge variant="outline" class="border-primary/30 bg-primary/5 gap-1 px-2.5 py-1">
              <span class="text-primary font-bold">{{ formattedCurrentTime }}</span>
              <span class="text-muted-foreground">/</span>
              <span class="text-muted-foreground">{{ formattedTotalTime }}</span>
            </Badge>
            <span class="text-muted-foreground text-xs">{{ remainingTime }}</span>
          </div>
        </div>

        <!-- 32-BAR VISUAL SVG AUDIO WAVEFORM SCRUBBER -->
        <div class="space-y-2">
          <div
            class="group/wave bg-muted/30 hover:bg-muted/50 border-border/80 relative flex h-24 w-full cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors select-none"
            role="slider"
            aria-label="Audio Waveform Scrubber"
            :aria-valuenow="currentTime"
            :aria-valuemin="0"
            :aria-valuemax="totalDuration"
            @click="handleWaveformClick"
          >
            <!-- Background SVG Waveform Bars -->
            <div class="flex h-full w-full items-center justify-between gap-1 sm:gap-1.5">
              <div
                v-for="(barHeight, index) in waveformBars"
                :key="index"
                class="flex h-full flex-1 items-center justify-center"
              >
                <!-- Single Audio Bar -->
                <div
                  :class="[
                    'w-full max-w-[8px] rounded-full transition-all duration-150',
                    (index / waveformBars.length) * 100 <= progressPercent
                      ? 'bg-primary'
                      : 'bg-muted-foreground/25 group-hover/wave:bg-muted-foreground/35',
                    isPlaying && Math.floor((progressPercent / 100) * waveformBars.length) === index
                      ? 'ring-primary/40 scale-y-110 ring-2'
                      : '',
                  ]"
                  :style="{
                    height: `${barHeight}%`,
                  }"
                />
              </div>
            </div>

            <!-- Interactive Timeline Cursor Scrubber Line -->
            <div
              class="bg-foreground pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 transition-all"
              :style="{ left: `${progressPercent}%` }"
            >
              <div
                class="bg-primary ring-background absolute -top-1 left-1/2 size-3.5 -translate-x-1/2 rounded-full shadow-md ring-2 transition-transform group-hover/wave:scale-125"
              />
            </div>

            <!-- Chapter Notch Markers on Waveform Bottom -->
            <div class="pointer-events-none absolute right-4 bottom-1.5 left-4 flex justify-between">
              <span
                v-for="ch in chapters"
                :key="ch.id"
                class="absolute flex flex-col items-center"
                :style="{ left: `${(ch.start / totalDuration) * 100}%` }"
              >
                <span class="bg-muted-foreground/50 h-2 w-0.5" />
              </span>
            </div>
          </div>

          <!-- Bottom Time & Chapter Range Indicators -->
          <div class="text-muted-foreground flex items-center justify-between font-mono text-xs tabular-nums">
            <div class="flex items-center gap-1.5">
              <span class="text-foreground font-semibold">{{ formattedCurrentTime }}</span>
              <span>(Chapter progress: {{ Math.round(currentChapterProgress) }}%)</span>
            </div>
            <span>{{ formattedTotalTime }}</span>
          </div>
        </div>

        <!-- MAIN PLAYBACK CONTROLS BAR -->
        <div class="flex flex-col items-center justify-between gap-4 pt-2 md:flex-row">
          <!-- Left: Secondary Tools (Speed & Chapter Navigation) -->
          <div class="flex items-center gap-2">
            <!-- Speed Selector Button -->
            <Button
              variant="outline"
              size="sm"
              class="hover:bg-accent h-9 gap-1 px-2.5 font-mono text-xs font-bold shadow-xs"
              aria-label="Cycle Playback Speed"
              @click="cycleSpeed"
            >
              <FastForward class="text-primary size-3.5" />
              <span>{{ playbackSpeed.toFixed(playbackSpeed % 1 === 0 ? 1 : 2) }}x</span>
            </Button>

            <!-- Previous Chapter -->
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-9"
              aria-label="Previous Chapter"
              @click="skipToPrevChapter"
            >
              <SkipBack class="size-4" />
            </Button>

            <!-- Next Chapter -->
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-9"
              aria-label="Next Chapter"
              @click="skipToNextChapter"
            >
              <SkipForward class="size-4" />
            </Button>
          </div>

          <!-- Center: Core Transport Buttons (15s Rewind, Play/Pause, 15s Fast Forward) -->
          <div class="flex items-center gap-3">
            <!-- 15s Rewind -->
            <Button
              variant="outline"
              size="icon"
              class="size-10 rounded-full shadow-xs"
              aria-label="Rewind 15 seconds"
              @click="skipSeconds(-15)"
            >
              <RotateCcw class="size-4.5" />
            </Button>

            <!-- Primary Play / Pause Circle Button -->
            <Button
              variant="default"
              size="icon"
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring size-13 rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 active:scale-95"
              :aria-label="isPlaying ? 'Pause episode' : 'Play episode'"
              @click="togglePlay"
            >
              <Pause v-if="isPlaying" class="size-6 fill-current" />
              <Play v-else class="ml-0.5 size-6 fill-current" />
            </Button>

            <!-- 15s Fast Forward -->
            <Button
              variant="outline"
              size="icon"
              class="size-10 rounded-full shadow-xs"
              aria-label="Fast forward 15 seconds"
              @click="skipSeconds(15)"
            >
              <RotateCw class="size-4.5" />
            </Button>
          </div>

          <!-- Right: Volume Slider Controls -->
          <div class="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-9"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
              @click="toggleMute"
            >
              <VolumeX v-if="isMuted || volume === 0" class="size-4.5 text-rose-500" />
              <Volume1 v-else-if="volume < 50" class="size-4.5" />
              <Volume2 v-else class="size-4.5" />
            </Button>

            <div class="w-24 sm:w-28">
              <Slider v-model="volume" :min="0" :max="100" :step="1" :disabled="isMuted" class="cursor-pointer" />
            </div>
            <span class="text-muted-foreground w-8 text-right font-mono text-xs tabular-nums">
              {{ isMuted ? '0%' : `${volume}%` }}
            </span>
          </div>
        </div>

        <Separator />

        <!-- CHAPTER NAVIGATION BAR -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <ListMusic class="text-primary size-4" />
              <h3 class="text-foreground text-xs font-bold tracking-tight uppercase">Chapter Navigation</h3>
            </div>
            <span class="text-muted-foreground font-mono text-xs"> 4 Chapters · 48m 32s Total </span>
          </div>

          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="ch in chapters"
              :key="ch.id"
              :class="[
                'group flex cursor-pointer flex-col justify-between rounded-xl border p-3 text-xs transition-all duration-200',
                currentChapter.id === ch.id
                  ? 'border-primary/50 bg-primary/5 ring-primary/20 shadow-xs ring-1'
                  : 'bg-card hover:bg-muted/40 border-border/70',
              ]"
              @click="seekTo(ch.start)"
            >
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <Badge
                    :variant="currentChapter.id === ch.id ? 'default' : 'outline'"
                    class="h-5 px-1.5 font-mono text-xs font-semibold"
                  >
                    CH {{ ch.id }}
                  </Badge>
                  <span class="text-muted-foreground font-mono text-xs tabular-nums">
                    {{ formatTime(ch.start) }}
                  </span>
                </div>
                <div class="text-foreground line-clamp-1 font-semibold">
                  {{ ch.title }}
                </div>
                <div class="text-muted-foreground line-clamp-1 text-xs">
                  {{ ch.subtitle }}
                </div>
              </div>

              <!-- Active Chapter Progress Mini Indicator -->
              <div class="mt-2.5 pt-1">
                <Progress v-if="currentChapter.id === ch.id" :model-value="currentChapterProgress" class="h-1" />
                <div
                  v-else
                  :class="['h-1 w-full rounded-full', currentTime >= ch.end ? 'bg-primary/40' : 'bg-muted']"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- EPISODE SHOW NOTES & GUEST LINKS ACCORDION -->
    <Card class="border shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Sparkles class="text-primary size-4" />
            <CardTitle class="text-base font-bold tracking-tight sm:text-lg">
              Episode Show Notes & Comprehensive Guide
            </CardTitle>
          </div>
          <Badge variant="outline" class="font-mono text-xs"> Full Notes </Badge>
        </div>
        <CardDescription class="text-xs sm:text-sm">
          Deep dive references, color math formulas, guest bios, and resource bookmarks from this episode.
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-1">
        <Accordion type="single" collapsible default-value="summary" class="w-full">
          <!-- Accordion Item 1: Episode Summary -->
          <AccordionItem value="summary">
            <AccordionTrigger class="text-xs font-semibold hover:no-underline sm:text-sm">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold"
                  >1</span
                >
                <span>Executive Summary & Key Takeaways</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="space-y-3 pt-2 text-xs leading-relaxed">
              <p class="text-muted-foreground">
                In this episode, we break down why traditional HSL and sRGB color models fall short when building
                modern, accessible multi-theme design systems. We explore how the OKLCH color space decouples perceptual
                lightness from chroma and hue, eliminating contrast inversion bugs when shifting from light to OLED dark
                mode.
              </p>

              <div class="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
                <div class="bg-muted/30 space-y-1 rounded-lg border p-3">
                  <div class="text-foreground font-semibold">Perceptual Uniformity</div>
                  <p class="text-muted-foreground text-xs">
                    Lightness (L) in OKLCH remains consistent regardless of hue angle, unlike HSL where yellow appears
                    far brighter than blue.
                  </p>
                </div>

                <div class="bg-muted/30 space-y-1 rounded-lg border p-3">
                  <div class="text-foreground font-semibold">Zero-Dependency Registries</div>
                  <p class="text-muted-foreground text-xs">
                    Unbundled component distribution gives engineering teams 100% source code ownership with zero
                    semantic version drift.
                  </p>
                </div>

                <div class="bg-muted/30 space-y-1 rounded-lg border p-3">
                  <div class="text-foreground font-semibold">Tailwind v4 @theme</div>
                  <p class="text-muted-foreground text-xs">
                    Direct CSS variable binding with OKLCH tokens unlocks dynamic color-mix tints without JavaScript
                    runtime overhead.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- Accordion Item 2: Detailed Chapter Breakdown -->
          <AccordionItem value="chapters">
            <AccordionTrigger class="text-xs font-semibold hover:no-underline sm:text-sm">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold"
                  >2</span
                >
                <span>Timestamped Chapter Breakdown & Discussion Topics</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="space-y-2.5 pt-2 text-xs">
              <div
                v-for="ch in chapters"
                :key="ch.id"
                class="bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground font-semibold">Chapter {{ ch.id }}: {{ ch.title }}</span>
                  </div>
                  <p class="text-muted-foreground text-xs">{{ ch.subtitle }}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  class="h-7 gap-1 px-2.5 font-mono text-xs font-bold tabular-nums"
                  @click="seekTo(ch.start)"
                >
                  <Play class="text-primary size-2.5 fill-current" />
                  <span>{{ formatTime(ch.start) }}</span>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- Accordion Item 3: Featured Panelists & Guests -->
          <AccordionItem value="panelists">
            <AccordionTrigger class="text-xs font-semibold hover:no-underline sm:text-sm">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold"
                  >3</span
                >
                <span>Featured Hosts & Guest Panel</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="space-y-3 pt-2 text-xs">
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div
                  v-for="person in panelists"
                  :key="person.name"
                  class="bg-muted/25 flex flex-col justify-between space-y-3 rounded-xl border p-3.5"
                >
                  <div class="flex items-start gap-3">
                    <Avatar class="ring-border size-10 border ring-1">
                      <AvatarImage :src="person.avatar" :alt="person.name" />
                      <AvatarFallback>{{ person.fallback }}</AvatarFallback>
                    </Avatar>
                    <div class="min-w-0 space-y-0.5">
                      <div class="text-foreground truncate font-bold">{{ person.name }}</div>
                      <div class="text-muted-foreground truncate text-xs">{{ person.role }}</div>
                      <Badge variant="secondary" class="h-4 px-1 text-xs">
                        {{ person.company }}
                      </Badge>
                    </div>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    {{ person.bio }}
                  </p>
                  <div class="text-primary font-mono text-xs">
                    {{ person.handle }}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- Accordion Item 4: Mentioned Resources & External Links -->
          <AccordionItem value="resources">
            <AccordionTrigger class="text-xs font-semibold hover:no-underline sm:text-sm">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold"
                  >4</span
                >
                <span>Mentioned Resources & Specifications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="space-y-2.5 pt-2 text-xs">
              <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  v-for="link in referenceLinks"
                  :key="link.title"
                  :href="link.url"
                  target="_blank"
                  rel="noreferrer"
                  class="bg-muted/25 hover:bg-muted/50 group flex flex-col justify-between rounded-xl border p-3.5 transition-colors"
                >
                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <span
                        class="text-foreground group-hover:text-primary flex items-center gap-1.5 font-semibold transition-colors"
                      >
                        {{ link.title }}
                        <ExternalLink class="text-muted-foreground group-hover:text-primary size-3 transition-colors" />
                      </span>
                      <Badge variant="outline" class="font-mono text-xs">
                        {{ link.tag }}
                      </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      {{ link.description }}
                    </p>
                  </div>
                  <div class="text-muted-foreground pt-2 font-mono text-xs">
                    {{ link.url }}
                  </div>
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <CardFooter class="bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-t p-4 text-xs">
        <div class="text-muted-foreground flex items-center gap-2">
          <Headphones class="text-primary size-4" />
          <span>Produced by The Design Systems Guild · All rights reserved</span>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="h-7 text-xs" @click="handleCopyLink">
            <Copy class="mr-1 size-3.5" />
            <span>Copy Transcript Link</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
