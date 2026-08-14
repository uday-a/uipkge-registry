'use client'

import * as React from 'react'
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck,
  FileDown,
  GitPullRequest,
  KeyRound,
  Lock,
  Plus,
  Radio,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

export interface SecurityIncidentTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  incidentId?: string
  incidentTitle?: string
  severity?: string
  status?: string
  commanderName?: string
  commanderRole?: string
}

const logSnippets: Record<string, string> = {
  detection: `[2026-08-21T14:12:08.104Z] GUARDDUTY_ALERT: UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS
PrincipalId: AROA4491X0921:github-worker-ephemeral-tok_88f9x
RequestedRole: arn:aws:iam::102938475612:role/SuperAdminPolicy
SourceIP: 198.51.100.42 (Tor Exit Node AS13335) | UserAgent: aws-cli/2.15.30 Python/3.11.8
RiskScore: 98/100 | FindingId: gd-find-8891-c0a1-992a | Action: STS:AssumeRoleWithWebIdentity`,

  triage: `[2026-08-21T14:15:30.412Z] INCIDENT_WAR_ROOM_ESTABLISHED: bridge_id=bridge_sec_0842
IncidentCommander: elena.rostova@acme.corp | Responders: [m.vance, d.okoye, j.chen]
VectorAnalysis: Ephemeral token tok_88f9x generated in GH Actions workflow run #1049281.
ScopeAssessment: Ingress proxy read cache queried; zero write or database mutation detected.
EscalationLevel: SEV-1 (Paging IAM + Platform on-call)`,

  containment: `[2026-08-21T14:22:15.890Z] CLOUDFLARE_WAF_ENFORCED: rule_id=sec_block_tor_asn_13335 action=BLOCK
GatewaysSynced: [apigw-iad-prod-01, apigw-iad-prod-02, apigw-iad-prod-03] (3/3 nodes OK)
ActiveConnectionsDropped: 14 concurrent TCP streams | RateLimit: 0 req/sec allowed from source
EgressQuarantine: ALL external routes from adversary subnet blackholed.`,

  revocation: `[2026-08-21T14:30:53.002Z] VAULT_REVOCATION_BROADCAST: lease_prefix=auth/token/tok_88f9x leases_revoked=38
KMS_KEY_ROTATED: arn:aws:kms:us-east-1:102938475612:key/cmk-gateway-signing-02 -> key_version_v3
RedisClusterBroadcast: AUTH_CACHE_PURGE_SUCCESS (12/12 shards synchronized in 84ms)
TokenVerificationState: REVOCATION_COMPLETE (0 surviving tokens)`,

  postmortem: `[2026-08-21T14:48:00.651Z] SOC_AUDIT_SWEEP: duration=15m00s | unauthorized_calls=0 | perimeter_status=NOMINAL
IncidentStatusTransition: SEV-1_ACTIVE -> MITIGATED_POST_MORTEM
ForensicsArchive: s3://sec-incident-vault-us-east-1/incidents/2026-0842/evidence_bundle.tar.gz.enc
EvidenceSignOff: [m.vance, e.rostova] | Hash: sha256:7f83b1657ff1fc53b92dc18148a1d65`,
}

export function SecurityIncidentTimeline({
  incidentId = '#SEC-INC-2026-0842',
  incidentTitle = 'Unauthorized API Token Elevation Attempt',
  severity = 'SEV-1 Critical',
  status = 'Mitigated / In Post-Mortem',
  commanderName = 'Marcus Vance',
  commanderRole = 'Principal SecOps · Incident Commander',
  className,
  ...props
}: SecurityIncidentTimelineProps) {
  const [isResolved, setIsResolved] = React.useState(false)
  const [exportNotification, setExportNotification] = React.useState(false)
  const [updateAddedNotification, setUpdateAddedNotification] = React.useState(false)
  const [copiedSnippetId, setCopiedSnippetId] = React.useState<string | null>(null)

  const [actionItem1, setActionItem1] = React.useState(true)
  const [actionItem2, setActionItem2] = React.useState(true)
  const [actionItem3, setActionItem3] = React.useState(false)

  const copySnippet = (id: string) => {
    const text = logSnippets[id]
    if (!text) return
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedSnippetId(id)
      setTimeout(() => {
        setCopiedSnippetId((prev) => (prev === id ? null : prev))
      }, 2000)
    }
  }

  const handleExportPdf = () => {
    setExportNotification(true)
    setTimeout(() => {
      setExportNotification(false)
    }, 2500)
  }

  const handleAddUpdate = () => {
    setUpdateAddedNotification(true)
    setTimeout(() => {
      setUpdateAddedNotification(false)
    }, 2500)
  }

  const handleResolve = () => {
    setIsResolved((prev) => !prev)
  }

  return (
    <div data-slot="security-incident-timeline" className={cn('w-full space-y-6', className)} {...props}>
      {/* 1. Incident Header Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              {/* Badge Metadata Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs font-semibold tracking-wider">
                  {incidentId}
                </Badge>

                {/* Severity Badge with Pulsing Red Dot */}
                <Badge variant="destructive" className="gap-1.5 font-mono text-xs font-semibold uppercase">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-white" />
                  </span>
                  {severity}
                </Badge>

                {/* Status Badge */}
                {!isResolved ? (
                  <Badge variant="warning" className="gap-1.5 font-mono text-xs font-semibold">
                    <span className="size-2 rounded-full bg-amber-500" />
                    {status}
                  </Badge>
                ) : (
                  <Badge variant="success" className="gap-1.5 font-mono text-xs font-semibold">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Resolved · Closed
                  </Badge>
                )}

                <span className="text-muted-foreground text-xs font-medium">
                  Region: <span className="text-foreground font-mono">us-east-1 (N. Virginia)</span>
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{incidentTitle}</h1>
                <p className="text-muted-foreground text-sm">
                  Adversarial AWS STS role assumption anomaly flagged across external ingress gateways. Compromised
                  ephemeral CI/CD workflow token quarantined and revoked in 18 minutes.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                aria-label="Dismiss notification"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs"
                onClick={handleExportPdf}
              >
                {exportNotification ? (
                  <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
                ) : (
                  <FileDown className="size-3.5" aria-hidden="true" />
                )}
                <span>{exportNotification ? 'Exporting PDF...' : 'Export Incident Report PDF'}</span>
              </Button>

              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={handleAddUpdate}>
                {updateAddedNotification ? (
                  <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Plus className="size-3.5" aria-hidden="true" />
                )}
                <span>{updateAddedNotification ? 'Draft Created' : 'Add Timeline Update'}</span>
              </Button>

              <Button
                variant={isResolved ? 'outline' : 'default'}
                size="sm"
                className="h-9 gap-1.5 text-xs font-medium"
                onClick={handleResolve}
              >
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                <span>{isResolved ? 'Re-open Incident' : 'Resolve Incident'}</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Commander & Forensics Meta Strip */}
          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-9 border">
                <AvatarImage src="https://i.pravatar.cc/72?img=60" alt="Marcus Vance" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">MV</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-medium">Incident Commander</p>
                <p className="text-foreground truncate text-sm font-semibold">{commanderName}</p>
                <p className="text-muted-foreground truncate text-xs">{commanderRole}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Detection Trigger</p>
              <p className="text-foreground font-mono text-xs font-semibold">GuardDuty · IAM.Anomaly.STS</p>
              <p className="text-muted-foreground text-xs">2026-08-21 14:12:08 UTC</p>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Threat Vector & Origin</p>
              <p className="text-foreground font-mono text-xs font-semibold">198.51.100.42 (Tor Exit Node)</p>
              <p className="text-muted-foreground text-xs">AS13335 · Ephemeral OIDC Leak</p>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Incident War Room</p>
              <div className="flex items-center gap-2">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <p className="text-foreground font-mono text-xs font-semibold">#bridge-sec-0842</p>
                <Badge variant="outline" className="text-xs">
                  4 Responders
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">Bridge active · PagerDuty Sync</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 2. 4 Incident KPI Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Time to Detect */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium">Time to Detect (TTD)</p>
              <div className="flex size-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight">4m 12s</div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <CheckCircle2 className="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>Automated GuardDuty alert fired</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Time to Mitigate */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium">Time to Mitigate (TTM)</p>
              <div className="flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                <Zap className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight">18m 45s</div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <CheckCircle2 className="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>Full perimeter isolation & rotation</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Affected Resources */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium">Affected Resources</p>
              <div className="flex size-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Server className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight">3 Gateways</div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 font-mono text-xs">
                <span>apigw-iad-prod-[01..03]</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Impacted User Accounts */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium">Impacted User Accounts</p>
              <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-2">
              <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                0 Compromised
              </div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <ShieldCheck className="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>0 compromise confirmed · Token revoked</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Incident Timeline (Vertical Connected Stream) */}
      <Card className="border-border shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Incident Response Timeline</CardTitle>
              <CardDescription className="text-xs">
                Chronological audit trail of SOC telemetry, containment actions, and mitigation milestones.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                5 Timeline Events · UTC Synchronized
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="before:bg-border relative space-y-8 pl-6 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-px sm:pl-8 sm:before:left-4">
            {/* Timeline Entry 1: Detection */}
            <div className="relative space-y-3">
              {/* Node Marker */}
              <div className="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-red-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8">
                <ShieldAlert className="text-destructive size-3.5 sm:size-4" aria-hidden="true" />
              </div>

              {/* Header Row */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-bold">2026-08-21T14:12:08Z</span>
                  <Badge variant="destructive" className="font-mono text-xs uppercase">
                    1. Detection
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    T+00:00
                  </Badge>
                  <h3 className="text-foreground text-sm font-semibold">Automated Detection & Anomaly Ingestion</h3>
                </div>

                {/* Investigator Avatar & Name */}
                <div className="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                  <Avatar className="size-5">
                    <AvatarImage src="https://i.pravatar.cc/60?img=60" alt="Marcus Vance" />
                    <AvatarFallback className="text-xs">MV</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">Marcus Vance</span>
                  <span className="text-muted-foreground text-xs">(SecOps Lead)</span>
                </div>
              </div>

              {/* Action Taken Narrative */}
              <div className="space-y-1 text-xs">
                <p className="text-foreground font-medium">Action Taken:</p>
                <p className="text-muted-foreground leading-relaxed">
                  AWS GuardDuty anomaly engine flagged an unauthorized STS AssumeRole policy elevation request targeting
                  <code className="text-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                    role/SuperAdminPolicy
                  </code>
                  from an unapproved Tor exit node. Ingestion webhook routed alert to PagerDuty SecOps on-call.
                </p>
              </div>

              {/* System Log Output Snippet Box */}
              <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-zinc-400" aria-hidden="true" />
                    <span className="text-xs text-zinc-400">guardduty_alert_stream.log</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => copySnippet('detection')}
                  >
                    {copiedSnippetId === 'detection' ? (
                      <Check className="size-3 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    <span>{copiedSnippetId === 'detection' ? 'Copied' : 'Copy Snippet'}</span>
                  </Button>
                </div>
                <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-red-300/90 select-text">
                  <code>{logSnippets.detection}</code>
                </pre>
              </div>

              {/* Mitigation Notes Callout */}
              <div className="bg-muted/40 rounded-lg border p-3 text-xs">
                <span className="text-foreground font-semibold">Mitigation Notes: </span>
                <span className="text-muted-foreground">
                  Perimeter rate-limiting threshold exceeded (52 req/s). SIEM correlated 4 duplicate elevation
                  signatures across edge ingress gateways.
                </span>
              </div>
            </div>

            {/* Timeline Entry 2: Triage */}
            <div className="relative space-y-3">
              {/* Node Marker */}
              <div className="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-amber-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8">
                <Radio className="size-3.5 text-amber-500 sm:size-4" aria-hidden="true" />
              </div>

              {/* Header Row */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-bold">2026-08-21T14:15:30Z</span>
                  <Badge variant="warning" className="font-mono text-xs uppercase">
                    2. Triage
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    T+03:22
                  </Badge>
                  <h3 className="text-foreground text-sm font-semibold">SOC Triage & Incident War Room Assembly</h3>
                </div>

                {/* Investigator Avatar & Name */}
                <div className="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                  <Avatar className="size-5">
                    <AvatarImage src="https://i.pravatar.cc/60?img=47" alt="Elena Rostova" />
                    <AvatarFallback className="text-xs">ER</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">Elena Rostova</span>
                  <span className="text-muted-foreground text-xs">(Incident Commander)</span>
                </div>
              </div>

              {/* Action Taken Narrative */}
              <div className="space-y-1 text-xs">
                <p className="text-foreground font-medium">Action Taken:</p>
                <p className="text-muted-foreground leading-relaxed">
                  PagerDuty SEV-1 broadcast dispatched. Assembled SecOps, IAM, and Core Infrastructure leads in primary
                  war room. Traced origin token{' '}
                  <code className="text-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">tok_88f9x</code> to
                  an ephemeral CI/CD GitHub Actions runner.
                </p>
              </div>

              {/* System Log Output Snippet Box */}
              <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-zinc-400" aria-hidden="true" />
                    <span className="text-xs text-zinc-400">war_room_triage_audit.log</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => copySnippet('triage')}
                  >
                    {copiedSnippetId === 'triage' ? (
                      <Check className="size-3 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    <span>{copiedSnippetId === 'triage' ? 'Copied' : 'Copy Snippet'}</span>
                  </Button>
                </div>
                <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-amber-300/90 select-text">
                  <code>{logSnippets.triage}</code>
                </pre>
              </div>

              {/* Mitigation Notes Callout */}
              <div className="bg-muted/40 rounded-lg border p-3 text-xs">
                <span className="text-foreground font-semibold">Mitigation Notes: </span>
                <span className="text-muted-foreground">
                  Confirmed unauthorized token attempt was using leaked CI/CD ephemeral workflow credential tok_88f9x.
                  Scope bounded strictly to read-only API gateway routing.
                </span>
              </div>
            </div>

            {/* Timeline Entry 3: Containment */}
            <div className="relative space-y-3">
              {/* Node Marker */}
              <div className="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-amber-600/40 shadow-xs ring-4 sm:-left-8 sm:size-8">
                <Lock className="size-3.5 text-amber-600 sm:size-4 dark:text-amber-400" aria-hidden="true" />
              </div>

              {/* Header Row */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-bold">2026-08-21T14:22:15Z</span>
                  <Badge variant="warning" className="font-mono text-xs uppercase">
                    3. Containment
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    T+10:07
                  </Badge>
                  <h3 className="text-foreground text-sm font-semibold">Perimeter Quarantine & Traffic Blackholing</h3>
                </div>

                {/* Investigator Avatar & Name */}
                <div className="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                  <Avatar className="size-5">
                    <AvatarImage src="https://i.pravatar.cc/60?img=33" alt="David Okoye" />
                    <AvatarFallback className="text-xs">DO</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">David Okoye</span>
                  <span className="text-muted-foreground text-xs">(Network Security)</span>
                </div>
              </div>

              {/* Action Taken Narrative */}
              <div className="space-y-1 text-xs">
                <p className="text-foreground font-medium">Action Taken:</p>
                <p className="text-muted-foreground leading-relaxed">
                  Cloudflare WAF dynamic block rule enforced for egress IP ASN block (AS13335). Automated session kill
                  command dispatched across all 3 production ingress proxy gateway clusters.
                </p>
              </div>

              {/* System Log Output Snippet Box */}
              <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-zinc-400" aria-hidden="true" />
                    <span className="text-xs text-zinc-400">perimeter_waf_quarantine.log</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => copySnippet('containment')}
                  >
                    {copiedSnippetId === 'containment' ? (
                      <Check className="size-3 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    <span>{copiedSnippetId === 'containment' ? 'Copied' : 'Copy Snippet'}</span>
                  </Button>
                </div>
                <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-amber-200/90 select-text">
                  <code>{logSnippets.containment}</code>
                </pre>
              </div>

              {/* Mitigation Notes Callout */}
              <div className="bg-muted/40 rounded-lg border p-3 text-xs">
                <span className="text-foreground font-semibold">Mitigation Notes: </span>
                <span className="text-muted-foreground">
                  Ingress gateways returned HTTP 403 Forbidden. External traffic from adversarial IP ranges suppressed
                  with 0 packet leak into VPC internal mesh.
                </span>
              </div>
            </div>

            {/* Timeline Entry 4: Token Revocation */}
            <div className="relative space-y-3">
              {/* Node Marker */}
              <div className="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-sky-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8">
                <KeyRound className="size-3.5 text-sky-500 sm:size-4" aria-hidden="true" />
              </div>

              {/* Header Row */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-bold">2026-08-21T14:30:53Z</span>
                  <Badge variant="info" className="font-mono text-xs uppercase">
                    4. Token Revocation
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    T+18:45
                  </Badge>
                  <h3 className="text-foreground text-sm font-semibold">
                    Cryptographic Credential Invalidation & Key Rotation
                  </h3>
                </div>

                {/* Investigator Avatar & Name */}
                <div className="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                  <Avatar className="size-5">
                    <AvatarImage src="https://i.pravatar.cc/60?img=32" alt="Jessica Chen" />
                    <AvatarFallback className="text-xs">JC</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">Jessica Chen</span>
                  <span className="text-muted-foreground text-xs">(IAM Engineering)</span>
                </div>
              </div>

              {/* Action Taken Narrative */}
              <div className="space-y-1 text-xs">
                <p className="text-foreground font-medium">Action Taken:</p>
                <p className="text-muted-foreground leading-relaxed">
                  Revoked compromised GitHub Actions OIDC token series in AWS IAM & HashiCorp Vault. Rotated parent
                  cluster KMS gateway signing keys and flushed authentication verification caches across Redis mesh.
                </p>
              </div>

              {/* System Log Output Snippet Box */}
              <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-zinc-400" aria-hidden="true" />
                    <span className="text-xs text-zinc-400">vault_revocation_kms_rotation.log</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => copySnippet('revocation')}
                  >
                    {copiedSnippetId === 'revocation' ? (
                      <Check className="size-3 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    <span>{copiedSnippetId === 'revocation' ? 'Copied' : 'Copy Snippet'}</span>
                  </Button>
                </div>
                <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-sky-300/90 select-text">
                  <code>{logSnippets.revocation}</code>
                </pre>
              </div>

              {/* Mitigation Notes Callout */}
              <div className="bg-muted/40 rounded-lg border p-3 text-xs">
                <span className="text-foreground font-semibold">Mitigation Notes: </span>
                <span className="text-muted-foreground">
                  All downstream JWT verification caches invalidated via Redis Pub/Sub broadcast in 84ms. Zero active
                  token survivability confirmed.
                </span>
              </div>
            </div>

            {/* Timeline Entry 5: Post-Mortem Action Items */}
            <div className="relative space-y-3">
              {/* Node Marker */}
              <div className="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-emerald-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8">
                <ShieldCheck className="size-3.5 text-emerald-500 sm:size-4" aria-hidden="true" />
              </div>

              {/* Header Row */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-bold">2026-08-21T14:48:00Z</span>
                  <Badge variant="success" className="font-mono text-xs uppercase">
                    5. Post-Mortem Action Items
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    T+35:52
                  </Badge>
                  <h3 className="text-foreground text-sm font-semibold">
                    Threat Vector Neutralized & Post-Mortem Transition
                  </h3>
                </div>

                {/* Investigator Avatar & Name */}
                <div className="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                  <Avatar className="size-5">
                    <AvatarImage src="https://i.pravatar.cc/60?img=60" alt="Marcus Vance" />
                    <AvatarFallback className="text-xs">MV</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">Marcus Vance</span>
                  <span className="text-muted-foreground text-xs">(SecOps Lead)</span>
                </div>
              </div>

              {/* Action Taken Narrative */}
              <div className="space-y-1 text-xs">
                <p className="text-foreground font-medium">Action Taken:</p>
                <p className="text-muted-foreground leading-relaxed">
                  Completed 15-minute clean traffic audit sweep with 0 anomalous requests. Incident commander officially
                  downgraded active SEV-1 to Mitigated status and initiated formal post-mortem action items.
                </p>
              </div>

              {/* System Log Output Snippet Box */}
              <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-zinc-400" aria-hidden="true" />
                    <span className="text-xs text-zinc-400">post_incident_audit_sweep.log</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => copySnippet('postmortem')}
                  >
                    {copiedSnippetId === 'postmortem' ? (
                      <Check className="size-3 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    <span>{copiedSnippetId === 'postmortem' ? 'Copied' : 'Copy Snippet'}</span>
                  </Button>
                </div>
                <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-emerald-300/90 select-text">
                  <code>{logSnippets.postmortem}</code>
                </pre>
              </div>

              {/* Mitigation Notes Callout */}
              <div className="bg-muted/40 rounded-lg border p-3 text-xs">
                <span className="text-foreground font-semibold">Mitigation Notes: </span>
                <span className="text-muted-foreground">
                  Post-incident evidence bundle archived to secure S3 vault bucket{' '}
                  <code className="text-foreground bg-muted rounded px-1 font-mono text-xs">
                    s3://sec-incidents-2026/0842-audit.tar.gz.enc
                  </code>
                  . Remediation tasks assigned.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Root Cause & Corrective Action Items Card */}
      <Card className="border-border shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck className="text-primary size-5" aria-hidden="true" />
                <CardTitle className="text-lg font-bold">Root Cause Analysis & Corrective Action Items</CardTitle>
              </div>
              <CardDescription className="text-xs">
                3 actionable remediation tasks tracked across Jira and GitHub to prevent recurring authorization bypass
                vectors.
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit font-mono text-xs">
              3 Post-Mortem Tasks
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Root Cause Summary Box */}
          <div className="bg-muted/30 border-border space-y-1.5 rounded-lg border p-3.5 text-xs">
            <div className="text-foreground flex items-center gap-2 font-semibold">
              <Shield className="size-4 text-amber-500" aria-hidden="true" />
              <span>Root Cause Summary</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A third-party fork pull request executed via a workflow using{' '}
              <code className="text-foreground bg-muted rounded px-1 py-0.5 font-mono">pull_request_target</code>{' '}
              allowed unauthorized extraction of the short-lived CI OIDC token. AWS STS role trust policy lacked strict{' '}
              <code className="text-foreground bg-muted rounded px-1 py-0.5 font-mono">repository_owner</code> and{' '}
              <code className="text-foreground bg-muted rounded px-1 py-0.5 font-mono">ref</code> claim constraints.
            </p>
          </div>

          {/* Task List Items */}
          <div className="border-border divide-border divide-y rounded-lg border">
            {/* Task 1 */}
            <div className="hover:bg-muted/20 flex flex-col gap-3 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox
                    id="task-react-sec-4412"
                    checked={actionItem1}
                    onCheckedChange={(checked) => setActionItem1(checked === true)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="task-react-sec-4412"
                      className={cn(
                        'cursor-pointer font-mono text-xs font-bold',
                        actionItem1 ? 'text-muted-foreground line-through' : 'text-foreground',
                      )}
                    >
                      SEC-4412
                    </label>
                    <Badge variant="destructive" className="font-mono text-xs">
                      P0 Blocker
                    </Badge>
                    <Badge variant="warning" className="font-mono text-xs">
                      In Review
                    </Badge>
                  </div>
                  <p
                    className={cn(
                      'text-xs font-medium',
                      actionItem1 ? 'text-muted-foreground line-through' : 'text-foreground',
                    )}
                  >
                    Enforce strict OIDC branch-to-role binding with repository claim validation on CI runner STS
                    policies
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Require <code className="font-mono text-xs">repository_owner=uipkge</code> and{' '}
                    <code className="font-mono text-xs">ref=refs/heads/main</code> on all assumed cloud roles.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3 pl-7 sm:justify-end sm:pl-0">
                <div className="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                  <Avatar className="size-4">
                    <AvatarImage src="https://i.pravatar.cc/50?img=32" alt="Jessica Chen" />
                    <AvatarFallback className="text-xs">JC</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">Jessica Chen</span>
                </div>
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  <GitPullRequest className="size-3" aria-hidden="true" />
                  PR #882
                </Badge>
              </div>
            </div>

            {/* Task 2 */}
            <div className="hover:bg-muted/20 flex flex-col gap-3 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox
                    id="task-react-sec-4413"
                    checked={actionItem2}
                    onCheckedChange={(checked) => setActionItem2(checked === true)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="task-react-sec-4413"
                      className={cn(
                        'cursor-pointer font-mono text-xs font-bold',
                        actionItem2 ? 'text-muted-foreground line-through' : 'text-foreground',
                      )}
                    >
                      SEC-4413
                    </label>
                    <Badge variant="warning" className="font-mono text-xs">
                      P1 High
                    </Badge>
                    <Badge variant="success" className="font-mono text-xs">
                      Completed
                    </Badge>
                  </div>
                  <p
                    className={cn(
                      'text-xs font-medium',
                      actionItem2 ? 'text-muted-foreground line-through' : 'text-foreground',
                    )}
                  >
                    Reduce default ephemeral CI token TTL from 3600s to 900s across all GitHub Actions deployment
                    workflows
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Update HashiCorp Vault AWS secrets engine configuration and OIDC provider default duration.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3 pl-7 sm:justify-end sm:pl-0">
                <div className="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                  <Avatar className="size-4">
                    <AvatarImage src="https://i.pravatar.cc/50?img=33" alt="David Okoye" />
                    <AvatarFallback className="text-xs">DO</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">David Okoye</span>
                </div>
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  Deployed v4.18.2
                </Badge>
              </div>
            </div>

            {/* Task 3 */}
            <div className="hover:bg-muted/20 flex flex-col gap-3 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox
                    id="task-react-sec-4414"
                    checked={actionItem3}
                    onCheckedChange={(checked) => setActionItem3(checked === true)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="task-react-sec-4414"
                      className={cn(
                        'cursor-pointer font-mono text-xs font-bold',
                        actionItem3 ? 'text-muted-foreground line-through' : 'text-foreground',
                      )}
                    >
                      SEC-4414
                    </label>
                    <Badge variant="warning" className="font-mono text-xs">
                      P1 High
                    </Badge>
                    <Badge variant="info" className="font-mono text-xs">
                      In Progress
                    </Badge>
                  </div>
                  <p
                    className={cn(
                      'text-xs font-medium',
                      actionItem3 ? 'text-muted-foreground line-through' : 'text-foreground',
                    )}
                  >
                    Implement automated SIEM quarantine webhook to auto-revoke Vault tokens upon GuardDuty high-severity
                    finding
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Deploy AWS EventBridge rule to pipe GuardDuty high-severity IAM alerts directly to Lambda quarantine
                    webhook.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3 pl-7 sm:justify-end sm:pl-0">
                <div className="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                  <Avatar className="size-4">
                    <AvatarImage src="https://i.pravatar.cc/50?img=60" alt="Marcus Vance" />
                    <AvatarFallback className="text-xs">MV</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">Marcus Vance</span>
                </div>
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  Sprint 34 · Aug 28
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
