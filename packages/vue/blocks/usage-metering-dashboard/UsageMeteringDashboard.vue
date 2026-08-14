<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { Activity, ArrowDownUp, ArrowUpRight, Cpu, Database, TriangleAlert, Zap } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface UsageEvent {
  id: string
  timestamp: string
  service: string
  description: string
  volume: string
  status: 'warning' | 'normal'
  statusLabel: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const autoScaleProtection = ref(true)
const alertThreshold = ref('90')

const events: UsageEvent[] = [
  {
    id: 'evt-1',
    timestamp: 'Aug 18, 2026 14:22',
    service: 'API Gateway',
    description: 'Spike: Batch sync job',
    volume: '+240,000 reqs',
    status: 'warning',
    statusLabel: 'High Spike',
  },
  {
    id: 'evt-2',
    timestamp: 'Aug 17, 2026 09:15',
    service: 'Vector Storage',
    description: 'Index re-indexing & optimization',
    volume: '+12.4 GB',
    status: 'normal',
    statusLabel: 'Normal',
  },
  {
    id: 'evt-3',
    timestamp: 'Aug 16, 2026 22:40',
    service: 'Compute Cluster',
    description: 'Model inference burst job',
    volume: '+85.0 hrs',
    status: 'normal',
    statusLabel: 'Normal',
  },
  {
    id: 'evt-4',
    timestamp: 'Aug 15, 2026 11:05',
    service: 'CDN Edge',
    description: 'Media cache invalidation & egress',
    volume: '+64.2 GB',
    status: 'normal',
    statusLabel: 'Normal',
  },
  {
    id: 'evt-5',
    timestamp: 'Aug 14, 2026 18:30',
    service: 'API Gateway',
    description: 'Webhook delivery retry storm',
    volume: '+180,000 reqs',
    status: 'warning',
    statusLabel: 'High Spike',
  },
]
</script>

<template>
  <div data-slot="usage-metering-dashboard" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Usage & Metering</h1>
        <p class="text-muted-foreground text-sm">
          Monitor your organization's resource consumption and billing cycle limits.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="shrink-0 gap-1.5">
          <Zap class="size-4 fill-amber-500 text-amber-500" />
          <span>Change Plan</span>
          <ArrowUpRight class="text-muted-foreground size-3.5" />
        </Button>
      </div>
    </div>

    <Card class="bg-muted/30 p-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground text-sm font-semibold">Current Billing Period</span>
            <Badge wrap variant="outline" class="text-xs font-normal">Scale Plan — $199/mo</Badge>
          </div>
          <p class="text-muted-foreground text-xs tabular-nums">
            Day 18 of 30 · Current period ends Sep 1, 2026 (12 days remaining)
          </p>
        </div>
        <div class="w-full space-y-1.5 sm:w-72">
          <div class="flex items-center justify-between gap-x-2 text-xs">
            <span class="text-muted-foreground">Cycle Progress</span>
            <span class="text-foreground font-medium tabular-nums">60%</span>
          </div>
          <Progress :model-value="60" class="h-1.5" />
        </div>
      </div>
    </Card>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Activity class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">API Requests</CardTitle>
            </div>
            <Badge wrap variant="warning" class="shrink-0 gap-1 text-xs">
              <TriangleAlert class="size-3" />
              <span>Approaching Limit</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">1.84M</span>
              <span class="text-muted-foreground tabular-nums">/ 2.0M limit</span>
            </div>
            <Progress :model-value="92" class="h-2 [&_[data-slot=progress-indicator]]:bg-amber-500" />
            <div class="mt-1.5 flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground tabular-nums">92% utilized</span>
              <span class="text-warning font-medium tabular-nums">160K remaining</span>
            </div>
          </div>
          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Projected at month-end:</span>
              <span class="text-foreground font-medium tabular-nums">2.15M</span>
            </div>
            <p class="text-warning mt-0.5 text-xs font-medium tabular-nums">+150K overage (~$15.00)</p>
          </div>
        </CardContent>
      </Card>

      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Cpu class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Compute Hours</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">Healthy</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">420</span>
              <span class="text-muted-foreground tabular-nums">/ 1,000 hrs limit</span>
            </div>
            <Progress :model-value="42" class="h-2 [&_[data-slot=progress-indicator]]:bg-emerald-500" />
            <div class="mt-1.5 flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground tabular-nums">42% utilized</span>
              <span class="text-muted-foreground tabular-nums">580 hrs remaining</span>
            </div>
          </div>
          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Projected at month-end:</span>
              <span class="text-foreground font-medium tabular-nums">700 hrs</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Within allowance (300 hrs headroom)</p>
          </div>
        </CardContent>
      </Card>

      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Database class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Vector Storage</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">Healthy</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">78 GB</span>
              <span class="text-muted-foreground tabular-nums">/ 100 GB limit</span>
            </div>
            <Progress :model-value="78" class="h-2" />
            <div class="mt-1.5 flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground tabular-nums">78% utilized</span>
              <span class="text-muted-foreground tabular-nums">22 GB remaining</span>
            </div>
          </div>
          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Projected at month-end:</span>
              <span class="text-foreground font-medium tabular-nums">84 GB</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Within allowance (16 GB headroom)</p>
          </div>
        </CardContent>
      </Card>

      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <ArrowDownUp class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Bandwidth / Egress</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">Healthy</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">412 GB</span>
              <span class="text-muted-foreground tabular-nums">/ 500 GB limit</span>
            </div>
            <Progress :model-value="82.4" class="h-2" />
            <div class="mt-1.5 flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground tabular-nums">82.4% utilized</span>
              <span class="text-muted-foreground tabular-nums">88 GB remaining</span>
            </div>
          </div>
          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Projected at month-end:</span>
              <span class="text-foreground font-medium tabular-nums">485 GB</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Within allowance (15 GB headroom)</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between gap-x-2">
            <CardTitle>Projected Month-End Cost</CardTitle>
            <Badge wrap variant="warning" class="gap-1 text-xs">
              <TriangleAlert class="size-3" />
              <span>Overage Projected</span>
            </Badge>
          </div>
          <CardDescription>
            Estimated cycle total factoring base tier and current consumption trajectory.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            class="border-border bg-muted/40 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 rounded-lg border p-4"
          >
            <div>
              <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Projected Invoice</p>
              <p class="text-foreground text-3xl font-bold tracking-tight tabular-nums">$214.00</p>
            </div>
            <div class="text-right">
              <span class="text-muted-foreground text-xs">
                Base Plan: <strong class="text-foreground font-semibold tabular-nums">$199.00</strong>
              </span>
              <p class="text-warning text-xs font-semibold tabular-nums">+$15.00 overage</p>
            </div>
          </div>

          <div class="space-y-2.5 text-sm">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-foreground">Scale Plan Base Subscription</span>
              <span class="text-foreground font-medium tabular-nums">$199.00</span>
            </div>
            <div class="flex items-center justify-between gap-x-2">
              <div class="flex items-center gap-1.5">
                <span class="text-foreground">API Requests Overage</span>
                <Badge wrap variant="outline" class="text-xs font-normal">150K @ $0.10 / 1K</Badge>
              </div>
              <span class="text-warning font-medium tabular-nums">+$15.00</span>
            </div>
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Compute Hours (1,000 hrs allowance)</span>
              <span class="text-muted-foreground tabular-nums">$0.00</span>
            </div>
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Storage & Egress Bandwidth</span>
              <span class="text-muted-foreground tabular-nums">$0.00</span>
            </div>
          </div>

          <Separator />

          <div class="text-muted-foreground flex items-center justify-between gap-x-2 text-xs">
            <span>Next scheduled invoice date</span>
            <span class="text-foreground font-medium tabular-nums">September 1, 2026</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overage Protection & Alerts</CardTitle>
          <CardDescription>
            Configure notifications and automated guardrails before limits are breached.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <label class="text-foreground text-sm leading-none font-medium">Auto-scale Overage Protection</label>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Automatically throttle or scale resources to prevent unexpected billing spikes beyond set allowances.
              </p>
            </div>
            <Switch v-model="autoScaleProtection" aria-label="Toggle auto-scale overage protection" />
          </div>

          <Separator />

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <label class="text-foreground text-sm leading-none font-medium">Email Alert Threshold</label>
              <p class="text-muted-foreground text-xs">
                Notify workspace admins when any metric crosses this percentage.
              </p>
            </div>
            <Select v-model="alertThreshold">
              <SelectTrigger class="w-full text-xs sm:w-44" aria-label="Email alert threshold">
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="80">80% of limit</SelectItem>
                <SelectItem value="90">90% of limit</SelectItem>
                <SelectItem value="100">100% of limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div class="bg-muted/40 border-border space-y-1.5 rounded-lg border p-3">
            <div class="flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground">Hard Spending Cap</span>
              <span class="text-foreground font-semibold tabular-nums">$300.00 / mo</span>
            </div>
            <div class="flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground">Recipients</span>
              <span class="text-muted-foreground truncate">billing-alerts@acme.corp</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent Usage Events</CardTitle>
            <CardDescription>
              High-volume consumption spikes and automated resource scaling events this cycle.
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="w-fit text-xs font-normal tabular-nums">5 events logged</Badge>
        </div>
      </CardHeader>
      <CardContent class="p-0 sm:p-6 sm:pt-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Event Description</TableHead>
                <TableHead class="text-right">Volume</TableHead>
                <TableHead class="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="event in events" :key="event.id">
                <TableCell class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                  {{ event.timestamp }}
                </TableCell>
                <TableCell class="text-foreground text-xs font-medium whitespace-nowrap">
                  {{ event.service }}
                </TableCell>
                <TableCell class="text-muted-foreground text-xs">
                  {{ event.description }}
                </TableCell>
                <TableCell class="text-foreground text-right text-xs font-medium whitespace-nowrap tabular-nums">
                  {{ event.volume }}
                </TableCell>
                <TableCell class="text-right">
                  <Badge
                    :variant="event.status === 'warning' ? 'warning' : 'success'"
                    class="text-xs whitespace-normal"
                  >
                    {{ event.statusLabel }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
