<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCode2,
  FileText,
  Layers,
  Maximize2,
  MessageSquare,
  MessageSquareQuote,
  Minimize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  Sparkles,
  Subtitles,
  ThumbsUp,
  Trash2,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

// Video Playback State
const isPlaying = ref(false)
const currentTime = ref(384) // 06:24
const totalDuration = ref(1120) // 18:40
const bufferedPercent = ref(78)
const volume = ref(85)
const isMuted = ref(false)
const playbackSpeed = ref(1.25)
const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
const showCaptions = ref(true)
const isFullscreen = ref(false)
const activeTab = ref<'transcript' | 'notes' | 'qa'>('transcript')
const transcriptSearch = ref('')
const isCompleted = ref(false)
const isBookmarked = ref(false)
const copiedAsset = ref<string | null>(null)

// Timer ticker when video is playing
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
const progressPercent = computed(() => (currentTime.value / totalDuration.value) * 100)

function seekTo(seconds: number) {
  currentTime.value = Math.max(0, Math.min(seconds, totalDuration.value))
}

function handleSeekClick(event: MouseEvent) {
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
    // Restart interval with new speed
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

function toggleMute() {
  isMuted.value = !isMuted.value
}

// Transcript Data
interface TranscriptItem {
  id: string
  start: number
  end: number
  speaker: string
  text: string
}

const transcriptItems = ref<TranscriptItem[]>([
  {
    id: 't-1',
    start: 0,
    end: 75,
    speaker: 'Sarah Connor',
    text: 'Welcome back! In this lesson, we are tackling one of the trickiest parts of design systems: building resilient dark-mode token palettes using the OKLCH color space.',
  },
  {
    id: 't-2',
    start: 75,
    end: 220,
    speaker: 'Sarah Connor',
    text: 'Why do traditional HSL and sRGB color models fall short? Because perceptual brightness is non-uniform — pure blue at 50% lightness looks vastly darker to the human eye than pure yellow at 50% lightness.',
  },
  {
    id: 't-3',
    start: 220,
    end: 384,
    speaker: 'Sarah Connor',
    text: 'OKLCH solves this by decoupling perceived lightness (L) from chroma (C) and hue (H). When you step lightness down by 10%, the perceived luminance decreases identically regardless of hue angle.',
  },
  {
    id: 't-4',
    start: 384,
    end: 555,
    speaker: 'Sarah Connor',
    text: 'When calculating contrast in OKLCH, lightness is perceptually uniform across hues, which prevents dark-mode contrast crushing. Notice our formula on the slide.',
  },
  {
    id: 't-5',
    start: 555,
    end: 750,
    speaker: 'Sarah Connor',
    text: 'Next, let us discuss wide-gamut Display P3 displays. While P3 provides 25% richer saturation, we must ensure automatic fallback clamping for legacy sRGB monitors.',
  },
  {
    id: 't-6',
    start: 750,
    end: 945,
    speaker: 'Sarah Connor',
    text: 'In dark mode, human retinas are more sensitive to intense chroma saturation on dark surfaces. A solid heuristic is to reduce chroma by 15% to 20% on OLED dark backgrounds.',
  },
  {
    id: 't-7',
    start: 945,
    end: 1120,
    speaker: 'Sarah Connor',
    text: 'To wrap up, download the starter configuration below. In the next lesson, we will wire these token variables directly into our Tailwind CSS v4 @theme inline directives.',
  },
])

const activeTranscriptItem = computed(() => {
  return (
    transcriptItems.value.find((item) => currentTime.value >= item.start && currentTime.value < item.end) ||
    transcriptItems.value[0]
  )
})

const filteredTranscript = computed(() => {
  const query = transcriptSearch.value.trim().toLowerCase()
  if (!query) return transcriptItems.value
  return transcriptItems.value.filter(
    (item) => item.text.toLowerCase().includes(query) || item.speaker.toLowerCase().includes(query),
  )
})

// Notes Data
interface NoteItem {
  id: string
  timestamp: number
  text: string
  createdAt: string
}

const newNoteText = ref('')
const notesList = ref<NoteItem[]>([
  {
    id: 'n-1',
    timestamp: 102, // 01:42
    text: 'Pure blue vs pure yellow in HSL: huge luminance mismatch. OKLCH fixes this at the root.',
    createdAt: '2 hours ago',
  },
  {
    id: 'n-2',
    timestamp: 252, // 04:12
    text: 'Review color-mix in oklab formulas — can generate surface elevation tints with a single token!',
    createdAt: '1 hour ago',
  },
  {
    id: 'n-3',
    timestamp: 384, // 06:24
    text: 'Lightness rule: Keep L >= 0.70 for primary brand text on dark surfaces to guarantee APCA Lc 60 minimum.',
    createdAt: 'Just now',
  },
])

function handleAddNote() {
  const text = newNoteText.value.trim()
  if (!text) return
  notesList.value.unshift({
    id: `note-${Date.now()}`,
    timestamp: currentTime.value,
    text,
    createdAt: 'Just now',
  })
  newNoteText.value = ''
}

function handleDeleteNote(id: string) {
  notesList.value = notesList.value.filter((n) => n.id !== id)
}

// Q&A Data
interface QuestionItem {
  id: string
  timestamp: number
  author: string
  avatar: string
  question: string
  upvotes: number
  hasUpvoted?: boolean
  answer?: {
    author: string
    role: string
    text: string
    isInstructor?: boolean
  }
}

const newQuestionText = ref('')
const questionsList = ref<QuestionItem[]>([
  {
    id: 'q-1',
    timestamp: 225, // 03:45
    author: 'David K.',
    avatar: 'DK',
    question: 'Is browser support for OKLCH color-mix and raw oklch() ready for enterprise SaaS applications?',
    upvotes: 18,
    hasUpvoted: false,
    answer: {
      author: 'Sarah Connor',
      role: 'Instructor',
      isInstructor: true,
      text: 'Yes! OKLCH has 98%+ global browser support across all evergreen browsers. Tailwind CSS v4 uses it as the default token format natively.',
    },
  },
  {
    id: 'q-2',
    timestamp: 380, // 06:20
    author: 'Elena R.',
    avatar: 'ER',
    question: 'How do you prevent high chroma vibration on dark OLED zinc-950 surfaces?',
    upvotes: 12,
    hasUpvoted: false,
    answer: {
      author: 'Sarah Connor',
      role: 'Instructor',
      isInstructor: true,
      text: 'Scale down chroma by multiplying C * 0.82 on dark tokens, while boosting lightness by +0.08 to preserve legibility without glare.',
    },
  },
])

function handleAddQuestion() {
  const text = newQuestionText.value.trim()
  if (!text) return
  questionsList.value.unshift({
    id: `q-${Date.now()}`,
    timestamp: currentTime.value,
    author: 'You (Student)',
    avatar: 'ME',
    question: text,
    upvotes: 1,
    hasUpvoted: true,
  })
  newQuestionText.value = ''
}

function toggleUpvote(q: QuestionItem) {
  if (q.hasUpvoted) {
    q.upvotes -= 1
    q.hasUpvoted = false
  } else {
    q.upvotes += 1
    q.hasUpvoted = true
  }
}

function handleCopyAsset(name: string) {
  copiedAsset.value = name
  setTimeout(() => {
    copiedAsset.value = null
  }, 2000)
}
</script>

<template>
  <div data-slot="lesson-video-player" class="bg-background text-foreground w-full space-y-5">
    <!-- Top Lesson Navigation & Course Header Bar -->
    <header class="bg-card rounded-xl border p-4 shadow-xs sm:px-6 sm:py-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <!-- Left: Course Context & Lesson Title -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="text-muted-foreground font-medium">Design Systems with Tailwind CSS v4</span>
            <ChevronRight class="text-muted-foreground size-3.5" />
            <Badge variant="outline" class="gap-1 text-xs font-semibold">
              <Layers class="text-primary size-3" />
              <span>Module 1: Design Tokens Architecture</span>
            </Badge>
            <span class="text-muted-foreground hidden font-medium sm:inline">Lesson 4 of 12</span>
          </div>

          <h1 class="text-foreground text-lg font-bold tracking-tight sm:text-xl">
            Lesson 4: Building Resilient OKLCH Dark-Mode Token Palettes
          </h1>
        </div>

        <!-- Right: Progress Indicator & Navigation Buttons -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Course Progress Pill -->
          <div class="bg-muted/40 hidden items-center gap-2 rounded-lg border px-3 py-1.5 sm:flex">
            <div class="space-y-1 text-right">
              <div class="text-muted-foreground text-xs font-medium">Module Progress</div>
              <div class="font-mono text-xs font-bold tabular-nums">4/12 (33%)</div>
            </div>
            <div class="w-12">
              <Progress :model-value="33" class="h-1.5" />
            </div>
          </div>

          <!-- Bookmark Button -->
          <Button
            variant="outline"
            size="icon"
            class="size-8.5"
            :aria-label="isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'"
            @click="isBookmarked = !isBookmarked"
          >
            <BookmarkCheck v-if="isBookmarked" class="text-primary size-4" />
            <Bookmark v-else class="text-muted-foreground size-4" />
          </Button>

          <!-- Complete Lesson Button -->
          <Button
            :variant="isCompleted ? 'default' : 'outline'"
            size="sm"
            class="h-8.5 gap-1.5 text-xs font-semibold shadow-xs"
            @click="isCompleted = !isCompleted"
          >
            <CheckCircle2 v-if="isCompleted" class="size-3.5" />
            <Check v-else class="size-3.5" />
            <span>{{ isCompleted ? 'Completed' : 'Mark Complete' }}</span>
          </Button>

          <!-- Next Lesson Button -->
          <Button variant="default" size="sm" class="h-8.5 gap-1.5 text-xs font-semibold shadow-xs">
            <span>Next Lesson</span>
            <ArrowRight class="size-3.5" />
          </Button>
        </div>
      </div>
    </header>

    <!-- 2-Column Classroom Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Video Player Canvas + Takeaways & Downloads (8 cols) -->
      <section class="space-y-5 lg:col-span-8">
        <!-- Video Screen Container (Dark Video Canvas) -->
        <div
          class="group relative flex min-h-[260px] w-full flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-white shadow-lg select-none"
        >
          <!-- Top Video Overlay Info Bar -->
          <div class="z-20 flex items-center justify-between p-3.5 sm:p-4">
            <div class="flex items-center gap-2">
              <Badge
                variant="outline"
                class="border-zinc-700 bg-zinc-900/80 px-2 py-0.5 font-mono text-xs font-medium text-zinc-300 backdrop-blur-md"
              >
                1080p 60fps HD
              </Badge>
              <Badge
                variant="outline"
                class="border-primary/40 bg-primary/20 text-primary-foreground px-2 py-0.5 text-xs font-semibold backdrop-blur-md"
              >
                Lesson 4 / 12
              </Badge>
            </div>

            <!-- Instructor Watermark -->
            <div
              class="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300 backdrop-blur-md"
            >
              <span class="size-2 rounded-full bg-emerald-400" />
              <span class="font-medium">Sarah Connor</span>
              <span class="text-zinc-500">·</span>
              <span class="text-zinc-400">Principal Design Engineer</span>
            </div>
          </div>

          <!-- Video Presentation Slide & Diagram Visual -->
          <div class="relative my-auto flex flex-col items-center justify-center px-6 py-4 text-center">
            <!-- Simulated Code & Color Token Slide Matrix -->
            <div
              class="relative w-full max-w-xl space-y-3 rounded-lg border border-zinc-800/80 bg-zinc-900/85 p-4 text-left shadow-sm backdrop-blur-md"
            >
              <div class="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div class="flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="size-2.5 rounded-full bg-rose-500/80" />
                    <span class="size-2.5 rounded-full bg-amber-500/80" />
                    <span class="size-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span class="font-mono text-xs text-zinc-400">tokens.config.css — OKLCH Palette Engine</span>
                </div>
                <Badge
                  variant="outline"
                  class="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-400"
                >
                  APCA Lc 74 (AAA)
                </Badge>
              </div>

              <!-- Code Syntax Sample -->
              <pre
                class="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300"
              ><code><span class="text-zinc-500">/* OKLCH Perceptual Uniformity Matrix */</span>
<span class="text-purple-400">@theme inline</span> {
  <span class="text-cyan-400">--color-primary</span>: <span class="text-amber-300">oklch(0.62 0.19 259.8)</span>; <span class="text-zinc-500">/* Brand Base */</span>
  <span class="text-cyan-400">--color-surface-dark</span>: <span class="text-amber-300">oklch(0.18 0.02 260.0)</span>; <span class="text-zinc-500">/* OLED Safe */</span>
}</code></pre>

              <!-- Color Palette Swatch Strip -->
              <div class="flex items-center gap-2 pt-1">
                <span class="text-xs font-medium text-zinc-400">Lightness Ramp:</span>
                <div class="flex flex-1 items-center gap-1.5">
                  <div class="h-5 flex-1 rounded bg-[oklch(0.95_0.04_259.8)] shadow-xs" title="95% L" />
                  <div class="h-5 flex-1 rounded bg-[oklch(0.80_0.10_259.8)] shadow-xs" title="80% L" />
                  <div
                    class="h-5 flex-1 rounded bg-[oklch(0.62_0.19_259.8)] shadow-xs ring-1 ring-white/60"
                    title="62% L (Base)"
                  />
                  <div class="h-5 flex-1 rounded bg-[oklch(0.40_0.15_259.8)] shadow-xs" title="40% L" />
                  <div class="h-5 flex-1 rounded bg-[oklch(0.18_0.02_259.8)] shadow-xs" title="18% L (Dark)" />
                </div>
              </div>
            </div>

            <!-- Big Center Play / Pause Floating Button -->
            <button
              type="button"
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring absolute inset-0 m-auto flex size-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
              :aria-label="isPlaying ? 'Pause video' : 'Play video'"
              @click="togglePlay"
            >
              <Pause v-if="isPlaying" class="size-6 fill-current" />
              <Play v-else class="ml-0.5 size-6 fill-current" />
            </button>
          </div>

          <!-- Captions Subtitles Overlay Box -->
          <div
            v-if="showCaptions && activeTranscriptItem"
            class="z-20 mx-auto mb-1 max-w-xl rounded-lg border border-white/10 bg-black/80 px-4 py-1.5 text-center text-xs font-medium text-zinc-200 shadow-md backdrop-blur-md sm:text-sm"
          >
            <span class="text-zinc-400">[{{ formatTime(activeTranscriptItem.start) }}]</span>
            {{ activeTranscriptItem.text }}
          </div>

          <!-- Custom Player Controls Bar (Bottom Overlay) -->
          <div
            class="z-20 space-y-2 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-3 sm:px-4 sm:pt-4 sm:pb-3.5"
          >
            <!-- Scrubber Timeline Bar -->
            <div
              class="group/bar relative flex h-4 w-full cursor-pointer items-center"
              role="slider"
              aria-label="Video Timeline Scrubber"
              :aria-valuenow="currentTime"
              :aria-valuemin="0"
              :aria-valuemax="totalDuration"
              @click="handleSeekClick"
            >
              <!-- Background Full Track -->
              <div
                class="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800 transition-all group-hover/bar:h-2.5"
              >
                <!-- Buffer Progress -->
                <div
                  class="absolute top-0 bottom-0 left-0 bg-zinc-700 transition-all"
                  :style="{ width: `${bufferedPercent}%` }"
                />
                <!-- Played Progress -->
                <div
                  class="bg-primary absolute top-0 bottom-0 left-0 transition-all"
                  :style="{ width: `${progressPercent}%` }"
                />
              </div>

              <!-- Scrubber Dot Handle -->
              <div
                class="bg-primary absolute size-3.5 -translate-x-1/2 rounded-full shadow-md ring-2 ring-white transition-transform group-hover/bar:scale-125"
                :style="{ left: `${progressPercent}%` }"
              />
            </div>

            <!-- Controls Row: Play, Skip, Timestamps, Speed, Audio, Screen -->
            <div class="flex items-center justify-between gap-2 pt-0.5">
              <!-- Left Controls -->
              <div class="flex items-center gap-1 sm:gap-2">
                <!-- Play / Pause -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 text-white hover:bg-white/15"
                  :aria-label="isPlaying ? 'Pause' : 'Play'"
                  @click="togglePlay"
                >
                  <Pause v-if="isPlaying" class="size-4.5 fill-current" />
                  <Play v-else class="size-4.5 fill-current" />
                </Button>

                <!-- 15s Rewind -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                  aria-label="Rewind 15 seconds"
                  @click="skipSeconds(-15)"
                >
                  <RotateCcw class="size-4" />
                </Button>

                <!-- 15s Fast Forward -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                  aria-label="Fast forward 15 seconds"
                  @click="skipSeconds(15)"
                >
                  <RotateCw class="size-4" />
                </Button>

                <!-- Volume Toggle -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                  :aria-label="isMuted ? 'Unmute' : 'Mute'"
                  @click="toggleMute"
                >
                  <VolumeX v-if="isMuted || volume === 0" class="size-4 text-rose-400" />
                  <Volume1 v-else-if="volume < 50" class="size-4" />
                  <Volume2 v-else class="size-4" />
                </Button>

                <!-- Timestamp Display -->
                <div class="flex items-center gap-1 font-mono text-xs font-semibold text-zinc-300 tabular-nums sm:ml-1">
                  <span class="text-white">{{ formattedCurrentTime }}</span>
                  <span class="text-zinc-500">/</span>
                  <span class="text-zinc-400">{{ formattedTotalTime }}</span>
                </div>
              </div>

              <!-- Right Controls -->
              <div class="flex items-center gap-1 sm:gap-2">
                <!-- Speed Selector Button -->
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 px-2 font-mono text-xs font-bold text-zinc-300 hover:bg-white/15 hover:text-white"
                  aria-label="Cycle Playback Speed"
                  @click="cycleSpeed"
                >
                  {{ playbackSpeed }}x
                </Button>

                <!-- Captions Subtitles Toggle -->
                <Button
                  variant="ghost"
                  size="icon"
                  :class="[
                    'size-8 transition-colors',
                    showCaptions
                      ? 'text-primary hover:bg-white/15'
                      : 'text-zinc-400 hover:bg-white/15 hover:text-white',
                  ]"
                  :aria-label="showCaptions ? 'Hide Subtitles' : 'Show Subtitles'"
                  @click="showCaptions = !showCaptions"
                >
                  <Subtitles class="size-4" />
                </Button>

                <!-- Fullscreen Toggle -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                  :aria-label="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
                  @click="isFullscreen = !isFullscreen"
                >
                  <Minimize2 v-if="isFullscreen" class="size-4" />
                  <Maximize2 v-else class="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lesson Key Takeaways & Downloadable Assets Row -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Key Takeaways Card -->
          <Card class="shadow-xs">
            <CardHeader class="pb-2.5">
              <div class="flex items-center justify-between">
                <CardTitle class="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight uppercase">
                  <Sparkles class="text-primary size-3.5" />
                  Key Takeaways
                </CardTitle>
                <Badge variant="outline" class="font-mono text-xs">OKLCH v4</Badge>
              </div>
              <CardDescription class="text-xs">
                Essential architectural concepts taught in this lecture
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2.5 text-xs">
              <div class="bg-muted/30 flex items-start gap-2.5 rounded-lg border p-2.5">
                <div
                  class="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                  1
                </div>
                <div>
                  <span class="text-foreground font-semibold">Perceptual Uniformity:</span>
                  <p class="text-muted-foreground mt-0.5 leading-relaxed">
                    OKLCH lightness remains constant across all hues, maintaining predictable contrast ratios across
                    both dark and light palettes.
                  </p>
                </div>
              </div>

              <div class="bg-muted/30 flex items-start gap-2.5 rounded-lg border p-2.5">
                <div
                  class="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                  2
                </div>
                <div>
                  <span class="text-foreground font-semibold">Display P3 Gamut Clamping:</span>
                  <p class="text-muted-foreground mt-0.5 leading-relaxed">
                    Leverage vibrant P3 color gamuts on supported displays while automatically fallback-clamping for
                    sRGB displays.
                  </p>
                </div>
              </div>

              <div class="bg-muted/30 flex items-start gap-2.5 rounded-lg border p-2.5">
                <div
                  class="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                  3
                </div>
                <div>
                  <span class="text-foreground font-semibold">Chroma Scaling in Dark Mode:</span>
                  <p class="text-muted-foreground mt-0.5 leading-relaxed">
                    Scale down chroma by 15-20% on deep dark backgrounds to prevent ocular fatigue and visual vibration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Downloadable Source Code & Assets Card -->
          <Card class="shadow-xs">
            <CardHeader class="pb-2.5">
              <div class="flex items-center justify-between">
                <CardTitle class="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight uppercase">
                  <FileCode2 class="text-primary size-3.5" />
                  Lesson Assets & Code
                </CardTitle>
                <Badge variant="secondary" class="text-xs">3 Files</Badge>
              </div>
              <CardDescription class="text-xs"> Starter boilerplate and token configuration files </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2 text-xs">
              <!-- Asset 1 -->
              <div
                class="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2.5 transition-colors"
              >
                <div class="flex min-w-0 items-center gap-2.5">
                  <div
                    class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold"
                  >
                    TS
                  </div>
                  <div class="min-w-0">
                    <p class="text-foreground truncate text-xs font-semibold">tokens.config.ts</p>
                    <p class="text-muted-foreground font-mono text-xs">14.2 KB · Tailwind v4 Theme</p>
                  </div>
                </div>
                <Button
                  aria-label="Download attachment"
                  variant="outline"
                  size="sm"
                  class="h-7 gap-1 px-2 text-xs"
                  @click="handleCopyAsset('tokens.config.ts')"
                >
                  <Check v-if="copiedAsset === 'tokens.config.ts'" class="size-3 text-emerald-500" />
                  <Download v-else class="size-3" />
                  <span>{{ copiedAsset === 'tokens.config.ts' ? 'Saved' : 'Download' }}</span>
                </Button>
              </div>

              <!-- Asset 2 -->
              <div
                class="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2.5 transition-colors"
              >
                <div class="flex min-w-0 items-center gap-2.5">
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500/10 font-mono text-xs font-bold text-purple-600 dark:text-purple-400"
                  >
                    FIG
                  </div>
                  <div class="min-w-0">
                    <p class="text-foreground truncate text-xs font-semibold">palette-matrix.fig</p>
                    <p class="text-muted-foreground font-mono text-xs">4.8 MB · Token Library</p>
                  </div>
                </div>
                <Button
                  aria-label="Download attachment"
                  variant="outline"
                  size="sm"
                  class="h-7 gap-1 px-2 text-xs"
                  @click="handleCopyAsset('palette-matrix.fig')"
                >
                  <Check v-if="copiedAsset === 'palette-matrix.fig'" class="size-3 text-emerald-500" />
                  <Download v-else class="size-3" />
                  <span>{{ copiedAsset === 'palette-matrix.fig' ? 'Saved' : 'Download' }}</span>
                </Button>
              </div>

              <!-- Asset 3 -->
              <div
                class="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2.5 transition-colors"
              >
                <div class="flex min-w-0 items-center gap-2.5">
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-md bg-rose-500/10 font-mono text-xs font-bold text-rose-600 dark:text-rose-400"
                  >
                    PDF
                  </div>
                  <div class="min-w-0">
                    <p class="text-foreground truncate text-xs font-semibold">apca-contrast-guide.pdf</p>
                    <p class="text-muted-foreground font-mono text-xs">1.1 MB · Cheat Sheet</p>
                  </div>
                </div>
                <Button
                  aria-label="Download attachment"
                  variant="outline"
                  size="sm"
                  class="h-7 gap-1 px-2 text-xs"
                  @click="handleCopyAsset('apca-contrast-guide.pdf')"
                >
                  <Check v-if="copiedAsset === 'apca-contrast-guide.pdf'" class="size-3 text-emerald-500" />
                  <Download v-else class="size-3" />
                  <span>{{ copiedAsset === 'apca-contrast-guide.pdf' ? 'Saved' : 'Download' }}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- Right Column: Interactive Transcript & Notes Workspace (4 cols) -->
      <aside class="flex flex-col lg:col-span-4">
        <Card class="flex h-full flex-col overflow-hidden shadow-xs">
          <Tabs v-model="activeTab" class="flex h-full flex-col">
            <!-- Tabs Navigation Header -->
            <div class="bg-muted/30 border-b p-2.5">
              <TabsList class="grid h-8.5 w-full grid-cols-3">
                <TabsTrigger value="transcript" class="gap-1 text-xs font-medium">
                  <FileText class="size-3" />
                  <span>Transcript</span>
                </TabsTrigger>
                <TabsTrigger value="notes" class="gap-1 text-xs font-medium">
                  <BookmarkCheck class="size-3" />
                  <span>Notes</span>
                  <Badge variant="secondary" class="ml-0.5 px-1 py-0 text-xs">
                    {{ notesList.length }}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="qa" class="gap-1 text-xs font-medium">
                  <MessageSquareQuote class="size-3" />
                  <span>Q&A</span>
                  <Badge variant="secondary" class="ml-0.5 px-1 py-0 text-xs">
                    {{ questionsList.length }}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <!-- TAB 1: Interactive Transcript -->
            <TabsContent value="transcript" class="m-0 flex flex-1 flex-col focus-visible:outline-none">
              <!-- Search Transcript Filter -->
              <div class="border-b p-3">
                <div class="relative">
                  <Search class="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
                  <Input
                    v-model="transcriptSearch"
                    placeholder="Search lecture transcript..."
                    class="h-8 pl-8 text-xs"
                  />
                </div>
              </div>

              <!-- Transcript Segments List -->
              <div class="max-h-[580px] flex-1 space-y-2.5 overflow-y-auto p-3.5">
                <div
                  v-for="item in filteredTranscript"
                  :key="item.id"
                  :class="[
                    'group cursor-pointer rounded-lg border p-3 text-xs transition-all duration-200',
                    currentTime >= item.start && currentTime < item.end
                      ? 'border-primary/50 bg-primary/10 ring-primary/20 shadow-xs ring-1'
                      : 'border-border/70 bg-card hover:bg-muted/40',
                  ]"
                  @click="seekTo(item.start)"
                >
                  <div class="mb-1.5 flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        class="h-6 gap-1 rounded-md px-1.5 font-mono text-xs font-bold tabular-nums"
                        @click.stop="seekTo(item.start)"
                      >
                        <Play class="size-2.5 fill-current" />
                        <span>{{ formatTime(item.start) }}</span>
                      </Button>
                      <span class="text-muted-foreground text-xs font-medium">{{ item.speaker }}</span>
                    </div>

                    <Badge
                      v-if="currentTime >= item.start && currentTime < item.end"
                      variant="default"
                      class="gap-1 px-1.5 py-0 text-xs font-semibold"
                    >
                      <span class="size-1.5 animate-pulse rounded-full bg-white" />
                      <span>Playing</span>
                    </Badge>
                  </div>

                  <p
                    :class="[
                      'leading-relaxed',
                      currentTime >= item.start && currentTime < item.end
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground group-hover:text-foreground',
                    ]"
                  >
                    {{ item.text }}
                  </p>
                </div>
              </div>

              <!-- Transcript Footer Notice -->
              <div class="bg-muted/30 text-muted-foreground border-t p-2.5 text-center text-xs">
                Click any line to jump to that timestamp in the lecture.
              </div>
            </TabsContent>

            <!-- TAB 2: Timestamped Notes Workspace -->
            <TabsContent value="notes" class="m-0 flex flex-1 flex-col focus-visible:outline-none">
              <!-- Note Composer -->
              <div class="bg-muted/20 space-y-2 border-b p-3">
                <div class="flex items-center justify-between">
                  <label class="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight">
                    <Clock class="text-primary size-3.5" />
                    <span>Add Note at {{ formattedCurrentTime }}</span>
                  </label>
                  <span class="text-muted-foreground font-mono text-xs">Captures current playback time</span>
                </div>

                <Textarea
                  v-model="newNoteText"
                  rows="2"
                  class="resize-y text-xs leading-relaxed"
                  :placeholder="`Write your thoughts or takeaway at ${formattedCurrentTime}...`"
                  @keydown.enter.meta="handleAddNote"
                  @keydown.enter.ctrl="handleAddNote"
                />

                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground text-xs">Press ⌘+Enter to save</span>
                  <Button
                    size="sm"
                    class="h-7.5 gap-1 px-3 text-xs font-semibold"
                    :disabled="!newNoteText.trim()"
                    @click="handleAddNote"
                  >
                    <Plus class="size-3.5" />
                    <span>Save Note</span>
                  </Button>
                </div>
              </div>

              <!-- Saved Notes List -->
              <div class="max-h-[500px] flex-1 space-y-2.5 overflow-y-auto p-3.5">
                <div
                  v-for="note in notesList"
                  :key="note.id"
                  class="group bg-card hover:border-border rounded-lg border p-3 text-xs shadow-xs transition-colors"
                >
                  <div class="mb-1.5 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      class="text-primary h-5 gap-1 rounded px-1.5 font-mono text-xs font-bold tabular-nums"
                      @click="seekTo(note.timestamp)"
                    >
                      <Play class="size-2.5 fill-current" />
                      <span>{{ formatTime(note.timestamp) }}</span>
                    </Button>

                    <div class="flex items-center gap-1">
                      <span class="text-muted-foreground text-xs">{{ note.createdAt }}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="text-muted-foreground hover:text-destructive size-5 opacity-0 group-hover:opacity-100"
                        aria-label="Delete note"
                        @click="handleDeleteNote(note.id)"
                      >
                        <Trash2 class="size-3" />
                      </Button>
                    </div>
                  </div>

                  <p class="text-foreground leading-relaxed">{{ note.text }}</p>
                </div>

                <div v-if="notesList.length === 0" class="text-muted-foreground py-8 text-center text-xs">
                  No personal notes yet. Add your first note above!
                </div>
              </div>
            </TabsContent>

            <!-- TAB 3: Q&A Community Discussion -->
            <TabsContent value="qa" class="m-0 flex flex-1 flex-col focus-visible:outline-none">
              <!-- Question Composer -->
              <div class="bg-muted/20 space-y-2 border-b p-3">
                <div class="flex items-center justify-between">
                  <label class="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight">
                    <MessageSquare class="text-primary size-3.5" />
                    <span>Ask Instructor at {{ formattedCurrentTime }}</span>
                  </label>
                  <span class="text-muted-foreground font-mono text-xs">Tagged to this video time</span>
                </div>

                <Input
                  v-model="newQuestionText"
                  placeholder="Ask a question about this topic..."
                  class="h-8 text-xs"
                  @keydown.enter="handleAddQuestion"
                />

                <div class="flex items-center justify-end">
                  <Button
                    size="sm"
                    class="h-7 gap-1 px-3 text-xs font-semibold"
                    :disabled="!newQuestionText.trim()"
                    @click="handleAddQuestion"
                  >
                    <span>Post Question</span>
                  </Button>
                </div>
              </div>

              <!-- Questions Thread List -->
              <div class="max-h-[500px] flex-1 space-y-3 overflow-y-auto p-3.5">
                <div
                  v-for="q in questionsList"
                  :key="q.id"
                  class="bg-card space-y-2.5 rounded-lg border p-3 text-xs shadow-xs"
                >
                  <!-- Question Header -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold"
                      >
                        {{ q.avatar }}
                      </div>
                      <div>
                        <span class="text-foreground font-semibold">{{ q.author }}</span>
                        <Button
                          variant="link"
                          size="sm"
                          class="text-muted-foreground ml-1.5 h-auto p-0 font-mono text-xs"
                          @click="seekTo(q.timestamp)"
                        >
                          [{{ formatTime(q.timestamp) }}]
                        </Button>
                      </div>
                    </div>

                    <!-- Upvote Button -->
                    <Button
                      :variant="q.hasUpvoted ? 'default' : 'outline'"
                      size="sm"
                      class="h-6 gap-1 px-1.5 text-xs"
                      @click="toggleUpvote(q)"
                    >
                      <ThumbsUp class="size-2.5" />
                      <span class="font-mono tabular-nums">{{ q.upvotes }}</span>
                    </Button>
                  </div>

                  <!-- Question Text -->
                  <p class="text-foreground leading-relaxed">{{ q.question }}</p>

                  <!-- Instructor Answer if available -->
                  <div v-if="q.answer" class="bg-muted/40 border-primary/20 space-y-1 rounded-md border p-2.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground text-xs font-semibold">{{ q.answer.author }}</span>
                      <Badge variant="default" class="bg-emerald-600 px-1 py-0 text-xs font-normal">
                        Instructor Verified
                      </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs leading-relaxed">{{ q.answer.text }}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </aside>
    </div>
  </div>
</template>
