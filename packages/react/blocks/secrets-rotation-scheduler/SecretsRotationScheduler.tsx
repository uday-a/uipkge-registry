'use client'

import * as React from 'react'
import {
  AlertTriangle,
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
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react'
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

export interface SecretsRotationSchedulerProps {
  initialSecrets?: ManagedSecret[]
  initialStats?: SecretsRotationStats
  className?: string
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

const defaultStats: SecretsRotationStats = {
  totalSecrets: 18,
  autoRotationActive: 15,
  autoRotationPercentage: 83.3,
  dueSoonCount: 2,
  overdueCount: 0,
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

export function SecretsRotationScheduler({
  initialSecrets = defaultSecrets,
  initialStats = defaultStats,
  className,
}: SecretsRotationSchedulerProps) {
  const [secrets, setSecrets] = React.useState<ManagedSecret[]>(initialSecrets)
  const [search, setSearch] = React.useState<string>('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [bannerMessage, setBannerMessage] = React.useState<{ type: 'success' | 'info'; text: string } | null>(null)
  const [rotatingSecretId, setRotatingSecretId] = React.useState<string | null>(null)
  const [copiedArn, setCopiedArn] = React.useState<string | null>(null)

  // Dialogs
  const [isRotateModalOpen, setIsRotateModalOpen] = React.useState<boolean>(false)
  const [selectedSecretForRotate, setSelectedSecretForRotate] = React.useState<ManagedSecret | null>(null)
  const [isRotatingInProgress, setIsRotatingInProgress] = React.useState<boolean>(false)

  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState<boolean>(false)
  const [editingSecret, setEditingSecret] = React.useState<ManagedSecret | null>(null)
  const [formName, setFormName] = React.useState<string>('')
  const [formArn, setFormArn] = React.useState<string>('')
  const [formType, setFormType] = React.useState<SecretType>('Postgres DB')
  const [formInterval, setFormInterval] = React.useState<string>('Every 30 Days')
  const [formLambdaArn, setFormLambdaArn] = React.useState<string>('')
  const [formZeroDowntime, setFormZeroDowntime] = React.useState<boolean>(true)

  const [isLogsModalOpen, setIsLogsModalOpen] = React.useState<boolean>(false)
  const [selectedSecretForLogs, setSelectedSecretForLogs] = React.useState<ManagedSecret | null>(null)

  const filteredSecrets = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return secrets.filter((sec) => {
      const matchesStatus =
        statusFilter === 'all' ||
        sec.status === statusFilter ||
        (statusFilter === 'healthy' && sec.status === 'healthy') ||
        (statusFilter === 'due-soon' && sec.status === 'due-soon') ||
        (statusFilter === 'manual-needed' && sec.status === 'manual-needed') ||
        (statusFilter === 'paused' && sec.status === 'paused')

      const matchesSearch =
        !q ||
        sec.name.toLowerCase().includes(q) ||
        sec.arn.toLowerCase().includes(q) ||
        sec.type.toLowerCase().includes(q)

      return matchesStatus && matchesSearch
    })
  }, [secrets, search, statusFilter])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedArn(id)
      setTimeout(() => setCopiedArn(null), 2000)
    } catch {
      setCopiedArn(id)
      setTimeout(() => setCopiedArn(null), 2000)
    }
  }

  const openInstantRotate = (secret: ManagedSecret) => {
    setSelectedSecretForRotate(secret)
    setIsRotateModalOpen(true)
  }

  const executeRotation = () => {
    if (!selectedSecretForRotate) return
    setIsRotatingInProgress(true)
    const targetId = selectedSecretForRotate.id
    setRotatingSecretId(targetId)

    setTimeout(() => {
      setIsRotatingInProgress(false)
      setIsRotateModalOpen(false)
      setRotatingSecretId(null)

      setSecrets((prev) =>
        prev.map((s) =>
          s.id === targetId
            ? {
                ...s,
                lastRotated: 'Just now',
                nextRotationDue: 'Sep 20, 2026',
                dueRelative: 'in 30 days',
                status: 'healthy',
                currentVersion: 'v2.5 (AWSCURRENT)',
                stagingVersion: undefined,
                lastLogSnippet:
                  'Zero-downtime rotation completed successfully. Version B verified, promoted to AWSCURRENT, and staged safely.',
              }
            : s,
        ),
      )

      setBannerMessage({
        type: 'success',
        text: `Zero-downtime rotation successfully completed for "${selectedSecretForRotate.name}". Credentials validated with 0 dropped sockets.`,
      })
    }, 1400)
  }

  const openScheduleModal = (secret?: ManagedSecret) => {
    if (secret) {
      setEditingSecret(secret)
      setFormName(secret.name)
      setFormArn(secret.arn)
      setFormType(secret.type)
      setFormInterval(secret.schedule.interval)
      setFormLambdaArn(secret.schedule.lambdaArn || '')
      setFormZeroDowntime(secret.schedule.zeroDowntimeVerified)
    } else {
      setEditingSecret(null)
      setFormName('')
      setFormArn('')
      setFormType('Postgres DB')
      setFormInterval('Every 30 Days')
      setFormLambdaArn('arn:aws:lambda:us-east-1:182938491029:function:RotateSecretHandler')
      setFormZeroDowntime(true)
    }
    setIsScheduleModalOpen(true)
  }

  const saveSchedule = () => {
    if (!formName.trim()) return

    if (editingSecret) {
      setSecrets((prev) =>
        prev.map((s) =>
          s.id === editingSecret.id
            ? {
                ...s,
                name: formName.trim(),
                arn: formArn.trim() || s.arn,
                type: formType,
                schedule: {
                  ...s.schedule,
                  interval: formInterval,
                  lambdaArn: formLambdaArn.trim() || undefined,
                  zeroDowntimeVerified: formZeroDowntime,
                },
              }
            : s,
        ),
      )
      setBannerMessage({
        type: 'info',
        text: `Rotation schedule for "${formName}" updated successfully.`,
      })
    } else {
      const newId = `sec-${Date.now()}`
      const generatedArn =
        formArn.trim() ||
        `arn:aws:secretsmanager:us-east-1:182938491029:secret:${formName.trim().toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`

      const newSecret: ManagedSecret = {
        id: newId,
        name: formName.trim(),
        arn: generatedArn,
        type: formType,
        schedule: {
          interval: formInterval,
          daysInterval: formInterval.includes('7') ? 7 : formInterval.includes('90') ? 90 : 30,
          lambdaArn: formLambdaArn.trim() || undefined,
          zeroDowntimeVerified: formZeroDowntime,
        },
        lastRotated: 'Never (Initial)',
        nextRotationDue: 'Pending First Run',
        dueRelative: 'in 2 hours',
        status: 'healthy',
        currentVersion: 'v1.0 (AWSCURRENT)',
        stagingVersion: undefined,
        lastLogSnippet: 'Initial rotation schedule registered with automated zero-downtime dual-version handshake.',
      }
      setSecrets((prev) => [newSecret, ...prev])
      setBannerMessage({
        type: 'success',
        text: `New secret rotation schedule registered for "${newSecret.name}".`,
      })
    }
    setIsScheduleModalOpen(false)
  }

  const togglePause = (secret: ManagedSecret) => {
    const nextStatus: RotationStatus = secret.status === 'paused' ? 'healthy' : 'paused'
    setSecrets((prev) => prev.map((s) => (s.id === secret.id ? { ...s, status: nextStatus } : s)))
    setBannerMessage({
      type: 'info',
      text: `Rotation schedule for "${secret.name}" ${nextStatus === 'paused' ? 'paused' : 'resumed'}.`,
    })
  }

  const openLogsModal = (secret: ManagedSecret) => {
    setSelectedSecretForLogs(secret)
    setIsLogsModalOpen(true)
  }

  return (
    <div data-slot="secrets-rotation-scheduler" className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Lock className="size-4.5" />
            </div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Automated Secrets Rotation & Key Lifecycle
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Configure zero-downtime rotation schedules for database credentials, API keys, and certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => openScheduleModal()}>
            <Plus className="mr-1.5 size-4" />
            Schedule New Rotation
          </Button>
        </div>
      </div>

      {/* Notification / Action banner */}
      {bannerMessage && (
        <div className="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-sm">
            {bannerMessage.type === 'success' ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Sparkles className="text-primary size-4 shrink-0" />
            )}
            <span className="text-foreground font-medium">{bannerMessage.text}</span>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={() => setBannerMessage(null)}>
            <X className="size-3.5" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      )}

      {/* 4 Key Lifecycle Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Managed Secrets */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Managed Secrets</CardTitle>
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <KeyRound className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight">
              {initialStats.totalSecrets} credentials
            </div>
            <p className="text-muted-foreground text-xs">Across 4 cloud regions</p>
          </CardContent>
        </Card>

        {/* Auto-Rotation Active */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Auto-Rotation Active</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <RefreshCw className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {initialStats.autoRotationActive} / {initialStats.totalSecrets} secrets
              </span>
              <Badge variant="success" className="text-xs">
                {initialStats.autoRotationPercentage}%
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">Zero-downtime dual versioning enabled</p>
          </CardContent>
        </Card>

        {/* Rotation Due Soon */}
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs dark:bg-amber-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Rotation Due Soon</CardTitle>
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-700 dark:text-amber-300">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
                {initialStats.dueSoonCount} secrets
              </span>
              <Badge variant="warning" className="text-xs">
                Next 48h
              </Badge>
            </div>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90">Automated queue pre-scheduled</p>
          </CardContent>
        </Card>

        {/* Expired / Overdue */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Expired / Overdue</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {initialStats.overdueCount} critical overdue
              </span>
              <Badge variant="outline" className="text-xs">
                Compliant
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">Zero security compliance violations</p>
          </CardContent>
        </Card>
      </div>

      {/* Secrets Rotation Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Managed Secrets & Automated Rotation</CardTitle>
              <CardDescription className="text-xs">
                {filteredSecrets.length} of {secrets.length} cryptographic secrets configured for automated lifecycle
                management.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full min-w-0 sm:w-64">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search secrets or ARN"
                  className="h-8 pl-9 text-xs"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-36 text-xs">
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

              <Badge variant="outline" className="hidden h-8 items-center gap-1 font-mono text-xs md:inline-flex">
                <Globe className="size-3" />
                AWS us-east-1
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[260px]">Secret Name & ARN Identifier</TableHead>
                  <TableHead className="min-w-[130px]">Secret Type</TableHead>
                  <TableHead className="min-w-[170px]">Rotation Interval</TableHead>
                  <TableHead className="min-w-[200px]">Last Rotated & Next Due</TableHead>
                  <TableHead className="min-w-[170px]">Rotation Status</TableHead>
                  <TableHead className="w-16 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSecrets.map((secret) => (
                  <TableRow key={secret.id} className="group transition-colors">
                    {/* Secret Name & ARN Identifier */}
                    <TableCell className="py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground text-sm font-medium">{secret.name}</span>
                          {rotatingSecretId === secret.id && (
                            <RefreshCw className="text-primary size-3.5 animate-spin" aria-label="Rotating now" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <code
                            className="text-muted-foreground max-w-[260px] truncate font-mono text-xs sm:max-w-[320px]"
                            title={secret.arn}
                          >
                            {secret.arn}
                          </code>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground inline-flex size-4 shrink-0 items-center justify-center transition-colors"
                            aria-label={`Copy ARN for ${secret.name}`}
                            onClick={() => copyToClipboard(secret.arn, secret.id)}
                          >
                            {copiedArn === secret.id ? (
                              <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </TableCell>

                    {/* Secret Type Badge */}
                    <TableCell className="py-3.5">
                      <Badge variant={getTypeBadgeVariant(secret.type)} className="gap-1 text-xs">
                        {(secret.type === 'Postgres DB' || secret.type === 'MySQL DB') && (
                          <Database className="size-3" />
                        )}
                        {secret.type === 'API Key' && <KeyRound className="size-3" />}
                        {secret.type === 'RSA Keypair' && <ShieldCheck className="size-3" />}
                        {secret.type === 'KMS Key' && <Lock className="size-3" />}
                        {secret.type === 'Redis Auth' && <Server className="size-3" />}
                        {secret.type}
                      </Badge>
                    </TableCell>

                    {/* Rotation Interval */}
                    <TableCell className="py-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Clock className="text-muted-foreground size-3.5 shrink-0" />
                          <span className="text-foreground">{secret.schedule.interval}</span>
                        </div>
                        {secret.schedule.lambdaArn ? (
                          <p
                            className="text-muted-foreground max-w-[160px] truncate font-mono text-xs"
                            title={secret.schedule.lambdaArn}
                          >
                            λ {secret.schedule.lambdaArn.split(':function:')[1] || 'Lambda'}
                          </p>
                        ) : (
                          <p className="text-muted-foreground font-mono text-xs">Manual trigger</p>
                        )}
                      </div>
                    </TableCell>

                    {/* Last Rotated & Next Due */}
                    <TableCell className="py-3.5">
                      <div className="space-y-0.5 text-xs">
                        <div className="text-foreground font-medium">
                          {secret.nextRotationDue}
                          {secret.status === 'due-soon' ? (
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              {' '}
                              ({secret.dueRelative})
                            </span>
                          ) : (
                            <span className="text-muted-foreground"> ({secret.dueRelative})</span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Last: <span className="font-mono">{secret.lastRotated}</span>
                        </p>
                      </div>
                    </TableCell>

                    {/* Rotation Status Badge */}
                    <TableCell className="py-3.5">
                      <div className="space-y-1">
                        {secret.status === 'healthy' && (
                          <Badge variant="success" className="gap-1 text-xs">
                            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                            Automated · Healthy
                          </Badge>
                        )}
                        {secret.status === 'due-soon' && (
                          <Badge variant="warning" className="gap-1 text-xs">
                            <Clock className="size-3" />
                            Rotation Due Soon
                          </Badge>
                        )}
                        {secret.status === 'manual-needed' && (
                          <Badge variant="warning" className="gap-1 text-xs">
                            <AlertTriangle className="size-3" />
                            Manual Rotation Needed
                          </Badge>
                        )}
                        {secret.status === 'paused' && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Pause className="size-3" />
                            Paused
                          </Badge>
                        )}
                        {secret.status === 'rotating' && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <RefreshCw className="size-3 animate-spin" />
                            Rotating
                          </Badge>
                        )}

                        <div className="text-muted-foreground font-mono text-xs">{secret.currentVersion}</div>
                      </div>
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open actions menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-xs">Rotation Controls</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openInstantRotate(secret)}>
                            <Play className="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Rotate Now (Zero Downtime)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openScheduleModal(secret)}>
                            <Pencil className="mr-2 size-4" />
                            <span>Edit Schedule</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openLogsModal(secret)}>
                            <Terminal className="mr-2 size-4" />
                            <span>View Rotation Lambda Log</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" onClick={() => togglePause(secret)}>
                            {secret.status !== 'paused' ? (
                              <>
                                <Pause className="mr-2 size-4" />
                                <span>Pause Auto-Rotation</span>
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Resume Auto-Rotation</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredSecrets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-32 text-center text-sm">
                      No secrets found matching the selected filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Instant Rotate Modal / Dialog (Zero-Downtime Confirmation) */}
      <Dialog open={isRotateModalOpen} onOpenChange={setIsRotateModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <RefreshCw className="size-5" />
              </div>
              <div>
                <DialogTitle>Trigger Zero-Downtime Rotation</DialogTitle>
                <DialogDescription className="text-xs">
                  AWS Secrets Manager 4-step staging promotion for credential lifecycle safety.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Target Secret Summary */}
            <div className="border-border bg-muted/50 space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Target Secret:</span>
                <span className="text-foreground font-mono font-semibold">{selectedSecretForRotate?.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Current Active:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedSecretForRotate?.currentVersion}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Staging Target:</span>
                <Badge variant="info" className="font-mono text-xs">
                  {selectedSecretForRotate?.stagingVersion || 'v2.5 (AWSPENDING)'}
                </Badge>
              </div>
            </div>

            {/* 4-Step Zero-Downtime Process Visualizer */}
            <div className="space-y-2">
              <span className="text-foreground text-xs font-semibold tracking-wider uppercase">
                Dual-Version Execution Workflow
              </span>
              <div className="border-border bg-card space-y-2.5 rounded-lg border p-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-foreground font-semibold">createSecret (Staging)</p>
                    <p className="text-muted-foreground text-xs">
                      Generates 32-byte cryptographic entropy and provisions version{' '}
                      <code className="font-mono font-semibold">AWSPENDING</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-foreground font-semibold">setSecret (Dual-Authentication)</p>
                    <p className="text-muted-foreground text-xs">
                      Updates target resource (Postgres / API / KMS) so both Version A and Version B remain valid.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-foreground font-semibold">testSecret (Handshake Verification)</p>
                    <p className="text-muted-foreground text-xs">
                      Lambda executes synthetic database query using new credentials to verify validity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    4
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-foreground font-semibold">finishSecret (Label Promotion)</p>
                    <p className="text-muted-foreground text-xs">
                      Moves <code className="font-mono font-semibold">AWSCURRENT</code> to Version B and demotes old
                      version to <code className="font-mono font-semibold">AWSPREVIOUS</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Zero-Downtime Guarantee Banner */}
            <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Zero-Downtime Guarantee:</strong> Existing connections continue using Version A until Version B
                is 100% verified. No dropped TCP sockets or authentication spikes.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={isRotatingInProgress} onClick={() => setIsRotateModalOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isRotatingInProgress} className="gap-1.5" onClick={executeRotation}>
              {isRotatingInProgress ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  <span>Executing Dual-Stage Rotation...</span>
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  <span>Confirm & Rotate Immediately</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule / Edit Schedule Dialog */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSecret ? 'Edit Rotation Schedule' : 'Schedule Secret Rotation'}</DialogTitle>
            <DialogDescription className="text-xs">
              Configure automated periodic rotation interval and AWS Lambda rotation handler.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="form-secret-name-react" className="text-foreground text-xs font-medium">
                Secret Name / Path
              </label>
              <Input
                id="form-secret-name-react"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. prod/postgres/replica-credentials"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="form-secret-type-react" className="text-foreground text-xs font-medium">
                  Secret Type
                </label>
                <Select value={formType} onValueChange={(val) => setFormType(val as SecretType)}>
                  <SelectTrigger id="form-secret-type-react" className="text-xs">
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

              <div className="space-y-1.5">
                <label htmlFor="form-secret-interval-react" className="text-foreground text-xs font-medium">
                  Rotation Interval
                </label>
                <Select value={formInterval} onValueChange={setFormInterval}>
                  <SelectTrigger id="form-secret-interval-react" className="text-xs">
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

            <div className="space-y-1.5">
              <label htmlFor="form-secret-lambda-react" className="text-foreground text-xs font-medium">
                Rotation Lambda Function ARN
              </label>
              <Input
                id="form-secret-lambda-react"
                value={formLambdaArn}
                onChange={(e) => setFormLambdaArn(e.target.value)}
                placeholder="arn:aws:lambda:us-east-1:182938491029:function:RotateSecret"
                className="font-mono text-xs"
              />
            </div>

            <div className="border-border bg-muted/40 flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <p className="text-foreground text-xs font-medium">Zero-Downtime Dual Versioning</p>
                <p className="text-muted-foreground text-xs">Verify staging version before promoting AWSCURRENT</p>
              </div>
              <Badge variant="success" className="text-xs">
                Active
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!formName.trim()} onClick={saveSchedule}>
              {editingSecret ? 'Save Changes' : 'Create Rotation Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Rotation Lambda Log Dialog */}
      <Dialog open={isLogsModalOpen} onOpenChange={setIsLogsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Terminal className="text-primary size-5" />
              <DialogTitle className="font-mono text-base">{selectedSecretForLogs?.name}</DialogTitle>
            </div>
            <DialogDescription className="font-mono text-xs">
              Lambda Handler: {selectedSecretForLogs?.schedule.lambdaArn || 'arn:aws:lambda:...:RotateDefault'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="border-border bg-muted/60 flex items-center justify-between rounded-md border px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Last Invocation:</span>
                <span className="text-foreground font-mono font-medium">{selectedSecretForLogs?.lastRotated}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="success" className="font-mono text-xs">
                  200 OK - SUCCESS
                </Badge>
              </div>
            </div>

            {/* Terminal Output Simulation */}
            <div className="border-border space-y-1.5 overflow-x-auto rounded-lg border bg-black/90 p-4 font-mono text-xs text-emerald-400 dark:bg-black">
              <p className="text-muted-foreground">
                START RequestId: 4f8b91a2-631c-4b89-9801-ec8492019a Version: $LATEST
              </p>
              <p className="text-emerald-400">
                [INFO] Step 1/4 createSecret: Generating 32-byte cryptographic entropy for AWSPENDING...
              </p>
              <p className="text-emerald-400">
                [INFO] Step 2/4 setSecret: Applying shadow credentials to destination cluster. Dual-auth enabled.
              </p>
              <p className="text-emerald-400">
                [INFO] Step 3/4 testSecret: Executing test query `SELECT 1` from staging connection pool -&gt; Verified
                (6.4ms)
              </p>
              <p className="text-emerald-400">
                [INFO] Step 4/4 finishSecret: Swapped AWSCURRENT label to staging version. Previous marked AWSPREVIOUS.
              </p>
              <p className="text-muted-foreground">END RequestId: 4f8b91a2-631c-4b89-9801-ec8492019a</p>
              <p className="text-muted-foreground">
                REPORT RequestId: 4f8b91a2-631c-4b89-9801-ec8492019a Duration: 342.15 ms Billed Duration: 343 ms Memory
                Size: 256 MB Max Memory Used: 68 MB
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogsModalOpen(false)}>
              Close Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SecretsRotationScheduler
