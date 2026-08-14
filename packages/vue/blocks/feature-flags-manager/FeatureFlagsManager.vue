<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Check,
  Copy,
  Flag,
  History,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
  Sliders,
  SlidersHorizontal,
  Trash2,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface EnvironmentState {
  production: boolean
  staging: boolean
  development: boolean
}

export interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  tags: string[]
  enabled: boolean
  rollout: number
  targetingRules: string
  environments: EnvironmentState
  evaluationCount?: string
  lastUpdated?: string
}

const defaultFlags: FeatureFlag[] = [
  {
    id: 'ff-1',
    name: 'New Checkout Experience',
    key: 'new-checkout-v2',
    description: 'Modern multi-step checkout flow with one-click payment options.',
    tags: ['Frontend', 'Beta', 'Core'],
    enabled: true,
    rollout: 50,
    targetingRules: "plan === 'enterprise' && country === 'US'",
    environments: {
      production: true,
      staging: true,
      development: false,
    },
    evaluationCount: '1.8M/day',
    lastUpdated: '10 min ago',
  },
  {
    id: 'ff-2',
    name: 'Dark Mode V2 Beta',
    key: 'dark-mode-beta',
    description: 'High-contrast OKLCH dark palette with custom system theme sync.',
    tags: ['Frontend', 'Beta'],
    enabled: true,
    rollout: 100,
    targetingRules: 'beta_tester === true',
    environments: {
      production: true,
      staging: true,
      development: true,
    },
    evaluationCount: '920K/day',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'ff-3',
    name: 'AI Auto Complete',
    key: 'ai-auto-complete',
    description: 'LLM-assisted syntax suggestion and context-aware auto-completion.',
    tags: ['AI', 'Core', 'Beta'],
    enabled: true,
    rollout: 25,
    targetingRules: "org_tier IN ['growth', 'enterprise']",
    environments: {
      production: true,
      staging: true,
      development: false,
    },
    evaluationCount: '640K/day',
    lastUpdated: '1 day ago',
  },
  {
    id: 'ff-4',
    name: 'GraphQL API v2 Gateway',
    key: 'graphql-api-v2',
    description: 'High-throughput GraphQL federation engine replacing legacy REST proxy.',
    tags: ['Backend', 'Core'],
    enabled: false,
    rollout: 0,
    targetingRules: 'internal_team === true',
    environments: {
      production: false,
      staging: true,
      development: true,
    },
    evaluationCount: '480K/day',
    lastUpdated: '3 days ago',
  },
  {
    id: 'ff-5',
    name: 'Crypto Payments Pilot',
    key: 'crypto-payments',
    description: 'USDC and Ethereum settlement rail for international enterprise invoices.',
    tags: ['Core', 'Beta'],
    enabled: false,
    rollout: 10,
    targetingRules: "country IN ['US', 'DE', 'SG'] && plan === 'enterprise'",
    environments: {
      production: false,
      staging: true,
      development: false,
    },
    evaluationCount: '120K/day',
    lastUpdated: '5 days ago',
  },
]

interface Props {
  initialFlags?: FeatureFlag[]
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {})

const flags = ref<FeatureFlag[]>(props.initialFlags ? [...props.initialFlags] : [...defaultFlags])
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'enabled' | 'disabled'>('all')
const copiedKey = ref<string | null>(null)

function toggleFlag(id: string) {
  flags.value = flags.value.map((flag) => {
    if (flag.id === id) {
      return { ...flag, enabled: !flag.enabled }
    }
    return flag
  })
}

function deleteFlag(id: string) {
  flags.value = flags.value.filter((flag) => flag.id !== id)
}

function copyFlagKey(key: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(key)
    copiedKey.value = key
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null
    }, 2000)
  }
}

const filteredFlags = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return flags.value.filter((flag) => {
    if (selectedStatus.value === 'enabled' && !flag.enabled) return false
    if (selectedStatus.value === 'disabled' && flag.enabled) return false

    if (!query) return true
    const matchName = flag.name.toLowerCase().includes(query)
    const matchKey = flag.key.toLowerCase().includes(query)
    const matchDesc = flag.description.toLowerCase().includes(query)
    const matchTag = flag.tags.some((t) => t.toLowerCase().includes(query))
    return matchName || matchKey || matchDesc || matchTag
  })
})
</script>

<template>
  <div data-slot="feature-flags-manager" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-foreground text-2xl font-bold tracking-tight">Feature Flags</h2>
        <p class="text-muted-foreground mt-1 text-sm">
          Safely deploy features with percentage rollouts, user targeting, and kill switches.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button>
          <Plus aria-hidden="true" class="size-4" />
          Create Flag
        </Button>
      </div>
    </div>

    <!-- Summary Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="p-4 shadow-xs">
        <div class="flex items-center justify-between gap-x-2">
          <span class="text-muted-foreground text-xs font-medium">Total Flags</span>
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
            <Flag aria-hidden="true" class="size-4" />
          </div>
        </div>
        <div class="mt-2">
          <div class="text-foreground text-2xl font-bold tracking-tight">24</div>
          <p class="text-muted-foreground mt-1 text-xs">5 in current scope</p>
        </div>
      </Card>

      <Card class="p-4 shadow-xs">
        <div class="flex items-center justify-between gap-x-2">
          <span class="text-muted-foreground text-xs font-medium">Active Rollouts</span>
          <div class="bg-info/10 text-info flex size-8 items-center justify-center rounded-md">
            <SlidersHorizontal aria-hidden="true" class="size-4" />
          </div>
        </div>
        <div class="mt-2">
          <div class="text-foreground text-2xl font-bold tracking-tight">8</div>
          <p class="text-muted-foreground mt-1 text-xs">Gradual traffic ramps</p>
        </div>
      </Card>

      <Card class="p-4 shadow-xs">
        <div class="flex items-center justify-between gap-x-2">
          <span class="text-muted-foreground text-xs font-medium">Kill-Switches Armed</span>
          <div class="bg-warning/10 text-warning flex size-8 items-center justify-center rounded-md">
            <ShieldAlert aria-hidden="true" class="size-4" />
          </div>
        </div>
        <div class="mt-2">
          <div class="text-foreground text-2xl font-bold tracking-tight">3</div>
          <p class="text-muted-foreground mt-1 text-xs">Instant emergency trip</p>
        </div>
      </Card>

      <Card class="p-4 shadow-xs">
        <div class="flex items-center justify-between gap-x-2">
          <span class="text-muted-foreground text-xs font-medium">Evaluation Volume</span>
          <div class="bg-success/10 text-success flex size-8 items-center justify-center rounded-md">
            <Zap aria-hidden="true" class="size-4" />
          </div>
        </div>
        <div class="mt-2">
          <div class="text-foreground text-2xl font-bold tracking-tight">4.2M/day</div>
          <p class="text-muted-foreground mt-1 text-xs">99.99% cache hit · 1.2ms p99</p>
        </div>
      </Card>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <div class="relative w-full sm:w-80">
          <Search
            aria-hidden="true"
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          />
          <Input
            v-model="searchQuery"
            placeholder="Search flags by name, key, or tag..."
            class="h-9 pl-8.5 text-xs sm:text-sm"
          />
        </div>

        <div class="border-border bg-muted/30 flex items-center rounded-lg border p-0.5">
          <button
            type="button"
            :class="
              cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedStatus === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="selectedStatus = 'all'"
          >
            All
          </button>
          <button
            type="button"
            :class="
              cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedStatus === 'enabled'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="selectedStatus = 'enabled'"
          >
            Enabled
          </button>
          <button
            type="button"
            :class="
              cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedStatus === 'disabled'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="selectedStatus = 'disabled'"
          >
            Disabled
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-muted-foreground text-xs tabular-nums">
          Showing {{ filteredFlags.length }} of {{ flags.length }} flags
        </span>
      </div>
    </div>

    <!-- Feature Flags Table -->
    <div class="bg-card border-border overflow-hidden rounded-xl border shadow-xs">
      <div class="overflow-x-auto">
        <Table class="max-w-[920px] min-w-full">
          <TableHeader>
            <TableRow class="bg-muted/40 hover:bg-transparent">
              <TableHead class="w-[300px]">Flag</TableHead>
              <TableHead class="w-[130px]">Status</TableHead>
              <TableHead class="w-[160px]">Rollout</TableHead>
              <TableHead class="min-w-[240px]">Targeting Rules</TableHead>
              <TableHead class="w-[160px]">Environments</TableHead>
              <TableHead class="w-[50px] text-right"><span class="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="flag in filteredFlags"
              :key="flag.id"
              :class="cn('hover:bg-muted/40 transition-colors', !flag.enabled && 'opacity-75 dark:opacity-70')"
            >
              <!-- Flag Name, Key, Description & Tags -->
              <TableCell class="py-3.5 align-top">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-semibold">{{ flag.name }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <code
                      class="bg-muted/70 text-muted-foreground border-border/50 rounded border px-1.5 py-0.5 font-mono text-xs select-all"
                    >
                      {{ flag.key }}
                    </code>
                    <button
                      type="button"
                      class="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex min-h-6 min-w-6 items-center justify-center rounded p-0.5 transition-colors"
                      :title="copiedKey === flag.key ? 'Copied!' : 'Copy key'"
                      @click="copyFlagKey(flag.key)"
                    >
                      <Check v-if="copiedKey === flag.key" class="text-success size-3" />
                      <Copy v-else class="size-3" />
                      <span class="sr-only">Copy {{ flag.key }}</span>
                    </button>
                  </div>
                  <p class="text-muted-foreground line-clamp-1 pt-0.5 text-xs">
                    {{ flag.description }}
                  </p>
                  <div class="flex flex-wrap items-center gap-1 pt-1">
                    <Badge
                      v-for="tag in flag.tags"
                      :key="tag"
                      variant="outline"
                      class="text-muted-foreground px-1.5 py-0 text-xs font-normal"
                    >
                      {{ tag }}
                    </Badge>
                  </div>
                </div>
              </TableCell>

              <!-- Master Status Switch -->
              <TableCell class="py-3.5 align-middle">
                <div class="flex items-center gap-2.5">
                  <Switch
                    :model-value="flag.enabled"
                    :aria-label="`Toggle ${flag.name}`"
                    @update:model-value="toggleFlag(flag.id)"
                  />
                  <span
                    :class="
                      cn(
                        'text-xs font-medium',
                        flag.enabled ? 'text-success dark:text-success' : 'text-muted-foreground',
                      )
                    "
                  >
                    {{ flag.enabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
              </TableCell>

              <!-- Rollout % Visual Progress Bar -->
              <TableCell class="py-3.5 align-middle">
                <div class="max-w-[130px] space-y-1.5">
                  <div class="flex items-center justify-between gap-x-2 text-xs">
                    <span class="text-foreground font-semibold tabular-nums">
                      {{ flag.enabled ? `${flag.rollout}%` : '0%' }}
                    </span>
                    <span class="text-muted-foreground text-xs">
                      {{ flag.enabled ? (flag.rollout === 100 ? 'All users' : 'Ramp') : 'Inactive' }}
                    </span>
                  </div>
                  <Progress :model-value="flag.enabled ? flag.rollout : 0" class="h-1.5" />
                </div>
              </TableCell>

              <!-- Targeting Rules Summary -->
              <TableCell class="py-3.5 align-middle">
                <div class="flex items-center">
                  <code
                    class="border-border/60 bg-muted/40 text-foreground/80 inline-flex max-w-[260px] items-center gap-1 truncate rounded border px-2 py-1 font-mono text-xs"
                    :title="flag.targetingRules"
                  >
                    <span class="text-muted-foreground font-sans text-xs">Target:</span>
                    <span class="truncate">{{ flag.targetingRules }}</span>
                  </code>
                </div>
              </TableCell>

              <!-- Environment Badges -->
              <TableCell class="py-3.5 align-middle">
                <div class="flex items-center gap-1">
                  <span
                    :class="
                      cn(
                        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium',
                        flag.environments.production
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-muted/40 text-muted-foreground border-transparent opacity-60',
                      )
                    "
                  >
                    <span
                      :class="
                        cn(
                          'size-1.5 rounded-full',
                          flag.environments.production ? 'bg-success' : 'bg-muted-foreground/40',
                        )
                      "
                    />
                    Prod
                  </span>
                  <span
                    :class="
                      cn(
                        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium',
                        flag.environments.staging
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-muted/40 text-muted-foreground border-transparent opacity-60',
                      )
                    "
                  >
                    <span
                      :class="
                        cn('size-1.5 rounded-full', flag.environments.staging ? 'bg-success' : 'bg-muted-foreground/40')
                      "
                    />
                    Stg
                  </span>
                  <span
                    :class="
                      cn(
                        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium',
                        flag.environments.development
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-muted/40 text-muted-foreground border-transparent opacity-60',
                      )
                    "
                  >
                    <span
                      :class="
                        cn(
                          'size-1.5 rounded-full',
                          flag.environments.development ? 'bg-success' : 'bg-muted-foreground/40',
                        )
                      "
                    />
                    Dev
                  </span>
                </div>
              </TableCell>

              <!-- Actions Dropdown -->
              <TableCell class="py-3.5 text-right align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon-sm" class="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal aria-hidden="true" class="size-4" />
                      <span class="sr-only">Actions for {{ flag.name }}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Sliders aria-hidden="true" class="mr-2 size-4" />
                      Edit rules
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <History aria-hidden="true" class="mr-2 size-4" />
                      Audit history
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="copyFlagKey(flag.key)">
                      <Copy aria-hidden="true" class="mr-2 size-4" />
                      Copy flag key
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      class="text-destructive focus:text-destructive"
                      @click="deleteFlag(flag.id)"
                    >
                      <Trash2 aria-hidden="true" class="mr-2 size-4" />
                      Delete flag
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            <!-- Empty State -->
            <TableRow v-if="filteredFlags.length === 0">
              <TableCell colspan="6" class="text-muted-foreground h-36 text-center">
                <div class="flex flex-col items-center justify-center space-y-1.5">
                  <Search class="text-muted-foreground/40 size-6" />
                  <p class="text-foreground text-sm font-medium">No feature flags found</p>
                  <p class="text-muted-foreground text-xs">
                    No flags match your search or filter criteria. Try adjusting your query.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
