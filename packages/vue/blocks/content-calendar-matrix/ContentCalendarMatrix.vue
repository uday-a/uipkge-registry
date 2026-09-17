<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  Calendar,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Mail,
  MoreHorizontal,
  Pencil,
  PenLine,
  Plus,
  Search,
  Share2,
  Trash2,
  UserCheck,
  Video,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type ContentChannel = 'all' | 'blog' | 'newsletter' | 'youtube' | 'social'
export type ContentStatus = 'published' | 'scheduled' | 'in_review' | 'draft'

export interface ContentItem {
  id: string
  title: string
  channel: 'blog' | 'newsletter' | 'youtube' | 'social'
  channelLabel: string
  publishDate: string
  publishTime: string
  author: {
    name: string
    role: string
    avatar: string
  }
  status: ContentStatus
  statusLabel: string
  keywords: string[]
  format: string
}

interface Props {
  title?: string
  subtitle?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Editorial Content Calendar',
  subtitle: 'Schedule, organize, and track cross-channel editorial pipelines and publishing milestones.',
})

const selectedMonth = ref('2026-09')
const selectedChannel = ref<ContentChannel>('all')
const searchQuery = ref('')

const pacingKpis = [
  {
    id: 'planned',
    title: 'Total Planned Content',
    value: '24',
    unit: 'Pieces this month',
    note: '24 Pieces this month',
    subtext: '+6 pieces vs previous month',
    icon: Layers,
    colorClass: 'text-primary bg-primary/10',
  },
  {
    id: 'scheduled',
    title: 'Scheduled for Publish',
    value: '8',
    unit: 'items ready',
    note: '8 items ready',
    subtext: 'Next drop: Sep 08 · 02:00 PM EST',
    icon: CalendarCheck,
    colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  },
  {
    id: 'in-review',
    title: 'In Review / Drafting',
    value: '12',
    unit: 'in progress',
    note: '12 in progress',
    subtext: '7 in editorial review · 5 in drafting',
    icon: PenLine,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
  {
    id: 'published',
    title: 'Published this Month',
    value: '4',
    unit: 'live',
    note: '4 live',
    subtext: '100% on-schedule publishing rate',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
]

const channelConfig: Record<
  'blog' | 'newsletter' | 'youtube' | 'social',
  { label: string; badgeClass: string; icon: any }
> = {
  blog: {
    label: 'Blog',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: FileText,
  },
  newsletter: {
    label: 'Newsletter',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    icon: Mail,
  },
  youtube: {
    label: 'YouTube',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: Video,
  },
  social: {
    label: 'Social',
    badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    icon: Share2,
  },
}

const statusConfig: Record<ContentStatus, { label: string; badgeClass: string; dotClass: string }> = {
  published: {
    label: 'Published',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  scheduled: {
    label: 'Scheduled',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    dotClass: 'bg-blue-500',
  },
  in_review: {
    label: 'In Review',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  draft: {
    label: 'Draft',
    badgeClass: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-muted-foreground',
  },
}

const contentItems: ContentItem[] = [
  {
    id: 'cnt-01',
    title: 'Deep Dive: Headless Reka UI Primitives in Vue 3.5',
    channel: 'blog',
    channelLabel: 'Blog',
    publishDate: 'Sep 04',
    publishTime: '10:00 AM EST',
    author: {
      name: 'Sarah Chen',
      role: 'Lead Developer Advocate',
      avatar: 'SC',
    },
    status: 'published',
    statusLabel: 'Published',
    keywords: ['#vue3', '#reka-ui', '#frontend'],
    format: 'Technical Guide',
  },
  {
    id: 'cnt-02',
    title: 'Building Zero-Runtime Design Systems with Tailwind CSS v4',
    channel: 'youtube',
    channelLabel: 'YouTube',
    publishDate: 'Sep 08',
    publishTime: '02:00 PM EST',
    author: {
      name: 'Marcus Vance',
      role: 'Senior UI Engineer',
      avatar: 'MV',
    },
    status: 'scheduled',
    statusLabel: 'Scheduled',
    keywords: ['#tailwindcss', '#design-systems', '#webdev'],
    format: 'Video Tutorial',
  },
  {
    id: 'cnt-03',
    title: 'Frontend Weekly #142: Subgrid Mastery & CSS Anchor Positioning',
    channel: 'newsletter',
    channelLabel: 'Newsletter',
    publishDate: 'Sep 12',
    publishTime: '09:00 AM EST',
    author: {
      name: 'Elena Rostova',
      role: 'Technical Editor',
      avatar: 'ER',
    },
    status: 'scheduled',
    statusLabel: 'Scheduled',
    keywords: ['#css', '#newsletter', '#subgrid'],
    format: 'Email Dispatch',
  },
  {
    id: 'cnt-04',
    title: 'Accessible Command Palettes & Keyboard Shortcuts Architecture',
    channel: 'blog',
    channelLabel: 'Blog',
    publishDate: 'Sep 16',
    publishTime: '11:30 AM EST',
    author: {
      name: 'David Kim',
      role: 'Accessibility Specialist',
      avatar: 'DK',
    },
    status: 'in_review',
    statusLabel: 'In Review',
    keywords: ['#a11y', '#cmdk', '#keyboard-nav'],
    format: 'Deep Dive',
  },
  {
    id: 'cnt-05',
    title: 'Product Drop: 12 New Enterprise Blocks for Nuxt 4 & React',
    channel: 'social',
    channelLabel: 'Social',
    publishDate: 'Sep 21',
    publishTime: '04:00 PM EST',
    author: {
      name: 'Aisha Patel',
      role: 'Product Marketing Lead',
      avatar: 'AP',
    },
    status: 'in_review',
    statusLabel: 'In Review',
    keywords: ['#changelog', '#uipkge', '#react', '#vue'],
    format: 'Social Campaign',
  },
  {
    id: 'cnt-06',
    title: 'Micro-Interactions & Spring Physics in Modern Web Applications',
    channel: 'youtube',
    channelLabel: 'YouTube',
    publishDate: 'Sep 26',
    publishTime: '01:15 PM EST',
    author: {
      name: 'Lucas Meyer',
      role: 'Motion Designer',
      avatar: 'LM',
    },
    status: 'draft',
    statusLabel: 'Draft',
    keywords: ['#animation', '#spring-physics', '#ui-motion'],
    format: 'Interactive Workshop',
  },
]

const channelFilters: Array<{ value: ContentChannel; label: string; icon: any }> = [
  { value: 'all', label: 'All Channels', icon: Layers },
  { value: 'blog', label: 'Blog', icon: FileText },
  { value: 'newsletter', label: 'Newsletter', icon: Mail },
  { value: 'youtube', label: 'YouTube', icon: Video },
  { value: 'social', label: 'Social', icon: Share2 },
]

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return contentItems.filter((item) => {
    const matchesChannel = selectedChannel.value === 'all' || item.channel === selectedChannel.value
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.author.name.toLowerCase().includes(query) ||
      item.keywords.some((k) => k.toLowerCase().includes(query))
    return matchesChannel && matchesQuery
  })
})
</script>

<template>
  <div data-slot="content-calendar-matrix" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold tracking-tight">{{ props.title }}</h2>
          <Badge variant="outline" class="hidden sm:inline-flex">Editorial Desk</Badge>
        </div>
        <p class="text-muted-foreground mt-1 text-sm">{{ props.subtitle }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Month Selector -->
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-[180px] shadow-xs">
            <CalendarDays class="text-muted-foreground mr-2 size-4" />
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026-08">August 2026</SelectItem>
            <SelectItem value="2026-09">September 2026</SelectItem>
            <SelectItem value="2026-10">October 2026</SelectItem>
            <SelectItem value="2026-11">November 2026</SelectItem>
          </SelectContent>
        </Select>

        <!-- New Content Item Primary Button -->
        <Button class="gap-2 shadow-xs">
          <Plus class="size-4" />
          New Content Item
        </Button>
      </div>
    </div>

    <!-- 4 Editorial Pacing KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="kpi in pacingKpis" :key="kpi.id" class="shadow-xs">
        <CardContent class="space-y-3 p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-sm font-medium">{{ kpi.title }}</p>
            <div :class="cn('flex size-8 items-center justify-center rounded-md', kpi.colorClass)">
              <component :is="kpi.icon" class="size-4" />
            </div>
          </div>

          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-bold tracking-tight tabular-nums">{{ kpi.value }}</span>
              <span class="text-muted-foreground text-xs font-medium">{{ kpi.unit }}</span>
            </div>
            <p class="text-muted-foreground mt-1 text-xs">{{ kpi.subtext }}</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Pipeline & Matrix Controls Bar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Channel Filters -->
      <div class="flex flex-wrap items-center gap-1.5">
        <Button
          v-for="filter in channelFilters"
          :key="filter.value"
          :variant="selectedChannel === filter.value ? 'default' : 'outline'"
          size="sm"
          class="h-8 gap-1.5 text-xs shadow-xs"
          @click="selectedChannel = filter.value"
        >
          <component :is="filter.icon" class="size-3.5" />
          <span>{{ filter.label }}</span>
        </Button>
      </div>

      <!-- Keyword / Title Search Input -->
      <div class="relative w-full sm:w-64">
        <Search class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          v-model="searchQuery"
          type="text"
          placeholder="Filter by keyword or title..."
          class="h-8 pl-8 text-xs shadow-xs"
        />
      </div>
    </div>

    <!-- Content Publishing Pipeline Table -->
    <div class="bg-card overflow-x-auto rounded-lg border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[180px]">Publish Date &amp; Time</TableHead>
            <TableHead class="min-w-[280px]">Content Title</TableHead>
            <TableHead class="w-[120px]">Channel</TableHead>
            <TableHead class="min-w-[180px]">Author</TableHead>
            <TableHead class="w-[130px]">Status</TableHead>
            <TableHead class="min-w-[200px]">SEO / Keywords</TableHead>
            <TableHead class="w-12 text-right">
              <span class="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in filteredItems" :key="item.id" class="hover:bg-muted/50 transition-colors">
            <!-- Publish Date & Time -->
            <TableCell class="align-middle">
              <div class="flex items-center gap-1.5">
                <Clock class="text-muted-foreground size-3.5 shrink-0" />
                <span class="text-xs font-medium tabular-nums">{{ item.publishDate }} · {{ item.publishTime }}</span>
              </div>
            </TableCell>

            <!-- Content Title -->
            <TableCell class="align-middle">
              <div class="space-y-0.5">
                <p class="text-foreground text-sm leading-snug font-semibold">{{ item.title }}</p>
                <p class="text-muted-foreground text-xs font-normal">{{ item.format }}</p>
              </div>
            </TableCell>

            <!-- Channel Badge -->
            <TableCell class="align-middle">
              <Badge variant="outline" :class="cn('gap-1 text-xs font-medium', channelConfig[item.channel].badgeClass)">
                <component :is="channelConfig[item.channel].icon" class="size-3" />
                {{ channelConfig[item.channel].label }}
              </Badge>
            </TableCell>

            <!-- Author (Avatar + Name) -->
            <TableCell class="align-middle">
              <div class="flex items-center gap-2.5">
                <Avatar class="size-7">
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">
                    {{ item.author.avatar }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="text-foreground truncate text-xs font-medium">{{ item.author.name }}</p>
                  <p class="text-muted-foreground truncate text-xs">{{ item.author.role }}</p>
                </div>
              </div>
            </TableCell>

            <!-- Status Badge -->
            <TableCell class="align-middle">
              <Badge variant="outline" :class="cn('gap-1.5 text-xs font-medium', statusConfig[item.status].badgeClass)">
                <span :class="cn('size-1.5 rounded-full', statusConfig[item.status].dotClass)" />
                {{ statusConfig[item.status].label }}
              </Badge>
            </TableCell>

            <!-- SEO / Target Keywords -->
            <TableCell class="align-middle">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="keyword in item.keywords"
                  :key="keyword"
                  class="bg-muted/60 border-border/50 text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-xs"
                >
                  {{ keyword }}
                </span>
              </div>
            </TableCell>

            <!-- Actions Dropdown -->
            <TableCell class="text-right align-middle">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon-sm" class="text-muted-foreground size-8">
                    <MoreHorizontal class="size-4" />
                    <span class="sr-only">Open actions for {{ item.title }}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <DropdownMenuLabel class="text-xs">Manage Content</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="gap-2 text-xs">
                    <Pencil class="size-3.5" />
                    <span>Edit item</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem class="gap-2 text-xs">
                    <Calendar class="size-3.5" />
                    <span>Reschedule</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem class="gap-2 text-xs">
                    <UserCheck class="size-3.5" />
                    <span>Assign reviewer</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive focus:text-destructive gap-2 text-xs">
                    <Trash2 class="size-3.5" />
                    <span>Delete item</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>

          <TableRow v-if="filteredItems.length === 0">
            <TableCell colspan="7" class="text-muted-foreground h-32 text-center text-sm">
              No content items found matching the selected channel filter or search query.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Publishing Matrix Footer -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-muted-foreground text-xs">
        Showing <span class="text-foreground font-semibold tabular-nums">{{ filteredItems.length }}</span> of
        <span class="text-foreground font-semibold tabular-nums">{{ contentItems.length }}</span> scheduled content
        pieces for <span class="text-foreground font-medium">September 2026</span>
      </p>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="h-8 text-xs shadow-xs" disabled> Previous </Button>
        <Button variant="outline" size="sm" class="h-8 text-xs shadow-xs"> Next </Button>
      </div>
    </div>
  </div>
</template>
