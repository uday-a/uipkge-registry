'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export interface BackupSnapshot {
  id: string
  label: string
  size: string
  timestamp: string
  status: 'completed' | 'in_progress' | 'failed'
  checksum: string
}

export interface CloudBackupScheduleProps {
  initialAutoBackup?: boolean
  frequency?: string
  retentionDays?: number
  storageUsedGb?: number
  storageTotalGb?: number
  className?: string
}

export function CloudBackupSchedule({
  initialAutoBackup = true,
  frequency = 'Everyday at 02:00 UTC',
  retentionDays = 30,
  storageUsedGb = 68.4,
  storageTotalGb = 100,
  className,
}: CloudBackupScheduleProps) {
  const [autoBackupEnabled, setAutoBackupEnabled] = React.useState(initialAutoBackup)
  const [isBackingUp, setIsBackingUp] = React.useState(false)
  const [lastBackupSuccess, setLastBackupSuccess] = React.useState('12 minutes ago')
  const [snapshots, setSnapshots] = React.useState<BackupSnapshot[]>([
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

  const usagePercentage = Math.round((storageUsedGb / storageTotalGb) * 100)

  const handleTriggerBackup = () => {
    if (isBackingUp) return
    setIsBackingUp(true)

    setTimeout(() => {
      setIsBackingUp(false)
      setLastBackupSuccess('Just now')
      setSnapshots((prev) => [
        {
          id: `snap-${Math.floor(1000 + Math.random() * 9000)}`,
          label: 'Manual On-demand Snapshot',
          size: '14.3 GB',
          timestamp: 'Just now',
          status: 'completed',
          checksum: `sha256:${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
        },
        ...prev,
      ])
    }, 1200)
  }

  return (
    <div className={cn('w-full max-w-4xl space-y-6', className)}>
      {/* Main Backup Management Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cloud className="size-4" />
              </div>
              <CardTitle className="text-lg font-semibold tracking-tight">Cloud Backup & Recovery</CardTitle>
              <Badge variant="outline" className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3" />
                AES-256
              </Badge>
            </div>
            <CardDescription>
              Automated cluster snapshot schedules, retention policies, and disaster recovery replication.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 shadow-xs cursor-pointer"
              disabled={isBackingUp}
              onClick={handleTriggerBackup}
            >
              {isBackingUp ? (
                <RotateCw className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5 fill-current" />
              )}
              {isBackingUp ? 'Snapshotting...' : 'Backup Now'}
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
          {/* Automation Schedule Tile */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Daily Automation</span>
              </div>
              <Switch
                checked={autoBackupEnabled}
                onCheckedChange={setAutoBackupEnabled}
                aria-label="Toggle daily automated backup"
              />
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Window:</span>
                <span className="font-medium text-foreground">{frequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Retention:</span>
                <span className="font-medium text-foreground">{retentionDays} days (rolling)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Target Region:</span>
                <span className="font-medium text-foreground">AWS S3 (us-east-1)</span>
              </div>
            </div>
          </div>

          {/* Storage Quota Gauge Tile */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardDrive className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Vault Allocation</span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{usagePercentage}% utilized</span>
            </div>

            <Progress value={usagePercentage} className="h-2" />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{storageUsedGb} GB consumed</span>
              <span>{storageTotalGb} GB allocated</span>
            </div>
          </div>
        </CardContent>

        <Separator />

        {/* Recent Snapshot Ledger */}
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold tracking-tight">Recent Snapshots</h4>
            </div>
            <span className="text-xs text-muted-foreground">Last verified: {lastBackupSuccess}</span>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2 text-sm transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  {snap.status === 'completed' ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  ) : snap.status === 'failed' ? (
                    <AlertCircle className="size-4 text-destructive shrink-0" />
                  ) : (
                    <RotateCw className="size-4 text-primary animate-spin shrink-0" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      <span>{snap.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">({snap.id})</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                      <span>{snap.checksum}</span>
                      <span>•</span>
                      <span>{snap.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0">
                  <span className="text-xs text-muted-foreground">{snap.timestamp}</span>
                  <Badge
                    variant={snap.status === 'completed' ? 'secondary' : snap.status === 'failed' ? 'destructive' : 'outline'}
                    className="capitalize text-xs"
                  >
                    {snap.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5" />
            <span>Next scheduled backup: Tonight at 02:00 UTC</span>
          </div>
          <a
            href="#docs"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Disaster recovery runbook
            <ArrowUpRight className="size-3" />
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
