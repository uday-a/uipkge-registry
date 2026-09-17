"use client";

import * as React from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export interface BackupSnapshot {
  id: string;
  label: string;
  size: string;
  timestamp: string;
  status: "completed" | "in_progress" | "failed";
  checksum: string;
}

export interface CloudBackupScheduleProps {
  initialAutoBackup?: boolean;
  frequency?: string;
  retentionDays?: number;
  storageUsedGb?: number;
  storageTotalGb?: number;
  className?: string;
}

export function CloudBackupSchedule({
  initialAutoBackup = true,
  frequency = "Everyday at 02:00 UTC",
  retentionDays = 30,
  storageUsedGb = 68.4,
  storageTotalGb = 100,
  className,
}: CloudBackupScheduleProps) {
  const [autoBackupEnabled, setAutoBackupEnabled] =
    React.useState(initialAutoBackup);
  const [isBackingUp, setIsBackingUp] = React.useState(false);
  const [lastBackupSuccess, setLastBackupSuccess] =
    React.useState("12 minutes ago");
  const [snapshots, setSnapshots] = React.useState<BackupSnapshot[]>([
    {
      id: "snap-9842",
      label: "Daily Scheduled Snapshot",
      size: "14.2 GB",
      timestamp: "Today, 02:00 UTC",
      status: "completed",
      checksum: "sha256:7f9b...a1c3",
    },
    {
      id: "snap-9841",
      label: "Daily Scheduled Snapshot",
      size: "14.1 GB",
      timestamp: "Yesterday, 02:00 UTC",
      status: "completed",
      checksum: "sha256:4d8e...90f2",
    },
    {
      id: "snap-9840",
      label: "Manual Pre-migration Checkpoint",
      size: "13.9 GB",
      timestamp: "Sep 15, 14:22 UTC",
      status: "completed",
      checksum: "sha256:1a2b...3c4d",
    },
    {
      id: "snap-9839",
      label: "Automated Snapshot",
      size: "13.8 GB",
      timestamp: "Sep 14, 02:00 UTC",
      status: "failed",
      checksum: "sha256:9e8f...5d2a",
    },
  ]);

  const usagePercentage = Math.round((storageUsedGb / storageTotalGb) * 100);

  const handleTriggerBackup = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);

    setTimeout(() => {
      setIsBackingUp(false);
      setLastBackupSuccess("Just now");
      setSnapshots((prev) => [
        {
          id: `snap-${Math.floor(1000 + Math.random() * 9000)}`,
          label: "Manual On-demand Snapshot",
          size: "14.3 GB",
          timestamp: "Just now",
          status: "completed",
          checksum: `sha256:${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
        },
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className={cn("@container w-full max-w-4xl space-y-6", className)}>
      {/* Main Backup Management Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col justify-between gap-4 pb-4 @md:flex-row @md:items-center">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                <Cloud className="size-4 shrink-0" />
              </div>
              <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">
                Cloud Backup & Recovery
              </CardTitle>
              <Badge
                variant="outline"
                className="border-success/20 bg-success/10 text-success shrink-0 gap-1"
              >
                <ShieldCheck className="size-3 shrink-0" />
                AES-256
              </Badge>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Automated cluster snapshot schedules, retention policies, and
              disaster recovery replication.
            </CardDescription>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="w-full cursor-pointer gap-1.5 shadow-xs @md:w-auto"
              disabled={isBackingUp}
              onClick={handleTriggerBackup}
            >
              {isBackingUp ? (
                <RotateCw className="size-3.5 shrink-0 animate-spin" />
              ) : (
                <Play className="size-3.5 shrink-0 fill-current" />
              )}
              {isBackingUp ? "Snapshotting..." : "Backup Now"}
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="grid grid-cols-1 gap-4 p-4 pt-4 sm:gap-6 sm:p-6 sm:pt-6 @md:grid-cols-2">
          {/* Automation Schedule Tile */}
          <div className="border-border bg-card min-w-0 space-y-4 rounded-lg border p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <Clock className="text-muted-foreground size-4 shrink-0" />
                <span className="text-sm font-medium">Daily Automation</span>
              </div>
              <Switch
                checked={autoBackupEnabled}
                onCheckedChange={setAutoBackupEnabled}
                aria-label="Toggle daily automated backup"
                className="shrink-0"
              />
            </div>

            <div className="text-muted-foreground space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0">Window:</span>
                <span className="text-foreground truncate text-right font-medium">
                  {frequency}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0">Retention:</span>
                <span className="text-foreground truncate text-right font-medium">
                  {retentionDays} days (rolling)
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0">Target:</span>
                <span className="text-foreground truncate text-right font-medium">
                  AWS S3 (us-east-1)
                </span>
              </div>
            </div>
          </div>

          {/* Storage Quota Gauge Tile */}
          <div className="border-border bg-card min-w-0 space-y-4 rounded-lg border p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <HardDrive className="text-muted-foreground size-4 shrink-0" />
                <span className="truncate text-sm font-medium">
                  Vault Storage
                </span>
              </div>
              <span className="text-muted-foreground shrink-0 text-xs font-semibold tabular-nums">
                {usagePercentage}% used
              </span>
            </div>

            <Progress value={usagePercentage} className="h-2" />

            <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs tabular-nums">
              <span>{storageUsedGb} GB used</span>
              <span className="text-right">{storageTotalGb} GB total</span>
            </div>
          </div>
        </CardContent>

        <Separator />

        {/* Recent Snapshot Ledger */}
        <CardContent className="space-y-4 p-4 pt-4 sm:p-6 sm:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="text-muted-foreground size-4 shrink-0" />
              <h4 className="text-sm font-semibold tracking-tight">
                Recent Snapshots
              </h4>
            </div>
            <span className="text-muted-foreground text-xs">
              Last verified: {lastBackupSuccess}
            </span>
          </div>

          <div className="divide-border border-border bg-card divide-y rounded-lg border">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="hover:bg-muted/40 flex flex-col justify-between gap-2 p-3.5 text-sm transition-colors @md:flex-row @md:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {snap.status === "completed" ? (
                    <CheckCircle2 className="text-success size-4 shrink-0" />
                  ) : snap.status === "failed" ? (
                    <AlertCircle className="text-destructive size-4 shrink-0" />
                  ) : (
                    <RotateCw className="text-primary size-4 shrink-0 animate-spin" />
                  )}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-foreground flex flex-wrap items-center gap-1.5 font-medium">
                      <span className="truncate">{snap.label}</span>
                      <span className="text-muted-foreground shrink-0 font-mono text-xs">
                        ({snap.id})
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                      <span className="truncate font-mono">
                        {snap.checksum}
                      </span>
                      <span className="shrink-0">•</span>
                      <span className="shrink-0">{snap.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 pl-7 @md:justify-end @md:pl-0">
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {snap.timestamp}
                  </span>
                  <Badge
                    variant={
                      snap.status === "completed"
                        ? "secondary"
                        : snap.status === "failed"
                          ? "destructive"
                          : "outline"
                    }
                    className="shrink-0 text-xs whitespace-nowrap capitalize"
                  >
                    {snap.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-border text-muted-foreground flex flex-col items-start justify-between gap-3 border-t pt-4 text-xs @md:flex-row @md:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 shrink-0" />
            <span>Next scheduled backup: Tonight at 02:00 UTC</span>
          </div>
          <a
            href="#docs"
            className="text-primary inline-flex shrink-0 items-center gap-1 font-medium hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Disaster recovery runbook
            <ArrowUpRight className="size-3 shrink-0" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
