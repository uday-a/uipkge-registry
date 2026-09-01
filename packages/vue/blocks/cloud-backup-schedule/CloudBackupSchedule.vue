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

const usagePercentage = computed(() =>
  Math.round((props.storageUsedGb / props.storageTotalGb) * 100),
)

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
  <div :class="cn('w-full max-w-4xl space-y-6', props.class)">
    <!-- Main Backup Management Card -->
    <Card class="border-border shadow-xs">
      <CardHeader class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cloud class="size-4" />
            </div>
            <CardTitle class="text-lg font-semibold tracking-tight">Cloud Backup & Recovery</CardTitle>
            <Badge variant="outline" class="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck class="size-3" />
              AES-256
            </Badge>
          </div>
          <CardDescription>
            Automated cluster snapshot schedules, retention policies, and disaster recovery replication.
          </CardDescription>
        </div>

        <div class="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            class="gap-1.5 shadow-xs cursor-pointer"
            :disabled="isBackingUp"
            @click="handleTriggerBackup"
          >
            <RotateCw v-if="isBackingUp" class="size-3.5 animate-spin" />
            <Play v-else class="size-3.5 fill-current" />
            {{ isBackingUp ? 'Snapshotting...' : 'Backup Now' }}
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent class="grid gap-6 pt-6 sm:grid-cols-2">
        <!-- Automation Schedule Tile -->
        <div class="space-y-4 rounded-lg border border-border bg-card p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <Clock class="size-4 text-muted-foreground" />
              <span class="text-sm font-medium">Daily Automation</span>
            </div>
            <Switch
              v-model="autoBackupEnabled"
              aria-label="Toggle daily automated backup"
            />
          </div>

          <div class="space-y-2 text-xs text-muted-foreground">
            <div class="flex items-center justify-between">
              <span>Window:</span>
              <span class="font-medium text-foreground">{{ frequency }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Retention:</span>
              <span class="font-medium text-foreground">{{ retentionDays }} days (rolling)</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Target Region:</span>
              <span class="font-medium text-foreground">AWS S3 (us-east-1)</span>
            </div>
          </div>
        </div>

        <!-- Storage Quota Gauge Tile -->
        <div class="space-y-4 rounded-lg border border-border bg-card p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <HardDrive class="size-4 text-muted-foreground" />
              <span class="text-sm font-medium">Vault Allocation</span>
            </div>
            <span class="text-xs font-semibold text-muted-foreground">{{ usagePercentage }}% utilized</span>
          </div>

          <Progress :model-value="usagePercentage" class="h-2" />

          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span>{{ storageUsedGb }} GB consumed</span>
            <span>{{ storageTotalGb }} GB allocated</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <!-- Recent Snapshot Ledger -->
      <CardContent class="pt-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Database class="size-4 text-muted-foreground" />
            <h4 class="text-sm font-semibold tracking-tight">Recent Snapshots</h4>
          </div>
          <span class="text-xs text-muted-foreground">Last verified: {{ lastBackupSuccess }}</span>
        </div>

        <div class="divide-y divide-border rounded-lg border border-border bg-card">
          <div
            v-for="snap in snapshots"
            :key="snap.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2 text-sm transition-colors hover:bg-muted/40"
          >
            <div class="flex items-center gap-3">
              <CheckCircle2
                v-if="snap.status === 'completed'"
                class="size-4 text-emerald-500 shrink-0"
              />
              <AlertCircle
                v-else-if="snap.status === 'failed'"
                class="size-4 text-destructive shrink-0"
              />
              <RotateCw
                v-else
                class="size-4 text-primary animate-spin shrink-0"
              />
              <div class="space-y-0.5">
                <div class="font-medium text-foreground flex items-center gap-2">
                  <span>{{ snap.label }}</span>
                  <span class="font-mono text-xs text-muted-foreground">({{ snap.id }})</span>
                </div>
                <div class="font-mono text-xs text-muted-foreground flex items-center gap-2">
                  <span>{{ snap.checksum }}</span>
                  <span>•</span>
                  <span>{{ snap.size }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0">
              <span class="text-xs text-muted-foreground">{{ snap.timestamp }}</span>
              <Badge
                :variant="snap.status === 'completed' ? 'secondary' : snap.status === 'failed' ? 'destructive' : 'outline'"
                class="capitalize text-xs"
              >
                {{ snap.status.replace('_', ' ') }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <div class="flex items-center gap-2">
          <Calendar class="size-3.5" />
          <span>Next scheduled backup: Tonight at 02:00 UTC</span>
        </div>
        <a
          href="#docs"
          class="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          @click.prevent
        >
          Disaster recovery runbook
          <ArrowUpRight class="size-3" />
        </a>
      </CardFooter>
    </Card>
  </div>
</template>
