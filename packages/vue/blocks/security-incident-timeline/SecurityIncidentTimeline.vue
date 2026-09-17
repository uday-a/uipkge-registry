<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

interface Props {
  incidentId?: string
  incidentTitle?: string
  severity?: string
  status?: string
  commanderName?: string
  commanderRole?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  incidentId: '#SEC-INC-2026-0842',
  incidentTitle: 'Unauthorized API Token Elevation Attempt',
  severity: 'SEV-1 Critical',
  status: 'Mitigated / In Post-Mortem',
  commanderName: 'Marcus Vance',
  commanderRole: 'Principal SecOps · Incident Commander',
})

const isResolved = ref(false)
const exportNotification = ref(false)
const copiedSnippetId = ref<string | null>(null)
const updateAddedNotification = ref(false)

const actionItem1 = ref(true)
const actionItem2 = ref(true)
const actionItem3 = ref(false)

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

function copySnippet(id: string) {
  const text = logSnippets[id]
  if (!text) return
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    copiedSnippetId.value = id
    setTimeout(() => {
      if (copiedSnippetId.value === id) {
        copiedSnippetId.value = null
      }
    }, 2000)
  }
}

function handleExportPdf() {
  exportNotification.value = true
  setTimeout(() => {
    exportNotification.value = false
  }, 2500)
}

function handleAddUpdate() {
  updateAddedNotification.value = true
  setTimeout(() => {
    updateAddedNotification.value = false
  }, 2500)
}

function handleResolve() {
  isResolved.value = !isResolved.value
}
</script>

<template>
  <div data-slot="security-incident-timeline" :class="cn('w-full space-y-6', props.class)">
    <!-- 1. Incident Header Card -->
    <Card class="border-border shadow-xs">
      <CardHeader class="space-y-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-2">
            <!-- Badge Metadata Bar -->
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="font-mono text-xs font-semibold tracking-wider">
                {{ props.incidentId }}
              </Badge>

              <!-- Severity Badge with Pulsing Red Dot -->
              <Badge variant="destructive" class="gap-1.5 font-mono text-xs font-semibold uppercase">
                <span class="relative flex size-2 shrink-0">
                  <span class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span class="relative inline-flex size-2 rounded-full bg-white" />
                </span>
                {{ props.severity }}
              </Badge>

              <!-- Status Badge -->
              <Badge v-if="!isResolved" variant="warning" class="gap-1.5 font-mono text-xs font-semibold">
                <span class="size-2 rounded-full bg-amber-500" />
                {{ props.status }}
              </Badge>
              <Badge v-else variant="success" class="gap-1.5 font-mono text-xs font-semibold">
                <span class="size-2 rounded-full bg-emerald-500" />
                Resolved · Closed
              </Badge>

              <span class="text-muted-foreground text-xs font-medium">
                Region: <span class="text-foreground font-mono">us-east-1 (N. Virginia)</span>
              </span>
            </div>

            <!-- Title & Description -->
            <div class="space-y-1">
              <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                {{ props.incidentTitle }}
              </h1>
              <p class="text-muted-foreground text-sm">
                Adversarial AWS STS role assumption anomaly flagged across external ingress gateways. Compromised
                ephemeral CI/CD workflow token quarantined and revoked in 18 minutes.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <Button
              aria-label="Dismiss notification"
              variant="outline"
              size="sm"
              class="h-9 gap-1.5 text-xs"
              @click="handleExportPdf"
            >
              <Check v-if="exportNotification" class="size-3.5 text-emerald-500" aria-hidden="true" />
              <FileDown v-else class="size-3.5" aria-hidden="true" />
              <span>{{ exportNotification ? 'Exporting PDF...' : 'Export Incident Report PDF' }}</span>
            </Button>

            <Button variant="outline" size="sm" class="h-9 gap-1.5 text-xs" @click="handleAddUpdate">
              <Check v-if="updateAddedNotification" class="size-3.5 text-emerald-500" aria-hidden="true" />
              <Plus v-else class="size-3.5" aria-hidden="true" />
              <span>{{ updateAddedNotification ? 'Draft Created' : 'Add Timeline Update' }}</span>
            </Button>

            <Button
              :variant="isResolved ? 'outline' : 'default'"
              size="sm"
              class="h-9 gap-1.5 text-xs font-medium"
              @click="handleResolve"
            >
              <ShieldCheck class="size-3.5" aria-hidden="true" />
              <span>{{ isResolved ? 'Re-open Incident' : 'Resolve Incident' }}</span>
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Commander & Forensics Meta Strip -->
        <div class="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div class="flex items-center gap-3">
            <Avatar class="size-9 border">
              <AvatarImage src="https://i.pravatar.cc/72?img=60" alt="Marcus Vance" />
              <AvatarFallback class="bg-primary/10 text-primary font-semibold">MV</AvatarFallback>
            </Avatar>
            <div class="min-w-0">
              <p class="text-muted-foreground text-xs font-medium">Incident Commander</p>
              <p class="text-foreground truncate text-sm font-semibold">{{ props.commanderName }}</p>
              <p class="text-muted-foreground truncate text-xs">{{ props.commanderRole }}</p>
            </div>
          </div>

          <div class="space-y-1">
            <p class="text-muted-foreground text-xs font-medium">Detection Trigger</p>
            <p class="text-foreground font-mono text-xs font-semibold">GuardDuty · IAM.Anomaly.STS</p>
            <p class="text-muted-foreground text-xs">2026-08-21 14:12:08 UTC</p>
          </div>

          <div class="space-y-1">
            <p class="text-muted-foreground text-xs font-medium">Threat Vector & Origin</p>
            <p class="text-foreground font-mono text-xs font-semibold">198.51.100.42 (Tor Exit Node)</p>
            <p class="text-muted-foreground text-xs">AS13335 · Ephemeral OIDC Leak</p>
          </div>

          <div class="space-y-1">
            <p class="text-muted-foreground text-xs font-medium">Incident War Room</p>
            <div class="flex items-center gap-2">
              <span class="relative flex size-2 shrink-0">
                <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <p class="text-foreground font-mono text-xs font-semibold">#bridge-sec-0842</p>
              <Badge variant="outline" class="text-xs">4 Responders</Badge>
            </div>
            <p class="text-muted-foreground text-xs">Bridge active · PagerDuty Sync</p>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- 2. 4 Incident KPI Telemetry Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Time to Detect -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium">Time to Detect (TTD)</p>
            <div
              class="flex size-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Clock class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-2">
            <div class="text-foreground font-mono text-2xl font-bold tracking-tight">4m 12s</div>
            <p class="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <CheckCircle2 class="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
              <span>Automated GuardDuty alert fired</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Time to Mitigate -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium">Time to Mitigate (TTM)</p>
            <div
              class="flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
            >
              <Zap class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-2">
            <div class="text-foreground font-mono text-2xl font-bold tracking-tight">18m 45s</div>
            <p class="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <CheckCircle2 class="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
              <span>Full perimeter isolation & rotation</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Affected Resources -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium">Affected Resources</p>
            <div
              class="flex size-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <Server class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-2">
            <div class="text-foreground font-mono text-2xl font-bold tracking-tight">3 Gateways</div>
            <p class="text-muted-foreground mt-1 flex items-center gap-1 font-mono text-xs">
              <span>apigw-iad-prod-[01..03]</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Impacted User Accounts -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium">Impacted User Accounts</p>
            <div
              class="flex size-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <Users class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-2">
            <div class="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              0 Compromised
            </div>
            <p class="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <ShieldCheck class="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
              <span>0 compromise confirmed · Token revoked</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 3. Incident Timeline (Vertical Connected Stream) -->
    <Card class="border-border shadow-xs">
      <CardHeader>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-lg font-bold">Incident Response Timeline</CardTitle>
            <CardDescription class="text-xs">
              Chronological audit trail of SOC telemetry, containment actions, and mitigation milestones.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="font-mono text-xs"> 5 Timeline Events · UTC Synchronized </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="pt-2">
        <div
          class="before:bg-border relative space-y-8 pl-6 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-px sm:pl-8 sm:before:left-4"
        >
          <!-- Timeline Entry 1: Detection -->
          <div class="relative space-y-3">
            <!-- Node Marker -->
            <div
              class="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-red-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8"
            >
              <ShieldAlert class="text-destructive size-3.5 sm:size-4" aria-hidden="true" />
            </div>

            <!-- Header Row -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-foreground font-mono text-xs font-bold">2026-08-21T14:12:08Z</span>
                <Badge variant="destructive" class="font-mono text-xs uppercase"> 1. Detection </Badge>
                <Badge variant="outline" class="font-mono text-xs"> T+00:00 </Badge>
                <h3 class="text-foreground text-sm font-semibold">Automated Detection & Anomaly Ingestion</h3>
              </div>

              <!-- Investigator Avatar & Name -->
              <div class="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                <Avatar class="size-5">
                  <AvatarImage src="https://i.pravatar.cc/60?img=60" alt="Marcus Vance" />
                  <AvatarFallback class="text-xs">MV</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">Marcus Vance</span>
                <span class="text-muted-foreground text-xs">(SecOps Lead)</span>
              </div>
            </div>

            <!-- Action Taken Narrative -->
            <div class="space-y-1 text-xs">
              <p class="text-foreground font-medium">Action Taken:</p>
              <p class="text-muted-foreground leading-relaxed">
                AWS GuardDuty anomaly engine flagged an unauthorized STS AssumeRole policy elevation request targeting
                <code class="text-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs"
                  >role/SuperAdminPolicy</code
                >
                from an unapproved Tor exit node. Ingestion webhook routed alert to PagerDuty SecOps on-call.
              </p>
            </div>

            <!-- System Log Output Snippet Box -->
            <div class="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
              <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                <div class="flex items-center gap-2">
                  <Terminal class="size-3.5 text-zinc-400" aria-hidden="true" />
                  <span class="text-xs text-zinc-400">guardduty_alert_stream.log</span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  @click="copySnippet('detection')"
                >
                  <Check v-if="copiedSnippetId === 'detection'" class="size-3 text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="size-3" aria-hidden="true" />
                  <span>{{ copiedSnippetId === 'detection' ? 'Copied' : 'Copy Snippet' }}</span>
                </Button>
              </div>
              <pre
                class="overflow-x-auto p-3 text-xs leading-relaxed text-red-300/90 select-text"
              ><code>{{ logSnippets.detection }}</code></pre>
            </div>

            <!-- Mitigation Notes Callout -->
            <div class="bg-muted/40 rounded-lg border p-3 text-xs">
              <span class="text-foreground font-semibold">Mitigation Notes: </span>
              <span class="text-muted-foreground">
                Perimeter rate-limiting threshold exceeded (52 req/s). SIEM correlated 4 duplicate elevation signatures
                across edge ingress gateways.
              </span>
            </div>
          </div>

          <!-- Timeline Entry 2: Triage -->
          <div class="relative space-y-3">
            <!-- Node Marker -->
            <div
              class="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-amber-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8"
            >
              <Radio class="size-3.5 text-amber-500 sm:size-4" aria-hidden="true" />
            </div>

            <!-- Header Row -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-foreground font-mono text-xs font-bold">2026-08-21T14:15:30Z</span>
                <Badge variant="warning" class="font-mono text-xs uppercase"> 2. Triage </Badge>
                <Badge variant="outline" class="font-mono text-xs"> T+03:22 </Badge>
                <h3 class="text-foreground text-sm font-semibold">SOC Triage & Incident War Room Assembly</h3>
              </div>

              <!-- Investigator Avatar & Name -->
              <div class="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                <Avatar class="size-5">
                  <AvatarImage src="https://i.pravatar.cc/60?img=47" alt="Elena Rostova" />
                  <AvatarFallback class="text-xs">ER</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">Elena Rostova</span>
                <span class="text-muted-foreground text-xs">(Incident Commander)</span>
              </div>
            </div>

            <!-- Action Taken Narrative -->
            <div class="space-y-1 text-xs">
              <p class="text-foreground font-medium">Action Taken:</p>
              <p class="text-muted-foreground leading-relaxed">
                PagerDuty SEV-1 broadcast dispatched. Assembled SecOps, IAM, and Core Infrastructure leads in primary
                war room. Traced origin token
                <code class="text-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">tok_88f9x</code> to an
                ephemeral CI/CD GitHub Actions runner.
              </p>
            </div>

            <!-- System Log Output Snippet Box -->
            <div class="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
              <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                <div class="flex items-center gap-2">
                  <Terminal class="size-3.5 text-zinc-400" aria-hidden="true" />
                  <span class="text-xs text-zinc-400">war_room_triage_audit.log</span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  @click="copySnippet('triage')"
                >
                  <Check v-if="copiedSnippetId === 'triage'" class="size-3 text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="size-3" aria-hidden="true" />
                  <span>{{ copiedSnippetId === 'triage' ? 'Copied' : 'Copy Snippet' }}</span>
                </Button>
              </div>
              <pre
                class="overflow-x-auto p-3 text-xs leading-relaxed text-amber-300/90 select-text"
              ><code>{{ logSnippets.triage }}</code></pre>
            </div>

            <!-- Mitigation Notes Callout -->
            <div class="bg-muted/40 rounded-lg border p-3 text-xs">
              <span class="text-foreground font-semibold">Mitigation Notes: </span>
              <span class="text-muted-foreground">
                Confirmed unauthorized token attempt was using leaked CI/CD ephemeral workflow credential tok_88f9x.
                Scope bounded strictly to read-only API gateway routing.
              </span>
            </div>
          </div>

          <!-- Timeline Entry 3: Containment -->
          <div class="relative space-y-3">
            <!-- Node Marker -->
            <div
              class="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-amber-600/40 shadow-xs ring-4 sm:-left-8 sm:size-8"
            >
              <Lock class="size-3.5 text-amber-600 sm:size-4 dark:text-amber-400" aria-hidden="true" />
            </div>

            <!-- Header Row -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-foreground font-mono text-xs font-bold">2026-08-21T14:22:15Z</span>
                <Badge variant="warning" class="font-mono text-xs uppercase"> 3. Containment </Badge>
                <Badge variant="outline" class="font-mono text-xs"> T+10:07 </Badge>
                <h3 class="text-foreground text-sm font-semibold">Perimeter Quarantine & Traffic Blackholing</h3>
              </div>

              <!-- Investigator Avatar & Name -->
              <div class="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                <Avatar class="size-5">
                  <AvatarImage src="https://i.pravatar.cc/60?img=33" alt="David Okoye" />
                  <AvatarFallback class="text-xs">DO</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">David Okoye</span>
                <span class="text-muted-foreground text-xs">(Network Security)</span>
              </div>
            </div>

            <!-- Action Taken Narrative -->
            <div class="space-y-1 text-xs">
              <p class="text-foreground font-medium">Action Taken:</p>
              <p class="text-muted-foreground leading-relaxed">
                Cloudflare WAF dynamic block rule enforced for egress IP ASN block (AS13335). Automated session kill
                command dispatched across all 3 production ingress proxy gateway clusters.
              </p>
            </div>

            <!-- System Log Output Snippet Box -->
            <div class="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
              <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                <div class="flex items-center gap-2">
                  <Terminal class="size-3.5 text-zinc-400" aria-hidden="true" />
                  <span class="text-xs text-zinc-400">perimeter_waf_quarantine.log</span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  @click="copySnippet('containment')"
                >
                  <Check v-if="copiedSnippetId === 'containment'" class="size-3 text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="size-3" aria-hidden="true" />
                  <span>{{ copiedSnippetId === 'containment' ? 'Copied' : 'Copy Snippet' }}</span>
                </Button>
              </div>
              <pre
                class="overflow-x-auto p-3 text-xs leading-relaxed text-amber-200/90 select-text"
              ><code>{{ logSnippets.containment }}</code></pre>
            </div>

            <!-- Mitigation Notes Callout -->
            <div class="bg-muted/40 rounded-lg border p-3 text-xs">
              <span class="text-foreground font-semibold">Mitigation Notes: </span>
              <span class="text-muted-foreground">
                Ingress gateways returned HTTP 403 Forbidden. External traffic from adversarial IP ranges suppressed
                with 0 packet leak into VPC internal mesh.
              </span>
            </div>
          </div>

          <!-- Timeline Entry 4: Token Revocation -->
          <div class="relative space-y-3">
            <!-- Node Marker -->
            <div
              class="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-sky-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8"
            >
              <KeyRound class="size-3.5 text-sky-500 sm:size-4" aria-hidden="true" />
            </div>

            <!-- Header Row -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-foreground font-mono text-xs font-bold">2026-08-21T14:30:53Z</span>
                <Badge variant="info" class="font-mono text-xs uppercase"> 4. Token Revocation </Badge>
                <Badge variant="outline" class="font-mono text-xs"> T+18:45 </Badge>
                <h3 class="text-foreground text-sm font-semibold">
                  Cryptographic Credential Invalidation & Key Rotation
                </h3>
              </div>

              <!-- Investigator Avatar & Name -->
              <div class="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                <Avatar class="size-5">
                  <AvatarImage src="https://i.pravatar.cc/60?img=32" alt="Jessica Chen" />
                  <AvatarFallback class="text-xs">JC</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">Jessica Chen</span>
                <span class="text-muted-foreground text-xs">(IAM Engineering)</span>
              </div>
            </div>

            <!-- Action Taken Narrative -->
            <div class="space-y-1 text-xs">
              <p class="text-foreground font-medium">Action Taken:</p>
              <p class="text-muted-foreground leading-relaxed">
                Revoked compromised GitHub Actions OIDC token series in AWS IAM & HashiCorp Vault. Rotated parent
                cluster KMS gateway signing keys and flushed authentication verification caches across Redis mesh.
              </p>
            </div>

            <!-- System Log Output Snippet Box -->
            <div class="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
              <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                <div class="flex items-center gap-2">
                  <Terminal class="size-3.5 text-zinc-400" aria-hidden="true" />
                  <span class="text-xs text-zinc-400">vault_revocation_kms_rotation.log</span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  @click="copySnippet('revocation')"
                >
                  <Check v-if="copiedSnippetId === 'revocation'" class="size-3 text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="size-3" aria-hidden="true" />
                  <span>{{ copiedSnippetId === 'revocation' ? 'Copied' : 'Copy Snippet' }}</span>
                </Button>
              </div>
              <pre
                class="overflow-x-auto p-3 text-xs leading-relaxed text-sky-300/90 select-text"
              ><code>{{ logSnippets.revocation }}</code></pre>
            </div>

            <!-- Mitigation Notes Callout -->
            <div class="bg-muted/40 rounded-lg border p-3 text-xs">
              <span class="text-foreground font-semibold">Mitigation Notes: </span>
              <span class="text-muted-foreground">
                All downstream JWT verification caches invalidated via Redis Pub/Sub broadcast in 84ms. Zero active
                token survivability confirmed.
              </span>
            </div>
          </div>

          <!-- Timeline Entry 5: Post-Mortem Action Items -->
          <div class="relative space-y-3">
            <!-- Node Marker -->
            <div
              class="bg-card ring-background absolute -left-6 flex size-7 items-center justify-center rounded-full border border-emerald-500/40 shadow-xs ring-4 sm:-left-8 sm:size-8"
            >
              <ShieldCheck class="size-3.5 text-emerald-500 sm:size-4" aria-hidden="true" />
            </div>

            <!-- Header Row -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-foreground font-mono text-xs font-bold">2026-08-21T14:48:00Z</span>
                <Badge variant="success" class="font-mono text-xs uppercase"> 5. Post-Mortem Action Items </Badge>
                <Badge variant="outline" class="font-mono text-xs"> T+35:52 </Badge>
                <h3 class="text-foreground text-sm font-semibold">
                  Threat Vector Neutralized & Post-Mortem Transition
                </h3>
              </div>

              <!-- Investigator Avatar & Name -->
              <div class="bg-muted/60 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
                <Avatar class="size-5">
                  <AvatarImage src="https://i.pravatar.cc/60?img=60" alt="Marcus Vance" />
                  <AvatarFallback class="text-xs">MV</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">Marcus Vance</span>
                <span class="text-muted-foreground text-xs">(SecOps Lead)</span>
              </div>
            </div>

            <!-- Action Taken Narrative -->
            <div class="space-y-1 text-xs">
              <p class="text-foreground font-medium">Action Taken:</p>
              <p class="text-muted-foreground leading-relaxed">
                Completed 15-minute clean traffic audit sweep with 0 anomalous requests. Incident commander officially
                downgraded active SEV-1 to Mitigated status and initiated formal post-mortem action items.
              </p>
            </div>

            <!-- System Log Output Snippet Box -->
            <div class="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
              <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                <div class="flex items-center gap-2">
                  <Terminal class="size-3.5 text-zinc-400" aria-hidden="true" />
                  <span class="text-xs text-zinc-400">post_incident_audit_sweep.log</span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  @click="copySnippet('postmortem')"
                >
                  <Check v-if="copiedSnippetId === 'postmortem'" class="size-3 text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="size-3" aria-hidden="true" />
                  <span>{{ copiedSnippetId === 'postmortem' ? 'Copied' : 'Copy Snippet' }}</span>
                </Button>
              </div>
              <pre
                class="overflow-x-auto p-3 text-xs leading-relaxed text-emerald-300/90 select-text"
              ><code>{{ logSnippets.postmortem }}</code></pre>
            </div>

            <!-- Mitigation Notes Callout -->
            <div class="bg-muted/40 rounded-lg border p-3 text-xs">
              <span class="text-foreground font-semibold">Mitigation Notes: </span>
              <span class="text-muted-foreground">
                Post-incident evidence bundle archived to secure S3 vault bucket
                <code class="text-foreground bg-muted rounded px-1 font-mono text-xs"
                  >s3://sec-incidents-2026/0842-audit.tar.gz.enc</code
                >. Remediation tasks assigned.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 4. Root Cause & Corrective Action Items Card -->
    <Card class="border-border shadow-xs">
      <CardHeader>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <FileCheck class="text-primary size-5" aria-hidden="true" />
              <CardTitle class="text-lg font-bold">Root Cause Analysis & Corrective Action Items</CardTitle>
            </div>
            <CardDescription class="text-xs">
              3 actionable remediation tasks tracked across Jira and GitHub to prevent recurring authorization bypass
              vectors.
            </CardDescription>
          </div>
          <Badge variant="outline" class="w-fit font-mono text-xs"> 3 Post-Mortem Tasks </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Root Cause Summary Box -->
        <div class="bg-muted/30 border-border space-y-1.5 rounded-lg border p-3.5 text-xs">
          <div class="text-foreground flex items-center gap-2 font-semibold">
            <Shield class="size-4 text-amber-500" aria-hidden="true" />
            <span>Root Cause Summary</span>
          </div>
          <p class="text-muted-foreground leading-relaxed">
            A third-party fork pull request executed via a workflow using
            <code class="text-foreground bg-muted rounded px-1 py-0.5 font-mono">pull_request_target</code> allowed
            unauthorized extraction of the short-lived CI OIDC token. AWS STS role trust policy lacked strict
            <code class="text-foreground bg-muted rounded px-1 py-0.5 font-mono">repository_owner</code> and
            <code class="text-foreground bg-muted rounded px-1 py-0.5 font-mono">ref</code> claim constraints.
          </p>
        </div>

        <!-- Task List Items -->
        <div class="border-border divide-border divide-y rounded-lg border">
          <!-- Task 1 -->
          <div
            class="hover:bg-muted/20 flex flex-col gap-3 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-3">
              <div class="pt-0.5">
                <Checkbox v-model="actionItem1" id="task-sec-4412" />
              </div>
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <label
                    for="task-sec-4412"
                    :class="
                      cn(
                        'cursor-pointer font-mono text-xs font-bold',
                        actionItem1 ? 'text-muted-foreground line-through' : 'text-foreground',
                      )
                    "
                  >
                    SEC-4412
                  </label>
                  <Badge variant="destructive" class="font-mono text-xs">P0 Blocker</Badge>
                  <Badge variant="warning" class="font-mono text-xs">In Review</Badge>
                </div>
                <p
                  :class="
                    cn('text-xs font-medium', actionItem1 ? 'text-muted-foreground line-through' : 'text-foreground')
                  "
                >
                  Enforce strict OIDC branch-to-role binding with repository claim validation on CI runner STS policies
                </p>
                <p class="text-muted-foreground text-xs">
                  Require <code class="font-mono text-xs">repository_owner=uipkge</code> and
                  <code class="font-mono text-xs">ref=refs/heads/main</code> on all assumed cloud roles.
                </p>
              </div>
            </div>

            <div class="flex shrink-0 flex-wrap items-center gap-3 pl-7 sm:justify-end sm:pl-0">
              <div class="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                <Avatar class="size-4">
                  <AvatarImage src="https://i.pravatar.cc/50?img=32" alt="Jessica Chen" />
                  <AvatarFallback class="text-xs">JC</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">Jessica Chen</span>
              </div>
              <Badge variant="outline" class="gap-1 font-mono text-xs">
                <GitPullRequest class="size-3" aria-hidden="true" />
                PR #882
              </Badge>
            </div>
          </div>

          <!-- Task 2 -->
          <div
            class="hover:bg-muted/20 flex flex-col gap-3 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-3">
              <div class="pt-0.5">
                <Checkbox v-model="actionItem2" id="task-sec-4413" />
              </div>
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <label
                    for="task-sec-4413"
                    :class="
                      cn(
                        'cursor-pointer font-mono text-xs font-bold',
                        actionItem2 ? 'text-muted-foreground line-through' : 'text-foreground',
                      )
                    "
                  >
                    SEC-4413
                  </label>
                  <Badge variant="warning" class="font-mono text-xs">P1 High</Badge>
                  <Badge variant="success" class="font-mono text-xs">Completed</Badge>
                </div>
                <p
                  :class="
                    cn('text-xs font-medium', actionItem2 ? 'text-muted-foreground line-through' : 'text-foreground')
                  "
                >
                  Reduce default ephemeral CI token TTL from 3600s to 900s across all GitHub Actions deployment
                  workflows
                </p>
                <p class="text-muted-foreground text-xs">
                  Update HashiCorp Vault AWS secrets engine configuration and OIDC provider default duration.
                </p>
              </div>
            </div>

            <div class="flex shrink-0 flex-wrap items-center gap-3 pl-7 sm:justify-end sm:pl-0">
              <div class="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                <Avatar class="size-4">
                  <AvatarImage src="https://i.pravatar.cc/50?img=33" alt="David Okoye" />
                  <AvatarFallback class="text-xs">DO</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">David Okoye</span>
              </div>
              <Badge variant="outline" class="gap-1 font-mono text-xs"> Deployed v4.18.2 </Badge>
            </div>
          </div>

          <!-- Task 3 -->
          <div
            class="hover:bg-muted/20 flex flex-col gap-3 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-3">
              <div class="pt-0.5">
                <Checkbox v-model="actionItem3" id="task-sec-4414" />
              </div>
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <label
                    for="task-sec-4414"
                    :class="
                      cn(
                        'cursor-pointer font-mono text-xs font-bold',
                        actionItem3 ? 'text-muted-foreground line-through' : 'text-foreground',
                      )
                    "
                  >
                    SEC-4414
                  </label>
                  <Badge variant="warning" class="font-mono text-xs">P1 High</Badge>
                  <Badge variant="info" class="font-mono text-xs">In Progress</Badge>
                </div>
                <p
                  :class="
                    cn('text-xs font-medium', actionItem3 ? 'text-muted-foreground line-through' : 'text-foreground')
                  "
                >
                  Implement automated SIEM quarantine webhook to auto-revoke Vault tokens upon GuardDuty high-severity
                  finding
                </p>
                <p class="text-muted-foreground text-xs">
                  Deploy AWS EventBridge rule to pipe GuardDuty high-severity IAM alerts directly to Lambda quarantine
                  webhook.
                </p>
              </div>
            </div>

            <div class="flex shrink-0 flex-wrap items-center gap-3 pl-7 sm:justify-end sm:pl-0">
              <div class="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                <Avatar class="size-4">
                  <AvatarImage src="https://i.pravatar.cc/50?img=60" alt="Marcus Vance" />
                  <AvatarFallback class="text-xs">MV</AvatarFallback>
                </Avatar>
                <span class="text-foreground font-medium">Marcus Vance</span>
              </div>
              <Badge variant="outline" class="gap-1 font-mono text-xs"> Sprint 34 · Aug 28 </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
