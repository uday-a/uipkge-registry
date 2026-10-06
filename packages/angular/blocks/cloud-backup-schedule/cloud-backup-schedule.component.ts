// Automated cloud snapshot scheduler: an automation tile with a toggle, a storage quota
// gauge, and a recent-snapshot ledger. "Backup Now" simulates a 1.2s snapshot and prepends it.
import { Component, DestroyRef, Input, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core'
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  HardDrive,
  LucideAngularModule,
  Play,
  RotateCw,
  ShieldCheck,
} from 'lucide-angular'
import { cn } from '@/lib/utils'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardFooterComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '@/ui/card/card.component'
import { UiButtonComponent } from '@/ui/button/button.component'
import { UiBadgeComponent, type BadgeVariant } from '@/ui/badge/badge.component'
import { UiProgressComponent } from '@/ui/progress/progress.component'
import { UiSwitchComponent } from '@/ui/switch/switch.component'
import { UiSeparatorComponent } from '@/ui/separator/separator.component'

export interface BackupSnapshot {
  id: string
  label: string
  size: string
  timestamp: string
  status: 'completed' | 'in_progress' | 'failed'
  checksum: string
}

const initialSnapshots: BackupSnapshot[] = [
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
]

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-cloud-backup-schedule, [ui-cloud-backup-schedule]',
  standalone: true,
  // React renders the root <div> itself: the host stays out of layout and `class` goes to the root.
  host: { '[attr.class]': '"contents"' },
  imports: [
    LucideAngularModule,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiCardFooterComponent,
    UiButtonComponent,
    UiBadgeComponent,
    UiProgressComponent,
    UiSwitchComponent,
    UiSeparatorComponent,
  ],
  template: `
    <div [class]="rootClass">
      <!-- Main Backup Management Card -->
      <div ui-card class="border-border shadow-xs">
        <div ui-card-header class="flex flex-col justify-between gap-4 pb-4 @md:flex-row @md:items-center">
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <div class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                <lucide-icon [img]="Cloud" class="size-4 shrink-0" />
              </div>
              <h3 ui-card-title class="text-base font-semibold tracking-tight sm:text-lg">
                Cloud Backup &amp; Recovery
              </h3>
              <span ui-badge variant="outline" class="border-success/20 bg-success/10 text-success shrink-0 gap-1">
                <lucide-icon [img]="ShieldCheck" class="size-3 shrink-0" />
                AES-256
              </span>
            </div>
            <p ui-card-description class="text-xs sm:text-sm">
              Automated cluster snapshot schedules, retention policies, and disaster recovery replication.
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <button
              ui-button
              size="sm"
              variant="default"
              class="w-full cursor-pointer gap-1.5 shadow-xs @md:w-auto"
              [disabled]="isBackingUp()"
              (click)="handleTriggerBackup()"
            >
              @if (isBackingUp()) {
                <lucide-icon [img]="RotateCw" class="size-3.5 shrink-0 animate-spin" />
              } @else {
                <lucide-icon [img]="Play" class="size-3.5 shrink-0 fill-current" />
              }
              {{ isBackingUp() ? 'Snapshotting...' : 'Backup Now' }}
            </button>
          </div>
        </div>

        <div ui-separator></div>

        <div ui-card-content class="grid grid-cols-1 gap-4 p-4 pt-4 sm:gap-6 sm:p-6 sm:pt-6 @md:grid-cols-2">
          <!-- Automation Schedule Tile -->
          <div class="border-border bg-card min-w-0 space-y-4 rounded-lg border p-3.5 sm:p-4">
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2.5">
                <lucide-icon [img]="Clock" class="text-muted-foreground size-4 shrink-0" />
                <span class="text-sm font-medium">Daily Automation</span>
              </div>
              <button
                ui-switch
                [checked]="autoBackupEnabled()"
                (checkedChange)="autoBackupEnabled.set($event)"
                aria-label="Toggle daily automated backup"
                class="shrink-0"
              ></button>
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
                <lucide-icon [img]="HardDrive" class="text-muted-foreground size-4 shrink-0" />
                <span class="truncate text-sm font-medium">Vault Storage</span>
              </div>
              <span class="text-muted-foreground shrink-0 text-xs font-semibold tabular-nums"
                >{{ usagePercentage }}% used</span
              >
            </div>

            <div ui-progress [value]="usagePercentage" class="h-2"></div>

            <div class="text-muted-foreground flex items-center justify-between gap-2 text-xs tabular-nums">
              <span>{{ storageUsedGb }} GB used</span>
              <span class="text-right">{{ storageTotalGb }} GB total</span>
            </div>
          </div>
        </div>

        <div ui-separator></div>

        <!-- Recent Snapshot Ledger -->
        <div ui-card-content class="space-y-4 p-4 pt-4 sm:p-6 sm:pt-6">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="Database" class="text-muted-foreground size-4 shrink-0" />
              <h4 class="text-sm font-semibold tracking-tight">Recent Snapshots</h4>
            </div>
            <span class="text-muted-foreground text-xs">Last verified: {{ lastBackupSuccess() }}</span>
          </div>

          <div class="divide-border border-border bg-card divide-y rounded-lg border">
            @for (snap of snapshots(); track snap.id) {
              <div
                class="hover:bg-muted/40 flex flex-col justify-between gap-2 p-3.5 text-sm transition-colors @md:flex-row @md:items-center"
              >
                <div class="flex min-w-0 items-center gap-3">
                  @if (snap.status === 'completed') {
                    <lucide-icon [img]="CheckCircle2" class="text-success size-4 shrink-0" />
                  } @else if (snap.status === 'failed') {
                    <lucide-icon [img]="AlertCircle" class="text-destructive size-4 shrink-0" />
                  } @else {
                    <lucide-icon [img]="RotateCw" class="text-primary size-4 shrink-0 animate-spin" />
                  }
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
                  <span
                    ui-badge
                    [variant]="statusVariant(snap.status)"
                    class="shrink-0 text-xs whitespace-nowrap capitalize"
                    >{{ statusLabel(snap.status) }}</span
                  >
                </div>
              </div>
            }
          </div>
        </div>

        <div
          ui-card-footer
          class="border-border text-muted-foreground flex flex-col items-start justify-between gap-3 border-t pt-4 text-xs @md:flex-row @md:items-center"
        >
          <div class="flex items-center gap-2">
            <lucide-icon [img]="Calendar" class="size-3.5 shrink-0" />
            <span>Next scheduled backup: Tonight at 02:00 UTC</span>
          </div>
          <a
            href="#docs"
            class="text-primary inline-flex shrink-0 items-center gap-1 font-medium hover:underline"
            (click)="$event.preventDefault()"
            >Disaster recovery runbook<lucide-icon [img]="ArrowUpRight" class="size-3 shrink-0"
          /></a>
        </div>
      </div>
    </div>
  `,
})
export class UiCloudBackupScheduleComponent implements OnInit {
  @Input() initialAutoBackup = true
  @Input() frequency = 'Everyday at 02:00 UTC'
  @Input() retentionDays = 30
  @Input() storageUsedGb = 68.4
  @Input() storageTotalGb = 100
  @Input('class') className?: string

  readonly autoBackupEnabled = signal(true)
  readonly isBackingUp = signal(false)
  readonly lastBackupSuccess = signal('12 minutes ago')
  readonly snapshots = signal<BackupSnapshot[]>(initialSnapshots.map((s) => ({ ...s })))

  protected readonly AlertCircle = AlertCircle
  protected readonly ArrowUpRight = ArrowUpRight
  protected readonly Calendar = Calendar
  protected readonly CheckCircle2 = CheckCircle2
  protected readonly Clock = Clock
  protected readonly Cloud = Cloud
  protected readonly Database = Database
  protected readonly HardDrive = HardDrive
  protected readonly Play = Play
  protected readonly RotateCw = RotateCw
  protected readonly ShieldCheck = ShieldCheck

  private timer: ReturnType<typeof setTimeout> | undefined

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer))
  }

  // React seeds useState from the prop once; inputs are only bound by ngOnInit.
  ngOnInit(): void {
    this.autoBackupEnabled.set(this.initialAutoBackup)
  }

  get rootClass(): string {
    return cn('@container w-full max-w-4xl space-y-6', this.className)
  }

  get usagePercentage(): number {
    return Math.round((this.storageUsedGb / this.storageTotalGb) * 100)
  }

  statusVariant(status: BackupSnapshot['status']): BadgeVariant {
    return status === 'completed' ? 'secondary' : status === 'failed' ? 'destructive' : 'outline'
  }

  statusLabel(status: BackupSnapshot['status']): string {
    return status.replace('_', ' ')
  }

  handleTriggerBackup(): void {
    if (this.isBackingUp()) return
    this.isBackingUp.set(true)

    this.timer = setTimeout(() => {
      this.isBackingUp.set(false)
      this.lastBackupSuccess.set('Just now')
      this.snapshots.update((prev) => [
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
}
