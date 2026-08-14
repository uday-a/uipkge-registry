'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export const defaultFlags: FeatureFlag[] = [
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

export interface FeatureFlagsManagerProps {
  initialFlags?: FeatureFlag[]
  className?: string
}

export function FeatureFlagsManager({ initialFlags, className }: FeatureFlagsManagerProps) {
  const [flags, setFlags] = React.useState<FeatureFlag[]>(initialFlags ?? defaultFlags)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'enabled' | 'disabled'>('all')
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  const toggleFlag = (id: string) => {
    setFlags((prev) => prev.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled } : flag)))
  }

  const deleteFlag = (id: string) => {
    setFlags((prev) => prev.filter((flag) => flag.id !== id))
  }

  const copyFlagKey = (key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(key)
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr))
      }, 2000)
    }
  }

  const filteredFlags = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return flags.filter((flag) => {
      if (selectedStatus === 'enabled' && !flag.enabled) return false
      if (selectedStatus === 'disabled' && flag.enabled) return false

      if (!query) return true
      const matchName = flag.name.toLowerCase().includes(query)
      const matchKey = flag.key.toLowerCase().includes(query)
      const matchDesc = flag.description.toLowerCase().includes(query)
      const matchTag = flag.tags.some((t) => t.toLowerCase().includes(query))
      return matchName || matchKey || matchDesc || matchTag
    })
  }, [flags, searchQuery, selectedStatus])

  return (
    <div data-slot="feature-flags-manager" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Feature Flags</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Safely deploy features with percentage rollouts, user targeting, and kill switches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus aria-hidden="true" className="size-4" />
            Create Flag
          </Button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between gap-x-2">
            <span className="text-muted-foreground text-xs font-medium">Total Flags</span>
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
              <Flag aria-hidden="true" className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-foreground text-2xl font-bold tracking-tight">24</div>
            <p className="text-muted-foreground mt-1 text-xs">5 in current scope</p>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between gap-x-2">
            <span className="text-muted-foreground text-xs font-medium">Active Rollouts</span>
            <div className="bg-info/10 text-info flex size-8 items-center justify-center rounded-md">
              <SlidersHorizontal aria-hidden="true" className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-foreground text-2xl font-bold tracking-tight">8</div>
            <p className="text-muted-foreground mt-1 text-xs">Gradual traffic ramps</p>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between gap-x-2">
            <span className="text-muted-foreground text-xs font-medium">Kill-Switches Armed</span>
            <div className="bg-warning/10 text-warning flex size-8 items-center justify-center rounded-md">
              <ShieldAlert aria-hidden="true" className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-foreground text-2xl font-bold tracking-tight">3</div>
            <p className="text-muted-foreground mt-1 text-xs">Instant emergency trip</p>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between gap-x-2">
            <span className="text-muted-foreground text-xs font-medium">Evaluation Volume</span>
            <div className="bg-success/10 text-success flex size-8 items-center justify-center rounded-md">
              <Zap aria-hidden="true" className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-foreground text-2xl font-bold tracking-tight">4.2M/day</div>
            <p className="text-muted-foreground mt-1 text-xs">99.99% cache hit · 1.2ms p99</p>
          </div>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flags by name, key, or tag..."
              className="h-9 pl-8.5 text-xs sm:text-sm"
            />
          </div>

          <div className="border-border bg-muted/30 flex items-center rounded-lg border p-0.5">
            <button
              type="button"
              className={cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedStatus === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setSelectedStatus('all')}
            >
              All
            </button>
            <button
              type="button"
              className={cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedStatus === 'enabled'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setSelectedStatus('enabled')}
            >
              Enabled
            </button>
            <button
              type="button"
              className={cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedStatus === 'disabled'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setSelectedStatus('disabled')}
            >
              Disabled
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs tabular-nums">
            Showing {filteredFlags.length} of {flags.length} flags
          </span>
        </div>
      </div>

      {/* Feature Flags Table */}
      <div className="bg-card border-border overflow-hidden rounded-xl border shadow-xs">
        <div className="overflow-x-auto">
          <Table className="max-w-[920px] min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-transparent">
                <TableHead className="w-[300px]">Flag</TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[160px]">Rollout</TableHead>
                <TableHead className="min-w-[240px]">Targeting Rules</TableHead>
                <TableHead className="w-[160px]">Environments</TableHead>
                <TableHead className="w-[50px] text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlags.map((flag) => (
                <TableRow
                  key={flag.id}
                  className={cn('hover:bg-muted/40 transition-colors', !flag.enabled && 'opacity-75 dark:opacity-70')}
                >
                  {/* Flag Name, Key, Description & Tags */}
                  <TableCell className="py-3.5 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-semibold">{flag.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <code className="bg-muted/70 text-muted-foreground border-border/50 rounded border px-1.5 py-0.5 font-mono text-xs select-all">
                          {flag.key}
                        </code>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex min-h-6 min-w-6 items-center justify-center rounded p-0.5 transition-colors"
                          title={copiedKey === flag.key ? 'Copied!' : 'Copy key'}
                          onClick={() => copyFlagKey(flag.key)}
                        >
                          {copiedKey === flag.key ? (
                            <Check className="text-success size-3" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                          <span className="sr-only">Copy {flag.key}</span>
                        </button>
                      </div>
                      <p className="text-muted-foreground line-clamp-1 pt-0.5 text-xs">{flag.description}</p>
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {flag.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-muted-foreground px-1.5 py-0 text-xs font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  {/* Master Status Switch */}
                  <TableCell className="py-3.5 align-middle">
                    <div className="flex items-center gap-2.5">
                      <Switch
                        checked={flag.enabled}
                        aria-label={`Toggle ${flag.name}`}
                        onCheckedChange={() => toggleFlag(flag.id)}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium',
                          flag.enabled ? 'text-success dark:text-success' : 'text-muted-foreground',
                        )}
                      >
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Rollout % Visual Progress Bar */}
                  <TableCell className="py-3.5 align-middle">
                    <div className="max-w-[130px] space-y-1.5">
                      <div className="flex items-center justify-between gap-x-2 text-xs">
                        <span className="text-foreground font-semibold tabular-nums">
                          {flag.enabled ? `${flag.rollout}%` : '0%'}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {flag.enabled ? (flag.rollout === 100 ? 'All users' : 'Ramp') : 'Inactive'}
                        </span>
                      </div>
                      <Progress value={flag.enabled ? flag.rollout : 0} className="h-1.5" />
                    </div>
                  </TableCell>

                  {/* Targeting Rules Summary */}
                  <TableCell className="py-3.5 align-middle">
                    <div className="flex items-center">
                      <code
                        className="border-border/60 bg-muted/40 text-foreground/80 inline-flex max-w-[260px] items-center gap-1 truncate rounded border px-2 py-1 font-mono text-xs"
                        title={flag.targetingRules}
                      >
                        <span className="text-muted-foreground font-sans text-xs">Target:</span>
                        <span className="truncate">{flag.targetingRules}</span>
                      </code>
                    </div>
                  </TableCell>

                  {/* Environment Badges */}
                  <TableCell className="py-3.5 align-middle">
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium',
                          flag.environments.production
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-muted/40 text-muted-foreground border-transparent opacity-60',
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            flag.environments.production ? 'bg-success' : 'bg-muted-foreground/40',
                          )}
                        />
                        Prod
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium',
                          flag.environments.staging
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-muted/40 text-muted-foreground border-transparent opacity-60',
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            flag.environments.staging ? 'bg-success' : 'bg-muted-foreground/40',
                          )}
                        />
                        Stg
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium',
                          flag.environments.development
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-muted/40 text-muted-foreground border-transparent opacity-60',
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            flag.environments.development ? 'bg-success' : 'bg-muted-foreground/40',
                          )}
                        />
                        Dev
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="py-3.5 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal aria-hidden="true" className="size-4" />
                          <span className="sr-only">Actions for {flag.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Sliders aria-hidden="true" className="mr-2 size-4" />
                          Edit rules
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History aria-hidden="true" className="mr-2 size-4" />
                          Audit history
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyFlagKey(flag.key)}>
                          <Copy aria-hidden="true" className="mr-2 size-4" />
                          Copy flag key
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteFlag(flag.id)}
                        >
                          <Trash2 aria-hidden="true" className="mr-2 size-4" />
                          Delete flag
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {/* Empty State */}
              {filteredFlags.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground h-36 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <Search className="text-muted-foreground/40 size-6" />
                      <p className="text-foreground text-sm font-medium">No feature flags found</p>
                      <p className="text-muted-foreground text-xs">
                        No flags match your search or filter criteria. Try adjusting your query.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default FeatureFlagsManager
