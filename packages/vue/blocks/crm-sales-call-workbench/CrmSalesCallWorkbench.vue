<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Disc,
  FileText,
  Mic,
  MicOff,
  Pause,
  Phone,
  PhoneForwarded,
  PhoneOff,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

// Interactive Call State
const isMuted = ref(false)
const isOnHold = ref(false)
const isRecording = ref(true)
const isCallEnded = ref(false)
const callDurationSeconds = ref(522) // 08m:42s
const copiedTalkingPoints = ref(false)
const isSyncedCrm = ref(false)
const newItemText = ref('')

// 32-bar audio spectrum waveform bars
const waveformBars = [
  32, 48, 65, 42, 78, 92, 84, 66, 52, 74, 96, 82, 60, 44, 58, 88, 100, 76, 62, 48, 72, 94, 80, 68, 54, 42, 68, 86, 72,
  52, 38, 28,
]

// Timer interval
let timerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timerInterval = setInterval(() => {
    if (!isCallEnded.value && !isOnHold.value) {
      callDurationSeconds.value += 1
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const formattedDuration = computed(() => {
  const mins = Math.floor(callDurationSeconds.value / 60)
  const secs = callDurationSeconds.value % 60
  return `${mins.toString().padStart(2, '0')}m:${secs.toString().padStart(2, '0')}s`
})

// CRM Deal Notes
const dealNotes = ref(
  'David Chen (VP of Eng) confirmed Acme Corp has 40 micro-frontends facing frequent dependency breakages (~12 eng hrs/week maintenance debt). Highly receptive to UIPKGE zero-dependency registry model. Key decision factor: SOC2 Type II compliance and DPA sign-off. Deal size: 500 seats ($180k ARR). Target close: Q3 end.',
)

// Next Steps Action Items
interface ActionItem {
  id: string
  text: string
  completed: boolean
  dueDate: string
  assignee: string
}

const actionItems = ref<ActionItem[]>([
  {
    id: 'step-1',
    text: 'Send SOC2 Type II compliance package & Security Whitepaper',
    completed: true,
    dueDate: 'Today · 2:00 PM',
    assignee: 'Elena Rostova',
  },
  {
    id: 'step-2',
    text: 'Schedule DPA legal review with Acme SecOps team',
    completed: true,
    dueDate: 'Tomorrow · 10:00 AM',
    assignee: 'Elena Rostova',
  },
  {
    id: 'step-3',
    text: 'Draft 500-seat Enterprise MSA & customized Order Form',
    completed: false,
    dueDate: 'Thu, Aug 27',
    assignee: 'Legal Ops',
  },
  {
    id: 'step-4',
    text: 'Send post-call recap email with call recording & transcript highlights',
    completed: false,
    dueDate: 'Today · 5:00 PM',
    assignee: 'Elena Rostova',
  },
])

// Actions
function handleToggleMute() {
  isMuted.value = !isMuted.value
}

function handleToggleHold() {
  isOnHold.value = !isOnHold.value
}

function handleToggleRecording() {
  isRecording.value = !isRecording.value
}

function handleEndCall() {
  isCallEnded.value = true
}

function handleReconnectCall() {
  isCallEnded.value = false
  callDurationSeconds.value = 0
}

function handleCopyTalkingPoints() {
  copiedTalkingPoints.value = true
  setTimeout(() => {
    copiedTalkingPoints.value = false
  }, 2500)
}

function handleSyncCrm() {
  isSyncedCrm.value = true
  setTimeout(() => {
    isSyncedCrm.value = false
  }, 3500)
}

function handleAddActionItem() {
  const text = newItemText.value.trim()
  if (!text) return
  actionItems.value.push({
    id: `step-${Date.now()}`,
    text,
    completed: false,
    dueDate: 'Next Week',
    assignee: 'Elena Rostova',
  })
  newItemText.value = ''
}

function handleToggleStep(id: string) {
  const item = actionItems.value.find((i) => i.id === id)
  if (item) {
    item.completed = !item.completed
  }
}

function handleAppendTag(tag: string) {
  if (!dealNotes.value.includes(tag)) {
    dealNotes.value += `\n[Tag: ${tag}]`
  }
}
</script>

<template>
  <div data-slot="crm-sales-call-workbench" class="bg-background text-foreground w-full space-y-4">
    <!-- Top Header Bar -->
    <header class="bg-card rounded-xl border p-4 shadow-xs sm:px-6 sm:py-3.5">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Call Metadata Strip -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4">
          <!-- Status Indicator & Timer -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="relative flex size-3">
              <span
                v-if="!isCallEnded && !isOnHold"
                class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              />
              <span
                :class="[
                  'relative inline-flex size-3 rounded-full',
                  isCallEnded ? 'bg-zinc-400' : isOnHold ? 'bg-amber-500' : 'bg-emerald-500',
                ]"
              />
            </span>
            <div class="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-tight">
              <Clock class="text-muted-foreground size-3.5" />
              <span class="tabular-nums">
                {{
                  isCallEnded
                    ? 'Call Ended'
                    : isOnHold
                      ? 'Call On Hold'
                      : `Live Call in Progress · ${formattedDuration}`
                }}
              </span>
            </div>
          </div>

          <Separator orientation="vertical" class="hidden h-5 sm:block" />

          <!-- Customer Name & Role -->
          <div class="flex flex-wrap items-center gap-2.5">
            <Avatar class="size-7 border">
              <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">DC</AvatarFallback>
            </Avatar>
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span class="text-foreground text-xs font-bold sm:text-sm">David Chen</span>
              <span class="text-muted-foreground text-xs">VP of Engineering at Acme Corp</span>
            </div>
          </div>

          <Separator orientation="vertical" class="hidden h-5 md:block" />

          <!-- Phone & Carrier Strip -->
          <div class="hidden items-center gap-2 md:flex">
            <Badge variant="outline" class="gap-1.5 font-mono text-xs font-medium">
              <Phone class="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>+1 (415) 555-0192</span>
            </Badge>
            <Badge variant="secondary" class="text-xs font-normal"> Acme Corp · 500 Seats ($180k ARR) </Badge>
          </div>
        </div>

        <!-- Header Actions: End Call / Sync -->
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="text-muted-foreground hidden items-center gap-1.5 text-xs lg:flex">
            <Radio class="size-3.5 text-emerald-500" />
            <span class="font-mono text-xs">Opus HD · 14ms Latency</span>
          </div>

          <Button
            v-if="!isCallEnded"
            variant="destructive"
            size="sm"
            class="h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs"
            @click="handleEndCall"
          >
            <PhoneOff class="size-3.5" />
            <span>End Call & Log to CRM</span>
          </Button>

          <Button
            v-else
            variant="default"
            size="sm"
            class="h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs"
            @click="handleReconnectCall"
          >
            <RefreshCw class="size-3.5" />
            <span>Reconnect Call</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- 2-Column Call Workspace Grid (60% Left / 40% Right) -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <!-- Left Panel: Live Audio Visualizer & Real-Time AI Transcript (60% -> 7 Cols) -->
      <div class="space-y-4 lg:col-span-7 xl:col-span-7">
        <!-- Audio Dialing Canvas -->
        <section
          class="relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-white shadow-lg"
        >
          <!-- Top Overlay: Speaker Status & WebRTC Specs -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <!-- Active Speaker Info -->
            <div
              class="flex flex-wrap items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 backdrop-blur-xs"
            >
              <div class="relative">
                <Avatar class="size-8 border border-emerald-500/60">
                  <AvatarFallback class="bg-zinc-800 text-xs font-bold text-emerald-400">DC</AvatarFallback>
                </Avatar>
                <span
                  v-if="!isCallEnded && !isOnHold"
                  class="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950"
                />
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-semibold text-zinc-100">David Chen</span>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/40 bg-emerald-500/20 px-1 py-0 text-xs text-emerald-300"
                  >
                    Speaking
                  </Badge>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Mic class="size-3 text-emerald-400" />
                  <span>Acme Corp · Audio Level: -14 dB</span>
                </div>
              </div>
            </div>

            <!-- Call Encryption & Recording Status -->
            <div class="flex flex-wrap items-center gap-2">
              <div
                v-if="isRecording"
                class="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/15 px-2.5 py-1 text-xs text-rose-300"
              >
                <span class="size-2 animate-pulse rounded-full bg-rose-500" />
                <span class="font-mono text-xs font-semibold">REC 08:42</span>
              </div>
              <div
                class="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300"
              >
                <ShieldCheck class="size-3.5 text-emerald-400" />
                <span class="font-mono text-xs">WebRTC AES-256</span>
              </div>
            </div>
          </div>

          <!-- Live 32-Bar Audio Waveform Visualizer -->
          <div class="my-6 flex flex-col items-center justify-center space-y-3">
            <div class="flex h-24 w-full items-center justify-between gap-1 px-1 sm:gap-1.5 sm:px-4">
              <div
                v-for="(bar, index) in waveformBars"
                :key="index"
                :class="[
                  'w-full max-w-[8px] rounded-full transition-all duration-200',
                  isCallEnded
                    ? 'h-2 bg-zinc-800'
                    : isOnHold
                      ? 'h-3 bg-amber-500/60'
                      : isMuted && index % 2 === 0
                        ? 'h-2 bg-zinc-700'
                        : 'bg-gradient-to-t from-emerald-500 to-teal-300',
                  !isCallEnded && !isOnHold && !isMuted ? 'animate-pulse' : '',
                ]"
                :style="{
                  height: isCallEnded ? '8%' : isOnHold ? '16%' : `${bar}%`,
                  animationDelay: `${(index % 8) * 120}ms`,
                  animationDuration: '1.2s',
                }"
              />
            </div>

            <!-- Frequency Scale & Stream Diagnostics -->
            <div class="flex w-full items-center justify-between px-2 font-mono text-xs text-zinc-500 sm:px-6">
              <span class="shrink-0 whitespace-nowrap">-48 dB</span>
              <span class="min-w-0 text-center text-zinc-400"
                >32-Band AI Audio Spectrum · Real-time Voice Detection</span
              >
              <span class="shrink-0 whitespace-nowrap">0 dB</span>
            </div>
          </div>

          <!-- Audio Controls Bar -->
          <div class="flex items-center justify-center pt-2">
            <div
              class="flex flex-wrap items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 p-1.5 shadow-xl sm:px-4 sm:py-2"
            >
              <!-- Mute Button -->
              <Button
                :variant="isMuted ? 'destructive' : 'secondary'"
                size="sm"
                class="h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
                @click="handleToggleMute"
              >
                <MicOff v-if="isMuted" class="size-3.5" />
                <Mic v-else class="size-3.5 text-emerald-400" />
                <span>{{ isMuted ? 'Muted' : 'Mute Mic' }}</span>
              </Button>

              <!-- Hold Call Button -->
              <Button
                :variant="isOnHold ? 'default' : 'secondary'"
                size="sm"
                class="h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
                @click="handleToggleHold"
              >
                <Play v-if="isOnHold" class="size-3.5 text-amber-400" />
                <Pause v-else class="size-3.5" />
                <span>{{ isOnHold ? 'Resume Call' : 'Hold Call' }}</span>
              </Button>

              <!-- Transfer Button -->
              <Button
                variant="secondary"
                size="sm"
                class="h-8 gap-1.5 rounded-full px-3 text-xs font-medium text-zinc-200"
              >
                <PhoneForwarded class="size-3.5 text-zinc-400" />
                <span>Transfer</span>
              </Button>

              <!-- Record Toggle Button -->
              <Button
                :variant="isRecording ? 'destructive' : 'secondary'"
                size="sm"
                class="h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
                @click="handleToggleRecording"
              >
                <Disc class="size-3.5" :class="isRecording ? 'animate-spin' : ''" />
                <span>{{ isRecording ? 'Recording' : 'Record' }}</span>
              </Button>
            </div>
          </div>
        </section>

        <!-- Real-Time AI Live Speech Transcript -->
        <Card class="shadow-xs">
          <CardHeader class="border-b px-4 py-3 sm:px-5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="space-y-0.5">
                <CardTitle class="flex flex-wrap items-center gap-2 text-sm font-bold">
                  <Sparkles class="text-primary size-4" />
                  <span>Real-Time AI Live Speech Transcript</span>
                </CardTitle>
                <CardDescription class="text-xs">
                  Deepgram Nova-2 STT · Real-time diarization & sentiment detection
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span>Live Diarization</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 p-4 sm:p-5">
            <!-- Turn 1: Elena Rostova -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <Avatar class="size-6">
                    <AvatarFallback class="bg-primary/20 text-primary text-xs font-bold">ER</AvatarFallback>
                  </Avatar>
                  <span class="text-foreground text-xs font-bold">Elena Rostova</span>
                  <Badge variant="outline" class="text-xs font-normal">Account Executive (You)</Badge>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    class="border-blue-500/30 bg-blue-500/10 text-xs text-blue-700 dark:text-blue-400"
                  >
                    Discovery
                  </Badge>
                  <span class="text-muted-foreground font-mono text-xs">08:12</span>
                </div>
              </div>
              <div class="bg-muted/30 text-foreground rounded-lg border p-3 text-xs leading-relaxed">
                "Thanks for walking us through your current build setup, David. You mentioned earlier that team velocity
                slowed down during the last framework migration. How is that impacting your Q3 delivery milestones?"
              </div>
            </div>

            <!-- Turn 2: David Chen (Objection) -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <Avatar class="size-6">
                    <AvatarFallback class="bg-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400"
                      >DC</AvatarFallback
                    >
                  </Avatar>
                  <span class="text-foreground text-xs font-bold">David Chen</span>
                  <Badge variant="secondary" class="text-xs font-normal">Prospect (Acme Corp)</Badge>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    class="border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
                  >
                    Budget Hesitation
                  </Badge>
                  <span class="text-muted-foreground font-mono text-xs">08:24</span>
                </div>
              </div>
              <div class="bg-muted/30 text-foreground space-y-2 rounded-lg border p-3 text-xs leading-relaxed">
                <p>
                  "Right now we're spending around 12 engineering hours a week just fixing broken dependency cascades
                  across 40 micro-frontends whenever upstream packages release major semver bumps. We want to
                  standardize, but leadership is wary of signing another 6-figure SaaS vendor contract this quarter."
                </p>
                <!-- AI Extracted Entities -->
                <div class="flex flex-wrap items-center gap-1.5 border-t pt-2 text-xs">
                  <span class="text-muted-foreground font-medium">AI Entities:</span>
                  <span
                    class="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400"
                  >
                    40 micro-frontends
                  </span>
                  <span
                    class="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400"
                  >
                    12 eng hrs/wk debt
                  </span>
                  <span
                    class="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400"
                  >
                    Objection: 6-figure SaaS cost
                  </span>
                </div>
              </div>
            </div>

            <!-- Turn 3: Elena Rostova (Value Prop) -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <Avatar class="size-6">
                    <AvatarFallback class="bg-primary/20 text-primary text-xs font-bold">ER</AvatarFallback>
                  </Avatar>
                  <span class="text-foreground text-xs font-bold">Elena Rostova</span>
                  <Badge variant="outline" class="text-xs font-normal">Account Executive (You)</Badge>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                  >
                    Value Proposition
                  </Badge>
                  <span class="text-muted-foreground font-mono text-xs">08:31</span>
                </div>
              </div>
              <div class="bg-muted/30 text-foreground rounded-lg border p-3 text-xs leading-relaxed">
                "That makes total sense. With UIPKGE's registry distribution model, your engineers copy the exact source
                code directly into your own repositories. You own the code completely, eliminate runtime npm lock-in,
                and never deal with breaking semver upgrades again."
              </div>
            </div>

            <!-- Turn 4: David Chen (Buying Signal) -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <Avatar class="size-6">
                    <AvatarFallback class="bg-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                      >DC</AvatarFallback
                    >
                  </Avatar>
                  <span class="text-foreground text-xs font-bold">David Chen</span>
                  <Badge variant="secondary" class="text-xs font-normal">Prospect (Acme Corp)</Badge>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    class="border-emerald-500/40 bg-emerald-500/15 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    Positive Intent
                  </Badge>
                  <span class="text-muted-foreground font-mono text-xs">08:42</span>
                </div>
              </div>
              <div class="bg-muted/30 text-foreground space-y-2 rounded-lg border p-3 text-xs leading-relaxed">
                <p>
                  "That would honestly solve our biggest compliance and dependency audit headache. If we can verify SOC2
                  Type II and get our SecOps team to review your DPA, we'd be ready to proceed with a 500-seat
                  Enterprise rollout next month."
                </p>
                <div class="flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs">
                  <div class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 class="size-3.5" />
                    <span class="font-medium">Buying Signal: 500 seats ($180k ARR) pending SOC2 & DPA</span>
                  </div>
                  <span class="text-muted-foreground text-xs">AI Confidence: 99.4%</span>
                </div>
              </div>
            </div>

            <!-- Active Live Listening Indicator -->
            <div class="bg-muted/20 flex items-center justify-between rounded-lg border border-dashed p-3 text-xs">
              <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <span class="size-2 rounded-full bg-emerald-500" />
                <span class="text-foreground font-medium">Real-time speech stream active...</span>
                <span>listening to David Chen</span>
              </div>
              <span class="text-muted-foreground font-mono text-xs">Deepgram Nova-2 STT</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Panel: AI Battlecards & CRM Note Logger (40% -> 5 Cols) -->
      <div class="space-y-4 lg:col-span-5 xl:col-span-5">
        <!-- Real-Time AI Objection Handling Battlecard -->
        <Card class="border-primary/40 from-primary/5 via-card to-card bg-gradient-to-br shadow-xs">
          <CardHeader class="px-4 pt-4 pb-2 sm:px-5">
            <div class="flex items-center justify-between">
              <Badge
                variant="outline"
                class="border-primary/30 bg-primary/10 text-primary gap-1.5 text-xs font-semibold"
              >
                <Sparkles class="text-primary size-3" />
                <span>AI Battlecard · Live Trigger</span>
              </Badge>
              <span class="text-muted-foreground font-mono text-xs">Confidence: 98%</span>
            </div>
            <CardTitle class="text-foreground pt-1.5 text-sm font-bold">
              Competitor / Pricing Objection: Legacy NPM Packages
            </CardTitle>
            <CardDescription class="text-xs">
              Triggered by mention of 6-figure SaaS vendor fatigue & dependency cascades
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-3 px-4 pb-4 sm:px-5">
            <!-- AI Counter-Points List -->
            <div class="bg-card space-y-2.5 rounded-lg border p-3 text-xs">
              <div class="text-foreground flex items-center gap-1.5 font-bold">
                <Zap class="text-primary size-3.5" />
                <span>Recommended Response Points:</span>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex items-start gap-2">
                  <span
                    class="bg-primary/20 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    >1</span
                  >
                  <p class="text-muted-foreground leading-relaxed">
                    <strong class="text-foreground font-semibold">Zero-Dependency Ownership:</strong> Code is copied
                    directly into Acme's repos via CLI (<code class="text-foreground bg-muted rounded px-1"
                      >npx shadcn-vue add</code
                    >). Zero npm runtime lock-in.
                  </p>
                </div>

                <div class="flex items-start gap-2">
                  <span
                    class="bg-primary/20 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    >2</span
                  >
                  <p class="text-muted-foreground leading-relaxed">
                    <strong class="text-foreground font-semibold">Eliminate Upgrade Cascades:</strong> Reclaim the 12
                    hrs/week engineering maintenance debt David mentioned.
                  </p>
                </div>

                <div class="flex items-start gap-2">
                  <span
                    class="bg-primary/20 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    >3</span
                  >
                  <p class="text-muted-foreground leading-relaxed">
                    <strong class="text-foreground font-semibold">Fast Enterprise ROI:</strong> Predictable team seat
                    license pays for itself in under 3 weeks of reclaimed developer hours.
                  </p>
                </div>
              </div>
            </div>

            <!-- Copy Talking Points Button -->
            <Button
              variant="outline"
              size="sm"
              class="w-full gap-1.5 text-xs font-semibold"
              @click="handleCopyTalkingPoints"
            >
              <Check v-if="copiedTalkingPoints" class="size-3.5 text-emerald-500" />
              <Copy v-else class="size-3.5" />
              <span>{{
                copiedTalkingPoints ? 'Talking Points Copied to Clipboard!' : 'Copy Talking Points to Clipboard'
              }}</span>
            </Button>
          </CardContent>
        </Card>

        <!-- Quick Deal Notes Textarea -->
        <Card class="shadow-xs">
          <CardHeader class="px-4 pt-4 pb-2 sm:px-5">
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center gap-1.5 text-sm font-bold">
                <FileText class="text-primary size-4" />
                <span>Quick Deal Notes</span>
              </CardTitle>
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                <CheckCircle2 class="size-3.5 text-emerald-500" />
                <span>Synced with Salesforce</span>
              </div>
            </div>
            <CardDescription class="text-xs">
              Live call documentation synced to Opportunity #ACME-9481
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-3 px-4 pb-4 sm:px-5">
            <Textarea
              v-model="dealNotes"
              rows="4"
              class="resize-y text-xs leading-relaxed"
              placeholder="Enter call notes, key customer requirements, and objections..."
            />

            <!-- Quick Append Tags -->
            <div class="space-y-1.5">
              <span class="text-muted-foreground text-xs font-medium">Quick Tags:</span>
              <div class="flex flex-wrap gap-1.5">
                <Button variant="outline" size="sm" class="h-6 px-2 text-xs" @click="handleAppendTag('SOC2-Security')">
                  + #soc2-security
                </Button>
                <Button variant="outline" size="sm" class="h-6 px-2 text-xs" @click="handleAppendTag('500-Seats')">
                  + #500-seats
                </Button>
                <Button variant="outline" size="sm" class="h-6 px-2 text-xs" @click="handleAppendTag('DPA-Review')">
                  + #dpa-review
                </Button>
                <Button variant="outline" size="sm" class="h-6 px-2 text-xs" @click="handleAppendTag('Q3-Close')">
                  + #q3-close
                </Button>
              </div>
            </div>

            <!-- Opportunity Metrics Strip -->
            <div class="bg-muted/30 grid grid-cols-3 gap-2 rounded-lg border p-2.5 text-center text-xs">
              <div>
                <span class="text-muted-foreground block text-xs">Deal Value</span>
                <span class="text-foreground font-mono font-bold">$180,000</span>
              </div>
              <div class="border-x">
                <span class="text-muted-foreground block text-xs">Stage</span>
                <span class="text-foreground font-semibold">Negotiation</span>
              </div>
              <div>
                <span class="text-muted-foreground block text-xs">Win Prob.</span>
                <span class="font-semibold text-emerald-600 dark:text-emerald-400">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Next Steps Checklist -->
        <Card class="shadow-xs">
          <CardHeader class="px-4 pt-4 pb-2 sm:px-5">
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center gap-1.5 text-sm font-bold">
                <CheckCircle2 class="text-primary size-4" />
                <span>Next Steps Checklist</span>
              </CardTitle>
              <Badge variant="secondary" class="text-xs">
                {{ actionItems.filter((i) => i.completed).length }}/{{ actionItems.length }} Done
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Action items committed during call. Checked items auto-create CRM tasks.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-3 px-4 pb-4 sm:px-5">
            <div class="space-y-2">
              <div
                v-for="item in actionItems"
                :key="item.id"
                class="bg-muted/20 hover:bg-muted/40 flex items-start gap-2.5 rounded-lg border p-2.5 transition-colors"
              >
                <Checkbox
                  :id="item.id"
                  :model-value="item.completed"
                  class="mt-0.5"
                  @update:model-value="() => handleToggleStep(item.id)"
                />
                <div class="flex-1 space-y-0.5">
                  <label
                    :for="item.id"
                    :class="[
                      'cursor-pointer text-xs font-medium select-none',
                      item.completed ? 'text-muted-foreground line-through' : 'text-foreground',
                    ]"
                  >
                    {{ item.text }}
                  </label>
                  <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                    <span>{{ item.dueDate }}</span>
                    <span>·</span>
                    <span>{{ item.assignee }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Item Row -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <Input
                v-model="newItemText"
                placeholder="Add custom action item..."
                class="h-8 text-xs"
                @keydown.enter.prevent="handleAddActionItem"
              />
              <Button
                size="sm"
                variant="outline"
                class="h-8 shrink-0 px-3 text-xs"
                :disabled="!newItemText.trim()"
                @click="handleAddActionItem"
              >
                <Plus class="size-3.5" />
                <span>Add</span>
              </Button>
            </div>

            <!-- Sync Button -->
            <div class="border-t pt-2">
              <Button size="sm" class="w-full gap-1.5 text-xs font-semibold shadow-xs" @click="handleSyncCrm">
                <Check v-if="isSyncedCrm" class="size-3.5" />
                <Save v-else class="size-3.5" />
                <span>{{ isSyncedCrm ? 'Call Summary & Tasks Logged to CRM!' : 'Log Call & Sync CRM Record' }}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
