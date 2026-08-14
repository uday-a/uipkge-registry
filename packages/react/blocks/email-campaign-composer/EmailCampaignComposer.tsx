'use client'

import * as React from 'react'
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Eye,
  Flame,
  Inbox,
  Lock,
  Mail,
  Monitor,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Split,
  Terminal,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export interface EmailCampaignComposerProps {
  className?: string
}

type ViewportMode = 'desktop' | 'mobile'
type ClientOption = 'all' | 'gmail' | 'apple' | 'outlook'
type ScheduleTiming = 'optimal' | 'immediate' | 'custom'

interface AudienceSegment {
  id: string
  label: string
  count: number
  formattedCount: string
  openRate: string
  clickRate: string
  deliverability: string
}

const audienceOptions: AudienceSegment[] = [
  {
    id: 'active-devs',
    label: 'All Active Developers (42,500 subscribers)',
    count: 42500,
    formattedCount: '42.5k',
    openRate: '38.4%',
    clickRate: '12.2%',
    deliverability: '99.9%',
  },
  {
    id: 'tech-leads',
    label: 'Enterprise Tech Leads (8,200 subscribers)',
    count: 8200,
    formattedCount: '8.2k',
    openRate: '46.1%',
    clickRate: '18.5%',
    deliverability: '99.8%',
  },
  {
    id: 'free-users',
    label: 'Free Plan Users (28,000 subscribers)',
    count: 28000,
    formattedCount: '28.0k',
    openRate: '31.2%',
    clickRate: '8.9%',
    deliverability: '99.7%',
  },
]

const aiSuggestions = [
  {
    text: '🚀 Introducing UIPKGE 2.0: The unbundled UI registry',
    score: 94,
    tag: 'High Open Rate Impact',
  },
  {
    text: 'Ship polished UIs 10x faster with UIPKGE 2.0 ⚡',
    score: 92,
    tag: 'Strong Action Verb',
  },
  {
    text: 'Zero npm dependencies: How UIPKGE 2.0 changes frontend dev',
    score: 89,
    tag: 'Curiosity Spike',
  },
]

export function EmailCampaignComposer({ className }: EmailCampaignComposerProps) {
  // Campaign state
  const [campaignName] = React.useState('Product Launch: UIPKGE 2.0 Global Release')
  const [selectedAudience, setSelectedAudience] = React.useState('active-devs')

  // Subject line & Preheader state
  const [subjectA, setSubjectA] = React.useState('🚀 Introducing UIPKGE 2.0: The unbundled UI registry')
  const [subjectB, setSubjectB] = React.useState('Ship polished UIs 10x faster with UIPKGE 2.0 ⚡')
  const [previewText, setPreviewText] = React.useState(
    '370+ production components with zero npm dependencies. Native Vue 3 & React code.',
  )
  const senderName = 'UIPKGE Team'
  const senderEmail = 'updates@uipkge.dev'

  // A/B testing state
  const [isAbTestEnabled, setIsAbTestEnabled] = React.useState(false)
  const [activePreviewVariant, setActivePreviewVariant] = React.useState<'A' | 'B'>('A')

  // Viewport state
  const [viewport, setViewport] = React.useState<ViewportMode>('desktop')

  // Test Proof Dialog state
  const [isTestModalOpen, setIsTestModalOpen] = React.useState(false)
  const [testTargetEmail, setTestTargetEmail] = React.useState('alex.developer@company.com')
  const [selectedClient, setSelectedClient] = React.useState<ClientOption>('all')
  const [isSendingTest, setIsSendingTest] = React.useState(false)
  const [testSentSuccess, setTestSentSuccess] = React.useState(false)

  // Schedule Broadcast Dialog state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false)
  const [scheduleTiming, setScheduleTiming] = React.useState<ScheduleTiming>('optimal')
  const [isScheduling, setIsScheduling] = React.useState(false)
  const [scheduleSuccess, setScheduleSuccess] = React.useState(false)

  const currentAudience = React.useMemo(() => {
    return audienceOptions.find((item) => item.id === selectedAudience) ?? audienceOptions[0]
  }, [selectedAudience])

  const currentActiveSubject = React.useMemo(() => {
    if (isAbTestEnabled && activePreviewVariant === 'B') {
      return subjectB
    }
    return subjectA
  }, [isAbTestEnabled, activePreviewVariant, subjectA, subjectB])

  const emojiCount = React.useMemo(() => {
    const matches = currentActiveSubject.match(/\p{Extended_Pictographic}/gu)
    return matches ? matches.length : 0
  }, [currentActiveSubject])

  const applyAiSubject = (text: string) => {
    if (isAbTestEnabled && activePreviewVariant === 'B') {
      setSubjectB(text)
    } else {
      setSubjectA(text)
    }
  }

  const handleSendTest = () => {
    if (!testTargetEmail) return
    setIsSendingTest(true)
    setTestSentSuccess(false)

    setTimeout(() => {
      setIsSendingTest(false)
      setTestSentSuccess(true)
      setTimeout(() => {
        setTestSentSuccess(false)
        setIsTestModalOpen(false)
      }, 1800)
    }, 800)
  }

  const handleScheduleBroadcast = () => {
    setIsScheduling(true)
    setScheduleSuccess(false)

    setTimeout(() => {
      setIsScheduling(false)
      setScheduleSuccess(true)
      setTimeout(() => {
        setScheduleSuccess(false)
        setIsScheduleModalOpen(false)
      }, 1800)
    }, 900)
  }

  return (
    <div data-slot="email-campaign-composer" className={cn('w-full space-y-6', className)}>
      {/* Top Header Bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Campaign Title & Status Badge */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg shadow-xs">
                  <Mail className="size-4" />
                </div>
                <h2 className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">{campaignName}</h2>
                {/* Status Badge: Blue info styled */}
                <Badge
                  variant="outline"
                  className="gap-1.5 border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600 dark:text-sky-400"
                >
                  <span className="size-1.5 rounded-full bg-sky-500" />
                  <span>Draft Saved · {currentAudience.formattedCount} Recipients</span>
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Configure campaign targeting, optimize open rates with AI scoring, and preview live multi-device inbox
                rendering.
              </p>
            </div>

            {/* Top Actions: Send Test Proof & Schedule Broadcast */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Send Test Proof Dialog */}
              <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
                    <Mail className="text-muted-foreground size-3.5" />
                    <span>Send Test Proof</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                      <Mail className="text-primary size-4" />
                      Dispatch Test Proof
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Send a full fidelity rendering test to inspect subject line, preheader, and layout across email
                      clients.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-xs font-medium">Proof Recipient Address</label>
                      <Input
                        value={testTargetEmail}
                        onChange={(e) => setTestTargetEmail(e.target.value)}
                        type="email"
                        placeholder="alex.developer@company.com"
                        className="text-xs"
                        disabled={isSendingTest}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-xs font-medium">
                        Email Client Engine Simulation
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'all' ? 'default' : 'outline'}
                          className="justify-start text-xs font-medium"
                          onClick={() => setSelectedClient('all')}
                        >
                          🌐 All Clients (Auto)
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'gmail' ? 'default' : 'outline'}
                          className="justify-start text-xs font-medium"
                          onClick={() => setSelectedClient('gmail')}
                        >
                          ✉️ Gmail (Web/App)
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'apple' ? 'default' : 'outline'}
                          className="justify-start text-xs font-medium"
                          onClick={() => setSelectedClient('apple')}
                        >
                          🍏 Apple Mail (iOS)
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'outlook' ? 'default' : 'outline'}
                          className="justify-start text-xs font-medium"
                          onClick={() => setSelectedClient('outlook')}
                        >
                          💼 Outlook 365
                        </Button>
                      </div>
                    </div>

                    {testSentSuccess && (
                      <div className="border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-md border p-2.5 text-xs font-medium">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>Test proof dispatched to {testTargetEmail}!</span>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSendingTest}
                      onClick={() => setIsTestModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" className="gap-1.5" disabled={isSendingTest} onClick={handleSendTest}>
                      <Send className="size-3.5" />
                      <span>{isSendingTest ? 'Dispatching...' : 'Send Test Proof'}</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Schedule Broadcast Dialog */}
              <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 text-xs font-medium shadow-xs">
                    <Send className="size-3.5 fill-current" />
                    <span>Schedule Broadcast</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                      <Calendar className="text-primary size-4" />
                      Schedule Email Broadcast
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Queue this broadcast for {currentAudience.count.toLocaleString()} verified subscribers with
                      deliverability rate limit guardrails.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between">
                        <span className="text-muted-foreground">Audience Target</span>
                        <span className="text-foreground font-medium">{currentAudience.label}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between">
                        <span className="text-muted-foreground">Estimated Reach</span>
                        <span className="text-foreground font-semibold">
                          {currentAudience.count.toLocaleString()} recipients
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between">
                        <span className="text-muted-foreground">Spam Safety Score</span>
                        <Badge variant="success" className="h-4.5 px-1.5 text-xs font-normal">
                          0.2 / 10.0 (Safe)
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-muted-foreground text-xs font-medium">Broadcast Timing</label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          className={cn(
                            'border-border hover:border-primary/50 flex flex-wrap items-center justify-between rounded-lg border p-3 text-left text-xs transition-colors',
                            scheduleTiming === 'optimal' ? 'border-primary bg-primary/5' : 'bg-card',
                          )}
                          onClick={() => setScheduleTiming('optimal')}
                        >
                          <div className="space-y-0.5">
                            <div className="text-foreground font-medium">✨ AI Optimal Send Time (Recommended)</div>
                            <div className="text-muted-foreground text-xs">
                              Tuesday, Aug 25 @ 9:00 AM EDT (+18% projected opens)
                            </div>
                          </div>
                          <div
                            className={cn(
                              'flex size-4 items-center justify-center rounded-full border',
                              scheduleTiming === 'optimal'
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border',
                            )}
                          >
                            {scheduleTiming === 'optimal' && <div className="size-1.5 rounded-full bg-white" />}
                          </div>
                        </button>

                        <button
                          type="button"
                          className={cn(
                            'border-border hover:border-primary/50 flex flex-wrap items-center justify-between rounded-lg border p-3 text-left text-xs transition-colors',
                            scheduleTiming === 'immediate' ? 'border-primary bg-primary/5' : 'bg-card',
                          )}
                          onClick={() => setScheduleTiming('immediate')}
                        >
                          <div className="space-y-0.5">
                            <div className="text-foreground font-medium">⚡ Send Immediately</div>
                            <div className="text-muted-foreground text-xs">
                              Dispatch immediately with warm-up concurrency pacing
                            </div>
                          </div>
                          <div
                            className={cn(
                              'flex size-4 items-center justify-center rounded-full border',
                              scheduleTiming === 'immediate'
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border',
                            )}
                          >
                            {scheduleTiming === 'immediate' && <div className="size-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      </div>
                    </div>

                    {scheduleSuccess && (
                      <div className="border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-md border p-2.5 text-xs font-medium">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>Broadcast successfully queued for dispatch!</span>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isScheduling}
                      onClick={() => setIsScheduleModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" className="gap-1.5" disabled={isScheduling} onClick={handleScheduleBroadcast}>
                      <Send className="size-3.5" />
                      <span>{isScheduling ? 'Scheduling...' : 'Confirm & Schedule'}</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 2-Column Campaign Studio Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LEFT PANEL: Campaign Setup & Audience (45% -> lg:col-span-5) */}
        <div className="space-y-5 lg:col-span-5">
          {/* 1. Audience Segment Selector Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <Users className="size-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold tracking-tight">Audience Segment</CardTitle>
                </div>
                <Badge variant="secondary" className="h-5 gap-1 px-2 text-xs font-normal">
                  <UserCheck className="size-3 text-emerald-500" />
                  Verified List
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Select subscriber segment to calculate deliverability pacing and personalization tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-0">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Target Segment</label>
                <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                  <SelectTrigger
                    className="h-9 w-full text-xs font-medium [&>span]:truncate [&>svg]:shrink-0"
                    aria-label="Select Audience Segment"
                  >
                    <SelectValue placeholder="Select audience segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceOptions.map((aud) => (
                      <SelectItem key={aud.id} value={aud.id}>
                        <span>{aud.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Audience Telemetry Badges Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="border-border bg-muted/40 rounded-lg border p-2.5 text-center">
                  <div className="text-muted-foreground text-xs font-medium">Recipients</div>
                  <div className="text-foreground mt-0.5 text-sm font-bold tracking-tight">
                    {currentAudience.formattedCount}
                  </div>
                </div>
                <div className="border-border bg-muted/40 rounded-lg border p-2.5 text-center">
                  <div className="text-muted-foreground text-xs font-medium">Avg Open Rate</div>
                  <div className="text-foreground mt-0.5 text-sm font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {currentAudience.openRate}
                  </div>
                </div>
                <div className="border-border bg-muted/40 rounded-lg border p-2.5 text-center">
                  <div className="text-muted-foreground text-xs font-medium">Avg CTR</div>
                  <div className="text-foreground mt-0.5 text-sm font-bold tracking-tight text-sky-600 dark:text-sky-400">
                    {currentAudience.clickRate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Subject Line & AI Optimizer Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <Sparkles className="size-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold tracking-tight">Subject Line & AI Scorer</CardTitle>
                </div>
                {/* AI Subject Scorer Green Badge */}
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 px-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <Sparkles className="size-3 text-emerald-500" />
                  <span>94 / 100 · High Open Rate Impact</span>
                </Badge>
              </div>
              <CardDescription className="text-xs">
                AI predictive heuristic analyzing urgency, sentiment, character count, and spam filter risk.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* A/B Subject Variant Switcher */}
              <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                    <Split className="text-primary size-3.5" />
                    <span>A/B Subject Variant Testing</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Test 2 subject lines with 50/50 subscriber split</p>
                </div>
                <Switch
                  id="react-ab-toggle"
                  checked={isAbTestEnabled}
                  onCheckedChange={(val) => setIsAbTestEnabled(val)}
                />
              </div>

              {/* Subject Input Variant A */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <label className="text-foreground font-medium">
                    Subject Line {isAbTestEnabled ? '(Variant A · 50%)' : ''}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground font-mono text-xs">{subjectA.length}/60 chars</span>
                    <Badge variant="outline" className="text-muted-foreground h-4.5 gap-1 px-1.5 text-xs font-normal">
                      <Flame className="size-2.5 text-amber-500" />
                      <span>{emojiCount} emoji</span>
                    </Badge>
                  </div>
                </div>
                <Input
                  value={subjectA}
                  onChange={(e) => setSubjectA(e.target.value)}
                  className="text-xs"
                  placeholder="Enter campaign subject line..."
                />
              </div>

              {/* Subject Input Variant B (Visible if A/B Enabled) */}
              {isAbTestEnabled && (
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <label className="text-foreground font-medium">Subject Line (Variant B · 50%)</label>
                    <span className="text-muted-foreground font-mono text-xs">{subjectB.length}/60 chars</span>
                  </div>
                  <Input
                    value={subjectB}
                    onChange={(e) => setSubjectB(e.target.value)}
                    className="text-xs"
                    placeholder="Enter alternate subject line B..."
                  />
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      type="button"
                      size="xs"
                      variant={activePreviewVariant === 'A' ? 'default' : 'outline'}
                      className="text-xs font-medium"
                      onClick={() => setActivePreviewVariant('A')}
                    >
                      Preview Variant A
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant={activePreviewVariant === 'B' ? 'default' : 'outline'}
                      className="text-xs font-medium"
                      onClick={() => setActivePreviewVariant('B')}
                    >
                      Preview Variant B
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Subject Score Breakdown Metrics */}
              <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-500" />
                    Sentiment Tone
                  </span>
                  <span className="text-foreground font-medium">Positive (98%)</span>
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-500" />
                    Urgency & Relevance
                  </span>
                  <span className="text-foreground font-medium">High (91%)</span>
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-500" />
                    Spam Keyword Risk
                  </span>
                  <span className="text-foreground font-medium text-emerald-600 dark:text-emerald-400">
                    Very Low (0.1%)
                  </span>
                </div>
              </div>

              {/* 1-Click AI Subject Line Suggestions */}
              <div className="space-y-2">
                <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                  <Sparkles className="text-primary size-3" />
                  AI Optimization Suggestions (Click to apply):
                </span>
                <div className="space-y-1.5">
                  {aiSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="border-border hover:border-primary/40 hover:bg-muted/50 flex w-full items-center justify-between rounded-md border p-2 text-left text-xs transition-colors"
                      onClick={() => applyAiSubject(suggestion.text)}
                    >
                      <span className="text-foreground truncate font-medium">{suggestion.text}</span>
                      <Badge
                        variant="secondary"
                        className="ml-2 shrink-0 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        {suggestion.score}/100
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 3. Preview Text / Preheader */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <label className="text-foreground font-medium">Preview Text / Preheader</label>
                  <span className="text-muted-foreground font-mono text-xs">{previewText.length}/90 chars</span>
                </div>
                <Input
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="text-xs"
                  placeholder="Secondary snippet displayed in subscriber inbox lists..."
                />
              </div>

              <Separator />

              {/* 4. Sender Identity */}
              <div className="space-y-3">
                <label className="text-foreground text-xs font-medium">Sender Identity</label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">Sender Display Name</span>
                    <Input defaultValue={senderName} className="text-xs" placeholder="UIPKGE Team" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">From Address</span>
                    <Input defaultValue={senderEmail} className="text-xs" placeholder="updates@uipkge.dev" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 shrink-0" />
                    <span>
                      Domain verified: <strong>mail.uipkge.dev</strong> (SPF & DKIM valid)
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="h-4.5 border-emerald-500/30 px-1.5 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    TLS 1.3
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: Live Multi-Device Email Preview (55% -> lg:col-span-7) */}
        <div className="space-y-5 lg:col-span-7">
          {/* Live Email Canvas Container Card */}
          <Card className="border-border bg-card overflow-hidden shadow-xs">
            <CardHeader className="border-border bg-muted/20 border-b pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="text-primary size-4" />
                  <CardTitle className="text-sm font-semibold tracking-tight">Live Newsletter Preview</CardTitle>
                  {isAbTestEnabled && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      Showing Variant {activePreviewVariant}
                    </Badge>
                  )}
                </div>

                {/* Device Viewport Toggle (Desktop 600px vs Mobile 375px) */}
                <div className="bg-muted border-border inline-flex items-center rounded-lg border p-1 shadow-xs">
                  <Button
                    type="button"
                    size="xs"
                    variant={viewport === 'desktop' ? 'default' : 'ghost'}
                    className="gap-1.5 text-xs font-medium"
                    onClick={() => setViewport('desktop')}
                  >
                    <Monitor className="size-3.5" />
                    <span>Desktop 600px</span>
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant={viewport === 'mobile' ? 'default' : 'ghost'}
                    className="gap-1.5 text-xs font-medium"
                    onClick={() => setViewport('mobile')}
                  >
                    <Smartphone className="size-3.5" />
                    <span>Mobile 375px</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Rendered Newsletter Preview Canvas */}
            <CardContent className="bg-muted/30 flex min-h-[580px] flex-col items-center justify-start p-4 sm:p-6">
              <div
                className={cn(
                  'w-full transition-[max-width] duration-300 ease-in-out',
                  viewport === 'desktop' ? 'max-w-[580px]' : 'max-w-[360px]',
                )}
              >
                {/* Window Chrome Bar Frame */}
                <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
                  {/* Top Chrome Bar */}
                  <div className="border-border bg-muted/60 flex flex-wrap items-center justify-between border-b px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-red-500/80" />
                      <div className="size-2.5 rounded-full bg-amber-500/80" />
                      <div className="size-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                      <Inbox className="size-3" />
                      <span>UIPKGE Preview · {viewport === 'desktop' ? '600px' : '375px'}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground h-4.5 gap-1 px-1.5 text-xs font-normal"
                    >
                      <Lock className="size-2.5 text-emerald-500" />
                      TLS 1.3
                    </Badge>
                  </div>

                  {/* Envelope Metadata Readout */}
                  <div className="border-border bg-card/70 space-y-2 border-b p-4 text-xs">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full font-bold">
                          U
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground font-semibold">{senderName}</span>
                            <span className="text-muted-foreground">&lt;{senderEmail}&gt;</span>
                          </div>
                          <div className="text-muted-foreground text-xs">To: alex.developer@enterprise.com</div>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-xs">Aug 21, 2026</span>
                    </div>

                    <div className="space-y-0.5 pt-1">
                      <div className="text-foreground text-sm font-semibold tracking-tight">{currentActiveSubject}</div>
                      <div className="text-muted-foreground line-clamp-1 text-xs">{previewText}</div>
                    </div>
                  </div>

                  {/* High-Fidelity Rendered Email Newsletter Body */}
                  <div className="bg-card space-y-5 p-5 sm:p-7">
                    {/* Logo Banner */}
                    <div className="border-border flex flex-wrap items-center justify-between border-b pb-3.5">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                          <Zap className="size-3.5 fill-current" />
                        </div>
                        <span className="text-foreground text-sm font-bold tracking-tight">UIPKGE</span>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium">
                        Changelog #24 · Release 2.0
                      </Badge>
                    </div>

                    {/* Hero Headline & Description */}
                    <div className="space-y-2.5">
                      <Badge
                        variant="outline"
                        className="text-primary border-primary/30 text-xs font-semibold tracking-wider uppercase"
                      >
                        Major Product Release
                      </Badge>
                      <h3 className="text-foreground text-xl leading-tight font-bold tracking-tight sm:text-2xl">
                        Ship polished UIs in minutes
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                        We completely rebuilt the registry engine. 370+ production components with zero npm
                        dependencies, 100% code ownership, and full native support for Vue 3 and React with modern OKLCH
                        tokens.
                      </p>
                    </div>

                    {/* Product Visual with Code Snippet & Callout Pills */}
                    <div className="border-border bg-muted/40 overflow-hidden rounded-lg border">
                      <div className="border-border bg-muted/60 flex flex-wrap items-center justify-between border-b px-3.5 py-2">
                        <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                          <Terminal className="text-primary size-3" />
                          <span>components/ui/button.tsx</span>
                        </div>
                        <span className="font-mono text-xs font-medium text-emerald-500">TypeScript</span>
                      </div>
                      <div className="space-y-3 p-3.5">
                        <div className="border-border bg-background text-muted-foreground rounded-md border p-2.5 font-mono text-xs">
                          <span className="text-primary font-semibold">$</span> npx shadcn add @uipkge/button
                        </div>

                        {/* Mini Interactive UI Demo inside Email */}
                        <div className="bg-card border-border flex flex-wrap items-center justify-center gap-2 rounded-md border p-3">
                          <Button size="xs" variant="default">
                            Primary
                          </Button>
                          <Button size="xs" variant="secondary">
                            Secondary
                          </Button>
                          <Button size="xs" variant="outline">
                            Outline
                          </Button>
                          <Button size="xs" variant="destructive">
                            Destructive
                          </Button>
                        </div>

                        {/* 3 Callout Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                          <Badge variant="secondary" className="text-xs font-normal">
                            ⚡ Zero npm dependencies
                          </Badge>
                          <Badge variant="secondary" className="text-xs font-normal">
                            🎨 OKLCH Dark Mode
                          </Badge>
                          <Badge variant="secondary" className="text-xs font-normal">
                            🧩 Vue 3 + React Parity
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Primary CTA Button */}
                    <div className="flex flex-col items-center justify-center space-y-2 pt-1 text-center">
                      <Button size="lg" className="w-full px-8 font-semibold shadow-xs sm:w-auto">
                        <span>Explore Components</span>
                        <ArrowRight className="ml-1 size-4" />
                      </Button>
                      <p className="text-muted-foreground text-xs">
                        Free & Open Source · MIT License · 370+ Primitives & Blocks
                      </p>
                    </div>

                    <Separator />

                    {/* Unsubscribe & Footer Details */}
                    <div className="text-muted-foreground space-y-2.5 pt-1 text-center text-xs">
                      <div className="flex flex-wrap items-center justify-center gap-3 font-medium">
                        <span className="hover:text-foreground cursor-pointer transition-colors">Documentation</span>
                        <span>·</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">GitHub</span>
                        <span>·</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">Discord</span>
                        <span>·</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">Preferences</span>
                      </div>
                      <p className="text-xs">UIPKGE Inc. · 548 Market St, Suite 29314, San Francisco, CA 94104</p>
                      <p className="text-xs">
                        You received this email because you subscribed to UIPKGE updates.
                        <span className="hover:text-foreground cursor-pointer underline">
                          {' '}
                          Unsubscribe anytime (RFC 8058)
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deliverability & Inbox Placement Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold tracking-tight">
                    Deliverability & Inbox Placement Scorecard
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="h-5 border-emerald-500/30 px-2 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  99.8% Inbox Probability
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Heuristic spam risk evaluation, DNS authentication compliance, and subscriber engagement telemetry.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* 3 Core Scorecard Metrics */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Metric 1: Spam Score */}
                <div className="border-border bg-muted/30 rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <span className="text-muted-foreground">Spam Score</span>
                    <Badge variant="success" className="h-4.5 px-1 text-xs">
                      Optimal
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">0.2</span>
                    <span className="text-muted-foreground text-xs">/ 10.0</span>
                  </div>
                  <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
                    <div className="h-full w-[98%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Metric 2: Domain Auth */}
                <div className="border-border bg-muted/30 rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <span className="text-muted-foreground">Auth Headers</span>
                    <Badge variant="success" className="h-4.5 px-1 text-xs">
                      100% Pass
                    </Badge>
                  </div>
                  <div className="mt-1 space-y-0.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SPF / DKIM</span>
                      <span className="text-foreground font-medium">Valid (2048-bit)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DMARC</span>
                      <span className="text-foreground font-medium">p=reject</span>
                    </div>
                  </div>
                </div>

                {/* Metric 3: Reading Time */}
                <div className="border-border bg-muted/30 rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <span className="text-muted-foreground">Reading Time</span>
                    <span className="text-foreground font-mono font-medium">185 words</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-foreground text-xl font-bold tracking-tight">45</span>
                    <span className="text-muted-foreground text-xs">seconds</span>
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">Payload size: 14.2 KB (Safe)</div>
                </div>
              </div>

              {/* Detailed Checklist Row */}
              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div className="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    Primary Tab Placement
                  </span>
                  <span className="text-foreground font-medium">99.8% (Gmail / Apple)</span>
                </div>
                <div className="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    RFC 8058 One-Click
                  </span>
                  <span className="text-foreground font-medium">Compliant</span>
                </div>
                <div className="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    Dark Mode Contrast
                  </span>
                  <span className="text-foreground font-medium">100% WCAG AAA</span>
                </div>
                <div className="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    HTTPS Asset Links
                  </span>
                  <span className="text-foreground font-medium">6 Valid Links</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EmailCampaignComposer
