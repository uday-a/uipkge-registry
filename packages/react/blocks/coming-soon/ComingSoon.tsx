'use client'

import * as React from 'react'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface ComingSoonProps {
  targetIso?: string
  statusUrl?: string
  productVersion?: string
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

interface Milestone {
  id: string
  title: string
  category: string
  status: 'completed' | 'in_progress' | 'scheduled'
  completionPercent: number
  date: string
}

const initialMilestones: Milestone[] = [
  {
    id: 'm1',
    title: 'Dual-Framework Compiler & Monorepo Architecture',
    category: 'Core Infra',
    status: 'completed',
    completionPercent: 100,
    date: 'Aug 15, 2026',
  },
  {
    id: 'm2',
    title: 'Tailwind CSS v4 OKLCH Dynamic Theming Engine',
    category: 'Design System',
    status: 'completed',
    completionPercent: 100,
    date: 'Aug 18, 2026',
  },
  {
    id: 'm3',
    title: 'Zero-Lockin Code Distribution Registry & CLI',
    category: 'DX & Tooling',
    status: 'completed',
    completionPercent: 100,
    date: 'Aug 21, 2026',
  },
  {
    id: 'm4',
    title: 'Multi-Region Edge Registry Cache & Global SLA Testing',
    category: 'Infrastructure',
    status: 'in_progress',
    completionPercent: 88,
    date: 'Target: 3 Days',
  },
  {
    id: 'm5',
    title: 'Public V2.0 Global General Availability Rollout',
    category: 'Release',
    status: 'scheduled',
    completionPercent: 0,
    date: 'Target: 7 Days',
  },
]

interface FeatureTeaser {
  id: string
  badge: string
  title: string
  description: string
  icon: React.ElementType
  statLabel: string
  statValue: string
  codeSnippet: string
}

const teasers: FeatureTeaser[] = [
  {
    id: 'agentic',
    badge: 'Flagship AI',
    title: 'Autonomous Multi-Agent Orchestrator',
    description: 'Decompose complex workflow DAGs into parallel subagent execution with real-time vector memory.',
    icon: Bot,
    statLabel: 'DAG Execution Speed',
    statValue: '120ms P99',
    codeSnippet: 'npx shadcn-vue@latest add @uipkge/ai-agent-orchestrator',
  },
  {
    id: 'design',
    badge: 'Design Engineering',
    title: 'Tailwind v4 OKLCH Fluid Theme Tokens',
    description: 'Perceptually uniform color spaces with automatic high-contrast dark mode switching & zero CSS bloat.',
    icon: Sparkles,
    statLabel: 'Bundle Size Overhead',
    statValue: '0.00 kB',
    codeSnippet: 'npx shadcn-vue@latest add @uipkge/theme-customize',
  },
  {
    id: 'edge',
    badge: 'Ultra Low Latency',
    title: 'Cloudflare Workers Multi-Region Cache',
    description: 'Global component manifest resolution with smart geo-routing and edge-cached JSON trees.',
    icon: Zap,
    statLabel: 'Global Median Latency',
    statValue: '8.4ms',
    codeSnippet: 'curl -s https://uipkge.dev/r/vue/init.json',
  },
]

export function ComingSoon({
  targetIso = '',
  statusUrl = 'https://status.uipkge.dev',
  productVersion = 'v2.0 Beta',
}: ComingSoonProps) {
  const [remaining, setRemaining] = React.useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [activeTeaserIndex, setActiveTeaserIndex] = React.useState(0)

  // Waitlist Form State
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState<'frontend' | 'architect' | 'founder'>('frontend')
  const [submitted, setSubmitted] = React.useState(false)
  const [queuePosition, setQueuePosition] = React.useState<number | null>(null)
  const [copiedReferral, setCopiedReferral] = React.useState(false)
  const [copiedCli, setCopiedCli] = React.useState(false)

  // Countdown timer logic
  React.useEffect(() => {
    const deadline = targetIso ? new Date(targetIso).getTime() : Date.now() + 7 * 24 * 60 * 60 * 1000

    function tick() {
      const diff = Math.max(0, deadline - Date.now())
      setRemaining({
        days: pad(Math.floor(diff / 86_400_000)),
        hours: pad(Math.floor((diff % 86_400_000) / 3_600_000)),
        minutes: pad(Math.floor((diff % 3_600_000) / 60_000)),
        seconds: pad(Math.floor((diff % 60_000) / 1000)),
      })
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [targetIso])

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Simulated VIP queue calculation
    const randomPos = Math.floor(Math.random() * 80) + 120
    setQueuePosition(randomPos)
    setSubmitted(true)
  }

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://uipkge.dev/invite?ref=queue_${queuePosition}`)
    setCopiedReferral(true)
    setTimeout(() => setCopiedReferral(false), 2000)
  }

  const copyTeaserSnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet)
    setCopiedCli(true)
    setTimeout(() => setCopiedCli(false), 2000)
  }

  const units = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds },
  ]

  const overallReadiness = Math.round(
    initialMilestones.reduce((acc, m) => acc + m.completionPercent, 0) / initialMilestones.length,
  )

  return (
    <section
      data-slot="coming-soon"
      className="bg-background relative flex min-h-screen flex-col justify-between overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Background Decorative Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 top-[-10%] left-1/2 size-[750px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      {/* Top Telemetry & Status Bar */}
      <div className="border-border/70 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-b pb-12 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl font-bold shadow-xs">
            <Rocket className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold tracking-tight">UIPKGE Engine</span>
              <Badge variant="outline" className="border-primary/30 text-primary px-1.5 py-0.5 font-mono text-xs">
                {productVersion}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">Dual-framework registry & visual workbench suite</p>
          </div>
        </div>

        {/* Global SLA Readiness Pill */}
        <div className="bg-muted/40 border-border flex items-center gap-3 rounded-full border px-3.5 py-1.5">
          <div className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-muted-foreground font-mono text-xs">
            Staging Infrastructure: <strong className="text-foreground font-semibold">99.99% Operational</strong>
          </span>
          <Separator orientation="vertical" className="h-3.5" />
          <a
            href={statusUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary inline-flex items-center gap-1 font-mono text-xs hover:underline"
          >
            Live Status <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>

      {/* Main Hero & Countdown Body */}
      <div className="mx-auto my-auto w-full max-w-6xl space-y-16 py-10">
        {/* Headline & Subtitle */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Sparkles className="text-primary size-3.5" />
            V2.0 General Availability Launch Matrix
          </Badge>
          <h1 className="text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Production-grade design engineering workbenches.
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
            We are deploying 281+ production-grade primitives and composed workbenches with zero package dependencies.
            Own your source code with complete architectural freedom.
          </p>
        </div>

        {/* High-Impact Digital Countdown Grid */}
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {units.map((unit) => (
            <Card
              key={unit.label}
              className="border-border bg-card/70 group hover:border-primary/40 relative overflow-hidden p-5 text-center shadow-xs backdrop-blur-xs transition-colors"
            >
              <div className="text-foreground font-mono text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                {unit.value}
              </div>
              <div className="text-muted-foreground mt-2 font-mono text-xs font-medium tracking-widest uppercase">
                {unit.label}
              </div>
              <div className="bg-primary/20 group-hover:bg-primary absolute right-0 bottom-0 left-0 h-0.5 transition-colors" />
            </Card>
          ))}
        </div>

        {/* Early Access & Queue Tracker Section */}
        <div className="mx-auto w-full max-w-xl">
          <Card className="border-border bg-card overflow-hidden shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ShieldCheck className="text-primary size-4" />
                  Early Access Allocation
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  Batch #2 Opening Soon
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Request priority invite access. Get instant sandbox access to all 281+ blocks before general public
                launch.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!submitted ? (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  {/* Role Selector Tabs */}
                  <div className="space-y-1.5">
                    <label className="text-foreground text-xs font-medium">Your Primary Engineering Focus</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'frontend', label: 'Frontend / UI' },
                        { id: 'architect', label: 'Tech Lead / Arch' },
                        { id: 'founder', label: 'CTO / Founder' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className={cn(
                            'rounded-lg border px-2.5 py-1.5 text-center text-xs font-medium transition-all',
                            role === r.id
                              ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                              : 'border-border bg-background text-muted-foreground hover:text-foreground',
                          )}
                          onClick={() => setRole(r.id as any)}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Input & Submit */}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-10 font-mono text-xs"
                      />
                    </div>
                    <Button type="submit" className="h-10 gap-1.5 px-5 text-xs font-semibold">
                      <span>Reserve Spot</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-center text-xs">
                    No spam. You will only receive your single cryptographic invite token.
                  </p>
                </form>
              ) : (
                <div className="bg-muted/40 border-border space-y-4 rounded-xl border p-4 text-center">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <Check className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground text-sm font-semibold">You are #{queuePosition} in queue!</p>
                    <p className="text-muted-foreground text-xs">
                      Invitation tokens for Batch #2 will be delivered to{' '}
                      <strong className="text-foreground font-mono">{email}</strong>.
                    </p>
                  </div>

                  <div className="border-border flex flex-col items-center justify-between gap-3 border-t pt-2 sm:flex-row">
                    <span className="text-muted-foreground font-mono text-xs">
                      Move up 5 spots per teammate invite:
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 font-mono text-xs"
                      onClick={copyReferral}
                    >
                      {copiedReferral ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      <span>{copiedReferral ? 'Copied Link' : 'Copy Invite Link'}</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interactive Feature Sneak-Peek Carousel & Terminal Preview */}
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Zap className="text-primary size-4" />
                Incoming Flagship Capabilities
              </h2>
              <p className="text-muted-foreground text-xs">Sneak peek preview of the upcoming architecture release</p>
            </div>

            {/* Teaser Navigation Tabs */}
            <div className="bg-muted/40 border-border flex items-center gap-1.5 rounded-lg border p-1">
              {teasers.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium transition-all',
                    activeTeaserIndex === idx
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setActiveTeaserIndex(idx)}
                >
                  {t.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Active Teaser Card */}
          {(() => {
            const active = teasers[activeTeaserIndex]
            const Icon = active.icon
            return (
              <Card className="border-border bg-card overflow-hidden">
                <div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                  <div className="space-y-4 p-6 sm:p-8 lg:col-span-7">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-primary/10 text-primary rounded-lg p-2">
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {active.badge}
                      </Badge>
                    </div>

                    <h3 className="text-foreground text-xl font-bold tracking-tight">{active.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">{active.description}</p>

                    <div className="flex items-center gap-6 pt-2">
                      <div>
                        <p className="text-muted-foreground font-mono text-xs">{active.statLabel}</p>
                        <p className="text-foreground mt-0.5 font-mono text-xl font-bold">{active.statValue}</p>
                      </div>
                      <Separator orientation="vertical" className="h-8" />
                      <div>
                        <p className="text-muted-foreground font-mono text-xs">Framework Support</p>
                        <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Vue 3.5 & React 19 Parity
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Snippet Box */}
                  <div className="bg-muted/20 flex flex-col justify-between space-y-4 p-6 lg:col-span-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs font-medium">
                          <Terminal className="size-3.5" /> Direct CLI Command
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1.5 px-2 font-mono text-xs"
                          onClick={() => copyTeaserSnippet(active.codeSnippet)}
                        >
                          {copiedCli ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                          <span>{copiedCli ? 'Copied' : 'Copy'}</span>
                        </Button>
                      </div>
                      <div className="bg-background border-border text-foreground selection:bg-primary/20 overflow-x-auto rounded-lg border p-3 font-mono text-xs">
                        <code>{active.codeSnippet}</code>
                      </div>
                    </div>

                    <div className="border-border/80 bg-background/50 text-muted-foreground flex items-center gap-2 rounded-lg border p-3 text-xs">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      <span>Transitive dependencies, OKLCH styles & TS types included.</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })()}
        </div>

        {/* Launch Readiness Milestones Tracker */}
        <div className="border-border/70 space-y-6 border-t pt-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Activity className="text-primary size-4" />
                V2.0 Launch Milestones & Engineering Progress
              </h2>
              <p className="text-muted-foreground text-xs">Transparent real-time build and release status</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-foreground font-mono text-xs font-semibold">
                Overall Readiness: {overallReadiness}%
              </span>
              <Progress value={overallReadiness} className="h-2 w-28" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {initialMilestones.map((m) => (
              <div
                key={m.id}
                className="border-border bg-card hover:border-primary/30 flex flex-col justify-between space-y-3 rounded-xl border p-4 shadow-xs transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'px-2 py-0.5 font-mono text-xs',
                      m.status === 'completed' &&
                        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                      m.status === 'in_progress' &&
                        'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                      m.status === 'scheduled' && 'bg-muted text-muted-foreground border-border',
                    )}
                  >
                    {m.status === 'completed' ? 'Completed' : m.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                  </Badge>
                  <span className="text-muted-foreground font-mono text-xs">{m.date}</span>
                </div>

                <div>
                  <p className="text-foreground text-xs leading-snug font-semibold">{m.title}</p>
                  <p className="text-muted-foreground mt-1 font-mono text-xs">{m.category}</p>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-muted-foreground flex justify-between font-mono text-xs">
                    <span>Progress</span>
                    <span>{m.completionPercent}%</span>
                  </div>
                  <Progress value={m.completionPercent} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-border text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} UIPKGE. Open source under MIT License.</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/uday-a/uipkge"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <Separator orientation="vertical" className="h-3" />
          <a
            href="https://uipkge.dev"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Registry Docs
          </a>
          <Separator orientation="vertical" className="h-3" />
          <a href={statusUrl} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            Status Page
          </a>
        </div>
      </footer>
    </section>
  )
}
export default ComingSoon
