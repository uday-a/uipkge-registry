<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  Globe,
  KeyRound,
  Lock,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

export type SecretType = 'Postgres DB' | 'API Key' | 'RSA Keypair' | 'KMS Key' | 'Redis Auth' | 'MySQL DB'
export type RotationStatus = 'healthy' | 'due-soon' | 'manual-needed' | 'paused' | 'rotating'

export interface RotationSchedule {
  interval: string
  daysInterval: number
  lambdaArn?: string
  zeroDowntimeVerified: boolean
}

export interface ManagedSecret {
  id: string
  name: string
  arn: string
  type: SecretType
  schedule: RotationSchedule
  lastRotated: string
  nextRotationDue: string
  dueRelative: string
  status: RotationStatus
  currentVersion: string
  stagingVersion?: string
  lastLogSnippet?: string
}

export interface SecretsRotationStats {
  totalSecrets: number
  autoRotationActive: number
  autoRotationPercentage: number
  dueSoonCount: number
  overdueCount: number
}

interface Props {
  initialSecrets?: ManagedSecret[]
  initialStats?: SecretsRotationStats
  class?: HTMLAttributes['class']
}

const defaultSecrets: ManagedSecret[] = [
  {
    id: 'sec-1',
    name: 'prod/postgres/master-credentials',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/postgres/master-cred-9aF1x',
    type: 'Postgres DB',
    schedule: {
      interval: 'Every 30 Days',
      daysInterval: 30,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:RotatePostgresMaster',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'Aug 10, 2026',
    nextRotationDue: 'Sep 09, 2026',
    dueRelative: 'in 19 days',
    status: 'healthy',
    currentVersion: 'v2.4 (AWSCURRENT)',
    stagingVersion: 'v2.5 (AWSPENDING)',
    lastLogSnippet:
      'Postgres dual-user handshake verified. Master role privileges synchronized with 0 connection terminations.',
  },
  {
    id: 'sec-2',
    name: 'prod/stripe/webhook-secret',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/stripe/wh-sec-48k2p',
    type: 'API Key',
    schedule: {
      interval: 'Every 90 Days',
      daysInterval: 90,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:RotateStripeWebhook',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'Jul 14, 2026',
    nextRotationDue: 'Aug 22, 2026',
    dueRelative: 'in 24 hours',
    status: 'due-soon',
    currentVersion: 'v1.8 (AWSCURRENT)',
    stagingVersion: 'v1.9 (AWSPENDING)',
    lastLogSnippet: 'Dual webhook signature validation window active. Webhook endpoint test passed with 200 OK.',
  },
  {
    id: 'sec-3',
    name: 'prod/jwt/signing-key-rsa',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/jwt/rsa-pair-71b3e',
    type: 'RSA Keypair',
    schedule: {
      interval: 'Every 7 Days',
      daysInterval: 7,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:RotateJWTRSAKeys',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'Aug 18, 2026',
    nextRotationDue: 'Aug 25, 2026',
    dueRelative: 'in 4 days',
    status: 'healthy',
    currentVersion: 'v9.1 (AWSCURRENT)',
    stagingVersion: 'v9.2 (AWSPENDING)',
    lastLogSnippet:
      'JWKS endpoint updated with secondary public key kid:rsa-2026-w34. Token signature verification succeeded.',
  },
  {
    id: 'sec-4',
    name: 'prod/aws/kms-envelope-key',
    arn: 'arn:aws:kms:us-east-1:182938491029:key/mrk-8492019a-9e1b-4f21-99ad',
    type: 'KMS Key',
    schedule: {
      interval: 'Every 365 Days',
      daysInterval: 365,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:KmsEnvelopeRotationHandler',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'Oct 01, 2025',
    nextRotationDue: 'Oct 01, 2026',
    dueRelative: 'in 41 days',
    status: 'healthy',
    currentVersion: 'v3.0 (AWSCURRENT)',
    stagingVersion: 'v3.1 (AWSPENDING)',
    lastLogSnippet:
      'Hardware Security Module (HSM) backing key refreshed. Transparent decryption verified for existing ciphertexts.',
  },
  {
    id: 'sec-5',
    name: 'prod/redis/cache-auth',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/redis/auth-token-6c90d',
    type: 'Redis Auth',
    schedule: {
      interval: 'Manual Only',
      daysInterval: 0,
      zeroDowntimeVerified: false,
    },
    lastRotated: 'May 12, 2026',
    nextRotationDue: 'Aug 20, 2026',
    dueRelative: 'Overdue (1 day)',
    status: 'manual-needed',
    currentVersion: 'v1.0 (AWSCURRENT)',
    stagingVersion: undefined,
    lastLogSnippet:
      'Automated lambda execution unconfigured. Dual-AUTH token rotation requires manual trigger or handler attachment.',
  },
]

const props = defineProps<Props>()

const stats = computed(
  () =>
    props.initialStats ?? {
      totalSecrets: 18,
      autoRotationActive: 15,
      autoRotationPercentage: 83.3,
      dueSoonCount: 2,
      overdueCount: 0,
    },
)

const secrets = ref<ManagedSecret[]>([...(props.initialSecrets ?? defaultSecrets)])
const search = ref('')
const statusFilter = ref<string>('all')
const bannerMessage = ref<{ type: 'success' | 'info'; text: string } | null>(null)
const rotatingSecretId = ref<string | null>(null)
const copiedArn = ref<string | null>(null)

// Dialogs state
const isRotateModalOpen = ref(false)
const selectedSecretForRotate = ref<ManagedSecret | null>(null)
const isRotatingInProgress = ref(false)

const isScheduleModalOpen = ref(false)
const editingSecret = ref<ManagedSecret | null>(null)
const formName = ref('')
const formArn = ref('')
const formType = ref<SecretType>('Postgres DB')
const formInterval = ref('Every 30 Days')
const formLambdaArn = ref('')
const formZeroDowntime = ref(true)

const isLogsModalOpen = ref(false)
const selectedSecretForLogs = ref<ManagedSecret | null>(null)

const filteredSecrets = computed(() => {
  const q = search.value.trim().toLowerCase()
  return secrets.value.filter((sec) => {
    const matchesStatus =
      statusFilter.value === 'all' ||
      sec.status === statusFilter.value ||
      (statusFilter.value === 'healthy' && sec.status === 'healthy') ||
      (statusFilter.value === 'due-soon' && sec.status === 'due-soon') ||
      (statusFilter.value === 'manual-needed' && sec.status === 'manual-needed') ||
      (statusFilter.value === 'paused' && sec.status === 'paused')

    const matchesSearch =
      !q ||
      sec.name.toLowerCase().includes(q) ||
      sec.arn.toLowerCase().includes(q) ||
      sec.type.toLowerCase().includes(q)

    return matchesStatus && matchesSearch
  })
})

async function copyToClipboard(text: string, id: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedArn.value = id
    setTimeout(() => {
      copiedArn.value = null
    }, 2000)
  } catch {
    copiedArn.value = id
    setTimeout(() => {
      copiedArn.value = null
    }, 2000)
  }
}

function openInstantRotate(secret: ManagedSecret) {
  selectedSecretForRotate.value = secret
  isRotateModalOpen.value = true
}

function executeRotation() {
  if (!selectedSecretForRotate.value) return
  isRotatingInProgress.value = true
  const targetId = selectedSecretForRotate.value.id
  rotatingSecretId.value = targetId

  setTimeout(() => {
    isRotatingInProgress.value = false
    isRotateModalOpen.value = false
    rotatingSecretId.value = null

    const idx = secrets.value.findIndex((s) => s.id === targetId)
    if (idx !== -1) {
      secrets.value[idx] = {
        ...secrets.value[idx],
        lastRotated: 'Just now',
        nextRotationDue: 'Sep 20, 2026',
        dueRelative: 'in 30 days',
        status: 'healthy',
        currentVersion: 'v2.5 (AWSCURRENT)',
        stagingVersion: undefined,
        lastLogSnippet:
          'Zero-downtime rotation completed successfully. Version B verified, promoted to AWSCURRENT, and staged safely.',
      }
    }

    bannerMessage.value = {
      type: 'success',
      text: `Zero-downtime rotation successfully completed for "${selectedSecretForRotate.value?.name}". Credentials validated with 0 dropped sockets.`,
    }
  }, 1400)
}

function openScheduleModal(secret?: ManagedSecret) {
  if (secret) {
    editingSecret.value = secret
    formName.value = secret.name
    formArn.value = secret.arn
    formType.value = secret.type
    formInterval.value = secret.schedule.interval
    formLambdaArn.value = secret.schedule.lambdaArn || ''
    formZeroDowntime.value = secret.schedule.zeroDowntimeVerified
  } else {
    editingSecret.value = null
    formName.value = ''
    formArn.value = ''
    formType.value = 'Postgres DB'
    formInterval.value = 'Every 30 Days'
    formLambdaArn.value = 'arn:aws:lambda:us-east-1:182938491029:function:RotateSecretHandler'
    formZeroDowntime.value = true
  }
  isScheduleModalOpen.value = true
}

function saveSchedule() {
  if (!formName.value.trim()) return

  if (editingSecret.value) {
    const idx = secrets.value.findIndex((s) => s.id === editingSecret.value?.id)
    if (idx !== -1) {
      secrets.value[idx] = {
        ...secrets.value[idx],
        name: formName.value.trim(),
        arn: formArn.value.trim() || secrets.value[idx].arn,
        type: formType.value,
        schedule: {
          ...secrets.value[idx].schedule,
          interval: formInterval.value,
          lambdaArn: formLambdaArn.value.trim() || undefined,
          zeroDowntimeVerified: formZeroDowntime.value,
        },
      }
    }
    bannerMessage.value = {
      type: 'info',
      text: `Rotation schedule for "${formName.value}" updated successfully.`,
    }
  } else {
    const newId = `sec-${Date.now()}`
    const generatedArn =
      formArn.value.trim() ||
      `arn:aws:secretsmanager:us-east-1:182938491029:secret:${formName.value.trim().toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`

    const newSecret: ManagedSecret = {
      id: newId,
      name: formName.value.trim(),
      arn: generatedArn,
      type: formType.value,
      schedule: {
        interval: formInterval.value,
        daysInterval: formInterval.value.includes('7') ? 7 : formInterval.value.includes('90') ? 90 : 30,
        lambdaArn: formLambdaArn.value.trim() || undefined,
        zeroDowntimeVerified: formZeroDowntime.value,
      },
      lastRotated: 'Never (Initial)',
      nextRotationDue: 'Pending First Run',
      dueRelative: 'in 2 hours',
      status: 'healthy',
      currentVersion: 'v1.0 (AWSCURRENT)',
      stagingVersion: undefined,
      lastLogSnippet: 'Initial rotation schedule registered with automated zero-downtime dual-version handshake.',
    }
    secrets.value.unshift(newSecret)
    bannerMessage.value = {
      type: 'success',
      text: `New secret rotation schedule registered for "${newSecret.name}".`,
    }
  }
  isScheduleModalOpen.value = false
}

function togglePause(secret: ManagedSecret) {
  const nextStatus: RotationStatus = secret.status === 'paused' ? 'healthy' : 'paused'
  secret.status = nextStatus
  bannerMessage.value = {
    type: 'info',
    text: `Rotation schedule for "${secret.name}" ${nextStatus === 'paused' ? 'paused' : 'resumed'}.`,
  }
}

function openLogsModal(secret: ManagedSecret) {
  selectedSecretForLogs.value = secret
  isLogsModalOpen.value = true
}

function getTypeBadgeVariant(type: SecretType): 'default' | 'secondary' | 'outline' | 'info' | 'warning' {
  switch (type) {
    case 'Postgres DB':
    case 'MySQL DB':
      return 'info'
    case 'API Key':
      return 'secondary'
    case 'RSA Keypair':
      return 'outline'
    case 'KMS Key':
      return 'default'
    case 'Redis Auth':
      return 'warning'
    default:
      return 'outline'
  }
}
</script>

<template>
  <div data-slot="secrets-rotation-scheduler" :class="cn('w-full space-y-6', props.class)">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Lock class="size-4.5" />
          </div>
          <h1 class="text-foreground text-2xl font-bold tracking-tight">Automated Secrets Rotation & Key Lifecycle</h1>
        </div>
        <p class="text-muted-foreground text-sm">
          Configure zero-downtime rotation schedules for database credentials, API keys, and certificates.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button @click="openScheduleModal()">
          <Plus class="mr-1.5 size-4" />
          Schedule New Rotation
        </Button>
      </div>
    </div>

    <!-- Notification / Action banner -->
    <div
      v-if="bannerMessage"
      class="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs"
    >
      <div class="flex items-center gap-2.5 text-sm">
        <CheckCircle2
          v-if="bannerMessage.type === 'success'"
          class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
        <Sparkles v-else class="text-primary size-4 shrink-0" />
        <span class="text-foreground font-medium">{{ bannerMessage.text }}</span>
      </div>
      <Button variant="ghost" size="icon" class="size-7" @click="bannerMessage = null">
        <X class="size-3.5" />
        <span class="sr-only">Dismiss</span>
      </Button>
    </div>

    <!-- 4 Key Lifecycle Telemetry Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Managed Secrets -->
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Total Managed Secrets</CardTitle>
          <div class="bg-primary/10 text-primary rounded-lg p-2">
            <KeyRound class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight">{{ stats.totalSecrets }} credentials</div>
          <p class="text-muted-foreground text-xs">Across 4 cloud regions</p>
        </CardContent>
      </Card>

      <!-- Auto-Rotation Active -->
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Auto-Rotation Active</CardTitle>
          <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <RefreshCw class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight">
              {{ stats.autoRotationActive }} / {{ stats.totalSecrets }} secrets
            </span>
            <Badge variant="success" class="text-xs"> {{ stats.autoRotationPercentage }}% </Badge>
          </div>
          <p class="text-muted-foreground text-xs">Zero-downtime dual versioning enabled</p>
        </CardContent>
      </Card>

      <!-- Rotation Due Soon -->
      <Card class="border-amber-500/30 bg-amber-500/5 shadow-xs dark:bg-amber-500/10">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-amber-700 dark:text-amber-300">Rotation Due Soon</CardTitle>
          <div class="rounded-lg bg-amber-500/20 p-2 text-amber-700 dark:text-amber-300">
            <Clock class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
              {{ stats.dueSoonCount }} secrets
            </span>
            <Badge variant="warning" class="text-xs">Next 48h</Badge>
          </div>
          <p class="text-xs text-amber-600/90 dark:text-amber-400/90">Automated queue pre-scheduled</p>
        </CardContent>
      </Card>

      <!-- Expired / Overdue -->
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Expired / Overdue</CardTitle>
          <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight">
              {{ stats.overdueCount }} critical overdue
            </span>
            <Badge variant="outline" class="text-xs">Compliant</Badge>
          </div>
          <p class="text-muted-foreground text-xs">Zero security compliance violations</p>
        </CardContent>
      </Card>
    </div>

    <!-- Secrets Rotation Table Card -->
    <Card class="shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-lg font-semibold">Managed Secrets & Automated Rotation</CardTitle>
            <CardDescription class="text-xs">
              {{ filteredSecrets.length }} of {{ secrets.length }} cryptographic secrets configured for automated
              lifecycle management.
            </CardDescription>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="relative w-full min-w-0 sm:w-64">
              <Search
                class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <Input v-model="search" placeholder="Search secrets or ARN" class="h-8 pl-9 text-xs" />
            </div>

            <Select v-model="statusFilter">
              <SelectTrigger class="h-8 w-36 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="healthy">Automated · Healthy</SelectItem>
                <SelectItem value="due-soon">Due Soon (&lt;48h)</SelectItem>
                <SelectItem value="manual-needed">Manual Needed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" class="hidden h-8 items-center gap-1 font-mono text-xs md:inline-flex">
              <Globe class="size-3" />
              AWS us-east-1
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="min-w-[260px]">Secret Name & ARN Identifier</TableHead>
                <TableHead class="min-w-[130px]">Secret Type</TableHead>
                <TableHead class="min-w-[170px]">Rotation Interval</TableHead>
                <TableHead class="min-w-[200px]">Last Rotated & Next Due</TableHead>
                <TableHead class="min-w-[170px]">Rotation Status</TableHead>
                <TableHead class="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="secret in filteredSecrets" :key="secret.id" class="group transition-colors">
                <!-- Secret Name & ARN Identifier -->
                <TableCell class="py-3.5">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground text-sm font-medium">{{ secret.name }}</span>
                      <RefreshCw
                        v-if="rotatingSecretId === secret.id"
                        class="text-primary size-3.5 animate-spin"
                        aria-label="Rotating now"
                      />
                    </div>
                    <div class="flex items-center gap-1.5">
                      <code
                        class="text-muted-foreground max-w-[260px] truncate font-mono text-xs sm:max-w-[320px]"
                        :title="secret.arn"
                      >
                        {{ secret.arn }}
                      </code>
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground inline-flex size-4 shrink-0 items-center justify-center transition-colors"
                        :aria-label="'Copy ARN for ' + secret.name"
                        @click="copyToClipboard(secret.arn, secret.id)"
                      >
                        <Check v-if="copiedArn === secret.id" class="size-3 text-emerald-600 dark:text-emerald-400" />
                        <Copy v-else class="size-3" />
                      </button>
                    </div>
                  </div>
                </TableCell>

                <!-- Secret Type Badge -->
                <TableCell class="py-3.5">
                  <Badge :variant="getTypeBadgeVariant(secret.type)" class="gap-1 text-xs">
                    <Database v-if="secret.type === 'Postgres DB' || secret.type === 'MySQL DB'" class="size-3" />
                    <KeyRound v-else-if="secret.type === 'API Key'" class="size-3" />
                    <ShieldCheck v-else-if="secret.type === 'RSA Keypair'" class="size-3" />
                    <Lock v-else-if="secret.type === 'KMS Key'" class="size-3" />
                    <Server v-else-if="secret.type === 'Redis Auth'" class="size-3" />
                    {{ secret.type }}
                  </Badge>
                </TableCell>

                <!-- Rotation Interval -->
                <TableCell class="py-3.5">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-1.5 text-xs font-medium">
                      <Clock class="text-muted-foreground size-3.5 shrink-0" />
                      <span class="text-foreground">{{ secret.schedule.interval }}</span>
                    </div>
                    <p
                      v-if="secret.schedule.lambdaArn"
                      class="text-muted-foreground max-w-[160px] truncate font-mono text-xs"
                      :title="secret.schedule.lambdaArn"
                    >
                      λ {{ secret.schedule.lambdaArn.split(':function:')[1] || 'Lambda' }}
                    </p>
                    <p v-else class="text-muted-foreground font-mono text-xs">Manual trigger</p>
                  </div>
                </TableCell>

                <!-- Last Rotated & Next Due -->
                <TableCell class="py-3.5">
                  <div class="space-y-0.5 text-xs">
                    <div class="text-foreground font-medium">
                      {{ secret.nextRotationDue }}
                      <span
                        v-if="secret.status === 'due-soon'"
                        class="font-semibold text-amber-600 dark:text-amber-400"
                      >
                        ({{ secret.dueRelative }})
                      </span>
                      <span v-else class="text-muted-foreground"> ({{ secret.dueRelative }}) </span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      Last: <span class="font-mono">{{ secret.lastRotated }}</span>
                    </p>
                  </div>
                </TableCell>

                <!-- Rotation Status Badge -->
                <TableCell class="py-3.5">
                  <div class="space-y-1">
                    <Badge v-if="secret.status === 'healthy'" variant="success" class="gap-1 text-xs">
                      <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Automated · Healthy
                    </Badge>
                    <Badge v-else-if="secret.status === 'due-soon'" variant="warning" class="gap-1 text-xs">
                      <Clock class="size-3" />
                      Rotation Due Soon
                    </Badge>
                    <Badge v-else-if="secret.status === 'manual-needed'" variant="warning" class="gap-1 text-xs">
                      <AlertTriangle class="size-3" />
                      Manual Rotation Needed
                    </Badge>
                    <Badge v-else-if="secret.status === 'paused'" variant="secondary" class="gap-1 text-xs">
                      <Pause class="size-3" />
                      Paused
                    </Badge>
                    <Badge v-else variant="outline" class="gap-1 text-xs">
                      <RefreshCw class="size-3 animate-spin" />
                      Rotating
                    </Badge>

                    <div class="text-muted-foreground font-mono text-xs">
                      {{ secret.currentVersion }}
                    </div>
                  </div>
                </TableCell>

                <!-- Actions Menu -->
                <TableCell class="py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-8">
                        <MoreHorizontal class="size-4" />
                        <span class="sr-only">Open actions menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                      <DropdownMenuLabel class="text-xs">Rotation Controls</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="cursor-pointer" @click="openInstantRotate(secret)">
                        <Play class="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Rotate Now (Zero Downtime)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer" @click="openScheduleModal(secret)">
                        <Pencil class="mr-2 size-4" />
                        <span>Edit Schedule</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer" @click="openLogsModal(secret)">
                        <Terminal class="mr-2 size-4" />
                        <span>View Rotation Lambda Log</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="cursor-pointer" @click="togglePause(secret)">
                        <Pause v-if="secret.status !== 'paused'" class="mr-2 size-4" />
                        <Play v-else class="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{{ secret.status !== 'paused' ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation' }}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredSecrets.length === 0">
                <TableCell colspan="6" class="text-muted-foreground h-32 text-center text-sm">
                  No secrets found matching the selected filter criteria.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Instant Rotate Modal / Dialog (Zero-Downtime Confirmation) -->
    <Dialog v-model:open="isRotateModalOpen">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <RefreshCw class="size-5" />
            </div>
            <div>
              <DialogTitle>Trigger Zero-Downtime Rotation</DialogTitle>
              <DialogDescription class="text-xs">
                AWS Secrets Manager 4-step staging promotion for credential lifecycle safety.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <!-- Target Secret Summary -->
          <div class="border-border bg-muted/50 space-y-2 rounded-lg border p-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Target Secret:</span>
              <span class="text-foreground font-mono font-semibold">{{ selectedSecretForRotate?.name }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Current Active:</span>
              <Badge variant="outline" class="font-mono text-xs">
                {{ selectedSecretForRotate?.currentVersion }}
              </Badge>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Staging Target:</span>
              <Badge variant="info" class="font-mono text-xs">
                {{ selectedSecretForRotate?.stagingVersion || 'v2.5 (AWSPENDING)' }}
              </Badge>
            </div>
          </div>

          <!-- 4-Step Zero-Downtime Process Visualizer -->
          <div class="space-y-2">
            <span class="text-foreground text-xs font-semibold tracking-wider uppercase">
              Dual-Version Execution Workflow
            </span>
            <div class="border-border bg-card space-y-2.5 rounded-lg border p-3.5 text-xs">
              <div class="flex items-start gap-2.5">
                <div
                  class="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                  1
                </div>
                <div class="space-y-0.5">
                  <p class="text-foreground font-semibold">createSecret (Staging)</p>
                  <p class="text-muted-foreground text-xs">
                    Generates 32-byte cryptographic entropy and provisions version
                    <code class="font-mono font-semibold">AWSPENDING</code>.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div
                  class="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                  2
                </div>
                <div class="space-y-0.5">
                  <p class="text-foreground font-semibold">setSecret (Dual-Authentication)</p>
                  <p class="text-muted-foreground text-xs">
                    Updates target resource (Postgres / API / KMS) so both Version A and Version B remain valid.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div
                  class="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                  3
                </div>
                <div class="space-y-0.5">
                  <p class="text-foreground font-semibold">testSecret (Handshake Verification)</p>
                  <p class="text-muted-foreground text-xs">
                    Lambda executes synthetic database query using new credentials to verify validity.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div
                  class="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                  4
                </div>
                <div class="space-y-0.5">
                  <p class="text-foreground font-semibold">finishSecret (Label Promotion)</p>
                  <p class="text-muted-foreground text-xs">
                    Moves <code class="font-mono font-semibold">AWSCURRENT</code> to Version B and demotes old version
                    to <code class="font-mono font-semibold">AWSPREVIOUS</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Zero-Downtime Guarantee Banner -->
          <div
            class="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-300"
          >
            <ShieldCheck class="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Zero-Downtime Guarantee:</strong> Existing connections continue using Version A until Version B is
              100% verified. No dropped TCP sockets or authentication spikes.
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" :disabled="isRotatingInProgress" @click="isRotateModalOpen = false">
            Cancel
          </Button>
          <Button :disabled="isRotatingInProgress" class="gap-1.5" @click="executeRotation">
            <RefreshCw v-if="isRotatingInProgress" class="size-4 animate-spin" />
            <Play v-else class="size-4" />
            {{ isRotatingInProgress ? 'Executing Dual-Stage Rotation...' : 'Confirm & Rotate Immediately' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Schedule / Edit Schedule Dialog -->
    <Dialog v-model:open="isScheduleModalOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ editingSecret ? 'Edit Rotation Schedule' : 'Schedule Secret Rotation' }}</DialogTitle>
          <DialogDescription class="text-xs">
            Configure automated periodic rotation interval and AWS Lambda rotation handler.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <label for="form-secret-name" class="text-foreground text-xs font-medium">Secret Name / Path</label>
            <Input
              id="form-secret-name"
              v-model="formName"
              placeholder="e.g. prod/postgres/replica-credentials"
              class="text-xs"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label for="form-secret-type" class="text-foreground text-xs font-medium">Secret Type</label>
              <Select v-model="formType">
                <SelectTrigger id="form-secret-type" class="text-xs">
                  <SelectValue placeholder="Secret Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Postgres DB">Postgres DB</SelectItem>
                  <SelectItem value="MySQL DB">MySQL DB</SelectItem>
                  <SelectItem value="API Key">API Key</SelectItem>
                  <SelectItem value="RSA Keypair">RSA Keypair</SelectItem>
                  <SelectItem value="KMS Key">KMS Key</SelectItem>
                  <SelectItem value="Redis Auth">Redis Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <label for="form-secret-interval" class="text-foreground text-xs font-medium">Rotation Interval</label>
              <Select v-model="formInterval">
                <SelectTrigger id="form-secret-interval" class="text-xs">
                  <SelectValue placeholder="Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Every 7 Days">Every 7 Days</SelectItem>
                  <SelectItem value="Every 30 Days">Every 30 Days</SelectItem>
                  <SelectItem value="Every 60 Days">Every 60 Days</SelectItem>
                  <SelectItem value="Every 90 Days">Every 90 Days</SelectItem>
                  <SelectItem value="Every 365 Days">Every 365 Days</SelectItem>
                  <SelectItem value="Manual Only">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="form-secret-lambda" class="text-foreground text-xs font-medium">
              Rotation Lambda Function ARN
            </label>
            <Input
              id="form-secret-lambda"
              v-model="formLambdaArn"
              placeholder="arn:aws:lambda:us-east-1:182938491029:function:RotateSecret"
              class="font-mono text-xs"
            />
          </div>

          <div class="border-border bg-muted/40 flex items-center justify-between rounded-lg border p-3">
            <div class="space-y-0.5">
              <p class="text-foreground text-xs font-medium">Zero-Downtime Dual Versioning</p>
              <p class="text-muted-foreground text-xs">Verify staging version before promoting AWSCURRENT</p>
            </div>
            <Badge variant="success" class="text-xs">Active</Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isScheduleModalOpen = false">Cancel</Button>
          <Button :disabled="!formName.trim()" @click="saveSchedule">
            {{ editingSecret ? 'Save Changes' : 'Create Rotation Schedule' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- View Rotation Lambda Log Dialog -->
    <Dialog v-model:open="isLogsModalOpen">
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <Terminal class="text-primary size-5" />
            <DialogTitle class="font-mono text-base">{{ selectedSecretForLogs?.name }}</DialogTitle>
          </div>
          <DialogDescription class="font-mono text-xs">
            Lambda Handler: {{ selectedSecretForLogs?.schedule.lambdaArn || 'arn:aws:lambda:...:RotateDefault' }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-3 py-1">
          <div class="border-border bg-muted/60 flex items-center justify-between rounded-md border px-3 py-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Last Invocation:</span>
              <span class="text-foreground font-mono font-medium">{{ selectedSecretForLogs?.lastRotated }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Status:</span>
              <Badge variant="success" class="font-mono text-xs">200 OK - SUCCESS</Badge>
            </div>
          </div>

          <!-- Terminal Output Simulation -->
          <div
            class="border-border space-y-1.5 overflow-x-auto rounded-lg border bg-black/90 p-4 font-mono text-xs text-emerald-400 dark:bg-black"
          >
            <p class="text-muted-foreground">START RequestId: 4f8b91a2-631c-4b89-9801-ec8492019a Version: $LATEST</p>
            <p class="text-emerald-400">
              [INFO] Step 1/4 createSecret: Generating 32-byte cryptographic entropy for AWSPENDING...
            </p>
            <p class="text-emerald-400">
              [INFO] Step 2/4 setSecret: Applying shadow credentials to destination cluster. Dual-auth enabled.
            </p>
            <p class="text-emerald-400">
              [INFO] Step 3/4 testSecret: Executing test query `SELECT 1` from staging connection pool -> Verified
              (6.4ms)
            </p>
            <p class="text-emerald-400">
              [INFO] Step 4/4 finishSecret: Swapped AWSCURRENT label to staging version. Previous marked AWSPREVIOUS.
            </p>
            <p class="text-muted-foreground">END RequestId: 4f8b91a2-631c-4b89-9801-ec8492019a</p>
            <p class="text-muted-foreground">
              REPORT RequestId: 4f8b91a2-631c-4b89-9801-ec8492019a Duration: 342.15 ms Billed Duration: 343 ms Memory
              Size: 256 MB Max Memory Used: 68 MB
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isLogsModalOpen = false">Close Logs</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
