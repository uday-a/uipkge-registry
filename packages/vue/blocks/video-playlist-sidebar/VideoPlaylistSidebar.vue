<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileCode2,
  ListVideo,
  Play,
  PlayCircle,
  Repeat,
  Repeat1,
  Search,
  Shuffle,
  SkipForward,
  Sparkles,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

export interface VideoResource {
  id: string
  name: string
  size: string
  type: 'code' | 'figma' | 'pdf'
}

export interface PlaylistItem {
  id: string
  index: number
  title: string
  instructor: string
  instructorRole: string
  instructorAvatar: string
  duration: string
  durationSec: number
  category: string
  summary: string
  isCompleted: boolean
  thumbnailGradient: string
  resources: VideoResource[]
}

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
  }>(),
  {},
)

const autoPlay = ref(true)
const isLooping = ref(false)
const isShuffled = ref(false)
const searchQuery = ref('')
const activeVideoId = ref('vid-03')
const downloadedAssets = ref<Record<string, boolean>>({})

const playlistItems = ref<PlaylistItem[]>([
  {
    id: 'vid-01',
    index: 1,
    title: '01. Introduction to Component Registries',
    instructor: 'Marcus Vance',
    instructorRole: 'Principal Design Engineer',
    instructorAvatar: 'MV',
    duration: '14:20',
    durationSec: 860,
    category: 'Architecture',
    summary: 'Understanding unbundled component distribution, registry manifests, and own-your-code paradigms.',
    isCompleted: true,
    thumbnailGradient: 'from-slate-800 to-zinc-950',
    resources: [
      { id: 'res-1a', name: 'registry-schema-spec.pdf', size: '1.2 MB', type: 'pdf' },
      { id: 'res-1b', name: 'starter-registry.json', size: '48 KB', type: 'code' },
    ],
  },
  {
    id: 'vid-02',
    index: 2,
    title: '02. Headless Reka UI Primitives',
    instructor: 'Elena Rostova',
    instructorRole: 'Staff Frontend Engineer',
    instructorAvatar: 'ER',
    duration: '18:45',
    durationSec: 1125,
    category: 'Accessibility',
    summary: 'Composition with asChild, polymorphic slot mechanics, and ARIA state tree management.',
    isCompleted: true,
    thumbnailGradient: 'from-zinc-800 to-slate-950',
    resources: [
      { id: 'res-2a', name: 'reka-composition-cheatsheet.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 'res-2b', name: 'accessible-dialog.vue', size: '14 KB', type: 'code' },
    ],
  },
  {
    id: 'vid-03',
    index: 3,
    title: '03. Building with OKLCH Tokens',
    instructor: 'Sarah Connor',
    instructorRole: 'Design Systems Architect',
    instructorAvatar: 'SC',
    duration: '22:10',
    durationSec: 1330,
    category: 'Color Systems',
    summary: 'Perceptually uniform color spaces, wide-gamut Display P3 gamut mapping, and dark mode contrast.',
    isCompleted: false,
    thumbnailGradient: 'from-slate-850 to-zinc-950',
    resources: [
      { id: 'res-3a', name: 'tokens.config.css', size: '14.2 KB', type: 'code' },
      { id: 'res-3b', name: 'oklch-palette-matrix.fig', size: '4.8 MB', type: 'figma' },
      { id: 'res-3c', name: 'apca-contrast-guide.pdf', size: '1.1 MB', type: 'pdf' },
    ],
  },
  {
    id: 'vid-04',
    index: 4,
    title: '04. Micro-Interactions & Spring Physics',
    instructor: 'Alex Chen',
    instructorRole: 'Motion Design Lead',
    instructorAvatar: 'AC',
    duration: '19:35',
    durationSec: 1175,
    category: 'Motion & Physics',
    summary: 'Crafting tactile UI states, gesture dampening, spring curves, and 120fps hardware acceleration.',
    isCompleted: false,
    thumbnailGradient: 'from-zinc-800 to-zinc-950',
    resources: [
      { id: 'res-4a', name: 'spring-curves-preset.ts', size: '8.4 KB', type: 'code' },
      { id: 'res-4b', name: 'gesture-lab.fig', size: '3.6 MB', type: 'figma' },
    ],
  },
  {
    id: 'vid-05',
    index: 5,
    title: '05. Multi-Framework Parity Testing',
    instructor: 'Marcus Vance',
    instructorRole: 'Principal Design Engineer',
    instructorAvatar: 'MV',
    duration: '16:50',
    durationSec: 1010,
    category: 'Testing & Quality',
    summary: 'Automating visual regression tests and unit tests across dual Vue 3 and React 19 packages.',
    isCompleted: false,
    thumbnailGradient: 'from-slate-800 to-slate-950',
    resources: [
      { id: 'res-5a', name: 'parity-test-matrix.ts', size: '22.0 KB', type: 'code' },
      { id: 'res-5b', name: 'playwright.config.ts', size: '6.5 KB', type: 'code' },
    ],
  },
  {
    id: 'vid-06',
    index: 6,
    title: '06. CI/CD Deployment to Cloudflare',
    instructor: 'David Kim',
    instructorRole: 'DevOps & Cloud Engineer',
    instructorAvatar: 'DK',
    duration: '25:15',
    durationSec: 1515,
    category: 'DevOps & Edge',
    summary: 'Automating multi-framework build chains, registry sync, and edge deployment via Wrangler.',
    isCompleted: false,
    thumbnailGradient: 'from-zinc-850 to-zinc-950',
    resources: [
      { id: 'res-6a', name: 'wrangler.toml', size: '3.4 KB', type: 'code' },
      { id: 'res-6b', name: 'deploy-pipeline.yml', size: '5.1 KB', type: 'code' },
    ],
  },
])

const activeVideo = computed(() => {
  return playlistItems.value.find((item) => item.id === activeVideoId.value) || playlistItems.value[0]
})

const completedCount = computed(() => {
  return playlistItems.value.filter((item) => item.isCompleted).length
})

const totalCount = computed(() => playlistItems.value.length)

const progressPercent = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

const filteredVideos = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return playlistItems.value
  return playlistItems.value.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.instructor.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query),
  )
})

function selectVideo(id: string) {
  activeVideoId.value = id
}

function toggleComplete(id: string) {
  const video = playlistItems.value.find((item) => item.id === id)
  if (video) {
    video.isCompleted = !video.isCompleted
  }
}

function nextVideo() {
  const currentIndex = playlistItems.value.findIndex((item) => item.id === activeVideoId.value)
  if (currentIndex === -1) return

  if (isShuffled.value) {
    const remaining = playlistItems.value.filter((item) => item.id !== activeVideoId.value)
    if (remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length)
      activeVideoId.value = remaining[randomIndex].id
    }
    return
  }

  if (currentIndex < playlistItems.value.length - 1) {
    activeVideoId.value = playlistItems.value[currentIndex + 1].id
  } else if (isLooping.value) {
    activeVideoId.value = playlistItems.value[0].id
  }
}

function handleDownload(assetId: string) {
  downloadedAssets.value[assetId] = true
  setTimeout(() => {
    downloadedAssets.value[assetId] = false
  }, 2000)
}
</script>

<template>
  <div
    data-slot="video-playlist-sidebar"
    :class="cn('text-foreground mx-auto w-full max-w-2xl space-y-4', props.class)"
  >
    <!-- Main Playlist Control Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="space-y-3 pb-3 sm:pb-4">
        <!-- Badge row -->
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <Badge variant="secondary" class="gap-1.5 text-xs font-semibold">
              <ListVideo class="text-primary size-3.5" />
              <span>Video Playlist</span>
            </Badge>
            <Badge variant="outline" class="text-muted-foreground gap-1 font-mono text-xs">
              <Clock class="size-3" />
              <span>1h 56m Total</span>
            </Badge>
          </div>
          <span class="text-muted-foreground text-xs font-medium">UIPKGE Masterclass Series</span>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1">
          <CardTitle class="text-foreground text-lg font-bold tracking-tight sm:text-xl">
            Mastering Full-Stack UI Engineering
          </CardTitle>
          <CardDescription class="text-xs">
            Curated playlist on headless primitives, OKLCH token systems, fluid motion physics, and registry CI
            pipelines.
          </CardDescription>
        </div>

        <!-- Progress bar and counter -->
        <div class="bg-muted/40 border-border/70 space-y-2 rounded-lg border p-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-foreground font-semibold">
              <span class="font-mono tabular-nums">{{ completedCount }}</span> /
              <span class="font-mono tabular-nums">{{ totalCount }}</span> Videos Completed
            </span>
            <span class="text-primary font-mono font-bold tabular-nums">{{ progressPercent }}%</span>
          </div>
          <Progress :model-value="progressPercent" class="h-2" />
        </div>

        <!-- Toolbar: Autoplay switch, Loop & Shuffle toggles -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
          <!-- Autoplay next switch -->
          <div class="flex items-center gap-2.5">
            <Switch id="autoplay-switch" :model-value="autoPlay" size="sm" @update:model-value="autoPlay = $event" />
            <label
              for="autoplay-switch"
              class="text-foreground flex cursor-pointer items-center gap-1.5 text-xs font-medium select-none"
            >
              <Sparkles class="text-primary size-3.5" />
              <span>Autoplay Next Video</span>
            </label>
          </div>

          <!-- Loop and Shuffle Buttons -->
          <div class="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              :class="
                cn(
                  'h-7.5 gap-1.5 px-2.5 text-xs font-medium transition-colors',
                  isLooping
                    ? 'border-primary/30 bg-primary/10 text-primary border font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              :aria-pressed="isLooping"
              aria-label="Toggle loop playlist"
              @click="isLooping = !isLooping"
            >
              <Repeat1 v-if="isLooping" class="size-3.5" />
              <Repeat v-else class="size-3.5" />
              <span>Loop</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              :class="
                cn(
                  'h-7.5 gap-1.5 px-2.5 text-xs font-medium transition-colors',
                  isShuffled
                    ? 'border-primary/30 bg-primary/10 text-primary border font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              :aria-pressed="isShuffled"
              aria-label="Toggle shuffle playlist"
              @click="isShuffled = !isShuffled"
            >
              <Shuffle class="size-3.5" />
              <span>Shuffle</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- Currently Active Video Card -->
    <Card
      class="border-primary/40 from-primary/5 via-card to-card relative overflow-hidden bg-gradient-to-br shadow-xs"
    >
      <div class="bg-primary absolute top-0 right-0 left-0 h-0.5" />
      <CardHeader class="pb-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <Badge variant="default" class="gap-1.5 text-xs font-semibold">
              <span class="size-1.5 animate-pulse rounded-full bg-white" />
              <span>Now Playing</span>
            </Badge>
            <Badge variant="outline" class="font-mono text-xs font-medium">
              Lesson {{ activeVideo.index }} of {{ totalCount }}
            </Badge>
          </div>
          <span class="text-muted-foreground font-mono text-xs font-semibold tabular-nums">
            {{ activeVideo.duration }}
          </span>
        </div>

        <div class="space-y-1 pt-1">
          <CardTitle class="text-foreground text-base font-bold tracking-tight sm:text-lg">
            {{ activeVideo.title }}
          </CardTitle>
          <CardDescription class="text-xs leading-relaxed">
            {{ activeVideo.summary }}
          </CardDescription>
        </div>

        <!-- Instructor and Metadata -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div class="flex items-center gap-2">
            <div
              class="border-primary/30 bg-primary/15 text-primary flex size-7 items-center justify-center rounded-full border text-xs font-bold"
            >
              {{ activeVideo.instructorAvatar }}
            </div>
            <div>
              <p class="text-foreground text-xs font-semibold">{{ activeVideo.instructor }}</p>
              <p class="text-muted-foreground text-xs">{{ activeVideo.instructorRole }} · {{ activeVideo.category }}</p>
            </div>
          </div>

          <!-- Video status controls -->
          <div class="flex items-center gap-2">
            <Button
              :variant="activeVideo.isCompleted ? 'secondary' : 'outline'"
              size="sm"
              class="h-7.5 gap-1.5 px-2.5 text-xs font-medium"
              @click="toggleComplete(activeVideo.id)"
            >
              <CheckCircle2 v-if="activeVideo.isCompleted" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <Check v-else class="size-3.5" />
              <span>{{ activeVideo.isCompleted ? 'Completed' : 'Mark as Watched' }}</span>
            </Button>

            <Button size="sm" class="h-7.5 gap-1.5 px-2.5 text-xs font-semibold shadow-xs" @click="nextVideo">
              <span>Next</span>
              <SkipForward class="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <!-- Downloadable Lesson Exercise Files -->
      <CardContent class="border-border/60 bg-muted/20 border-t pt-3 pb-3.5">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight uppercase">
              <FileCode2 class="text-primary size-3.5" />
              <span>Lesson Exercise Files</span>
            </p>
            <span class="text-muted-foreground font-mono text-xs">{{ activeVideo.resources.length }} Files</span>
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div
              v-for="res in activeVideo.resources"
              :key="res.id"
              class="border-border/80 bg-card hover:bg-muted/40 flex items-center justify-between gap-2 rounded-lg border p-2 text-xs transition-colors"
            >
              <div class="flex min-w-0 items-center gap-2">
                <span
                  class="border-primary/20 bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold"
                >
                  {{ res.type === 'code' ? 'TS' : res.type === 'figma' ? 'FIG' : 'PDF' }}
                </span>
                <div class="min-w-0">
                  <p class="text-foreground truncate text-xs font-medium">{{ res.name }}</p>
                  <p class="text-muted-foreground font-mono text-xs">{{ res.size }}</p>
                </div>
              </div>

              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                class="h-6.5 shrink-0 gap-1 px-2 text-xs font-medium"
                @click="handleDownload(res.id)"
              >
                <Check v-if="downloadedAssets[res.id]" class="size-3 text-emerald-600 dark:text-emerald-400" />
                <Download v-else class="size-3" />
                <span>{{ downloadedAssets[res.id] ? 'Saved' : 'Get' }}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Playlist Queue & List Header -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="space-y-3 pb-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <CardTitle class="text-foreground text-sm font-bold tracking-tight">Playlist Queue</CardTitle>
            <Badge variant="secondary" class="font-mono text-xs">{{ totalCount }} Videos</Badge>
          </div>
          <span class="text-muted-foreground text-xs font-medium">Click any lesson to play</span>
        </div>

        <!-- Search / Filter input -->
        <div class="relative">
          <Search class="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter playlist by title, instructor, or topic..."
            class="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border pr-3 pl-8 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </div>
      </CardHeader>

      <!-- Video Items List -->
      <CardContent class="divide-border/60 divide-y p-0">
        <div
          v-for="video in filteredVideos"
          :key="video.id"
          :class="
            cn(
              'group relative flex cursor-pointer items-center justify-between gap-3 p-3 transition-colors duration-150',
              activeVideoId === video.id
                ? 'border-primary/50 bg-primary/10 ring-primary/20 shadow-xs ring-1'
                : 'hover:bg-muted/40',
            )
          "
          tabindex="0"
          role="button"
          :aria-label="`Play ${video.title}`"
          :aria-current="activeVideoId === video.id ? 'true' : undefined"
          @click="selectVideo(video.id)"
          @keydown.enter="selectVideo(video.id)"
          @keydown.space.prevent="selectVideo(video.id)"
        >
          <!-- Left active highlight bar -->
          <div
            v-if="activeVideoId === video.id"
            class="bg-primary absolute top-2 bottom-2 left-0 w-1 rounded-r shadow-xs"
          />

          <!-- Left Section: Index / Status Indicator + Video Thumbnail -->
          <div class="flex min-w-0 items-center gap-3">
            <!-- Play / Equalizer / Completed Status Icon -->
            <div class="flex size-6 shrink-0 items-center justify-center">
              <!-- If active: Animated Equalizer Sound Bars -->
              <div
                v-if="activeVideoId === video.id"
                class="flex h-3.5 w-3.5 items-end justify-center gap-0.5"
                title="Playing"
              >
                <span class="bg-primary h-3 w-0.5 animate-pulse rounded-full" />
                <span class="bg-primary h-4 w-0.5 animate-pulse rounded-full" style="animation-delay: 150ms" />
                <span class="bg-primary h-2 w-0.5 animate-pulse rounded-full" style="animation-delay: 300ms" />
              </div>

              <!-- If completed: Checkmark -->
              <CheckCircle2
                v-else-if="video.isCompleted"
                class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />

              <!-- If unwatched: Index Number -->
              <span v-else class="text-muted-foreground font-mono text-xs font-semibold tabular-nums">
                {{ video.index.toString().padStart(2, '0') }}
              </span>
            </div>

            <!-- 16:9 Video Thumbnail Preview -->
            <div
              :class="
                cn(
                  'relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 bg-gradient-to-br shadow-xs sm:w-28',
                  video.thumbnailGradient,
                )
              "
            >
              <!-- Center Play Watermark -->
              <div class="absolute inset-0 flex items-center justify-center">
                <PlayCircle
                  :class="
                    cn(
                      'size-5 transition-transform group-hover:scale-110',
                      activeVideoId === video.id ? 'text-primary fill-primary/20' : 'text-zinc-400/80',
                    )
                  "
                />
              </div>

              <!-- Duration Badge (Bottom-Right) -->
              <div
                class="absolute right-1 bottom-1 rounded bg-black/85 px-1 py-0.5 font-mono text-xs font-semibold text-white tabular-nums backdrop-blur-xs"
              >
                {{ video.duration }}
              </div>
            </div>

            <!-- Video Title & Instructor Info -->
            <div class="min-w-0 space-y-0.5">
              <p
                :class="
                  cn(
                    'truncate text-xs font-semibold transition-colors sm:text-sm',
                    activeVideoId === video.id ? 'text-primary font-bold' : 'text-foreground group-hover:text-primary',
                  )
                "
              >
                {{ video.title }}
              </p>
              <p class="text-muted-foreground truncate text-xs">
                <span>{{ video.instructor }}</span>
                <span class="mx-1.5">·</span>
                <span>{{ video.category }}</span>
              </p>
            </div>
          </div>

          <!-- Right Section: Status Badge & Quick Watch Toggle -->
          <div class="flex shrink-0 items-center gap-2">
            <Badge
              v-if="activeVideoId === video.id"
              variant="default"
              class="hidden px-2 py-0.5 text-xs font-semibold sm:inline-flex"
            >
              Playing
            </Badge>
            <Badge
              v-else-if="video.isCompleted"
              variant="outline"
              class="hidden gap-1 px-1.5 py-0.5 text-xs font-medium text-emerald-600 sm:inline-flex dark:text-emerald-400"
            >
              <Check class="size-3" />
              <span>Watched</span>
            </Badge>

            <!-- Toggle complete button -->
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-7 shrink-0"
              :aria-label="video.isCompleted ? 'Mark as unwatched' : 'Mark as watched'"
              @click.stop="toggleComplete(video.id)"
            >
              <CheckCircle2 v-if="video.isCompleted" class="size-4 text-emerald-600 dark:text-emerald-400" />
              <Play v-else-if="activeVideoId === video.id" class="text-primary size-3.5 fill-current" />
              <Check v-else class="text-muted-foreground/60 hover:text-foreground size-3.5" />
            </Button>
          </div>
        </div>

        <div v-if="filteredVideos.length === 0" class="text-muted-foreground p-8 text-center text-xs">
          No lessons match your search criteria.
        </div>
      </CardContent>

      <CardFooter class="border-border/60 bg-muted/20 flex items-center justify-between border-t p-3 text-xs">
        <span class="text-muted-foreground">Mastering Full-Stack UI Engineering</span>
        <span class="text-muted-foreground font-mono font-medium tabular-nums">
          {{ completedCount }}/{{ totalCount }} Completed ({{ progressPercent }}%)
        </span>
      </CardFooter>
    </Card>
  </div>
</template>
