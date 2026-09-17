'use client'

import * as React from 'react'
import {
  Activity,
  Check,
  ChevronRight,
  Copy,
  Database,
  HardDrive,
  KeyRound,
  Layers,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export interface OutputPort {
  id: string
  name: string
  type: 'snowflake' | 'kafka' | 'graphql' | 's3' | 'postgres'
  typeLabel: string
  uri: string
  latency: string
  status: 'online' | 'degraded' | 'syncing'
}

export interface DataProductData {
  id: string
  name: string
  version: string
  domain: string
  tier: 'Gold Tier 1' | 'Silver Tier 2' | 'Bronze Tier 3'
  description: string
  slaCompliance: number
  freshness: string
  completenessPct: number
  activeConsumersCount: number
  owner: {
    name: string
    role: string
    team: string
    avatar?: string
    fallback: string
  }
  outputPorts: OutputPort[]
  tags: string[]
  certifiedCompliance: string
  lastUpdated: string
}

export const DEFAULT_DATA_PRODUCT: DataProductData = {
  id: 'dp-cust-360',
  name: 'dp_customer_360_profile',
  version: 'v3.2.0',
  domain: 'Customer Intelligence & Growth',
  tier: 'Gold Tier 1',
  description:
    'Unified customer identity graph consolidating CRM accounts, Stripe transaction volumes, and behavioral product telemetry into clean semantic marts.',
  slaCompliance: 99.8,
  freshness: 'Updated 8m ago · Hourly sync',
  completenessPct: 99.4,
  activeConsumersCount: 14,
  owner: {
    name: 'Marcus Vance',
    role: 'Staff Data Architect',
    team: 'Data Platform Squad',
    fallback: 'MV',
  },
  outputPorts: [
    {
      id: 'port-snow',
      name: 'analytics.gold_customer_360',
      type: 'snowflake',
      typeLabel: 'Snowflake Table',
      uri: 'snowflake://analytics_prod.dw/analytics.gold_customer_360',
      latency: '< 1h Batch SLA',
      status: 'online',
    },
    {
      id: 'port-kafka',
      name: 'events.customer.updates.v2',
      type: 'kafka',
      typeLabel: 'Kafka Stream',
      uri: 'kafka://events.kafka.internal:9092/events.customer.updates.v2',
      latency: '< 100ms Event Time',
      status: 'online',
    },
    {
      id: 'port-gql',
      name: 'GraphQL Query Port',
      type: 'graphql',
      typeLabel: 'GraphQL API',
      uri: 'https://api.uipkge.dev/graphql?query=customer360',
      latency: '< 45ms p99',
      status: 'online',
    },
    {
      id: 'port-s3',
      name: 'Parquet Lake Export',
      type: 's3',
      typeLabel: 'Parquet S3 Lake',
      uri: 's3://lakehouse-gold/customer_360/snapshot_latest.parquet',
      latency: '24h Partitioned',
      status: 'online',
    },
  ],
  tags: ['#customer360', '#revenue', '#identity', '#gold_marts', '#dbt_certified'],
  certifiedCompliance: 'SOC2 Type II & GDPR Art. 15 Compliant',
  lastUpdated: 'Aug 21, 2026',
}

export interface DataProductCardProps {
  product?: DataProductData
  variant?: 'full' | 'compact' | 'minimal'
  className?: string
}

export function DataProductCard({ product = DEFAULT_DATA_PRODUCT, variant = 'full', className }: DataProductCardProps) {
  const [copiedPortId, setCopiedPortId] = React.useState<string | null>(null)
  const [accessRequested, setAccessRequested] = React.useState(false)
  const [isQueryingPort, setIsQueryingPort] = React.useState(false)
  const [selectedPortId, setSelectedPortId] = React.useState<string>(product.outputPorts[0]?.id || 'port-snow')

  const selectedPort = product.outputPorts.find((p) => p.id === selectedPortId) || product.outputPorts[0]

  function copyUri(port: OutputPort) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(port.uri)
      setCopiedPortId(port.id)
      setTimeout(() => {
        setCopiedPortId(null)
      }, 2000)
    }
  }

  function handleRequestAccess() {
    setAccessRequested(true)
    setTimeout(() => {
      setAccessRequested(false)
    }, 4000)
  }

  function handleQueryPort() {
    setIsQueryingPort(true)
    setTimeout(() => {
      setIsQueryingPort(false)
    }, 1200)
  }

  return (
    <div data-slot="data-product-card" className={cn('w-full', className)}>
      <Card className="border-border bg-card text-card-foreground hover:border-primary/40 relative flex flex-col overflow-hidden shadow-xs transition-all duration-200 hover:shadow-sm">
        <CardHeader className="space-y-3 p-5 pb-3">
          {/* Badges & Governance Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Domain Tag */}
              <Badge
                wrap
                variant="outline"
                className="border-border bg-muted/30 text-muted-foreground gap-1 text-xs font-normal"
              >
                <Layers className="text-primary size-3" aria-hidden="true" />
                <span>{product.domain}</span>
              </Badge>

              {/* Tier Tag */}
              <Badge
                wrap
                variant="secondary"
                className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                {product.tier}
              </Badge>
            </div>

            {/* Compliance Seal */}
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <ShieldCheck className="size-3.5 text-emerald-500" aria-hidden="true" />
              <span className="hidden font-medium sm:inline">{product.certifiedCompliance}</span>
              <span className="font-medium sm:hidden">SOC2 Certified</span>
            </div>
          </div>

          {/* Title & Version Lockup */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-foreground font-mono text-base font-bold tracking-tight break-all sm:text-lg">
                  {product.name}
                </h3>
                <span className="text-muted-foreground font-mono text-xs font-medium">{product.version}</span>
              </div>

              <Badge wrap variant="outline" className="text-muted-foreground gap-1 text-xs font-normal">
                <Activity className="size-3 animate-pulse text-emerald-500" aria-hidden="true" />
                <span className="font-mono tabular-nums">{product.slaCompliance}% SLA</span>
              </Badge>
            </div>

            {/* Business Value Description */}
            <CardDescription className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              {product.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 p-5 pt-0">
          {/* 4 Key Telemetry Metrics Strip */}
          <div className="border-border/80 bg-muted/20 grid grid-cols-2 gap-2 rounded-lg border p-2.5 text-xs sm:grid-cols-4 sm:p-3">
            <div className="space-y-0.5">
              <span className="text-muted-foreground block">SLA Compliance</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {product.slaCompliance}%
                </span>
                <span className="font-semibold text-emerald-500">✓</span>
              </div>
              <Progress value={product.slaCompliance} className="bg-muted h-1.5" />
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground block">Data Freshness</span>
              <span
                className="text-foreground block truncate font-mono text-xs font-semibold"
                title={product.freshness}
              >
                {product.freshness}
              </span>
              <span className="text-muted-foreground text-xs">SLA: &lt; 1h Target</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground block">Completeness</span>
              <span className="text-foreground block font-mono text-sm font-bold tabular-nums">
                {product.completenessPct}%
              </span>
              <span className="text-muted-foreground text-xs">0.6% Max Nulls</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground block">Active Consumers</span>
              <div className="flex items-center gap-1">
                <Users className="text-primary size-3.5" aria-hidden="true" />
                <span className="text-foreground font-mono text-sm font-bold tabular-nums">
                  {product.activeConsumersCount} Apps
                </span>
              </div>
              <span className="text-muted-foreground text-xs">Certified Live Ports</span>
            </div>
          </div>

          {/* Multi-Modal Output Ports Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-semibold tracking-wide uppercase">
                Certified Multi-Modal Output Ports ({product.outputPorts.length})
              </span>
              <span className="text-muted-foreground text-xs">Click port to inspect URI</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.outputPorts.map((port) => (
                <button
                  key={port.id}
                  type="button"
                  className={cn(
                    'group flex items-start justify-between rounded-lg border p-2.5 text-left transition-all',
                    selectedPortId === port.id
                      ? 'border-primary/50 bg-primary/5 ring-primary/30 ring-1'
                      : 'border-border bg-card/60 hover:border-primary/25 hover:bg-muted/40',
                  )}
                  onClick={() => setSelectedPortId(port.id)}
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <div className="bg-muted text-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md">
                      {port.type === 'snowflake' && <Database className="size-3.5 text-sky-500" aria-hidden="true" />}
                      {port.type === 'kafka' && <Radio className="size-3.5 text-amber-500" aria-hidden="true" />}
                      {port.type === 'graphql' && <Server className="size-3.5 text-purple-500" aria-hidden="true" />}
                      {port.type !== 'snowflake' && port.type !== 'kafka' && port.type !== 'graphql' && (
                        <HardDrive className="size-3.5 text-emerald-500" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground truncate text-xs font-semibold">{port.typeLabel}</span>
                        <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                      </div>
                      <p className="text-muted-foreground truncate font-mono text-xs">{port.name}</p>
                      <p className="text-muted-foreground text-xs font-normal">{port.latency}</p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5 pl-1">
                    {selectedPortId === port.id ? (
                      <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs font-bold">
                        ✓
                      </span>
                    ) : (
                      <ChevronRight
                        className="text-muted-foreground/40 group-hover:text-foreground size-4"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Selected Port URI Inspector Box */}
          <div className="border-border bg-muted/40 flex flex-col gap-2 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-0.5">
              <span className="text-muted-foreground text-xs font-medium">Selected Endpoint URI:</span>
              <p className="text-foreground truncate font-mono text-xs font-medium select-all">{selectedPort?.uri}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 pt-1 sm:pt-0">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => selectedPort && copyUri(selectedPort)}
              >
                {copiedPortId === selectedPort?.id ? (
                  <Check className="size-3 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Copy className="size-3" aria-hidden="true" />
                )}
                <span>{copiedPortId === selectedPort?.id ? 'Copied' : 'Copy URI'}</span>
              </Button>
            </div>
          </div>

          {/* Product Owner & Tags Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Owner Profile */}
            <div className="flex items-center gap-2">
              <Avatar className="border-border size-7 border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {product.owner.fallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground text-xs leading-none font-medium">{product.owner.name}</p>
                <p className="text-muted-foreground text-xs">{product.owner.team}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge
                  wrap
                  key={tag}
                  variant="outline"
                  className="text-muted-foreground border-border/70 text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <Separator />

        {/* Footer Action Controls */}
        <CardFooter className="flex flex-wrap items-center justify-between gap-2 p-4 sm:px-5">
          <div className="text-muted-foreground text-xs">
            Last contract verified: <span className="text-foreground font-medium">{product.lastUpdated}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium"
              disabled={isQueryingPort}
              onClick={handleQueryPort}
            >
              {!isQueryingPort && <Zap className="size-3.5 text-amber-500" aria-hidden="true" />}
              {isQueryingPort ? <span>Running Test Query...</span> : <span>Query Port</span>}
            </Button>

            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
              disabled={accessRequested}
              onClick={handleRequestAccess}
            >
              <KeyRound className="size-3.5" aria-hidden="true" />
              <span>{accessRequested ? 'Access Requested ✓' : 'Request Access'}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
