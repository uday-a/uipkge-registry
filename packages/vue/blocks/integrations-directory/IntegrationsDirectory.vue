<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  BarChart3,
  Check,
  Container,
  CreditCard,
  LineChart,
  Mail,
  MessageSquare,
  Radar,
  Receipt,
  ScrollText,
  Search,
  SearchX,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

type CategoryId = 'analytics' | 'devops' | 'communication' | 'billing'
type CategoryFilter = 'all' | CategoryId

interface Integration {
  id: string
  name: string
  description: string
  /** Longer paragraph shown in the detail view. */
  detail: string
  category: CategoryId
  author: string
  /** Lucide glyph standing in for the product logo. */
  icon: Component
  connected?: boolean
  permissions: string[]
}

const props = defineProps<{
  /** Replace the built-in stub catalog. */
  integrations?: Integration[]
  initialQuery?: string
  initialCategory?: CategoryFilter
  initialInstalledOnly?: boolean
  /** Render this integration's detail body as an always-visible panel (docs/story aid). */
  featuredId?: string
  class?: HTMLAttributes['class']
}>()

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'devops', label: 'DevOps' },
  { id: 'communication', label: 'Communication' },
  { id: 'billing', label: 'Billing' },
]

const stubIntegrations: Integration[] = [
  {
    id: 'pulseboard',
    name: 'Pulseboard',
    description: 'Funnels, retention curves and cohort exploration for product teams.',
    detail:
      'Pulseboard plugs into your event stream and turns raw activity into funnels, retention curves and cohort views. Dashboards sync hourly, and annotations push back into your workspace so launches stay marked on every chart.',
    category: 'analytics',
    author: 'Pulseboard Labs',
    icon: BarChart3,
    connected: true,
    permissions: ['Read workspace profile', 'Read dashboards and events', 'Create annotations and highlights'],
  },
  {
    id: 'metrica',
    name: 'Metrica',
    description: 'Privacy-friendly web metrics with no cookie banner required.',
    detail:
      'Metrica collects pageviews and referrers without cookies or personal data, so sites stay compliant out of the box. Live visitor counts, entry pages and campaign attribution arrive as lightweight embeds or a full dashboard.',
    category: 'analytics',
    author: 'Metrica Inc.',
    icon: LineChart,
    permissions: ['Read site metadata', 'Record aggregate pageviews'],
  },
  {
    id: 'shipyard',
    name: 'Shipyard',
    description: 'Zero-config preview environments for every pull request.',
    detail:
      'Shipyard builds an isolated environment for each pull request, complete with seeded databases and shareable URLs. Deploys post status checks back to your repository, and idle previews sleep automatically to keep costs flat.',
    category: 'devops',
    author: 'Shipyard Systems',
    icon: Container,
    connected: true,
    permissions: ['Read pull requests and statuses', 'Create deployment check runs', 'Publish preview URLs'],
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    description: 'Uptime, SSL and domain monitoring with on-call escalations.',
    detail:
      'Watchtower probes your endpoints from twelve regions and escalates incidents through on-call schedules when thresholds break. SSL expiry, DNS drift and port changes are tracked alongside uptime so surprises surface early.',
    category: 'devops',
    author: 'Northwind Ops',
    icon: Radar,
    permissions: ['Read incident history', 'Register webhook endpoints', 'Send alert notifications'],
  },
  {
    id: 'loghound',
    name: 'Loghound',
    description: 'Structured log search across every service and region.',
    detail:
      'Loghound ingests structured logs from every service, indexes them in seconds and supports SQL-ish queries with saved views. Tail live streams during deploys and pipe matched events straight into your alerting rules.',
    category: 'devops',
    author: 'Houndworks',
    icon: ScrollText,
    permissions: ['Read log streams', 'Create saved queries', 'Forward events to webhooks'],
  },
  {
    id: 'chatterbox',
    name: 'Chatterbox',
    description: 'Team chat with threads, huddles and shared channels.',
    detail:
      'Chatterbox keeps conversations organized with threaded channels, quick huddles and shared external channels. Bots receive messages through webhooks and can post rich updates, keeping build and incident feeds where the team already works.',
    category: 'communication',
    author: 'Chatterbox Co.',
    icon: MessageSquare,
    permissions: ['Read channel names and topics', 'Post messages as the app', 'Upload notification files'],
  },
  {
    id: 'mailroom',
    name: 'Mailroom',
    description: 'Transactional email with templates and delivery insights.',
    detail:
      'Mailroom sends transactional email from versioned templates with per-recipient variables. Delivery webhooks report bounces, complaints and opens, and suppression lists keep problematic addresses out of future sends.',
    category: 'communication',
    author: 'Mailroom Ltd.',
    icon: Mail,
    permissions: ['Send email on your behalf', 'Read delivery and bounce events', 'Manage suppression list'],
  },
  {
    id: 'ledgerly',
    name: 'Ledgerly',
    description: 'Invoicing, tax handling and revenue recognition in one flow.',
    detail:
      'Ledgerly generates invoices from your billing events, applies regional tax rules automatically and reconciles payments against your ledger. Revenue schedules export to your accounting package month by month.',
    category: 'billing',
    author: 'Ledgerly Inc.',
    icon: Receipt,
    permissions: ['Read customer records', 'Create and send invoices', 'Read payment statuses'],
  },
  {
    id: 'billfold',
    name: 'Billfold',
    description: 'Subscription management and dunning recovery built in.',
    detail:
      'Billfold manages plans, proration and trial conversions with hosted checkout and self-serve portals. Smart retries and expiry reminders recover failed payments before customers ever notice.',
    category: 'billing',
    author: 'Billfold Labs',
    icon: CreditCard,
    permissions: ['Read subscription states', 'Start checkout sessions', 'Send payment reminders'],
  },
]

const integrations = ref<Integration[]>(props.integrations ?? stubIntegrations)
const query = ref(props.initialQuery ?? '')
const category = ref<CategoryFilter>(props.initialCategory ?? 'all')
const installedOnly = ref(props.initialInstalledOnly ?? false)
const detailId = ref<string | null>(null)
const detailOpen = ref(false)

const counts = computed<Record<string, number>>(() => {
  const acc: Record<string, number> = {}
  for (const c of CATEGORIES) acc[c.id] = 0
  for (const i of integrations.value) acc[i.category] = (acc[i.category] ?? 0) + 1
  return acc
})

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  return integrations.value.filter((i) => {
    if (category.value !== 'all' && i.category !== category.value) return false
    if (installedOnly.value && !i.connected) return false
    if (!q) return true
    const hay = `${i.name} ${i.description} ${i.author} ${categoryLabel(i.category)}`.toLowerCase()
    return hay.includes(q)
  })
})

const featured = computed(() =>
  props.featuredId ? (integrations.value.find((i) => i.id === props.featuredId) ?? null) : null,
)

const activeDetail = computed(() =>
  detailId.value ? (integrations.value.find((i) => i.id === detailId.value) ?? null) : null,
)

function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

function initials(author: string): string {
  return author
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function openDetail(id: string) {
  detailId.value = id
  detailOpen.value = true
}

function setConnected(id: string, connected: boolean) {
  const item = integrations.value.find((i) => i.id === id)
  if (item) item.connected = connected
}

function install(id: string) {
  setConnected(id, true)
}

function disconnect(id: string) {
  setConnected(id, false)
}

function clearFilters() {
  query.value = ''
  category.value = 'all'
  installedOnly.value = false
}
</script>

<template>
  <div :class="cn('space-y-4', props.class)" data-slot="integrations-directory">
    <!-- Toolbar -->
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <Input
          v-model="query"
          :prefix-icon="Search"
          placeholder="Search integrations…"
          aria-label="Search integrations"
          class="min-w-56 flex-1"
        />
        <div class="ml-auto flex items-center gap-2">
          <Switch v-model="installedOnly" size="sm" aria-label="Show installed integrations only" />
          <span class="text-muted-foreground text-sm select-none">Installed</span>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="c in CATEGORIES"
          :key="c.id"
          type="button"
          class="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none"
          :aria-pressed="category === c.id"
          @click="category = c.id"
        >
          <Chip :variant="category === c.id ? 'filled' : 'outline'" size="sm">
            {{ c.label }}
            <span class="tabular-nums opacity-70">{{ counts[c.id] ?? 0 }}</span>
          </Chip>
        </button>
      </div>
    </div>

    <!-- Featured detail panel (always-visible variant of the dialog body) -->
    <section
      v-if="featured"
      data-slot="integration-detail-panel"
      class="bg-card space-y-4 rounded-xl border p-6 shadow-sm"
      aria-label="Integration details"
    >
      <div class="flex items-start gap-4">
        <span
          class="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-xl"
          aria-hidden="true"
        >
          <component :is="featured.icon" class="size-7" />
        </span>
        <div class="min-w-0">
          <h2 class="text-base font-semibold tracking-tight">{{ featured.name }}</h2>
          <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Chip variant="outline" size="sm">{{ categoryLabel(featured.category) }}</Chip>
            <span class="text-muted-foreground text-xs">by {{ featured.author }}</span>
          </div>
        </div>
      </div>
      <p class="text-muted-foreground text-sm leading-relaxed">{{ featured.detail }}</p>
      <div>
        <p class="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Permissions</p>
        <ul class="mt-2 space-y-1.5">
          <li v-for="p in featured.permissions" :key="p" class="flex items-start gap-2 text-sm">
            <Check class="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{{ p }}</span>
          </li>
        </ul>
      </div>
      <div class="border-border flex items-center gap-2 border-t pt-4">
        <template v-if="featured.connected">
          <Badge variant="success"><Check aria-hidden="true" /> Connected</Badge>
          <Button variant="ghost" size="sm" class="ml-auto" @click="disconnect(featured.id)">Disconnect</Button>
        </template>
        <Button v-else class="w-full" @click="install(featured.id)">Install</Button>
      </div>
    </section>

    <!-- Results -->
    <template v-if="visible.length > 0">
      <p class="text-muted-foreground text-xs tabular-nums">
        Showing {{ visible.length }} of {{ integrations.length }} integrations
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="i in visible"
          :key="i.id"
          data-slot="integration-card"
          class="bg-card hover:border-ring/50 relative flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-colors hover:shadow-md"
        >
          <button
            type="button"
            class="focus-visible:ring-ring/50 absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            :aria-label="`View ${i.name} details`"
            @click="openDetail(i.id)"
          />
          <div class="flex items-start justify-between gap-2">
            <span
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg"
              aria-hidden="true"
            >
              <component :is="i.icon" class="size-5" />
            </span>
            <Chip variant="outline" size="sm">{{ categoryLabel(i.category) }}</Chip>
          </div>
          <div>
            <p class="text-sm font-semibold tracking-tight">{{ i.name }}</p>
            <p class="text-muted-foreground mt-0.5 truncate text-xs">{{ i.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium"
              aria-hidden="true"
            >
              {{ initials(i.author) }}
            </span>
            <span class="text-muted-foreground truncate text-xs">{{ i.author }}</span>
          </div>
          <div class="border-border relative mt-auto flex items-center gap-2 border-t pt-3">
            <template v-if="i.connected">
              <Badge variant="success"><Check aria-hidden="true" /> Connected</Badge>
              <Button variant="ghost" size="xs" class="ml-auto" @click.stop="disconnect(i.id)">Disconnect</Button>
            </template>
            <Button v-else size="sm" class="w-full" @click.stop="install(i.id)">Install</Button>
          </div>
        </article>
      </div>
    </template>

    <!-- Empty state -->
    <div v-else class="rounded-xl border border-dashed">
      <EmptyState
        :icon="SearchX"
        title="No integrations found"
        description="Nothing matches your current search and filters."
      >
        <Button variant="outline" size="sm" class="mt-4" @click="clearFilters">Clear filters</Button>
      </EmptyState>
    </div>

    <!-- Detail dialog -->
    <Dialog :open="detailOpen" @update:open="detailOpen = $event">
      <DialogContent v-if="activeDetail" class="sm:max-w-md">
        <DialogHeader>
          <div class="flex items-start gap-4">
            <span
              class="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <component :is="activeDetail.icon" class="size-7" />
            </span>
            <div class="min-w-0">
              <DialogTitle class="text-base tracking-tight">{{ activeDetail.name }}</DialogTitle>
              <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Chip variant="outline" size="sm">{{ categoryLabel(activeDetail.category) }}</Chip>
                <span class="text-muted-foreground text-xs">by {{ activeDetail.author }}</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription class="leading-relaxed">{{ activeDetail.detail }}</DialogDescription>
        <div>
          <p class="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Permissions</p>
          <ul class="mt-2 space-y-1.5">
            <li v-for="p in activeDetail.permissions" :key="p" class="flex items-start gap-2 text-sm">
              <Check class="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{{ p }}</span>
            </li>
          </ul>
        </div>
        <div class="border-border flex items-center gap-2 border-t pt-4">
          <template v-if="activeDetail.connected">
            <Badge variant="success"><Check aria-hidden="true" /> Connected</Badge>
            <Button variant="ghost" size="sm" class="ml-auto" @click="disconnect(activeDetail.id)"> Disconnect </Button>
          </template>
          <Button v-else class="w-full" @click="install(activeDetail.id)">Install</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
