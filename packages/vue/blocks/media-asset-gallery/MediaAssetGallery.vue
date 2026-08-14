<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileCode,
  HardDrive,
  Image as ImageIcon,
  Layers,
  Palette,
  Search,
  Share2,
  Sparkles,
  Tag,
  Upload,
  Video,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface AssetItem {
  id: string
  title: string
  filename: string
  category: 'all' | 'images' | 'vectors' | 'videos' | 'logos'
  type: 'image' | 'vector' | 'video' | 'logo'
  format: string
  aspectRatio: '16:9' | '1:1' | '9:16' | 'vector'
  aspectRatioLabel: string
  resolutionBadge: string
  dimensions: string
  fileSize: string
  uploadedBy: {
    name: string
    role: string
    avatarInitials: string
  }
  uploadDate: string
  license: string
  colorSpace: string
  palette: string[]
  tags: string[]
  previewUrl: string
  downloadOptions: {
    id: string
    label: string
    resolution: string
    size: string
    badge?: string
  }[]
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const ASSETS: AssetItem[] = [
  {
    id: 'dam-01',
    title: 'Hyperion Cloud UI Design System',
    filename: 'hyperion-cloud-design-system-4k.png',
    category: 'images',
    type: 'image',
    format: 'PNG',
    aspectRatio: '16:9',
    aspectRatioLabel: '16:9 Landscape',
    resolutionBadge: '4K',
    dimensions: '3840 × 2160',
    fileSize: '2.4 MB',
    uploadedBy: {
      name: 'Elena Vance',
      role: 'Brand Architecture Lead',
      avatarInitials: 'EV',
    },
    uploadDate: 'Aug 18, 2026',
    license: 'Enterprise Commercial',
    colorSpace: 'Display P3 · 300 DPI',
    palette: ['#0F172A', '#2563EB', '#38BDF8', '#10B981', '#F8FAFC'],
    tags: ['#marketing', '#product-ui'],
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    downloadOptions: [
      { id: 'opt-1', label: 'Original Master (4K)', resolution: '3840 × 2160', size: '2.4 MB', badge: 'Lossless' },
      { id: 'opt-2', label: 'Web Optimized (1080p)', resolution: '1920 × 1080', size: '640 KB', badge: 'Recommended' },
      { id: 'opt-3', label: 'Mobile Thumbnail', resolution: '640 × 360', size: '92 KB' },
    ],
  },
  {
    id: 'dam-02',
    title: 'NeoCorp Brand Identity & Vector Glyphs',
    filename: 'neocorp-brand-vector-glyphs.svg',
    category: 'vectors',
    type: 'vector',
    format: 'SVG',
    aspectRatio: 'vector',
    aspectRatioLabel: 'Raw Vector',
    resolutionBadge: 'Vector',
    dimensions: 'Vector Bezier',
    fileSize: '420 KB',
    uploadedBy: {
      name: 'Marcus Chen',
      role: 'Principal Iconographer',
      avatarInitials: 'MC',
    },
    uploadDate: 'Aug 15, 2026',
    license: 'Internal Brand Core',
    colorSpace: 'sRGB · Vector Paths',
    palette: ['#4F46E5', '#7C3AED', '#EC4899', '#312E81', '#FFFFFF'],
    tags: ['#brand-guidelines', '#marketing'],
    previewUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
    downloadOptions: [
      { id: 'opt-1', label: 'Master SVG Vector', resolution: 'Scalable Bezier', size: '420 KB', badge: 'Source' },
      { id: 'opt-2', label: 'PNG Hi-Res Raster', resolution: '4096 × 4096', size: '1.1 MB' },
      { id: 'opt-3', label: 'PDF Vector Spec', resolution: 'Vector PDF', size: '850 KB' },
    ],
  },
  {
    id: 'dam-03',
    title: 'Solaris OS 2.0 Product Launch Teaser',
    filename: 'solaris-os-launch-teaser-h265.mp4',
    category: 'videos',
    type: 'video',
    format: 'MP4',
    aspectRatio: '16:9',
    aspectRatioLabel: '16:9 Landscape',
    resolutionBadge: '4K',
    dimensions: '3840 × 2160',
    fileSize: '18.6 MB',
    uploadedBy: {
      name: 'Sarah Jenkins',
      role: 'Motion Art Director',
      avatarInitials: 'SJ',
    },
    uploadDate: 'Aug 12, 2026',
    license: 'Global Broadcast Sync',
    colorSpace: 'Rec. 709 · 60 FPS ProRes',
    palette: ['#18181B', '#EA580C', '#F59E0B', '#06B6D4', '#FAFAFA'],
    tags: ['#marketing', '#product-ui'],
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    downloadOptions: [
      {
        id: 'opt-1',
        label: 'Master 4K Video (ProRes)',
        resolution: '3840 × 2160 · 60fps',
        size: '18.6 MB',
        badge: 'Cinema',
      },
      { id: 'opt-2', label: 'Web Stream MP4 (1080p)', resolution: '1920 × 1080 · 30fps', size: '4.8 MB', badge: 'Web' },
      { id: 'opt-3', label: 'Poster Frame Keyframe', resolution: '3840 × 2160 PNG', size: '1.9 MB' },
    ],
  },
  {
    id: 'dam-04',
    title: 'Executive Leadership — Studio Headshot 01',
    filename: 'alex-morgan-executive-portrait.jpg',
    category: 'images',
    type: 'image',
    format: 'JPG',
    aspectRatio: '1:1',
    aspectRatioLabel: '1:1 Square',
    resolutionBadge: '2K',
    dimensions: '2048 × 2048',
    fileSize: '1.8 MB',
    uploadedBy: {
      name: 'David Kim',
      role: 'Staff Photographer',
      avatarInitials: 'DK',
    },
    uploadDate: 'Aug 10, 2026',
    license: 'Press Kit Editorial',
    colorSpace: 'Adobe RGB (1998) · 300 DPI',
    palette: ['#0F172A', '#334155', '#94A3B8', '#0EA5E9', '#F8FAFC'],
    tags: ['#headshots', '#brand-guidelines'],
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80',
    downloadOptions: [
      { id: 'opt-1', label: 'Full Resolution (2K RAW)', resolution: '2048 × 2048', size: '1.8 MB', badge: 'Print' },
      { id: 'opt-2', label: 'Square Avatar Web', resolution: '800 × 800', size: '210 KB', badge: 'Web' },
      { id: 'opt-3', label: 'Compressed WebP', resolution: '400 × 400', size: '45 KB' },
    ],
  },
  {
    id: 'dam-05',
    title: 'Mobile App Onboarding Carousel — Portrait',
    filename: 'mobile-onboarding-mockup-9-16.png',
    category: 'images',
    type: 'image',
    format: 'PNG',
    aspectRatio: '9:16',
    aspectRatioLabel: '9:16 Portrait',
    resolutionBadge: '1080p',
    dimensions: '1080 × 1920',
    fileSize: '1.2 MB',
    uploadedBy: {
      name: 'Aria Rodriguez',
      role: 'Mobile UX Architect',
      avatarInitials: 'AR',
    },
    uploadDate: 'Aug 08, 2026',
    license: 'App Store / Marketing',
    colorSpace: 'Display P3 · 460 PPI',
    palette: ['#09090B', '#7C3AED', '#C026D3', '#38BDF8', '#FFFFFF'],
    tags: ['#product-ui', '#marketing'],
    previewUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80',
    downloadOptions: [
      { id: 'opt-1', label: 'High Density 9:16 PNG', resolution: '1080 × 1920', size: '1.2 MB', badge: 'Retina' },
      { id: 'opt-2', label: 'Standard Mobile Display', resolution: '720 × 1280', size: '420 KB' },
      { id: 'opt-3', label: 'Story Template JPEG', resolution: '1080 × 1920', size: '280 KB' },
    ],
  },
  {
    id: 'dam-06',
    title: 'UIPKGE Monogram & Wordmark Master Kit',
    filename: 'uipkge-monogram-symbol-master.svg',
    category: 'logos',
    type: 'logo',
    format: 'SVG',
    aspectRatio: '1:1',
    aspectRatioLabel: '1:1 Square',
    resolutionBadge: 'Vector',
    dimensions: '1024 × 1024',
    fileSize: '180 KB',
    uploadedBy: {
      name: 'Elena Vance',
      role: 'Brand Architecture Lead',
      avatarInitials: 'EV',
    },
    uploadDate: 'Aug 04, 2026',
    license: 'Master Trademark',
    colorSpace: 'Pantone Solid Coated · Vector',
    palette: ['#000000', '#059669', '#047857', '#34D399', '#FFFFFF'],
    tags: ['#brand-guidelines'],
    previewUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=80',
    downloadOptions: [
      { id: 'opt-1', label: 'SVG Master Vector', resolution: 'Scalable Vector', size: '180 KB', badge: 'Primary' },
      { id: 'opt-2', label: 'Transparent PNG Kit', resolution: '2048 × 2048', size: '340 KB' },
      { id: 'opt-3', label: 'Favicon & App Icon Bundle', resolution: 'Multi-Res .ICO', size: '95 KB' },
    ],
  },
]

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedAspectRatio = ref<string>('all')
const selectedTag = ref<string | null>(null)

const selectedAsset = ref<AssetItem | null>(null)
const isDrawerOpen = ref(false)
const selectedResolutionOption = ref<string>('opt-1')

const notificationToast = ref<string | null>(null)
let toastTimeout: ReturnType<typeof setTimeout> | null = null

function showNotification(msg: string) {
  if (toastTimeout) clearTimeout(toastTimeout)
  notificationToast.value = msg
  toastTimeout = setTimeout(() => {
    notificationToast.value = null
  }, 2800)
}

const copiedColor = ref<string | null>(null)
let colorTimeout: ReturnType<typeof setTimeout> | null = null

function copyHex(color: string) {
  navigator.clipboard?.writeText(color)
  copiedColor.value = color
  showNotification(`Copied color hex ${color} to clipboard`)
  if (colorTimeout) clearTimeout(colorTimeout)
  colorTimeout = setTimeout(() => {
    copiedColor.value = null
  }, 2000)
}

const copiedEmbed = ref(false)
let embedTimeout: ReturnType<typeof setTimeout> | null = null

function copyEmbedSnippet(asset: AssetItem) {
  const code = `<img src="${asset.previewUrl}" alt="${asset.title}" loading="lazy" />`
  navigator.clipboard?.writeText(code)
  copiedEmbed.value = true
  showNotification('Copied HTML embed snippet to clipboard')
  if (embedTimeout) clearTimeout(embedTimeout)
  embedTimeout = setTimeout(() => {
    copiedEmbed.value = false
  }, 2200)
}

function copyAssetLink(asset: AssetItem, event?: MouseEvent) {
  if (event) event.stopPropagation()
  navigator.clipboard?.writeText(`https://cdn.uipkge.dev/assets/${asset.filename}`)
  showNotification(`Link copied for "${asset.title}"`)
}

function triggerInstantDownload(asset: AssetItem, event?: MouseEvent) {
  if (event) event.stopPropagation()
  showNotification(`Downloading ${asset.filename} (${asset.fileSize})...`)
}

function openInspector(asset: AssetItem) {
  selectedAsset.value = asset
  selectedResolutionOption.value = asset.downloadOptions[0]?.id || 'opt-1'
  isDrawerOpen.value = true
}

function toggleTag(tag: string) {
  if (selectedTag.value === tag) {
    selectedTag.value = null
  } else {
    selectedTag.value = tag
  }
}

function resetFilters() {
  selectedTag.value = null
  selectedAspectRatio.value = 'all'
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

const filteredAssets = computed(() => {
  return ASSETS.filter((item) => {
    // Category match
    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value) {
      return false
    }

    // Aspect ratio match
    if (selectedAspectRatio.value !== 'all' && item.aspectRatio !== selectedAspectRatio.value) {
      return false
    }

    // Tag chip match
    if (selectedTag.value && !item.tags.includes(selectedTag.value)) {
      return false
    }

    // Search query match
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim()
      const titleMatch = item.title.toLowerCase().includes(q)
      const fileMatch = item.filename.toLowerCase().includes(q)
      const tagMatch = item.tags.some((t) => t.toLowerCase().includes(q))
      const formatMatch = item.format.toLowerCase().includes(q)
      if (!titleMatch && !fileMatch && !tagMatch && !formatMatch) {
        return false
      }
    }

    return true
  })
})

const aspectFilterOptions = [
  { value: 'all', label: 'All Ratios' },
  { value: '16:9', label: '16:9 Landscape' },
  { value: '1:1', label: '1:1 Square' },
  { value: '9:16', label: '9:16 Portrait' },
  { value: 'vector', label: 'Raw Vector' },
]

const availableTags = ['#marketing', '#product-ui', '#brand-guidelines', '#headshots']
</script>

<template>
  <div data-slot="media-asset-gallery" :class="cn('w-full space-y-6', props.class)">
    <!-- Top Floating Toast Notification -->
    <div
      v-if="notificationToast"
      role="status"
      aria-live="polite"
      class="bg-foreground text-background animate-in fade-in slide-in-from-top-2 fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-medium shadow-lg transition-all"
    >
      <CheckCircle2 class="text-primary size-4 shrink-0" />
      <span>{{ notificationToast }}</span>
    </div>

    <!-- Header Section -->
    <div
      class="bg-card text-card-foreground border-border/80 flex flex-col gap-5 rounded-2xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between lg:p-6"
    >
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="bg-primary/10 text-primary grid size-9 place-items-center rounded-xl">
            <Layers class="size-5" />
          </div>
          <h1 class="text-xl font-bold tracking-tight sm:text-2xl">Digital Asset Management (DAM)</h1>
          <Badge variant="secondary" class="font-mono text-xs"> v2.4 </Badge>
        </div>
        <p class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <HardDrive class="size-3.5" />
          <span class="font-medium">Total Assets:</span>
          <span class="text-foreground font-semibold tabular-nums">1,420 media files · 24.8 GB</span>
          <span class="text-border hidden sm:inline">|</span>
          <span class="text-muted-foreground hidden sm:inline">Cloud Sync Active</span>
          <span class="inline-block size-1.5 rounded-full bg-emerald-500" />
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <!-- Search Input -->
        <div class="relative w-full sm:w-64 lg:w-72">
          <Search
            aria-hidden="true"
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            v-model="searchQuery"
            type="search"
            placeholder="Search assets or tags…"
            class="h-9 pr-8 pl-9 text-xs"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 min-h-6 -translate-y-1/2 text-xs"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <X class="size-3.5" />
          </button>
        </div>

        <!-- Upload Media Button -->
        <Button
          size="sm"
          class="shrink-0 font-medium"
          @click="showNotification('Upload dialog ready: Drop media files to ingest.')"
        >
          <Upload class="size-4" />
          Upload Media
        </Button>
      </div>
    </div>

    <!-- Filter Toolbar -->
    <div class="bg-card text-card-foreground border-border/80 space-y-4 rounded-2xl border p-4 shadow-xs sm:p-5">
      <!-- Category Tabs and Aspect Ratio Filters -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <!-- Type Filter Tabs -->
        <Tabs v-model="selectedCategory" class="w-full lg:w-auto">
          <TabsList class="grid w-full grid-cols-2 gap-1 sm:grid-cols-5 lg:w-auto">
            <TabsTrigger value="all" class="text-xs"> All Assets </TabsTrigger>
            <TabsTrigger value="images" class="text-xs">
              <ImageIcon class="mr-1.5 hidden size-3.5 sm:inline" />
              Images
            </TabsTrigger>
            <TabsTrigger value="vectors" class="text-xs">
              <FileCode class="mr-1.5 hidden size-3.5 sm:inline" />
              Vectors & Icons
            </TabsTrigger>
            <TabsTrigger value="videos" class="text-xs">
              <Video class="mr-1.5 hidden size-3.5 sm:inline" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="logos" class="text-xs">
              <Sparkles class="mr-1.5 hidden size-3.5 sm:inline" />
              Brand Logos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <!-- Aspect Ratio Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span class="text-muted-foreground mr-1 text-xs font-medium">Ratio:</span>
          <button
            v-for="opt in aspectFilterOptions"
            :key="opt.value"
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring min-h-6 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedAspectRatio === opt.value
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            "
            @click="selectedAspectRatio = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <Separator class="bg-border/60" />

      <!-- Tag Chips and Result Meta -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-muted-foreground flex items-center gap-1 text-xs font-medium">
            <Tag class="size-3.5" />
            Tags:
          </span>
          <button
            v-for="tag in availableTags"
            :key="tag"
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring min-h-6 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                selectedTag === tag
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
              )
            "
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
          <button
            v-if="selectedTag || selectedAspectRatio !== 'all' || searchQuery || selectedCategory !== 'all'"
            type="button"
            class="text-muted-foreground hover:text-foreground ml-1 min-h-6 text-xs underline underline-offset-2"
            @click="resetFilters"
          >
            Clear filters
          </button>
        </div>

        <div class="text-muted-foreground text-xs tabular-nums">
          Showing <span class="text-foreground font-semibold">{{ filteredAssets.length }}</span> of
          {{ ASSETS.length }} assets
        </div>
      </div>
    </div>

    <!-- Asset Grid (3-column, responsive) -->
    <div v-if="filteredAssets.length > 0" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="asset in filteredAssets"
        :key="asset.id"
        class="border-border/80 bg-card hover:border-border group relative flex flex-col overflow-hidden rounded-xl border p-0 shadow-xs transition-all duration-200 hover:shadow-md"
        @click="openInspector(asset)"
      >
        <!-- Preview Container with Aspect Ratio Tags and Overlay Actions -->
        <div class="bg-muted/40 relative aspect-video w-full cursor-pointer overflow-hidden">
          <img
            :src="asset.previewUrl"
            :alt="asset.title"
            loading="lazy"
            class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <!-- Gradient Overlay on Hover -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />

          <!-- Top Aspect Ratio & Resolution Badges -->
          <div class="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="secondary"
              class="bg-background/90 text-foreground font-mono text-xs shadow-xs backdrop-blur-xs"
            >
              {{ asset.aspectRatio }}
            </Badge>
            <Badge
              variant="outline"
              class="bg-background/90 text-foreground font-mono text-xs shadow-xs backdrop-blur-xs"
            >
              {{ asset.resolutionBadge }}
            </Badge>
          </div>

          <!-- Top Right Format Pill -->
          <div class="absolute top-2.5 right-2.5">
            <Badge class="bg-primary/95 text-primary-foreground font-mono text-xs shadow-xs">
              {{ asset.format }}
            </Badge>
          </div>

          <!-- Bottom Hover Overlay Actions -->
          <div
            class="absolute right-2.5 bottom-2.5 left-2.5 flex items-center justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            <div class="flex items-center gap-1 text-xs font-medium text-white drop-shadow-xs">
              <Eye class="size-3.5" />
              <span>Inspect</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="icon-xs"
                class="size-7 bg-white/90 text-zinc-900 shadow-xs hover:bg-white"
                title="Copy asset link"
                aria-label="Copy asset link"
                @click="(e: MouseEvent) => copyAssetLink(asset, e)"
              >
                <Copy class="size-3.5" />
              </Button>
              <Button
                variant="default"
                size="icon-xs"
                class="size-7 shadow-xs"
                title="Instant download"
                aria-label="Instant download"
                @click="(e: MouseEvent) => triggerInstantDownload(asset, e)"
              >
                <ArrowDownToLine class="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Asset Card Content -->
        <CardContent class="flex flex-1 flex-col justify-between gap-3 p-4">
          <div class="space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <h2 class="group-hover:text-primary line-clamp-1 text-sm font-semibold tracking-tight transition-colors">
                {{ asset.title }}
              </h2>
            </div>
            <p class="text-muted-foreground truncate font-mono text-xs">
              {{ asset.filename }}
            </p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="t in asset.tags"
              :key="t"
              class="bg-muted/70 text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium"
            >
              {{ t }}
            </span>
          </div>

          <!-- Metadata Footer Row -->
          <div class="border-border/60 flex items-center justify-between border-t pt-3 text-xs">
            <span class="text-muted-foreground font-mono tabular-nums">
              {{ asset.dimensions }}
            </span>
            <span class="text-foreground font-semibold tabular-nums"> {{ asset.fileSize }} · {{ asset.format }} </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-card text-card-foreground border-border/80 flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-xs"
    >
      <div class="bg-muted/70 text-muted-foreground mb-3 grid size-12 place-items-center rounded-xl">
        <Search class="size-6" />
      </div>
      <h2 class="text-base font-semibold">No assets found</h2>
      <p class="text-muted-foreground mt-1 max-w-sm text-xs">
        No media assets match your active category, aspect ratio, or search query. Try clearing filters to view all
        assets.
      </p>
      <Button variant="outline" size="sm" class="mt-2 text-xs" @click="resetFilters"> Clear All Filters </Button>
    </div>

    <!-- Asset Detail Inspector Drawer (Sheet) -->
    <Sheet v-model:open="isDrawerOpen">
      <SheetContent
        side="right"
        class="border-border bg-card text-card-foreground w-full space-y-6 overflow-y-auto p-6 sm:max-w-md lg:max-w-lg"
      >
        <div v-if="selectedAsset" class="space-y-6">
          <!-- Drawer Header -->
          <SheetHeader class="space-y-1 text-left">
            <div class="flex items-center gap-2">
              <Badge class="bg-primary/95 text-primary-foreground font-mono text-xs">
                {{ selectedAsset.format }}
              </Badge>
              <Badge variant="outline" class="font-mono text-xs">
                {{ selectedAsset.aspectRatioLabel }}
              </Badge>
              <Badge variant="secondary" class="font-mono text-xs">
                {{ selectedAsset.resolutionBadge }}
              </Badge>
            </div>
            <SheetTitle class="text-lg font-bold tracking-tight">
              {{ selectedAsset.title }}
            </SheetTitle>
            <SheetDescription class="text-muted-foreground truncate font-mono text-xs">
              {{ selectedAsset.filename }}
            </SheetDescription>
          </SheetHeader>

          <!-- Full Media Preview with Actions -->
          <div class="border-border/80 bg-muted/40 relative overflow-hidden rounded-xl border">
            <img :src="selectedAsset.previewUrl" :alt="selectedAsset.title" class="aspect-video w-full object-cover" />
            <div
              class="bg-card/90 border-border/80 absolute right-2 bottom-2 flex items-center gap-1 rounded-lg border p-1 backdrop-blur-xs"
            >
              <Button
                variant="ghost"
                size="icon-xs"
                class="size-6 text-xs"
                title="Copy Direct URL"
                @click="copyAssetLink(selectedAsset)"
              >
                <Copy class="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                class="size-6 text-xs"
                title="Open preview in new tab"
                as="a"
                :href="selectedAsset.previewUrl"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink class="size-3" />
              </Button>
            </div>
          </div>

          <!-- Color Palette Swatches -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-foreground flex items-center gap-1.5 font-semibold">
                <Palette class="text-primary size-3.5" />
                Color Palette Swatches
              </span>
              <span class="text-muted-foreground text-xs">Click swatch to copy HEX</span>
            </div>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="color in selectedAsset.palette"
                :key="color"
                type="button"
                class="group/color border-border/60 hover:border-primary focus-visible:ring-ring flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-all focus-visible:ring-2 focus-visible:outline-none"
                @click="copyHex(color)"
              >
                <span
                  class="size-7 rounded-md border border-black/10 shadow-inner transition-transform group-hover/color:scale-110"
                  :style="{ backgroundColor: color }"
                />
                <span class="text-muted-foreground group-hover/color:text-foreground font-mono text-xs uppercase">
                  {{ color }}
                </span>
              </button>
            </div>
          </div>

          <Separator class="bg-border/60" />

          <!-- Metadata Breakdown Grid -->
          <div class="space-y-3">
            <h3 class="text-foreground text-xs font-semibold tracking-wider uppercase">Asset Metadata</h3>
            <div class="bg-muted/40 border-border/60 grid grid-cols-2 gap-3 rounded-xl border p-3.5 text-xs">
              <div>
                <span class="text-muted-foreground block text-xs">Dimensions</span>
                <span class="text-foreground font-mono font-medium tabular-nums">{{ selectedAsset.dimensions }}</span>
              </div>
              <div>
                <span class="text-muted-foreground block text-xs">File Size</span>
                <span class="text-foreground font-semibold tabular-nums">{{ selectedAsset.fileSize }}</span>
              </div>
              <div>
                <span class="text-muted-foreground block text-xs">Color Space</span>
                <span class="text-foreground font-medium">{{ selectedAsset.colorSpace }}</span>
              </div>
              <div>
                <span class="text-muted-foreground block text-xs">License</span>
                <span class="text-foreground font-medium">{{ selectedAsset.license }}</span>
              </div>
              <div>
                <span class="text-muted-foreground block text-xs">Uploaded By</span>
                <div class="mt-0.5 flex items-center gap-1.5">
                  <span
                    class="bg-primary/10 text-primary grid size-4.5 place-items-center rounded-full text-xs font-semibold"
                  >
                    {{ selectedAsset.uploadedBy.avatarInitials }}
                  </span>
                  <span class="text-foreground font-medium">{{ selectedAsset.uploadedBy.name }}</span>
                </div>
              </div>
              <div>
                <span class="text-muted-foreground block text-xs">Upload Date</span>
                <span class="text-foreground font-medium tabular-nums">{{ selectedAsset.uploadDate }}</span>
              </div>
            </div>
          </div>

          <!-- Resolution Download Choices -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-foreground text-xs font-semibold tracking-wider uppercase">Download Resolution</h3>
              <span class="text-muted-foreground font-mono text-xs">Format: {{ selectedAsset.format }}</span>
            </div>

            <div class="space-y-2">
              <button
                v-for="opt in selectedAsset.downloadOptions"
                :key="opt.id"
                type="button"
                :class="
                  cn(
                    'focus-visible:ring-ring flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    selectedResolutionOption === opt.id
                      ? 'border-primary bg-primary/5 text-foreground shadow-xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-muted-foreground',
                  )
                "
                @click="selectedResolutionOption = opt.id"
              >
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-xs font-semibold">{{ opt.label }}</span>
                    <Badge v-if="opt.badge" variant="secondary" class="px-1.5 py-0 text-xs font-normal">
                      {{ opt.badge }}
                    </Badge>
                  </div>
                  <span class="text-muted-foreground font-mono text-xs tabular-nums">
                    {{ opt.resolution }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-foreground text-xs font-semibold tabular-nums">{{ opt.size }}</span>
                  <span
                    :class="
                      cn(
                        'flex size-4 items-center justify-center rounded-full border',
                        selectedResolutionOption === opt.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border',
                      )
                    "
                  >
                    <Check v-if="selectedResolutionOption === opt.id" class="size-2.5" />
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Embed Code Copy -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-foreground flex items-center gap-1.5 font-semibold">
                <Code2 class="text-primary size-3.5" />
                HTML CDN Embed Snippet
              </span>
              <button
                type="button"
                class="text-primary flex min-h-6 items-center gap-1 text-xs font-medium hover:underline"
                @click="copyEmbedSnippet(selectedAsset)"
              >
                <Copy class="size-3" />
                <span>{{ copiedEmbed ? 'Copied!' : 'Copy Code' }}</span>
              </button>
            </div>
            <div
              class="bg-muted/60 border-border/80 text-muted-foreground overflow-x-auto rounded-xl border p-2.5 font-mono text-xs"
            >
              &lt;img src="{{ selectedAsset.previewUrl }}" alt="{{ selectedAsset.title }}" loading="lazy" /&gt;
            </div>
          </div>

          <!-- Sheet Footer Actions -->
          <SheetFooter class="border-border/80 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
            <SheetClose as-child>
              <Button variant="outline" size="sm" class="text-xs font-medium"> Close </Button>
            </SheetClose>
            <Button variant="outline" size="sm" class="text-xs font-medium" @click="copyAssetLink(selectedAsset)">
              <Share2 class="size-3.5" />
              Share Link
            </Button>
            <Button
              aria-label="Download attachment"
              size="sm"
              class="text-xs font-medium"
              @click="triggerInstantDownload(selectedAsset)"
            >
              <ArrowDownToLine class="size-3.5" />
              Download Asset
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
