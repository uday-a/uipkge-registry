'use client'

import * as React from 'react'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  BellOff,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  Eye,
  FileCode2,
  Filter,
  Layers,
  Network,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Table2,
  Terminal,
  Workflow,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface BlastRadiusNode {
  id: string
  name: string
  layer: 'origin' | 'transform' | 'mart' | 'consumer'
  layerLabel: string
  status: 'mutation' | 'impacted' | 'healthy' | 'warning'
  statusLabel: string
  type: string
  description: string
  owner: string
  runtime?: string
}

export interface SchemaDriftIncident {
  id: string
  targetTable: string
  environment: 'Snowflake Prod' | 'Postgres OLTP' | 'Kafka Topics'
  changeType: 'Unexpected Column Added' | 'Data Type Alteration' | 'Nullability Relaxation' | 'Enum Definition Extended'
  driftDiff: string
  diffMode: 'added' | 'altered' | 'relaxed'
  severity: 'low' | 'medium' | 'high'
  severityLabel: string
  blastRadiusSummary: string
  brokenModelsCount: number
  impactedPipelinesCount: number
  detectedAt: string
  actionLabel: string
  isAcknowledged: boolean
  isContractSynced: boolean
  contractYaml: string
  remediationDdl: string
  lineageNodes: BlastRadiusNode[]
}

export interface SchemaDriftAlertBoardProps {
  title?: string
  monitoredEnvironments?: string[]
  activeMutationsCount?: number
  incidents?: SchemaDriftIncident[]
  className?: string
}

const defaultIncidents: SchemaDriftIncident[] = [
  {
    id: 'drift-inc-1',
    targetTable: 'public.users',
    environment: 'Postgres OLTP',
    changeType: 'Unexpected Column Added',
    driftDiff: '+ phone_country_code VARCHAR(8)',
    diffMode: 'added',
    severity: 'low',
    severityLabel: 'Low Non-Breaking',
    blastRadiusSummary: '0 models broken',
    brokenModelsCount: 0,
    impactedPipelinesCount: 0,
    detectedAt: '14m ago',
    actionLabel: 'Add to Data Contract',
    isAcknowledged: false,
    isContractSynced: false,
    contractYaml: `version: 2
models:
  - name: dim_users
    config:
      contract:
        enforced: true
    columns:
      - name: user_id
        data_type: varchar
        constraints:
          - type: not_null
      # Newly detected column added upstream in Postgres OLTP
      - name: phone_country_code
        data_type: varchar(8)
        description: "ISO-3166-1 alpha-2 / E.164 dial prefix added by auth service"
        constraints:
          - type: check
            expression: "length(phone_country_code) <= 8"`,
    remediationDdl: `-- Automated dbt / Snowflake staging sync
ALTER TABLE raw_postgres.users
  ADD COLUMN IF NOT EXISTS phone_country_code VARCHAR(8);

-- Mark schema contract version 2.4 compliant
COMMENT ON COLUMN raw_postgres.users.phone_country_code IS 'Auto-registered by UIPKGE schema-drift-guardian';`,
    lineageNodes: [
      {
        id: 'node-users-origin',
        name: 'public.users',
        layer: 'origin',
        layerLabel: 'Postgres Source Table',
        status: 'mutation',
        statusLabel: 'Column Added (+1 col)',
        type: 'Postgres Table',
        description: 'OLTP user management table with new phone_country_code attribute.',
        owner: '#team-auth',
      },
      {
        id: 'node-users-ingest',
        name: 'fivetran.raw_postgres_users',
        layer: 'transform',
        layerLabel: 'CDC Connector Stream',
        status: 'healthy',
        statusLabel: 'CDC Auto-Synced',
        type: 'Fivetran Log-Based CDC',
        description: 'Automated column replication synced to Snowflake bronze raw zone.',
        owner: '#data-platform',
        runtime: '<2m latency',
      },
      {
        id: 'node-users-stg',
        name: 'dbt.stg_users',
        layer: 'transform',
        layerLabel: 'dbt Staging View',
        status: 'healthy',
        statusLabel: '0 Breaking (Explicit Select)',
        type: 'dbt View Model',
        description: 'Explicit column projection prevents unmapped column propagation.',
        owner: '#data-eng',
        runtime: '12s run',
      },
      {
        id: 'node-users-dim',
        name: 'marts.dim_customers',
        layer: 'mart',
        layerLabel: 'Core Dimension Mart',
        status: 'healthy',
        statusLabel: 'Contract Compliant',
        type: 'Snowflake Dynamic Table',
        description: 'Certified dimension table feeding marketing cohorts and customer 360.',
        owner: '#data-eng',
      },
      {
        id: 'node-users-crm',
        name: 'HubSpot Reverse ETL Sync',
        layer: 'consumer',
        layerLabel: 'Operational Reverse ETL',
        status: 'healthy',
        statusLabel: 'Active · 0 Failures',
        type: 'Census Sync Pipeline',
        description: 'Outbound sync to HubSpot Marketing Hub CRM contacts.',
        owner: '#rev-ops',
      },
    ],
  },
  {
    id: 'drift-inc-2',
    targetTable: 'analytics.fct_orders',
    environment: 'Snowflake Prod',
    changeType: 'Data Type Alteration',
    driftDiff: 'discount_amount FLOAT -> DECIMAL(18,2)',
    diffMode: 'altered',
    severity: 'medium',
    severityLabel: 'Medium Warning',
    blastRadiusSummary: '2 dbt models affected',
    brokenModelsCount: 0,
    impactedPipelinesCount: 2,
    detectedAt: '32m ago',
    actionLabel: 'Inspect Model Lineage',
    isAcknowledged: false,
    isContractSynced: false,
    contractYaml: `version: 2
models:
  - name: fct_orders
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: varchar
      - name: gross_amount
        data_type: decimal(18,2)
      # Altered type: FLOAT replaced with exact high-precision DECIMAL(18,2)
      - name: discount_amount
        data_type: decimal(18,2) # Previously float64
        description: "Monetary discount in USD with exact 2 decimal place precision"
        constraints:
          - type: check
            expression: "discount_amount >= 0"`,
    remediationDdl: `-- Model Migration Patch for dbt Intermediate Layers:
-- Fix implicit float casting in int_daily_revenue and int_order_discounts:

ALTER TABLE production_dw.analytics.fct_orders
  ALTER COLUMN discount_amount SET DATA TYPE DECIMAL(18,2);

-- Update dbt schema contract definition:
-- dbt run --select int_daily_revenue+ --vars '{ "allow_decimal_cast": true }'`,
    lineageNodes: [
      {
        id: 'node-orders-origin',
        name: 'analytics.fct_orders',
        layer: 'origin',
        layerLabel: 'Warehouse Fact Table',
        status: 'mutation',
        statusLabel: 'Type Alteration (FLOAT -> DECIMAL)',
        type: 'Snowflake Incremental',
        description: 'Core financial transactions mart table receiving monetary precision fix.',
        owner: '#finance-data',
      },
      {
        id: 'node-orders-int-rev',
        name: 'dbt.int_daily_revenue',
        layer: 'transform',
        layerLabel: 'dbt Intermediate Model',
        status: 'impacted',
        statusLabel: 'Impacted (Sum Float Warning)',
        type: 'dbt Incremental Model',
        description: 'Aggregates daily gross/net sales; needs explicit decimal cast in SUM expression.',
        owner: '#data-eng',
        runtime: '1m 18s',
      },
      {
        id: 'node-orders-int-disc',
        name: 'dbt.int_order_discounts',
        layer: 'transform',
        layerLabel: 'dbt Intermediate Model',
        status: 'impacted',
        statusLabel: 'Impacted (Join Key Precision)',
        type: 'dbt View Model',
        description: 'Promotional discount matrix model joined on discount_amount thresholds.',
        owner: '#data-eng',
        runtime: '45s',
      },
      {
        id: 'node-orders-mart',
        name: 'marts.fct_monthly_financials',
        layer: 'mart',
        layerLabel: 'Gold Financial Mart',
        status: 'healthy',
        statusLabel: 'Sanitized Output (Safe)',
        type: 'Snowflake Mart Table',
        description: 'GAAP revenue mart used for board reporting and audit ledger.',
        owner: '#finance-ops',
      },
      {
        id: 'node-orders-looker',
        name: 'Looker ARR & Margin Dashboard',
        layer: 'consumer',
        layerLabel: 'Executive BI Dashboard',
        status: 'warning',
        statusLabel: '1 Tile Check Advised',
        type: 'Looker Explore Tile',
        description: 'C-Suite executive dashboard tracking daily net margin & discount rates.',
        owner: '#bi-analytics',
      },
      {
        id: 'node-orders-netsuite',
        name: 'Finance NetSuite Journal Sync',
        layer: 'consumer',
        layerLabel: 'Accounting ERP Pipeline',
        status: 'healthy',
        statusLabel: 'Decimal Compatible (Safe)',
        type: 'Census Batch Sync',
        description: 'Hourly journal entry creation into Oracle NetSuite ERP general ledger.',
        owner: '#accounting',
      },
    ],
  },
  {
    id: 'drift-inc-3',
    targetTable: 'kafka.events.checkout',
    environment: 'Kafka Topics',
    changeType: 'Nullability Relaxation',
    driftDiff: 'zip_code became nullable',
    diffMode: 'relaxed',
    severity: 'low',
    severityLabel: 'Low',
    blastRadiusSummary: '0 broken',
    brokenModelsCount: 0,
    impactedPipelinesCount: 0,
    detectedAt: '2h ago',
    actionLabel: 'Add to Data Contract',
    isAcknowledged: false,
    isContractSynced: false,
    contractYaml: `version: 2
sources:
  - name: kafka_stream
    tables:
      - name: events_checkout
        columns:
          - name: session_id
            data_type: varchar
            constraints:
              - type: not_null
          # Nullability relaxed for international orders lacking postal codes
          - name: zip_code
            data_type: varchar(16)
            constraints: [] # NULLABLE accepted for international territories`,
    remediationDdl: `-- Event Stream Deserialization Schema Update (Avro/JSON Schema Registry):
{
  "name": "zip_code",
  "type": ["null", "string"],
  "default": null,
  "doc": "Postal code optional for international checkout territories"
}`,
    lineageNodes: [
      {
        id: 'node-kafka-origin',
        name: 'kafka.events.checkout',
        layer: 'origin',
        layerLabel: 'Event Stream Topic',
        status: 'mutation',
        statusLabel: 'Nullability Relaxed',
        type: 'Kafka Partition Stream',
        description: 'Real-time e-commerce checkout session payload stream.',
        owner: '#checkout-squad',
      },
      {
        id: 'node-kafka-flink',
        name: 'flink.checkout_stream_enrichment',
        layer: 'transform',
        layerLabel: 'Flink Stream Processing',
        status: 'healthy',
        statusLabel: 'COALESCE Handler Active',
        type: 'Apache Flink Job',
        description: 'Streaming enrichment with geo-IP fallback when zip_code is null.',
        owner: '#stream-eng',
        runtime: '<500ms streaming',
      },
      {
        id: 'node-kafka-mart',
        name: 'analytics.fct_checkout_events',
        layer: 'mart',
        layerLabel: 'Realtime Bronze Table',
        status: 'healthy',
        statusLabel: 'Schema Compatible',
        type: 'Snowflake Raw Event Table',
        description: 'Append-only event log capturing checkout telemetry.',
        owner: '#analytics-eng',
      },
      {
        id: 'node-kafka-bi',
        name: 'Realtime Checkout Conversion Board',
        layer: 'consumer',
        layerLabel: 'Operations Monitor',
        status: 'healthy',
        statusLabel: 'Active · 0 Failures',
        type: 'Grafana Live Dashboard',
        description: 'Ops NOC wallboard monitoring conversion rates per minute.',
        owner: '#growth-team',
      },
    ],
  },
]

export function SchemaDriftAlertBoard({
  title = 'Data Warehouse Schema Drift & Anomaly Alerts',
  monitoredEnvironments = ['Snowflake Prod', 'Postgres OLTP', 'Kafka Topics'],
  activeMutationsCount = 2,
  incidents,
  className,
}: SchemaDriftAlertBoardProps) {
  const [incidentsList, setIncidentsList] = React.useState<SchemaDriftIncident[]>(() =>
    incidents ? JSON.parse(JSON.stringify(incidents)) : defaultIncidents,
  )

  const [selectedIncidentId, setSelectedIncidentId] = React.useState<string>('drift-inc-2')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>('all')
  const [isMutedNonBreaking, setIsMutedNonBreaking] = React.useState(false)
  const [isSyncingAll, setIsSyncingAll] = React.useState(false)
  const [allAcknowledged, setAllAcknowledged] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<'lineage' | 'yaml' | 'sql'>('lineage')

  const selectedIncident = React.useMemo(() => {
    return incidentsList.find((inc) => inc.id === selectedIncidentId) ?? incidentsList[0]
  }, [incidentsList, selectedIncidentId])

  const filteredIncidents = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return incidentsList.filter((item) => {
      if (isMutedNonBreaking && item.severity === 'low') {
        return false
      }

      const matchesEnv = selectedEnvironment === 'all' || item.environment === selectedEnvironment
      const matchesSev = selectedSeverity === 'all' || item.severity === selectedSeverity
      const matchesQuery =
        !query ||
        item.targetTable.toLowerCase().includes(query) ||
        item.changeType.toLowerCase().includes(query) ||
        item.driftDiff.toLowerCase().includes(query) ||
        item.environment.toLowerCase().includes(query)

      return matchesEnv && matchesSev && matchesQuery
    })
  }, [incidentsList, isMutedNonBreaking, selectedEnvironment, selectedSeverity, searchQuery])

  const activeMutationsSummary = React.useMemo(() => {
    const unacknowledged = incidentsList.filter((i) => !i.isAcknowledged)
    return `${unacknowledged.length} Active Schema Mutations Detected`
  }, [incidentsList])

  const handleAcknowledgeAndSync = () => {
    if (isSyncingAll) return
    setIsSyncingAll(true)

    setTimeout(() => {
      setIncidentsList((prev) =>
        prev.map((item) => ({
          ...item,
          isAcknowledged: true,
          isContractSynced: true,
        })),
      )
      setIsSyncingAll(false)
      setAllAcknowledged(true)
    }, 900)
  }

  const handleToggleMute = () => {
    setIsMutedNonBreaking((prev) => !prev)
  }

  const handleRowAction = (incident: SchemaDriftIncident) => {
    setSelectedIncidentId(incident.id)
    if (incident.changeType === 'Data Type Alteration') {
      setActiveTab('lineage')
    } else {
      setIncidentsList((prev) =>
        prev.map((item) =>
          item.id === incident.id ? { ...item, isContractSynced: !item.isContractSynced, isAcknowledged: true } : item,
        ),
      )
    }
  }

  const copyCode = (key: string, code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr))
      }, 2000)
    }
  }

  return (
    <div data-slot="schema-drift-alert-board" className={cn('text-foreground w-full space-y-6', className)}>
      {/* Header Section */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Title & Monitored Environments */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 shadow-xs dark:text-amber-400">
                  <ShieldAlert className="size-4.5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-foreground font-mono text-lg font-bold tracking-tight break-all sm:text-xl">
                      {title}
                    </h1>
                    <Badge
                      wrap
                      variant={allAcknowledged ? 'success' : 'warning'}
                      className="gap-1.5 px-2.5 py-0.5 font-mono text-xs font-semibold"
                    >
                      {!allAcknowledged ? (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                        </span>
                      ) : (
                        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {allAcknowledged ? 'All Contracts Synced' : activeMutationsSummary}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-muted-foreground font-medium">Monitored Environments:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {monitoredEnvironments.map((env) => (
                        <span
                          key={env}
                          className="border-border bg-muted/60 text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs"
                        >
                          {env.includes('Snowflake') ? (
                            <Database className="size-3 text-sky-500" />
                          ) : env.includes('Postgres') ? (
                            <Layers className="size-3 text-indigo-500" />
                          ) : (
                            <Activity className="size-3 text-amber-500" />
                          )}
                          {env}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 gap-1.5 text-xs shadow-xs',
                  isMutedNonBreaking &&
                    'border-amber-500/40 bg-amber-500/10 font-medium text-amber-600 dark:text-amber-400',
                )}
                onClick={handleToggleMute}
              >
                {isMutedNonBreaking ? <BellOff className="size-3.5" /> : <BellRing className="size-3.5" />}
                <span>{isMutedNonBreaking ? 'Muted (Non-Breaking Hidden)' : 'Mute Non-Breaking Alerts'}</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
                disabled={isSyncingAll}
                onClick={handleAcknowledgeAndSync}
              >
                <RefreshCw className={cn('size-3.5', isSyncingAll && 'animate-spin')} />
                {allAcknowledged && <Check className="size-3.5 text-emerald-300" />}
                <span>
                  {isSyncingAll
                    ? 'Syncing Schema Contracts...'
                    : allAcknowledged
                      ? 'Contracts Synced & Locked'
                      : 'Acknowledge & Sync Contracts'}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Sub-banner SLA Bar */}
        <div className="border-border/80 bg-muted/30 text-muted-foreground flex flex-col gap-2 border-t px-5 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-mono">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Realtime Schema Contract Gate: Active (CDC Triggers & dbt Artifact Audits)</span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Detection Engine:{' '}
              <strong className="text-foreground font-mono font-medium">UIPKGE Drift Sentinel v2.4</strong>
            </span>
            <Separator orientation="vertical" className="hidden h-3 sm:block" />
            <span className="font-mono">Checked 14s ago</span>
          </div>
        </div>
      </Card>
      {/* 4 Drift Telemetry Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Active Drift Incidents */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Active Drift Incidents
              </p>
              <div className="flex size-7 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                2 Anomalies Active
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 flex items-center justify-between rounded-md px-2 py-1 text-xs">
              <span className="text-muted-foreground">Severity Split</span>
              <span className="text-foreground font-mono font-medium">1 Warning · 1 Low</span>
            </div>
            <p className="text-muted-foreground text-xs">2 Active Schema Mutations Detected</p>
          </CardContent>
        </Card>

        {/* Card 2: Broken Downstream Models */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Broken Downstream Models
              </p>
              <div className="flex size-7 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                0 Broken Models
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 flex items-center justify-between rounded-md px-2 py-1 text-xs">
              <span className="text-muted-foreground">Impacted Pipelines</span>
              <span className="font-mono font-medium text-amber-600 dark:text-amber-400">2 Impacted Pipelines</span>
            </div>
            <p className="text-muted-foreground text-xs">Zero outages · 100% DAG pipeline uptime maintained</p>
          </CardContent>
        </Card>

        {/* Card 3: Schema Audits in 24h */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Schema Audits in 24h</p>
              <div className="border-border bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                <Activity className="size-4 text-sky-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1,840</span>
              <Badge wrap variant="outline" className="font-mono text-xs">
                100% evaluated
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <Progress value={100} className="h-1.5 w-full" />
            <p className="text-muted-foreground text-xs">Continuous CDC & dbt schema contract verification</p>
          </CardContent>
        </Card>

        {/* Card 4: Mean Time to Acknowledge */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Mean Time to Acknowledge
              </p>
              <div className="flex size-7 items-center justify-center rounded-md border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">12m</span>
              <Badge wrap variant="success" className="text-xs font-medium">
                -4.2m vs 30d
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 flex items-center justify-between rounded-md px-2 py-1 text-xs">
              <span className="text-muted-foreground">SLA Compliance</span>
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">98.4% within SLA</span>
            </div>
            <p className="text-muted-foreground text-xs">Target &lt; 30m response for Tier-1 Gold Marts</p>
          </CardContent>
        </Card>
      </div>

      {/* Schema Drift Incidents Table Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="flex flex-col gap-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Schema Drift & Mutation Incidents</CardTitle>
              <Badge wrap variant="secondary" className="font-mono text-xs">
                {filteredIncidents.length} of {incidentsList.length} Tracked
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Detected structural schema variances, missing or unmapped columns, type widening, and nullability
              relaxations.
            </CardDescription>
          </div>

          {/* Filter Pills by Severity */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              className={cn(
                'h-7 rounded-full text-xs transition-colors',
                selectedSeverity === 'all' && 'border-primary bg-primary text-primary-foreground font-medium',
              )}
              onClick={() => setSelectedSeverity('all')}
            >
              All Severities ({incidentsList.length})
            </Button>
            <Button
              variant="outline"
              size="xs"
              className={cn(
                'h-7 rounded-full text-xs transition-colors',
                selectedSeverity === 'medium' && 'border-amber-600 bg-amber-600 font-medium text-white',
              )}
              onClick={() => setSelectedSeverity('medium')}
            >
              Medium Warning (1)
            </Button>
            <Button
              variant="outline"
              size="xs"
              className={cn(
                'h-7 rounded-full text-xs transition-colors',
                selectedSeverity === 'low' && 'border-sky-600 bg-sky-600 font-medium text-white',
              )}
              onClick={() => setSelectedSeverity('low')}
            >
              Low / Non-Breaking (2)
            </Button>
          </div>
        </CardHeader>

        {/* Filter Toolbar */}
        <div className="border-border/60 border-t p-4 pt-3 pb-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search table, column, environment, or mutation diff..."
                className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
                <Filter className="size-3" />
                Environment:
              </span>
              {['all', 'Snowflake Prod', 'Postgres OLTP', 'Kafka Topics'].map((env) => (
                <Button
                  key={env}
                  variant="outline"
                  size="xs"
                  className={cn(
                    'h-7 font-mono text-xs',
                    selectedEnvironment === env && 'border-foreground bg-foreground text-background font-semibold',
                  )}
                  onClick={() => setSelectedEnvironment(env)}
                >
                  {env === 'all' ? 'All Environments' : env}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="border-border/60 overflow-x-auto border-t">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="min-w-[200px] text-xs font-semibold">Target Entity & Env</TableHead>
                  <TableHead className="min-w-[170px] text-xs font-semibold">Mutation Type</TableHead>
                  <TableHead className="min-w-[260px] text-xs font-semibold">Schema Drift Diff</TableHead>
                  <TableHead className="min-w-[130px] text-xs font-semibold">Severity</TableHead>
                  <TableHead className="min-w-[140px] text-xs font-semibold">Blast Radius</TableHead>
                  <TableHead className="min-w-[90px] text-xs font-semibold">Detected</TableHead>
                  <TableHead className="min-w-[160px] text-right text-xs font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow
                    key={incident.id}
                    className={cn(
                      'hover:bg-muted/30 cursor-pointer transition-colors',
                      selectedIncidentId === incident.id && 'bg-primary/5 ring-primary/20 ring-1',
                    )}
                    onClick={() => setSelectedIncidentId(incident.id)}
                  >
                    {/* Target Table & Environment */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
                          {incident.environment.includes('Snowflake') ? (
                            <Database className="size-3.5 shrink-0 text-sky-500" />
                          ) : incident.environment.includes('Postgres') ? (
                            <Layers className="size-3.5 shrink-0 text-indigo-500" />
                          ) : (
                            <Activity className="size-3.5 shrink-0 text-amber-500" />
                          )}
                          <span>{incident.targetTable}</span>
                        </div>
                        <Badge
                          wrap
                          variant="outline"
                          className="border-border/80 text-muted-foreground font-mono text-xs font-normal"
                        >
                          {incident.environment}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Mutation Type */}
                    <TableCell className="py-3">
                      <span className="text-foreground text-xs font-medium">{incident.changeType}</span>
                    </TableCell>

                    {/* Schema Drift Diff */}
                    <TableCell className="py-3">
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium',
                          incident.diffMode === 'added' &&
                            'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                          incident.diffMode === 'altered' &&
                            'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                          incident.diffMode === 'relaxed' &&
                            'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
                        )}
                      >
                        <code>{incident.driftDiff}</code>
                      </div>
                    </TableCell>

                    {/* Severity Badge */}
                    <TableCell className="py-3">
                      <Badge
                        wrap
                        variant={incident.severity === 'medium' ? 'warning' : 'secondary'}
                        className="gap-1 text-xs font-medium"
                      >
                        {incident.severity === 'medium' ? (
                          <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <AlertCircle className="size-3 text-sky-600 dark:text-sky-400" />
                        )}
                        {incident.severityLabel}
                      </Badge>
                    </TableCell>

                    {/* Blast Radius Summary */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <span
                          className={cn(
                            'block font-mono text-xs font-medium',
                            incident.impactedPipelinesCount > 0
                              ? 'font-semibold text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400',
                          )}
                        >
                          {incident.blastRadiusSummary}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {incident.brokenModelsCount} broken · {incident.impactedPipelinesCount} impacted
                        </span>
                      </div>
                    </TableCell>

                    {/* Detected Time */}
                    <TableCell className="text-muted-foreground py-3 font-mono text-xs">
                      {incident.detectedAt}
                    </TableCell>

                    {/* Action Button */}
                    <TableCell className="py-3 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        className={cn(
                          'h-7 gap-1 text-xs font-medium shadow-xs',
                          incident.isContractSynced &&
                            'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowAction(incident)
                        }}
                      >
                        {incident.isContractSynced ? (
                          <Check className="size-3" />
                        ) : incident.changeType === 'Data Type Alteration' ? (
                          <Eye className="text-primary size-3" />
                        ) : (
                          <Workflow className="size-3" />
                        )}
                        <span>{incident.isContractSynced ? 'Contract Synced' : incident.actionLabel}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredIncidents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <CheckCircle2 className="size-7 text-emerald-500" />
                        <p className="text-foreground text-sm font-medium">
                          No schema drift incidents match active filters
                        </p>
                        <p className="text-muted-foreground text-xs">
                          All active monitored entities adhere strictly to baseline contracts.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="border-border/60 bg-muted/20 text-muted-foreground flex flex-col gap-2 border-t px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Click any incident row to trace downstream blast radius lineage and contract YAML.</span>
            </div>
            <span className="font-mono text-xs">
              Active Incident Focus:{' '}
              <strong className="text-foreground font-bold">{selectedIncident.targetTable}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Blast Radius Lineage Tree Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-border/80 border-b p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Workflow className="text-primary size-5" />
                <CardTitle className="text-base font-semibold">Downstream Blast Radius & Lineage Impact Tree</CardTitle>
                <Badge wrap variant="outline" className="font-mono text-xs font-semibold">
                  {selectedIncident.targetTable}
                </Badge>
                <Badge
                  wrap
                  variant={selectedIncident.severity === 'medium' ? 'warning' : 'secondary'}
                  className="font-mono text-xs"
                >
                  {selectedIncident.changeType}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Automated topological DAG trace evaluating impacted dbt models, Snowflake views, Looker semantic tiles,
                and operational syncs.
              </CardDescription>
            </div>

            {/* View Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 text-xs',
                  activeTab === 'lineage' && 'border-primary bg-primary/10 text-primary font-semibold',
                )}
                onClick={() => setActiveTab('lineage')}
              >
                <Network className="size-3.5" />
                <span>Lineage Tree</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 text-xs',
                  activeTab === 'yaml' && 'border-primary bg-primary/10 text-primary font-semibold',
                )}
                onClick={() => setActiveTab('yaml')}
              >
                <FileCode2 className="size-3.5" />
                <span>Contract YAML Diff</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 text-xs',
                  activeTab === 'sql' && 'border-primary bg-primary/10 text-primary font-semibold',
                )}
                onClick={() => setActiveTab('sql')}
              >
                <Terminal className="size-3.5" />
                <span>Remediation DDL</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {/* TAB 1: Multi-Tier Blast Radius Lineage Tree */}
          {activeTab === 'lineage' && (
            <div className="space-y-4">
              {/* Summary impact pill strip */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="border-border/80 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
                  <span className="text-muted-foreground block">Mutation Origin</span>
                  <span className="text-foreground block truncate font-mono font-bold">
                    {selectedIncident.targetTable}
                  </span>
                  <span className="text-muted-foreground text-xs">{selectedIncident.environment}</span>
                </div>

                <div className="border-border/80 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
                  <span className="text-muted-foreground block">Total Nodes in DAG</span>
                  <span className="text-foreground block font-mono text-base font-bold">
                    {selectedIncident.lineageNodes.length} Tiers
                  </span>
                  <span className="text-muted-foreground text-xs">Topologically ordered</span>
                </div>

                <div className="border-border/80 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
                  <span className="text-muted-foreground block">Impacted Pipelines</span>
                  <span
                    className={cn(
                      'block font-mono text-base font-bold',
                      selectedIncident.impactedPipelinesCount > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400',
                    )}
                  >
                    {selectedIncident.impactedPipelinesCount} Models Impacted
                  </span>
                  <span className="text-muted-foreground text-xs">Requires cast adjustment</span>
                </div>

                <div className="border-border/80 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
                  <span className="text-muted-foreground block">Broken Models</span>
                  <span className="block font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                    0 Outages
                  </span>
                  <span className="text-muted-foreground text-xs">Zero pipeline failures</span>
                </div>
              </div>

              {/* Multi-Tier Lineage Flow Nodes */}
              <div className="border-border bg-muted/10 space-y-3 rounded-xl border p-4">
                <div className="border-border/60 flex items-center justify-between border-b pb-2 text-xs">
                  <span className="text-muted-foreground font-semibold tracking-wider uppercase">
                    Downstream Dependency DAG Flow (Left to Right)
                  </span>
                  <span className="text-muted-foreground font-mono text-xs">
                    Active Drift: <code className="text-foreground font-bold">{selectedIncident.driftDiff}</code>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {selectedIncident.lineageNodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={cn(
                        'space-y-2 rounded-lg border p-3 text-xs shadow-xs transition-all',
                        node.status === 'mutation' && 'border-amber-500/40 bg-amber-500/5',
                        node.status === 'impacted' && 'border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30',
                        node.status === 'warning' && 'border-yellow-500/40 bg-yellow-500/5',
                        node.status === 'healthy' && 'border-border bg-card',
                      )}
                    >
                      {/* Node Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <div
                            className={cn(
                              'flex size-7 shrink-0 items-center justify-center rounded-md border text-xs',
                              node.status === 'mutation' &&
                                'border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400',
                              node.status === 'impacted' &&
                                'border-amber-500/40 bg-amber-500/20 text-amber-600 dark:text-amber-400',
                              node.status === 'warning' &&
                                'border-yellow-500/30 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
                              node.status === 'healthy' && 'border-border bg-muted text-foreground',
                            )}
                          >
                            {node.layer === 'origin' ? (
                              <Database className="size-3.5" />
                            ) : node.layer === 'transform' ? (
                              <Layers className="size-3.5" />
                            ) : node.layer === 'mart' ? (
                              <Table2 className="size-3.5" />
                            ) : (
                              <ArrowUpRight className="size-3.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground font-mono text-xs">#{index + 1}</span>
                              <span className="text-foreground block min-w-0 truncate font-mono font-bold">
                                {node.name}
                              </span>
                            </div>
                            <span className="text-muted-foreground block truncate text-xs">{node.layerLabel}</span>
                          </div>
                        </div>

                        <Badge
                          wrap
                          variant={
                            node.status === 'healthy' ? 'outline' : node.status === 'warning' ? 'secondary' : 'warning'
                          }
                          className="shrink-0 font-mono text-xs font-medium"
                        >
                          {node.status === 'healthy' ? (
                            <CheckCircle2 className="size-3 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="size-3" />
                          )}
                          {node.statusLabel}
                        </Badge>
                      </div>

                      {/* Node Description */}
                      <p className="text-muted-foreground text-xs leading-relaxed">{{ ...node }.description}</p>

                      {/* Node Meta Footer */}
                      <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs">
                        <span>{node.type}</span>
                        <span>{node.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Contract YAML Diff */}
          {activeTab === 'yaml' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode2 className="text-primary size-4" />
                  <span className="text-foreground font-mono text-xs font-semibold">
                    models/contracts/{selectedIncident.targetTable.replace('.', '_')}_contract.yml
                  </span>
                  <Badge wrap variant="secondary" className="font-mono text-xs">
                    dbt v1.8 Contract Definition
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="xs"
                  className="h-7 gap-1 text-xs"
                  onClick={() => copyCode('yaml', selectedIncident.contractYaml)}
                >
                  {copiedKey === 'yaml' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  <span>{copiedKey === 'yaml' ? 'Copied YAML!' : 'Copy YAML Contract'}</span>
                </Button>
              </div>

              <div className="border-border overflow-x-auto rounded-lg border bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 dark:bg-neutral-950">
                <pre className="whitespace-pre">
                  <code>{selectedIncident.contractYaml}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Remediation DDL */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="text-primary size-4" />
                  <span className="text-foreground font-mono text-xs font-semibold">
                    remediation_migration_{selectedIncident.targetTable.replace('.', '_')}.sql
                  </span>
                  <Badge wrap variant="outline" className="font-mono text-xs">
                    Warehouse DDL Patch
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="xs"
                  className="h-7 gap-1 text-xs"
                  onClick={() => copyCode('sql', selectedIncident.remediationDdl)}
                >
                  {copiedKey === 'sql' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  <span>{copiedKey === 'sql' ? 'Copied SQL!' : 'Copy Migration SQL'}</span>
                </Button>
              </div>

              <div className="border-border overflow-x-auto rounded-lg border bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 dark:bg-neutral-950">
                <pre className="whitespace-pre">
                  <code>{selectedIncident.remediationDdl}</code>
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SchemaDriftAlertBoard
