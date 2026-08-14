'use client'

import * as React from 'react'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Filter,
  Info,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  Trash2,
  User,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export type EventSeverity = 'info' | 'warning' | 'critical'

export interface AuditStreamEvent {
  id: string
  timestamp: string
  severity: EventSeverity
  action: string
  actor: {
    name: string
    type: 'user' | 'service' | 'system'
  }
  sourceIp: string
  geo: string
  target: string
  summary: string
  metadata: Record<string, unknown>
}

export interface AuditEventStreamProps {
  initialEvents?: AuditStreamEvent[]
  initialPaused?: boolean
  initialSeverity?: 'all' | EventSeverity
  initialSearch?: string
  className?: string
}

const defaultEvents: AuditStreamEvent[] = [
  {
    id: 'evt-1094',
    timestamp: '2026-08-21T14:32:05.812Z',
    severity: 'critical',
    action: 'policy.access.denied',
    actor: {
      name: 'd.vader@contractor.io',
      type: 'user',
    },
    sourceIp: '45.33.32.156',
    geo: 'AP-East (HK)',
    target: 'arn:aws:s3:::prod-customer-pii-cold-storage/*',
    summary: 'Cross-boundary access violation to restricted cold storage bucket',
    metadata: {
      request_id: 'req_88f912c9a01',
      resource_arn: 'arn:aws:s3:::prod-customer-pii-cold-storage/*',
      requested_action: 's3:GetObject',
      violation_code: 'UNAUTHORIZED_GEOLOCATION_ACCESS',
      risk_score: 94,
      enforcement: 'blocked_by_guardduty',
      user_agent: 'aws-cli/2.15.30 Python/3.11.8 Darwin/24.1.0',
    },
  },
  {
    id: 'evt-1093',
    timestamp: '2026-08-21T14:31:58.240Z',
    severity: 'critical',
    action: 'vpc.security_group.ingress_created',
    actor: {
      name: 'devops-ci-orchestrator',
      type: 'service',
    },
    sourceIp: '172.31.0.4',
    geo: 'EU-West (IE)',
    target: 'sg-08f912c9aa30 (prod-bastion-sg)',
    summary: 'Security group rule added opening SSH (0.0.0.0/0:22) to public internet',
    metadata: {
      request_id: 'req_39b201a44e',
      security_group_id: 'sg-08f912c9aa30',
      rule: {
        protocol: 'tcp',
        from_port: 22,
        to_port: 22,
        cidr: '0.0.0.0/0',
      },
      compliance_impact: 'NON_COMPLIANT_SOC2_CC6',
      alert: 'AUTOMATIC_SECURITY_REMEDIATION_TRIGGERED',
      quarantine_status: 'isolated_pending_approval',
    },
  },
  {
    id: 'evt-1092',
    timestamp: '2026-08-21T14:31:44.102Z',
    severity: 'warning',
    action: 'api.rate_limit.exceeded',
    actor: {
      name: 'api-gateway-edge',
      type: 'service',
    },
    sourceIp: '203.0.113.195',
    geo: 'EU-Central (FRA)',
    target: 'api.acme.com/v2/organizations/billing/sync',
    summary: 'Customer exceeded tier rate limit of 10,000 req/min (current: 14,820 req/min)',
    metadata: {
      request_id: 'req_a44019bf08',
      client_id: 'app_pub_8829104',
      tier: 'pro_tier',
      limit: '10,000 req/min',
      current_rate: '14,820 req/min',
      burst_allowance: 'exhausted',
      enforced_action: 'http_429_throttled',
      retry_after_seconds: 45,
    },
  },
  {
    id: 'evt-1091',
    timestamp: '2026-08-21T14:31:22.955Z',
    severity: 'warning',
    action: 'auth.mfa.challenge_failed',
    actor: {
      name: 'marcus.lee@acme.corp',
      type: 'user',
    },
    sourceIp: '192.0.2.142',
    geo: 'US-West (SFO)',
    target: 'identity.acme.corp/mfa/challenge',
    summary: 'Multiple consecutive invalid TOTP code attempts detected',
    metadata: {
      request_id: 'req_77d812ef90',
      user_id: 'usr_8830192a',
      attempt_count: 3,
      max_allowed: 5,
      failure_reason: 'totp_token_mismatch',
      client_fingerprint: 'fp_993b2a0018f',
      risk_flag: 'SUSPICIOUS_DEVICE_FINGERPRINT',
    },
  },
  {
    id: 'evt-1090',
    timestamp: '2026-08-21T14:31:05.419Z',
    severity: 'warning',
    action: 'storage.bucket.policy_updated',
    actor: {
      name: 'elena.rostova@acme.corp',
      type: 'user',
    },
    sourceIp: '84.190.201.3',
    geo: 'EU-Central (BER)',
    target: 'prod-exports-transfers-bucket',
    summary: 'CORS origins and bucket policy permissions updated',
    metadata: {
      request_id: 'req_1204891ff3',
      bucket: 'prod-exports-transfers-bucket',
      changes: {
        public_read: false,
        cors_origins: ['https://app.acme.com', 'https://staging.acme.com'],
        ssl_enforced: true,
      },
      review_status: 'PENDING_AUDIT_SIGNOFF',
    },
  },
  {
    id: 'evt-1089',
    timestamp: '2026-08-21T14:30:48.331Z',
    severity: 'info',
    action: 'iam.user.login_success',
    actor: {
      name: 'sarah.connor@acme.corp',
      type: 'user',
    },
    sourceIp: '198.51.100.24',
    geo: 'US-East (NYC)',
    target: 'auth.acme.corp/oauth/callback',
    summary: 'Successful SAML SSO login with WebAuthn hardware token verification',
    metadata: {
      request_id: 'req_66c29188e1',
      auth_provider: 'okta_saml_enterprise',
      mfa_type: 'fido2_yubikey',
      session_id: 'sess_9f82c1a003',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36',
    },
  },
  {
    id: 'evt-1088',
    timestamp: '2026-08-21T14:30:19.780Z',
    severity: 'info',
    action: 'db.secret.rotated',
    actor: {
      name: 'vault-agent-worker',
      type: 'service',
    },
    sourceIp: '10.240.12.88',
    geo: 'US-West (OR)',
    target: 'kv/prod/aurora-primary/credentials',
    summary: 'Automated 30-day credential rotation for primary PostgreSQL cluster',
    metadata: {
      request_id: 'req_55104882c9',
      vault_cluster: 'prod-vault-cluster-01',
      path: 'kv/prod/aurora-primary/credentials',
      ttl_seconds: 2592000,
      databases_updated: ['aurora-writer-01', 'aurora-reader-01', 'aurora-reader-02'],
      status: 'ROTATION_SUCCESS',
    },
  },
  {
    id: 'evt-1087',
    timestamp: '2026-08-21T14:29:55.104Z',
    severity: 'info',
    action: 'repo.deployment.started',
    actor: {
      name: 'github-actions[bot]',
      type: 'service',
    },
    sourceIp: '140.82.112.22',
    geo: 'US-East (IAD)',
    target: 'uipkge/core-registry:main (a3f89b1)',
    summary: 'Production deployment triggered via merge pull request #412',
    metadata: {
      request_id: 'req_44910283aa',
      repository: 'uipkge/core-registry',
      commit_hash: 'a3f89b14e9f',
      environment: 'production',
      pipeline_id: 'pipe_883019',
      runner: 'runner-edge-iad-4',
    },
  },
  {
    id: 'evt-1086',
    timestamp: '2026-08-21T14:29:12.650Z',
    severity: 'info',
    action: 'kms.key.decrypted',
    actor: {
      name: 'payment-service-daemon',
      type: 'service',
    },
    sourceIp: '10.128.4.19',
    geo: 'US-East (VA)',
    target: 'arn:aws:kms:us-east-1:992019482:key/cmk-cardholder-01',
    summary: 'Authorized envelope decryption operation for card tokenization',
    metadata: {
      request_id: 'req_338192001e',
      key_arn: 'arn:aws:kms:us-east-1:992019482:key/cmk-cardholder-01',
      algorithm: 'AES_GCM_256',
      caller_service: 'checkout-v2-pod-88x',
      auth_context: { transaction_id: 'tx_9981203', environment: 'production' },
    },
  },
  {
    id: 'evt-1085',
    timestamp: '2026-08-21T14:28:40.091Z',
    severity: 'info',
    action: 'service.token.revoked',
    actor: {
      name: 'security-automations',
      type: 'system',
    },
    sourceIp: '127.0.0.1',
    geo: 'Internal',
    target: 'tok_expired_929104882',
    summary: 'Routine cleanup revoked expired machine-to-machine JWT token',
    metadata: {
      request_id: 'req_227198300a',
      token_id: 'tok_expired_929104882',
      reason: 'ttl_expiration',
      issued_at: '2026-08-14T00:00:00Z',
      revoked_by: 'system_cron_daemon',
    },
  },
]

function initials(name: string): string {
  if (name.includes('@')) {
    return name.slice(0, 2).toUpperCase()
  }
  return (
    name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'SA'
  )
}

function matchesSearch(event: AuditStreamEvent, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim()

  if (q.startsWith('/') && q.length > 1) {
    const lastSlash = q.lastIndexOf('/')
    if (lastSlash > 0) {
      const pattern = q.slice(1, lastSlash)
      const flags = q.slice(lastSlash + 1)
      try {
        const re = new RegExp(pattern, flags)
        return (
          re.test(event.action) ||
          re.test(event.actor.name) ||
          re.test(event.sourceIp) ||
          re.test(event.geo) ||
          re.test(event.target) ||
          re.test(event.summary) ||
          re.test(JSON.stringify(event.metadata))
        )
      } catch {
        // Fall back to plain search on invalid regex syntax
      }
    }
  }

  const lower = q.toLowerCase()
  return (
    event.action.toLowerCase().includes(lower) ||
    event.actor.name.toLowerCase().includes(lower) ||
    event.sourceIp.toLowerCase().includes(lower) ||
    event.geo.toLowerCase().includes(lower) ||
    event.target.toLowerCase().includes(lower) ||
    event.summary.toLowerCase().includes(lower) ||
    JSON.stringify(event.metadata).toLowerCase().includes(lower)
  )
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toISOString().replace('T', ' ').replace('Z', ' UTC')
  } catch {
    return iso
  }
}

export function AuditEventStream({
  initialEvents,
  initialPaused = false,
  initialSeverity = 'all',
  initialSearch = '',
  className,
}: AuditEventStreamProps) {
  const [events, setEvents] = React.useState<AuditStreamEvent[]>(
    initialEvents ? [...initialEvents] : [...defaultEvents],
  )
  const [isPaused, setIsPaused] = React.useState(initialPaused)
  const [selectedSeverity, setSelectedSeverity] = React.useState<'all' | EventSeverity>(initialSeverity)
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [expandedIds, setExpandedIds] = React.useState<Record<string, boolean>>({
    'evt-1094': true,
  })
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [exportedNotice, setExportedNotice] = React.useState(false)

  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      const matchesSeverity = selectedSeverity === 'all' || event.severity === selectedSeverity
      const matchesText = matchesSearch(event, searchQuery)
      return matchesSeverity && matchesText
    })
  }, [events, selectedSeverity, searchQuery])

  const severityCounts = React.useMemo(() => {
    return {
      all: events.length,
      critical: events.filter((e) => e.severity === 'critical').length,
      warning: events.filter((e) => e.severity === 'warning').length,
      info: events.filter((e) => e.severity === 'info').length,
    }
  }, [events])

  const allExpanded = filteredEvents.length > 0 && filteredEvents.every((e) => expandedIds[e.id])

  function togglePause() {
    setIsPaused((prev) => !prev)
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  function toggleAllExpand() {
    if (allExpanded) {
      setExpandedIds({})
    } else {
      const next: Record<string, boolean> = {}
      filteredEvents.forEach((e) => {
        next[e.id] = true
      })
      setExpandedIds(next)
    }
  }

  function clearStream() {
    setEvents([])
    setExpandedIds({})
  }

  function resetStream() {
    setEvents(initialEvents ? [...initialEvents] : [...defaultEvents])
    setSearchQuery('')
    setSelectedSeverity('all')
    setExpandedIds({ 'evt-1094': true })
  }

  function copyPayload(id: string, metadata: Record<string, unknown>) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
      setCopiedId(id)
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current))
      }, 2000)
    }
  }

  function exportJson() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredEvents, null, 2))
    if (typeof document !== 'undefined') {
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute(
        'download',
        `audit-event-stream-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`,
      )
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setExportedNotice(true)
      setTimeout(() => {
        setExportedNotice(false)
      }, 2000)
    }
  }

  return (
    <div data-slot="audit-event-stream" className={cn('w-full space-y-4', className)}>
      {/* Top Header & Live Telemetry Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-card flex size-10 items-center justify-center rounded-lg border shadow-xs">
            <ShieldAlert className="text-primary size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Audit Event Stream</h2>
              {!isPaused ? (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Live Stream · Connected
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                  Stream Paused
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Real-time security telemetry feed and structured audit trail inspector
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={isPaused ? 'border-amber-500/40 text-amber-600 dark:text-amber-400' : ''}
            onClick={togglePause}
          >
            {isPaused ? (
              <Play className="size-3.5 fill-current" aria-hidden="true" />
            ) : (
              <Pause className="size-3.5" aria-hidden="true" />
            )}
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </Button>

          <Button variant="outline" size="sm" disabled={events.length === 0} onClick={clearStream}>
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span>Clear Stream</span>
          </Button>

          <Button
            aria-label="Download attachment"
            variant="default"
            size="sm"
            disabled={filteredEvents.length === 0}
            onClick={exportJson}
          >
            {exportedNotice ? (
              <Check className="size-3.5 text-emerald-300" aria-hidden="true" />
            ) : (
              <Download className="size-3.5" aria-hidden="true" />
            )}
            <span>{exportedNotice ? 'Exported JSON' : 'Export JSON'}</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input with Regex Support */}
            <div className="relative flex-1">
              <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event action, actor, IP, target, or /regex/..."
                className="pl-9 text-xs"
              />
            </div>

            {/* Severity Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
                <Filter className="size-3" aria-hidden="true" />
                Severity:
              </span>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedSeverity === 'all'
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
                onClick={() => setSelectedSeverity('all')}
              >
                All
                <span
                  className={cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedSeverity === 'all'
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {severityCounts.all}
                </span>
              </button>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedSeverity === 'critical'
                    ? 'border-destructive bg-destructive text-white shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:border-destructive/40 hover:text-destructive',
                )}
                onClick={() => setSelectedSeverity('critical')}
              >
                <span className="size-1.5 rounded-full bg-red-500" />
                Critical
                <span
                  className={cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedSeverity === 'critical' ? 'bg-white/20 text-white' : 'bg-destructive/10 text-destructive',
                  )}
                >
                  {severityCounts.critical}
                </span>
              </button>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedSeverity === 'warning'
                    ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-warning hover:border-amber-500/40',
                )}
                onClick={() => setSelectedSeverity('warning')}
              >
                <span className="size-1.5 rounded-full bg-amber-500" />
                Warning
                <span
                  className={cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedSeverity === 'warning' ? 'bg-white/20 text-white' : 'bg-warning/10 text-warning',
                  )}
                >
                  {severityCounts.warning}
                </span>
              </button>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedSeverity === 'info'
                    ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-info hover:border-sky-500/40',
                )}
                onClick={() => setSelectedSeverity('info')}
              >
                <span className="size-1.5 rounded-full bg-sky-500" />
                Info
                <span
                  className={cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedSeverity === 'info' ? 'bg-white/20 text-white' : 'bg-info/10 text-info',
                  )}
                >
                  {severityCounts.info}
                </span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Log Stream Feed Terminal Card */}
      <Card className="border-border shadow-xs">
        {/* Terminal Header Bar */}
        <div className="bg-muted/40 flex items-center justify-between gap-x-2 border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500/80" />
              <span className="size-2.5 rounded-full bg-amber-500/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-muted-foreground font-mono text-xs">
              telemetry-stream-us-east-1 · ingester-v2 · tcp+tls
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
              Matches: {filteredEvents.length} / {events.length}
            </span>
            <Button
              variant="ghost"
              size="xs"
              className="h-6 gap-1 px-2 text-xs"
              disabled={filteredEvents.length === 0}
              onClick={toggleAllExpand}
            >
              {allExpanded ? (
                <ChevronDown className="size-3" aria-hidden="true" />
              ) : (
                <ChevronRight className="size-3" aria-hidden="true" />
              )}
              <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            </Button>
          </div>
        </div>

        {/* Feed Rows Container */}
        <CardContent className="p-0">
          {/* Empty State when 0 matching events */}
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
              <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                <Shield className="text-muted-foreground size-6 opacity-60" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-sm font-semibold">No audit events match your criteria</p>
                <p className="text-muted-foreground text-xs">
                  {events.length === 0
                    ? 'The event buffer was cleared. Restore default stream data to resume inspection.'
                    : 'Try loosening your severity filter or search query.'}
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={resetStream}>
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Restore stream data
              </Button>
            </div>
          ) : (
            <ul className="divide-border/60 divide-y">
              {filteredEvents.map((event) => {
                const isExpanded = !!expandedIds[event.id]
                return (
                  <li
                    key={event.id}
                    className={cn('group transition-colors', isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20')}
                  >
                    {/* Primary Row Trigger */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      className="focus-visible:ring-ring flex cursor-pointer flex-col gap-3 p-3.5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:flex-row sm:items-center sm:justify-between"
                      onClick={() => toggleExpand(event.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggleExpand(event.id)
                        }
                      }}
                    >
                      {/* Left Rail: Expand Indicator + Timestamp + Severity + Action */}
                      <div className="flex min-w-0 items-start gap-3 sm:items-center">
                        <button
                          type="button"
                          aria-label="Toggle payload details"
                          className={cn(
                            'text-muted-foreground group-hover:text-foreground mt-0.5 shrink-0 transition-transform sm:mt-0',
                            isExpanded && 'text-foreground rotate-90',
                          )}
                        >
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </button>

                        <div className="space-y-1 sm:space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                              {formatTimestamp(event.timestamp)}
                            </span>

                            {event.severity === 'critical' ? (
                              <Badge variant="destructive" className="gap-1 font-mono text-xs uppercase">
                                <AlertCircle className="size-3" aria-hidden="true" />
                                CRIT
                              </Badge>
                            ) : event.severity === 'warning' ? (
                              <Badge variant="warning" className="gap-1 font-mono text-xs uppercase">
                                <AlertTriangle className="size-3" aria-hidden="true" />
                                WARN
                              </Badge>
                            ) : (
                              <Badge variant="info" className="gap-1 font-mono text-xs uppercase">
                                <Info className="size-3" aria-hidden="true" />
                                INFO
                              </Badge>
                            )}

                            <span className="text-foreground font-mono text-xs font-semibold">{event.action}</span>
                          </div>

                          <p className="text-muted-foreground text-xs font-normal">{event.summary}</p>
                        </div>
                      </div>

                      {/* Right Rail: Actor Avatar & Tag + IP & Geo Flag */}
                      <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
                        <div className="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                          <Avatar className="size-4">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {initials(event.actor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-foreground max-w-[130px] truncate font-medium sm:max-w-[180px]">
                            {event.actor.name}
                          </span>
                        </div>

                        <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                          <span>{event.sourceIp}</span>
                          <span className="opacity-50">·</span>
                          <span className="text-foreground/80">{event.geo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Payload Accordion Detail View */}
                    {isExpanded && (
                      <div className="bg-muted/15 border-t px-4 py-3.5">
                        <div className="space-y-3">
                          {/* Target Resource Banner */}
                          <div className="bg-card flex flex-col gap-2 rounded-md border p-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="text-muted-foreground shrink-0 font-medium">Target:</span>
                              <span className="text-foreground truncate font-mono font-medium">{event.target}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">Actor Type:</span>
                              <Badge variant="outline" className="font-mono text-xs capitalize">
                                {event.actor.type === 'user' ? (
                                  <User className="size-3" aria-hidden="true" />
                                ) : event.actor.type === 'service' ? (
                                  <Bot className="size-3" aria-hidden="true" />
                                ) : (
                                  <Server className="size-3" aria-hidden="true" />
                                )}
                                {event.actor.type}
                              </Badge>
                            </div>
                          </div>

                          {/* Syntax Styled JSON Metadata Box */}
                          <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                            <div className="flex items-center justify-between gap-x-2 border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                              <div className="flex items-center gap-2">
                                <Terminal className="size-3.5 text-zinc-400" aria-hidden="true" />
                                <span className="text-xs text-zinc-400">payload_metadata.json</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="xs"
                                className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                                onClick={() => copyPayload(event.id, event.metadata)}
                              >
                                {copiedId === event.id ? (
                                  <Check className="size-3 text-emerald-400" aria-hidden="true" />
                                ) : (
                                  <Copy className="size-3" aria-hidden="true" />
                                )}
                                <span>{copiedId === event.id ? 'Copied' : 'Copy JSON'}</span>
                              </Button>
                            </div>

                            <pre className="max-h-56 overflow-x-auto overflow-y-auto p-3 text-xs leading-relaxed select-text">
                              <code className="text-emerald-400">{JSON.stringify(event.metadata, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>

        {/* Bottom Telemetry Stats Bar */}
        <div className="bg-muted/40 flex flex-col gap-2.5 border-t px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-4">
            <div className="text-foreground flex items-center gap-1.5 font-medium">
              <Activity className="size-3.5 text-emerald-500" aria-hidden="true" />
              <span>Ingestion Rate:</span>
              <span className="font-mono">{isPaused ? '0 evt/s (Paused)' : '42 events/sec'}</span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5" aria-hidden="true" />
              <span>Buffer Size:</span>
              <span className="text-foreground font-mono">1.2 MB / 10 MB (12%)</span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-500" aria-hidden="true" />
              <span>Latency:</span>
              <span className="text-foreground font-mono">~18ms p99</span>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>TLS v1.3 · TCP Keep-Alive · us-east-1a</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
