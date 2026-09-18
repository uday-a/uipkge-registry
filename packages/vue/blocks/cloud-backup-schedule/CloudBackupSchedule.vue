<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Cloud,
  Database,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ShieldCheck,
  Calendar,
  Play,
  ArrowUpRight,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface BackupSnapshot {
  id: string
  label: string
  size: string
  timestamp: string
  status: 'completed' | 'in_progress' | 'failed'
  checksum: string
}

const props = withDefaults(
  defineProps<{
    initialAutoBackup?: boolean
    frequency?: string
    retentionDays?: number
    storageUsedGb?: number
    storageTotalGb?: number
    class?: string
  }>(),
  {
    initialAutoBackup: true,
    frequency: 'Everyday at 02:00 UTC',
    retentionDays: 30,
    storageUsedGb: 68.4,
    storageTotalGb: 100,
    class: undefined,
  },
)

const autoBackupEnabled = ref(props.initialAutoBackup)
const isBackingUp = ref(false)
const lastBackupSuccess = ref('12 minutes ago')

const snapshots = ref<BackupSnapshot[]>([
  {
    id: 'snap-9842',
    label: 'Daily Scheduled Snapshot',
    size: '14.2 GB',
    timestamp: 'Today, 02:00 UTC',
    status: 'completed',
    checksum: 'sha256:7f9b...a1c3',
  },
  {
    id: 'snap-9841',
    label: 'Daily Scheduled Snapshot',
    size: '14.1 GB',
    timestamp: 'Yesterday, 02:00 UTC',
    status: 'completed',
    checksum: 'sha256:4d8e...90f2',
  },
  {
    id: 'snap-9840',
    label: 'Manual Pre-migration Checkpoint',
    size: '13.9 GB',
    timestamp: 'Sep 15, 14:22 UTC',
    status: 'completed',
    checksum: 'sha256:1a2b...3c4d',
  },
  {
    id: 'snap-9839',
    label: 'Automated Snapshot',
    size: '13.8 GB',
    timestamp: 'Sep 14, 02:00 UTC',
    status: 'failed',
    checksum: 'sha256:9e8f...5d2a',
  },
])

const usagePercentage = computed(() => Math.round((props.storageUsedGb / props.storageTotalGb) * 100))

const handleTriggerBackup = async () => {
  if (isBackingUp.value) return
  isBackingUp.value = true

  // Simulate network backup trigger
  setTimeout(() => {
    isBackingUp.value = false
    lastBackupSuccess.value = 'Just now'
    snapshots.value.unshift({
      id: `snap-${Math.floor(1000 + Math.random() * 9000)}`,
      label: 'Manual On-demand Snapshot',
      size: '14.3 GB',
      timestamp: 'Just now',
      status: 'completed',
      checksum: `sha256:${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
    })
  }, 1200)
}
</script>

<template>
  <div :class="cn('@container w-full max-w-4xl space-y-6', props.class)">
    <!-- Main Backup Management Card -->
    <Card class="border-border shadow-xs">
      <CardHeader class="flex flex-col justify-between gap-4 pb-4 @md:flex-row @md:items-center">
        <div class="min-w-0 space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Cloud class="size-4 shrink-0" />
            </div>
            <CardTitle class="text-base font-semibold tracking-tight sm:text-lg">Cloud Backup & Recovery</CardTitle>
            <Badge variant="outline" class="border-success/20 bg-success/10 text-success shrink-0 gap-1">
              <ShieldCheck class="size-3 shrink-0" />
              AES-256
            </Badge>
          </div>
          <CardDescription class="text-xs sm:text-sm">
            Automated cluster snapshot schedules, retention policies, and disaster recovery replication.
          </CardDescription>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            variant="default"
            class="w-full cursor-pointer gap-1.5 shadow-xs @md:w-auto"
            :disabled="isBackingUp"
            @click="handleTriggerBackup"
          >
            <RotateCw v-if="isBackingUp" class="size-3.5 shrink-0 animate-spin" />
            <Play v-else class="size-3.5 shrink-0 fill-current" />
            {{ isBackingUp ? 'Snapshotting...' : 'Backup Now' }}
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent class="grid grid-cols-1 gap-4 p-4 pt-4 sm:gap-6 sm:p-6 sm:pt-6 @md:grid-cols-2">
        <!-- Automation Schedule Tile -->
        <div class="border-border bg-card min-w-0 space-y-4 rounded-lg border p-3.5 sm:p-4">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <Clock class="text-muted-foreground size-4 shrink-0" />
              <span class="text-sm font-medium">Daily Automation</span>
            </div>
            <Switch v-model="autoBackupEnabled" aria-label="Toggle daily automated backup" class="shrink-0" />
          </div>

          <div class="text-muted-foreground space-y-2 text-xs">
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0">Window:</span>
              <span class="text-foreground truncate text-right font-medium">{{ frequency }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0">Retention:</span>
              <span class="text-foreground truncate text-right font-medium">{{ retentionDays }} days (rolling)</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0">Target:</span>
              <span class="text-foreground truncate text-right font-medium">AWS S3 (us-east-1)</span>
            </div>
          </div>
        </div>

        <!-- Storage Quota Gauge Tile -->
        <div class="border-border bg-card min-w-0 space-y-4 rounded-lg border p-3.5 sm:p-4">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <HardDrive class="text-muted-foreground size-4 shrink-0" />
              <span class="truncate text-sm font-medium">Vault Storage</span>
            </div>
            <span class="text-muted-foreground shrink-0 text-xs font-semibold tabular-nums"
              >{{ usagePercentage }}% used</span
            >
          </div>

          <Progress :model-value="usagePercentage" class="h-2" />

          <div class="text-muted-foreground flex items-center justify-between gap-2 text-xs tabular-nums">
            <span>{{ storageUsedGb }} GB used</span>
            <span class="text-right">{{ storageTotalGb }} GB total</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <!-- Recent Snapshot Ledger -->
      <CardContent class="space-y-4 p-4 pt-4 sm:p-6 sm:pt-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <Database class="text-muted-foreground size-4 shrink-0" />
            <h4 class="text-sm font-semibold tracking-tight">Recent Snapshots</h4>
          </div>
          <span class="text-muted-foreground text-xs">Last verified: {{ lastBackupSuccess }}</span>
        </div>

        <div class="divide-border border-border bg-card divide-y rounded-lg border">
          <div
            v-for="snap in snapshots"
            :key="snap.id"
            class="hover:bg-muted/40 flex flex-col justify-between gap-2 p-3.5 text-sm transition-colors @md:flex-row @md:items-center"
          >
            <div class="flex min-w-0 items-center gap-3">
              <CheckCircle2 v-if="snap.status === 'completed'" class="text-success size-4 shrink-0" />
              <AlertCircle v-else-if="snap.status === 'failed'" class="text-destructive size-4 shrink-0" />
              <RotateCw v-else class="text-primary size-4 shrink-0 animate-spin" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="text-foreground flex flex-wrap items-center gap-1.5 font-medium">
                  <span class="truncate">{{ snap.label }}</span>
                  <span class="text-muted-foreground shrink-0 font-mono text-xs">({{ snap.id }})</span>
                </div>
                <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                  <span class="truncate font-mono">{{ snap.checksum }}</span>
                  <span class="shrink-0">•</span>
                  <span class="shrink-0">{{ snap.size }}</span>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 items-center justify-between gap-3 pl-7 @md:justify-end @md:pl-0">
              <span class="text-muted-foreground text-xs whitespace-nowrap">{{ snap.timestamp }}</span>
              <Badge
                :variant="
                  snap.status === 'completed' ? 'secondary' : snap.status === 'failed' ? 'destructive' : 'outline'
                "
                class="shrink-0 text-xs whitespace-nowrap capitalize"
              >
                {{ snap.status.replace('_', ' ') }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter
        class="border-border text-muted-foreground flex flex-col items-start justify-between gap-3 border-t pt-4 text-xs @md:flex-row @md:items-center"
      >
        <div class="flex items-center gap-2">
          <Calendar class="size-3.5 shrink-0" />
          <span>Next scheduled backup: Tonight at 02:00 UTC</span>
        </div>
        <a
          href="#docs"
          class="text-primary inline-flex shrink-0 items-center gap-1 font-medium hover:underline"
          @click.prevent
        >
          Disaster recovery runbook
          <ArrowUpRight class="size-3 shrink-0" />
        </a>
      </CardFooter>
    </Card>
  </div>
</template>
