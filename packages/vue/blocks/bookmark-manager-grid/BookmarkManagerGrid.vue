<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Layers,
  Palette,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Type,
  X,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export interface BookmarkItem {
  id: string
  title: string
  url: string
  domain: string
  faviconUrl: string
  previewImage: string
  excerpt: string
  collection: 'design-systems' | 'web-perf' | 'typography' | 'ai-tools' | 'security'
  tags: string[]
  isFavorite: boolean
  savedAt: string
}

export interface CollectionMeta {
  id: string
  name: string
  count: number
  iconName: 'bookmark' | 'palette' | 'zap' | 'type' | 'sparkles' | 'shield' | 'star'
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'bm-01',
    title: 'OKLCH Color Picker & Converter',
    url: 'https://oklch.com',
    domain: 'oklch.com',
    faviconUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=64&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    excerpt:
      'Interactive color space playground with gamut-mapping, APCA contrast ratios, and direct CSS/Tailwind OKLCH code generation.',
    collection: 'design-systems',
    tags: ['#oklch', '#tailwind', '#design-systems'],
    isFavorite: true,
    savedAt: 'Aug 18, 2026',
  },
  {
    id: 'bm-02',
    title: 'Reka UI Headless Vue Primitives',
    url: 'https://reka-ui.com',
    domain: 'reka-ui.com',
    faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    excerpt:
      'Accessible, completely unstyled UI component primitives for Vue 3 with WAI-ARIA compliant keyboard focus and composite slots.',
    collection: 'design-systems',
    tags: ['#reka-ui', '#vue', '#design-systems'],
    isFavorite: true,
    savedAt: 'Aug 15, 2026',
  },
  {
    id: 'bm-03',
    title: 'Web Vitals Performance Playbook',
    url: 'https://web.dev/vitals',
    domain: 'web.dev',
    faviconUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=64&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    excerpt:
      'Diagnostic field guides for optimizing Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and layout stability.',
    collection: 'web-perf',
    tags: ['#web-vitals', '#web-perf', '#astro'],
    isFavorite: false,
    savedAt: 'Aug 12, 2026',
  },
  {
    id: 'bm-04',
    title: 'Typewolf Font Trends & Pairings',
    url: 'https://typewolf.com',
    domain: 'typewolf.com',
    faviconUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=64&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=800&auto=format&fit=crop&q=80',
    excerpt:
      'The definitive guide to web typography, font pairings, lookbooks, variable font loading strategies, and typographic hierarchy.',
    collection: 'typography',
    tags: ['#typography', '#design-systems', '#react'],
    isFavorite: true,
    savedAt: 'Aug 09, 2026',
  },
  {
    id: 'bm-05',
    title: 'Vercel AI SDK 3.0 Documentation',
    url: 'https://sdk.vercel.ai/docs',
    domain: 'sdk.vercel.ai',
    faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    excerpt:
      'Universal TypeScript library for streaming chat completions, structured JSON generation, tool calling, and multi-model routing.',
    collection: 'ai-tools',
    tags: ['#ai-prompt', '#react', '#astro'],
    isFavorite: false,
    savedAt: 'Aug 06, 2026',
  },
  {
    id: 'bm-06',
    title: 'OWASP API Security Top 10 Guide',
    url: 'https://owasp.org/API-Security',
    domain: 'owasp.org',
    faviconUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=64&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    excerpt:
      'Crucial security vectors for modern APIs including broken object authorization, rate limiting flaws, and JWT key hygiene.',
    collection: 'security',
    tags: ['#security', '#web-perf'],
    isFavorite: false,
    savedAt: 'Aug 03, 2026',
  },
]

const COLLECTIONS: CollectionMeta[] = [
  { id: 'all', name: 'All Bookmarks', count: 142, iconName: 'bookmark' },
  { id: 'design-systems', name: 'Design Systems', count: 28, iconName: 'palette' },
  { id: 'web-perf', name: 'Web Performance', count: 19, iconName: 'zap' },
  { id: 'typography', name: 'Typography & Fonts', count: 14, iconName: 'type' },
  { id: 'ai-tools', name: 'AI & LLM Tools', count: 35, iconName: 'sparkles' },
  { id: 'security', name: 'Security & Auth', count: 22, iconName: 'shield' },
  { id: 'favorites', name: 'Favorites ★', count: 18, iconName: 'star' },
]

const TAG_CLOUD = [
  '#reka-ui',
  '#tailwind',
  '#oklch',
  '#astro',
  '#react',
  '#vue',
  '#typography',
  '#web-vitals',
  '#security',
  '#ai-prompt',
]

const bookmarks = ref<BookmarkItem[]>([...INITIAL_BOOKMARKS])
const searchQuery = ref('')
const selectedCollection = ref('all')
const selectedTag = ref<string | null>(null)

// Add Bookmark Modal state
const isAddModalOpen = ref(false)
const formUrl = ref('')
const formTitle = ref('')
const formDomain = ref('')
const formExcerpt = ref('')
const formCollection = ref<'design-systems' | 'web-perf' | 'typography' | 'ai-tools' | 'security'>('design-systems')
const formTags = ref('')
const formPreview = ref('')

// Toast Notification
const notificationToast = ref<string | null>(null)
let toastTimeout: ReturnType<typeof setTimeout> | null = null

function showNotification(msg: string) {
  if (toastTimeout) clearTimeout(toastTimeout)
  notificationToast.value = msg
  toastTimeout = setTimeout(() => {
    notificationToast.value = null
  }, 2800)
}

// Copy URL feedback
const copiedId = ref<string | null>(null)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

function copyUrl(item: BookmarkItem, event?: MouseEvent) {
  if (event) event.stopPropagation()
  navigator.clipboard?.writeText(item.url)
  copiedId.value = item.id
  showNotification(`Copied link to clipboard: ${item.domain}`)
  if (copyTimeout) clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

// Toggle Favorite status
function toggleFavorite(item: BookmarkItem, event?: MouseEvent) {
  if (event) event.stopPropagation()
  item.isFavorite = !item.isFavorite
  if (item.isFavorite) {
    showNotification(`Starred "${item.title}"`)
  } else {
    showNotification(`Removed "${item.title}" from favorites`)
  }
}

// Toggle Tag Filter
function toggleTag(tag: string) {
  if (selectedTag.value === tag) {
    selectedTag.value = null
  } else {
    selectedTag.value = tag
  }
}

// Reset all active filters
function resetFilters() {
  searchQuery.value = ''
  selectedCollection.value = 'all'
  selectedTag.value = null
}

function setPresetUrl(url: string) {
  formUrl.value = url
  autoFetchMetadata()
}

// Auto-fetch / simulate metadata fetching for Add Bookmark modal
function autoFetchMetadata() {
  const url = formUrl.value.trim()
  if (!url) {
    showNotification('Please enter a URL first')
    return
  }

  let extractedDomain = ''
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    extractedDomain = parsed.hostname.replace(/^www\./, '')
  } catch {
    extractedDomain = 'developer.mozilla.org'
  }

  formDomain.value = extractedDomain

  if (url.includes('github') || extractedDomain.includes('github')) {
    formTitle.value = 'GitHub Engineering Architecture Guides'
    formExcerpt.value = 'In-depth architectural post-mortems, system scaling principles, and resilient CI/CD pipelines.'
    formCollection.value = 'web-perf'
    formTags.value = '#web-perf, #security'
    formPreview.value = 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80'
  } else if (url.includes('astro') || extractedDomain.includes('astro')) {
    formTitle.value = 'Astro 4.0 Server Islands & SSG Docs'
    formExcerpt.value =
      'Zero-JS by default frontend framework combining island architecture with fast static HTML builds.'
    formCollection.value = 'design-systems'
    formTags.value = '#astro, #react, #vue'
    formPreview.value = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
  } else if (url.includes('linear') || extractedDomain.includes('linear')) {
    formTitle.value = 'Linear Method — Principles for Modern Software'
    formExcerpt.value =
      'Practices and philosophies for high-craft product execution, issue triage, and keyboard-first UI.'
    formCollection.value = 'design-systems'
    formTags.value = '#design-systems, #tailwind'
    formPreview.value = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  } else {
    formTitle.value = formTitle.value || `${extractedDomain.toUpperCase()} — Resource Guide`
    formExcerpt.value =
      formExcerpt.value || 'Curated documentation and developer tooling reference for modern engineering workflows.'
    formTags.value = formTags.value || '#oklch, #tailwind'
    formPreview.value =
      formPreview.value ||
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  }

  showNotification(`Fetched metadata from ${extractedDomain}`)
}

function handleSaveBookmark() {
  if (!formUrl.value.trim()) {
    showNotification('Please enter a valid URL')
    return
  }

  const finalTitle = formTitle.value.trim() || formDomain.value.trim() || 'Untitled Bookmark'
  let cleanDomain = formDomain.value.trim()
  if (!cleanDomain) {
    try {
      const parsed = new URL(formUrl.value.startsWith('http') ? formUrl.value : `https://${formUrl.value}`)
      cleanDomain = parsed.hostname.replace(/^www\./, '')
    } catch {
      cleanDomain = 'web.dev'
    }
  }

  const tagList = formTags.value
    ? formTags.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith('#') ? t : `#${t}`))
    : ['#design-systems']

  const newBookmark: BookmarkItem = {
    id: `bm-${Date.now()}`,
    title: finalTitle,
    url: formUrl.value.startsWith('http') ? formUrl.value : `https://${formUrl.value}`,
    domain: cleanDomain,
    faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80',
    previewImage:
      formPreview.value ||
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    excerpt: formExcerpt.value.trim() || 'Developer documentation, components, and reference guides.',
    collection: formCollection.value,
    tags: tagList,
    isFavorite: false,
    savedAt: 'Just now',
  }

  bookmarks.value.unshift(newBookmark)
  isAddModalOpen.value = false

  // Reset form
  formUrl.value = ''
  formTitle.value = ''
  formDomain.value = ''
  formExcerpt.value = ''
  formTags.value = ''
  formPreview.value = ''

  showNotification(`Saved "${finalTitle}" to bookmarks!`)
}

// Filtered bookmarks computed pipeline
const filteredBookmarks = computed(() => {
  return bookmarks.value.filter((item) => {
    // Collection match
    if (selectedCollection.value === 'favorites') {
      if (!item.isFavorite) return false
    } else if (selectedCollection.value !== 'all') {
      if (item.collection !== selectedCollection.value) return false
    }

    // Tag match
    if (selectedTag.value && !item.tags.includes(selectedTag.value)) {
      return false
    }

    // Search query match
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim()
      const titleMatch = item.title.toLowerCase().includes(q)
      const domainMatch = item.domain.toLowerCase().includes(q)
      const excerptMatch = item.excerpt.toLowerCase().includes(q)
      const urlMatch = item.url.toLowerCase().includes(q)
      const tagMatch = item.tags.some((t) => t.toLowerCase().includes(q))
      if (!titleMatch && !domainMatch && !excerptMatch && !urlMatch && !tagMatch) {
        return false
      }
    }

    return true
  })
})

const activeCollectionMeta = computed(() => {
  return COLLECTIONS.find((c) => c.id === selectedCollection.value) || COLLECTIONS[0]
})
</script>

<template>
  <div data-slot="bookmark-manager-grid" :class="cn('w-full space-y-6', props.class)">
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
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="bg-primary/10 text-primary grid size-9 place-items-center rounded-xl shadow-xs">
            <Bookmark class="size-5" />
          </div>
          <h1 class="text-xl font-bold tracking-tight sm:text-2xl">Bookmarks & Engineering Resources</h1>
          <Badge variant="secondary" class="font-mono text-xs"> v2.1 </Badge>
        </div>
        <p class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <Layers class="size-3.5" />
          <span class="text-foreground font-medium">142 bookmarks · 8 collections</span>
          <span class="text-border hidden sm:inline">|</span>
          <span class="text-muted-foreground hidden sm:inline">Raindrop Sync Active</span>
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
            placeholder="Search bookmarks, domains, tags…"
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

        <!-- Add Bookmark Button -->
        <Button size="sm" class="shrink-0 font-medium" @click="isAddModalOpen = true">
          <Plus class="size-4" />
          Add Bookmark
        </Button>
      </div>
    </div>

    <!-- Mobile Horizontal Collections Bar (Visible on mobile/tablet) -->
    <div
      class="bg-card text-card-foreground border-border/80 flex items-center gap-1.5 overflow-x-auto rounded-xl border p-2 shadow-xs lg:hidden"
    >
      <button
        v-for="col in COLLECTIONS"
        :key="col.id"
        type="button"
        :class="
          cn(
            'focus-visible:ring-ring flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none',
            selectedCollection === col.id
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
          )
        "
        @click="selectedCollection = col.id"
      >
        <span>{{ col.name }}</span>
        <span
          :class="
            cn(
              'py-0.2 rounded-full px-1.5 font-mono text-xs tabular-nums',
              selectedCollection === col.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-background/80 text-muted-foreground',
            )
          "
        >
          {{ col.count }}
        </span>
      </button>
    </div>

    <!-- 2-Column Main Layout (Left: Sidebar w-60; Right: Grid) -->
    <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
      <!-- Left Collections Sidebar -->
      <aside class="hidden w-60 shrink-0 space-y-6 lg:block" aria-label="Collections and Tags">
        <!-- Collections List Card -->
        <div class="bg-card text-card-foreground border-border/80 space-y-3 rounded-2xl border p-4 shadow-xs">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-foreground text-xs font-semibold tracking-wider uppercase">Collections</h2>
            <span class="text-muted-foreground font-mono text-xs tabular-nums">8 folders</span>
          </div>

          <nav class="space-y-1" aria-label="Collection folders">
            <button
              v-for="col in COLLECTIONS"
              :key="col.id"
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedCollection === col.id
                    ? 'bg-primary/10 text-primary border-primary/20 border font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-transparent',
                )
              "
              @click="selectedCollection = col.id"
            >
              <div class="flex items-center gap-2.5 truncate">
                <Bookmark v-if="col.iconName === 'bookmark'" class="size-4 shrink-0" />
                <Palette v-else-if="col.iconName === 'palette'" class="size-4 shrink-0 text-violet-500" />
                <Zap v-else-if="col.iconName === 'zap'" class="size-4 shrink-0 text-amber-500" />
                <Type v-else-if="col.iconName === 'type'" class="size-4 shrink-0 text-blue-500" />
                <Sparkles v-else-if="col.iconName === 'sparkles'" class="size-4 shrink-0 text-emerald-500" />
                <ShieldCheck v-else-if="col.iconName === 'shield'" class="size-4 shrink-0 text-rose-500" />
                <Star v-else-if="col.iconName === 'star'" class="size-4 shrink-0 fill-amber-400 text-amber-500" />
                <span class="truncate">{{ col.name }}</span>
              </div>
              <span
                :class="
                  cn(
                    'rounded-md px-1.5 py-0.5 font-mono text-xs tabular-nums',
                    selectedCollection === col.id
                      ? 'bg-primary/20 text-primary font-bold'
                      : 'bg-muted/60 text-muted-foreground',
                  )
                "
              >
                {{ col.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tags Cloud Card -->
        <div class="bg-card text-card-foreground border-border/80 space-y-3 rounded-2xl border p-4 shadow-xs">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <Tag class="text-primary size-3.5" />
              Tag Cloud
            </h2>
            <button
              v-if="selectedTag"
              type="button"
              class="text-primary min-h-6 text-xs hover:underline"
              @click="selectedTag = null"
            >
              Reset
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in TAG_CLOUD"
              :key="tag"
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring min-h-6 rounded-md border px-2 py-0.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedTag === tag
                    ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                )
              "
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Quick Storage Vault Info Box -->
        <div class="bg-muted/40 border-border/70 text-card-foreground space-y-2 rounded-2xl border p-4 text-xs">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary grid size-6 place-items-center rounded-md">
              <Globe class="size-3.5" />
            </div>
            <span class="text-foreground font-semibold">Raindrop Cloud Vault</span>
          </div>
          <p class="text-muted-foreground text-xs leading-relaxed">
            Encrypted cross-device bookmark vault with automated favicon caching and full-text metadata indexing.
          </p>
        </div>
      </aside>

      <!-- Right Bookmarks Main Area -->
      <main class="min-w-0 flex-1 space-y-4">
        <!-- Result Bar & Filter Indicators -->
        <div
          class="bg-card text-card-foreground border-border/80 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-xs"
        >
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="text-muted-foreground">Collection:</span>
            <Badge variant="outline" class="border-primary/40 bg-primary/5 text-primary text-xs font-medium">
              {{ activeCollectionMeta.name }}
            </Badge>

            <template v-if="selectedTag">
              <span class="text-muted-foreground ml-1">Tag:</span>
              <Badge variant="secondary" class="text-xs font-medium">
                {{ selectedTag }}
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground ml-1 inline-flex items-center"
                  aria-label="Remove tag filter"
                  @click="selectedTag = null"
                >
                  <X class="size-3" />
                </button>
              </Badge>
            </template>

            <template v-if="searchQuery">
              <span class="text-muted-foreground ml-1">Query:</span>
              <span class="text-foreground font-mono font-medium">&ldquo;{{ searchQuery }}&rdquo;</span>
            </template>

            <button
              v-if="selectedCollection !== 'all' || selectedTag || searchQuery"
              type="button"
              class="text-muted-foreground hover:text-foreground ml-2 min-h-6 text-xs underline underline-offset-2"
              @click="resetFilters"
            >
              Clear filters
            </button>
          </div>

          <div class="text-muted-foreground text-xs tabular-nums">
            Showing <span class="text-foreground font-semibold">{{ filteredBookmarks.length }}</span> of
            {{ bookmarks.length }} items
          </div>
        </div>

        <!-- Bookmarks Grid (2 or 3-column responsive) -->
        <div v-if="filteredBookmarks.length > 0" class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card
            v-for="item in filteredBookmarks"
            :key="item.id"
            class="group border-border/80 bg-card hover:border-border relative flex flex-col overflow-hidden rounded-xl border p-0 shadow-xs transition-all duration-200 hover:shadow-md"
          >
            <!-- Thumbnail Visual Preview -->
            <div class="bg-muted/40 border-border/60 relative aspect-[16/10] w-full overflow-hidden border-b">
              <img
                :src="item.previewImage"
                :alt="item.title"
                loading="lazy"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <!-- Gradient overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 transition-opacity group-hover:opacity-60"
              />

              <!-- Domain Badge Top Left -->
              <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <div
                  class="bg-background/90 text-foreground flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium shadow-xs backdrop-blur-xs"
                >
                  <Globe class="text-muted-foreground size-3" />
                  <span class="font-mono text-xs">{{ item.domain }}</span>
                </div>
              </div>

              <!-- Favorite Toggle Star Button Top Right -->
              <button
                type="button"
                :class="
                  cn(
                    'bg-background/90 focus-visible:ring-ring absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full shadow-xs backdrop-blur-xs transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none',
                    item.isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500',
                  )
                "
                :title="item.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
                :aria-label="item.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
                @click="(e: MouseEvent) => toggleFavorite(item, e)"
              >
                <Star :class="cn('size-4', item.isFavorite ? 'fill-amber-400 text-amber-500' : '')" />
              </button>
            </div>

            <!-- Card Content Body -->
            <CardContent class="flex flex-1 flex-col justify-between gap-3 p-4">
              <div class="space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="group-hover:text-primary line-clamp-1 min-h-6 py-0.5 text-sm font-semibold tracking-tight transition-colors hover:underline"
                  >
                    {{ item.title }}
                  </a>
                </div>

                <p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {{ item.excerpt }}
                </p>
              </div>

              <!-- Tag Pills -->
              <div class="flex flex-wrap items-center gap-1.5">
                <button
                  v-for="t in item.tags"
                  :key="t"
                  type="button"
                  :class="
                    cn(
                      'min-h-6 rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
                      selectedTag === t
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  "
                  @click="toggleTag(t)"
                >
                  {{ t }}
                </button>
              </div>

              <!-- Card Footer Actions Row -->
              <div class="border-border/60 flex items-center justify-between border-t pt-3 text-xs">
                <span class="text-muted-foreground font-mono text-xs tabular-nums">
                  {{ item.savedAt }}
                </span>

                <div class="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon-xs"
                    class="size-7"
                    :title="copiedId === item.id ? 'Copied URL!' : 'Copy URL'"
                    :aria-label="copiedId === item.id ? 'Copied URL' : 'Copy URL'"
                    @click="(e: MouseEvent) => copyUrl(item, e)"
                  >
                    <Check v-if="copiedId === item.id" class="text-primary size-3.5" />
                    <Copy v-else class="size-3.5" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    class="h-7 gap-1 px-2.5 text-xs font-medium"
                    as="a"
                    :href="item.url"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>Open</span>
                    <ExternalLink class="size-3" />
                  </Button>
                </div>
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
            <BookOpen class="size-6" />
          </div>
          <h2 class="text-base font-semibold">No bookmarks found</h2>
          <p class="text-muted-foreground mt-1 max-w-sm text-xs">
            No engineering resources match your active collection, tag filter, or search query. Try clearing filters or
            add a new bookmark.
          </p>
          <div class="mt-4 flex items-center gap-2">
            <Button variant="outline" size="sm" class="text-xs" @click="resetFilters"> Clear All Filters </Button>
            <Button size="sm" class="text-xs" @click="isAddModalOpen = true">
              <Plus class="size-3.5" />
              Add Bookmark
            </Button>
          </div>
        </div>
      </main>
    </div>

    <!-- Add Bookmark Modal Dialog -->
    <Dialog v-model:open="isAddModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader class="text-left">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary grid size-7 place-items-center rounded-lg">
              <Bookmark class="size-4" />
            </div>
            <DialogTitle class="text-base font-bold">Add New Bookmark</DialogTitle>
          </div>
          <DialogDescription class="text-xs">
            Save a web resource or engineering tool with automated metadata fetching.
          </DialogDescription>
        </DialogHeader>

        <form class="space-y-4 pt-1" @submit.prevent="handleSaveBookmark">
          <!-- URL Input with Auto-Fetch Button -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Website URL</label>
            <div class="flex items-center gap-2">
              <Input
                v-model="formUrl"
                type="url"
                placeholder="https://astro.build or https://linear.app"
                class="h-9 text-xs"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="h-9 shrink-0 gap-1 text-xs font-medium"
                title="Fetch metadata from URL"
                @click="autoFetchMetadata"
              >
                <Sparkles class="text-primary size-3.5" />
                <span>Fetch</span>
              </Button>
            </div>
          </div>

          <!-- Quick Samples Preset Bar -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-muted-foreground text-xs">Try sample:</span>
            <button
              type="button"
              class="border-border bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 rounded-md border px-2 py-0.5 text-xs transition-colors"
              @click="setPresetUrl('https://astro.build')"
            >
              Astro SSG
            </button>
            <button
              type="button"
              class="border-border bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 rounded-md border px-2 py-0.5 text-xs transition-colors"
              @click="setPresetUrl('https://linear.app/method')"
            >
              Linear Method
            </button>
            <button
              type="button"
              class="border-border bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 rounded-md border px-2 py-0.5 text-xs transition-colors"
              @click="setPresetUrl('https://github.com/features')"
            >
              GitHub Guides
            </button>
          </div>

          <Separator class="bg-border/60" />

          <!-- Title Input -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Bookmark Title</label>
            <Input
              v-model="formTitle"
              type="text"
              placeholder="e.g. Astro 4.0 Server Islands & SSG Docs"
              class="h-9 text-xs"
              required
            />
          </div>

          <!-- Excerpt Description -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Excerpt & Notes</label>
            <Input
              v-model="formExcerpt"
              type="text"
              placeholder="Brief description or takeaway notes…"
              class="h-9 text-xs"
            />
          </div>

          <!-- Collection Selector -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Collection Folder</label>
            <Select v-model="formCollection">
              <SelectTrigger class="h-9 text-xs">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design-systems">Design Systems</SelectItem>
                <SelectItem value="web-perf">Web Performance</SelectItem>
                <SelectItem value="typography">Typography & Fonts</SelectItem>
                <SelectItem value="ai-tools">AI & LLM Tools</SelectItem>
                <SelectItem value="security">Security & Auth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Tags Input -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Tags (comma separated)</label>
            <Input v-model="formTags" type="text" placeholder="#astro, #vue, #web-perf" class="h-9 text-xs" />
          </div>

          <!-- Dialog Footer Buttons -->
          <DialogFooter class="gap-2 pt-2 sm:gap-0">
            <DialogClose as-child>
              <Button type="button" variant="outline" size="sm" class="text-xs"> Cancel </Button>
            </DialogClose>
            <Button type="submit" size="sm" class="text-xs font-medium">
              <Plus class="size-3.5" />
              Save Bookmark
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
