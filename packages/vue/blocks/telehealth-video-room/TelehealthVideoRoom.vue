<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Heart,
  HeartPulse,
  Lock,
  Mic,
  MicOff,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  PhoneOff,
  Pill,
  RefreshCw,
  Send,
  Share2,
  ShieldCheck,
  Thermometer,
  Video,
  VideoOff,
  Wifi,
  X,
  MessageSquare,
  Settings,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

// Interactive State
const isMuted = ref(false)
const isCameraOff = ref(false)
const isScreenSharing = ref(false)
const isSidebarOpen = ref(true)
const activeTab = ref<'notes' | 'chat' | 'vitals'>('notes')
const isCallEnded = ref(false)
const showSettingsModal = ref(false)
const callDurationSeconds = ref(868) // 14:28
const unreadChatCount = ref(0)
const lastVitalsUpdate = ref('Just now')
const isRefreshingVitals = ref(false)

// Timer logic
let timerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timerInterval = setInterval(() => {
    if (!isCallEnded.value) {
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
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// SOAP Notes State
const chiefComplaint = ref(
  'Recurrent palpitations, sudden resting tachycardia (120-140 bpm), and lightheadedness over the past 2 weeks following morning coffee.',
)
const soapSubjective = ref(
  'Patient reports 4 distinct episodes in past 14 days. Episodes last ~5-10 minutes with abrupt onset and offset. No syncope, mild lightheadedness. Denies chest pressure or radiating pain. Reports high work stress and 3-4 espresso shots daily.',
)
const soapObjective = ref(
  'In-call vitals: HR 74 bpm regular sinus, BP 128/82 mmHg, SpO2 98%. Telemetry strip transmitted via Smart Hub shows NSR with infrequent PACs. No ST elevation or ischemic changes.',
)
const soapAssessment = ref(
  '1. Paroxysmal Supraventricular Tachycardia (PSVT) vs. Benign Premature Atrial Contractions (PACs) secondary to high caffeine consumption and sympathetic stress.\n2. Stage 1 Essential Hypertension - well controlled on current regimen.',
)
const soapPlan = ref(
  '1. Ordered 14-day continuous Holter monitor patch.\n2. Titrate Metoprolol Succinate ER to 25mg PO daily.\n3. Restrict caffeine to ≤1 cup/day; hydration goal 2.5L daily.\n4. Follow-up video consultation in 3 weeks or ASAP if syncope occurs.',
)

// Prescription Generator State
interface PrescriptionItem {
  id: string
  drugName: string
  dosage: string
  sig: string
  quantity: string
  refills: number
  pharmacy: string
  timestamp: string
  status: 'transmitted' | 'pending'
  rxNumber: string
}

const selectedDrugPreset = ref('metoprolol')
const customDosage = ref('25mg PO Daily in Morning')
const customQuantity = ref('30 tablets')
const customRefills = ref('2')
const rxSuccessMessage = ref('')

const drugOptions = [
  {
    id: 'metoprolol',
    name: 'Metoprolol Succinate ER',
    defaultDosage: '25mg PO Daily (Morning)',
    defaultQty: '30 tablets',
    refills: '2',
  },
  {
    id: 'propranolol',
    name: 'Propranolol HCl',
    defaultDosage: '10mg PO BID (Twice Daily)',
    defaultQty: '60 tablets',
    refills: '1',
  },
  {
    id: 'diltiazem',
    name: 'Diltiazem HCl Extended Release',
    defaultDosage: '120mg PO Daily',
    defaultQty: '30 capsules',
    refills: '3',
  },
  { id: 'lisinopril', name: 'Lisinopril', defaultDosage: '10mg PO Daily', defaultQty: '30 tablets', refills: '3' },
]

const prescriptions = ref<PrescriptionItem[]>([
  {
    id: 'rx-1',
    drugName: 'Metoprolol Succinate ER 25mg',
    dosage: 'Take 1 tablet by mouth daily in the morning',
    sig: '1 tab PO QAM',
    quantity: '30 tablets',
    refills: 2,
    pharmacy: 'CVS Pharmacy #4021 (Austin, TX)',
    timestamp: '10:24 AM',
    status: 'transmitted',
    rxNumber: 'RX-994182',
  },
])

function handleSelectDrugPreset(drugId: string) {
  selectedDrugPreset.value = drugId
  const found = drugOptions.find((d) => d.id === drugId)
  if (found) {
    customDosage.value = found.defaultDosage
    customQuantity.value = found.defaultQty
    customRefills.value = found.refills
  }
}

function handleGeneratePrescription() {
  const current = drugOptions.find((d) => d.id === selectedDrugPreset.value)
  const drugName = current ? current.name : 'Custom Medication'
  const newRx: PrescriptionItem = {
    id: `rx-${Date.now()}`,
    drugName: `${drugName} (${customDosage.value})`,
    dosage: customDosage.value,
    sig: `Take as directed: ${customDosage.value}`,
    quantity: customQuantity.value,
    refills: parseInt(customRefills.value) || 1,
    pharmacy: 'CVS Pharmacy #4021 (Austin, TX)',
    timestamp: 'Just now',
    status: 'transmitted',
    rxNumber: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
  }
  prescriptions.value.unshift(newRx)
  rxSuccessMessage.value = `e-Rx signed & securely transmitted to CVS Pharmacy #4021 (${newRx.rxNumber})`
  setTimeout(() => {
    rxSuccessMessage.value = ''
  }, 4500)
}

// Chat Thread State
interface ChatMessage {
  id: string
  sender: 'doctor' | 'patient'
  senderName: string
  text: string
  timestamp: string
  attachment?: {
    name: string
    size: string
    type: 'pdf' | 'image'
  }
}

const chatInput = ref('')
const chatMessages = ref<ChatMessage[]>([
  {
    id: 'msg-1',
    sender: 'doctor',
    senderName: 'Dr. Sarah Jenkins, MD',
    text: 'Hello David! I have your chart open and we are receiving your continuous telemetry stream. How are you feeling right now?',
    timestamp: '10:15 AM',
  },
  {
    id: 'msg-2',
    sender: 'patient',
    senderName: 'David Chen (You)',
    text: 'Good morning Dr. Jenkins. Feeling better than yesterday, but had another fluttering sensation around 8 AM after my second cup of coffee.',
    timestamp: '10:17 AM',
  },
  {
    id: 'msg-3',
    sender: 'patient',
    senderName: 'David Chen (You)',
    text: 'I captured the rhythm episode on my smart watch and exported the 30-second single lead PDF strip here.',
    timestamp: '10:18 AM',
    attachment: {
      name: 'Apple_Watch_ECG_Lead_I_2026.pdf',
      size: '1.4 MB · PDF ECG Report',
      type: 'pdf',
    },
  },
  {
    id: 'msg-4',
    sender: 'doctor',
    senderName: 'Dr. Sarah Jenkins, MD',
    text: 'Thank you, David! Reviewing the strip now. The baseline is normal sinus rhythm with occasional isolated PACs. This matches our telemetry.',
    timestamp: '10:20 AM',
  },
])

function handleSendMessage() {
  const text = chatInput.value.trim()
  if (!text) return
  chatMessages.value.push({
    id: `msg-${Date.now()}`,
    sender: 'patient',
    senderName: 'David Chen (You)',
    text,
    timestamp: 'Just now',
  })
  chatInput.value = ''

  // Simulated provider automated acknowledgment if consultation active
  setTimeout(() => {
    if (!isCallEnded.value) {
      chatMessages.value.push({
        id: `msg-doc-${Date.now()}`,
        sender: 'doctor',
        senderName: 'Dr. Sarah Jenkins, MD',
        text: 'Noted! I have added this observation into your encounter notes and prescription schedule.',
        timestamp: 'Just now',
      })
    }
  }, 1200)
}

function handleOpenTab(tab: 'notes' | 'chat' | 'vitals') {
  activeTab.value = tab
  isSidebarOpen.value = true
}

function handleEndCall() {
  isCallEnded.value = true
}

function handleRestartCall() {
  isCallEnded.value = false
  callDurationSeconds.value = 0
}

function handleRefreshVitals() {
  isRefreshingVitals.value = true
  setTimeout(() => {
    isRefreshingVitals.value = false
    lastVitalsUpdate.value = 'Just now'
  }, 800)
}
</script>

<template>
  <div data-slot="telehealth-video-room" class="bg-background text-foreground w-full space-y-4">
    <!-- Top Room Bar -->
    <header class="bg-card rounded-xl border p-4 shadow-xs sm:px-6 sm:py-3.5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Call Metadata & HIPAA Badge -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="relative flex size-3">
              <span
                v-if="!isCallEnded"
                class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              />
              <span
                :class="['relative inline-flex size-3 rounded-full', isCallEnded ? 'bg-zinc-400' : 'bg-emerald-500']"
              />
            </span>
            <div class="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-tight">
              <Clock class="text-muted-foreground size-3.5" />
              <span>{{ isCallEnded ? 'Call Ended' : formattedDuration }}</span>
            </div>
          </div>

          <Separator orientation="vertical" class="hidden h-5 sm:block" />

          <!-- HIPAA Encrypted Connection Badge -->
          <Badge
            variant="outline"
            class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            <Lock class="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>HIPAA Encrypted · AES-256</span>
          </Badge>

          <Separator orientation="vertical" class="hidden h-5 md:block" />

          <!-- Doctor & Patient Context Strip -->
          <div class="hidden items-center gap-2 lg:flex">
            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-muted-foreground">Provider:</span>
              <span class="text-foreground font-semibold">Dr. Sarah Jenkins, MD</span>
              <span class="text-muted-foreground">(Cardiology)</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-muted-foreground">Patient:</span>
              <span class="text-foreground font-semibold">David Chen</span>
              <span class="text-muted-foreground font-mono text-xs">(MRN-88412)</span>
            </div>
          </div>
        </div>

        <!-- Header Actions: End Call & Network Status -->
        <div class="flex items-center gap-2.5">
          <div class="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
            <Wifi class="size-3.5 text-emerald-500" />
            <span>HD Connection (18ms)</span>
          </div>

          <Button
            v-if="!isCallEnded"
            variant="destructive"
            size="sm"
            class="h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs"
            @click="handleEndCall"
          >
            <PhoneOff class="size-3.5" />
            <span>End Consultation</span>
          </Button>

          <Button
            v-else
            variant="default"
            size="sm"
            class="h-8 gap-1.5 px-3 text-xs font-semibold"
            @click="handleRestartCall"
          >
            <RefreshCw class="size-3.5" />
            <span>Reconnect Call</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Video Room Grid (Video Canvas + Collapsible Workspace) -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <!-- Video Call Canvas (Center 8 cols when open, full 12 cols when collapsed) -->
      <section
        :class="[
          'relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white shadow-lg transition-all duration-200',
          isSidebarOpen ? 'min-h-[560px] lg:col-span-8 xl:col-span-8' : 'min-h-[600px] lg:col-span-12',
        ]"
      >
        <!-- Overlay Top: Provider Status & Watermark -->
        <div class="z-10 flex flex-wrap items-start justify-between gap-3">
          <!-- Doctor Name & Active Speaking Indicator -->
          <div
            class="flex items-center gap-2.5 rounded-lg border border-zinc-700/60 bg-zinc-900/85 p-2 shadow-md backdrop-blur-md"
          >
            <Avatar class="size-8 border border-emerald-500/50">
              <AvatarFallback class="bg-emerald-950 text-xs font-semibold text-emerald-400">SJ</AvatarFallback>
            </Avatar>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-semibold text-zinc-100">Dr. Sarah Jenkins, MD</span>
                <Badge
                  variant="outline"
                  class="border-emerald-500/40 bg-emerald-500/20 px-1 py-0 text-xs font-normal text-emerald-300"
                >
                  Attending
                </Badge>
              </div>
              <div class="flex items-center gap-2 text-xs text-zinc-400">
                <div class="flex items-center gap-1">
                  <Mic class="size-3 text-emerald-400" />
                  <div class="flex items-center gap-0.5">
                    <span class="size-1 animate-pulse rounded-full bg-emerald-400" />
                    <span class="h-2.5 w-0.5 animate-[pulse_0.8s_ease-in-out_infinite] rounded-full bg-emerald-400" />
                    <span class="h-3.5 w-0.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-emerald-400" />
                    <span class="h-1.5 w-0.5 animate-[pulse_0.6s_ease-in-out_infinite] rounded-full bg-emerald-400" />
                  </div>
                  <span class="text-xs font-medium text-emerald-400">Speaking</span>
                </div>
                <span>·</span>
                <span>St. Jude Telehealth Clinic</span>
              </div>
            </div>
          </div>

          <!-- Feed Encryption & Signal Badge -->
          <div
            class="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300 backdrop-blur-sm"
          >
            <ShieldCheck class="size-3.5 text-emerald-400" />
            <span class="font-mono text-xs">1080p 60fps · BAA Protected</span>
          </div>
        </div>

        <!-- Main Video Placeholder Canvas (Simulated high-res clinical video stream) -->
        <div class="relative my-auto flex flex-col items-center justify-center pt-12 pb-28 text-center">
          <!-- Background radial glow -->
          <div class="pointer-events-none absolute inset-0 bg-radial from-emerald-950/20 via-zinc-950/80 to-zinc-950" />

          <div class="relative z-10 space-y-4">
            <!-- Simulated Video Avatar Portrait with active ring -->
            <div class="relative mx-auto size-28 sm:size-36">
              <div
                class="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-60 blur-xs"
              />
              <div
                class="relative flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-emerald-400/80 bg-zinc-900 shadow-xl"
              >
                <Avatar class="size-full">
                  <AvatarFallback class="bg-zinc-900 text-xl font-bold text-emerald-400 sm:text-2xl">
                    SJ
                  </AvatarFallback>
                </Avatar>
              </div>
              <span class="absolute right-2 bottom-2 size-4 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
            </div>

            <!-- Provider Live Status Title -->
            <div class="space-y-1">
              <h3 class="text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">Dr. Sarah Jenkins, MD</h3>
              <p class="text-xs text-zinc-400">Department of Cardiovascular Medicine · Clinical Telehealth Encounter</p>
            </div>

            <!-- Video Stream Diagnostic Watermark -->
            <div
              class="inline-flex max-w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 font-mono text-xs text-zinc-400"
            >
              <span class="size-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span class="truncate">Session: #TH-9021-TX</span>
              <span class="hidden sm:inline">·</span>
              <span class="hidden truncate sm:inline">Latency: 24ms (0% loss)</span>
            </div>
          </div>
        </div>

        <!-- Picture-in-Picture Self Video Tile (Patient View - Bottom Right) -->
        <div
          class="absolute right-4 bottom-20 z-20 aspect-video w-36 overflow-hidden rounded-xl border-2 border-zinc-700/80 bg-zinc-900 shadow-sm transition-all sm:right-6 sm:bottom-20 sm:w-48"
        >
          <div
            v-if="!isCameraOff"
            class="relative flex size-full flex-col justify-between bg-gradient-to-b from-zinc-800 to-zinc-950 p-2 text-white"
          >
            <div class="flex items-center justify-between">
              <Badge variant="outline" class="border-zinc-700 bg-zinc-900/80 px-1 py-0 text-xs text-zinc-300">
                You (720p)
              </Badge>
              <div
                :class="[
                  'flex size-4 items-center justify-center rounded-full',
                  isMuted ? 'bg-destructive text-white' : 'bg-emerald-500/80 text-white',
                ]"
              >
                <MicOff v-if="isMuted" class="size-2.5" />
                <Mic v-else class="size-2.5" />
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <Avatar class="size-5">
                <AvatarFallback class="bg-zinc-700 text-xs font-bold text-zinc-100">DC</AvatarFallback>
              </Avatar>
              <span class="truncate text-xs font-medium text-zinc-200">David Chen</span>
            </div>
          </div>

          <!-- Camera Off Placeholder -->
          <div
            v-else
            class="flex size-full flex-col items-center justify-center gap-1 bg-zinc-950 p-2 text-center text-zinc-400"
          >
            <VideoOff class="size-4 text-zinc-500" />
            <span class="text-xs font-medium">Camera Off</span>
          </div>
        </div>

        <!-- Floating Call Controls Bar (Bottom Center) -->
        <div class="z-20 flex items-center justify-center pt-4">
          <div
            class="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-zinc-700/70 bg-zinc-900/90 p-2 shadow-sm backdrop-blur-md sm:gap-2 sm:px-4"
          >
            <!-- Mute / Unmute Button -->
            <Button
              :variant="isMuted ? 'destructive' : 'secondary'"
              size="icon"
              class="size-9 rounded-full sm:size-10"
              :aria-label="isMuted ? 'Unmute microphone' : 'Mute microphone'"
              @click="isMuted = !isMuted"
            >
              <MicOff v-if="isMuted" class="size-4" />
              <Mic v-else class="size-4 text-emerald-400" />
            </Button>

            <!-- Video On / Off Button -->
            <Button
              :variant="isCameraOff ? 'destructive' : 'secondary'"
              size="icon"
              class="size-9 rounded-full sm:size-10"
              :aria-label="isCameraOff ? 'Turn on camera' : 'Turn off camera'"
              @click="isCameraOff = !isCameraOff"
            >
              <VideoOff v-if="isCameraOff" class="size-4" />
              <Video v-else class="size-4 text-emerald-400" />
            </Button>

            <!-- Screen Share Button -->
            <Button
              :variant="isScreenSharing ? 'default' : 'secondary'"
              size="icon"
              class="size-9 rounded-full sm:size-10"
              :aria-label="isScreenSharing ? 'Stop sharing screen' : 'Share screen'"
              @click="isScreenSharing = !isScreenSharing"
            >
              <Share2 class="size-4" />
            </Button>

            <Separator orientation="vertical" class="mx-1 h-6 bg-zinc-700" />

            <!-- Tab Quick Toggle Buttons -->
            <Button
              :variant="isSidebarOpen && activeTab === 'notes' ? 'default' : 'secondary'"
              size="sm"
              class="h-9 gap-1.5 rounded-full px-3 text-xs sm:h-10 sm:px-3.5"
              @click="handleOpenTab('notes')"
            >
              <FileText class="size-3.5" />
              <span class="hidden sm:inline">SOAP Notes</span>
            </Button>

            <Button
              :variant="isSidebarOpen && activeTab === 'chat' ? 'default' : 'secondary'"
              size="sm"
              class="relative h-9 gap-1.5 rounded-full px-3 text-xs sm:h-10 sm:px-3.5"
              @click="handleOpenTab('chat')"
            >
              <MessageSquare class="size-3.5" />
              <span class="hidden sm:inline">In-Call Chat</span>
              <span
                v-if="!isSidebarOpen && unreadChatCount > 0"
                class="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-xs font-bold"
              >
                {{ unreadChatCount }}
              </span>
            </Button>

            <Button
              :variant="isSidebarOpen && activeTab === 'vitals' ? 'default' : 'secondary'"
              size="sm"
              class="h-9 gap-1.5 rounded-full px-3 text-xs sm:h-10 sm:px-3.5"
              @click="handleOpenTab('vitals')"
            >
              <HeartPulse class="size-3.5 text-rose-400" />
              <span class="hidden sm:inline">Vitals</span>
            </Button>

            <Separator orientation="vertical" class="mx-1 h-6 bg-zinc-700" />

            <!-- Device Settings Toggle -->
            <Button
              variant="secondary"
              size="icon"
              class="size-9 rounded-full sm:size-10"
              aria-label="Audio and Video Settings"
              @click="showSettingsModal = !showSettingsModal"
            >
              <Settings class="size-4 text-zinc-300" />
            </Button>

            <!-- Expand / Collapse Sidebar Toggle -->
            <Button
              variant="secondary"
              size="icon"
              class="size-9 rounded-full sm:size-10"
              :aria-label="isSidebarOpen ? 'Collapse side workspace' : 'Open side workspace'"
              @click="isSidebarOpen = !isSidebarOpen"
            >
              <PanelRightClose v-if="isSidebarOpen" class="size-4 text-zinc-300" />
              <PanelRightOpen v-else class="size-4 text-zinc-300" />
            </Button>
          </div>
        </div>

        <!-- Quick Settings Flyout / Drawer Banner (when clicked) -->
        <div
          v-if="showSettingsModal"
          class="bg-card text-card-foreground absolute top-16 right-4 z-30 w-72 rounded-xl border p-4 shadow-xl"
        >
          <div class="flex items-center justify-between pb-2">
            <h4 class="text-muted-foreground text-xs font-bold tracking-wider uppercase">AV Devices & HIPAA</h4>
            <Button
              variant="ghost"
              size="icon"
              class="size-6"
              aria-label="Close settings modal"
              @click="showSettingsModal = false"
            >
              <X class="size-3.5" />
            </Button>
          </div>
          <div class="space-y-3 pt-1 text-xs">
            <div>
              <label class="text-muted-foreground block font-medium">Microphone</label>
              <div class="text-foreground mt-0.5 rounded border p-1.5 font-mono text-xs">
                Default - MacBook Pro Mic (CoreAudio)
              </div>
            </div>
            <div>
              <label class="text-muted-foreground block font-medium">Camera</label>
              <div class="text-foreground mt-0.5 rounded border p-1.5 font-mono text-xs">
                FaceTime HD Camera (1080p)
              </div>
            </div>
            <div>
              <label class="text-muted-foreground block font-medium">Speaker Output</label>
              <div class="text-foreground mt-0.5 rounded border p-1.5 font-mono text-xs">Studio Display Speakers</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Collapsible Side Workspace (Right 1/3 when open) -->
      <aside
        v-if="isSidebarOpen"
        class="bg-card flex flex-col overflow-hidden rounded-xl border shadow-xs lg:col-span-4 xl:col-span-4"
      >
        <Tabs v-model="activeTab" class="flex h-full flex-col">
          <!-- Workspace Tab Navigation Header -->
          <div class="bg-muted/30 flex items-center justify-between border-b px-3 py-2.5">
            <TabsList class="grid h-8 w-full max-w-[320px] grid-cols-3">
              <TabsTrigger value="notes" class="gap-1 text-xs font-medium">
                <FileText class="size-3" />
                <span>Notes & Rx</span>
              </TabsTrigger>
              <TabsTrigger value="chat" class="gap-1 text-xs font-medium">
                <MessageSquare class="size-3" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="vitals" class="gap-1 text-xs font-medium">
                <HeartPulse class="size-3 text-rose-500" />
                <span>Vitals</span>
              </TabsTrigger>
            </TabsList>

            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground ml-1 size-8"
              aria-label="Close sidebar"
              @click="isSidebarOpen = false"
            >
              <PanelRightClose class="size-4" />
            </Button>
          </div>

          <!-- TAB 1: Clinical Notes & Rx -->
          <TabsContent value="notes" class="flex-1 space-y-4 overflow-y-auto p-4 focus-visible:outline-none">
            <!-- Patient Demographics Pill Strip -->
            <div class="bg-muted/40 space-y-2 rounded-lg border p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Avatar class="size-7">
                    <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <span class="text-foreground text-xs font-bold">David Chen</span>
                    <span class="text-muted-foreground ml-1 text-xs">44y · Male</span>
                  </div>
                </div>
                <Badge variant="destructive" class="text-xs font-normal"> Allergy: Penicillin </Badge>
              </div>
              <div
                class="text-muted-foreground flex flex-wrap items-center justify-between gap-1 border-t pt-2 text-xs"
              >
                <span>DOB: 05/14/1982</span>
                <span>Pharmacy: CVS #4021 (Austin)</span>
              </div>
            </div>

            <!-- Chief Complaint -->
            <div class="space-y-1.5">
              <label class="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                <AlertCircle class="size-3.5 text-amber-500" />
                Chief Complaint
              </label>
              <div class="bg-muted/20 text-foreground rounded-lg border p-2.5 text-xs leading-relaxed">
                {{ chiefComplaint }}
              </div>
            </div>

            <!-- SOAP Documentation Cards -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                  >SOAP Encounter Note</span
                >
                <span class="text-muted-foreground font-mono text-xs">ICD-10: I47.1</span>
              </div>

              <!-- S: Subjective -->
              <div class="bg-card space-y-1 rounded-lg border p-3">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs"
                    >S</span
                  >
                  <span>Subjective</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ soapSubjective }}</p>
              </div>

              <!-- O: Objective -->
              <div class="bg-card space-y-1 rounded-lg border p-3">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs"
                    >O</span
                  >
                  <span>Objective (Telemetry & Exam)</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ soapObjective }}</p>
              </div>

              <!-- A: Assessment -->
              <div class="bg-card space-y-1 rounded-lg border p-3">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs"
                    >A</span
                  >
                  <span>Assessment & Differential</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">{{ soapAssessment }}</p>
              </div>

              <!-- P: Plan (Editable) -->
              <div class="bg-card space-y-2 rounded-lg border p-3">
                <div class="flex items-center justify-between">
                  <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs"
                      >P</span
                    >
                    <span>Clinical Plan & Orders</span>
                  </div>
                  <span class="text-muted-foreground text-xs">Editable</span>
                </div>
                <Textarea
                  v-model="soapPlan"
                  rows="3"
                  class="resize-y text-xs leading-relaxed"
                  placeholder="Enter medical orders, follow-up recommendations..."
                />
              </div>
            </div>

            <!-- Quick e-Prescription Generator -->
            <Card class="border-primary/30 shadow-xs">
              <CardHeader class="px-3.5 pt-3 pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-foreground flex items-center gap-1.5 text-xs font-bold">
                    <Pill class="text-primary size-3.5" />
                    Electronic Prescription (e-Rx)
                  </CardTitle>
                  <Badge variant="outline" class="font-mono text-xs">NPI #1894021</Badge>
                </div>
                <CardDescription class="text-xs">
                  Generate and electronically sign DEA-compliant prescription
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-3 px-3.5 pb-3">
                <div class="space-y-1.5">
                  <label class="text-muted-foreground text-xs font-medium">Select Medication</label>
                  <div class="grid grid-cols-2 gap-1.5">
                    <Button
                      v-for="drug in drugOptions"
                      :key="drug.id"
                      type="button"
                      :variant="selectedDrugPreset === drug.id ? 'default' : 'outline'"
                      size="sm"
                      class="h-7 justify-start truncate px-2 text-xs"
                      @click="handleSelectDrugPreset(drug.id)"
                    >
                      {{ drug.name }}
                    </Button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div class="space-y-1">
                    <label class="text-muted-foreground text-xs">Dosage & Frequency</label>
                    <Input v-model="customDosage" class="h-7 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-muted-foreground text-xs">Quantity & Refills</label>
                    <Input v-model="customQuantity" class="h-7 text-xs" />
                  </div>
                </div>

                <div
                  v-if="rxSuccessMessage"
                  class="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 class="size-3.5 shrink-0" />
                  <span>{{ rxSuccessMessage }}</span>
                </div>

                <Button size="sm" class="w-full gap-1.5 text-xs font-semibold" @click="handleGeneratePrescription">
                  <FileCheck class="size-3.5" />
                  <span>Sign & Transmit e-Rx to Pharmacy</span>
                </Button>

                <!-- Encounter Prescriptions History -->
                <div v-if="prescriptions.length > 0" class="space-y-1.5 border-t pt-1">
                  <span class="text-muted-foreground text-xs font-medium">Active Prescriptions this Visit:</span>
                  <div
                    v-for="rx in prescriptions"
                    :key="rx.id"
                    class="bg-muted/30 space-y-1 rounded border p-2 text-xs"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-foreground font-semibold">{{ rx.drugName }}</span>
                      <Badge
                        variant="outline"
                        class="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        {{ rx.status === 'transmitted' ? 'Transmitted' : 'Pending' }}
                      </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      {{ rx.dosage }} · {{ rx.quantity }} (Refills: {{ rx.refills }})
                    </p>
                    <p class="text-muted-foreground font-mono text-xs">{{ rx.pharmacy }} · {{ rx.rxNumber }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- TAB 2: In-Call Chat -->
          <TabsContent value="chat" class="flex h-[460px] flex-col focus-visible:outline-none">
            <!-- HIPAA Banner -->
            <div
              class="flex items-center gap-2 border-b bg-emerald-500/10 p-2.5 text-xs text-emerald-800 dark:text-emerald-300"
            >
              <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Encrypted Consultation Chat · Archived in EHR Audit Log</span>
            </div>

            <!-- Messages List -->
            <div class="flex-1 space-y-3.5 overflow-y-auto p-4">
              <div
                v-for="msg in chatMessages"
                :key="msg.id"
                :class="['flex flex-col gap-1 text-xs', msg.sender === 'patient' ? 'items-end' : 'items-start']"
              >
                <div class="text-muted-foreground flex items-center gap-1.5 px-1 text-xs">
                  <span>{{ msg.senderName }}</span>
                  <span>·</span>
                  <span>{{ msg.timestamp }}</span>
                </div>

                <!-- Message bubble -->
                <div
                  :class="[
                    'max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed shadow-xs',
                    msg.sender === 'patient'
                      ? 'bg-primary text-primary-foreground rounded-br-xs'
                      : 'bg-muted text-foreground rounded-bl-xs',
                  ]"
                >
                  <p>{{ msg.text }}</p>

                  <!-- Attachment preview if present -->
                  <div
                    v-if="msg.attachment"
                    class="mt-2 flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-black/10 p-2 text-xs"
                  >
                    <div class="flex min-w-0 items-center gap-2">
                      <FileText class="size-4 shrink-0" />
                      <div class="min-w-0">
                        <p class="truncate font-medium">{{ msg.attachment.name }}</p>
                        <p class="text-xs opacity-80">{{ msg.attachment.size }}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="size-6 shrink-0 text-current hover:bg-white/10"
                      aria-label="Download attachment"
                    >
                      <Download class="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Composer -->
            <div class="bg-muted/20 space-y-2 border-t p-3">
              <div class="flex items-center gap-1.5">
                <Input
                  v-model="chatInput"
                  placeholder="Type encrypted message to Dr. Jenkins..."
                  class="h-8 text-xs"
                  @keydown.enter.prevent="handleSendMessage"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-foreground size-8 shrink-0"
                  aria-label="Attach clinical file"
                >
                  <Paperclip class="size-4" />
                </Button>
                <Button
                  size="sm"
                  class="h-8 shrink-0 gap-1 px-3 text-xs"
                  :disabled="!chatInput.trim()"
                  @click="handleSendMessage"
                >
                  <Send class="size-3.5" />
                  <span>Send</span>
                </Button>
              </div>
              <div class="text-muted-foreground flex items-center justify-between px-1 text-xs">
                <span>Press Enter to send</span>
                <span>BAA Encrypted</span>
              </div>
            </div>
          </TabsContent>

          <!-- TAB 3: Patient Vitals & Telemetry -->
          <TabsContent value="vitals" class="flex-1 space-y-4 overflow-y-auto p-4 focus-visible:outline-none">
            <!-- Telemetry Stream Banner -->
            <div class="bg-muted/30 flex items-center justify-between rounded-lg border p-3">
              <div class="flex items-center gap-2">
                <span class="relative flex size-2.5">
                  <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span class="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
                <div>
                  <h4 class="text-foreground text-xs font-bold">Live Telemetry Feed</h4>
                  <p class="text-muted-foreground text-xs">BLE Medical Hub · Updated {{ lastVitalsUpdate }}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="h-7 gap-1.5 text-xs"
                :disabled="isRefreshingVitals"
                @click="handleRefreshVitals"
              >
                <RefreshCw :class="['size-3', isRefreshingVitals && 'animate-spin']" />
                <span>Refresh</span>
              </Button>
            </div>

            <!-- Vitals Telemetry Grid -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Blood Pressure -->
              <Card class="space-y-2 p-3">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground text-xs font-semibold">Blood Pressure</span>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Normal
                  </Badge>
                </div>
                <div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-foreground font-mono text-xl font-bold tracking-tight">128/82</span>
                    <span class="text-muted-foreground text-xs">mmHg</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Target: &lt;130/85 mmHg</p>
                </div>
                <div class="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                  <span>Smart Cuff</span>
                  <span class="text-foreground font-medium">MAP: 97</span>
                </div>
              </Card>

              <!-- Heart Rate -->
              <Card class="space-y-2 p-3">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                    <Heart class="size-3 text-rose-500" />
                    Heart Rate
                  </span>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    NSR
                  </Badge>
                </div>
                <div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-foreground font-mono text-xl font-bold tracking-tight">74</span>
                    <span class="text-muted-foreground text-xs">bpm</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Resting (Range: 68-88)</p>
                </div>
                <div class="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                  <span>Rhythm: Sinus</span>
                  <span class="font-medium text-emerald-600 dark:text-emerald-400">Regular</span>
                </div>
              </Card>

              <!-- Oxygen Saturation (SpO2) -->
              <Card class="space-y-2 p-3">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground text-xs font-semibold">Oxygen (SpO2)</span>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Optimal
                  </Badge>
                </div>
                <div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-foreground font-mono text-xl font-bold tracking-tight">98%</span>
                    <span class="text-muted-foreground text-xs">Ambient</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Room Air (FiO2 21%)</p>
                </div>
                <div class="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                  <span>PulseOx Probe</span>
                  <span class="text-foreground font-medium">PI: 4.8%</span>
                </div>
              </Card>

              <!-- Body Temperature -->
              <Card class="space-y-2 p-3">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                    <Thermometer class="size-3 text-amber-500" />
                    Temperature
                  </span>
                  <Badge variant="secondary" class="text-xs"> Afebrile </Badge>
                </div>
                <div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-foreground font-mono text-xl font-bold tracking-tight">98.4°</span>
                    <span class="text-muted-foreground text-xs">F</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">36.9°C (Temporal Scan)</p>
                </div>
                <div class="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                  <span>Scanner Hub</span>
                  <span class="text-foreground font-medium">Normal</span>
                </div>
              </Card>

              <!-- Respiration Rate -->
              <Card class="space-y-2 p-3">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground text-xs font-semibold">Respiration</span>
                  <Badge variant="secondary" class="text-xs"> Eupneic </Badge>
                </div>
                <div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-foreground font-mono text-xl font-bold tracking-tight">16</span>
                    <span class="text-muted-foreground text-xs">br/min</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Range: 12-20 normal</p>
                </div>
                <div class="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                  <span>Chest Sensor</span>
                  <span class="text-foreground font-medium">Steady</span>
                </div>
              </Card>

              <!-- Fasting Blood Glucose -->
              <Card class="space-y-2 p-3">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground text-xs font-semibold">Glucose</span>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Normal
                  </Badge>
                </div>
                <div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-foreground font-mono text-xl font-bold tracking-tight">94</span>
                    <span class="text-muted-foreground text-xs">mg/dL</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Fasting 3.5h post-meal</p>
                </div>
                <div class="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                  <span>Continuous CGM</span>
                  <span class="font-medium text-emerald-600 dark:text-emerald-400">In Range</span>
                </div>
              </Card>
            </div>

            <!-- Physician Vitals Summary -->
            <div class="bg-muted/20 space-y-1.5 rounded-lg border p-3 text-xs">
              <div class="text-foreground flex items-center gap-1.5 font-semibold">
                <ShieldCheck class="size-3.5 text-emerald-500" />
                <span>Physician Baseline Parameter Assessment</span>
              </div>
              <p class="text-muted-foreground leading-relaxed">
                All live telemetry telemetry values remain within normal hemodynamic thresholds. Patient exhibits no
                signs of acute decompensation or malignant arrhythmias during the video encounter.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  </div>
</template>
