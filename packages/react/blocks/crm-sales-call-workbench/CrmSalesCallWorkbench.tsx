'use client'

import * as React from 'react'
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Disc,
  ExternalLink,
  FileCheck,
  FileText,
  Layers,
  Lock,
  Mic,
  MicOff,
  MoreVertical,
  Pause,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Save,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface ActionItem {
  id: string
  text: string
  completed: boolean
  dueDate: string
  assignee: string
}

// 32-bar audio spectrum waveform bars
const waveformBars = [
  32, 48, 65, 42, 78, 92, 84, 66, 52, 74, 96, 82, 60, 44, 58, 88, 100, 76, 62, 48, 72, 94, 80, 68, 54, 42, 68, 86, 72,
  52, 38, 28,
]

export function CrmSalesCallWorkbench() {
  // Interactive Call State
  const [isMuted, setIsMuted] = React.useState(false)
  const [isOnHold, setIsOnHold] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(true)
  const [isCallEnded, setIsCallEnded] = React.useState(false)
  const [callDurationSeconds, setCallDurationSeconds] = React.useState(522) // 08m:42s
  const [copiedTalkingPoints, setCopiedTalkingPoints] = React.useState(false)
  const [isSyncedCrm, setIsSyncedCrm] = React.useState(false)
  const [newItemText, setNewItemText] = React.useState('')

  // CRM Deal Notes State
  const [dealNotes, setDealNotes] = React.useState(
    'David Chen (VP of Eng) confirmed Acme Corp has 40 micro-frontends facing frequent dependency breakages (~12 eng hrs/week maintenance debt). Highly receptive to UIPKGE zero-dependency registry model. Key decision factor: SOC2 Type II compliance and DPA sign-off. Deal size: 500 seats ($180k ARR). Target close: Q3 end.',
  )

  // Next Steps Checklist State
  const [actionItems, setActionItems] = React.useState<ActionItem[]>([
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

  // Timer Effect
  React.useEffect(() => {
    if (isCallEnded || isOnHold) return
    const interval = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isCallEnded, isOnHold])

  const formattedDuration = React.useMemo(() => {
    const mins = Math.floor(callDurationSeconds / 60)
    const secs = callDurationSeconds % 60
    return `${mins.toString().padStart(2, '0')}m:${secs.toString().padStart(2, '0')}s`
  }, [callDurationSeconds])

  function handleEndCall() {
    setIsCallEnded(true)
  }

  function handleReconnectCall() {
    setIsCallEnded(false)
    setCallDurationSeconds(0)
  }

  function handleCopyTalkingPoints() {
    setCopiedTalkingPoints(true)
    setTimeout(() => {
      setCopiedTalkingPoints(false)
    }, 2500)
  }

  function handleSyncCrm() {
    setIsSyncedCrm(true)
    setTimeout(() => {
      setIsSyncedCrm(false)
    }, 3500)
  }

  function handleAddActionItem() {
    const text = newItemText.trim()
    if (!text) return
    setActionItems((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        text,
        completed: false,
        dueDate: 'Next Week',
        assignee: 'Elena Rostova',
      },
    ])
    setNewItemText('')
  }

  function handleToggleStep(id: string) {
    setActionItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  function handleAppendTag(tag: string) {
    if (!dealNotes.includes(tag)) {
      setDealNotes((prev) => `${prev}\n[Tag: ${tag}]`)
    }
  }

  return (
    <div data-slot="crm-sales-call-workbench" className="bg-background text-foreground w-full space-y-4">
      {/* Top Header Bar */}
      <header className="bg-card rounded-xl border p-4 shadow-xs sm:px-6 sm:py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Call Metadata Strip */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Status Indicator & Timer */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="relative flex size-3">
                {!isCallEnded && !isOnHold && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex size-3 rounded-full ${
                    isCallEnded ? 'bg-zinc-400' : isOnHold ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-tight">
                <Clock className="text-muted-foreground size-3.5" />
                <span className="tabular-nums">
                  {isCallEnded
                    ? 'Call Ended'
                    : isOnHold
                      ? 'Call On Hold'
                      : `Live Call in Progress · ${formattedDuration}`}
                </span>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden h-5 sm:block" />

            {/* Customer Name & Role */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Avatar className="size-7 border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">DC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-foreground text-xs font-bold sm:text-sm">David Chen</span>
                <span className="text-muted-foreground text-xs">VP of Engineering at Acme Corp</span>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden h-5 md:block" />

            {/* Phone & Carrier Strip */}
            <div className="hidden items-center gap-2 md:flex">
              <Badge variant="outline" className="gap-1.5 font-mono text-xs font-medium">
                <Phone className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>+1 (415) 555-0192</span>
              </Badge>
              <Badge variant="secondary" className="text-xs font-normal">
                Acme Corp · 500 Seats ($180k ARR)
              </Badge>
            </div>
          </div>

          {/* Header Actions: End Call / Sync */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-muted-foreground hidden items-center gap-1.5 text-xs lg:flex">
              <Radio className="size-3.5 text-emerald-500" />
              <span className="font-mono text-xs">Opus HD · 14ms Latency</span>
            </div>

            {!isCallEnded ? (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs"
                onClick={handleEndCall}
              >
                <PhoneOff className="size-3.5" />
                <span>End Call & Log to CRM</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs"
                onClick={handleReconnectCall}
              >
                <RefreshCw className="size-3.5" />
                <span>Reconnect Call</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 2-Column Call Workspace Grid (60% Left / 40% Right) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Panel: Live Audio Visualizer & Real-Time AI Transcript (60% -> 7 Cols) */}
        <div className="space-y-4 lg:col-span-7 xl:col-span-7">
          {/* Audio Dialing Canvas */}
          <section className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-white shadow-lg">
            {/* Top Overlay: Speaker Status & WebRTC Specs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Active Speaker Info */}
              <div className="flex flex-wrap items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 backdrop-blur-xs">
                <div className="relative">
                  <Avatar className="size-8 border border-emerald-500/60">
                    <AvatarFallback className="bg-zinc-800 text-xs font-bold text-emerald-400">DC</AvatarFallback>
                  </Avatar>
                  {!isCallEnded && !isOnHold && (
                    <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-100">David Chen</span>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/20 px-1 py-0 text-xs text-emerald-300"
                    >
                      Speaking
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Mic className="size-3 text-emerald-400" />
                    <span>Acme Corp · Audio Level: -14 dB</span>
                  </div>
                </div>
              </div>

              {/* Call Encryption & Recording Status */}
              <div className="flex flex-wrap items-center gap-2">
                {isRecording && (
                  <div className="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/15 px-2.5 py-1 text-xs text-rose-300">
                    <span className="size-2 animate-pulse rounded-full bg-rose-500" />
                    <span className="font-mono text-xs font-semibold">REC 08:42</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span className="font-mono text-xs">WebRTC AES-256</span>
                </div>
              </div>
            </div>

            {/* Live 32-Bar Audio Waveform Visualizer */}
            <div className="my-6 flex flex-col items-center justify-center space-y-3">
              <div className="flex h-24 w-full items-center justify-between gap-1 px-1 sm:gap-1.5 sm:px-4">
                {waveformBars.map((bar, index) => {
                  const barHeight = isCallEnded ? '8%' : isOnHold ? '16%' : `${bar}%`
                  const isBarMuted = isMuted && index % 2 === 0
                  return (
                    <div
                      key={index}
                      className={`w-full max-w-[8px] rounded-full transition-all duration-200 ${
                        isCallEnded
                          ? 'h-2 bg-zinc-800'
                          : isOnHold
                            ? 'h-3 bg-amber-500/60'
                            : isBarMuted
                              ? 'h-2 bg-zinc-700'
                              : 'bg-gradient-to-t from-emerald-500 to-teal-300'
                      } ${!isCallEnded && !isOnHold && !isMuted ? 'animate-pulse' : ''}`}
                      style={{
                        height: barHeight,
                        animationDelay: `${(index % 8) * 120}ms`,
                        animationDuration: '1.2s',
                      }}
                    />
                  )
                })}
              </div>

              {/* Frequency Scale & Stream Diagnostics */}
              <div className="flex w-full items-center justify-between px-2 font-mono text-xs text-zinc-500 sm:px-6">
                <span className="shrink-0 whitespace-nowrap">-48 dB</span>
                <span className="min-w-0 text-center text-zinc-400">
                  32-Band AI Audio Spectrum · Real-time Voice Detection
                </span>
                <span className="shrink-0 whitespace-nowrap">0 dB</span>
              </div>
            </div>

            {/* Audio Controls Bar */}
            <div className="flex items-center justify-center pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 p-1.5 shadow-xl sm:px-4 sm:py-2">
                {/* Mute Button */}
                <Button
                  variant={isMuted ? 'destructive' : 'secondary'}
                  size="sm"
                  className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5 text-emerald-400" />}
                  <span>{isMuted ? 'Muted' : 'Mute Mic'}</span>
                </Button>

                {/* Hold Call Button */}
                <Button
                  variant={isOnHold ? 'default' : 'secondary'}
                  size="sm"
                  className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
                  onClick={() => setIsOnHold(!isOnHold)}
                >
                  {isOnHold ? <Play className="size-3.5 text-amber-400" /> : <Pause className="size-3.5" />}
                  <span>{isOnHold ? 'Resume Call' : 'Hold Call'}</span>
                </Button>

                {/* Transfer Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium text-zinc-200"
                >
                  <PhoneForwarded className="size-3.5 text-zinc-400" />
                  <span>Transfer</span>
                </Button>

                {/* Record Toggle Button */}
                <Button
                  variant={isRecording ? 'destructive' : 'secondary'}
                  size="sm"
                  className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Disc className={`size-3.5 ${isRecording ? 'animate-spin' : ''}`} />
                  <span>{isRecording ? 'Recording' : 'Record'}</span>
                </Button>
              </div>
            </div>
          </section>

          {/* Real-Time AI Live Speech Transcript */}
          <Card className="shadow-xs">
            <CardHeader className="border-b px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <CardTitle className="flex flex-wrap items-center gap-2 text-sm font-bold">
                    <Sparkles className="text-primary size-4" />
                    <span>Real-Time AI Live Speech Transcript</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Deepgram Nova-2 STT · Real-time diarization & sentiment detection
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Live Diarization</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-4 sm:p-5">
              {/* Turn 1: Elena Rostova */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">ER</AvatarFallback>
                    </Avatar>
                    <span className="text-foreground text-xs font-bold">Elena Rostova</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      Account Executive (You)
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-blue-500/30 bg-blue-500/10 text-xs text-blue-700 dark:text-blue-400"
                    >
                      Discovery
                    </Badge>
                    <span className="text-muted-foreground font-mono text-xs">08:12</span>
                  </div>
                </div>
                <div className="bg-muted/30 text-foreground rounded-lg border p-3 text-xs leading-relaxed">
                  "Thanks for walking us through your current build setup, David. You mentioned earlier that team
                  velocity slowed down during the last framework migration. How is that impacting your Q3 delivery
                  milestones?"
                </div>
              </div>

              {/* Turn 2: David Chen (Objection) */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
                        DC
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground text-xs font-bold">David Chen</span>
                    <Badge variant="secondary" className="text-xs font-normal">
                      Prospect (Acme Corp)
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
                    >
                      Budget Hesitation
                    </Badge>
                    <span className="text-muted-foreground font-mono text-xs">08:24</span>
                  </div>
                </div>
                <div className="bg-muted/30 text-foreground space-y-2 rounded-lg border p-3 text-xs leading-relaxed">
                  <p>
                    "Right now we're spending around 12 engineering hours a week just fixing broken dependency cascades
                    across 40 micro-frontends whenever upstream packages release major semver bumps. We want to
                    standardize, but leadership is wary of signing another 6-figure SaaS vendor contract this quarter."
                  </p>
                  {/* AI Extracted Entities */}
                  <div className="flex flex-wrap items-center gap-1.5 border-t pt-2 text-xs">
                    <span className="text-muted-foreground font-medium">AI Entities:</span>
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400">
                      40 micro-frontends
                    </span>
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400">
                      12 eng hrs/wk debt
                    </span>
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400">
                      Objection: 6-figure SaaS cost
                    </span>
                  </div>
                </div>
              </div>

              {/* Turn 3: Elena Rostova (Value Prop) */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">ER</AvatarFallback>
                    </Avatar>
                    <span className="text-foreground text-xs font-bold">Elena Rostova</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      Account Executive (You)
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                    >
                      Value Proposition
                    </Badge>
                    <span className="text-muted-foreground font-mono text-xs">08:31</span>
                  </div>
                </div>
                <div className="bg-muted/30 text-foreground rounded-lg border p-3 text-xs leading-relaxed">
                  "That makes total sense. With UIPKGE's registry distribution model, your engineers copy the exact
                  source code directly into your own repositories. You own the code completely, eliminate runtime npm
                  lock-in, and never deal with breaking semver upgrades again."
                </div>
              </div>

              {/* Turn 4: David Chen (Buying Signal) */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        DC
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground text-xs font-bold">David Chen</span>
                    <Badge variant="secondary" className="text-xs font-normal">
                      Prospect (Acme Corp)
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/15 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                    >
                      Positive Intent
                    </Badge>
                    <span className="text-muted-foreground font-mono text-xs">08:42</span>
                  </div>
                </div>
                <div className="bg-muted/30 text-foreground space-y-2 rounded-lg border p-3 text-xs leading-relaxed">
                  <p>
                    "That would honestly solve our biggest compliance and dependency audit headache. If we can verify
                    SOC2 Type II and get our SecOps team to review your DPA, we'd be ready to proceed with a 500-seat
                    Enterprise rollout next month."
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      <span className="font-medium">Buying Signal: 500 seats ($180k ARR) pending SOC2 & DPA</span>
                    </div>
                    <span className="text-muted-foreground text-xs">AI Confidence: 99.4%</span>
                  </div>
                </div>
              </div>

              {/* Active Live Listening Indicator */}
              <div className="bg-muted/20 flex items-center justify-between rounded-lg border border-dashed p-3 text-xs">
                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-foreground font-medium">Real-time speech stream active...</span>
                  <span>listening to David Chen</span>
                </div>
                <span className="text-muted-foreground font-mono text-xs">Deepgram Nova-2 STT</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: AI Battlecards & CRM Note Logger (40% -> 5 Cols) */}
        <div className="space-y-4 lg:col-span-5 xl:col-span-5">
          {/* Real-Time AI Objection Handling Battlecard */}
          <Card className="border-primary/40 from-primary/5 via-card to-card bg-gradient-to-br shadow-xs">
            <CardHeader className="px-4 pt-4 pb-2 sm:px-5">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary gap-1.5 text-xs font-semibold"
                >
                  <Sparkles className="text-primary size-3" />
                  <span>AI Battlecard · Live Trigger</span>
                </Badge>
                <span className="text-muted-foreground font-mono text-xs">Confidence: 98%</span>
              </div>
              <CardTitle className="text-foreground pt-1.5 text-sm font-bold">
                Competitor / Pricing Objection: Legacy NPM Packages
              </CardTitle>
              <CardDescription className="text-xs">
                Triggered by mention of 6-figure SaaS vendor fatigue & dependency cascades
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 px-4 pb-4 sm:px-5">
              {/* AI Counter-Points List */}
              <div className="bg-card space-y-2.5 rounded-lg border p-3 text-xs">
                <div className="text-foreground flex items-center gap-1.5 font-bold">
                  <Zap className="text-primary size-3.5" />
                  <span>Recommended Response Points:</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="bg-primary/20 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      1
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground font-semibold">Zero-Dependency Ownership:</strong> Code is
                      copied directly into Acme's repos via CLI (
                      <code className="text-foreground bg-muted rounded px-1">npx shadcn-vue add</code>). Zero npm
                      runtime lock-in.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="bg-primary/20 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      2
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground font-semibold">Eliminate Upgrade Cascades:</strong> Reclaim the
                      12 hrs/week engineering maintenance debt David mentioned.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="bg-primary/20 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      3
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground font-semibold">Fast Enterprise ROI:</strong> Predictable team
                      seat license pays for itself in under 3 weeks of reclaimed developer hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Copy Talking Points Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs font-semibold"
                onClick={handleCopyTalkingPoints}
              >
                {copiedTalkingPoints ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>
                  {copiedTalkingPoints ? 'Talking Points Copied to Clipboard!' : 'Copy Talking Points to Clipboard'}
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Deal Notes Textarea */}
          <Card className="shadow-xs">
            <CardHeader className="px-4 pt-4 pb-2 sm:px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
                  <FileText className="text-primary size-4" />
                  <span>Quick Deal Notes</span>
                </CardTitle>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Synced with Salesforce</span>
                </div>
              </div>
              <CardDescription className="text-xs">
                Live call documentation synced to Opportunity #ACME-9481
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 px-4 pb-4 sm:px-5">
              <Textarea
                value={dealNotes}
                onValueChange={(v) => setDealNotes(v)}
                rows={4}
                className="resize-y text-xs leading-relaxed"
                placeholder="Enter call notes, key customer requirements, and objections..."
              />

              {/* Quick Append Tags */}
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-xs font-medium">Quick Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleAppendTag('SOC2-Security')}
                  >
                    + #soc2-security
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleAppendTag('500-Seats')}
                  >
                    + #500-seats
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleAppendTag('DPA-Review')}
                  >
                    + #dpa-review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleAppendTag('Q3-Close')}
                  >
                    + #q3-close
                  </Button>
                </div>
              </div>

              {/* Opportunity Metrics Strip */}
              <div className="bg-muted/30 grid grid-cols-3 gap-2 rounded-lg border p-2.5 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-xs">Deal Value</span>
                  <span className="text-foreground font-mono font-bold">$180,000</span>
                </div>
                <div className="border-x">
                  <span className="text-muted-foreground block text-xs">Stage</span>
                  <span className="text-foreground font-semibold">Negotiation</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Win Prob.</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Checklist */}
          <Card className="shadow-xs">
            <CardHeader className="px-4 pt-4 pb-2 sm:px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
                  <CheckCircle2 className="text-primary size-4" />
                  <span>Next Steps Checklist</span>
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {actionItems.filter((i) => i.completed).length}/{actionItems.length} Done
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Action items committed during call. Checked items auto-create CRM tasks.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 px-4 pb-4 sm:px-5">
              <div className="space-y-2">
                {actionItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-muted/20 hover:bg-muted/40 flex items-start gap-2.5 rounded-lg border p-2.5 transition-colors"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => handleToggleStep(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor={item.id}
                        className={`cursor-pointer text-xs font-medium select-none ${
                          item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                        }`}
                      >
                        {item.text}
                      </label>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                        <span>{item.dueDate}</span>
                        <span>·</span>
                        <span>{item.assignee}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add custom action item..."
                  className="h-8 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddActionItem()
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 shrink-0 px-3 text-xs"
                  disabled={!newItemText.trim()}
                  onClick={handleAddActionItem}
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Sync Button */}
              <div className="border-t pt-2">
                <Button size="sm" className="w-full gap-1.5 text-xs font-semibold shadow-xs" onClick={handleSyncCrm}>
                  {isSyncedCrm ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
                  <span>{isSyncedCrm ? 'Call Summary & Tasks Logged to CRM!' : 'Log Call & Sync CRM Record'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
