<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import {
  Activity,
  Heart,
  TrendingDown,
  Minus,
  CheckCircle2,
  Plus,
  Sliders,
  Droplets,
  Wind,
  RefreshCw,
  Bell,
  ShieldCheck,
  Stethoscope,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

interface DailyVitalLog {
  id: string
  date: string
  isToday?: boolean
  morningBP: string
  morningPulse: number
  eveningBP: string
  eveningPulse: number
  avgBP: string
  systolicVal: number
  diastolicVal: number
  fastingGlucose: number
  glucoseStatus: 'optimal' | 'normal' | 'elevated'
  spo2: number
  riskStatus: 'optimal' | 'normal' | 'elevated'
  riskLabel: string
  notes?: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const timeframe = ref<'7d' | '30d' | '90d'>('7d')
const isSyncing = ref(false)
const lastSyncText = ref('4m ago')
const isLogDialogOpen = ref(false)
const showSuccessNotification = ref(false)

// Configurable Thresholds State
const systolicLimit = ref('140')
const diastolicLimit = ref('90')
const hrAlertRange = ref('50-100')
const glucoseAlertLimit = ref('130')
const spo2AlertLimit = ref('95')

// Alert Toggles
const clinicianSmsAlert = ref(true)
const ehrAutoSync = ref(true)
const caregiverPush = ref(false)

// New Entry Form State
const formDate = ref('2026-08-21T08:30')
const formPeriod = ref('morning')
const formSystolic = ref('120')
const formDiastolic = ref('78')
const formPulse = ref('68')
const formGlucose = ref('94')
const formSpo2 = ref('99')
const formDevice = ref('withings')
const formNotes = ref('')

const dailyLogs = ref<DailyVitalLog[]>([
  {
    id: 'vital-1',
    date: 'Aug 21 (Today)',
    isToday: true,
    morningBP: '120/76',
    morningPulse: 66,
    eveningBP: '122/78',
    eveningPulse: 68,
    avgBP: '121/77',
    systolicVal: 121,
    diastolicVal: 77,
    fastingGlucose: 94,
    glucoseStatus: 'optimal',
    spo2: 99,
    riskStatus: 'optimal',
    riskLabel: 'Optimal',
    notes: 'Resting morning reading taken pre-breakfast.',
  },
  {
    id: 'vital-2',
    date: 'Aug 20',
    morningBP: '124/80',
    morningPulse: 70,
    eveningBP: '122/79',
    eveningPulse: 69,
    avgBP: '123/80',
    systolicVal: 123,
    diastolicVal: 80,
    fastingGlucose: 94,
    glucoseStatus: 'optimal',
    spo2: 98,
    riskStatus: 'normal',
    riskLabel: 'Normal',
  },
  {
    id: 'vital-3',
    date: 'Aug 19',
    morningBP: '126/82',
    morningPulse: 71,
    eveningBP: '125/80',
    eveningPulse: 70,
    avgBP: '126/81',
    systolicVal: 126,
    diastolicVal: 81,
    fastingGlucose: 97,
    glucoseStatus: 'normal',
    spo2: 99,
    riskStatus: 'normal',
    riskLabel: 'Normal',
  },
  {
    id: 'vital-4',
    date: 'Aug 18',
    morningBP: '132/84',
    morningPulse: 74,
    eveningBP: '130/82',
    eveningPulse: 73,
    avgBP: '131/83',
    systolicVal: 131,
    diastolicVal: 83,
    fastingGlucose: 101,
    glucoseStatus: 'elevated',
    spo2: 98,
    riskStatus: 'elevated',
    riskLabel: 'Elevated',
    notes: 'Mild post-work stress reported by patient.',
  },
  {
    id: 'vital-5',
    date: 'Aug 17',
    morningBP: '128/82',
    morningPulse: 72,
    eveningBP: '126/80',
    eveningPulse: 71,
    avgBP: '127/81',
    systolicVal: 127,
    diastolicVal: 81,
    fastingGlucose: 98,
    glucoseStatus: 'normal',
    spo2: 99,
    riskStatus: 'normal',
    riskLabel: 'Normal',
  },
  {
    id: 'vital-6',
    date: 'Aug 16',
    morningBP: '122/78',
    morningPulse: 69,
    eveningBP: '124/80',
    eveningPulse: 70,
    avgBP: '123/79',
    systolicVal: 123,
    diastolicVal: 79,
    fastingGlucose: 95,
    glucoseStatus: 'optimal',
    spo2: 99,
    riskStatus: 'optimal',
    riskLabel: 'Optimal',
  },
  {
    id: 'vital-7',
    date: 'Aug 15',
    morningBP: '120/78',
    morningPulse: 68,
    eveningBP: '121/77',
    eveningPulse: 67,
    avgBP: '121/78',
    systolicVal: 121,
    diastolicVal: 78,
    fastingGlucose: 96,
    glucoseStatus: 'optimal',
    spo2: 99,
    riskStatus: 'optimal',
    riskLabel: 'Optimal',
  },
])

function handleSyncRefresh() {
  isSyncing.value = true
  setTimeout(() => {
    isSyncing.value = false
    lastSyncText.value = 'just now'
  }, 600)
}

function handleLogSubmit() {
  const systolic = parseInt(formSystolic.value, 10) || 120
  const diastolic = parseInt(formDiastolic.value, 10) || 80
  const pulse = parseInt(formPulse.value, 10) || 68
  const glucose = parseInt(formGlucose.value, 10) || 94
  const spo2 = parseInt(formSpo2.value, 10) || 99

  let riskStatus: 'optimal' | 'normal' | 'elevated' = 'normal'
  let riskLabel = 'Normal'

  if (systolic >= 130 || diastolic >= 85 || glucose >= 100) {
    riskStatus = 'elevated'
    riskLabel = 'Elevated'
  } else if (systolic <= 120 && diastolic <= 80 && glucose < 95) {
    riskStatus = 'optimal'
    riskLabel = 'Optimal'
  }

  const newLog: DailyVitalLog = {
    id: `vital-${Date.now()}`,
    date: 'Aug 21 (Manual)',
    isToday: true,
    morningBP: `${systolic}/${diastolic}`,
    morningPulse: pulse,
    eveningBP: `${systolic}/${diastolic}`,
    eveningPulse: pulse,
    avgBP: `${systolic}/${diastolic}`,
    systolicVal: systolic,
    diastolicVal: diastolic,
    fastingGlucose: glucose,
    glucoseStatus: glucose < 95 ? 'optimal' : glucose <= 99 ? 'normal' : 'elevated',
    spo2,
    riskStatus,
    riskLabel,
    notes: formNotes.value.trim() || undefined,
  }

  dailyLogs.value = [newLog, ...dailyLogs.value.slice(0, 6)]
  isLogDialogOpen.value = false
  showSuccessNotification.value = true
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 4000)
}

function getSparkline(history: number[]) {
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  const height = 26
  const padding = 3

  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * 100
    const y = height - ((val - min) / range) * (height - padding * 2) - padding
    return { x, y }
  })

  let path = `M ${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cx = (prev.x + curr.x) / 2
    path += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`
  }

  const lastPoint = points[points.length - 1]
  const area = `${path} L 100,32 L 0,32 Z`

  return { path, area, lastPoint }
}

const bpHistory = [121, 123, 126, 131, 127, 123, 121]
const hrHistory = [68, 70, 71, 74, 72, 69, 68]
const glucoseHistory = [96, 95, 98, 101, 97, 94, 94]
</script>

<template>
  <div data-slot="vitals-tracker-chart" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Patient Biometrics & Vitals Telemetry
          </h1>
          <Badge wrap variant="outline" class="gap-1.5 text-xs font-normal">
            <span class="size-1.5 rounded-full bg-emerald-500" />
            <span class="tabular-nums">MRN-84920</span>
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Continuous physiological telemetry stream · Eleanor Vance (DOB: 1984-06-12) · Care Lead: Dr. M. Vance, MD
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Device Sync Telemetry Badge -->
        <div
          class="bg-muted/50 border-border/80 text-card-foreground flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs shadow-xs"
        >
          <span class="relative flex size-2 shrink-0">
            <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span class="text-muted-foreground">Apple Health / Withings Connected · Last sync</span>
          <span class="text-foreground font-medium tabular-nums">{{ lastSyncText }}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            class="text-muted-foreground hover:text-foreground size-6 rounded-md p-0"
            aria-label="Sync vitals telemetry"
            @click="handleSyncRefresh"
          >
            <RefreshCw :class="['size-3.5', isSyncing ? 'animate-spin' : '']" />
          </Button>
        </div>

        <!-- Timeframe Selector -->
        <div class="bg-muted border-border/60 flex items-center rounded-lg border p-0.5 text-xs">
          <button
            type="button"
            :class="[
              'rounded-md px-2.5 py-1 font-medium transition-colors',
              timeframe === '7d'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="timeframe = '7d'"
          >
            7 Days
          </button>
          <button
            type="button"
            :class="[
              'rounded-md px-2.5 py-1 font-medium transition-colors',
              timeframe === '30d'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="timeframe = '30d'"
          >
            30 Days
          </button>
          <button
            type="button"
            :class="[
              'rounded-md px-2.5 py-1 font-medium transition-colors',
              timeframe === '90d'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="timeframe = '90d'"
          >
            90 Days
          </button>
        </div>

        <!-- Log Vitals Entry Dialog -->
        <Dialog v-model:open="isLogDialogOpen">
          <DialogTrigger as-child>
            <Button size="sm" class="gap-1.5 shadow-xs">
              <Plus class="size-4" />
              <span>Log Vitals Entry</span>
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Log Biometric Vitals Entry</DialogTitle>
              <DialogDescription>
                Record manual cuff, glucometer, or pulse oximeter measurements into the clinical telemetry stream.
              </DialogDescription>
            </DialogHeader>

            <div class="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
              <div class="space-y-1.5 sm:col-span-2">
                <Label for="vital-timestamp" class="text-xs">Measurement Timestamp</Label>
                <Input id="vital-timestamp" v-model="formDate" type="datetime-local" class="h-9 text-xs" />
              </div>

              <div class="space-y-1.5">
                <Label for="vital-period" class="text-xs">Context / Reading Period</Label>
                <Select v-model="formPeriod">
                  <SelectTrigger id="vital-period" class="h-9 text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (Fasting)</SelectItem>
                    <SelectItem value="midday">Midday (Pre-lunch)</SelectItem>
                    <SelectItem value="evening">Evening (Post-dinner)</SelectItem>
                    <SelectItem value="bedtime">Bedtime (Resting)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-1.5">
                <Label for="vital-device" class="text-xs">Telemetry Source Device</Label>
                <Select v-model="formDevice">
                  <SelectTrigger id="vital-device" class="h-9 text-xs">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="withings">Withings BPM Core</SelectItem>
                    <SelectItem value="apple-watch">Apple Watch Series 9</SelectItem>
                    <SelectItem value="omron">Omron Platinum Cuff</SelectItem>
                    <SelectItem value="dexcom">Dexcom G7 CGM</SelectItem>
                    <SelectItem value="manual">Manual Clinical Station</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-1.5">
                <Label for="systolic-input" class="text-xs">Systolic Pressure (mmHg)</Label>
                <Input
                  id="systolic-input"
                  v-model="formSystolic"
                  type="number"
                  placeholder="120"
                  class="h-9 text-xs tabular-nums"
                />
              </div>

              <div class="space-y-1.5">
                <Label for="diastolic-input" class="text-xs">Diastolic Pressure (mmHg)</Label>
                <Input
                  id="diastolic-input"
                  v-model="formDiastolic"
                  type="number"
                  placeholder="80"
                  class="h-9 text-xs tabular-nums"
                />
              </div>

              <div class="space-y-1.5">
                <Label for="pulse-input" class="text-xs">Resting Heart Rate (bpm)</Label>
                <Input
                  id="pulse-input"
                  v-model="formPulse"
                  type="number"
                  placeholder="68"
                  class="h-9 text-xs tabular-nums"
                />
              </div>

              <div class="space-y-1.5">
                <Label for="glucose-input" class="text-xs">Blood Glucose (mg/dL)</Label>
                <Input
                  id="glucose-input"
                  v-model="formGlucose"
                  type="number"
                  placeholder="94"
                  class="h-9 text-xs tabular-nums"
                />
              </div>

              <div class="space-y-1.5 sm:col-span-2">
                <Label for="spo2-input" class="text-xs">Blood Oxygen SpO2 (%)</Label>
                <Input
                  id="spo2-input"
                  v-model="formSpo2"
                  type="number"
                  placeholder="99"
                  class="h-9 text-xs tabular-nums"
                />
              </div>

              <div class="space-y-1.5 sm:col-span-2">
                <Label for="vital-notes" class="text-xs">Clinical Notes & Symptoms (Optional)</Label>
                <Textarea
                  id="vital-notes"
                  v-model="formNotes"
                  placeholder="e.g. Patient rested seated for 5 minutes prior to measurement. No palpitations or dyspnea."
                  rows="2"
                  class="text-xs"
                />
              </div>
            </div>

            <DialogFooter class="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" @click="isLogDialogOpen = false">Cancel</Button>
              <Button size="sm" @click="handleLogSubmit">Save Reading</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <div
      v-if="showSuccessNotification"
      class="flex items-center justify-between gap-x-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-950 shadow-xs dark:text-emerald-50"
      role="status"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="size-4 shrink-0 text-emerald-500" />
        <span class="font-medium">Vitals telemetry entry successfully appended to EHR clinical chart.</span>
      </div>
      <Button
        aria-label="Dismiss notification"
        variant="ghost"
        size="icon-sm"
        class="size-6 text-emerald-700 dark:text-emerald-300"
        @click="showSuccessNotification = false"
      >
        <span class="text-xs">✕</span>
      </Button>
    </div>

    <!-- 4 Primary Vitals Overview Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Blood Pressure -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Activity class="size-4 text-emerald-500" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Blood Pressure</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">Normal</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-1">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">122/78</span>
                <span class="text-muted-foreground text-xs">mmHg</span>
              </div>
              <span class="text-muted-foreground text-xs tabular-nums">MAP 92 mmHg</span>
            </div>

            <!-- Mini Sparkline for BP Trend -->
            <div class="h-7 w-full overflow-hidden pt-1" aria-label="7-day systolic blood pressure trend">
              <svg class="h-full w-full overflow-visible" viewBox="0 0 100 28" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-bp-vue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-emerald-500, #10b981)" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="var(--color-emerald-500, #10b981)" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                <path :d="getSparkline(bpHistory).area" fill="url(#grad-bp-vue)" />
                <path
                  :d="getSparkline(bpHistory).path"
                  fill="none"
                  stroke="var(--color-emerald-500, #10b981)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  :cx="getSparkline(bpHistory).lastPoint.x"
                  :cy="getSparkline(bpHistory).lastPoint.y"
                  r="2.5"
                  class="fill-emerald-500"
                />
              </svg>
            </div>
          </div>

          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">7-Day Mean:</span>
              <span class="text-foreground font-medium tabular-nums">124/80 mmHg</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Target &lt; 120/80 mmHg · Controlled</p>
          </div>
        </CardContent>
      </Card>

      <!-- 2. Resting Heart Rate -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Heart class="size-4 text-rose-500" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Resting Heart Rate</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">Healthy</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-1">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">68</span>
                <span class="text-muted-foreground text-xs">bpm</span>
              </div>
              <div class="text-success flex items-center gap-1 text-xs font-medium tabular-nums">
                <TrendingDown class="size-3" />
                <span>-2 bpm</span>
              </div>
            </div>

            <!-- Mini Sparkline for HR Trend -->
            <div class="h-7 w-full overflow-hidden pt-1" aria-label="7-day resting heart rate trend">
              <svg class="h-full w-full overflow-visible" viewBox="0 0 100 28" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-hr-vue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-rose-500, #f43f5e)" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="var(--color-rose-500, #f43f5e)" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                <path :d="getSparkline(hrHistory).area" fill="url(#grad-hr-vue)" />
                <path
                  :d="getSparkline(hrHistory).path"
                  fill="none"
                  stroke="var(--color-rose-500, #f43f5e)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  :cx="getSparkline(hrHistory).lastPoint.x"
                  :cy="getSparkline(hrHistory).lastPoint.y"
                  r="2.5"
                  class="fill-rose-500"
                />
              </svg>
            </div>
          </div>

          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Normal Range:</span>
              <span class="text-foreground font-medium tabular-nums">60 – 100 bpm</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Sinus Rhythm · HRV 58 ms</p>
          </div>
        </CardContent>
      </Card>

      <!-- 3. Blood Glucose / Fasting -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Droplets class="size-4 text-sky-500" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Blood Glucose</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">Fasting &lt; 100</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-1">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">94</span>
                <span class="text-muted-foreground text-xs">mg/dL</span>
              </div>
              <div class="text-muted-foreground flex items-center gap-1 text-xs font-medium tabular-nums">
                <Minus class="size-3" />
                <span>Stable</span>
              </div>
            </div>

            <!-- Mini Sparkline for Glucose Trend -->
            <div class="h-7 w-full overflow-hidden pt-1" aria-label="7-day blood glucose trend">
              <svg class="h-full w-full overflow-visible" viewBox="0 0 100 28" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-glu-vue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-sky-500, #0ea5e9)" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="var(--color-sky-500, #0ea5e9)" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                <path :d="getSparkline(glucoseHistory).area" fill="url(#grad-glu-vue)" />
                <path
                  :d="getSparkline(glucoseHistory).path"
                  fill="none"
                  stroke="var(--color-sky-500, #0ea5e9)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  :cx="getSparkline(glucoseHistory).lastPoint.x"
                  :cy="getSparkline(glucoseHistory).lastPoint.y"
                  r="2.5"
                  class="fill-sky-500"
                />
              </svg>
            </div>
          </div>

          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Fasting Window:</span>
              <span class="text-foreground font-medium tabular-nums">12 hrs</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Estimated HbA1c: 5.4%</p>
          </div>
        </CardContent>
      </Card>

      <!-- 4. Blood Oxygen SpO2 -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Wind class="size-4 text-teal-500" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Blood Oxygen SpO2</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">≥ 95% Normal</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-1">
          <div>
            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">99%</span>
                <span class="text-muted-foreground text-xs">SpO2</span>
              </div>
              <span class="text-success text-xs font-medium">0 drops detected</span>
            </div>
            <Progress :model-value="99" class="h-2 [&_[data-slot=progress-indicator]]:bg-teal-500" />
            <div class="mt-1.5 flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground">Pulse Oximeter</span>
              <span class="text-muted-foreground tabular-nums">Target ≥ 95%</span>
            </div>
          </div>

          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Sleep O2 Baseline:</span>
              <span class="text-foreground font-medium tabular-nums">98.4%</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Continuous Plethysmography</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 7-Day Vitals Trend Grid & Daily Telemetry Table -->
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>7-Day Vitals Trend & Daily Telemetry Logs</CardTitle>
            <CardDescription>
              Comprehensive morning & evening multi-parameter biometrics with systolic range markers and risk
              stratification.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Badge wrap variant="outline" class="w-fit text-xs font-normal tabular-nums">
              {{ dailyLogs.length }} readings logged
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent class="p-0 sm:p-6 sm:pt-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="min-w-[120px]">Date</TableHead>
                <TableHead class="min-w-[150px]">Morning Reading</TableHead>
                <TableHead class="min-w-[150px]">Evening Reading</TableHead>
                <TableHead class="min-w-[110px]">Daily Mean BP</TableHead>
                <TableHead class="min-w-[120px]">Fasting Glucose</TableHead>
                <TableHead class="min-w-[80px]">SpO2</TableHead>
                <TableHead class="min-w-[160px]">Systolic Band Indicator</TableHead>
                <TableHead class="text-right">Risk Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="log in dailyLogs" :key="log.id" :class="log.isToday ? 'bg-muted/25 font-medium' : ''">
                <TableCell class="text-foreground text-xs whitespace-nowrap">
                  <div class="flex items-center gap-1.5">
                    <span class="tabular-nums">{{ log.date }}</span>
                    <Badge wrap v-if="log.isToday" variant="secondary" class="h-4.5 px-1.5 text-xs font-normal"
                      >Now</Badge
                    >
                  </div>
                </TableCell>
                <TableCell class="text-xs whitespace-nowrap">
                  <span class="text-foreground font-medium tabular-nums">{{ log.morningBP }}</span>
                  <span class="text-muted-foreground text-xs"> mmHg · </span>
                  <span class="text-muted-foreground tabular-nums">{{ log.morningPulse }} bpm</span>
                </TableCell>
                <TableCell class="text-xs whitespace-nowrap">
                  <span class="text-foreground font-medium tabular-nums">{{ log.eveningBP }}</span>
                  <span class="text-muted-foreground text-xs"> mmHg · </span>
                  <span class="text-muted-foreground tabular-nums">{{ log.eveningPulse }} bpm</span>
                </TableCell>
                <TableCell class="text-foreground text-xs font-semibold whitespace-nowrap tabular-nums">
                  {{ log.avgBP }}
                  <span class="text-muted-foreground text-xs font-normal">mmHg</span>
                </TableCell>
                <TableCell class="text-xs whitespace-nowrap">
                  <span class="text-foreground font-medium tabular-nums">{{ log.fastingGlucose }}</span>
                  <span class="text-muted-foreground text-xs"> mg/dL</span>
                </TableCell>
                <TableCell class="text-foreground text-xs font-medium whitespace-nowrap tabular-nums">
                  {{ log.spo2 }}%
                </TableCell>
                <TableCell class="text-xs">
                  <!-- Visual Horizontal Range Pill -->
                  <div class="w-36 space-y-1">
                    <div class="bg-muted border-border/70 relative h-3 w-full overflow-hidden rounded-full border">
                      <!-- Normal Zone (110 - 129) -->
                      <div class="absolute inset-y-0 right-[50%] left-[16%] bg-emerald-500/20" />
                      <!-- Elevated Zone (130 - 139) -->
                      <div class="absolute inset-y-0 right-[33%] left-[50%] bg-amber-500/25" />
                      <!-- High Zone (>= 140) -->
                      <div class="absolute inset-y-0 right-0 left-[67%] bg-rose-500/25" />
                      <!-- Reading Dot Marker (Clamped to 100-160 scale) -->
                      <div
                        class="absolute top-1/2 size-2 -translate-y-1/2 rounded-full shadow-xs"
                        :class="[
                          log.systolicVal < 130
                            ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                            : log.systolicVal < 140
                              ? 'bg-amber-500 ring-2 ring-amber-500/30'
                              : 'bg-rose-500 ring-2 ring-rose-500/30',
                        ]"
                        :style="{
                          left: `${Math.min(96, Math.max(4, ((log.systolicVal - 100) / 60) * 100))}%`,
                        }"
                      />
                    </div>
                    <div class="text-muted-foreground flex justify-between text-xs tabular-nums">
                      <span>100</span>
                      <span class="font-medium text-emerald-600 dark:text-emerald-400">120</span>
                      <span>140+</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <Badge
                    :variant="
                      log.riskStatus === 'optimal' ? 'success' : log.riskStatus === 'normal' ? 'success' : 'warning'
                    "
                    class="text-xs whitespace-normal capitalize"
                  >
                    {{ log.riskLabel }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Threshold & Alert Limits Card -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between gap-x-2">
            <div class="flex items-center gap-2">
              <Sliders class="text-primary size-4" />
              <CardTitle>Configurable Clinical Thresholds</CardTitle>
            </div>
            <Badge wrap variant="outline" class="text-xs font-normal">AHA / ACC Standards</Badge>
          </div>
          <CardDescription>
            Custom warning & critical breach boundaries tailored to this patient's clinical care plan.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label class="text-xs">Systolic Alert Limit</Label>
              <Select v-model="systolicLimit">
                <SelectTrigger class="h-9 text-xs">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="130">&gt; 130 mmHg (Elevated)</SelectItem>
                  <SelectItem value="140">&gt; 140 mmHg (Stage 2 Alert)</SelectItem>
                  <SelectItem value="160">&gt; 160 mmHg (Critical Crisis)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <Label class="text-xs">Diastolic Alert Limit</Label>
              <Select v-model="diastolicLimit">
                <SelectTrigger class="h-9 text-xs">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="85">&gt; 85 mmHg (Elevated)</SelectItem>
                  <SelectItem value="90">&gt; 90 mmHg (Stage 2 Alert)</SelectItem>
                  <SelectItem value="100">&gt; 100 mmHg (Crisis)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <Label class="text-xs">Heart Rate Alert Range</Label>
              <Select v-model="hrAlertRange">
                <SelectTrigger class="h-9 text-xs">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50-100">&lt; 50 or &gt; 100 bpm</SelectItem>
                  <SelectItem value="55-110">&lt; 55 or &gt; 110 bpm</SelectItem>
                  <SelectItem value="45-120">&lt; 45 or &gt; 120 bpm (Wide)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <Label class="text-xs">Fasting Glucose Warning</Label>
              <Select v-model="glucoseAlertLimit">
                <SelectTrigger class="h-9 text-xs">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="120">&gt; 120 mg/dL (Pre-diabetic)</SelectItem>
                  <SelectItem value="130">&gt; 130 mg/dL (Clinical Alert)</SelectItem>
                  <SelectItem value="150">&gt; 150 mg/dL (High Trigger)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div class="border-border bg-muted/40 flex items-center justify-between gap-x-2 rounded-lg border p-3">
            <div class="space-y-0.5">
              <p class="text-foreground text-xs font-medium">Oxygen Desaturation Limit</p>
              <p class="text-muted-foreground text-xs">Triggers hypoxemia alert if SpO2 drops below bound.</p>
            </div>
            <Badge wrap variant="outline" class="text-xs font-medium tabular-nums"
              >&lt; {{ spo2AlertLimit }}% SpO2</Badge
            >
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between gap-x-2">
            <div class="flex items-center gap-2">
              <Bell class="text-primary size-4" />
              <CardTitle>Automated Clinical Alert Protocol</CardTitle>
            </div>
            <Badge wrap variant="success" class="gap-1 text-xs">
              <ShieldCheck class="size-3" />
              <span>Active Sentinel</span>
            </Badge>
          </div>
          <CardDescription>
            Instant escalation rules and clinician notification triggers for threshold violations.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-0.5">
              <Label class="text-foreground text-xs font-medium">Clinician Urgent SMS Alert</Label>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Immediately dispatch SMS alert to on-call cardiologist when 2 consecutive readings exceed threshold.
              </p>
            </div>
            <Switch v-model="clinicianSmsAlert" aria-label="Toggle clinician SMS alert" />
          </div>

          <Separator />

          <div class="flex items-start justify-between gap-4">
            <div class="space-y-0.5">
              <Label class="text-foreground text-xs font-medium">EHR Auto-Sync (FHIR R4 Stream)</Label>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Stream verified biometric readings directly to patient's electronic health record chart.
              </p>
            </div>
            <Switch v-model="ehrAutoSync" aria-label="Toggle EHR auto sync" />
          </div>

          <Separator />

          <div class="bg-muted/40 border-border space-y-2 rounded-lg border p-3 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <div class="flex items-center gap-2">
                <Stethoscope class="text-primary size-3.5" />
                <span class="text-foreground font-semibold">On-Call Clinical Lead:</span>
              </div>
              <span class="text-foreground font-medium">Dr. Sarah Chen, MD (Cardiology)</span>
            </div>
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Pager: #4920 · Priority SLA:</span>
              <span class="font-medium text-emerald-600 dark:text-emerald-400">&lt; 15 min triage</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
