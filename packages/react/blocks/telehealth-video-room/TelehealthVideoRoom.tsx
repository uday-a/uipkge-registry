'use client'

import * as React from 'react'
import {
  Activity,
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Heart,
  HeartPulse,
  Lock,
  Maximize2,
  Mic,
  MicOff,
  MoreVertical,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  PhoneOff,
  Pill,
  Plus,
  RefreshCw,
  Send,
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Thermometer,
  UploadCloud,
  User,
  Video,
  VideoOff,
  Volume2,
  Wifi,
  X,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

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

export function TelehealthVideoRoom() {
  // Interactive Call State
  const [isMuted, setIsMuted] = React.useState(false)
  const [isCameraOff, setIsCameraOff] = React.useState(false)
  const [isScreenSharing, setIsScreenSharing] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<'notes' | 'chat' | 'vitals'>('notes')
  const [isCallEnded, setIsCallEnded] = React.useState(false)
  const [showSettingsModal, setShowSettingsModal] = React.useState(false)
  const [callDurationSeconds, setCallDurationSeconds] = React.useState(868) // 14:28
  const [unreadChatCount, setUnreadChatCount] = React.useState(0)
  const [lastVitalsUpdate, setLastVitalsUpdate] = React.useState('Just now')
  const [isRefreshingVitals, setIsRefreshingVitals] = React.useState(false)

  // Timer effect
  React.useEffect(() => {
    if (isCallEnded) return
    const interval = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isCallEnded])

  const formattedDuration = React.useMemo(() => {
    const mins = Math.floor(callDurationSeconds / 60)
    const secs = callDurationSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [callDurationSeconds])

  // SOAP Notes State
  const [chiefComplaint] = React.useState(
    'Recurrent palpitations, sudden resting tachycardia (120-140 bpm), and lightheadedness over the past 2 weeks following morning coffee.',
  )
  const [soapSubjective] = React.useState(
    'Patient reports 4 distinct episodes in past 14 days. Episodes last ~5-10 minutes with abrupt onset and offset. No syncope, mild lightheadedness. Denies chest pressure or radiating pain. Reports high work stress and 3-4 espresso shots daily.',
  )
  const [soapObjective] = React.useState(
    'In-call vitals: HR 74 bpm regular sinus, BP 128/82 mmHg, SpO2 98%. Telemetry strip transmitted via Smart Hub shows NSR with infrequent PACs. No ST elevation or ischemic changes.',
  )
  const [soapAssessment] = React.useState(
    '1. Paroxysmal Supraventricular Tachycardia (PSVT) vs. Benign Premature Atrial Contractions (PACs) secondary to high caffeine consumption and sympathetic stress.\n2. Stage 1 Essential Hypertension - well controlled on current regimen.',
  )
  const [soapPlan, setSoapPlan] = React.useState(
    '1. Ordered 14-day continuous Holter monitor patch.\n2. Titrate Metoprolol Succinate ER to 25mg PO daily.\n3. Restrict caffeine to ≤1 cup/day; hydration goal 2.5L daily.\n4. Follow-up video consultation in 3 weeks or ASAP if syncope occurs.',
  )

  // Prescription Generator State
  const [selectedDrugPreset, setSelectedDrugPreset] = React.useState('metoprolol')
  const [customDosage, setCustomDosage] = React.useState('25mg PO Daily in Morning')
  const [customQuantity, setCustomQuantity] = React.useState('30 tablets')
  const [customRefills, setCustomRefills] = React.useState('2')
  const [rxSuccessMessage, setRxSuccessMessage] = React.useState('')
  const [prescriptions, setPrescriptions] = React.useState<PrescriptionItem[]>([
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
    setSelectedDrugPreset(drugId)
    const found = drugOptions.find((d) => d.id === drugId)
    if (found) {
      setCustomDosage(found.defaultDosage)
      setCustomQuantity(found.defaultQty)
      setCustomRefills(found.refills)
    }
  }

  function handleGeneratePrescription() {
    const current = drugOptions.find((d) => d.id === selectedDrugPreset)
    const drugName = current ? current.name : 'Custom Medication'
    const newRx: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      drugName: `${drugName} (${customDosage})`,
      dosage: customDosage,
      sig: `Take as directed: ${customDosage}`,
      quantity: customQuantity,
      refills: parseInt(customRefills) || 1,
      pharmacy: 'CVS Pharmacy #4021 (Austin, TX)',
      timestamp: 'Just now',
      status: 'transmitted',
      rxNumber: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
    }
    setPrescriptions((prev) => [newRx, ...prev])
    setRxSuccessMessage(`e-Rx signed & securely transmitted to CVS Pharmacy #4021 (${newRx.rxNumber})`)
    setTimeout(() => {
      setRxSuccessMessage('')
    }, 4500)
  }

  // Chat State
  const [chatInput, setChatInput] = React.useState('')
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
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
    const text = chatInput.trim()
    if (!text) return
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'patient',
        senderName: 'David Chen (You)',
        text,
        timestamp: 'Just now',
      },
    ])
    setChatInput('')

    // Simulated provider automated acknowledgment
    setTimeout(() => {
      if (!isCallEnded) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-doc-${Date.now()}`,
            sender: 'doctor',
            senderName: 'Dr. Sarah Jenkins, MD',
            text: 'Noted! I have added this observation into your encounter notes and prescription schedule.',
            timestamp: 'Just now',
          },
        ])
      }
    }, 1200)
  }

  function handleOpenTab(tab: 'notes' | 'chat' | 'vitals') {
    setActiveTab(tab)
    setIsSidebarOpen(true)
  }

  function handleEndCall() {
    setIsCallEnded(true)
  }

  function handleRestartCall() {
    setIsCallEnded(false)
    setCallDurationSeconds(0)
  }

  function handleRefreshVitals() {
    setIsRefreshingVitals(true)
    setTimeout(() => {
      setIsRefreshingVitals(false)
      setLastVitalsUpdate('Just now')
    }, 800)
  }

  return (
    <div data-slot="telehealth-video-room" className="bg-background text-foreground w-full space-y-4">
      {/* Top Room Bar */}
      <header className="bg-card rounded-xl border p-4 shadow-xs sm:px-6 sm:py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Call Metadata & HIPAA Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex size-3">
                {!isCallEnded && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex size-3 rounded-full ${
                    isCallEnded ? 'bg-zinc-400' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-tight">
                <Clock className="text-muted-foreground size-3.5" />
                <span>{isCallEnded ? 'Call Ended' : formattedDuration}</span>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden h-5 sm:block" />

            {/* HIPAA Encrypted Connection Badge */}
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              <Lock className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>HIPAA Encrypted · AES-256</span>
            </Badge>

            <Separator orientation="vertical" className="hidden h-5 md:block" />

            {/* Doctor & Patient Context Strip */}
            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Provider:</span>
                <span className="text-foreground font-semibold">Dr. Sarah Jenkins, MD</span>
                <span className="text-muted-foreground">(Cardiology)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Patient:</span>
                <span className="text-foreground font-semibold">David Chen</span>
                <span className="text-muted-foreground font-mono text-xs">(MRN-88412)</span>
              </div>
            </div>
          </div>

          {/* Header Actions: End Call & Network Status */}
          <div className="flex items-center gap-2.5">
            <div className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
              <Wifi className="size-3.5 text-emerald-500" />
              <span>HD Connection (18ms)</span>
            </div>

            {!isCallEnded ? (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs"
                onClick={handleEndCall}
              >
                <PhoneOff className="size-3.5" />
                <span>End Consultation</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1.5 px-3 text-xs font-semibold"
                onClick={handleRestartCall}
              >
                <RefreshCw className="size-3.5" />
                <span>Reconnect Call</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Video Room Grid (Video Canvas + Collapsible Workspace) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Video Call Canvas (Center 8 cols when open, full 12 cols when collapsed) */}
        <section
          className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white shadow-lg transition-all duration-200 ${
            isSidebarOpen ? 'min-h-[560px] lg:col-span-8 xl:col-span-8' : 'min-h-[600px] lg:col-span-12'
          }`}
        >
          {/* Overlay Top: Provider Status & Watermark */}
          <div className="z-10 flex flex-wrap items-start justify-between gap-3">
            {/* Doctor Name & Active Speaking Indicator */}
            <div className="flex items-center gap-2.5 rounded-lg border border-zinc-700/60 bg-zinc-900/85 p-2 shadow-md backdrop-blur-md">
              <Avatar className="size-8 border border-emerald-500/50">
                <AvatarFallback className="bg-emerald-950 text-xs font-semibold text-emerald-400">SJ</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-100">Dr. Sarah Jenkins, MD</span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/20 px-1 py-0 text-xs font-normal text-emerald-300"
                  >
                    Attending
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Mic className="size-3 text-emerald-400" />
                    <div className="flex items-center gap-0.5">
                      <span className="size-1 animate-pulse rounded-full bg-emerald-400" />
                      <span className="h-2.5 w-0.5 animate-[pulse_0.8s_ease-in-out_infinite] rounded-full bg-emerald-400" />
                      <span className="h-3.5 w-0.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-emerald-400" />
                      <span className="h-1.5 w-0.5 animate-[pulse_0.6s_ease-in-out_infinite] rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-medium text-emerald-400">Speaking</span>
                  </div>
                  <span>·</span>
                  <span>St. Jude Telehealth Clinic</span>
                </div>
              </div>
            </div>

            {/* Feed Encryption & Signal Badge */}
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300 backdrop-blur-sm">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span className="font-mono text-xs">1080p 60fps · BAA Protected</span>
            </div>
          </div>

          {/* Main Video Placeholder Canvas (Simulated high-res clinical video stream) */}
          <div className="relative my-auto flex flex-col items-center justify-center pt-12 pb-28 text-center">
            {/* Background radial glow */}
            <div className="pointer-events-none absolute inset-0 bg-radial from-emerald-950/20 via-zinc-950/80 to-zinc-950" />

            <div className="relative z-10 space-y-4">
              {/* Simulated Video Avatar Portrait with active ring */}
              <div className="relative mx-auto size-28 sm:size-36">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-60 blur-xs" />
                <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-emerald-400/80 bg-zinc-900 shadow-xl">
                  <Avatar className="size-full">
                    <AvatarFallback className="bg-zinc-900 text-xl font-bold text-emerald-400 sm:text-2xl">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="absolute right-2 bottom-2 size-4 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
              </div>

              {/* Provider Live Status Title */}
              <div className="space-y-1">
                <h3 className="text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">
                  Dr. Sarah Jenkins, MD
                </h3>
                <p className="text-xs text-zinc-400">
                  Department of Cardiovascular Medicine · Clinical Telehealth Encounter
                </p>
              </div>

              {/* Video Stream Diagnostic Watermark */}
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 font-mono text-xs text-zinc-400">
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate">Session: #TH-9021-TX</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden truncate sm:inline">Latency: 24ms (0% loss)</span>
              </div>
            </div>
          </div>

          {/* Picture-in-Picture Self Video Tile (Patient View - Bottom Right) */}
          <div className="absolute right-4 bottom-20 z-20 aspect-video w-36 overflow-hidden rounded-xl border-2 border-zinc-700/80 bg-zinc-900 shadow-sm transition-all sm:right-6 sm:bottom-20 sm:w-48">
            {!isCameraOff ? (
              <div className="relative flex size-full flex-col justify-between bg-gradient-to-b from-zinc-800 to-zinc-950 p-2 text-white">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-zinc-700 bg-zinc-900/80 px-1 py-0 text-xs text-zinc-300">
                    You (720p)
                  </Badge>
                  <div
                    className={`flex size-4 items-center justify-center rounded-full ${
                      isMuted ? 'bg-destructive text-white' : 'bg-emerald-500/80 text-white'
                    }`}
                  >
                    {isMuted ? <MicOff className="size-2.5" /> : <Mic className="size-2.5" />}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Avatar className="size-5">
                    <AvatarFallback className="bg-zinc-700 text-xs font-bold text-zinc-100">DC</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs font-medium text-zinc-200">David Chen</span>
                </div>
              </div>
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1 bg-zinc-950 p-2 text-center text-zinc-400">
                <VideoOff className="size-4 text-zinc-500" />
                <span className="text-xs font-medium">Camera Off</span>
              </div>
            )}
          </div>

          {/* Floating Call Controls Bar (Bottom Center) */}
          <div className="z-20 flex items-center justify-center pt-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-zinc-700/70 bg-zinc-900/90 p-2 shadow-sm backdrop-blur-md sm:gap-2 sm:px-4">
              {/* Mute / Unmute Button */}
              <Button
                variant={isMuted ? 'destructive' : 'secondary'}
                size="icon"
                className="size-9 rounded-full sm:size-10"
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4 text-emerald-400" />}
              </Button>

              {/* Video On / Off Button */}
              <Button
                variant={isCameraOff ? 'destructive' : 'secondary'}
                size="icon"
                className="size-9 rounded-full sm:size-10"
                aria-label={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
                onClick={() => setIsCameraOff(!isCameraOff)}
              >
                {isCameraOff ? <VideoOff className="size-4" /> : <Video className="size-4 text-emerald-400" />}
              </Button>

              {/* Screen Share Button */}
              <Button
                variant={isScreenSharing ? 'default' : 'secondary'}
                size="icon"
                className="size-9 rounded-full sm:size-10"
                aria-label={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <Share2 className="size-4" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-6 bg-zinc-700" />

              {/* Tab Quick Toggle Buttons */}
              <Button
                variant={isSidebarOpen && activeTab === 'notes' ? 'default' : 'secondary'}
                size="sm"
                className="h-9 gap-1.5 rounded-full px-3 text-xs sm:h-10 sm:px-3.5"
                onClick={() => handleOpenTab('notes')}
              >
                <FileText className="size-3.5" />
                <span className="hidden sm:inline">SOAP Notes</span>
              </Button>

              <Button
                variant={isSidebarOpen && activeTab === 'chat' ? 'default' : 'secondary'}
                size="sm"
                className="relative h-9 gap-1.5 rounded-full px-3 text-xs sm:h-10 sm:px-3.5"
                onClick={() => handleOpenTab('chat')}
              >
                <MessageSquare className="size-3.5" />
                <span className="hidden sm:inline">In-Call Chat</span>
                {!isSidebarOpen && unreadChatCount > 0 && (
                  <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-xs font-bold">
                    {unreadChatCount}
                  </span>
                )}
              </Button>

              <Button
                variant={isSidebarOpen && activeTab === 'vitals' ? 'default' : 'secondary'}
                size="sm"
                className="h-9 gap-1.5 rounded-full px-3 text-xs sm:h-10 sm:px-3.5"
                onClick={() => handleOpenTab('vitals')}
              >
                <HeartPulse className="size-3.5 text-rose-400" />
                <span className="hidden sm:inline">Vitals</span>
              </Button>

              <Separator orientation="vertical" className="mx-1 h-6 bg-zinc-700" />

              {/* Device Settings Toggle */}
              <Button
                variant="secondary"
                size="icon"
                className="size-9 rounded-full sm:size-10"
                aria-label="Audio and Video Settings"
                onClick={() => setShowSettingsModal(!showSettingsModal)}
              >
                <Settings className="size-4 text-zinc-300" />
              </Button>

              {/* Expand / Collapse Sidebar Toggle */}
              <Button
                variant="secondary"
                size="icon"
                className="size-9 rounded-full sm:size-10"
                aria-label={isSidebarOpen ? 'Collapse side workspace' : 'Open side workspace'}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <PanelRightClose className="size-4 text-zinc-300" />
                ) : (
                  <PanelRightOpen className="size-4 text-zinc-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Settings Flyout / Drawer Banner */}
          {showSettingsModal && (
            <div className="bg-card text-card-foreground absolute top-16 right-4 z-30 w-72 rounded-xl border p-4 shadow-xl">
              <div className="flex items-center justify-between pb-2">
                <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">AV Devices & HIPAA</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  aria-label="Close settings modal"
                  onClick={() => setShowSettingsModal(false)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="text-muted-foreground block font-medium">Microphone</label>
                  <div className="text-foreground mt-0.5 rounded border p-1.5 font-mono text-xs">
                    Default - MacBook Pro Mic (CoreAudio)
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground block font-medium">Camera</label>
                  <div className="text-foreground mt-0.5 rounded border p-1.5 font-mono text-xs">
                    FaceTime HD Camera (1080p)
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground block font-medium">Speaker Output</label>
                  <div className="text-foreground mt-0.5 rounded border p-1.5 font-mono text-xs">
                    Studio Display Speakers
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Side Workspace (Right 1/3 when open) */}
        {isSidebarOpen && (
          <aside className="bg-card flex flex-col overflow-hidden rounded-xl border shadow-xs lg:col-span-4 xl:col-span-4">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'notes' | 'chat' | 'vitals')}
              className="flex h-full flex-col"
            >
              {/* Workspace Tab Navigation Header */}
              <div className="bg-muted/30 flex items-center justify-between border-b px-3 py-2.5">
                <TabsList className="grid h-8 w-full max-w-[320px] grid-cols-3">
                  <TabsTrigger value="notes" className="gap-1 text-xs font-medium">
                    <FileText className="size-3" />
                    <span>Notes & Rx</span>
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="gap-1 text-xs font-medium">
                    <MessageSquare className="size-3" />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="vitals" className="gap-1 text-xs font-medium">
                    <HeartPulse className="size-3 text-rose-500" />
                    <span>Vitals</span>
                  </TabsTrigger>
                </TabsList>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground ml-1 size-8"
                  aria-label="Close sidebar"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <PanelRightClose className="size-4" />
                </Button>
              </div>

              {/* TAB 1: Clinical Notes & Rx */}
              <TabsContent value="notes" className="flex-1 space-y-4 overflow-y-auto p-4 focus-visible:outline-none">
                {/* Patient Demographics Pill Strip */}
                <div className="bg-muted/40 space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">DC</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-foreground text-xs font-bold">David Chen</span>
                        <span className="text-muted-foreground ml-1 text-xs">44y · Male</span>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs font-normal">
                      Allergy: Penicillin
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-1 border-t pt-2 text-xs">
                    <span>DOB: 05/14/1982</span>
                    <span>Pharmacy: CVS #4021 (Austin)</span>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <AlertCircle className="size-3.5 text-amber-500" />
                    Chief Complaint
                  </label>
                  <div className="bg-muted/20 text-foreground rounded-lg border p-2.5 text-xs leading-relaxed">
                    {chiefComplaint}
                  </div>
                </div>

                {/* SOAP Documentation Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      SOAP Encounter Note
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">ICD-10: I47.1</span>
                  </div>

                  {/* S: Subjective */}
                  <div className="bg-card space-y-1 rounded-lg border p-3">
                    <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                      <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs">
                        S
                      </span>
                      <span>Subjective</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{soapSubjective}</p>
                  </div>

                  {/* O: Objective */}
                  <div className="bg-card space-y-1 rounded-lg border p-3">
                    <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                      <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs">
                        O
                      </span>
                      <span>Objective (Telemetry & Exam)</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{soapObjective}</p>
                  </div>

                  {/* A: Assessment */}
                  <div className="bg-card space-y-1 rounded-lg border p-3">
                    <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                      <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs">
                        A
                      </span>
                      <span>Assessment & Differential</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
                      {soapAssessment}
                    </p>
                  </div>

                  {/* P: Plan (Editable) */}
                  <div className="bg-card space-y-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                        <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs">
                          P
                        </span>
                        <span>Clinical Plan & Orders</span>
                      </div>
                      <span className="text-muted-foreground text-xs">Editable</span>
                    </div>
                    <Textarea
                      value={soapPlan}
                      onValueChange={(v) => setSoapPlan(v)}
                      rows={3}
                      className="resize-y text-xs leading-relaxed"
                      placeholder="Enter medical orders, follow-up recommendations..."
                    />
                  </div>
                </div>

                {/* Quick e-Prescription Generator */}
                <Card className="border-primary/30 shadow-xs">
                  <CardHeader className="px-3.5 pt-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                        <Pill className="text-primary size-3.5" />
                        Electronic Prescription (e-Rx)
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        NPI #1894021
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Generate and electronically sign DEA-compliant prescription
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-3.5 pb-3">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-xs font-medium">Select Medication</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {drugOptions.map((drug) => (
                          <Button
                            key={drug.id}
                            type="button"
                            variant={selectedDrugPreset === drug.id ? 'default' : 'outline'}
                            size="sm"
                            className="h-7 justify-start truncate px-2 text-xs"
                            onClick={() => handleSelectDrugPreset(drug.id)}
                          >
                            {drug.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-muted-foreground text-xs">Dosage & Frequency</label>
                        <Input
                          value={customDosage}
                          onChange={(e) => setCustomDosage(e.target.value)}
                          className="h-7 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-muted-foreground text-xs">Quantity & Refills</label>
                        <Input
                          value={customQuantity}
                          onChange={(e) => setCustomQuantity(e.target.value)}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>

                    {rxSuccessMessage && (
                      <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5 shrink-0" />
                        <span>{rxSuccessMessage}</span>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full gap-1.5 text-xs font-semibold"
                      onClick={handleGeneratePrescription}
                    >
                      <FileCheck className="size-3.5" />
                      <span>Sign & Transmit e-Rx to Pharmacy</span>
                    </Button>

                    {/* Encounter Prescriptions History */}
                    {prescriptions.length > 0 && (
                      <div className="space-y-1.5 border-t pt-1">
                        <span className="text-muted-foreground text-xs font-medium">
                          Active Prescriptions this Visit:
                        </span>
                        {prescriptions.map((rx) => (
                          <div key={rx.id} className="bg-muted/30 space-y-1 rounded border p-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-foreground font-semibold">{rx.drugName}</span>
                              <Badge
                                variant="outline"
                                className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                              >
                                {rx.status === 'transmitted' ? 'Transmitted' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {rx.dosage} · {rx.quantity} (Refills: {rx.refills})
                            </p>
                            <p className="text-muted-foreground font-mono text-xs">
                              {rx.pharmacy} · {rx.rxNumber}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 2: In-Call Chat */}
              <TabsContent value="chat" className="flex h-[460px] flex-col focus-visible:outline-none">
                {/* HIPAA Banner */}
                <div className="flex items-center gap-2 border-b bg-emerald-500/10 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Encrypted Consultation Chat · Archived in EHR Audit Log</span>
                </div>

                {/* Messages List */}
                <div className="flex-1 space-y-3.5 overflow-y-auto p-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 text-xs ${
                        msg.sender === 'patient' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="text-muted-foreground flex items-center gap-1.5 px-1 text-xs">
                        <span>{msg.senderName}</span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed shadow-xs ${
                          msg.sender === 'patient'
                            ? 'bg-primary text-primary-foreground rounded-br-xs'
                            : 'bg-muted text-foreground rounded-bl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Attachment preview if present */}
                        {msg.attachment && (
                          <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-black/10 p-2 text-xs">
                            <div className="flex min-w-0 items-center gap-2">
                              <FileText className="size-4 shrink-0" />
                              <div className="min-w-0">
                                <p className="truncate font-medium">{msg.attachment.name}</p>
                                <p className="text-xs opacity-80">{msg.attachment.size}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 shrink-0 text-current hover:bg-white/10"
                              aria-label="Download attachment"
                            >
                              <Download className="size-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Composer */}
                <div className="bg-muted/20 space-y-2 border-t p-3">
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type encrypted message to Dr. Jenkins..."
                      className="h-8 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8 shrink-0"
                      aria-label="Attach clinical file"
                    >
                      <Paperclip className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 shrink-0 gap-1 px-3 text-xs"
                      disabled={!chatInput.trim()}
                      onClick={handleSendMessage}
                    >
                      <Send className="size-3.5" />
                      <span>Send</span>
                    </Button>
                  </div>
                  <div className="text-muted-foreground flex items-center justify-between px-1 text-xs">
                    <span>Press Enter to send</span>
                    <span>BAA Encrypted</span>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: Patient Vitals & Telemetry */}
              <TabsContent value="vitals" className="flex-1 space-y-4 overflow-y-auto p-4 focus-visible:outline-none">
                {/* Telemetry Stream Banner */}
                <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <div>
                      <h4 className="text-foreground text-xs font-bold">Live Telemetry Feed</h4>
                      <p className="text-muted-foreground text-xs">BLE Medical Hub · Updated {lastVitalsUpdate}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    disabled={isRefreshingVitals}
                    onClick={handleRefreshVitals}
                  >
                    <RefreshCw className={`size-3 ${isRefreshingVitals ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </Button>
                </div>

                {/* Vitals Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Blood Pressure */}
                  <Card className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-semibold">Blood Pressure</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        Normal
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-mono text-xl font-bold tracking-tight">128/82</span>
                        <span className="text-muted-foreground text-xs">mmHg</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">Target: &lt;130/85 mmHg</p>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                      <span>Smart Cuff</span>
                      <span className="text-foreground font-medium">MAP: 97</span>
                    </div>
                  </Card>

                  {/* Heart Rate */}
                  <Card className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                        <Heart className="size-3 text-rose-500" />
                        Heart Rate
                      </span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        NSR
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-mono text-xl font-bold tracking-tight">74</span>
                        <span className="text-muted-foreground text-xs">bpm</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">Resting (Range: 68-88)</p>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                      <span>Rhythm: Sinus</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">Regular</span>
                    </div>
                  </Card>

                  {/* Oxygen Saturation (SpO2) */}
                  <Card className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-semibold">Oxygen (SpO2)</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        Optimal
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-mono text-xl font-bold tracking-tight">98%</span>
                        <span className="text-muted-foreground text-xs">Ambient</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">Room Air (FiO2 21%)</p>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                      <span>PulseOx Probe</span>
                      <span className="text-foreground font-medium">PI: 4.8%</span>
                    </div>
                  </Card>

                  {/* Body Temperature */}
                  <Card className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                        <Thermometer className="size-3 text-amber-500" />
                        Temperature
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Afebrile
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-mono text-xl font-bold tracking-tight">98.4°</span>
                        <span className="text-muted-foreground text-xs">F</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">36.9°C (Temporal Scan)</p>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                      <span>Scanner Hub</span>
                      <span className="text-foreground font-medium">Normal</span>
                    </div>
                  </Card>

                  {/* Respiration Rate */}
                  <Card className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-semibold">Respiration</span>
                      <Badge variant="secondary" className="text-xs">
                        Eupneic
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-mono text-xl font-bold tracking-tight">16</span>
                        <span className="text-muted-foreground text-xs">br/min</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">Range: 12-20 normal</p>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                      <span>Chest Sensor</span>
                      <span className="text-foreground font-medium">Steady</span>
                    </div>
                  </Card>

                  {/* Fasting Blood Glucose */}
                  <Card className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-semibold">Glucose</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        Normal
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-mono text-xl font-bold tracking-tight">94</span>
                        <span className="text-muted-foreground text-xs">mg/dL</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">Fasting 3.5h post-meal</p>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-1.5 text-xs">
                      <span>Continuous CGM</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">In Range</span>
                    </div>
                  </Card>
                </div>

                {/* Physician Vitals Summary */}
                <div className="bg-muted/20 space-y-1.5 rounded-lg border p-3 text-xs">
                  <div className="text-foreground flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    <span>Physician Baseline Parameter Assessment</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    All live telemetry telemetry values remain within normal hemodynamic thresholds. Patient exhibits no
                    signs of acute decompensation or malignant arrhythmias during the video encounter.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </aside>
        )}
      </div>
    </div>
  )
}

export default TelehealthVideoRoom
